import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
from app.api.routes import admin, leads, monitoring, payment, quotes, vendors, zoho, vendor_auth
from app.core.config import settings
from app.core.database import engine, Base
from app.services.sheets_monitor_service import sheets_monitor_service

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting MovedIn 2.0 Backend...")
    print(f"📊 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"🌐 Allowed Origins: {os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173')}")
    
    # AUTOMATIC CACHE REFRESH ON STARTUP
    print("🔄 Refreshing all caches on startup...")
    try:
        from app.services.dispatcher_cache_service import dispatcher_cache_service
        from app.services.google_sheets_service import google_sheets_service
        from app.core.database import get_db
        
        # Clear all caches
        dispatcher_cache_service.clear_all_cache()
        google_sheets_service.refresh_all_data()
        
        # Force cache invalidation
        dispatcher_cache_service.force_cache_invalidation()
        google_sheets_service.force_cache_invalidation()
        
        print("✅ All caches refreshed successfully")
    except Exception as e:
        print(f"⚠️ Cache refresh warning: {e}")
    
    # Start background tasks
    # Initialize sheets monitor service (background tasks will start automatically)
    sheets_monitor_service
    
    yield
    
    # Shutdown
    print("🛑 Shutting down MovedIn 2.0 Backend...")

app = FastAPI(
    title="MovedIn 2.0 API",
    description="Modern moving quote platform API",
    version="2.0.0",
    lifespan=lifespan
)

# Environment-based CORS configuration
ALLOWED_ORIGINS = settings.allowed_origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(quotes.router, prefix="/api")
app.include_router(leads.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(admin.router, prefix="/admin")
app.include_router(vendors.router, prefix="/vendors")
app.include_router(vendor_auth.router, prefix="/vendor")
app.include_router(monitoring.router, prefix="/monitoring")
app.include_router(zoho.router, prefix="/api/zoho")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2025-01-15T10:00:00Z",
        "version": "2.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "MovedIn 2.0 API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    ) # Manual deployment trigger - Sun Aug  3 17:41:40 EDT 2025
