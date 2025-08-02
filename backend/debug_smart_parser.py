#!/usr/bin/env python3
"""
Debug script to test smart parser extraction for AJAX
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.letsgetmoving.smart_calendar_parser import create_smart_parser

def test_ajax():
    """Test smart parser for AJAX GID"""
    
    # Read the CSV file
    csv_file = "csv_exports/586231927.csv"
    with open(csv_file, 'r') as f:
        csv_content = f.read()
    
    print("🔍 Testing smart parser for AJAX (GID 586231927)")
    print(f"📄 CSV file: {csv_file}")
    print(f"📏 CSV length: {len(csv_content)} characters")
    
    # Create smart parser
    smart_parser = create_smart_parser()
    
    # Test calendar extraction
    print("\n📅 Testing calendar extraction...")
    calendar_data = smart_parser.extract_full_calendar(csv_content)
    
    print(f"📊 Total calendar dates extracted: {len(calendar_data)}")
    
    # Check what months are extracted
    months = {}
    for date_key in calendar_data.keys():
        month = date_key.split('-')[1]
        if month not in months:
            months[month] = 0
        months[month] += 1
    
    print(f"\n📅 Months extracted:")
    for month in sorted(months.keys()):
        month_names = {
            '01': 'January', '02': 'February', '03': 'March', '04': 'April',
            '05': 'May', '06': 'June', '07': 'July', '08': 'August',
            '09': 'September', '10': 'October', '11': 'November', '12': 'December'
        }
        month_name = month_names.get(month, month)
        print(f"  {month_name} ({month}): {months[month]} dates")
    
    # Check specific dates
    test_dates = [
        "2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04", "2025-04-05",
        "2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05",
        "2025-08-01", "2025-08-02", "2025-08-03", "2025-08-04", "2025-08-05",
        "2025-09-01", "2025-09-02", "2025-09-03", "2025-09-04", "2025-09-05"
    ]
    
    print("\n📋 Checking specific dates:")
    for date in test_dates:
        rate = calendar_data.get(date, "NOT FOUND")
        print(f"  {date}: ${rate}")

if __name__ == "__main__":
    test_ajax() 