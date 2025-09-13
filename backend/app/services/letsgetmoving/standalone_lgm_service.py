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

logger = logging.getLogger(__name__)

class StandaloneLGMService:
    """Standalone Let's Get Moving service that works independently"""
    
    def __init__(self):
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
        
        # Service areas for Let's Get Moving
        self.service_areas = {
            "Toronto": ["Toronto", "North York", "Scarborough", "Etobicoke", "York", "East York", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering", "Barrie", "Aurora", "Brantford", "Kitchener", "Waterloo", "Windsor", "Peterborough"],
            "Vancouver": ["Vancouver", "Burnaby", "Richmond", "Victoria", "Abbotsford", "Port Moody", "Surrey", "Coquitlam", "Maple Ridge", "Langley", "Delta", "Port Coquitlam"],
            "Calgary": ["Calgary", "Edmonton"],
            "Montreal": ["Montreal"],
            "Winnipeg": ["Winnipeg"],
            "Halifax": ["Halifax"],
            "Fredericton": ["Fredericton"]
        }
        
        # Cache for dispatcher data
        self.dispatcher_cache = {}
        self.cache_timestamp = None
        self.cache_ttl = 3600  # 1 hour cache
        
    def get_dispatcher_data(self, gid: str) -> Optional[Dict[str, Any]]:
        """Get dispatcher data for a specific GID"""
        try:
            url = f"{self.base_url}{gid}"
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Parse CSV
            csv_content = response.text
            csv_reader = csv.reader(io.StringIO(csv_content))
            rows = list(csv_reader)
            
            # Extract location name
            location_name = self.gid_location_map.get(gid, f"Location_{gid}")
            
            # Extract calendar data
            calendar_data = self._extract_calendar_data(rows)
            
            # Extract location details
            location_details = self._extract_location_details(rows)
            
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
    
    def _extract_calendar_data(self, rows: List[List[str]]) -> Dict[str, float]:
        """Extract calendar data from CSV rows"""
        calendar_data = {}
        
        # Look for month patterns
        month_patterns = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        
        for row_idx, row in enumerate(rows):
            if not row:
                continue
                
            # Check if this row contains month headers
            row_text = ','.join(row)
            if any(month in row_text for month in month_patterns):
                # This is a month header row, next row should be dates
                if row_idx + 1 < len(rows):
                    date_row = rows[row_idx + 1]
                    price_row = rows[row_idx + 2] if row_idx + 2 < len(rows) else None
                    
                    if price_row:
                        # Extract dates and prices
                        for i, (date_str, price_str) in enumerate(zip(date_row, price_row)):
                            if date_str and price_str and date_str.isdigit():
                                try:
                                    # Find which month this date belongs to
                                    month_name = None
                                    for j in range(i, -1, -1):
                                        if j < len(row) and row[j] in month_patterns:
                                            month_name = row[j]
                                            break
                                    
                                    if month_name:
                                        month_num = self._get_month_number(month_name)
                                        if month_num:
                                            date_key = f"2025-{month_num:02d}-{int(date_str):02d}"
                                            price_value = float(price_str) if price_str.replace('.', '').isdigit() else 139.0
                                            calendar_data[date_key] = price_value
                                except (ValueError, IndexError):
                                    continue
        
        # If no calendar data found, create default rates
        if not calendar_data:
            today = datetime.now()
            for i in range(30):
                date = today + timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                calendar_data[date_str] = 139.0
        
        return calendar_data
    
    def _extract_location_details(self, rows: List[List[str]]) -> Dict[str, str]:
        """Extract location details from CSV rows"""
        details = {
            "name": "Unknown",
            "address": "",
            "sales_phone": "",
            "email": "",
            "truck_count": ""
        }
        
        # Look for location details in the CSV
        for row in rows:
            if not row:
                continue
            row_text = ' '.join(row).upper()
            
            if 'ADDRESS:' in row_text:
                # Extract address
                for cell in row:
                    if 'ADDRESS:' in cell.upper():
                        details["address"] = cell.replace('ADDRESS:', '').strip()
                        break
            
            if 'PHONE:' in row_text or 'TEL:' in row_text:
                # Extract phone
                for cell in row:
                    if 'PHONE:' in cell.upper() or 'TEL:' in cell.upper():
                        details["sales_phone"] = cell.replace('PHONE:', '').replace('TEL:', '').strip()
                        break
            
            if 'EMAIL:' in row_text:
                # Extract email
                for cell in row:
                    if 'EMAIL:' in cell.upper():
                        details["email"] = cell.replace('EMAIL:', '').strip()
                        break
        
        return details
    
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
        """Check if dispatcher serves the user's location"""
        if not user_city or not dispatcher_location:
            logger.warning(f"❌ Missing city or dispatcher location: user_city='{user_city}', dispatcher_location='{dispatcher_location}'")
            return False
        
        user_city_lower = user_city.lower()
        dispatcher_location_lower = dispatcher_location.lower()
        
        logger.info(f"🔍 LGM _serves_location: user_city='{user_city}', dispatcher_location='{dispatcher_location}'")
        
        # Direct match
        if user_city_lower in dispatcher_location_lower or dispatcher_location_lower in user_city_lower:
            logger.info(f"✅ Direct match found")
            return True
        
        # Check service areas
        for region, cities in self.service_areas.items():
            if user_city_lower in [city.lower() for city in cities]:
                if region.lower() in dispatcher_location_lower:
                    logger.info(f"✅ Service area match: {region}")
                    return True
        
        logger.warning(f"❌ No service area match found")
        return False
    
    def calculate_quote(self, quote_request: Dict[str, Any], dispatcher_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate quote for Let's Get Moving"""
        try:
            # Get base rate for the move date
            move_date = quote_request.get("move_date", "2025-02-15")
            calendar_data = dispatcher_data.get("calendar_data", {})
            base_rate = calendar_data.get(move_date, 139.0)
            
            # Calculate crew size and truck count
            total_rooms = quote_request.get("total_rooms", 3)
            crew_size = self._calculate_crew_size(total_rooms)
            truck_count = self._calculate_truck_count(total_rooms)
            
            # Calculate base cost
            base_cost = base_rate * crew_size * truck_count
            
            # Calculate travel fees (simplified)
            travel_fees = self._calculate_travel_fees(quote_request, base_rate, truck_count)
            
            # Calculate total cost
            total_cost = base_cost + travel_fees
            
            return {
                "vendor_slug": "lets-get-moving",
                "vendor_name": "Let's Get Moving",
                "total_cost": round(total_cost, 2),
                "base_cost": round(base_cost, 2),
                "travel_fees": round(travel_fees, 2),
                "crew_size": crew_size,
                "truck_count": truck_count,
                "base_rate": base_rate,
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
        """Calculate crew size based on rooms"""
        if total_rooms <= 1:
            return 2
        elif total_rooms <= 3:
            return 3
        elif total_rooms <= 5:
            return 4
        else:
            return 5
    
    def _calculate_truck_count(self, total_rooms: int) -> int:
        """Calculate truck count based on rooms"""
        if total_rooms <= 2:
            return 1
        elif total_rooms <= 4:
            return 2
        else:
            return 3
    
    def _calculate_travel_fees(self, quote_request: Dict[str, Any], hourly_rate: float, truck_count: int) -> float:
        """Calculate travel fees (simplified)"""
        # Simplified travel fee calculation
        # In a real implementation, this would use Mapbox API for distance calculation
        return 50.0 * truck_count  # $50 per truck for travel

# Global instance
standalone_lgm_service = StandaloneLGMService()
