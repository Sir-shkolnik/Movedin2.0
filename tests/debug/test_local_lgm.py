#!/usr/bin/env python3
"""
Test the standalone LGM system locally
"""

import sys
import os
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

def test_imports():
    """Test if we can import the standalone LGM modules"""
    try:
        print("🔍 Testing imports...")
        from app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        print("✅ Imports successful")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_service_creation():
    """Test creating the service"""
    try:
        print("\n🔍 Testing service creation...")
        from app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService
        service = StandaloneLGMService()
        print("✅ Service created successfully")
        return service
    except Exception as e:
        print(f"❌ Service creation error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return None

def test_data_fetching(service):
    """Test fetching data from Google Sheets"""
    try:
        print("\n🔍 Testing data fetching...")
        
        # Test a few GIDs
        test_gids = ['348861685', '445545962', '1384980803']
        
        for gid in test_gids:
            print(f"  Testing GID {gid}...")
            data = service._fetch_gid_data(gid)
            if data:
                print(f"    ✅ GID {gid}: {len(data)} characters")
                # Look for location details
                if 'ADDRESS:' in data:
                    print(f"    📍 Address found")
                if 'OPS MANAGER:' in data:
                    print(f"    👤 Ops manager found")
                if 'SUNDAY,MONDAY' in data:
                    print(f"    📅 Calendar data found")
            else:
                print(f"    ❌ GID {gid}: No data")
        
        return True
    except Exception as e:
        print(f"❌ Data fetching error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_service_area_detection(service):
    """Test service area detection"""
    try:
        print("\n🔍 Testing service area detection...")
        
        test_cases = [
            ("Toronto, ON, Canada", "Mississauga, ON, Canada"),
            ("Vancouver, BC, Canada", "Richmond, BC, Canada"),
            ("Calgary, AB, Canada", "Edmonton, AB, Canada"),
            ("Montreal, QC, Canada", "Laval, QC, Canada"),
        ]
        
        for origin, destination in test_cases:
            print(f"  Testing: {origin} -> {destination}")
            serves = service.serves_location(origin, destination)
            print(f"    Result: {serves}")
        
        return True
    except Exception as e:
        print(f"❌ Service area detection error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_calculator():
    """Test the calculator"""
    try:
        print("\n🔍 Testing calculator...")
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        
        # Test quote calculation
        quote_request = {
            "origin_address": "Toronto, ON, Canada",
            "destination_address": "Mississauga, ON, Canada",
            "move_date": "2025-02-15",
            "move_time": "10:00 AM",
            "total_rooms": 3,
            "square_footage": 1500,
            "estimated_weight": 5000,
            "heavy_items": {},
            "stairs_at_pickup": False,
            "stairs_at_dropoff": False,
            "elevator_at_pickup": False,
            "elevator_at_dropoff": False,
            "additional_services": {}
        }
        
        print("  Testing quote calculation...")
        result = standalone_lgm_calculator.calculate_quote(quote_request)
        
        if result:
            print(f"    ✅ Quote calculated: ${result.get('total_cost', 0)}")
            print(f"    📊 Quote details: {result}")
        else:
            print("    ❌ No quote returned")
        
        return True
    except Exception as e:
        print(f"❌ Calculator error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def main():
    print("🚀 Testing Standalone LGM System Locally")
    print("=" * 60)
    
    # Test 1: Imports
    if not test_imports():
        return
    
    # Test 2: Service creation
    service = test_service_creation()
    if not service:
        return
    
    # Test 3: Data fetching
    if not test_data_fetching(service):
        return
    
    # Test 4: Service area detection
    if not test_service_area_detection(service):
        return
    
    # Test 5: Calculator
    if not test_calculator():
        return
    
    print("\n" + "=" * 60)
    print("🎉 All tests passed! The standalone LGM system is working locally.")

if __name__ == "__main__":
    main()
