#!/usr/bin/env python3
"""
FIXED Smart Calendar Parser for Let's Get Moving
Based on actual CSV pattern analysis - extracts ALL calendar data correctly
"""

import re
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime

class SmartCalendarParser:
    """Fixed parser that extracts ALL calendar data from CSV files based on actual patterns"""
    
    def __init__(self):
        self.month_numbers = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
            'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
            'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        }
        
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
            '1911372332': 'Regina',
            '2065291362': 'Saint John',
            '232402855': 'Saskatoon',
            '2119220503': 'Scarborough',
            '1460907060': 'St Catherines',
            '1342606267': 'Richmond BC',
            '992379054': 'Surrey',
            '348861685': 'Toronto North York',
            '445545962': 'Vancouver',
            '1604601748': 'Vaughan',
            '1211144815': 'Victoria Island',
            '1802285746': 'Waterloo',
            '322544773': 'Winnipeg',
            '1257914670': 'Windsor',
            '1904136712': 'North Vancouver'
        }
        
    def parse_gid_complete(self, gid: str, csv_content: str) -> Dict[str, Any]:
        """
        Complete parsing for any GID - extracts ALL data correctly
        Returns complete data structure for the GID
        """
        print(f"🔧 Fixed parsing GID {gid}")
        
        # Extract location details
        location_details = self.extract_location_details_fixed(csv_content)
        print(f"📍 Location details: {len(location_details)} fields")
        
        # Extract calendar data
        calendar_data = self.extract_calendar_data_fixed(csv_content)
        print(f"📅 Calendar data: {len(calendar_data)} dates")
        
        # Determine location name
        location_name = self.determine_location_name_fixed(csv_content, gid)
        
        # Build complete result structure
        result = {
            "location": location_name,
            "calendar_hourly_price": calendar_data,  # ALL calendar data
            "metadata": {
                "name": location_name,
                "location": location_name,
                "ops_manager": location_details.get("ops_manager", ""),
                "address": location_details.get("address", ""),
                "email": location_details.get("email", ""),
                "terminal_id": location_details.get("terminal_id", ""),
                "intersection": location_details.get("intersection", ""),
                "truck_count": location_details.get("truck_count", ""),
                "sales_phone": location_details.get("sales_phone", ""),
                "timezone": location_details.get("timezone", "")
            },
            "pricing_formula": {
                "description": "Hourly price is for 1 truck and 1 mover. Additional movers cost extra.",
                "formulas": {
                    "1_truck": "base_price + 60 * (movers - 1)",
                    "2_trucks": "base_price * 2 + 60 * (movers - 2)"
                }
            },
            "has_comprehensive_data": len(calendar_data) > 0
        }
        
        return result
        
    def extract_location_details_fixed(self, content: str) -> Dict[str, str]:
        """Extract location details with fixed patterns based on actual CSV analysis"""
        details = {}
        
        # Fixed patterns based on actual CSV analysis
        patterns = {
            'ops_manager': r'OPS MANAGER:\s*([^\n,]+)',
            'address': r'ADDRESS:\s*([^\n,]+)',
            'intersection': r'INTERSECTION:\s*([^\n,]+)',
            'email': r'E-TRANSFER:\s*([^\n,]+)',
            'terminal_id': r'Terminal ID:\s*([^\n,]+)',
            'truck_count': r'# OF TRUCKS:\s*([^\n,]+)',
            'sales_phone': r'SALES #:\s*([^\n,]+)'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                details[key] = match.group(1).strip()
                
        return details
        
    def extract_calendar_data_fixed(self, content: str) -> Dict[str, float]:
        """Extract calendar data with fixed patterns based on actual CSV analysis"""
        calendar_data = {}
        
        # Find all month patterns in the CSV
        month_patterns = self.find_month_patterns_fixed(content)
        print(f"📅 Found month patterns: {[m[0] for m in month_patterns]}")
        
        # Extract calendar data for each month
        for month_name, month_num in month_patterns:
            monthly_data = self.extract_monthly_data_fixed(content, month_name, month_num)
            calendar_data.update(monthly_data)
            
        return calendar_data
        
    def find_month_patterns_fixed(self, content: str) -> List[Tuple[str, str]]:
        """Find month patterns with fixed approach based on actual CSV structure"""
        months_found = []
        
        # Look for the actual pattern: DURHAM,,,,,,,MAR,,DURHAM,,,,,,,APR,
        month_pattern = r'([A-Z]+),+([A-Z]{3}),+([A-Z]+),+([A-Z]{3})'
        matches = re.findall(month_pattern, content)
        
        for match in matches:
            location1, month1, location2, month2 = match
            if month1 in self.month_numbers:
                months_found.append((month1, self.month_numbers[month1]))
            if month2 in self.month_numbers:
                months_found.append((month2, self.month_numbers[month2]))
                
        # Also look for single month patterns
        for month_name, month_num in self.month_numbers.items():
            if re.search(month_name, content):
                if (month_name, month_num) not in months_found:
                    months_found.append((month_name, month_num))
                    
        return months_found
        
    def extract_monthly_data_fixed(self, content: str, month_name: str, month_num: str) -> Dict[str, float]:
        """Extract data for a specific month with fixed approach"""
        monthly_data = {}
        
        # Find the month section in the CSV
        # Look for the pattern: DURHAM,,,,,,,MAR,,DURHAM,,,,,,,APR,
        month_pattern = f'([A-Z]+),+{month_name},+([A-Z]+),+([A-Z]{{3}})'
        match = re.search(month_pattern, content)
        
        if not match:
            return monthly_data
            
        # Find the calendar section after this month header
        # Look for SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY
        calendar_start = match.end()
        calendar_section = content[calendar_start:calendar_start + 3000]  # Get next 3000 chars
        
        # Extract dates and prices
        lines = calendar_section.split('\n')
        
        for i, line in enumerate(lines):
            if 'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY' in line:
                # Found the calendar header, extract data from next few lines
                for j in range(i + 1, min(i + 15, len(lines))):
                    data_line = lines[j]
                    if ',' in data_line:
                        parts = data_line.split(',')
                        # Look for day numbers
                        for k, part in enumerate(parts):
                            part = part.strip()
                            if part.isdigit() and 1 <= int(part) <= 31:
                                day = int(part)
                                # Look for price in the same position in the next line
                                if j + 1 < len(lines):
                                    next_line = lines[j + 1]
                                    if ',' in next_line:
                                        next_parts = next_line.split(',')
                                        if k < len(next_parts):
                                            price_part = next_parts[k].strip()
                                            # Extract price - only accept reasonable rates
                                            price_match = re.search(r'(\d+)', price_part)
                                            if price_match:
                                                price_value = float(price_match.group(1))
                                                # Only accept reasonable rates (>= 100 or part of a range)
                                                if 100 <= price_value <= 500:
                                                    date_key = f"2025-{month_num}-{day:02d}"
                                                    monthly_data[date_key] = price_value
                                                    
        return monthly_data
        
    def determine_location_name_fixed(self, content: str, gid: str) -> str:
        """Determine location name with fixed approach"""
        # Try to extract from address
        address_match = re.search(r'ADDRESS:\s*([^,]+)', content)
        if address_match:
            address = address_match.group(1).strip()
            # Extract city name from address
            if ',' in address:
                city = address.split(',')[0].strip()
                return city
                
        # Try to extract from location details
        if 'LOCATION DETAILS:' in content:
            # Look for city name in the content
            city_patterns = [
                r'([A-Z][a-z]+),?\s+[A-Z]{2}',  # City, State/Province
                r'([A-Z][a-z]+),?\s+Canada',    # City, Canada
                r'([A-Z][a-z]+),?\s+BC',        # City, BC
                r'([A-Z][a-z]+),?\s+ON',        # City, ON
                r'([A-Z][a-z]+),?\s+AB',        # City, AB
                r'([A-Z][a-z]+),?\s+QC',        # City, QC
            ]
            
            for pattern in city_patterns:
                match = re.search(pattern, content)
                if match:
                    return match.group(1).strip()
                    
        # Fallback to GID-based name
        return self.gid_location_map.get(gid, f"Location_{gid}")
        
    def get_location_coordinates(self, location_name: str, address: str) -> Tuple[float, float]:
        """Get coordinates for geocoding - placeholder implementation"""
        # This would normally use a geocoding service
        # For now, return default coordinates
        return 0.0, 0.0

def create_smart_parser():
    """Create a new instance of the fixed smart parser"""
    return SmartCalendarParser()