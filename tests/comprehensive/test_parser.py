#!/usr/bin/env python3
"""Test the fixed parser directly"""

import sys
sys.path.append('backend')

try:
    from app.services.letsgetmoving.smart_calendar_parser_fixed import create_fixed_smart_parser
    print("✅ Import successful")
    
    # Test with simple CSV data
    csv_data = '''OPS MANAGER: NICK (437-983-2384)
SALES #: (416) 955-0079 - Dial 2 for Operations
INTERSECTION: Hwy 400 and 401
ADDRESS: 945 Wilson Ave, North York
E-TRANSFER: sales@letsgetmovinggroup.com
# OF TRUCKS: 7+  (2 trucks fit more than 3 men (but no lift gate))
Terminal ID: 29y5QUbS

SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY
5,6,7,8,9,10,11
139,139,139,139,139,139,199'''

    parser = create_fixed_smart_parser()
    result = parser.parse_gid_complete('348861685', csv_data)
    
    print("Result keys:", list(result.keys()))
    print("Location:", result.get('location'))
    print("Metadata:", result.get('metadata', {}))
    print("Calendar data count:", len(result.get('calendar_hourly_price', {})))
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
