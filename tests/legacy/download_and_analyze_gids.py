#!/usr/bin/env python3
"""
Download all GIDs and analyze the data
"""

import requests
import csv
import io
import os
from datetime import datetime

def download_gid_csv(gid, base_url, output_dir):
    """Download a single GID CSV"""
    try:
        url = f"{base_url}{gid}"
        print(f"Downloading GID {gid}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Save to file
        filename = f"{output_dir}/gid_{gid}.csv"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(response.text)
        
        # Parse CSV to analyze
        csv_reader = csv.reader(io.StringIO(response.text))
        rows = list(csv_reader)
        
        print(f"  ✅ Downloaded: {len(rows)} rows")
        
        # Look for location patterns
        location_patterns = []
        calendar_patterns = []
        
        for i, row in enumerate(rows):
            if not row:
                continue
            row_text = ' '.join(row).upper()
            
            # Look for location names
            if any(city in row_text for city in ['TORONTO', 'VANCOUVER', 'CALGARY', 'MONTREAL', 'MISSISSAUGA', 'BURNABY', 'RICHMOND']):
                location_patterns.append((i, row))
            
            # Look for calendar patterns
            if any(month in row_text for month in ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']):
                calendar_patterns.append((i, row))
        
        print(f"  📍 Location patterns: {len(location_patterns)}")
        print(f"  📅 Calendar patterns: {len(calendar_patterns)}")
        
        if location_patterns:
            print(f"  📍 First location: {location_patterns[0][1][:5]}...")
        if calendar_patterns:
            print(f"  📅 First calendar: {calendar_patterns[0][1][:5]}...")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error downloading GID {gid}: {e}")
        return False

def main():
    print("🔍 Downloading and Analyzing All GIDs")
    print("=" * 60)
    
    # Create output directory
    output_dir = "csv_data_analysis"
    os.makedirs(output_dir, exist_ok=True)
    
    # GID to location mapping
    gid_mapping = {
        '348861685': 'Toronto (North York)',
        '445545962': 'Richmond BC',
        '1384980803': 'Calgary',
        '322544773': 'Montreal',
        '586231927': 'Abbotsford',
        '759134820': 'Ajax',
        '2023718082': 'Aurora',
        '205064403': 'Barrie',
        '1902434505': 'Brantford',
        '685880450': 'Burlington',
        '1985906253': 'Burnaby',
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
        '1604601748': 'Vaughan',
        '1211144815': 'Victoria',
        '1802285746': 'Kitchener',
        '1257914670': 'Windsor',
        '1904136712': 'Winnipeg'
    }
    
    base_url = "https://docs.google.com/spreadsheets/d/1v6IguN9coUGXo62JZgkZcHZTJZL4-F-PUcq9izMWSME/export?format=csv&gid="
    
    print(f"Downloading {len(gid_mapping)} GIDs...")
    print()
    
    successful_downloads = 0
    failed_downloads = 0
    
    for gid, location_name in gid_mapping.items():
        print(f"GID {gid} ({location_name}):")
        if download_gid_csv(gid, base_url, output_dir):
            successful_downloads += 1
        else:
            failed_downloads += 1
        print()
    
    print("=" * 60)
    print(f"Download Summary:")
    print(f"  ✅ Successful: {successful_downloads}")
    print(f"  ❌ Failed: {failed_downloads}")
    print(f"  📁 Files saved to: {output_dir}/")
    
    # Analyze a few key files in detail
    print("\n" + "=" * 60)
    print("Detailed Analysis of Key Files:")
    print()
    
    key_gids = ['348861685', '445545962', '1384980803', '322544773', '586231927']
    
    for gid in key_gids:
        filename = f"{output_dir}/gid_{gid}.csv"
        if os.path.exists(filename):
            print(f"📄 Analyzing GID {gid} ({gid_mapping.get(gid, 'Unknown')}):")
            analyze_csv_file(filename)
            print()

def analyze_csv_file(filename):
    """Analyze a CSV file in detail"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            csv_reader = csv.reader(f)
            rows = list(csv_reader)
        
        print(f"  📊 Total rows: {len(rows)}")
        
        # Look for location details
        location_info = {}
        for i, row in enumerate(rows):
            if not row:
                continue
            row_text = ' '.join(row).upper()
            
            if 'ADDRESS:' in row_text:
                for cell in row:
                    if 'ADDRESS:' in cell.upper():
                        location_info['address'] = cell.replace('ADDRESS:', '').strip()
                        break
            
            if 'PHONE:' in row_text or 'TEL:' in row_text:
                for cell in row:
                    if 'PHONE:' in cell.upper() or 'TEL:' in cell.upper():
                        location_info['phone'] = cell.replace('PHONE:', '').replace('TEL:', '').strip()
                        break
            
            if 'EMAIL:' in row_text:
                for cell in row:
                    if 'EMAIL:' in cell.upper():
                        location_info['email'] = cell.replace('EMAIL:', '').strip()
                        break
        
        if location_info:
            print(f"  📍 Location details found:")
            for key, value in location_info.items():
                print(f"    {key}: {value}")
        
        # Look for calendar data
        calendar_dates = []
        for i, row in enumerate(rows):
            if not row:
                continue
            row_text = ' '.join(row)
            
            # Look for month headers
            if any(month in row_text.upper() for month in ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']):
                print(f"  📅 Calendar row {i}: {row[:10]}...")
                
                # Look for dates in next few rows
                for j in range(i+1, min(i+5, len(rows))):
                    if j < len(rows) and rows[j]:
                        date_row = rows[j]
                        if date_row and date_row[0].isdigit():
                            print(f"    Date row {j}: {date_row[:10]}...")
                            calendar_dates.extend([d for d in date_row if d.isdigit()])
                            break
        
        if calendar_dates:
            print(f"  📅 Found {len(calendar_dates)} calendar dates")
        
    except Exception as e:
        print(f"  ❌ Error analyzing file: {e}")

if __name__ == "__main__":
    main()
