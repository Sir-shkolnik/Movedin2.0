#!/usr/bin/env python3
"""
Test the standalone LGM system with downloaded CSV data
"""

import sys
import os
import csv
import io

def test_csv_parsing():
    """Test parsing the downloaded CSV files"""
    print("🔍 Testing CSV Data Parsing")
    print("=" * 50)
    
    csv_files = [
        "csv_analysis/toronto_north_york_final.csv",
        "csv_analysis/richmond_bc_final.csv", 
        "csv_analysis/calgary_final.csv",
        "csv_analysis/montreal_final.csv",
        "csv_analysis/abbotsford_final.csv"
    ]
    
    for csv_file in csv_files:
        if not os.path.exists(csv_file):
            print(f"❌ File not found: {csv_file}")
            continue
            
        print(f"\n📄 Analyzing {csv_file}:")
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"  📊 File size: {len(content)} characters")
        
        # Look for location details
        location_info = {}
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            if 'ADDRESS:' in line:
                location_info['address'] = line.replace('ADDRESS:', '').strip().strip('"')
            elif 'OPS MANAGER:' in line:
                location_info['ops_manager'] = line.replace('OPS MANAGER:', '').strip()
            elif 'SALES #:' in line:
                location_info['sales_phone'] = line.replace('SALES #:', '').strip()
            elif 'Terminal ID:' in line:
                location_info['terminal_id'] = line.replace('Terminal ID:', '').strip()
        
        if location_info:
            print(f"  📍 Location details:")
            for key, value in location_info.items():
                print(f"    {key}: {value}")
        
        # Look for calendar data
        calendar_months = []
        calendar_dates = []
        
        for i, line in enumerate(lines):
            if any(month in line.upper() for month in ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']):
                calendar_months.append((i, line.strip()))
            
            # Look for date rows (numbers 1-31)
            if line.strip() and line.split(',')[0].strip().isdigit():
                dates = [d.strip() for d in line.split(',') if d.strip().isdigit()]
                if dates:
                    calendar_dates.extend(dates)
        
        print(f"  📅 Calendar months found: {len(calendar_months)}")
        for month_line in calendar_months[:3]:  # Show first 3
            print(f"    {month_line[1][:50]}...")
        
        print(f"  📅 Calendar dates found: {len(calendar_dates)}")
        if calendar_dates:
            print(f"    Sample dates: {calendar_dates[:10]}")
        
        # Look for pricing data
        pricing_data = []
        for line in lines:
            if line.strip() and any(price in line for price in ['139', '149', '159', '169', '199']):
                prices = [p.strip() for p in line.split(',') if p.strip().isdigit()]
                if prices:
                    pricing_data.extend(prices)
        
        print(f"  💰 Pricing data found: {len(pricing_data)} prices")
        if pricing_data:
            unique_prices = list(set(pricing_data))
            print(f"    Unique prices: {sorted(unique_prices)}")

def test_q4_2025_data():
    """Test if we can find Q4 2025 data"""
    print("\n🔍 Testing Q4 2025 Data Availability")
    print("=" * 50)
    
    # Q4 2025 months: October, November, December
    q4_months = ['OCT', 'NOV', 'DEC']
    
    csv_files = [
        "csv_analysis/toronto_north_york_final.csv",
        "csv_analysis/richmond_bc_final.csv", 
        "csv_analysis/calgary_final.csv",
        "csv_analysis/montreal_final.csv",
        "csv_analysis/abbotsford_final.csv"
    ]
    
    for csv_file in csv_files:
        if not os.path.exists(csv_file):
            continue
            
        print(f"\n📄 Checking {csv_file} for Q4 2025:")
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found_months = []
        for month in q4_months:
            if month in content.upper():
                found_months.append(month)
        
        if found_months:
            print(f"  ✅ Found Q4 2025 months: {found_months}")
        else:
            print(f"  ❌ No Q4 2025 months found")
        
        # Look for 2025 dates
        if '2025' in content:
            print(f"  ✅ Found 2025 references")
        else:
            print(f"  ❌ No 2025 references found")

def main():
    print("🚀 Testing Downloaded CSV Data")
    print("=" * 60)
    
    test_csv_parsing()
    test_q4_2025_data()
    
    print("\n" + "=" * 60)
    print("🎉 CSV data analysis complete!")

if __name__ == "__main__":
    main()
