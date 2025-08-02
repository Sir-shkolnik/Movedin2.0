import time
import logging
import redis
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from fastapi import Request
import asyncio

logger = logging.getLogger(__name__)

class PerformanceMonitor:
    """Production performance monitoring and alerting"""
    
    def __init__(self):
        self.redis_client = redis.Redis(host='redis', port=6379, db=1, decode_responses=True)
        self.alert_thresholds = {
            'response_time_ms': 5000,  # 5 seconds
            'error_rate_percent': 5,   # 5% error rate
            'memory_usage_mb': 512,    # 512MB
            'cpu_usage_percent': 80    # 80% CPU
        }
    
    def track_request(self, request: Request, response_time_ms: float, status_code: int):
        """Track request performance metrics"""
        try:
            endpoint = request.url.path
            method = request.method
            
            # Store metrics in Redis
            timestamp = datetime.now().isoformat()
            metric_key = f"metrics:{endpoint}:{method}:{timestamp}"
            
            metric_data = {
                'endpoint': endpoint,
                'method': method,
                'response_time_ms': response_time_ms,
                'status_code': status_code,
                'timestamp': timestamp,
                'is_error': status_code >= 400
            }
            
            # Store for 24 hours
            self.redis_client.setex(metric_key, 86400, str(metric_data))
            
            # Check for alerts
            self._check_alerts(endpoint, response_time_ms, status_code)
            
        except Exception as e:
            logger.error(f"Error tracking request: {e}")
    
    def _check_alerts(self, endpoint: str, response_time_ms: float, status_code: int):
        """Check if alerts should be triggered"""
        try:
            # Response time alert
            if response_time_ms > self.alert_thresholds['response_time_ms']:
                self._send_alert(
                    'HIGH_RESPONSE_TIME',
                    f"Endpoint {endpoint} took {response_time_ms}ms (> {self.alert_thresholds['response_time_ms']}ms)"
                )
            
            # Error rate alert
            if status_code >= 400:
                error_count = self._get_error_count(endpoint, minutes=5)
                total_count = self._get_total_count(endpoint, minutes=5)
                
                if total_count > 0:
                    error_rate = (error_count / total_count) * 100
                    if error_rate > self.alert_thresholds['error_rate_percent']:
                        self._send_alert(
                            'HIGH_ERROR_RATE',
                            f"Endpoint {endpoint} has {error_rate:.1f}% error rate (> {self.alert_thresholds['error_rate_percent']}%)"
                        )
        
        except Exception as e:
            logger.error(f"Error checking alerts: {e}")
    
    def _get_error_count(self, endpoint: str, minutes: int = 5) -> int:
        """Get error count for endpoint in last N minutes"""
        try:
            pattern = f"metrics:{endpoint}:*"
            keys = self.redis_client.keys(pattern)
            
            error_count = 0
            cutoff_time = datetime.now() - timedelta(minutes=minutes)
            
            for key in keys:
                data_str = self.redis_client.get(key)
                if data_str:
                    try:
                        data = eval(data_str)  # Simple parsing for metrics
                        if data.get('is_error') and data.get('timestamp'):
                            metric_time = datetime.fromisoformat(data['timestamp'])
                            if metric_time > cutoff_time:
                                error_count += 1
                    except:
                        continue
            
            return error_count
        except Exception as e:
            logger.error(f"Error getting error count: {e}")
            return 0
    
    def _get_total_count(self, endpoint: str, minutes: int = 5) -> int:
        """Get total request count for endpoint in last N minutes"""
        try:
            pattern = f"metrics:{endpoint}:*"
            keys = self.redis_client.keys(pattern)
            
            total_count = 0
            cutoff_time = datetime.now() - timedelta(minutes=minutes)
            
            for key in keys:
                data_str = self.redis_client.get(key)
                if data_str:
                    try:
                        data = eval(data_str)
                        if data.get('timestamp'):
                            metric_time = datetime.fromisoformat(data['timestamp'])
                            if metric_time > cutoff_time:
                                total_count += 1
                    except:
                        continue
            
            return total_count
        except Exception as e:
            logger.error(f"Error getting total count: {e}")
            return 0
    
    def _send_alert(self, alert_type: str, message: str):
        """Send alert (log for now, can be extended to email/SMS)"""
        alert_data = {
            'type': alert_type,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'severity': 'HIGH' if 'HIGH' in alert_type else 'MEDIUM'
        }
        
        # Store alert in Redis
        alert_key = f"alerts:{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.redis_client.setex(alert_key, 86400, str(alert_data))
        
        # Log alert
        logger.warning(f"ALERT: {alert_type} - {message}")
        
        # TODO: Send to external alerting service (email, Slack, etc.)
    
    def get_performance_stats(self, endpoint: str = None, minutes: int = 60) -> Dict[str, Any]:
        """Get performance statistics"""
        try:
            pattern = "metrics:*" if not endpoint else f"metrics:{endpoint}:*"
            keys = self.redis_client.keys(pattern)
            
            response_times = []
            error_count = 0
            total_count = 0
            cutoff_time = datetime.now() - timedelta(minutes=minutes)
            
            for key in keys:
                data_str = self.redis_client.get(key)
                if data_str:
                    try:
                        data = eval(data_str)
                        if data.get('timestamp'):
                            metric_time = datetime.fromisoformat(data['timestamp'])
                            if metric_time > cutoff_time:
                                total_count += 1
                                response_times.append(data.get('response_time_ms', 0))
                                if data.get('is_error'):
                                    error_count += 1
                    except:
                        continue
            
            if not response_times:
                return {
                    'total_requests': 0,
                    'error_rate': 0,
                    'avg_response_time': 0,
                    'max_response_time': 0,
                    'min_response_time': 0
                }
            
            return {
                'total_requests': total_count,
                'error_rate': (error_count / total_count) * 100 if total_count > 0 else 0,
                'avg_response_time': sum(response_times) / len(response_times),
                'max_response_time': max(response_times),
                'min_response_time': min(response_times)
            }
        
        except Exception as e:
            logger.error(f"Error getting performance stats: {e}")
            return {}
    
    def get_recent_alerts(self, hours: int = 24) -> list:
        """Get recent alerts"""
        try:
            pattern = "alerts:*"
            keys = self.redis_client.keys(pattern)
            
            alerts = []
            cutoff_time = datetime.now() - timedelta(hours=hours)
            
            for key in keys:
                data_str = self.redis_client.get(key)
                if data_str:
                    try:
                        data = eval(data_str)
                        if data.get('timestamp'):
                            alert_time = datetime.fromisoformat(data['timestamp'])
                            if alert_time > cutoff_time:
                                alerts.append(data)
                    except:
                        continue
            
            return sorted(alerts, key=lambda x: x.get('timestamp', ''), reverse=True)
        
        except Exception as e:
            logger.error(f"Error getting recent alerts: {e}")
            return []

# Global monitor instance
performance_monitor = PerformanceMonitor()

# Middleware for automatic request tracking
async def track_request_middleware(request: Request, call_next):
    """Middleware to track request performance"""
    start_time = time.time()
    
    try:
        response = await call_next(request)
        response_time_ms = (time.time() - start_time) * 1000
        
        # Track the request
        performance_monitor.track_request(request, response_time_ms, response.status_code)
        
        return response
    except Exception as e:
        response_time_ms = (time.time() - start_time) * 1000
        performance_monitor.track_request(request, response_time_ms, 500)
        raise 