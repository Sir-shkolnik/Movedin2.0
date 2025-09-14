#!/usr/bin/env python3
"""
Standalone Let's Get Moving Service
Completely independent system that works with its own logic
"""

import requests
import csv
import io
import re
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import logging
from .smart_calendar_parser import SmartCalendarParser

logger = logging.getLogger(__name__)

class StandaloneLGMService:
    """Standalone Let's Get Moving service that works independently"""
    
    def __init__(self):
        # Initialize smart calendar parser
        self.smart_parser = SmartCalendarParser()
        
        # GID to location mapping based on actual analysis
        self.gid_location_map = {
            '586231927': 'Abbotsford',
            '759134820': 'Ajax', 
            '2023718082': 'Aurora',
            '205064403': 'Barrie',
            '1902434505': 'Brantford',
            '685880450': 'Burlington',
            '1985906253': 'Burnaby',
            '1384980803': 'Calgary',
            '2061150538': 'Coquitlam',
            '1324028052': 'Downtown Toronto',
            '1846632241': 'Edmonton',
            '627208617': 'Fredericton',
            '1843371269': 'Halifax',
            '858770585': 'Hamilton',
            '551728640': 'Kelowna',
            '478561055': 'Kingston',
            '1613243722': 'Lethbridge',
            '1311971885': 'London',
            '853107228': 'Markham',
            '120281503': 'Milton',
            '429580526': 'Mississauga',
            '159313789': 'Moncton',
            '1591534972': 'Montreal',
            '851484086': 'Oakville',
            '225755820': 'Montreal North',
            '805965695': 'Oshawa',
            '268519783': 'Ottawa',
            '1005327863': 'Peterborough',
            '348861685': 'Toronto (North York)',
            '445545962': 'Richmond BC',
            '1604601748': 'Vaughan',
            '1211144815': 'Victoria',
            '1802285746': 'Kitchener',
            '322544773': 'Montreal',
            '1257914670': 'Windsor',
            '1904136712': 'Winnipeg'
        }
        
        # Google Sheets URLs - CORRECTED
        self.base_url = "https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid="
        
        # Service areas for Let's Get Moving - 50km radius from each dispatcher
        self.dispatcher_coordinates = {
            "Toronto": {"lat": 43.6532, "lng": -79.3832},
            "North York": {"lat": 43.7615, "lng": -79.4111},
            "Scarborough": {"lat": 43.7767, "lng": -79.2313},
            "Etobicoke": {"lat": 43.6532, "lng": -79.5673},
            "York": {"lat": 43.6896, "lng": -79.4941},
            "East York": {"lat": 43.6900, "lng": -79.3274},
            "Mississauga": {"lat": 43.5890, "lng": -79.6441},
            "Brampton": {"lat": 43.6834, "lng": -79.7663},
            "Vaughan": {"lat": 43.8361, "lng": -79.4983},
            "Markham": {"lat": 43.8561, "lng": -79.3370},
            "Richmond Hill": {"lat": 43.8828, "lng": -79.4403},
            "Oakville": {"lat": 43.4675, "lng": -79.6877},
            "Burlington": {"lat": 43.3255, "lng": -79.7990},
            "Hamilton": {"lat": 43.2557, "lng": -79.8711},
            "Oshawa": {"lat": 43.8971, "lng": -78.8658},
            "Whitby": {"lat": 43.8975, "lng": -78.9428},
            "Ajax": {"lat": 43.8501, "lng": -79.0329},
            "Pickering": {"lat": 43.8114, "lng": -79.0235},
            "Barrie": {"lat": 44.3894, "lng": -79.6903},
            "Aurora": {"lat": 44.0054, "lng": -79.4663},
            "Brantford": {"lat": 43.1394, "lng": -80.2644},
            "Kitchener": {"lat": 43.4501, "lng": -80.4829},
            "Waterloo": {"lat": 43.4643, "lng": -80.5204},
            "Windsor": {"lat": 42.3149, "lng": -83.0364},
            "Peterborough": {"lat": 44.3091, "lng": -78.3197},
            "Vancouver": {"lat": 49.2827, "lng": -123.1207},
            "Burnaby": {"lat": 49.2488, "lng": -122.9805},
            "Richmond": {"lat": 49.1666, "lng": -123.1336},
            "Victoria": {"lat": 48.4284, "lng": -123.3656},
            "Abbotsford": {"lat": 49.0504, "lng": -122.3045},
            "Port Moody": {"lat": 49.2831, "lng": -122.8326},
            "Surrey": {"lat": 49.1913, "lng": -122.8490},
            "Coquitlam": {"lat": 49.2838, "lng": -122.7932},
            "Maple Ridge": {"lat": 49.2194, "lng": -122.6019},
            "Langley": {"lat": 49.1041, "lng": -122.6601},
            "Delta": {"lat": 49.0847, "lng": -122.9000},
            "Port Coquitlam": {"lat": 49.2625, "lng": -122.7811},
            "Calgary": {"lat": 51.0447, "lng": -114.0719},
            "Edmonton": {"lat": 53.5461, "lng": -113.4938},
            "Montreal": {"lat": 45.5017, "lng": -73.5673},
            "Winnipeg": {"lat": 49.8951, "lng": -97.1384},
            "Halifax": {"lat": 44.6488, "lng": -63.5752},
            "Fredericton": {"lat": 45.9636, "lng": -66.6431}
        }
        
        # Maximum service radius in kilometers
        self.max_service_radius_km = 50
        
        # Cache for dispatcher data
        self.dispatcher_cache = {}
        self.cache_timestamp = None
        self.cache_ttl = 3600  # 1 hour cache
        
    def get_dispatcher_data(self, gid: str) -> Optional[Dict[str, Any]]:
        """Get dispatcher data for a specific GID"""
        try:
            url = f"{self.base_url}{gid}"
            logger.info(f"🔍 LGM Fetching data for GID {gid}: {url}")
            
            # Follow redirects to get the actual CSV data
            response = requests.get(url, timeout=30, allow_redirects=True)
            response.raise_for_status()
            
            logger.info(f"✅ LGM Data fetched successfully: {len(response.text)} characters")
            
            # Parse CSV
            csv_content = response.text
            csv_reader = csv.reader(io.StringIO(csv_content))
            rows = list(csv_reader)
            
            logger.info(f"✅ LGM CSV parsed: {len(rows)} rows")
            
            # Extract location name
            location_name = self.gid_location_map.get(gid, f"Location_{gid}")
            
            # Extract calendar data using direct CSV parsing
            csv_content = response.text
            calendar_data = self._extract_calendar_data_direct(csv_content)
            
            logger.info(f"📅 LGM Calendar Data Extracted:")
            logger.info(f"  Total entries: {len(calendar_data)}")
            logger.info(f"  Sample dates: {list(calendar_data.keys())[:5]}")
            logger.info(f"  Sample prices: {list(calendar_data.values())[:5]}")
            
            # Extract location details using smart parser
            location_details = self.smart_parser.extract_location_details_fixed(csv_content)
            
            return {
                "gid": gid,
                "location_name": location_name,
                "location_details": location_details,
                "calendar_data": calendar_data,
                "coordinates": self._get_coordinates(location_name),
                "operational_rules": {},
                "base_rates": calendar_data
            }
            
        except Exception as e:
            logger.error(f"Error getting dispatcher data for GID {gid}: {e}")
            return None
    
    def _extract_calendar_data_direct(self, csv_content: str) -> Dict[str, float]:
        """Extract calendar data directly from CSV content - SIMPLE AND EFFECTIVE"""
        calendar_data = {}
        
        try:
            # Split into lines
            lines = csv_content.split('\n')
            
            # Find month headers and extract data
            for i, line in enumerate(lines):
                if 'YORK' in line and ('MAR' in line or 'APR' in line or 'MAY' in line or 'JUN' in line or 'JUL' in line or 'AUG' in line or 'SEP' in line or 'OCT' in line or 'NOV' in line or 'DEC' in line):
                    # Found a month header line
                    logger.info(f"📅 Found month header: {line}")
                    
                    # Extract months from this line
                    months = []
                    if 'MAR' in line: months.append(('MAR', '03'))
                    if 'APR' in line: months.append(('APR', '04'))
                    if 'MAY' in line: months.append(('MAY', '05'))
                    if 'JUN' in line: months.append(('JUN', '06'))
                    if 'JUL' in line: months.append(('JUL', '07'))
                    if 'AUG' in line: months.append(('AUG', '08'))
                    if 'SEP' in line: months.append(('SEP', '09'))
                    if 'OCT' in line: months.append(('OCT', '10'))
                    if 'NOV' in line: months.append(('NOV', '11'))
                    if 'DEC' in line: months.append(('DEC', '12'))
                    
                    # Look for calendar data in the next few lines
                    for j in range(i + 1, min(i + 20, len(lines))):
                        data_line = lines[j]
                        if 'SUNDAY,MONDAY,TUESDAY' in data_line:
                            # Found calendar header, extract data from next lines
                            for k in range(j + 1, min(j + 15, len(lines))):
                                date_line = lines[k]
                                price_line = lines[k + 1] if k + 1 < len(lines) else ""
                                
                                if date_line and price_line and ',' in date_line and ',' in price_line:
                                    # Parse dates and prices
                                    date_parts = [x.strip() for x in date_line.split(',')]
                                    price_parts = [x.strip() for x in price_line.split(',')]
                                    
                                    # Extract data for each month
                                    for month_name, month_num in months:
                                        # Find the position of this month in the line
                                        month_pos = line.find(month_name)
                                        if month_pos != -1:
                                            # Calculate the column position for this month
                                            month_col = line[:month_pos].count(',')
                                            
                                            # Extract dates and prices for this month
                                            for col in range(month_col, min(month_col + 7, len(date_parts))):
                                                if col < len(date_parts) and col < len(price_parts):
                                                    date_str = date_parts[col]
                                                    price_str = price_parts[col]
                                                    
                                                    if date_str.isdigit() and price_str.replace('.', '').isdigit():
                                                        try:
                                                            day_num = int(date_str)
                                                            # Validate day number (1-31)
                                                            if 1 <= day_num <= 31:
                                                                date_key = f"2025-{month_num}-{day_num:02d}"
                                                                price_value = float(price_str)
                                                                calendar_data[date_key] = price_value
                                                                logger.info(f"📅 Added {date_key}: ${price_value}")
                                                        except (ValueError, IndexError):
                                                            continue
                            break
            
            # If no calendar data found, create Q4 2025 default rates
            if not calendar_data:
                logger.warning("⚠️ No calendar data found, using Q4 2025 default rates")
                # Generate Q4 2025 dates (October, November, December)
                for month in ['10', '11', '12']:
                    for day in range(1, 32):
                        try:
                            date_str = f"2025-{month}-{day:02d}"
                            # Validate the date
                            datetime.strptime(date_str, '%Y-%m-%d')
                            calendar_data[date_str] = 139.0
                        except ValueError:
                            # Invalid date (e.g., Feb 30), skip
                            continue
            
            logger.info(f"📅 Calendar data extraction complete: {len(calendar_data)} entries")
            return calendar_data
            
        except Exception as e:
            logger.error(f"Error extracting calendar data: {e}")
            # Return Q4 2025 default rates on error
            for month in ['10', '11', '12']:
                for day in range(1, 32):
                    try:
                        date_str = f"2025-{month}-{day:02d}"
                        datetime.strptime(date_str, '%Y-%m-%d')
                        calendar_data[date_str] = 139.0
                    except ValueError:
                        continue
            return calendar_data
    
    # Removed old location details extraction method - now using SmartCalendarParser
    
    def _estimate_hours(self, total_rooms: int, crew_size: int) -> float:
        """Estimate total hours for the move - REALISTIC LGM LOGIC"""
        # Base hours per room (similar to other vendors)
        if total_rooms <= 1:
            base_hours = 3.0  # 1 room = 3 hours
        elif total_rooms <= 2:
            base_hours = 4.0  # 2 rooms = 4 hours
        elif total_rooms <= 3:
            base_hours = 5.5  # 3 rooms = 5.5 hours (like other vendors)
        elif total_rooms <= 4:
            base_hours = 6.5  # 4 rooms = 6.5 hours
        elif total_rooms <= 5:
            base_hours = 7.5  # 5 rooms = 7.5 hours (like other vendors)
        elif total_rooms <= 6:
            base_hours = 8.5  # 6 rooms = 8.5 hours
        else:
            base_hours = 9.0 + (total_rooms - 6) * 0.5  # 9+ hours for larger moves
        
        # Crew efficiency factor (more crew = slightly less time, but not dramatic)
        if crew_size >= 4:
            crew_factor = 0.9  # 4+ crew = 10% time reduction
        elif crew_size == 3:
            crew_factor = 1.0  # 3 crew = standard time
        else:
            crew_factor = 1.1  # 2 crew = 10% time increase
        
        estimated_hours = base_hours * crew_factor
        return round(max(2.0, estimated_hours), 1)  # Minimum 2 hours
    
    def _estimate_travel_time(self, quote_request: Dict[str, Any]) -> float:
        """Estimate travel time between locations based on distance"""
        try:
            origin = quote_request.get("origin_address", "")
            destination = quote_request.get("destination_address", "")
            
            if not origin or not destination:
                return 1.0
            
            # Extract cities
            origin_city = self._extract_city(origin)
            dest_city = self._extract_city(destination)
            
            if not origin_city or not dest_city:
                return 1.0
            
            # Get coordinates
            origin_coords = self._get_coordinates_for_city(origin_city)
            dest_coords = self._get_coordinates_for_city(dest_city)
            
            if not origin_coords or not dest_coords:
                return 1.0
            
            # Calculate distance
            distance_km = self._calculate_distance_km(origin_coords, dest_coords)
            
            # Estimate travel time (assuming average speed of 60 km/h for trucks)
            # Add 30% for traffic and truck factor
            base_travel_time = distance_km / 60.0  # hours
            truck_factor = 1.3
            estimated_travel_time = base_travel_time * truck_factor
            
            # Check 10-hour travel time limit - LGM doesn't do these moves
            if estimated_travel_time > 10:
                logger.info(f"LGM: Travel time {estimated_travel_time:.1f}h exceeds 10h limit for long distance moves")
                raise ValueError(f"Travel time {estimated_travel_time:.1f}h exceeds 10h limit")
            
            # Minimum 0.5 hours
            return max(0.5, estimated_travel_time)
            
        except Exception as e:
            logger.error(f"Error calculating travel time: {e}")
            logger.error(f"Origin: {origin}, Destination: {destination}")
            # For debugging - don't return fallback, let it fail
            raise e
    
    def _get_available_slots(self, dispatcher_data: Dict[str, Any], move_date: str) -> List[str]:
        """Get available time slots for the move date"""
        # Return some default time slots
        return ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
    
    def _get_month_number(self, month_name: str) -> Optional[int]:
        """Get month number from month name"""
        month_map = {
            'JAN': 1, 'FEB': 2, 'MAR': 3, 'APR': 4,
            'MAY': 5, 'JUN': 6, 'JUL': 7, 'AUG': 8,
            'SEP': 9, 'OCT': 10, 'NOV': 11, 'DEC': 12
        }
        return month_map.get(month_name.upper())
    
    def _get_coordinates(self, location_name: str) -> Dict[str, float]:
        """Get coordinates for location (placeholder)"""
        # Default coordinates for major cities
        default_coords = {
            "Toronto": {"lat": 43.6532, "lng": -79.3832},
            "Vancouver": {"lat": 49.2827, "lng": -123.1207},
            "Calgary": {"lat": 51.0447, "lng": -114.0719},
            "Montreal": {"lat": 45.5017, "lng": -73.5673},
            "Winnipeg": {"lat": 49.8951, "lng": -97.1384},
            "Halifax": {"lat": 44.6488, "lng": -63.5752},
            "Fredericton": {"lat": 45.9636, "lng": -66.6431}
        }
        
        for city, coords in default_coords.items():
            if city.lower() in location_name.lower():
                return coords
        
        return {"lat": 43.6532, "lng": -79.3832}  # Default to Toronto
    
    def find_best_dispatcher(self, origin: str, destination: str, move_date: str) -> Optional[Dict[str, Any]]:
        """Find the best dispatcher for the given route"""
        try:
            # Extract city from origin
            origin_city = self._extract_city(origin)
            dest_city = self._extract_city(destination)
            
            if not origin_city:
                return None
            
            # Find dispatchers that serve this area
            suitable_dispatchers = []
            
            for gid, location_name in self.gid_location_map.items():
                if self._serves_location(location_name, origin_city):
                    dispatcher_data = self.get_dispatcher_data(gid)
                    if dispatcher_data and dispatcher_data.get("calendar_data"):
                        suitable_dispatchers.append(dispatcher_data)
            
            if not suitable_dispatchers:
                return None
            
            # Return the first suitable dispatcher (closest logic can be added later)
            return suitable_dispatchers[0]
            
        except Exception as e:
            logger.error(f"Error finding best dispatcher: {e}")
            return None
    
    def _extract_city(self, address: str) -> Optional[str]:
        """Extract city name from address"""
        if not address:
            return None
        
        address_lower = address.lower()
        logger.info(f"🔍 LGM _extract_city: '{address}' -> '{address_lower}'")
        
        # Check for major cities
        for city in ["toronto", "vancouver", "calgary", "montreal", "winnipeg", "halifax", "fredericton"]:
            if city in address_lower:
                logger.info(f"✅ Found major city: {city}")
                return city.title()
        
        # Check for GTA cities
        gta_cities = ["mississauga", "brampton", "vaughan", "markham", "richmond hill", "oakville", "burlington", "hamilton", "oshawa", "whitby", "ajax", "pickering", "barrie", "aurora", "brantford", "kitchener", "waterloo", "windsor", "peterborough"]
        for city in gta_cities:
            if city in address_lower:
                logger.info(f"✅ Found GTA city: {city}")
                return city.title()
        
        # Check for BC cities
        bc_cities = ["burnaby", "richmond", "victoria", "abbotsford", "port moody", "surrey", "coquitlam", "maple ridge", "langley", "delta", "port coquitlam"]
        for city in bc_cities:
            if city in address_lower:
                logger.info(f"✅ Found BC city: {city}")
                return city.title()
        
        logger.warning(f"❌ No city found in address: {address}")
        return None
    
    def _serves_location(self, dispatcher_location: str, user_city: str) -> bool:
        """Check if dispatcher serves the user's location within 50km radius"""
        if not user_city or not dispatcher_location:
            logger.warning(f"❌ Missing city or dispatcher location: user_city='{user_city}', dispatcher_location='{dispatcher_location}'")
            return False
        
        logger.info(f"🔍 LGM _serves_location: user_city='{user_city}', dispatcher_location='{dispatcher_location}'")
        
        # Get coordinates for both locations
        user_coords = self._get_coordinates_for_city(user_city)
        dispatcher_coords = self._get_coordinates_for_city(dispatcher_location)
        
        if not user_coords or not dispatcher_coords:
            logger.warning(f"❌ Missing coordinates: user_coords={user_coords}, dispatcher_coords={dispatcher_coords}")
            return False
        
        # Calculate distance using Haversine formula
        distance_km = self._calculate_distance_km(user_coords, dispatcher_coords)
        
        logger.info(f"🔍 Distance: {distance_km:.2f}km (max: {self.max_service_radius_km}km)")
        
        if distance_km <= self.max_service_radius_km:
            logger.info(f"✅ Within service radius: {distance_km:.2f}km <= {self.max_service_radius_km}km")
            return True
        else:
            logger.warning(f"❌ Outside service radius: {distance_km:.2f}km > {self.max_service_radius_km}km")
            return False
    
    def _get_coordinates_for_city(self, city_name: str) -> Optional[Dict[str, float]]:
        """Get coordinates for a city name"""
        city_lower = city_name.lower()
        
        # Try exact match first
        for city, coords in self.dispatcher_coordinates.items():
            if city.lower() == city_lower:
                return coords
        
        # Try partial match
        for city, coords in self.dispatcher_coordinates.items():
            if city_lower in city.lower() or city.lower() in city_lower:
                return coords
        
        # Default coordinates for unknown cities (will be rejected by distance check)
        return {"lat": 0.0, "lng": 0.0}
    
    def _calculate_distance_km(self, coords1: Dict[str, float], coords2: Dict[str, float]) -> float:
        """Calculate distance between two coordinates using Haversine formula"""
        import math
        
        lat1, lng1 = coords1["lat"], coords1["lng"]
        lat2, lng2 = coords2["lat"], coords2["lng"]
        
        # Convert to radians
        lat1_rad = math.radians(lat1)
        lng1_rad = math.radians(lng1)
        lat2_rad = math.radians(lat2)
        lng2_rad = math.radians(lng2)
        
        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlng = lng2_rad - lng1_rad
        
        a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Earth's radius in kilometers
        earth_radius_km = 6371
        
        return earth_radius_km * c
    
    def _calculate_move_distance(self, origin: str, destination: str) -> float:
        """Calculate distance between origin and destination"""
        try:
            origin_city = self._extract_city(origin)
            dest_city = self._extract_city(destination)
            
            if not origin_city or not dest_city:
                return 0.0
            
            origin_coords = self._get_coordinates_for_city(origin_city)
            dest_coords = self._get_coordinates_for_city(dest_city)
            
            if not origin_coords or not dest_coords:
                return 0.0
            
            return self._calculate_distance_km(origin_coords, dest_coords)
            
        except Exception as e:
            logger.error(f"Error calculating move distance: {e}")
            return 0.0
    
    def calculate_quote(self, quote_request: Dict[str, Any], dispatcher_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate quote for Let's Get Moving"""
        try:
            # Let the regular calculation logic handle distance validation
            
            # Get base rate for the move date
            move_date = quote_request.get("move_date", "2025-02-15")
            calendar_data = dispatcher_data.get("calendar_data", {})
            base_rate = calendar_data.get(move_date, 139.0)
            
            logger.info(f"🔍 LGM Calendar Data Debug:")
            logger.info(f"  Move Date: {move_date}")
            logger.info(f"  Calendar Data Keys: {list(calendar_data.keys())[:10]}...")  # Show first 10 keys
            logger.info(f"  Base Rate for {move_date}: {base_rate}")
            logger.info(f"  Total Calendar Entries: {len(calendar_data)}")
            
            # Check if the move date exists in calendar data
            if move_date in calendar_data:
                logger.info(f"✅ Found exact date match: {move_date} = ${calendar_data[move_date]}")
            else:
                logger.warning(f"⚠️ No exact date match for {move_date}, using fallback rate")
                # Try to find closest date
                for date_key in sorted(calendar_data.keys()):
                    if date_key.startswith(move_date[:7]):  # Same month
                        logger.info(f"  Found same month date: {date_key} = ${calendar_data[date_key]}")
                        break
            
            # Calculate crew size and truck count
            total_rooms = quote_request.get("total_rooms", 3)
            crew_size = self._calculate_crew_size(total_rooms)
            truck_count = self._calculate_truck_count(total_rooms)
            
            # Calculate distance and travel time
            origin = quote_request.get("origin_address", "")
            destination = quote_request.get("destination_address", "")
            distance_km = self._calculate_move_distance(origin, destination)
            travel_time_hours = self._estimate_travel_time(quote_request)
            
            # CORRECT LGM LOGIC: Based on official matrix and rules
            # 1. Calculate labor hours (minimum 2 hours always)
            labor_hours = max(2.0, self._estimate_hours(total_rooms, crew_size))
            stair_time = self._calculate_stair_time(quote_request)
            total_labor_hours = labor_hours + stair_time
            
            # 2. Calculate travel time charges (house to house) - FULL HOURLY RATE
            travel_hours = max(0.5, travel_time_hours)  # Minimum 30 minutes travel time
            
            # 3. Check if long distance move (travel time > 1h45m = 1.75 hours)
            is_long_distance = travel_time_hours > 1.75
            
            # 4. Get correct hourly rate from matrix based on trucks and crew
            hourly_rate = self._get_hourly_rate_from_matrix(truck_count, crew_size, is_long_distance)
            
            # 5. Calculate costs - BOTH labor and travel use FULL hourly rate
            labor_cost = total_labor_hours * hourly_rate
            travel_cost = travel_hours * hourly_rate
            
            # 6. Long distance gas fees (when travel time > 1h45m)
            gas_fees = 0.0
            if is_long_distance:
                gas_fees = self._calculate_long_distance_gas_fees(distance_km, truck_count)
            
            # 7. Calculate heavy items cost (fixed price + small time addition)
            heavy_items_cost = self._calculate_heavy_items_cost_fixed(quote_request.get("heavy_items", {}), hourly_rate)
            
            # 8. Calculate additional services cost (vendor will quote separately)
            additional_services_cost = self._calculate_additional_services_cost(quote_request.get("additional_services", {}))
            
            # 9. Calculate total cost
            total_cost = labor_cost + travel_cost + gas_fees + heavy_items_cost + additional_services_cost
            
            # 10. Calculate effective hourly rate for display
            total_hours = total_labor_hours + travel_hours
            effective_hourly_rate = total_cost / total_hours if total_hours > 0 else hourly_rate
            
            return {
                "vendor_slug": "lets-get-moving",
                "vendor_name": "Let's Get Moving",
                "total_cost": round(total_cost, 2),
                "base_cost": round(labor_cost, 2),
                "travel_fees": round(travel_cost, 2),
                "gas_fees": round(gas_fees, 2),
                "crew_size": crew_size,
                "truck_count": truck_count,
                "breakdown": {
                    "labor_cost": round(labor_cost, 2),
                    "travel_cost": round(travel_cost, 2),
                    "gas_fees": round(gas_fees, 2),
                    "heavy_items": round(heavy_items_cost, 2),
                    "additional_services": round(additional_services_cost, 2),
                    "crew_size": crew_size,
                    "truck_count": truck_count,
                    "is_long_distance": is_long_distance
                },
                "estimated_hours": round(total_labor_hours, 1),
                "travel_time_hours": round(travel_hours, 1),
                "total_hours": round(total_hours, 1),
                "hourly_rate": round(effective_hourly_rate, 2),
                "base_hourly_rate": round(hourly_rate, 2),
                "travel_hourly_rate": round(hourly_rate, 2),
                "available_slots": self._get_available_slots(dispatcher_data, move_date),
                "base_rate": base_rate,
                "heavy_items_cost": round(heavy_items_cost, 2),
                "additional_services_cost": round(additional_services_cost, 2),
                "special_notes": f"Hourly-based pricing: Labor + Travel time + {'Long distance gas fees' if is_long_distance else 'Local move'}. Additional services quoted separately.",
                "dispatcher_info": {
                    "name": dispatcher_data.get("location_name", "Unknown"),
                    "address": dispatcher_data.get("location_details", {}).get("address", ""),
                    "sales_phone": dispatcher_data.get("location_details", {}).get("sales_phone", ""),
                    "email": dispatcher_data.get("location_details", {}).get("email", ""),
                    "truck_count": dispatcher_data.get("location_details", {}).get("truck_count", ""),
                    "location_name": dispatcher_data.get("location_name", "Unknown"),
                    "gmb_url": f"https://www.google.com/maps/search/{dispatcher_data.get('location_name', 'Unknown').replace(' ', '+')}"
                }
            }
            
        except Exception as e:
            logger.error(f"Error calculating quote: {e}")
            return None
    
    def _calculate_crew_size(self, total_rooms: int) -> int:
        """Calculate crew size based on rooms - CORRECTED LGM LOGIC"""
        if total_rooms <= 2:
            return 2  # 1 truck, 2 crew
        elif total_rooms <= 4:
            return 3  # 1 truck, 3 crew
        elif total_rooms <= 6:
            return 4  # 2 trucks, 4 crew
        elif total_rooms <= 8:
            return 5  # 2 trucks, 5 crew
        else:
            return 6  # 2 trucks, 6 crew
    
    def _calculate_truck_count(self, total_rooms: int) -> int:
        """Calculate truck count based on rooms - CORRECTED LGM LOGIC"""
        if total_rooms <= 4:
            return 1  # 1 truck for up to 4 rooms
        elif total_rooms <= 8:
            return 2  # 2 trucks for 5-8 rooms
        else:
            return 3  # 3 trucks for 9+ rooms
    
    def _calculate_travel_fees(self, quote_request: Dict[str, Any], hourly_rate: float, truck_count: int, distance_km: float = 0.0) -> float:
        """Calculate travel fees based on distance"""
        try:
            # Base travel fee
            base_fee = 50.0 * truck_count
            
            # Distance-based fee (additional $2 per km beyond 25km)
            if distance_km > 25.0:
                distance_fee = (distance_km - 25.0) * 2.0
                return base_fee + distance_fee
            
            return base_fee
            
        except Exception as e:
            logger.error(f"Error calculating travel fees: {e}")
            return 50.0 * truck_count
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost - OFFICIAL LET'S GET MOVING RULES"""
        if not heavy_items:
            return 0.0
        
        # Official Let's Get Moving heavy item fees from PHP rules
        heavy_item_fees = {
            "piano": 250.0,      # Piano $250
            "safe": 300.0,       # Safe $300  
            "treadmill": 100.0,  # Treadmill $100
            "pool_table": 200.0, # Pool table $200
            "grand_piano": 400.0, # Grand piano $400
            "gun_safe": 350.0,   # Gun safe $350
            "antique_furniture": 150.0, # Antique furniture $150
            "artwork": 100.0     # Artwork $100
        }
        
        total_cost = 0.0
        for item, quantity in heavy_items.items():
            if item in heavy_item_fees and quantity > 0:
                total_cost += heavy_item_fees[item] * quantity
                logger.info(f"Added {item}: ${heavy_item_fees[item]} x {quantity} = ${heavy_item_fees[item] * quantity}")
        
        return total_cost
    
    def _calculate_heavy_items_cost_hourly(self, heavy_items: Dict[str, int], labor_hours: float) -> float:
        """Calculate cost for heavy items based on hourly rates"""
        if not heavy_items:
            return 0.0
        
        total_cost = 0.0
        # Heavy items add extra time per item (in hours)
        heavy_item_time_multipliers = {
            "piano": 0.5,  # 30 minutes extra per piano
            "safe": 0.75,  # 45 minutes extra per safe
            "pool_table": 0.25,  # 15 minutes extra per pool table
            "grand_piano": 1.0,  # 1 hour extra per grand piano
            "gun_safe": 0.75,  # 45 minutes extra per gun safe
            "treadmill": 0.2,  # 12 minutes extra per treadmill
            "antique_furniture": 0.2,  # 12 minutes extra per antique
            "artwork": 0.1  # 6 minutes extra per artwork
        }
        
        # Base hourly rate for heavy items (higher than regular labor)
        heavy_item_hourly_rate = 200.0  # $200/hour for heavy items
        
        for item, count in heavy_items.items():
            if item in heavy_item_time_multipliers and count > 0:
                extra_hours = heavy_item_time_multipliers[item] * count
                item_cost = extra_hours * heavy_item_hourly_rate
                total_cost += item_cost
                logger.info(f"Added {item}: {extra_hours:.2f}h x ${heavy_item_hourly_rate} = ${item_cost:.2f}")
                
        return total_cost
    
    def _calculate_heavy_items_cost_fixed(self, heavy_items: Dict[str, int], hourly_rate: float) -> float:
        """Calculate heavy items cost - FIXED PRICE + small time addition"""
        if not heavy_items:
            return 0.0
        
        total_cost = 0.0
        # Fixed prices for heavy items (from official LGM pricing)
        heavy_item_prices = {
            "piano": 250.0,      # Piano $250
            "safe": 300.0,       # Safe $300  
            "treadmill": 100.0,  # Treadmill $100
            "pool_table": 200.0, # Pool table $200
            "grand_piano": 400.0, # Grand piano $400
            "gun_safe": 350.0,   # Gun safe $350
            "antique_furniture": 150.0, # Antique furniture $150
            "artwork": 100.0     # Artwork $100
        }
        
        # Small time addition for each heavy item (15-30 minutes)
        heavy_item_time_addition = {
            "piano": 0.25,      # 15 minutes
            "safe": 0.5,        # 30 minutes
            "treadmill": 0.25,  # 15 minutes
            "pool_table": 0.25, # 15 minutes
            "grand_piano": 0.5, # 30 minutes
            "gun_safe": 0.5,    # 30 minutes
            "antique_furniture": 0.25, # 15 minutes
            "artwork": 0.25     # 15 minutes
        }
        
        for item, quantity in heavy_items.items():
            if item in heavy_item_prices and quantity > 0:
                # Fixed price per item
                fixed_cost = heavy_item_prices[item] * quantity
                
                # Small time addition (charged at hourly rate)
                time_cost = 0.0
                if item in heavy_item_time_addition:
                    time_cost = heavy_item_time_addition[item] * hourly_rate * quantity
                
                item_total = fixed_cost + time_cost
                total_cost += item_total
                logger.info(f"Added {item}: ${fixed_cost:.2f} + {heavy_item_time_addition.get(item, 0):.2f}h x ${hourly_rate:.2f} = ${item_total:.2f}")
        
        return total_cost
    
    def _get_hourly_rate_from_matrix(self, truck_count: int, crew_size: int, is_long_distance: bool) -> float:
        """Get hourly rate from LGM matrix based on trucks, crew size, and distance"""
        
        # LGM Matrix: Different rates for different truck/crew combinations
        # Based on the official LGM pricing matrix
        
        if truck_count == 1:
            # 1 Truck matrix: 2-3-4 crew members
            if crew_size == 2:
                return 119.0  # Base rate for 2 crew, 1 truck
            elif crew_size == 3:
                return 179.0  # Rate for 3 crew, 1 truck
            elif crew_size == 4:
                if is_long_distance:
                    # 4th person only for local moves, but we'll use 3-person rate for long distance
                    return 179.0  # Use 3-person rate for long distance
                else:
                    return 259.0  # Rate for 4 crew, 1 truck (local only)
            else:
                return 179.0  # Default to 3-person rate
                
        elif truck_count == 2:
            # 2 Trucks matrix: 4-5-6 crew members
            if crew_size == 4:
                return 238.0  # Rate for 4 crew, 2 trucks
            elif crew_size == 5:
                return 298.0  # Rate for 5 crew, 2 trucks
            elif crew_size == 6:
                return 358.0  # Rate for 6 crew, 2 trucks
            else:
                return 298.0  # Default to 5-person rate
                
        elif truck_count == 3:
            # 3 Trucks matrix: 6+ crew members
            if crew_size >= 6:
                return 358.0  # Rate for 6+ crew, 3 trucks
            else:
                return 298.0  # Default rate
        else:
            # Default rate for other configurations
            return 179.0
    
    def _calculate_long_distance_gas_fees(self, distance_km: float, truck_count: int) -> float:
        """Calculate gas fees for long distance moves (travel time > 1h45m)"""
        # Gas fee table based on distance
        if distance_km <= 50:
            return 0.0  # Local move, no gas fees
        elif distance_km <= 100:
            base_fee = 50.0
            per_km = 0.8
        elif distance_km <= 200:
            base_fee = 100.0
            per_km = 0.7
        elif distance_km <= 300:
            base_fee = 150.0
            per_km = 0.6
        else:
            base_fee = 200.0
            per_km = 0.5
        
        # Calculate gas fee per truck
        gas_fee_per_truck = base_fee + (distance_km - 50) * per_km
        total_gas_fees = gas_fee_per_truck * truck_count
        
        logger.info(f"Long distance gas fees: {distance_km:.1f}km, {truck_count} trucks = ${total_gas_fees:.2f}")
        return max(0.0, total_gas_fees)
    
    def _calculate_additional_services_cost(self, additional_services: Dict[str, bool]) -> float:
        """Calculate additional services cost - VENDOR WILL QUOTE SEPARATELY"""
        # Additional services require vendor assessment
        # This will be handled by vendor when they call client to confirm
        return 0.0
    
    def _calculate_stair_time(self, quote_request: Dict[str, Any]) -> float:
        """Calculate additional time for stairs - STANDARD RULE FOR ALL VENDORS"""
        # Standard rule: 15 minutes per flight of stairs (up or down)
        # This accounts for the extra time to carry items up/down stairs
        stair_time_per_flight = 0.25  # 15 minutes = 0.25 hours
        
        total_stair_time = 0
        
        # Add time for pickup stairs
        if quote_request.get("stairs_at_pickup", 0) > 0:
            total_stair_time += quote_request["stairs_at_pickup"] * stair_time_per_flight
        
        # Add time for dropoff stairs  
        if quote_request.get("stairs_at_dropoff", 0) > 0:
            total_stair_time += quote_request["stairs_at_dropoff"] * stair_time_per_flight
        
        return total_stair_time

# Global instance
standalone_lgm_service = StandaloneLGMService()
