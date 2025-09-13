#!/usr/bin/env python3
"""
Test script to test CSV parsing locally
"""
import requests
import csv
from io import StringIO
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.google_sheets_service import GoogleSheetsService

def test_csv_parsing():
    """Test CSV parsing with actual Google Sheets data"""
    
    # Test URLs from g.txt
    test_urls = [
        ("https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=888205070", "888205070"),
        ("https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=586231927", "586231927"),
        ("https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid=759134820", "759134820"),
    ]
    
    google_sheets_service = GoogleSheetsService()
    
    for url, gid in test_urls:
        print(f"\n{'='*60}")
        print(f"TESTING GID: {gid}")
        print(f"URL: {url}")
        print(f"{'='*60}")
        
        try:
            # Fetch CSV data
            response = requests.get(url, allow_redirects=True, timeout=30)
            response.raise_for_status()
            csv_content = response.content.decode('utf-8')
            reader = csv.reader(StringIO(csv_content))
            rows = list(reader)
            
            print(f"CSV Rows: {len(rows)}")
            print(f"First 10 rows:")
            for i, row in enumerate(rows[:10]):
                print(f"  Row {i}: {row}")
            
            # Test location details extraction
            print(f"\n--- LOCATION DETAILS ---")
            location_details = google_sheets_service._extract_location_details_from_csv(rows, gid)
            print(f"Location Details: {location_details}")
            
            # Test calendar data extraction
            print(f"\n--- CALENDAR DATA ---")
            calendar_data = google_sheets_service._robust_extract_calendar_data(rows)
            print(f"Calendar Data: {calendar_data}")
            
            # Test full parsing
            print(f"\n--- FULL PARSING ---")
            full_data = google_sheets_service.parse_and_normalize_public_tab("1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk", gid)
            print(f"Full Data Keys: {list(full_data.keys())}")
            print(f"Location: {full_data.get('location', 'MISSING')}")
            print(f"Location Details: {full_data.get('location_details', {})}")
            print(f"Calendar Data: {full_data.get('calendar_data', {})}")
            
        except Exception as e:
            print(f"ERROR: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_csv_parsing()
