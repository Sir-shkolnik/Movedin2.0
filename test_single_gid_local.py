#!/usr/bin/env python3
"""
Test single GID locally - download CSV and parse it
"""
import requests
import csv
from io import StringIO
import sys
import os

def test_single_gid(gid, location_name):
    """Test a single GID by downloading CSV and parsing it"""
    
    print(f"\n{'='*60}")
    print(f"Testing GID: {gid} - {location_name}")
    print(f"{'='*60}")
    
    # Google Sheets URL
    url = f'https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid={gid}'
    
    try:
        # Download CSV
        print(f"Downloading CSV from: {url}")
        response = requests.get(url, allow_redirects=True, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Failed to download CSV: {response.status_code}")
            return
        
        csv_content = response.text
        print(f"CSV length: {len(csv_content)} characters")
        
        # Parse CSV
        reader = csv.reader(StringIO(csv_content))
        rows = list(reader)
        print(f"Total rows: {len(rows)}")
        
        # Show first 20 rows
        print(f"\nFirst 20 rows:")
        for i, row in enumerate(rows[:20]):
            print(f"Row {i:2d}: {row}")
        
        # Look for location details
        print(f"\nLooking for location details...")
        location_found = False
        for i, row in enumerate(rows):
            if row and any('LOCATION DETAILS:' in str(cell) for cell in row):
                print(f"Found LOCATION DETAILS at row {i}: {row}")
                location_found = True
                
                # Look for location name in next few rows
                for j in range(i+1, min(i+10, len(rows))):
                    if rows[j] and any(location_name.upper() in str(cell).upper() for cell in rows[j]):
                        print(f"Found location name at row {j}: {rows[j]}")
                        break
        
        if not location_found:
            print("❌ No LOCATION DETAILS found")
        
        # Look for rates
        print(f"\nLooking for rates...")
        rates_found = []
        for i, row in enumerate(rows):
            if row and any('139' in str(cell) for cell in row):
                rates_found.append((i, row))
                if len(rates_found) <= 5:  # Show first 5 rate rows
                    print(f"Rate row {i}: {row}")
        
        print(f"Found {len(rates_found)} rows with rates")
        
        # Look for address
        print(f"\nLooking for address...")
        for i, row in enumerate(rows):
            if row and any('ADDRESS:' in str(cell) for cell in row):
                print(f"Address row {i}: {row}")
                break
        
        # Look for phone
        print(f"\nLooking for phone...")
        for i, row in enumerate(rows):
            if row and any('OPS MANAGER:' in str(cell) for cell in row):
                print(f"Phone row {i}: {row}")
                break
        
        # Look for truck count
        print(f"\nLooking for truck count...")
        for i, row in enumerate(rows):
            if row and any('TRUCKS:' in str(cell) for cell in row):
                print(f"Truck row {i}: {row}")
                break
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Test multiple GIDs"""
    
    # Test GIDs one by one
    test_gids = [
        ("586231927", "DURHAM"),
        ("759134820", "AJAX"), 
        ("2023718082", "AURORA"),
        ("205064403", "BARRIE"),
        ("2117865571", "OTTAWA"),
        ("1902434505", "WINDSOR"),
        ("685880450", "SUDBURY"),
        ("1985906253", "WATERLOO"),
        ("1384980803", "CALGARY"),
        ("2061150538", "NIAGARA FALLS"),
        ("1324028052", "DOWNTOWN TORONTO"),
        ("1846632241", "KITCHENER"),
        ("627208617", "BURNABY"),
        ("1843371269", "VANCOUVER"),
        ("858770585", "SURREY"),
        ("551728640", "RICHMOND BC"),
        ("478561055", "COQUITLAM"),
        ("1311971885", "LANGLEY"),
        ("853107228", "DELTA"),
        ("1843371269", "VANCOUVER"),
        ("1384980803", "CALGARY"),
        ("2061150538", "EDMONTON"),
        ("2117865571", "WINNIPEG"),
        ("1902434505", "REGINA"),
        ("685880450", "MONTREAL"),
        ("1985906253", "HALIFAX"),
        ("1384980803", "FREDERICTON")
    ]
    
    print("🔍 Testing LGM GIDs locally...")
    print("This will download and parse each GID to understand the data structure")
    
    for gid, location_name in test_gids:
        test_single_gid(gid, location_name)
        
        # Ask user if they want to continue
        response = input(f"\nContinue to next GID? (y/n/q to quit): ").lower()
        if response == 'q':
            break
        elif response == 'n':
            continue

if __name__ == "__main__":
    main()
