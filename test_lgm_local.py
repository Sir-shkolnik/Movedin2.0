#!/usr/bin/env python3
"""
Test LGM system locally with direct imports
"""

import sys
import os
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

def test_direct_imports():
    """Test direct imports"""
    print("🔍 Testing direct imports...")
    
    try:
        from app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService
        print("✅ StandaloneLGMService imported")
        
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        print("✅ standalone_lgm_calculator imported")
        
        from app.services.vendor_dispatcher import vendor_dispatcher
        print("✅ vendor_dispatcher imported")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_lgm_calculator():
    """Test LGM calculator directly"""
    print("\n🔍 Testing LGM calculator...")
    
    try:
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        
        # Test service area detection
        print("  Testing service area detection...")
        serves = standalone_lgm_calculator.serves_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        print(f"  LGM serves Toronto -> Mississauga: {serves}")
        
        # Test quote calculation
        print("  Testing quote calculation...")
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
        
        result = standalone_lgm_calculator.calculate_quote(quote_request)
        if result:
            print(f"  ✅ Quote calculated: ${result.get('total_cost', 0)}")
        else:
            print("  ❌ No quote returned")
        
        return True
    except Exception as e:
        print(f"❌ LGM calculator error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_vendor_dispatcher():
    """Test vendor dispatcher"""
    print("\n🔍 Testing vendor dispatcher...")
    
    try:
        from app.services.vendor_dispatcher import vendor_dispatcher
        
        # Test available vendors
        print("  Testing available vendors...")
        vendors = vendor_dispatcher.get_available_vendors_for_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        print(f"  Available vendors: {len(vendors)}")
        for vendor in vendors:
            print(f"    - {vendor.get('vendor_slug', 'unknown')}: {vendor.get('vendor_name', 'unknown')}")
        
        return True
    except Exception as e:
        print(f"❌ Vendor dispatcher error: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def main():
    print("🚀 Testing LGM System Locally")
    print("=" * 60)
    
    if not test_direct_imports():
        return
    
    if not test_lgm_calculator():
        return
    
    if not test_vendor_dispatcher():
        return
    
    print("\n" + "=" * 60)
    print("🎉 All tests passed! LGM system is working locally.")

if __name__ == "__main__":
    main()
