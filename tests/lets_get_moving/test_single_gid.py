#!/usr/bin/env python3
"""
Test single GID locally
"""
import requests
import csv
from io import StringIO
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def test_single_gid():
    """Test a single location GID"""
    
    # Test one location GID (not special)
    gid = '586231927'  # OAKVILLE
    url = f'https://docs.google.com/spreadsheets/d/1JmIRpRlH3J1XmCrWlHfVnOCP5kk_yMZAXwsBUhPwnzk/export?format=csv&gid={gid}'
    
    print(f'Testing GID: {gid}')
    print(f'URL: {url}')
    
    try:
        # Fetch CSV
        response = requests.get(url, allow_redirects=True, timeout=30)
        print(f'Status: {response.status_code}')
        
        if response.status_code == 200:
            csv_content = response.content.decode('utf-8')
            print(f'CSV length: {len(csv_content)} characters')
            
            # Show first 10 lines
            reader = csv.reader(StringIO(csv_content))
            rows = list(reader)
            print(f'Rows: {len(rows)}')
            print('First 10 rows:')
            for i, row in enumerate(rows[:10]):
                print(f'  {i}: {row}')
            
            # Test smart parser
            print('\n--- Testing Smart Parser ---')
            from app.services.letsgetmoving.smart_calendar_parser import create_smart_parser
            
            smart_parser = create_smart_parser()
            result = smart_parser.parse_gid_complete(gid, csv_content)
            
            print('Result keys:', list(result.keys()))
            print('Location:', result.get('location'))
            print('Metadata keys:', list(result.get('metadata', {}).keys()))
            print('Calendar data count:', len(result.get('calendar_hourly_price', {})))
            
            # Test Google Sheets service
            print('\n--- Testing Google Sheets Service ---')
            from app.services.google_sheets_service import GoogleSheetsService
            
            google_sheets_service = GoogleSheetsService()
            parsed_data = google_sheets_service._parse_csv_data(csv_content, gid)
            
            print('Parsed data keys:', list(parsed_data.keys()))
            print('Location:', parsed_data.get('location'))
            
        else:
            print(f'Error: {response.status_code}')
            print(f'Response: {response.text[:500]}')
            
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_single_gid()

