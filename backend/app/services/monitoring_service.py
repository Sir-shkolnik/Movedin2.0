"""
Monitoring and logging service for the MovedIn quote calculation system
Provides comprehensive logging, metrics, and health monitoring
"""
import logging
import time
import json
import traceback
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from functools import wraps
import inspect
from collections import defaultdict, deque
import threading
import os

# Configure logging
# Ensure logs directory exists before configuring FileHandler
os.makedirs('logs', exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/movedin.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class MetricsCollector:
    """Collects and stores system metrics"""
    
    def __init__(self, max_entries: int = 1000):
        self.max_entries = max_entries
        self.metrics = defaultdict(lambda: deque(maxlen=max_entries))
        self.lock = threading.Lock()
    
    def record_metric(self, metric_name: str, value: float, tags: Dict[str, str] = None):
        """Record a metric value with optional tags"""
        with self.lock:
            timestamp = time.time()
            entry = {
                'timestamp': timestamp,
                'value': value,
                'tags': tags or {}
            }
            self.metrics[metric_name].append(entry)
    
    def get_metric_summary(self, metric_name: str, minutes: int = 60) -> Dict[str, Any]:
        """Get summary statistics for a metric over the last N minutes"""
        with self.lock:
            cutoff_time = time.time() - (minutes * 60)
            recent_entries = [
                entry for entry in self.metrics[metric_name]
                if entry['timestamp'] >= cutoff_time
            ]
            
            if not recent_entries:
                return {'count': 0, 'avg': 0, 'min': 0, 'max': 0, 'latest': 0}
            
            values = [entry['value'] for entry in recent_entries]
            
            return {
                'count': len(values),
                'avg': sum(values) / len(values),
                'min': min(values),
                'max': max(values),
                'latest': values[-1] if values else 0
            }
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Get all metrics summary"""
        with self.lock:
            return {
                metric_name: self.get_metric_summary(metric_name)
                for metric_name in self.metrics.keys()
            }

class HealthMonitor:
    """Monitors system health and dependencies"""
    
    def __init__(self):
        self.health_checks = {}
        self.last_check = {}
        self.check_interval = 300  # 5 minutes
    
    def register_health_check(self, name: str, check_func, interval: int = 300):
        """Register a health check function"""
        self.health_checks[name] = {
            'function': check_func,
            'interval': interval,
            'last_run': 0
        }
    
    def run_health_checks(self) -> Dict[str, Any]:
        """Run all registered health checks"""
        results = {}
        current_time = time.time()
        
        for name, check_info in self.health_checks.items():
            if current_time - check_info['last_run'] >= check_info['interval']:
                try:
                    start_time = time.time()
                    result = check_info['function']()
                    duration = time.time() - start_time
                    
                    results[name] = {
                        'status': 'healthy' if result.get('healthy', False) else 'unhealthy',
                        'message': result.get('message', ''),
                        'duration': duration,
                        'timestamp': current_time
                    }
                    
                    check_info['last_run'] = current_time
                    
                except Exception as e:
                    results[name] = {
                        'status': 'error',
                        'message': str(e),
                        'duration': 0,
                        'timestamp': current_time
                    }
                    logger.error(f"Health check {name} failed: {e}")
        
        return results

class MonitoringService:
    """Main monitoring service that coordinates logging and metrics"""
    
    def __init__(self):
        self.metrics = MetricsCollector()
        self.health_monitor = HealthMonitor()
        self.request_count = 0
        self.error_count = 0
        self.start_time = time.time()
        
        # Register default health checks
        self._register_default_health_checks()
    
    def _register_default_health_checks(self):
        """Register default health checks"""
        
        def check_database():
            """Check database connectivity"""
            try:
                from app.core.database import get_db
                db = next(get_db())
                # Simple query to test connection
                db.execute("SELECT 1")
                return {'healthy': True, 'message': 'Database connection OK'}
            except Exception as e:
                return {'healthy': False, 'message': f'Database error: {str(e)}'}
        
        def check_mapbox_api():
            """Check Mapbox API connectivity"""
            try:
                from app.services.mapbox_service import mapbox_service
                # Test with a simple geocoding request
                result = mapbox_service.geocode_address("Toronto, ON, Canada")
                if result and 'coordinates' in result:
                    return {'healthy': True, 'message': 'Mapbox API OK'}
                else:
                    return {'healthy': False, 'message': 'Mapbox API returned invalid response'}
            except Exception as e:
                return {'healthy': False, 'message': f'Mapbox API error: {str(e)}'}
        
        def check_google_sheets():
            """Check Google Sheets connectivity"""
            try:
                from app.services.google_sheets_service import google_sheets_service
                # Test with a simple data fetch
                data = google_sheets_service.get_location_details("1")  # Test with GID 1
                if data:
                    return {'healthy': True, 'message': 'Google Sheets OK'}
                else:
                    return {'healthy': False, 'message': 'Google Sheets returned no data'}
            except Exception as e:
                return {'healthy': False, 'message': f'Google Sheets error: {str(e)}'}
        
        self.health_monitor.register_health_check('database', check_database, 300)
        self.health_monitor.register_health_check('mapbox', check_mapbox_api, 600)
        self.health_monitor.register_health_check('google_sheets', check_google_sheets, 600)
    
    def log_request(self, endpoint: str, method: str, duration: float, status_code: int, 
                   user_agent: str = None, ip_address: str = None, **kwargs):
        """Log an API request"""
        self.request_count += 1
        
        log_data = {
            'type': 'request',
            'endpoint': endpoint,
            'method': method,
            'duration': duration,
            'status_code': status_code,
            'timestamp': time.time(),
            'user_agent': user_agent,
            'ip_address': ip_address,
            **kwargs
        }
        
        logger.info(f"Request: {method} {endpoint} - {status_code} - {duration:.3f}s", extra=log_data)
        
        # Record metrics
        self.metrics.record_metric('request_duration', duration, {'endpoint': endpoint, 'method': method})
        self.metrics.record_metric('request_count', 1, {'status_code': str(status_code)})
    
    def log_quote_calculation(self, vendor: str, origin: str, destination: str, 
                            duration: float, cost: float, success: bool, error: str = None):
        """Log a quote calculation"""
        log_data = {
            'type': 'quote_calculation',
            'vendor': vendor,
            'origin': origin,
            'destination': destination,
            'duration': duration,
            'cost': cost,
            'success': success,
            'timestamp': time.time(),
            'error': error
        }
        
        if success:
            logger.info(f"Quote calculated: {vendor} - ${cost:.2f} - {duration:.3f}s", extra=log_data)
        else:
            logger.error(f"Quote calculation failed: {vendor} - {error} - {duration:.3f}s", extra=log_data)
            self.error_count += 1
        
        # Record metrics
        self.metrics.record_metric('quote_duration', duration, {'vendor': vendor, 'success': str(success)})
        self.metrics.record_metric('quote_cost', cost, {'vendor': vendor}) if success else None
        self.metrics.record_metric('quote_count', 1, {'vendor': vendor, 'success': str(success)})
    
    def log_error(self, error_type: str, message: str, exception: Exception = None, 
                 context: Dict[str, Any] = None):
        """Log an error with context"""
        self.error_count += 1
        
        log_data = {
            'type': 'error',
            'error_type': error_type,
            'message': message,
            'timestamp': time.time(),
            'context': context or {}
        }
        
        if exception:
            log_data['exception'] = str(exception)
            log_data['traceback'] = traceback.format_exc()
        
        logger.error(f"Error: {error_type} - {message}", extra=log_data)
        
        # Record metrics
        self.metrics.record_metric('error_count', 1, {'error_type': error_type})
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        uptime = time.time() - self.start_time
        health_checks = self.health_monitor.run_health_checks()
        
        # Calculate health score
        healthy_checks = sum(1 for check in health_checks.values() if check['status'] == 'healthy')
        total_checks = len(health_checks)
        health_score = (healthy_checks / total_checks * 100) if total_checks > 0 else 0
        
        return {
            'status': 'healthy' if health_score >= 80 else 'degraded' if health_score >= 50 else 'unhealthy',
            'uptime_seconds': uptime,
            'uptime_human': str(timedelta(seconds=int(uptime))),
            'request_count': self.request_count,
            'error_count': self.error_count,
            'error_rate': (self.error_count / self.request_count * 100) if self.request_count > 0 else 0,
            'health_score': health_score,
            'health_checks': health_checks,
            'metrics': self.metrics.get_all_metrics()
        }
    
    def get_performance_metrics(self, minutes: int = 60) -> Dict[str, Any]:
        """Get performance metrics for the last N minutes"""
        return {
            'request_duration': self.metrics.get_metric_summary('request_duration', minutes),
            'quote_duration': self.metrics.get_metric_summary('quote_duration', minutes),
            'quote_cost': self.metrics.get_metric_summary('quote_cost', minutes),
            'error_count': self.metrics.get_metric_summary('error_count', minutes),
            'quote_count': self.metrics.get_metric_summary('quote_count', minutes)
        }

# Global monitoring service instance
monitoring_service = MonitoringService()

def monitor_request(endpoint: str, method: str = 'GET'):
    """Decorator to monitor API requests (supports sync and async callables)."""
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                start_time = time.time()
                status_code = 200
                error = None
                try:
                    result = await func(*args, **kwargs)
                    return result
                except Exception as e:
                    status_code = 500
                    error = str(e)
                    monitoring_service.log_error('request_error', str(e), e, {
                        'endpoint': endpoint,
                        'method': method
                    })
                    raise
                finally:
                    duration = time.time() - start_time
                    monitoring_service.log_request(
                        endpoint=endpoint,
                        method=method,
                        duration=duration,
                        status_code=status_code,
                        error=error
                    )
            return async_wrapper
        else:
            @wraps(func)
            def wrapper(*args, **kwargs):
                start_time = time.time()
                status_code = 200
                error = None
                try:
                    result = func(*args, **kwargs)
                    return result
                except Exception as e:
                    status_code = 500
                    error = str(e)
                    monitoring_service.log_error('request_error', str(e), e, {
                        'endpoint': endpoint,
                        'method': method
                    })
                    raise
                finally:
                    duration = time.time() - start_time
                    monitoring_service.log_request(
                        endpoint=endpoint,
                        method=method,
                        duration=duration,
                        status_code=status_code,
                        error=error
                    )
            return wrapper
    return decorator

def monitor_quote_calculation(vendor: str):
    """Decorator to monitor quote calculations"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            success = False
            cost = 0
            error = None
            
            try:
                result = func(*args, **kwargs)
                if result and isinstance(result, dict):
                    cost = result.get('total_cost', 0)
                    success = True
                return result
            except Exception as e:
                error = str(e)
                monitoring_service.log_error('quote_calculation_error', str(e), e, {
                    'vendor': vendor
                })
                raise
            finally:
                duration = time.time() - start_time
                # Extract origin and destination from args if possible
                origin = "Unknown"
                destination = "Unknown"
                if len(args) >= 2:
                    if hasattr(args[1], 'origin_address'):
                        origin = args[1].origin_address
                    if hasattr(args[1], 'destination_address'):
                        destination = args[1].destination_address
                
                monitoring_service.log_quote_calculation(
                    vendor=vendor,
                    origin=origin,
                    destination=destination,
                    duration=duration,
                    cost=cost,
                    success=success,
                    error=error
                )
        
        return wrapper
    return decorator

# Create logs directory if it doesn't exist
# (Already ensured above before configuring logging)
