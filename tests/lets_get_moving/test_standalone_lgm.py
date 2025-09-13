#!/usr/bin/env python3
"""
Test the standalone LGM system locally
"""

import sys
import os
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

from app.services.letsgetmoving.standalone_lgm_service import standalone_lgm_service
from app.services.letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator

print('🔍 Testing Standalone LGM System Locally')
print('=' * 50)

# Test 1: Check if we can get dispatcher data for different GIDs
print('\n1. Testing dispatcher data retrieval:')
test_gids = ['348861685', '445545962', '1384980803', '322544773', '586231927']
for gid in test_gids:
    print(f'\nTesting GID {gid}:')
    data = standalone_lgm_service.get_dispatcher_data(gid)
    if data:
        print(f'  ✅ Location: {data.get("location_name", "Unknown")}')
        print(f'  ✅ Address: {data.get("location_details", {}).get("address", "No address")}')
        print(f'  ✅ Calendar dates: {len(data.get("calendar_data", {}))} dates')
        # Show first 5 dates
        calendar_data = data.get('calendar_data', {})
        if calendar_data:
            dates = list(calendar_data.keys())[:5]
            print(f'  ✅ First 5 dates: {dates}')
    else:
        print(f'  ❌ Failed to get data for GID {gid}')

print('\n' + '=' * 50)
print('\n2. Testing service area detection:')
test_locations = [
    ('Toronto, ON, Canada', 'Mississauga, ON, Canada'),
    ('Vancouver, BC, Canada', 'Burnaby, BC, Canada'),
    ('Calgary, AB, Canada', 'Edmonton, AB, Canada'),
    ('Montreal, QC, Canada', 'Laval, QC, Canada'),
    ('Winnipeg, MB, Canada', 'Brandon, MB, Canada')
]

for origin, dest in test_locations:
    serves = standalone_lgm_calculator.serves_location(origin, dest)
    print(f'  {origin} → {dest}: {"✅ Serves" if serves else "❌ Does not serve"}')

print('\n' + '=' * 50)
print('\n3. Testing quote calculation:')
quote_request = {
    'origin_address': 'Toronto, ON, Canada',
    'destination_address': 'Mississauga, ON, Canada',
    'move_date': '2025-10-15',
    'move_time': '10:00 AM',
    'total_rooms': 3,
    'heavy_items': {},
    'additional_services': {},
    'stairs_at_pickup': False,
    'stairs_at_dropoff': False
}

quote = standalone_lgm_calculator.calculate_quote(quote_request)
if quote:
    print(f'  ✅ Quote calculated: ${quote.get("total_cost", 0)}')
    print(f'  ✅ Vendor: {quote.get("vendor_name", "Unknown")}')
    print(f'  ✅ Dispatcher: {quote.get("dispatcher_info", {}).get("name", "Unknown")}')
else:
    print('  ❌ Failed to calculate quote')

print('\n' + '=' * 50)
print('Test completed!')
