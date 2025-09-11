#!/usr/bin/env python3
"""
Simple test for LGM smart parser
"""
import sys
import os
sys.path.append('backend')

def test_lgm_simple():
    """Test LGM smart parser with local CSV files"""
    
    print("🔍 Testing LGM Smart Parser...")
    
    try:
        # Read the CSV file I downloaded
        with open('test_gid_586231927.csv', 'r', encoding='utf-8') as f:
            csv_content = f.read()
        
        print(f"CSV content length: {len(csv_content)}")
        print("First 500 chars:")
        print(csv_content[:500])
        
        # Test smart parser
        from app.services.letsgetmoving.smart_calendar_parser import create_smart_parser
        
        smart_parser = create_smart_parser()
        result = smart_parser.parse_gid_complete("586231927", csv_content)
        
        print(f"\nSmart parser result keys: {list(result.keys())}")
        print(f"Location: {result.get('location')}")
        print(f"Metadata: {result.get('metadata')}")
        print(f"Calendar hourly price count: {len(result.get('calendar_hourly_price', {}))}")
        
        if result.get('calendar_hourly_price'):
            print("Sample calendar data:")
            for i, (date, rate) in enumerate(list(result.get('calendar_hourly_price', {}).items())[:5]):
                print(f"  {date}: {rate}")
        
        # Test conversion
        from app.services.google_sheets_service import GoogleSheetsService
        google_sheets_service = GoogleSheetsService()
        
        converted_result = google_sheets_service._convert_smart_parser_output(result, "586231927")
        
        print(f"\nConverted result keys: {list(converted_result.keys())}")
        print(f"Location details: {converted_result.get('location_details')}")
        print(f"Calendar data: {converted_result.get('calendar_data')}")
        
        # Check if dispatcher cache service would accept this data
        from app.services.dispatcher_cache_service import dispatcher_cache_service
        
        # Test if this data would pass the validation
        location_details = converted_result.get('location_details', {})
        calendar_data = converted_result.get('calendar_data', {})
        daily_rates = calendar_data.get('daily_rates', {})
        
        has_location = location_details.get('name') and location_details.get('name') != 'Unknown'
        has_rates = len(daily_rates) > 0
        
        print(f"\nValidation:")
        print(f"Has location: {has_location} ({location_details.get('name')})")
        print(f"Has rates: {has_rates} ({len(daily_rates)} rates)")
        
        if has_location and has_rates:
            print("✅ This dispatcher would pass validation!")
        else:
            print("❌ This dispatcher would be filtered out!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_lgm_simple()
