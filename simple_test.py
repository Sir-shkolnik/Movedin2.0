#!/usr/bin/env python3
import requests
import csv
from io import StringIO

# Test single GID
gid = '586231927'
url = f'https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid={gid}'

print(f"Testing GID: {gid}")
print(f"URL: {url}")

# Fetch with redirect
response = requests.get(url, allow_redirects=True, timeout=30)
print(f"Status: {response.status_code}")

if response.status_code == 200:
    csv_content = response.text
    print(f"CSV length: {len(csv_content)} characters")
    
    # Parse CSV
    reader = csv.reader(StringIO(csv_content))
    rows = list(reader)
    print(f"Total rows: {len(rows)}")
    
    # Show first 15 rows
    print("\nFirst 15 rows:")
    for i, row in enumerate(rows[:15]):
        print(f"Row {i:2d}: {row}")
        
    # Look for location name
    location_name = None
    for i, row in enumerate(rows):
        if row and 'LOCATION DETAILS:' in str(row):
            # Look for location name in next few rows
            for j in range(i+1, min(i+10, len(rows))):
                if rows[j] and any('DURHAM' in str(cell) for cell in rows[j]):
                    location_name = 'DURHAM'
                    break
            break
    
    print(f"\nFound location: {location_name}")
    
    # Look for rates
    print("\nLooking for rates...")
    for i, row in enumerate(rows):
        if row and any('139' in str(cell) for cell in row):
            print(f"Row {i}: {row}")
else:
    print(f"Error: {response.status_code}")
    print(response.text[:500])
