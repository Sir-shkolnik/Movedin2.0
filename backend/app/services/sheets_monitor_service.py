"""
Google Sheets Monitor Service
Tracks updates and provides verification for Google Sheets data synchronization.
"""

import logging
from datetime import datetime, timedelta, date
from typing import Dict, List, Any, Optional
from app.services.google_sheets_service import google_sheets_service
from app.services.dispatcher_cache_service import dispatcher_cache_service
import threading
import time

logger = logging.getLogger(__name__)

class SheetsMonitorService:
    """Monitor Google Sheets updates and provide verification"""
    
    def __init__(self):
        self.last_sync_times: Dict[str, datetime] = {}
        self.sync_history: List[Dict[str, Any]] = []
        self.data_checksums: Dict[str, str] = {}
        self.running = False
    
    def get_sync_status(self) -> Dict[str, Any]:
        """Get comprehensive sync status for all dispatchers"""
        try:
            # Get all dispatcher data
            dispatchers_data = google_sheets_service.get_all_dispatchers_data()
            
            status_report = {
                "last_updated": datetime.now().isoformat(),
                "total_dispatchers": len(dispatchers_data),
                "dispatchers": {},
                "overall_status": "healthy",
                "warnings": []
            }
            
            for location, data in dispatchers_data.items():
                dispatcher_status = self._get_dispatcher_sync_status(location, data)
                status_report["dispatchers"][location] = dispatcher_status
                
                # Check for warnings
                if dispatcher_status["last_sync_age_hours"] > 24:
                    status_report["warnings"].append(
                        f"Dispatcher {location} not updated in {dispatcher_status['last_sync_age_hours']} hours"
                    )
                
                if not dispatcher_status["has_recent_data"]:
                    status_report["warnings"].append(
                        f"Dispatcher {location} has no recent pricing data"
                    )
            
            if status_report["warnings"]:
                status_report["overall_status"] = "warning"
            
            return status_report
            
        except Exception as e:
            logger.error(f"Error getting sync status: {e}")
            return {
                "last_updated": datetime.now().isoformat(),
                "error": str(e),
                "overall_status": "error"
            }
    
    def _get_dispatcher_sync_status(self, location: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Get sync status for a specific dispatcher"""
        now = datetime.now()
        
        # Check last sync time
        last_sync = self.last_sync_times.get(location, now - timedelta(hours=25))
        sync_age_hours = (now - last_sync).total_seconds() / 3600
        
        # Check data freshness
        has_recent_data = self._check_data_freshness(data)
        
        # Check data completeness
        data_completeness = self._check_data_completeness(data)
        
        # Get counts from the correct data structure
        daily_rates = data.get("calendar_data", {}).get("daily_rates", {})
        pricing_tables = data.get("pricing_tables", {})
        
        return {
            "location": location,
            "last_sync": last_sync.isoformat(),
            "last_sync_age_hours": round(sync_age_hours, 1),
            "has_recent_data": has_recent_data,
            "data_completeness": data_completeness,
            "base_rates_count": len(daily_rates),  # Use daily_rates count
            "crew_rates_count": len(pricing_tables),  # Use pricing_tables count
            "fuel_charges_count": 0,  # Not available in current structure
            "status": "healthy" if has_recent_data and sync_age_hours < 24 else "stale"
        }
    
    def _check_data_freshness(self, data: Dict[str, Any]) -> bool:
        """Check if data is recent (within last 30 days)"""
        daily_rates = data.get("calendar_data", {}).get("daily_rates", {})
        if not daily_rates:
            return False
        
        # Check if we have rates for recent dates
        now = datetime.now()
        recent_dates = 0
        
        for date_str in daily_rates.keys():
            try:
                # Handle MM-DD format (no year)
                if len(date_str) == 5 and date_str.count('-') == 1:
                    # Add current year to MM-DD format
                    current_year = now.year
                    full_date_str = f"{current_year}-{date_str}"
                    date_obj = datetime.strptime(full_date_str, "%Y-%m-%d")
                else:
                    # Handle YYYY-MM-DD format
                    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                
                if (now - date_obj).days <= 30:
                    recent_dates += 1
            except:
                continue
        
        return recent_dates >= 5  # At least 5 recent dates
    
    def _check_data_completeness(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Check completeness of dispatcher data"""
        # Check for daily rates in calendar_data
        daily_rates = data.get("calendar_data", {}).get("daily_rates", {})
        pricing_tables = data.get("pricing_tables", {})
        location_details = data.get("location_details", {})
        operational_notes = data.get("operational_notes", {})
        
        completeness = {
            "base_rates": len(daily_rates) > 0,  # Use daily_rates instead of base_rates
            "crew_rates": bool(pricing_tables.get("crew_truck_matrix", {}).get("crew_rates")),  # Check crew_rates in crew_truck_matrix
            "fuel_charges": bool(pricing_tables.get("crew_truck_matrix", {}).get("fuel_charges")),  # Check fuel_charges in crew_truck_matrix
            "location_info": bool(location_details and location_details.get("name")),  # Use location_details instead of location_info
            "operational_notes": bool(operational_notes and operational_notes.get("operational_notes"))
        }
        
        total_fields = len(completeness)
        completed_fields = sum(completeness.values())
        completeness_percentage = (completed_fields / total_fields) * 100
        
        return {
            "fields": completeness,
            "percentage": round(completeness_percentage, 1),
            "total_fields": total_fields,
            "completed_fields": completed_fields
        }
    
    def verify_data_alignment(self, location: str) -> Dict[str, Any]:
        """Verify that Google Sheets data aligns with cache"""
        try:
            # Get fresh data from Google Sheets
            sheets_data = google_sheets_service.get_dispatcher_data(location)
            
            # Get cached data (mock DB for now)
            class MockDB:
                pass
            db = MockDB()
            cached_data = dispatcher_cache_service.get_dispatcher_data(location, db)
            
            alignment_report = {
                "location": location,
                "verification_time": datetime.now().isoformat(),
                "sheets_data_present": bool(sheets_data),
                "cached_data_present": bool(cached_data),
                "alignment_status": "unknown",
                "differences": []
            }
            
            if not sheets_data or not cached_data:
                alignment_report["alignment_status"] = "incomplete"
                return alignment_report
            
            # Compare key data points
            differences = []
            
            # Compare base rates
            sheets_rates = sheets_data.get("base_rates", {})
            cached_rates = cached_data.get("base_rates", {})
            
            for date_str in set(sheets_rates.keys()) | set(cached_rates.keys()):
                sheets_rate = sheets_rates.get(date_str)
                cached_rate = cached_rates.get(date_str)
                
                if sheets_rate != cached_rate:
                    differences.append({
                        "field": f"base_rate_{date_str}",
                        "sheets_value": sheets_rate,
                        "cached_value": cached_rate,
                        "type": "rate_mismatch"
                    })
            
            # Compare crew rates
            sheets_crew = sheets_data.get("crew_rates", {})
            cached_crew = cached_data.get("crew_rates", {})
            
            for crew_size in set(sheets_crew.keys()) | set(cached_crew.keys()):
                sheets_rate = sheets_crew.get(crew_size)
                cached_rate = cached_crew.get(crew_size)
                
                if sheets_rate != cached_rate:
                    differences.append({
                        "field": f"crew_rate_{crew_size}",
                        "sheets_value": sheets_rate,
                        "cached_value": cached_rate,
                        "type": "rate_mismatch"
                    })
            
            alignment_report["differences"] = differences
            alignment_report["alignment_status"] = "aligned" if not differences else "misaligned"
            
            return alignment_report
            
        except Exception as e:
            logger.error(f"Error verifying data alignment for {location}: {e}")
            return {
                "location": location,
                "verification_time": datetime.now().isoformat(),
                "error": str(e),
                "alignment_status": "error"
            }
    
    def force_refresh_and_verify(self, location: str) -> Dict[str, Any]:
        """Force refresh and verify data alignment"""
        try:
            # Force refresh cache (mock DB for now)
            class MockDB:
                pass
            db = MockDB()
            dispatcher_cache_service.refresh_dispatcher_cache(location, db)
            
            # Update last sync time
            self.last_sync_times[location] = datetime.now()
            
            # Verify alignment
            verification_result = self.verify_data_alignment(location)
            
            # Add refresh info
            verification_result["refresh_performed"] = True
            verification_result["refresh_time"] = datetime.now().isoformat()
            
            return verification_result
            
        except Exception as e:
            logger.error(f"Error in force refresh for {location}: {e}")
            return {
                "location": location,
                "refresh_performed": False,
                "error": str(e),
                "refresh_time": datetime.now().isoformat()
            }
    
    def get_update_history(self, location: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get update history for monitoring"""
        if location:
            return [entry for entry in self.sync_history if entry.get("location") == location][:limit]
        else:
            return self.sync_history[:limit]
    
    def log_sync_event(self, location: str, event_type: str, details: Dict[str, Any] = None):
        """Log a sync event for monitoring"""
        event = {
            "timestamp": datetime.now().isoformat(),
            "location": location,
            "event_type": event_type,
            "details": details or {}
        }
        
        self.sync_history.append(event)
        
        # Keep only last 1000 events
        if len(self.sync_history) > 1000:
            self.sync_history = self.sync_history[-1000:]
        
        logger.info(f"Sync event: {location} - {event_type}")

    def start_background_refresh_and_validation(self, spreadsheet_id: str, gids: list, interval_hours: int = 4):
        """Start a background thread to refresh and validate all locations every interval_hours."""
        if self.running:
            return
        self.running = True
        def job():
            while self.running:
                try:
                    logger.info("🔄 Starting scheduled live CSV download for all dispatchers...")
                    
                    # Download all dispatcher CSV files live
                    from app.services.live_csv_downloader import live_csv_downloader
                    download_results = live_csv_downloader.download_all_dispatchers()
                    
                    successful = sum(1 for success in download_results.values() if success)
                    total = len(download_results)
                    
                    logger.info(f"✅ Live download complete: {successful}/{total} dispatchers updated")
                    
                    # Clear cache to force refresh with new data
                    dispatcher_cache_service.clear_all_cache()
                    logger.info("🧹 Cache cleared, new data will be loaded on next request")
                    
                    # Parse and cache the new data
                    all_data = google_sheets_service.get_all_dispatchers_data()
                    logger.info(f"📊 Parsed {len(all_data)} dispatcher datasets")
                    
                except Exception as e:
                    logger.error(f"❌ Error in background refresh job: {e}")
                
                time.sleep(interval_hours * 3600)
        t = threading.Thread(target=job, daemon=True)
        t.start()

# Global instance
sheets_monitor_service = SheetsMonitorService() 