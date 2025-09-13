#!/usr/bin/env python3
"""
Debug LGM dispatcher selection
"""
import sys
import os
sys.path.append('backend')

def test_lgm_dispatcher_selection():
    """Test LGM dispatcher selection step by step"""
    
    print("🔍 Testing LGM Dispatcher Selection...")
    
    try:
        # Test 1: Google Sheets Service
        print("\n1. Testing Google Sheets Service...")
        from app.services.google_sheets_service import google_sheets_service
        
        all_dispatchers = google_sheets_service.get_all_dispatchers_data()
        print(f"   Loaded {len(all_dispatchers)} dispatchers from Google Sheets")
        
        if all_dispatchers:
            print("   First dispatcher keys:", list(all_dispatchers.keys())[:3])
            first_gid = list(all_dispatchers.keys())[0]
            first_data = all_dispatchers[first_gid]
            print(f"   First dispatcher data keys: {list(first_data.keys())}")
            print(f"   Location details: {first_data.get('location_details', {})}")
            print(f"   Calendar data: {first_data.get('calendar_data', {})}")
        else:
            print("   ❌ No dispatchers loaded!")
            return
        
        # Test 2: Dispatcher Cache Service
        print("\n2. Testing Dispatcher Cache Service...")
        from app.services.dispatcher_cache_service import dispatcher_cache_service
        
        origin = "Toronto, ON"
        best_gid = dispatcher_cache_service.find_closest_location(origin, all_dispatchers)
        print(f"   Best GID for {origin}: {best_gid}")
        
        if best_gid:
            best_data = all_dispatchers[best_gid]
            print(f"   Best dispatcher data: {best_data.get('location_details', {}).get('name')}")
        else:
            print("   ❌ No best dispatcher found!")
            return
        
        # Test 3: Geographic Vendor Dispatcher
        print("\n3. Testing Geographic Vendor Dispatcher...")
        from app.services.vendor_engine import GeographicVendorDispatcher
        
        dispatcher = GeographicVendorDispatcher._get_best_dispatcher_for_vendor(
            "lets-get-moving", origin, origin
        )
        print(f"   LGM Dispatcher: {dispatcher}")
        
        if dispatcher:
            print(f"   Dispatcher name: {dispatcher.get('name')}")
            print(f"   Dispatcher address: {dispatcher.get('address')}")
        else:
            print("   ❌ No LGM dispatcher returned!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_lgm_dispatcher_selection()
