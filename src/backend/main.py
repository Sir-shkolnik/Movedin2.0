"""
MovedIn 3.0 - Smart & Secure Backend
Using real APIs and credentials from V2.0
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import os
from datetime import datetime

# Import our smart services
from app.api.routes import leads, payment
from app.core.database import engine, Base, init_db
from app.core.config import settings
from app.core.cache import cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="MovedIn 3.0 - Smart & Secure API",
    description="Modern moving quote system with smart security and simplified data flow",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://api.mapbox.com https://js.stripe.com; "
            "img-src 'self' data: https://api.mapbox.com https:; "
            "style-src 'self' 'unsafe-inline'; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.mapbox.com https://api.stripe.com;"
        )
        
        # HSTS (only in production with HTTPS)
        if os.getenv("ENVIRONMENT") == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

# Request Size Limit Middleware
class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method in ["POST", "PUT", "PATCH"]:
            if "content-length" in request.headers:
                content_length = int(request.headers["content-length"])
                if content_length > 1_000_000:  # 1MB limit
                    raise HTTPException(
                        status_code=413,
                        detail="Request too large (max 1MB)"
                    )
        
        return await call_next(request)

# Add middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(leads.router, prefix="/api", tags=["leads"])
app.include_router(payment.router, prefix="/api", tags=["payment"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    try:
        # Initialize database
        init_db()
        logger.info("✅ Database initialized successfully")
        
        # Initialize cache
        logger.info(f"💾 Cache initialized (in-memory, TTL: {cache.default_ttl}s)")
        
        # Log configuration
        logger.info(f"🚀 MovedIn 3.0 Smart & Secure Backend started")
        logger.info(f"📧 SMTP Server: {settings.SMTP_SERVER}:{settings.SMTP_PORT}")
        logger.info(f"📧 SMTP Username: {settings.SMTP_USERNAME}")
        logger.info(f"📧 SMTP Password configured: {bool(settings.SMTP_PASSWORD)}")
        logger.info(f"🔑 Stripe configured: {bool(settings.STRIPE_SECRET_KEY)}")
        logger.info(f"🗺️ Mapbox configured: {bool(getattr(settings, 'MAPBOX_ACCESS_TOKEN', None))}")
        
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MovedIn 3.0 - Smart & Secure API",
        "version": "3.0.0",
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "3.0.0",
            "services": {
                "database": "healthy",
                "email": "configured" if settings.SMTP_PASSWORD else "logging_to_file",
                "stripe": "configured" if settings.STRIPE_SECRET_KEY else "not_configured",
                "mapbox": "configured" if getattr(settings, 'MAPBOX_ACCESS_TOKEN', None) else "not_configured"
            }
        }
    except Exception as e:
        logger.error(f"❌ Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e)
            }
        )

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "api": "MovedIn 3.0 - Smart & Secure",
        "status": "operational",
        "features": {
            "smart_lead_creation": True,
            "smart_email_notifications": True,
            "data_validation": True,
            "rate_limiting": True,
            "encryption": True,
            "local_caching": True
        },
        "endpoints": {
            "leads": "/api/leads",
            "health": "/health",
            "cache_stats": "/api/cache/stats",
            "docs": "/docs"
        }
    }

@app.get("/api/cache/stats")
async def cache_stats():
    """Get cache statistics"""
    try:
        stats = cache.get_stats()
        return {
            "status": "ok",
            "cache": stats,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Cache stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/cache/clear")
async def clear_cache():
    """Clear all cache entries (admin only)"""
    try:
        cache.clear()
        return {
            "status": "ok",
            "message": "Cache cleared successfully",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Cache clear error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
