#!/usr/bin/env python3
"""
Parse CSV files locally to understand the data structure
"""
import csv
import re
from typing import Dict, List, Any

def parse_csv_file(filename: str) -> Dict[str, Any]:
    """Parse a single CSV file and extract location details"""
    
    print(f"\n{'='*60}")
    print(f"Parsing: {filename}")
    print(f"{'='*60}")
    
    result = {
        'location_name': 'Unknown',
        'address': '',
        'phone': '',
        'email': '',
        'truck_count': '',
        'rates': [],
        'raw_data': []
    }
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            rows = list(reader)
            
        print(f"Total rows: {len(rows)}")
        
        # Extract location details
        for i, row in enumerate(rows):
            if not row:
                continue
                
            row_str = ','.join(str(cell) for cell in row)
            
            # Look for address
            if 'ADDRESS:' in row_str:
                address_match = re.search(r'ADDRESS:\s*([^,]+)', row_str)
                if address_match:
                    result['address'] = address_match.group(1).strip()
                    print(f"Address found: {result['address']}")
            
            # Look for phone
            if 'OPS MANAGER:' in row_str:
                phone_match = re.search(r'OPS MANAGER:\s*([^,]+)', row_str)
                if phone_match:
                    result['phone'] = phone_match.group(1).strip()
                    print(f"Phone found: {result['phone']}")
            
            # Look for email
            if 'E-TRANSFER:' in row_str:
                email_match = re.search(r'E-TRANSFER:\s*([^,]+)', row_str)
                if email_match:
                    result['email'] = email_match.group(1).strip()
                    print(f"Email found: {result['email']}")
            
            # Look for truck count
            if 'TRUCKS:' in row_str:
                truck_match = re.search(r'TRUCKS:\s*([^,]+)', row_str)
                if truck_match:
                    result['truck_count'] = truck_match.group(1).strip()
                    print(f"Truck count found: {result['truck_count']}")
            
            # Look for rates (numbers like 139, 149, 169)
            if re.search(r'\b(139|149|169|179)\b', row_str):
                rates = re.findall(r'\b(139|149|169|179)\b', row_str)
                if rates:
                    result['rates'].extend(rates)
                    print(f"Rates found: {rates}")
        
        # Extract location name from address
        if result['address']:
            # Try to extract city from address
            address_parts = result['address'].split(',')
            if len(address_parts) >= 2:
                city_part = address_parts[-2].strip()  # Second to last part
                result['location_name'] = city_part
                print(f"Location name extracted: {result['location_name']}")
        
        # Show summary
        print(f"\nSummary:")
        print(f"Location: {result['location_name']}")
        print(f"Address: {result['address']}")
        print(f"Phone: {result['phone']}")
        print(f"Email: {result['email']}")
        print(f"Truck count: {result['truck_count']}")
        print(f"Rates: {list(set(result['rates']))}")
        
        return result
        
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return result

def main():
    """Parse all downloaded CSV files"""
    
    import os
    
    # Find all CSV files
    csv_files = [f for f in os.listdir('.') if f.startswith('test_gid_') and f.endswith('.csv')]
    
    if not csv_files:
        print("No CSV files found. Please download some first.")
        return
    
    print(f"Found {len(csv_files)} CSV files to parse")
    
    results = {}
    for csv_file in csv_files:
        gid = csv_file.replace('test_gid_', '').replace('.csv', '')
        results[gid] = parse_csv_file(csv_file)
    
    # Show summary of all results
    print(f"\n{'='*60}")
    print("SUMMARY OF ALL LOCATIONS")
    print(f"{'='*60}")
    
    for gid, data in results.items():
        print(f"GID {gid}: {data['location_name']} - {data['address']}")

if __name__ == "__main__":
    main()
