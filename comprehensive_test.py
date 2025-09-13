#!/usr/bin/env python3
"""
Comprehensive Test for Let's Get Moving CSV Parser
Tests all GIDs to ensure we can extract all year dates, names, addresses, phones
"""

import os
import re
from typing import Dict, List, Any
from datetime import datetime

class ComprehensiveTester:
    def __init__(self, csv_dir: str = "csv_data/canada"):
        self.csv_dir = csv_dir
        self.results = {}
        
    def test_all_csvs(self):
        """Test all CSV files comprehensively"""
        print("🧪 COMPREHENSIVE TESTING - ALL CANADIAN GIDs")
        print("=" * 60)
        
        csv_files = [f for f in os.listdir(self.csv_dir) if f.endswith('.csv') and not f.startswith('year') and not f.startswith('truck') and not f.startswith('time') and not f.startswith('discount') and not f.startswith('deposit')]
        csv_files.sort()
        
        print(f"📊 Testing {len(csv_files)} location CSV files...")
        
        for i, csv_file in enumerate(csv_files, 1):
            print(f"\n{i:2d}. Testing: {csv_file}")
            self.test_single_csv(csv_file)
            
        self.print_summary()
        
    def test_single_csv(self, csv_file: str):
        """Test a single CSV file comprehensively"""
        file_path = os.path.join(self.csv_dir, csv_file)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Extract all data
            location_details = self.extract_location_details(content)
            calendar_data = self.extract_calendar_data(content)
            month_patterns = self.find_month_patterns(content)
            
            # Count lines and characters
            lines = content.count('\n')
            chars = len(content)
            
            result = {
                'file_name': csv_file,
                'lines': lines,
                'chars': chars,
                'location_details': location_details,
                'calendar_dates': len(calendar_data),
                'month_patterns': month_patterns,
                'has_comprehensive_data': len(calendar_data) > 0
            }
            
            self.results[csv_file] = result
            
            # Print results
            print(f"    📏 Size: {lines} lines, {chars} chars")
            print(f"    📍 Location: {location_details.get('location_name', 'N/A')}")
            print(f"    📞 Phone: {location_details.get('ops_manager', 'N/A')}")
            print(f"    🏠 Address: {location_details.get('address', 'N/A')[:50]}...")
            print(f"    📅 Calendar: {len(calendar_data)} dates")
            print(f"    📆 Months: {', '.join(month_patterns)}")
            
            if len(calendar_data) > 0:
                print(f"    📅 First 3 dates: {list(calendar_data.keys())[:3]}")
                print(f"    📅 Last 3 dates: {list(calendar_data.keys())[-3:]}")
                
        except Exception as e:
            print(f"    ❌ Error: {e}")
            
    def extract_location_details(self, content: str) -> Dict[str, str]:
        """Extract location details"""
        details = {}
        
        # Location name from address
        address_match = re.search(r'ADDRESS:\s*([^,]+)', content)
        if address_match:
            address = address_match.group(1).strip()
            if ',' in address:
                city = address.split(',')[0].strip()
                details['location_name'] = city
            details['address'] = address
            
        # OPS Manager
        ops_match = re.search(r'OPS MANAGER:\s*([^\n,]+)', content)
        if ops_match:
            details['ops_manager'] = ops_match.group(1).strip()
            
        # Sales Phone
        sales_match = re.search(r'SALES #:\s*([^\n,]+)', content)
        if sales_match:
            details['sales_phone'] = sales_match.group(1).strip()
            
        # Terminal ID
        terminal_match = re.search(r'Terminal ID:\s*([^\n,]+)', content)
        if terminal_match:
            details['terminal_id'] = terminal_match.group(1).strip()
            
        # Truck Count
        truck_match = re.search(r'# OF TRUCKS:\s*([^\n,]+)', content)
        if truck_match:
            details['truck_count'] = truck_match.group(1).strip()
            
        # Email
        email_match = re.search(r'E-TRANSFER:\s*([^\n,]+)', content)
        if email_match:
            details['email'] = email_match.group(1).strip()
            
        return details
        
    def extract_calendar_data(self, content: str) -> Dict[str, float]:
        """Extract calendar data"""
        calendar_data = {}
        
        # Find month patterns
        month_patterns = self.find_month_patterns(content)
        
        for month_name, month_num in month_patterns:
            monthly_data = self.extract_monthly_data(content, month_name, month_num)
            calendar_data.update(monthly_data)
            
        return calendar_data
        
    def find_month_patterns(self, content: str) -> List[tuple]:
        """Find month patterns"""
        months_found = []
        
        month_numbers = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
            'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
            'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        }
        
        # Look for the actual pattern: DURHAM,,,,,,,MAR,,DURHAM,,,,,,,APR,
        month_pattern = r'([A-Z]+),+([A-Z]{3}),+([A-Z]+),+([A-Z]{3})'
        matches = re.findall(month_pattern, content)
        
        for match in matches:
            location1, month1, location2, month2 = match
            if month1 in month_numbers:
                months_found.append((month1, month_numbers[month1]))
            if month2 in month_numbers:
                months_found.append((month2, month_numbers[month2]))
                
        # Also look for single month patterns
        for month_name, month_num in month_numbers.items():
            if re.search(month_name, content):
                if (month_name, month_num) not in months_found:
                    months_found.append((month_name, month_num))
                    
        return months_found
        
    def extract_monthly_data(self, content: str, month_name: str, month_num: str) -> Dict[str, float]:
        """Extract data for a specific month"""
        monthly_data = {}
        
        # Find the month section
        month_pattern = f'([A-Z]+),+{month_name},+([A-Z]+),+([A-Z]{{3}})'
        match = re.search(month_pattern, content)
        
        if not match:
            return monthly_data
            
        # Find calendar section
        calendar_start = match.end()
        calendar_section = content[calendar_start:calendar_start + 3000]
        
        lines = calendar_section.split('\n')
        
        for i, line in enumerate(lines):
            if 'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY' in line:
                # Found calendar header
                for j in range(i + 1, min(i + 15, len(lines))):
                    data_line = lines[j]
                    if ',' in data_line:
                        parts = data_line.split(',')
                        for k, part in enumerate(parts):
                            part = part.strip()
                            if part.isdigit() and 1 <= int(part) <= 31:
                                day = int(part)
                                # Look for price in next line
                                if j + 1 < len(lines):
                                    next_line = lines[j + 1]
                                    if ',' in next_line:
                                        next_parts = next_line.split(',')
                                        if k < len(next_parts):
                                            price_part = next_parts[k].strip()
                                            price_match = re.search(r'(\d+)', price_part)
                                            if price_match:
                                                price = float(price_match.group(1))
                                                if 100 <= price <= 500:
                                                    date_key = f"2025-{month_num}-{day:02d}"
                                                    monthly_data[date_key] = price
                                                    
        return monthly_data
        
    def print_summary(self):
        """Print comprehensive summary"""
        print("\n" + "=" * 60)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 60)
        
        total_files = len(self.results)
        files_with_calendar = sum(1 for r in self.results.values() if r['calendar_dates'] > 0)
        total_calendar_dates = sum(r['calendar_dates'] for r in self.results.values())
        
        print(f"\n📈 OVERALL STATISTICS:")
        print(f"  Total files tested: {total_files}")
        print(f"  Files with calendar data: {files_with_calendar}")
        print(f"  Total calendar dates: {total_calendar_dates}")
        print(f"  Average dates per file: {total_calendar_dates / max(files_with_calendar, 1):.1f}")
        
        print(f"\n📅 CALENDAR DATA BREAKDOWN:")
        for file_name, result in self.results.items():
            if result['calendar_dates'] > 0:
                print(f"  {file_name}: {result['calendar_dates']} dates")
                
        print(f"\n📍 LOCATION DETAILS BREAKDOWN:")
        location_fields = ['location_name', 'ops_manager', 'address', 'sales_phone', 'terminal_id', 'truck_count', 'email']
        for field in location_fields:
            count = sum(1 for r in self.results.values() if r['location_details'].get(field))
            print(f"  {field}: {count}/{total_files} files")
            
        print(f"\n📆 MONTH PATTERNS FOUND:")
        all_months = set()
        for result in self.results.values():
            all_months.update([m[0] for m in result['month_patterns']])
        for month in sorted(all_months):
            count = sum(1 for r in self.results.values() if any(m[0] == month for m in r['month_patterns']))
            print(f"  {month}: {count} files")
            
        print(f"\n🔍 LARGEST FILES (by lines):")
        sorted_files = sorted(self.results.items(), key=lambda x: x[1]['lines'], reverse=True)
        for file_name, result in sorted_files[:10]:
            print(f"  {file_name}: {result['lines']} lines, {result['chars']} chars")

def main():
    tester = ComprehensiveTester()
    tester.test_all_csvs()

if __name__ == "__main__":
    main()
