#!/usr/bin/env python3
"""
Debug LGM system locally
"""

import sys
import os
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

def test_imports():
    print("🔍 Testing imports...")
    try:
        from app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService
        print("✅ StandaloneLGMService imported")
        
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        print("✅ standalone_lgm_calculator imported")
        
        from app.services.vendor_dispatcher import VendorDispatcher
        print("✅ VendorDispatcher imported")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_service_creation():
    print("\n🔍 Testing service creation...")
    try:
        from app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService
        service = StandaloneLGMService()
        print("✅ StandaloneLGMService created")
        return service
    except Exception as e:
        print(f"❌ Service creation error: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_calculator():
    print("\n🔍 Testing calculator...")
    try:
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        print("✅ standalone_lgm_calculator accessed")
        
        # Test serves_location
        result = standalone_lgm_calculator.serves_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        print(f"✅ serves_location result: {result}")
        
        return True
    except Exception as e:
        print(f"❌ Calculator error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_vendor_dispatcher():
    print("\n🔍 Testing vendor dispatcher...")
    try:
        from app.services.vendor_dispatcher import VendorDispatcher
        vd = VendorDispatcher()
        print("✅ VendorDispatcher created")
        
        result = vd.get_available_vendors_for_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        print(f"✅ get_available_vendors_for_location result: {len(result)} vendors")
        
        for vendor in result:
            print(f"  - {vendor.get('vendor_slug', 'unknown')}")
        
        return True
    except Exception as e:
        print(f"❌ VendorDispatcher error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("🚀 Debugging LGM System Locally")
    print("=" * 50)
    
    if not test_imports():
        return
    
    if not test_service_creation():
        return
    
    if not test_calculator():
        return
    
    if not test_vendor_dispatcher():
        return
    
    print("\n🎉 All tests passed!")

if __name__ == "__main__":
    main()
