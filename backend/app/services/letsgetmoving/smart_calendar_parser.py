#!/usr/bin/env python3
"""
Smart Calendar Parser for Let's Get Moving
Extracts ALL calendar data from CSV files (365 days per location)
Enhanced to handle all 21 full calendar location GIDs
"""

import re
from typing import Dict, List, Tuple, Optional, Any
from datetime import datetime

class SmartCalendarParser:
    """Smart parser that extracts ALL calendar data from CSV files"""
    
    def __init__(self):
        # Updated patterns to match the actual CSV structure
        self.month_patterns = [
            ('MAR', r'MAR.*?APR'), ('APR', r'APR.*?MAY'), ('MAY', r'MAY.*?JUN'),
            ('JUN', r'JUN.*?JUL'), ('JUL', r'JUL.*?AUG'), ('AUG', r'AUG.*?SEP'),
            ('SEP', r'SEP.*?OCT'), ('OCT', r'OCT.*?NOV'), ('NOV', r'NOV.*?DEC'),
            # Add patterns for the actual CSV structure
            ('TORONTO_APR', r'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?TORONTO - MAY'),
            ('TORONTO_MAY', r'TORONTO - MAY.*?TORONTO - JUNE'),
            ('TORONTO_JUN', r'TORONTO - JUNE.*?TORONTO - JULY'),
            ('TORONTO_JUL', r'TORONTO - JULY.*?TORONTO - AUGUST'),
            ('TORONTO_AUG', r'TORONTO - AUGUST.*?TORONTO'),
            ('TORONTO_SEP', r'TORONTO.*?SEP.*?TORONTO.*?OCT'),
            ('TORONTO_OCT', r'TORONTO.*?OCT.*?TORONTO.*?NOV'),
            ('TORONTO_NOV', r'TORONTO.*?NOV.*?TORONTO.*?DEC'),
            ('TORONTO_DEC', r'TORONTO.*?DEC.*?TORONTO.*?JAN'),
            ('TORONTO_JAN', r'TORONTO.*?JAN.*?TORONTO.*?FEB'),
            ('TORONTO_FEB', r'TORONTO.*?FEB.*?TORONTO.*?MAR'),
            ('TORONTO_MAR', r'TORONTO.*?MAR.*?TORONTO.*?APR')
        ]
        
        self.month_numbers = {
            'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
            'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11',
            'DEC': '12', 'JAN': '01', 'FEB': '02',
            'TORONTO_APR': '04', 'TORONTO_MAY': '05', 'TORONTO_JUN': '06',
            'TORONTO_JUL': '07', 'TORONTO_AUG': '08', 'TORONTO_SEP': '09',
            'TORONTO_OCT': '10', 'TORONTO_NOV': '11', 'TORONTO_DEC': '12',
            'TORONTO_JAN': '01', 'TORONTO_FEB': '02', 'TORONTO_MAR': '03'
        }
        
        # Enhanced GID to location mapping based on analysis
        self.gid_location_map = {
                       # Core locations
                       '586231927': 'OAKVILLE',
                       '759134820': 'HAMILTON',
                       '2023718082': 'SCARBOROUGH',
                       '205064403': 'BARRIE',
                       '2117865571': 'OTTAWA',
                       '1902434505': 'WINDSOR',
                       '685880450': 'SUDBURY',
                       '1985906253': 'WATERLOO',
                       '1384980803': 'CALGARY',
                       '2061150538': 'NIAGARA FALLS',
                       '1324028052': 'DOWNTOWN TORONTO',
                       '1846632241': 'KITCHENER',
                       '627208617': 'BURNABY',
                       '1843371269': 'VANCOUVER',
                       '858770585': 'SURREY',
                       '551728640': 'RICHMOND BC',
                       '478561055': 'COQUITLAM',
                       '1311971885': 'LANGLEY',
                       '853107228': 'DELTA',
                       '1613243722': 'MAPLE RIDGE',
                       '120281503': 'PORT COQUITLAM',
                       '429580526': 'MISSISSAUGA',
                       '159313789': 'BRAMPTON',
                       '1591534972': 'VAUGHAN',
                       '851484086': 'MARKHAM',
                       '805965695': 'RICHMOND HILL',
                       '268519783': 'AURORA',
                       '1005327863': 'NEWMARKET',
                       '1342606267': 'WHITBY',
                       '2065291362': 'AJAX',
                       '232402855': 'PICKERING',
                       '2119220503': 'OSHAWA',
                       '1460907060': 'BOWMANVILLE',
                       '992379054': 'PORT HOPE',
                       '348861685': 'TORONTO (NORTH YORK)',
                       '445545962': 'RICHMOND BC',
                       '1604601748': 'VAUGHAN',
                       '1211144815': 'VICTORIA',
                       '1802285746': 'KITCHENER',
                       '1257914670': 'WINDSOR',
                       '322544773': 'MONTREAL'
                   }
        
        # Location coordinates
        self.location_coordinates = {
            # Core locations
            'OAKVILLE': (43.4675, -79.6877),
            'HAMILTON': (43.2557, -79.8711),
            'SCARBOROUGH': (43.7764, -79.2318),
            'BARRIE': (44.3894, -79.6903),
            'OTTAWA': (45.4215, -75.6972),
            'WINDSOR': (42.3149, -83.0364),
            'SUDBURY': (46.4917, -80.9930),
            'WATERLOO': (43.4643, -80.5204),
            'CALGARY': (51.0447, -114.0719),
            'NIAGARA FALLS': (43.0962, -79.0377),
            'DOWNTOWN TORONTO': (43.6532, -79.3832),
            'KITCHENER': (43.4516, -80.4925),
            'BURNABY': (49.2488, -122.9805),
            'VANCOUVER': (49.2827, -123.1207),
            'SURREY': (49.1913, -122.8490),
            'RICHMOND BC': (49.1666, -123.1336),
            'COQUITLAM': (49.2837, -122.7932),
            'LANGLEY': (49.1044, -122.5829),
            'DELTA': (49.0847, -123.0581),
            'MAPLE RIDGE': (49.2194, -122.6019),
            'PORT COQUITLAM': (49.2621, -122.7816),
            'MISSISSAUGA': (43.5890, -79.6441),
            'BRAMPTON': (43.6832, -79.7629),
            'VAUGHAN': (43.8361, -79.4987),
            'MARKHAM': (43.8561, -79.3370),
            'RICHMOND HILL': (43.8561, -79.3370),
            'AURORA': (44.0001, -79.4663),
            'NEWMARKET': (44.0501, -79.4663),
            'WHITBY': (43.8975, -78.9428),
            'AJAX': (43.8509, -79.0205),
            'PICKERING': (43.8384, -79.0868),
            'OSHAWA': (43.8971, -78.8658),
            'BOWMANVILLE': (43.9120, -78.6886),
            'PORT HOPE': (43.9511, -78.2928),
            'TORONTO (NORTH YORK)': (43.7615, -79.4111),
            'VICTORIA': (48.4284, -123.3656),
            'MONTREAL': (45.5017, -73.5673)
        }
    
    def extract_full_calendar(self, csv_content: str) -> Dict[str, float]:
        """
        Extract ALL calendar data from CSV content
        Returns: {date_key: rate} for all available dates
        """
        calendar_data = {}
        
        # Check if this CSV has comprehensive data structure (all 12 months)
        # Look for any location name followed by month patterns
        has_comprehensive_data = (
            re.search(r'[A-Z]+.*?JUL', csv_content) and 
            re.search(r'[A-Z]+.*?AUG', csv_content) and
            re.search(r'[A-Z]+.*?SEP', csv_content) and
            re.search(r'[A-Z]+.*?OCT', csv_content) and
            re.search(r'[A-Z]+.*?NOV', csv_content) and
            re.search(r'[A-Z]+.*?DEC', csv_content) and
            re.search(r'[A-Z]+.*?JAN', csv_content) and
            re.search(r'[A-Z]+.*?FEB', csv_content) and
            re.search(r'[A-Z]+.*?MAR', csv_content)
        )
        
        if has_comprehensive_data:
            # Use comprehensive extraction for all locations with full data
            return self._extract_comprehensive_calendar(csv_content)
        
        # Special handling for Toronto North York GID (348861685)
        if "945 Wilson Ave, North York" in csv_content:
            return self._extract_toronto_north_york_calendar(csv_content)
        
        # Special handling for Downtown Toronto GID (1324028052)
        if "1324028052" in csv_content or "DOWNTOWN TORONTO" in csv_content:
            return self._extract_downtown_toronto_calendar(csv_content)
        
        # Process patterns in order of priority (most specific first)
        for month_name, pattern in self.month_patterns:
            match = re.search(pattern, csv_content, re.DOTALL)
            if match:
                month_text = match.group()
                month_num = self.month_numbers.get(month_name, '00')
                
                # Extract all days and rates for this month
                monthly_rates = self._extract_monthly_rates(month_text, month_num)
                
                # Only add rates that don't already exist (avoid overwriting with wrong data)
                for date_key, rate in monthly_rates.items():
                    if date_key not in calendar_data:
                        calendar_data[date_key] = rate
        
        return calendar_data
    
    def _extract_toronto_north_york_calendar(self, csv_content: str) -> Dict[str, float]:
        """Extract calendar data specifically for Toronto North York"""
        calendar_data = {}
        
        # Find ALL calendar sections in the CSV
        sections = [
            # First section: April-May-June
            (r'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?TORONTO - MAY', '04', '05', '06'),
            # July-August section
            (r'TORONTO - JULY.*?SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?TORONTO', '07', '08', None),
            # September-October section
            (r'TORONTO.*?SEP.*?TORONTO.*?OCT', '09', '10', None),
            # November-December section
            (r'TORONTO.*?NOV.*?TORONTO.*?DEC', '11', '12', None),
            # January-February section
            (r'TORONTO.*?JAN.*?TORONTO.*?FEB', '01', '02', None),
            # March-April section
            (r'TORONTO.*?MAR.*?TORONTO.*?APR', '03', '04', None)
        ]
        
        for pattern, month1, month2, month3 in sections:
            match = re.search(pattern, csv_content, re.DOTALL)
            if match:
                section_text = match.group()
                lines = section_text.split('\n')
                
                # Process the section line by line
                for i, line in enumerate(lines):
                    if ',' in line:
                        parts = line.split(',')
                        # Look for day numbers
                        for j, part in enumerate(parts):
                            part = part.strip()
                            if part.isdigit() and 1 <= int(part) <= 31:
                                day = int(part)
                                # Look for rates in the same position in the next line
                                if i + 1 < len(lines):
                                    next_line = lines[i + 1]
                                    if ',' in next_line:
                                        next_parts = next_line.split(',')
                                        if j < len(next_parts):
                                            rate_part = next_parts[j].strip()
                                            # Extract rate - only accept reasonable rates
                                            rate_match = re.search(r'(\d+)(?:/\d+)?', rate_part)
                                            if rate_match:
                                                rate_value = float(rate_match.group(1))
                                                # Only accept reasonable rates (>= 100 or part of a range)
                                                if rate_value >= 100 or '/' in rate_part:
                                                    # For July-August section, use different mapping
                                                    if month1 == '07' and month2 == '08':
                                                        # July-August has different structure
                                                        if j < 7:  # First week - July
                                                            month_num = '07'
                                                        else:  # Second week - August
                                                            month_num = '08'
                                                    else:
                                                        # Standard mapping for other sections
                                                        if j < 7:  # First week
                                                            month_num = month1
                                                        elif j < 14:  # Second week
                                                            month_num = month2
                                                        elif month3 and j < 21:  # Third week (if available)
                                                            month_num = month3
                                                        else:
                                                            continue  # Skip if no month mapping
                                                    
                                                    date_key = f"2025-{month_num}-{day:02d}"
                                                    calendar_data[date_key] = rate_value
        
        return calendar_data
    
    def _extract_downtown_toronto_calendar(self, csv_content: str) -> Dict[str, float]:
        """Extract calendar data specifically for Downtown Toronto"""
        calendar_data = {}
        
        # Find ALL calendar sections in the CSV (same structure as Toronto North York)
        sections = [
            # First section: April-May-June
            (r'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?TORONTO - MAY', '04', '05', '06'),
            # July-August section
            (r'TORONTO - JULY.*?SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?TORONTO', '07', '08', None),
            # September-October section
            (r'TORONTO.*?SEP.*?TORONTO.*?OCT', '09', '10', None),
            # November-December section
            (r'TORONTO.*?NOV.*?TORONTO.*?DEC', '11', '12', None),
            # January-February section
            (r'TORONTO.*?JAN.*?TORONTO.*?FEB', '01', '02', None),
            # March-April section
            (r'TORONTO.*?MAR.*?TORONTO.*?APR', '03', '04', None)
        ]
        
        for pattern, month1, month2, month3 in sections:
            match = re.search(pattern, csv_content, re.DOTALL)
            if match:
                section_text = match.group()
                lines = section_text.split('\n')
                
                # Process the section line by line
                for i, line in enumerate(lines):
                    if ',' in line:
                        parts = line.split(',')
                        # Look for day numbers
                        for j, part in enumerate(parts):
                            part = part.strip()
                            if part.isdigit() and 1 <= int(part) <= 31:
                                day = int(part)
                                # Look for rates in the same position in the next line
                                if i + 1 < len(lines):
                                    next_line = lines[i + 1]
                                    if ',' in next_line:
                                        next_parts = next_line.split(',')
                                        if j < len(next_parts):
                                            rate_part = next_parts[j].strip()
                                            # Extract rate - only accept reasonable rates
                                            rate_match = re.search(r'(\d+)(?:/\d+)?', rate_part)
                                            if rate_match:
                                                rate_value = float(rate_match.group(1))
                                                # Only accept reasonable rates (>= 100 or part of a range)
                                                if rate_value >= 100 or '/' in rate_part:
                                                    # For July-August section, use different mapping
                                                    if month1 == '07' and month2 == '08':
                                                        # July-August has different structure
                                                        if j < 7:  # First week - July
                                                            month_num = '07'
                                                        else:  # Second week - August
                                                            month_num = '08'
                                                    else:
                                                        # Standard mapping for other sections
                                                        if j < 7:  # First week
                                                            month_num = month1
                                                        elif j < 14:  # Second week
                                                            month_num = month2
                                                        elif month3 and j < 21:  # Third week (if available)
                                                            month_num = month3
                                                        else:
                                                            continue  # Skip if no month mapping
                                                    
                                                    date_key = f"2025-{month_num}-{day:02d}"
                                                    calendar_data[date_key] = rate_value
        
        return calendar_data
    
    def _extract_comprehensive_calendar(self, csv_content: str) -> Dict[str, float]:
        """Extract calendar data for ALL locations with comprehensive data structure"""
        calendar_data = {}
        
        # Find ALL calendar sections in the CSV - use generic patterns for any location
        sections = [
            # First section: April-May-June
            (r'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?[A-Z]+.*?MAY', '04', '05', '06'),
            # July-August section
            (r'[A-Z]+.*?JUL.*?SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY.*?[A-Z]+', '07', '08', None),
            # September-October section
            (r'[A-Z]+.*?SEP.*?[A-Z]+.*?OCT', '09', '10', None),
            # November-December section
            (r'[A-Z]+.*?NOV.*?[A-Z]+.*?DEC', '11', '12', None),
            # January-February section
            (r'[A-Z]+.*?JAN.*?[A-Z]+.*?FEB', '01', '02', None),
            # March-April section
            (r'[A-Z]+.*?MAR.*?[A-Z]+.*?APR', '03', '04', None)
        ]
        
        for pattern, month1, month2, month3 in sections:
            match = re.search(pattern, csv_content, re.DOTALL)
            if match:
                section_text = match.group()
                lines = section_text.split('\n')
                
                # Process the section line by line
                for i, line in enumerate(lines):
                    if ',' in line:
                        parts = line.split(',')
                        # Look for day numbers
                        for j, part in enumerate(parts):
                            part = part.strip()
                            if part.isdigit() and 1 <= int(part) <= 31:
                                day = int(part)
                                # Look for rates in the same position in the next line
                                if i + 1 < len(lines):
                                    next_line = lines[i + 1]
                                    if ',' in next_line:
                                        next_parts = next_line.split(',')
                                        if j < len(next_parts):
                                            rate_part = next_parts[j].strip()
                                            # Extract rate - only accept reasonable rates
                                            rate_match = re.search(r'(\d+)(?:/\d+)?', rate_part)
                                            if rate_match:
                                                rate_value = float(rate_match.group(1))
                                                # Only accept reasonable rates (>= 100 or part of a range)
                                                if rate_value >= 100 or '/' in rate_part:
                                                    # For July-August section, use different mapping
                                                    if month1 == '07' and month2 == '08':
                                                        # July-August has different structure
                                                        if j < 7:  # First week - July
                                                            month_num = '07'
                                                        else:  # Second week - August
                                                            month_num = '08'
                                                    else:
                                                        # Standard mapping for other sections
                                                        if j < 7:  # First week
                                                            month_num = month1
                                                        elif j < 14:  # Second week
                                                            month_num = month2
                                                        elif month3 and j < 21:  # Third week (if available)
                                                            month_num = month3
                                                        else:
                                                            continue  # Skip if no month mapping
                                                    
                                                    date_key = f"2025-{month_num}-{day:02d}"
                                                    calendar_data[date_key] = rate_value
        
        return calendar_data
    
    def _extract_monthly_rates(self, month_text: str, month_num: str) -> Dict[str, float]:
        """Extract all daily rates for a specific month"""
        daily_rates = {}
        
        # Split into lines and process
        lines = month_text.split('\n')
        
        for i, line in enumerate(lines):
            # Look for day numbers (1-31) in the current line
            days = re.findall(r'\b([1-3]?[0-9])\b', line)
            
            if days:
                # First try to find rates in the same line
                rates = re.findall(r'\b(139|149|169|179|199)\b', line)
                
                if rates:
                    # Match days with rates in the same line
                    for day, rate in zip(days, rates):
                        if day.isdigit() and rate.isdigit():
                            # Validate day is reasonable (1-31)
                            day_int = int(day)
                            if 1 <= day_int <= 31:
                                date_key = f"2025-{month_num}-{day.zfill(2)}"
                                rate_value = float(rate)
                                daily_rates[date_key] = rate_value
                elif i + 1 < len(lines):
                    # If no rates in same line, try next line
                    next_line = lines[i + 1]
                    rates = re.findall(r'\$?(\d+)(?:/\d+)?', next_line)  # Handle rates like "199/159"
                    
                    # Match days with rates
                    for day, rate in zip(days, rates):
                        if day.isdigit() and rate.isdigit():
                            # Validate day is reasonable (1-31)
                            day_int = int(day)
                            if 1 <= day_int <= 31:
                                date_key = f"2025-{month_num}-{day.zfill(2)}"
                                # Take the first rate if there are multiple (e.g., "199/159" -> 199)
                                rate_value = float(rate.split('/')[0])
                                daily_rates[date_key] = rate_value
        
        # If no rates found with the standard method, try the Toronto-specific structure
        if not daily_rates:
            daily_rates = self._extract_toronto_structure(month_text, month_num)
        
        return daily_rates
    
    def _extract_toronto_structure(self, month_text: str, month_num: str) -> Dict[str, float]:
        """Extract rates from Toronto-specific CSV structure"""
        daily_rates = {}
        lines = month_text.split('\n')
        
        for i, line in enumerate(lines):
            # Look for lines that contain day numbers (1-31) in specific positions
            # The Toronto structure has days in specific columns
            if ',' in line:
                parts = line.split(',')
                # Look for day numbers in the parts
                for j, part in enumerate(parts):
                    part = part.strip()
                    if part.isdigit() and 1 <= int(part) <= 31:
                        day = int(part)
                        # Look for rates in the same position in the next line
                        if i + 1 < len(lines):
                            next_line = lines[i + 1]
                            if ',' in next_line:
                                next_parts = next_line.split(',')
                                if j < len(next_parts):
                                    rate_part = next_parts[j].strip()
                                    # Extract rate from the part - be more specific
                                    # Only accept rates that are reasonable (>= 100 or have / in them)
                                    rate_match = re.search(r'(\d+)(?:/\d+)?', rate_part)
                                    if rate_match:
                                        rate_value = float(rate_match.group(1))
                                        # Only accept reasonable rates (>= 100 or part of a range like "199/159")
                                        if rate_value >= 100 or '/' in rate_part:
                                            date_key = f"2025-{month_num}-{day:02d}"
                                            daily_rates[date_key] = rate_value
        
        return daily_rates
    
    def extract_location_details(self, csv_content: str) -> Dict[str, str]:
        """Extract complete location details from CSV"""
        location_details = {}
        
        # OPS MANAGER
        ops_match = re.search(r'OPS MANAGER:\s*([^,\n]+)', csv_content)
        if ops_match:
            ops_manager = ops_match.group(1).strip()
            # Clean up extra text
            if 'E-TRANSFER:' in ops_manager:
                ops_manager = ops_manager.split('E-TRANSFER:')[0].strip()
            if '#' in ops_manager:
                ops_manager = ops_manager.split('#')[0].strip()
            location_details['ops_manager'] = ops_manager
        else:
            # Try to find Owner: in a line with many commas (like GID 120281503)
            owner_match = re.search(r'Owner:\s*([^,\n]+)', csv_content)
            if owner_match:
                owner = owner_match.group(1).strip()
                location_details['ops_manager'] = owner
            else:
                # Try to find OPS MANAGER in a line with many commas
                lines = csv_content.split('\n')
                for line in lines:
                    if 'OPS MANAGER:' in line:
                        parts = line.split(',')
                        for i, part in enumerate(parts):
                            if 'OPS MANAGER:' in part:
                                ops_part = part.split('OPS MANAGER:')[1].strip()
                                if i + 1 < len(parts) and parts[i + 1].strip():
                                    ops_part = parts[i + 1].strip()
                                location_details['ops_manager'] = ops_part
                                break
                        break
        
        # SALES NUMBER
        sales_match = re.search(r'SALES #:\s*([^,\n]+)', csv_content)
        if sales_match:
            sales_phone = sales_match.group(1).strip()
            # Clean up extra text
            if 'E-TRANSFER:' in sales_phone:
                sales_phone = sales_phone.split('E-TRANSFER:')[0].strip()
            if '#' in sales_phone:
                sales_phone = sales_phone.split('#')[0].strip()
            location_details['sales_phone'] = sales_phone
        else:
            # Try alternative format for some GIDs
            sales_match = re.search(r'SALES #:\s*([^,\n]+?)(?:\s*,|$)', csv_content)
            if sales_match:
                sales_phone = sales_match.group(1).strip()
                location_details['sales_phone'] = sales_phone
            else:
                # Try to find SALES # in a line with many commas
                lines = csv_content.split('\n')
                for line in lines:
                    if 'SALES #:' in line:
                        parts = line.split(',')
                        for i, part in enumerate(parts):
                            if 'SALES #:' in part:
                                # Check if there's a phone number in the same part after SALES #:
                                sales_part = part.split('SALES #:')[1].strip()
                                # If no phone number in this part, check the next part
                                if not sales_part and i + 1 < len(parts):
                                    sales_part = parts[i + 1].strip()
                                # Clean up the phone number
                                if sales_part:
                                    # Remove extra spaces and clean up
                                    sales_part = ' '.join(sales_part.split())
                                location_details['sales_phone'] = sales_part
                                break
                        break
        
        # INTERSECTION
        intersection_match = re.search(r'INTERSECTION:\s*([^,]+)', csv_content)
        if intersection_match:
            location_details['intersection'] = intersection_match.group(1).strip()
        
        # ADDRESS (clean version)
        # First try to find ADDRESS: followed by text before the next field
        address_match = re.search(r'ADDRESS:\s*([^,\n]+)', csv_content)
        if address_match:
            address = address_match.group(1).strip()
            # Clean up extra text and stop at first significant delimiter
            if 'E-TRANSFER:' in address:
                address = address.split('E-TRANSFER:')[0].strip()
            if '1 HOUR MINIMUMS' in address:
                address = address.split('1 HOUR MINIMUMS')[0].strip()
            if '#' in address:
                address = address.split('#')[0].strip()
            if 'Terminal ID:' in address:
                address = address.split('Terminal ID:')[0].strip()
            # Remove trailing commas and clean up
            address = address.rstrip(',').strip()
            location_details['address'] = address
        else:
            # Try to find ADDRESS: in a line with many commas (like GID 120281503)
            lines = csv_content.split('\n')
            for line in lines:
                if 'ADDRESS:' in line:
                    # Extract everything after ADDRESS: but before the next field
                    parts = line.split(',')
                    for i, part in enumerate(parts):
                        if 'ADDRESS:' in part:
                            # Get the address part
                            address_part = part.split('ADDRESS:')[1].strip()
                            # If there are more parts, take the first one that's not empty
                            if i + 1 < len(parts) and parts[i + 1].strip():
                                address_part = parts[i + 1].strip()
                            location_details['address'] = address_part
                            break
                    break
        
        # E-TRANSFER (email)
        email_match = re.search(r'E-TRANSFER:\s*([^,]+)', csv_content)
        if email_match:
            location_details['email'] = email_match.group(1).strip()
        
        # TRUCK COUNT
        truck_match = re.search(r'# OF TRUCKS:\s*([^,\n]+)', csv_content)
        if truck_match:
            truck_count = truck_match.group(1).strip()
            # Clean up extra text
            if 'E-TRANSFER:' in truck_count:
                truck_count = truck_count.split('E-TRANSFER:')[0].strip()
            if 'Terminal ID:' in truck_count:
                truck_count = truck_count.split('Terminal ID:')[0].strip()
            location_details['truck_count'] = truck_count
        
        # TERMINAL ID
        terminal_match = re.search(r'Terminal ID:\s*([^,\n]+)', csv_content)
        if terminal_match:
            terminal_id = terminal_match.group(1).strip()
            # Clean up extra text
            if 'E-TRANSFER:' in terminal_id:
                terminal_id = terminal_id.split('E-TRANSFER:')[0].strip()
            if '#' in terminal_id:
                terminal_id = terminal_id.split('#')[0].strip()
            location_details['terminal_id'] = terminal_id
        
        # TIME ZONE
        timezone_match = re.search(r'(\d+)\s+HOURS?\s+BEHIND', csv_content)
        if timezone_match:
            location_details['timezone'] = f"{timezone_match.group(1)} hours behind"
        
        return location_details
    
    def extract_pricing_tables(self, csv_content: str) -> Dict[str, any]:
        """Extract pricing tables and formulas"""
        pricing_data = {}
        
        # Extract crew rates table
        crew_pattern = r'1 Truck.*?2 Trucks.*?(?=\n\n|\Z)'
        crew_match = re.search(crew_pattern, csv_content, re.DOTALL)
        if crew_match:
            pricing_data['crew_rates'] = self._parse_crew_rates(crew_match.group())
        
        # Extract important notes
        notes_pattern = r'IMPORTANT NOTES.*?(?=\n\n|\Z)'
        notes_match = re.search(notes_pattern, csv_content, re.DOTALL)
        if notes_match:
            pricing_data['important_notes'] = notes_match.group().strip()
        
        return pricing_data
    
    def _parse_crew_rates(self, crew_text: str) -> Dict[str, any]:
        """Parse crew rates from pricing table"""
        rates = {}
        
        # Extract 1 truck rates
        one_truck_match = re.search(r'1 Truck.*?2 Trucks', crew_text, re.DOTALL)
        if one_truck_match:
            one_truck_text = one_truck_match.group()
            # Extract rate ranges
            rate_ranges = re.findall(r'(\d+)\s*>\s*(\d+)\s*>\s*(\d+)', one_truck_text)
            if rate_ranges:
                rates['1_truck'] = {
                    '2_men': int(rate_ranges[0][0]),
                    '3_men': int(rate_ranges[0][1]),
                    '4_men': int(rate_ranges[0][2])
                }
        
        # Extract 2 truck rates
        two_truck_match = re.search(r'2 Trucks.*?(?=\n\n|\Z)', crew_text, re.DOTALL)
        if two_truck_match:
            two_truck_text = two_truck_match.group()
            rate_ranges = re.findall(r'(\d+)\s*>\s*(\d+)\s*>\s*(\d+)', two_truck_text)
            if rate_ranges:
                rates['2_trucks'] = {
                    '4_men': int(rate_ranges[0][0]),
                    '5_men': int(rate_ranges[0][1]),
                    '6_men': int(rate_ranges[0][2])
                }
        
        return rates
    
    def extract_operational_rules(self, csv_content: str) -> Dict[str, str]:
        """Extract operational rules and restrictions"""
        operational_rules = {}
        
        # Restricted arrival windows
        restricted_match = re.search(r'UPDATE ON RESTRICTED ARRIVAL WINDOWS:.*?(\d+TH.*?\d+TH)', csv_content)
        if restricted_match:
            operational_rules['restricted_arrival_windows'] = restricted_match.group(1).strip()
        
        # Base price changes
        base_price_match = re.search(r'base price (?:dropped|droppped) to (\d+)', csv_content, re.IGNORECASE)
        if base_price_match:
            operational_rules['base_price_drop'] = f"${base_price_match.group(1)}"
        
        return operational_rules
    
    def determine_location_name(self, csv_content: str, gid: str) -> str:
        """Determine location name from CSV content or GID mapping"""
        # Try to extract from address first
        address_match = re.search(r'ADDRESS:\s*([^\n,]+)', csv_content)
        if address_match:
            address = address_match.group(1).strip()
            # Extract city from address (second to last part before postal code)
            address_parts = address.split(',')
            if len(address_parts) >= 2:
                city_part = address_parts[-2].strip()
                # Remove any extra text and get just the city name
                city_name = city_part.split()[0] if city_part.split() else city_part
                return city_name.upper()
        
        # Try to extract from CSV location details
        location_match = re.search(r'LOCATION DETAILS:\s*([^\n,]+)', csv_content)
        if location_match:
            location_name = location_match.group(1).strip()
            # Clean up the location name
            clean_name = location_name.split(',')[0].strip()
            if clean_name and len(clean_name) < 50:  # Reasonable length
                return clean_name
        
        # Fallback to GID mapping
        return self.gid_location_map.get(gid, f'GID_{gid}')
    
    def get_location_coordinates(self, location_name: str, address: str = "") -> Tuple[float, float]:
        """Get latitude/longitude for location using Mapbox geocoding"""
        # First try hardcoded coordinates
        if location_name in self.location_coordinates:
            return self.location_coordinates[location_name]
        
        # If we have an address, use Mapbox geocoding
        if address:
            try:
                from app.services.mapbox_service import mapbox_service
                coords = mapbox_service.get_coordinates(address)
                if coords:
                    print(f"📍 Geocoded {location_name}: {address} -> {coords}")
                    return coords
            except Exception as e:
                print(f"❌ Geocoding failed for {location_name}: {address} - {e}")
        
        # Fallback to hardcoded coordinates or default
        return self.location_coordinates.get(location_name, (0.0, 0.0))
    
    def parse_gid_complete(self, gid: str, csv_content: str) -> Dict[str, Any]:
        """
        Complete parsing for any GID - extracts ALL data
        Returns complete data structure for the GID
        """
        print(f"🧠 Smart parsing GID {gid}")
        
        # Extract ALL calendar data
        calendar_data = self.extract_full_calendar(csv_content)
        print(f"📅 Extracted {len(calendar_data)} calendar dates")
        
        # Extract location details
        location_details = self.extract_location_details(csv_content)
        print(f"📍 Extracted location details: {len(location_details)} fields")
        
        # Extract pricing tables
        pricing_data = self.extract_pricing_tables(csv_content)
        print(f"💰 Extracted pricing data: {len(pricing_data)} tables")
        
        # Extract operational rules
        operational_rules = self.extract_operational_rules(csv_content)
        print(f"📋 Extracted operational rules: {len(operational_rules)} rules")
        
        # Determine location name
        location_name = self.determine_location_name(csv_content, gid)
        
        # Get address for geocoding
        address = location_details.get("address", "")
        
        # Get coordinates using address for geocoding
        lat, lng = self.get_location_coordinates(location_name, address)
        
        # Build complete result structure
        result = {
            "location": location_name,
            "calendar_hourly_price": calendar_data,  # ALL calendar data
            "metadata": {
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
                    "2_trucks": "2 * (base_price + 60 * (movers - 1))",
                    "max_movers_per_truck": 3
                },
                "crew_rates": pricing_data.get("crew_rates", {}),
                "important_notes": pricing_data.get("important_notes", "")
            },
            "operational_rules": operational_rules,
            "coordinates": {"lat": lat, "lng": lng},  # Store coordinates as dictionary
            "lat": lat,
            "lng": lng,
            "address": location_details.get("address", ""),
            "filename": f"{location_name.lower().replace(' ', '_').replace(',', '')}.json"
        }
        
        print(f"✅ Smart parsing complete for {location_name}")
        print(f"   📅 Calendar dates: {len(calendar_data)}")
        print(f"   📍 Location: {location_name}")
        print(f"   💰 Sample rates: {list(calendar_data.items())[:5]}")
        
        return result

def create_smart_parser() -> SmartCalendarParser:
    """Factory function to create smart parser instance"""
    return SmartCalendarParser() 