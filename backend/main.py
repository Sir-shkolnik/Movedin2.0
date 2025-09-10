import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
from app.api.routes import admin, leads, monitoring, payment, quotes, vendors, zoho, vendor_auth, email_test
from app.api.routes import payment_simple
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
    
    # Start 24-hour data refresh system
    import asyncio
    import threading
    import time
    from datetime import datetime, timedelta
    
    def refresh_data_every_24_hours():
        """Background task to refresh Google Sheets data every 24 hours"""
        while True:
            try:
                # Wait 24 hours (86400 seconds)
                time.sleep(86400)
                
                print(f"🔄 24-Hour Data Refresh: {datetime.now()}")
                
                # Refresh Google Sheets data
                from app.services.google_sheets_service import google_sheets_service
                from app.services.dispatcher_cache_service import dispatcher_cache_service
                
                # Clear all caches
                dispatcher_cache_service.clear_all_cache()
                google_sheets_service.refresh_all_data()
                
                # Force cache invalidation
                dispatcher_cache_service.force_cache_invalidation()
                google_sheets_service.force_cache_invalidation()
                
                print("✅ 24-Hour data refresh completed successfully")
                
            except Exception as e:
                print(f"❌ 24-Hour data refresh failed: {e}")
                import traceback
                traceback.print_exc()
    
    # Start the background refresh thread
    refresh_thread = threading.Thread(target=refresh_data_every_24_hours, daemon=True)
    refresh_thread.start()
    print("🔄 24-Hour data refresh system started")
    
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

# Debug payment router import
try:
    print("🔧 Loading payment router...")
    print(f"🔧 Payment router object: {payment}")
    print(f"🔧 Payment router type: {type(payment)}")
    app.include_router(payment.router, prefix="/api")
    print("✅ Payment router loaded successfully")
except Exception as e:
    print(f"❌ Error loading payment router: {e}")
    import traceback
    traceback.print_exc()
    # Try to import payment module directly
    try:
        print("🔧 Trying direct import...")
        import app.api.routes.payment as payment_module
        print(f"🔧 Payment module: {payment_module}")
        app.include_router(payment_module.router, prefix="/api")
        print("✅ Payment router loaded via direct import")
    except Exception as e2:
        print(f"❌ Direct import also failed: {e2}")
        traceback.print_exc()

# Try simple payment router
try:
    print("🔧 Loading simple payment router...")
    app.include_router(payment_simple.router, prefix="/api/payment-simple")
    print("✅ Simple payment router loaded successfully")
except Exception as e:
    print(f"❌ Simple payment router failed: {e}")

app.include_router(admin.router, prefix="/admin")
app.include_router(vendors.router, prefix="/vendors")
app.include_router(vendor_auth.router, prefix="/vendor")
app.include_router(monitoring.router, prefix="/monitoring")
app.include_router(zoho.router, prefix="/api/zoho")
app.include_router(email_test.router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2025-01-15T10:00:00Z",
        "version": "2.4.0"
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
