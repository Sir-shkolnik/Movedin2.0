#!/usr/bin/env python3
"""
Simple test for VendorDispatcher - writes to file
"""

import sys
import os
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

def main():
    try:
        # Write test start to file
        with open('test_output.txt', 'w') as f:
            f.write("Starting VendorDispatcher test...\n")
        
        # Test imports
        from app.services.vendor_dispatcher import VendorDispatcher, vendor_dispatcher
        
        with open('test_output.txt', 'a') as f:
            f.write("✅ VendorDispatcher imported successfully\n")
        
        # Test method call
        result = vendor_dispatcher.get_available_vendors_for_location(
            "Toronto, ON, Canada", 
            "Mississauga, ON, Canada"
        )
        
        with open('test_output.txt', 'a') as f:
            f.write(f"✅ get_available_vendors_for_location returned: {len(result)} vendors\n")
            for vendor in result:
                f.write(f"  - {vendor.get('vendor_slug', 'unknown')}\n")
        
        # Test standalone LGM
        from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
        
        with open('test_output.txt', 'a') as f:
            f.write("✅ standalone_lgm_calculator imported successfully\n")
        
        serves = standalone_lgm_calculator.serves_location("Toronto, ON, Canada", "Mississauga, ON, Canada")
        
        with open('test_output.txt', 'a') as f:
            f.write(f"✅ standalone_lgm_calculator.serves_location returned: {serves}\n")
        
        with open('test_output.txt', 'a') as f:
            f.write("🎉 All tests completed successfully!\n")
            
    except Exception as e:
        with open('test_output.txt', 'a') as f:
            f.write(f"❌ Error: {e}\n")
            import traceback
            f.write(f"Traceback: {traceback.format_exc()}\n")

if __name__ == "__main__":
    main()
