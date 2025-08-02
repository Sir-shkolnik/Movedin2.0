from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.core.database import get_db
from app.core.monitoring import performance_monitor
import psutil
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2025-01-15T10:00:00Z",
        "version": "2.0"
    }

@router.get("/performance/stats")
async def get_performance_stats(
    endpoint: str = None,
    minutes: int = 60,
    db: Session = Depends(get_db)
):
    """Get performance statistics for endpoints"""
    try:
        stats = performance_monitor.get_performance_stats(endpoint, minutes)
        return {
            "success": True,
            "data": stats,
            "endpoint": endpoint,
            "time_window_minutes": minutes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting performance stats: {e}")

@router.get("/performance/alerts")
async def get_recent_alerts(
    hours: int = 24,
    db: Session = Depends(get_db)
):
    """Get recent performance alerts"""
    try:
        alerts = performance_monitor.get_recent_alerts(hours)
        return {
            "success": True,
            "data": alerts,
            "time_window_hours": hours,
            "count": len(alerts)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting alerts: {e}")

@router.get("/system/status")
async def get_system_status():
    """Get system resource status"""
    try:
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Memory usage
        memory = psutil.virtual_memory()
        
        # Disk usage
        disk = psutil.disk_usage('/')
        
        # Process info
        process = psutil.Process(os.getpid())
        process_memory = process.memory_info()
        
        return {
            "success": True,
            "data": {
                "cpu": {
                    "usage_percent": cpu_percent,
                    "count": psutil.cpu_count()
                },
                "memory": {
                    "total_gb": round(memory.total / (1024**3), 2),
                    "used_gb": round(memory.used / (1024**3), 2),
                    "available_gb": round(memory.available / (1024**3), 2),
                    "usage_percent": memory.percent
                },
                "disk": {
                    "total_gb": round(disk.total / (1024**3), 2),
                    "used_gb": round(disk.used / (1024**3), 2),
                    "free_gb": round(disk.free / (1024**3), 2),
                    "usage_percent": round((disk.used / disk.total) * 100, 2)
                },
                "process": {
                    "memory_mb": round(process_memory.rss / (1024**2), 2),
                    "cpu_percent": process.cpu_percent(),
                    "threads": process.num_threads()
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting system status: {e}")

@router.get("/cache/status")
async def get_cache_status():
    """Get Redis cache status"""
    try:
        redis_client = performance_monitor.redis_client
        
        # Get cache info
        info = redis_client.info()
        
        # Get cache keys count
        keys_count = len(redis_client.keys("*"))
        
        # Get memory usage
        memory_info = redis_client.info("memory")
        
        return {
            "success": True,
            "data": {
                "redis_version": info.get("redis_version"),
                "connected_clients": info.get("connected_clients"),
                "total_keys": keys_count,
                "memory_usage_mb": round(memory_info.get("used_memory", 0) / (1024**2), 2),
                "memory_peak_mb": round(memory_info.get("used_memory_peak", 0) / (1024**2), 2),
                "uptime_seconds": info.get("uptime_in_seconds"),
                "total_commands_processed": info.get("total_commands_processed")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting cache status: {e}")

@router.post("/cache/clear")
async def clear_cache():
    """Clear Redis cache"""
    try:
        redis_client = performance_monitor.redis_client
        redis_client.flushdb()
        
        return {
            "success": True,
            "message": "Cache cleared successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {e}")

@router.get("/endpoints/status")
async def get_endpoints_status():
    """Get status of all critical endpoints"""
    try:
        import requests
        import time
        
        endpoints = [
            {"name": "Frontend", "url": "http://localhost:5173", "timeout": 5},
            {"name": "Backend Health", "url": "http://localhost:8000/health", "timeout": 5},
            {"name": "Database", "url": "http://localhost:8000/api/leads/", "timeout": 10},
            {"name": "Vendors", "url": "http://localhost:8000/vendors", "timeout": 10}
        ]
        
        results = []
        
        for endpoint in endpoints:
            try:
                start_time = time.time()
                response = requests.get(endpoint["url"], timeout=endpoint["timeout"])
                response_time = (time.time() - start_time) * 1000
                
                results.append({
                    "name": endpoint["name"],
                    "url": endpoint["url"],
                    "status": "healthy" if response.status_code < 400 else "unhealthy",
                    "status_code": response.status_code,
                    "response_time_ms": round(response_time, 2)
                })
            except Exception as e:
                results.append({
                    "name": endpoint["name"],
                    "url": endpoint["url"],
                    "status": "error",
                    "error": str(e),
                    "response_time_ms": None
                })
        
        return {
            "success": True,
            "data": results,
            "timestamp": "2025-01-15T10:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking endpoints: {e}") 