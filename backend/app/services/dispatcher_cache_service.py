from typing import Dict, List, Any, Optional
from datetime import datetime, date, timedelta
import json
import logging
from sqlalchemy.orm import Session
from app.models.vendor import Dispatcher
from app.services.google_sheets_service import google_sheets_service
from app.core.database import get_db
import re
import math

logger = logging.getLogger(__name__)

class DispatcherCacheService:
    """Service to cache and manage dispatcher data from Google Sheets"""
    
    def __init__(self):
        self.cache_ttl_hours = 4  # Cache for 4 hours
        self.cache_data = {}
        self.last_update = {}
        self._all_dispatchers_cache = None
        self._all_dispatchers_last_update = None
    
    def get_dispatcher_data(self, location: str, db: Session) -> Optional[Dict[str, Any]]:
        """Get dispatcher data from cache or Google Sheets"""
        # Check if cache is valid
        if self._is_cache_valid(location):
            return self.cache_data.get(location)
        
        # Fetch fresh data from Google Sheets
        return self._update_dispatcher_cache(location, db)
    
    def _is_cache_valid(self, location: str) -> bool:
        """Check if cache is still valid for a location"""
        if location not in self.last_update:
            return False
        
        last_update = self.last_update[location]
        cache_age = datetime.now() - last_update
        return cache_age.total_seconds() < (self.cache_ttl_hours * 3600)
    
    def _update_dispatcher_cache(self, location: str, db: Session) -> Optional[Dict[str, Any]]:
        """Update cache for a specific dispatcher"""
        try:
            # Try to get data from existing cache first (from sheets monitor service)
            from app.services.sheets_monitor_service import sheets_monitor_service
            
            # Get all dispatchers from the sheets monitor service (which has 4-hour cache)
            all_dispatchers = google_sheets_service.get_all_dispatchers_data()
            sheets_data = all_dispatchers.get(location)
            
            if not sheets_data:
                logger.warning(f"No data found for dispatcher: {location}")
                return None
            
            # Normalize the data
            normalized_data = self._normalize_dispatcher_data(sheets_data)
            
            # Update database cache
            self._update_database_cache(location, normalized_data, db)
            
            # Update memory cache
            self.cache_data[location] = normalized_data
            self.last_update[location] = datetime.now()
            
            logger.info(f"Updated cache for dispatcher: {location}")
            return normalized_data
            
        except Exception as e:
            logger.error(f"Error updating cache for {location}: {e}")
            return None
    
    def _normalize_dispatcher_data(self, sheets_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize Google Sheets data into standard format"""
        # Handle both old and new data structures
        location = sheets_data.get("location", "")
        
        # Get coordinates - handle both formats
        coordinates = {}
        if "coordinates" in sheets_data:
            coordinates = sheets_data.get("coordinates", {})
        elif "lat" in sheets_data and "lng" in sheets_data:
            coordinates = {"lat": sheets_data.get("lat"), "lng": sheets_data.get("lng")}
        
        # Get address - handle both formats
        address = ""
        if "address" in sheets_data:
            address = sheets_data.get("address", "")
        elif "metadata" in sheets_data:
            address = sheets_data.get("metadata", {}).get("address", "")
        
        normalized = {
            "location": location,
            "location_details": self._normalize_location_details(sheets_data),
            "pricing_model": self._normalize_pricing_formula(sheets_data),
            "calendar_data": self._normalize_calendar_rates(sheets_data),
            "operational_rules": self._normalize_operational_rules(sheets_data),
            "coordinates": coordinates,
            "address": address,
            "last_updated": datetime.now().isoformat()
        }
        
        return normalized
    
    def _normalize_pricing_model(self, sheets_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize pricing model data"""
        pricing_tables = sheets_data.get("pricing_tables", {})
        
        # Extract crew rates
        crew_rates = {}
        for crew_size, rate in pricing_tables.get("crew_rates", {}).items():
            crew_rates[int(crew_size)] = float(rate)
        
        # Extract truck pricing
        truck_pricing = {
            "1_truck": {},
            "2_trucks": {}
        }
        
        for truck_type in ["1_truck", "2_trucks"]:
            for crew_size, price_data in pricing_tables.get(truck_type, {}).items():
                if isinstance(price_data, dict):
                    truck_pricing[truck_type][int(crew_size)] = {
                        "min": price_data.get("min", 0),
                        "base": price_data.get("base", 0),
                        "max": price_data.get("max", 0)
                    }
        
        return {
            "crew_rates": crew_rates,
            "truck_pricing": truck_pricing,
            "formula": "base_rate + 60 * (crew_size - 1)",  # Standard LGM formula
            "max_crew_per_truck": 3
        }
    
    def _normalize_calendar_rates(self, sheets_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize calendar rates from smart parser data structure"""
        try:
            # Get calendar data from new structure
            calendar_data = sheets_data.get("calendar_hourly_price", {})
            
            # Convert calendar data to daily rates
            daily_rates = {}
            for date_key, rate in calendar_data.items():
                if isinstance(rate, (int, float)) and rate > 0:
                    daily_rates[date_key] = float(rate)
        
            # Get restricted dates (if any)
            restricted_dates = []
            operational_rules = sheets_data.get("operational_rules", {})
            if "restricted_arrival_windows" in operational_rules:
                # Parse restricted dates from operational rules
                restricted_text = operational_rules["restricted_arrival_windows"]
                # Extract date patterns like "27TH TO THE 3RD"
                date_matches = re.findall(r'(\d+TH)\s+TO\s+THE\s+(\d+TH)', restricted_text)
                for start, end in date_matches:
                    restricted_dates.append(f"{start} TO {end}")
            
            logger.info(f"✅ Normalized {len(daily_rates)} daily rates")
        
            return {
                "daily_rates": daily_rates,
                "restricted_dates": restricted_dates,
                "default_rate": self._get_default_rate(daily_rates),
                "restricted_rate": self._get_restricted_rate(daily_rates)
            }
            
        except Exception as e:
            logger.error(f"❌ Error normalizing calendar rates: {e}")
            return {
                "daily_rates": {},
                "restricted_dates": [],
                "default_rate": 0.0,
                "restricted_rate": 0.0
            }
    
    def _normalize_location_details(self, sheets_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize location details from smart parser data structure"""
        try:
            # Handle both old and new data structures
            location_name = sheets_data.get("location", "Unknown")
            
            # Try new structure first
            if "metadata" in sheets_data:
                metadata = sheets_data.get("metadata", {})
                location_details = {
                    "name": location_name,
                    "ops_manager": metadata.get("ops_manager", ""),
                    "address": metadata.get("address", ""),
                    "email": metadata.get("email", ""),
                    "terminal_id": metadata.get("terminal_id", ""),
                    "intersection": metadata.get("intersection", ""),
                    "truck_count": metadata.get("truck_count", ""),
                    "sales_phone": metadata.get("sales_phone", ""),
                    "timezone": metadata.get("timezone", "")
                }
            # Try old structure
            elif "location_details" in sheets_data:
                old_details = sheets_data.get("location_details", {})
                location_details = {
                    "name": location_name,
                    "ops_manager": old_details.get("ops_manager", ""),
                    "address": old_details.get("address", ""),
                    "email": old_details.get("email", ""),
                    "terminal_id": old_details.get("terminal_id", ""),
                    "intersection": old_details.get("intersection", ""),
                    "truck_count": old_details.get("truck_count", ""),
                    "sales_phone": old_details.get("sales_phone", ""),
                    "timezone": old_details.get("timezone", "")
                }
            else:
                # Fallback structure
                location_details = {
                    "name": location_name,
                    "ops_manager": "",
                    "address": "",
                    "email": "",
                    "terminal_id": "",
                    "intersection": "",
                    "truck_count": "",
                    "sales_phone": "",
                    "timezone": ""
                }
            
            logger.info(f"✅ Normalized location details for {location_name}")
            return location_details
            
        except Exception as e:
            logger.error(f"❌ Error normalizing location details: {e}")
            return {
                "name": "Unknown",
                "ops_manager": "",
                "address": "",
                "email": "",
                "terminal_id": "",
                "intersection": "",
                "truck_count": "",
                "sales_phone": "",
                "timezone": ""
            }
    
    def _normalize_pricing_formula(self, sheets_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize pricing formula from smart parser data structure"""
        try:
            # Get pricing formula from new structure
            pricing_formula = sheets_data.get("pricing_formula", {})
            
            # Extract crew rates
            crew_rates = pricing_formula.get("crew_rates", {})
            
            # Build pricing formula
            result = {
                "description": pricing_formula.get("description", "Standard pricing formula"),
                "formulas": pricing_formula.get("formulas", {
                    "1_truck": "base_price + 60 * (movers - 1)",
                    "2_trucks": "2 * (base_price + 60 * (movers - 1))",
                    "max_movers_per_truck": 3
                }),
                "crew_rates": crew_rates,
                "important_notes": pricing_formula.get("important_notes", "")
            }
            
            logger.info(f"✅ Normalized pricing formula")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error normalizing pricing formula: {e}")
            return {
                "description": "Standard pricing formula",
                "formulas": {
                    "1_truck": "base_price + 60 * (movers - 1)",
                    "2_trucks": "2 * (base_price + 60 * (movers - 1))",
                    "max_movers_per_truck": 3
                },
                "crew_rates": {},
                "important_notes": ""
            }
    
    def _normalize_operational_rules(self, sheets_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize operational rules and restrictions"""
        location_details = sheets_data.get("location_details", {})
        operational_notes = sheets_data.get("operational_notes", {})
        
        # Extract truck count
        truck_count_text = location_details.get("truck_count", "")
        truck_count = self._extract_truck_count(truck_count_text)
        
        # Extract restrictions
        restrictions = []
        for restriction in operational_notes.get("restrictions", []):
            restrictions.append(restriction.strip())
        
        # Extract important notes
        important_notes = []
        for note in operational_notes.get("important_notes", []):
            important_notes.append(note.strip())
        
        return {
            "truck_count": truck_count,
            "restrictions": restrictions,
            "important_notes": important_notes,
            "ops_manager": location_details.get("ops_manager", ""),
            "terminal_id": location_details.get("terminal_id", ""),
            "email": location_details.get("email", ""),
            "address": location_details.get("address", ""),
            "intersection": location_details.get("intersection", "")
        }
    
    def _extract_truck_count(self, truck_count_text: str) -> int:
        """Extract truck count from text"""
        if not truck_count_text:
            return 1
        
        # Look for numbers in the text
        import re
        numbers = re.findall(r'\d+', truck_count_text)
        if numbers:
            return int(numbers[0])
        
        return 1
    
    def _update_database_cache(self, location: str, normalized_data: Dict[str, Any], db: Session):
        """Update database cache for dispatcher"""
        try:
            # Find existing dispatcher or create new one
            dispatcher = db.query(Dispatcher).filter(
                Dispatcher.location == location
            ).first()
            
            if not dispatcher:
                # Create new dispatcher (you'll need to set vendor_id)
                dispatcher = Dispatcher(
                    location=location,
                    name=f"{location} Dispatcher"
                )
                db.add(dispatcher)
            
            # Update dispatcher data
            dispatcher.base_rates = normalized_data.get("calendar_data", {}).get("daily_rates", {})
            dispatcher.crew_rates = normalized_data.get("pricing_model", {}).get("crew_rates", {})
            
            # Store additional data in JSON fields
            dispatcher.fuel_charges = {
                "pricing_model": normalized_data.get("pricing_model", {}),
                "operational_rules": normalized_data.get("operational_rules", {}),
                "last_updated": normalized_data.get("last_updated")
            }
            
            db.commit()
            logger.info(f"Updated database cache for dispatcher: {location}")
            
        except Exception as e:
            logger.error(f"Error updating database cache for {location}: {e}")
            db.rollback()
    
    def get_daily_rate(self, location: str, target_date: date, db: Session) -> Optional[float]:
        """Get daily rate for a specific location and date"""
        dispatcher_data = self.get_dispatcher_data(location, db)
        if not dispatcher_data:
            return None
        
        date_key = target_date.isoformat()
        daily_rates = dispatcher_data.get("calendar_data", {}).get("daily_rates", {})
        
        # Check if date is restricted
        if self._is_restricted_date(target_date, dispatcher_data):
            restricted_rate = dispatcher_data.get("calendar_data", {}).get("restricted_rate", 0.0)
            return restricted_rate if restricted_rate > 0 else None
        
        # Return the specific date rate or None if not available
        return daily_rates.get(date_key)
    
    def _is_restricted_date(self, target_date: date, dispatcher_data: Dict[str, Any]) -> bool:
        """Check if a date falls in restricted period"""
        restricted_dates = dispatcher_data.get("calendar_data", {}).get("restricted_dates", [])
        
        for restricted in restricted_dates:
            # Parse patterns like "27TH - 3RD"
            if self._is_date_in_restricted_period(target_date, restricted):
                return True
        
        return False
    
    def _is_date_in_restricted_period(self, target_date: date, restricted_text: str) -> bool:
        """Check if date falls in restricted period"""
        # This is a simplified check - you might need more sophisticated logic
        # based on the actual restricted date patterns
        
        # For now, check if it's the 27th-3rd period
        day = target_date.day
        return day >= 27 or day <= 3
    
    def _get_default_rate(self, daily_rates: Dict[str, float]) -> float:
        """Get default rate from daily rates"""
        if not daily_rates:
            return 0.0  # No fallback - use live data only
        
        # Use the most common rate as default
        rate_counts = {}
        for rate in daily_rates.values():
            rate_counts[rate] = rate_counts.get(rate, 0) + 1
        
        if rate_counts:
            return max(rate_counts, key=rate_counts.get)
        
        return 0.0  # No fallback - use live data only
    
    def _get_restricted_rate(self, daily_rates: Dict[str, float]) -> float:
        """Get restricted rate from live data"""
        if not daily_rates:
            return 0.0  # No fallback - use live data only
        
        # Use the highest rate as restricted rate
        return max(daily_rates.values()) if daily_rates else 0.0
    
    def get_crew_rate(self, location: str, crew_size: int, db: Session) -> Optional[float]:
        """Get crew rate for a specific location and crew size"""
        dispatcher_data = self.get_dispatcher_data(location, db)
        if not dispatcher_data:
            return None
        
        crew_rates = dispatcher_data.get("pricing_model", {}).get("crew_rates", {})
        return crew_rates.get(crew_size)
    
    def get_truck_pricing(self, location: str, truck_count: int, crew_size: int, db: Session) -> Optional[Dict[str, float]]:
        """Get truck pricing for specific configuration"""
        dispatcher_data = self.get_dispatcher_data(location, db)
        if not dispatcher_data:
            return None
        
        truck_pricing = dispatcher_data.get("pricing_model", {}).get("truck_pricing", {})
        truck_key = f"{truck_count}_truck"
        
        return truck_pricing.get(truck_key, {}).get(crew_size)
    
    def get_operational_rules(self, location: str, db: Session) -> Optional[Dict[str, Any]]:
        """Get operational rules for a location"""
        dispatcher_data = self.get_dispatcher_data(location, db)
        if not dispatcher_data:
            return None
        
        return dispatcher_data.get("operational_rules", {})
    
    def refresh_all_caches(self, db: Session) -> Dict[str, bool]:
        """Refresh cache for all dispatchers"""
        results = {}
        
        try:
            # Get all dispatcher locations from Google Sheets
            all_data = google_sheets_service.get_all_dispatchers_data()
            
            for location in all_data.keys():
                success = self._update_dispatcher_cache(location, db) is not None
                results[location] = success
            
            logger.info(f"Refreshed cache for {len(results)} dispatchers")
            
        except Exception as e:
            logger.error(f"Error refreshing all caches: {e}")
        
        return results
    
    def get_cache_status(self) -> Dict[str, Any]:
        """Get cache status for all locations"""
        status = {}
        
        for location in self.cache_data.keys():
            last_update = self.last_update.get(location)
            if last_update:
                cache_age = datetime.now() - last_update
                status[location] = {
                    "last_updated": last_update.isoformat(),
                    "age_hours": cache_age.total_seconds() / 3600,
                    "is_valid": self._is_cache_valid(location)
                }
        
        return status
    
    def clear_all_cache(self):
        """Clear all cached data"""
        self.cache_data.clear()
        self.last_update.clear()
        self._all_dispatchers_cache = None
        self._all_dispatchers_last_update = None
        logger.info("🧹 All dispatcher cache cleared")
    
    def get_all_dispatchers_cached(self, db: Session) -> Dict[str, Any]:
        """Get all dispatchers data with efficient caching"""
        # Check if we have valid cached data
        if self._all_dispatchers_cache and self._all_dispatchers_last_update:
            cache_age = datetime.now() - self._all_dispatchers_last_update
            if cache_age.total_seconds() < (self.cache_ttl_hours * 3600):
                logger.info(f"✅ Using cached dispatchers data ({len(self._all_dispatchers_cache)} dispatchers)")
                return self._all_dispatchers_cache
        
        # Load fresh data from Google Sheets
        logger.info("🔄 Loading fresh dispatchers data from Google Sheets...")
        try:
            from app.services.google_sheets_service import google_sheets_service
            all_dispatchers = google_sheets_service.get_all_dispatchers_data()
            
            if all_dispatchers:
                # Cache the data
                self._all_dispatchers_cache = all_dispatchers
                self._all_dispatchers_last_update = datetime.now()
                logger.info(f"✅ Loaded {len(all_dispatchers)} dispatchers and cached for {self.cache_ttl_hours} hours")
                return all_dispatchers
            else:
                logger.error("❌ Failed to load dispatchers data from Google Sheets")
                return {}
                
        except Exception as e:
            logger.error(f"❌ Error loading dispatchers data: {e}")
            return {}

    def find_closest_location(self, address: str, all_data: Dict[str, Any]) -> str:
        """Find the closest location using TRUE data only - no fallbacks"""
        from app.services.mapbox_service import mapbox_service
        from datetime import datetime
        
        logger.info(f"🔍 Finding closest location for address: {address}")
        logger.info(f"🔍 Total dispatchers available: {len(all_data)}")
        
        def haversine(coord1, coord2):
            """Calculate distance between two coordinates using Haversine formula"""
            if not coord1 or not coord2:
                return float('inf')
            lat1, lon1 = coord1[0], coord1[1]
            lat2, lon2 = coord2[0], coord2[1]
            R = 6371  # Earth radius in km
            phi1 = math.radians(lat1)
            phi2 = math.radians(lat2)
            dphi = math.radians(lat2 - lat1)
            dlambda = math.radians(lon2 - lon1)
            a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            return R * c
        
        def has_complete_data(data: Dict[str, Any]) -> bool:
            """Check if dispatcher has complete data"""
            location_details = data.get('location_details', {})
            calendar_data = data.get('calendar_data', {})
            daily_rates = calendar_data.get('daily_rates', {})
            
            # Check if we have a location name
            has_location = location_details.get('name') and location_details.get('name') != 'Unknown'
            
            # Check if we have daily rates (at least some)
            has_rates = len(daily_rates) > 0
            
            # Check if we have coordinates (either format)
            has_coordinates = False
            if data.get('coordinates'):
                coords = data.get('coordinates', {})
                if isinstance(coords, dict) and coords.get('lat') and coords.get('lng'):
                    has_coordinates = True
                elif isinstance(coords, (list, tuple)) and len(coords) == 2:
                    has_coordinates = True
            
            # Log what we're missing for debugging
            if not has_location:
                logger.warning(f"❌ Missing location name for dispatcher")
            if not has_rates:
                logger.warning(f"❌ Missing daily rates for dispatcher")
            if not has_coordinates:
                logger.warning(f"❌ Missing coordinates for dispatcher")
            
            return has_location and has_rates and has_coordinates
        
        def is_valid_service_area(dispatcher_name: str, user_address: str) -> bool:
            """Validate service area - TRUE geographic logic only"""
            user_address_lower = user_address.lower()
            dispatcher_name_lower = dispatcher_name.lower()
            
            # GTA service areas
            gta_keywords = ['toronto', 'scarborough', 'north york', 'etobicoke', 'york', 'east york', 
                           'mississauga', 'brampton', 'vaughan', 'markham', 'richmond hill', 
                           'oakville', 'burlington', 'hamilton', 'oshawa', 'whitby', 'ajax', 'pickering']
            
            # BC service areas
            bc_keywords = ['vancouver', 'burnaby', 'surrey', 'richmond', 'coquitlam', 'langley', 'delta', 'maple ridge']
            
            # Ontario service areas
            ontario_keywords = ['barrie', 'windsor', 'sudbury', 'waterloo', 'kitchener', 'niagara falls', 'ottawa']
            
            # Quebec service areas
            quebec_keywords = ['montreal']
            
            # Check GTA
            if any(keyword in user_address_lower for keyword in gta_keywords):
                if any(keyword in dispatcher_name_lower for keyword in gta_keywords) or 'toronto' in dispatcher_name_lower:
                    return True
                else:
                    logger.warning(f"❌ Geographic mismatch: GTA user {user_address} -> {dispatcher_name}")
                    return False
            
            # Check BC
            if any(keyword in user_address_lower for keyword in bc_keywords):
                if any(keyword in dispatcher_name_lower for keyword in bc_keywords) or 'vancouver' in dispatcher_name_lower:
                    return True
                else:
                    logger.warning(f"❌ Geographic mismatch: BC user {user_address} -> {dispatcher_name}")
                    return False
            
            # Check Ontario
            if any(keyword in user_address_lower for keyword in ontario_keywords):
                if any(keyword in dispatcher_name_lower for keyword in ontario_keywords):
                    return True
                else:
                    logger.warning(f"❌ Geographic mismatch: Ontario user {user_address} -> {dispatcher_name}")
                    return False
            
            # Check Quebec
            if any(keyword in user_address_lower for keyword in quebec_keywords):
                if any(keyword in dispatcher_name_lower for keyword in quebec_keywords):
                    return True
                else:
                    logger.warning(f"❌ Geographic mismatch: Quebec user {user_address} -> {dispatcher_name}")
                    return False
            
            return True  # Allow for unknown regions
        
        # Get user coordinates
        user_coords = mapbox_service.get_coordinates(address)
        if not user_coords:
            logger.error(f"❌ Failed to get coordinates for address: {address}")
            return None
        
        logger.info(f"📍 User coordinates: {user_coords}")
        
        # Find valid dispatchers with coordinates
        valid_dispatchers = []
        
        for gid, data in all_data.items():
            location_details = data.get('location_details', {})
            name = location_details.get('name', 'Unknown')
            coords = data.get('coordinates', {})
            
            # Only consider dispatchers with complete data
            if not has_complete_data(data):
                logger.warning(f"❌ {name} incomplete data - skipping")
                continue
            
            # Only consider dispatchers in valid service area
            if not is_valid_service_area(name, address):
                logger.warning(f"❌ {name} invalid service area - skipping")
                continue
            
            # Calculate distance
            if isinstance(coords, dict):
                loc_tuple = (coords.get('lat', 0), coords.get('lng', 0))
            else:
                loc_tuple = coords
            
            if loc_tuple and loc_tuple != (0, 0):
                distance = haversine(user_coords, loc_tuple)
                valid_dispatchers.append((gid, data, distance, name))
                logger.info(f"✅ {name}: {distance:.2f}km")
            else:
                logger.warning(f"❌ {name} invalid coordinates: {coords}")
        
        if not valid_dispatchers:
            logger.error("❌ No valid dispatchers found with coordinates and service area")
            return None
        
        # Sort by distance (closest first)
        valid_dispatchers.sort(key=lambda x: x[2])
        
        # Select the closest dispatcher
        best_gid, best_data, best_distance, best_name = valid_dispatchers[0]
        
        logger.info(f"🎯 Selected dispatcher: {best_name} at {best_distance:.2f}km")
        return best_gid

# Global instance
dispatcher_cache_service = DispatcherCacheService() 