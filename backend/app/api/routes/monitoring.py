"""
Monitoring and health check endpoints
Provides system status, metrics, and health information
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import time

from app.services.monitoring_service import monitoring_service
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/monitoring", tags=["monitoring"])

@router.get("/health")
async def health_check():
    """Basic health check endpoint"""
    try:
        status = monitoring_service.get_system_status()
        return {
            "status": "ok",
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": status['uptime_seconds'],
            "health_score": status['health_score']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/status")
async def system_status():
    """Detailed system status including all health checks and metrics"""
    try:
        status = monitoring_service.get_system_status()
        return {
            "timestamp": datetime.now().isoformat(),
            **status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

@router.get("/metrics")
async def get_metrics(minutes: int = 60):
    """Get performance metrics for the last N minutes"""
    try:
        if minutes < 1 or minutes > 1440:  # Max 24 hours
            raise HTTPException(status_code=400, detail="Minutes must be between 1 and 1440")
        
        metrics = monitoring_service.get_performance_metrics(minutes)
        return {
            "timestamp": datetime.now().isoformat(),
            "period_minutes": minutes,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics retrieval failed: {str(e)}")

@router.get("/health/detailed")
async def detailed_health_check():
    """Detailed health check with all dependencies"""
    try:
        status = monitoring_service.get_system_status()
        
        # Add additional system information
        import psutil
        import os
        
        system_info = {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "process_count": len(psutil.pids()),
            "python_version": os.sys.version,
            "platform": os.name
        }
        
        return {
            "timestamp": datetime.now().isoformat(),
            "system_status": status,
            "system_info": system_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detailed health check failed: {str(e)}")

@router.get("/logs/recent")
async def get_recent_logs(limit: int = 100):
    """Get recent log entries (if available)"""
    try:
        # This is a placeholder - in a real implementation, you'd read from log files
        # or use a proper logging service like ELK stack, CloudWatch, etc.
        
        log_file = "logs/movedin.log"
        logs = []
        
        try:
            with open(log_file, 'r') as f:
                lines = f.readlines()
                # Get last N lines
                recent_lines = lines[-limit:] if len(lines) > limit else lines
                
                for line in recent_lines:
                    if line.strip():
                        logs.append({
                            "timestamp": datetime.now().isoformat(),  # Placeholder
                            "message": line.strip()
                        })
        except FileNotFoundError:
            logs = [{"message": "Log file not found", "timestamp": datetime.now().isoformat()}]
        
        return {
            "timestamp": datetime.now().isoformat(),
            "log_count": len(logs),
            "logs": logs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Log retrieval failed: {str(e)}")

@router.post("/metrics/quote")
async def record_quote_metric(
    vendor: str,
    origin: str,
    destination: str,
    duration: float,
    cost: float,
    success: bool,
    error: Optional[str] = None
):
    """Manually record a quote calculation metric"""
    try:
        monitoring_service.log_quote_calculation(
            vendor=vendor,
            origin=origin,
            destination=destination,
            duration=duration,
            cost=cost,
            success=success,
            error=error
        )
        
        return {
            "status": "success",
            "message": "Metric recorded successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metric recording failed: {str(e)}")

@router.get("/alerts")
async def get_alerts():
    """Get current system alerts and warnings"""
    try:
        status = monitoring_service.get_system_status()
        alerts = []
        
        # Check for various alert conditions
        if status['error_rate'] > 10:  # More than 10% error rate
            alerts.append({
                "level": "warning",
                "message": f"High error rate: {status['error_rate']:.1f}%",
                "timestamp": datetime.now().isoformat()
            })
        
        if status['health_score'] < 80:
            alerts.append({
                "level": "critical" if status['health_score'] < 50 else "warning",
                "message": f"Low health score: {status['health_score']:.1f}%",
                "timestamp": datetime.now().isoformat()
            })
        
        # Check individual health checks
        for check_name, check_result in status['health_checks'].items():
            if check_result['status'] != 'healthy':
                alerts.append({
                    "level": "warning",
                    "message": f"Health check failed: {check_name} - {check_result['message']}",
                    "timestamp": datetime.now().isoformat()
                })
        
        return {
            "timestamp": datetime.now().isoformat(),
            "alert_count": len(alerts),
            "alerts": alerts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Alert retrieval failed: {str(e)}")

@router.get("/performance/summary")
async def performance_summary(hours: int = 24):
    """Get performance summary for the last N hours"""
    try:
        if hours < 1 or hours > 168:  # Max 1 week
            raise HTTPException(status_code=400, detail="Hours must be between 1 and 168")
        
        minutes = hours * 60
        metrics = monitoring_service.get_performance_metrics(minutes)
        
        # Calculate summary statistics
        summary = {
            "period_hours": hours,
            "total_requests": metrics['request_count'].get('count', 0),
            "avg_request_duration": metrics['request_duration'].get('avg', 0),
            "total_quotes": metrics['quote_count'].get('count', 0),
            "avg_quote_duration": metrics['quote_duration'].get('avg', 0),
            "avg_quote_cost": metrics['quote_cost'].get('avg', 0),
            "total_errors": metrics['error_count'].get('count', 0),
            "error_rate": 0
        }
        
        if summary['total_requests'] > 0:
            summary['error_rate'] = (summary['total_errors'] / summary['total_requests']) * 100
        
        return {
            "timestamp": datetime.now().isoformat(),
            "summary": summary,
            "detailed_metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Performance summary failed: {str(e)}")