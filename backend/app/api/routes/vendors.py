from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.vendor import Vendor, Dispatcher
from app.services.dispatcher_cache_service import dispatcher_cache_service
from app.services.google_sheets_service import google_sheets_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_vendors(db: Session = Depends(get_db)):
    """Get all vendors"""
    vendors = db.query(Vendor).filter(Vendor.is_active == True).all()
    return [
        {
            "id": vendor.id,
            "name": vendor.name,
            "slug": vendor.slug,
            "display_name": vendor.display_name,
            "logo_url": vendor.logo_url,
            "vendor_type": vendor.vendor_type,
            "coverage_areas": vendor.coverage_areas,
            "is_featured": vendor.is_featured
        }
        for vendor in vendors
    ]

# Google Sheets Integration Endpoints

@router.get("/sheets/dispatchers", response_model=Dict[str, Any])
async def get_all_dispatchers_from_sheets():
    """Get all dispatcher data from Google Sheets"""
    try:
        dispatchers_data = google_sheets_service.get_all_dispatchers_data()
        return {
            "success": True,
            "dispatchers": list(dispatchers_data.keys()),
            "count": len(dispatchers_data),
            "data": dispatchers_data
        }
    except Exception as e:
        logger.error(f"Error fetching dispatchers from sheets: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching dispatchers: {str(e)}")

@router.get("/sheets/dispatchers/{gid}", response_model=Dict[str, Any])
async def get_dispatcher_from_sheets(gid: str):
    """Get specific dispatcher data from Google Sheets by GID"""
    try:
        # Get all dispatchers data and find the specific GID
        all_dispatchers = google_sheets_service.get_all_dispatchers_data()
        dispatcher_data = all_dispatchers.get(gid)
        
        if not dispatcher_data:
            raise HTTPException(status_code=404, detail=f"Dispatcher GID {gid} not found")
        
        return {
            "success": True,
            "gid": gid,
            "data": dispatcher_data
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching dispatcher GID {gid} from sheets: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching dispatcher: {str(e)}")

@router.post("/sheets/cache/refresh", response_model=Dict[str, Any])
async def refresh_dispatcher_cache(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Refresh all dispatcher caches from Google Sheets"""
    try:
        # Run cache refresh in background
        background_tasks.add_task(dispatcher_cache_service.refresh_all_caches, db)
        
        return {
            "success": True,
            "message": "Cache refresh started in background",
            "status": "processing"
        }
    except Exception as e:
        logger.error(f"Error starting cache refresh: {e}")
        raise HTTPException(status_code=500, detail=f"Error starting cache refresh: {str(e)}")

@router.post("/sheets/cache/refresh/{location}", response_model=Dict[str, Any])
async def refresh_dispatcher_cache_location(location: str, db: Session = Depends(get_db)):
    """Refresh cache for a specific dispatcher location"""
    try:
        success = dispatcher_cache_service._update_dispatcher_cache(location, db) is not None
        
        return {
            "success": success,
            "location": location,
            "message": f"Cache refresh {'completed' if success else 'failed'} for {location}"
        }
    except Exception as e:
        logger.error(f"Error refreshing cache for {location}: {e}")
        raise HTTPException(status_code=500, detail=f"Error refreshing cache: {str(e)}")

@router.get("/sheets/cache/status", response_model=Dict[str, Any])
async def get_cache_status():
    """Get cache status for all dispatchers"""
    try:
        status = dispatcher_cache_service.get_cache_status()
        return {
            "success": True,
            "cache_status": status,
            "total_locations": len(status)
        }
    except Exception as e:
        logger.error(f"Error getting cache status: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting cache status: {str(e)}")

@router.get("/sheets/rates/{location}/{date}", response_model=Dict[str, Any])
async def get_daily_rate(location: str, date: str, db: Session = Depends(get_db)):
    """Get daily rate for a specific location and date"""
    try:
        from datetime import datetime
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
        
        rate = dispatcher_cache_service.get_daily_rate(location, target_date, db)
        
        return {
            "success": True,
            "location": location,
            "date": date,
            "rate": rate,
            "found": rate is not None
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error getting daily rate for {location} on {date}: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting daily rate: {str(e)}")

@router.get("/sheets/crew-rates/{location}/{crew_size}", response_model=Dict[str, Any])
async def get_crew_rate(location: str, crew_size: int, db: Session = Depends(get_db)):
    """Get crew rate for a specific location and crew size"""
    try:
        rate = dispatcher_cache_service.get_crew_rate(location, crew_size, db)
        
        return {
            "success": True,
            "location": location,
            "crew_size": crew_size,
            "rate": rate,
            "found": rate is not None
        }
    except Exception as e:
        logger.error(f"Error getting crew rate for {location} with {crew_size} crew: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting crew rate: {str(e)}")

@router.get("/sheets/operational-rules/{location}", response_model=Dict[str, Any])
async def get_operational_rules(location: str, db: Session = Depends(get_db)):
    """Get operational rules for a specific location"""
    try:
        rules = dispatcher_cache_service.get_operational_rules(location, db)
        
        return {
            "success": True,
            "location": location,
            "rules": rules,
            "found": rules is not None
        }
    except Exception as e:
        logger.error(f"Error getting operational rules for {location}: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting operational rules: {str(e)}")

# Google Sheets Monitoring Endpoints

@router.get("/sheets/monitor/status", response_model=Dict[str, Any])
async def get_sheets_monitor_status():
    """Get comprehensive Google Sheets sync status"""
    try:
        from app.services.sheets_monitor_service import sheets_monitor_service
        status = sheets_monitor_service.get_sync_status()
        return status
    except Exception as e:
        logger.error(f"Error getting monitor status: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting monitor status: {str(e)}")

@router.get("/sheets/monitor/verify/{location}", response_model=Dict[str, Any])
async def verify_sheets_data_alignment(location: str):
    """Verify Google Sheets data alignment with cache"""
    try:
        from app.services.sheets_monitor_service import sheets_monitor_service
        verification = sheets_monitor_service.verify_data_alignment(location)
        return verification
    except Exception as e:
        logger.error(f"Error verifying data alignment for {location}: {e}")
        raise HTTPException(status_code=500, detail=f"Error verifying data alignment: {str(e)}")

@router.post("/sheets/monitor/refresh/{location}", response_model=Dict[str, Any])
async def force_refresh_and_verify(location: str):
    """Force refresh and verify Google Sheets data for a location"""
    try:
        from app.services.sheets_monitor_service import sheets_monitor_service
        result = sheets_monitor_service.force_refresh_and_verify(location)
        return result
    except Exception as e:
        logger.error(f"Error in force refresh for {location}: {e}")
        raise HTTPException(status_code=500, detail=f"Error in force refresh: {str(e)}")

@router.get("/sheets/monitor/history", response_model=Dict[str, Any])
async def get_sync_history(location: str = None, limit: int = 50):
    """Get sync history for monitoring"""
    try:
        from app.services.sheets_monitor_service import sheets_monitor_service
        history = sheets_monitor_service.get_update_history(location, limit)
        return {
            "success": True,
            "history": history,
            "total_events": len(history)
        }
    except Exception as e:
        logger.error(f"Error getting sync history: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting sync history: {str(e)}")

# Vendor Endpoints

@router.get("/{vendor_id}", response_model=Dict[str, Any])
async def get_vendor(vendor_id: int, db: Session = Depends(get_db)):
    """Get vendor by ID"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    return {
        "id": vendor.id,
        "name": vendor.name,
        "slug": vendor.slug,
        "display_name": vendor.display_name,
        "logo_url": vendor.logo_url,
        "vendor_type": vendor.vendor_type,
        "pricing_model": vendor.pricing_model,
        "coverage_areas": vendor.coverage_areas,
        "service_radius": vendor.service_radius,
        "phone": vendor.phone,
        "email": vendor.email,
        "website": vendor.website,
        "is_active": vendor.is_active,
        "is_featured": vendor.is_featured
    }

@router.get("/{vendor_id}/dispatchers", response_model=List[Dict[str, Any]])
async def get_vendor_dispatchers(vendor_id: int, db: Session = Depends(get_db)):
    """Get dispatchers for a vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    dispatchers = db.query(Dispatcher).filter(
        Dispatcher.vendor_id == vendor_id,
        Dispatcher.is_active == True
    ).all()
    
    return [
        {
            "id": dispatcher.id,
            "name": dispatcher.name,
            "location": dispatcher.location,
            "address": dispatcher.address,
            "phone": dispatcher.phone,
            "email": dispatcher.email,
            "is_active": dispatcher.is_active
        }
        for dispatcher in dispatchers
    ] 