#!/usr/bin/env python3
"""
Test Let's Get Moving service area logic
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.services.letsgetmoving.standalone_lgm_service import StandaloneLGMService

def test_service_area():
    service = StandaloneLGMService()
    
    print("=== Testing Let's Get Moving Service Area Logic ===")
    
    # Test cases
    test_cases = [
        ("Toronto, ON, Canada", "Mississauga, ON, Canada", "Should be within 50km"),
        ("Toronto, ON, Canada", "Montreal, QC, Canada", "Should be outside 50km"),
        ("Toronto, ON, Canada", "Vancouver, BC, Canada", "Should be outside 50km"),
    ]
    
    for origin, destination, expected in test_cases:
        print(f"\n--- Testing: {origin} → {destination} ---")
        print(f"Expected: {expected}")
        
        # Extract cities
        origin_city = service._extract_city(origin)
        dest_city = service._extract_city(destination)
        print(f"Extracted cities: {origin_city} → {dest_city}")
        
        # Get coordinates
        origin_coords = service._get_coordinates_for_city(origin_city)
        dest_coords = service._get_coordinates_for_city(dest_city)
        print(f"Origin coordinates: {origin_coords}")
        print(f"Destination coordinates: {dest_coords}")
        
        # Calculate distance
        distance = service._calculate_distance_km(origin_coords, dest_coords)
        print(f"Distance: {distance:.2f} km")
        
        # Check service area
        serves = service._serves_location(origin_city, dest_city)
        print(f"Serves location: {serves}")
        print(f"Within 50km: {distance <= 50}")
        
        # Test with dispatcher names
        print(f"\nTesting with dispatcher names:")
        for gid, location_name in list(service.gid_location_map.items())[:3]:  # Test first 3
            dispatcher_serves = service._serves_location(location_name, origin_city)
            print(f"  {location_name} serves {origin_city}: {dispatcher_serves}")

if __name__ == "__main__":
    test_service_area()
