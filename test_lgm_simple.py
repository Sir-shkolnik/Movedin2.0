#!/usr/bin/env python3
"""
Simple test for LGM system
"""

import sys
import os
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

def test_lgm_service():
    print("Testing LGM Service...")
    try:
        from app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService
        service = StandaloneLGMService()
        
        # Test fetching data for Toronto
        print("Fetching Toronto data...")
        data = service.get_dispatcher_data('348861685')
        if data:
            print(f"✅ Toronto data fetched: {data.get('location_name')}")
            print(f"  Calendar data: {len(data.get('calendar_data', {}))} entries")
        else:
            print("❌ Toronto data fetch failed")
        
        # Test service area detection
        print("Testing service area detection...")
        serves = service.serves_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        print(f"✅ Serves Toronto->Mississauga: {serves}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_lgm_calculator():
    print("\nTesting LGM Calculator...")
    try:
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        
        # Test serves_location
        serves = standalone_lgm_calculator.serves_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        print(f"✅ Calculator serves Toronto->Mississauga: {serves}")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Simple LGM Test")
    print("=" * 30)
    
    if test_lgm_service():
        print("✅ Service test passed")
    else:
        print("❌ Service test failed")
    
    if test_lgm_calculator():
        print("✅ Calculator test passed")
    else:
        print("❌ Calculator test failed")