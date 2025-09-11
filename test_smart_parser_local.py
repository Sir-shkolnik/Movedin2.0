#!/usr/bin/env python3
"""
Test smart parser locally
"""
import sys
import os
sys.path.append('backend')

def test_smart_parser():
    """Test smart parser with local CSV files"""
    
    print("🔍 Testing Smart Parser locally...")
    
    try:
        # Import smart parser
        from app.services.letsgetmoving.smart_calendar_parser import create_smart_parser
        
        # Test with one CSV file
        csv_file = "test_gid_586231927.csv"
        gid = "586231927"
        
        print(f"Testing with {csv_file}")
        
        # Read CSV content
        with open(csv_file, 'r', encoding='utf-8') as f:
            csv_content = f.read()
        
        print(f"CSV content length: {len(csv_content)}")
        
        # Create smart parser
        smart_parser = create_smart_parser()
        
        # Parse the CSV
        result = smart_parser.parse_gid_complete(gid, csv_content)
        
        print(f"Smart parser result keys: {list(result.keys())}")
        print(f"Location: {result.get('location')}")
        print(f"Metadata: {result.get('metadata')}")
        print(f"Calendar hourly price count: {len(result.get('calendar_hourly_price', {}))}")
        
        # Test the conversion
        from app.services.google_sheets_service import GoogleSheetsService
        google_sheets_service = GoogleSheetsService()
        
        converted_result = google_sheets_service._convert_smart_parser_output(result, gid)
        
        print(f"Converted result keys: {list(converted_result.keys())}")
        print(f"Location details: {converted_result.get('location_details')}")
        print(f"Calendar data: {converted_result.get('calendar_data')}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_smart_parser()
