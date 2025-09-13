#!/usr/bin/env python3
"""
Simple test for the standalone LGM system
"""

import requests
import csv
import io
import re
from datetime import datetime, timedelta

# Test the standalone service directly
def test_standalone_lgm():
    print("🔍 Testing Standalone LGM System")
    print("=" * 50)
    
    # Test GID to location mapping
    gid_location_map = {
        '348861685': 'Toronto (North York)',
        '445545962': 'Richmond BC',
        '1384980803': 'Calgary',
        '322544773': 'Montreal',
        '586231927': 'Abbotsford'
    }
    
    base_url = "https://docs.google.com/spreadsheets/d/1v6IguN9coUGXo62JZgkZcHZTJZL4-F-PUcq9izMWSME/export?format=csv&gid="
    
    print("\n1. Testing CSV data retrieval:")
    for gid, expected_location in gid_location_map.items():
        print(f"\nTesting GID {gid} ({expected_location}):")
        try:
            url = f"{base_url}{gid}"
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Parse CSV
            csv_content = response.text
            csv_reader = csv.reader(io.StringIO(csv_content))
            rows = list(csv_reader)
            
            print(f"  ✅ CSV retrieved: {len(rows)} rows")
            
            # Look for location patterns
            location_found = False
            for row in rows:
                if row and any(month in ' '.join(row) for month in ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']):
                    print(f"  ✅ Found calendar row: {row[:5]}...")
                    location_found = True
                    break
            
            if not location_found:
                print(f"  ⚠️  No calendar data found")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("\n2. Testing city extraction:")
    test_addresses = [
        "Toronto, ON, Canada",
        "Vancouver, BC, Canada", 
        "Calgary, AB, Canada",
        "Mississauga, ON, Canada",
        "Burnaby, BC, Canada"
    ]
    
    for address in test_addresses:
        city = extract_city(address)
        print(f"  {address} → {city}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

def extract_city(address):
    """Extract city name from address"""
    if not address:
        return None
    
    address_lower = address.lower()
    
    # Check for major cities
    for city in ["toronto", "vancouver", "calgary", "montreal", "winnipeg", "halifax", "fredericton"]:
        if city in address_lower:
            return city.title()
    
    # Check for GTA cities
    gta_cities = ["mississauga", "brampton", "vaughan", "markham", "richmond hill", "oakville", "burlington", "hamilton", "oshawa", "whitby", "ajax", "pickering", "barrie", "aurora", "brantford", "kitchener", "waterloo", "windsor", "peterborough"]
    for city in gta_cities:
        if city in address_lower:
            return city.title()
    
    # Check for BC cities
    bc_cities = ["burnaby", "richmond", "victoria", "abbotsford", "port moody", "surrey", "coquitlam", "maple ridge", "langley", "delta", "port coquitlam"]
    for city in bc_cities:
        if city in address_lower:
            return city.title()
    
    return None

if __name__ == "__main__":
    test_standalone_lgm()
