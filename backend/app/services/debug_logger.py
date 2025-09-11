import json
import os
from datetime import datetime
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class DebugLogger:
    """Service for logging payment flow debugging information"""
    
    def __init__(self):
        self.debug_dir = "debug_logs"
        self.ensure_debug_directory()
    
    def ensure_debug_directory(self):
        """Create debug directory if it doesn't exist"""
        if not os.path.exists(self.debug_dir):
            os.makedirs(self.debug_dir)
            logger.info(f"Created debug directory: {self.debug_dir}")
    
    def log_payment_flow_step(self, step: str, data: Dict[str, Any], lead_id: int = None):
        """Log a step in the payment flow"""
        try:
            timestamp = datetime.now().isoformat()
            log_entry = {
                "timestamp": timestamp,
                "step": step,
                "lead_id": lead_id,
                "data": data,
                "url": data.get("url", ""),
                "session_id": data.get("session_id", ""),
                "current_step": data.get("current_step", ""),
                "routing_detected": data.get("routing_detected", False),
                "step7_rendered": data.get("step7_rendered", False),
                "form_data_loaded": data.get("form_data_loaded", False),
                "error": data.get("error", "")
            }
            
            # Save to individual file
            filename = f"payment_flow_{lead_id}_{timestamp.replace(':', '-')}.json"
            filepath = os.path.join(self.debug_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(log_entry, f, indent=2)
            
            # Also append to daily log
            daily_log = f"payment_flow_{datetime.now().strftime('%Y%m%d')}.log"
            daily_filepath = os.path.join(self.debug_dir, daily_log)
            
            with open(daily_filepath, 'a') as f:
                f.write(f"\n=== {timestamp} ===\n")
                f.write(f"Step: {step}\n")
                f.write(f"Lead ID: {lead_id}\n")
                f.write(f"URL: {data.get('url', '')}\n")
                f.write(f"Session ID: {data.get('session_id', '')}\n")
                f.write(f"Current Step: {data.get('current_step', '')}\n")
                f.write(f"Routing Detected: {data.get('routing_detected', False)}\n")
                f.write(f"Step7 Rendered: {data.get('step7_rendered', False)}\n")
                f.write(f"Form Data Loaded: {data.get('form_data_loaded', False)}\n")
                if data.get('error'):
                    f.write(f"Error: {data.get('error')}\n")
                f.write(f"Full Data: {json.dumps(data, indent=2)}\n")
                f.write("=" * 50 + "\n")
            
            logger.info(f"Debug log saved: {filename}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save debug log: {e}")
            return False
    
    def get_debug_logs(self, lead_id: int = None, limit: int = 50):
        """Get debug logs for a specific lead or all logs"""
        try:
            logs = []
            
            if lead_id:
                # Get logs for specific lead
                pattern = f"payment_flow_{lead_id}_"
                for filename in os.listdir(self.debug_dir):
                    if filename.startswith(pattern) and filename.endswith('.json'):
                        filepath = os.path.join(self.debug_dir, filename)
                        with open(filepath, 'r') as f:
                            log_entry = json.load(f)
                            logs.append(log_entry)
            else:
                # Get all recent logs
                json_files = [f for f in os.listdir(self.debug_dir) if f.endswith('.json')]
                json_files.sort(key=lambda x: os.path.getmtime(os.path.join(self.debug_dir, x)), reverse=True)
                
                for filename in json_files[:limit]:
                    filepath = os.path.join(self.debug_dir, filename)
                    with open(filepath, 'r') as f:
                        log_entry = json.load(f)
                        logs.append(log_entry)
            
            return sorted(logs, key=lambda x: x['timestamp'], reverse=True)
            
        except Exception as e:
            logger.error(f"Failed to get debug logs: {e}")
            return []
    
    def get_debug_summary(self, lead_id: int = None):
        """Get a summary of debug logs for a lead"""
        try:
            logs = self.get_debug_logs(lead_id)
            
            if not logs:
                return {"error": "No debug logs found"}
            
            # Group by lead_id
            lead_logs = {}
            for log in logs:
                lid = log.get('lead_id')
                if lid not in lead_logs:
                    lead_logs[lid] = []
                lead_logs[lid].append(log)
            
            summary = {}
            for lid, log_list in lead_logs.items():
                steps = [log['step'] for log in log_list]
                errors = [log for log in log_list if log.get('error')]
                last_log = max(log_list, key=lambda x: x['timestamp'])
                
                summary[lid] = {
                    "total_steps": len(log_list),
                    "steps": steps,
                    "has_errors": len(errors) > 0,
                    "errors": [e['error'] for e in errors],
                    "last_step": last_log['step'],
                    "last_timestamp": last_log['timestamp'],
                    "routing_detected": last_log.get('routing_detected', False),
                    "step7_rendered": last_log.get('step7_rendered', False),
                    "form_data_loaded": last_log.get('form_data_loaded', False)
                }
            
            return summary
            
        except Exception as e:
            logger.error(f"Failed to get debug summary: {e}")
            return {"error": str(e)}

# Global instance
debug_logger = DebugLogger()
