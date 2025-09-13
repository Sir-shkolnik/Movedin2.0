from typing import Dict, Any, List, Optional
from app.schemas.quote import QuoteRequest
from app.services.vendor_engine import GeographicVendorDispatcher, get_vendor_calculator
from app.services.monitoring_service import monitor_quote_calculation, monitoring_service

class VendorDispatcher:
    """Main vendor dispatcher - calls all vendors with their specific logic"""
    
    def __init__(self):
        # Initialize vendor calculators - use integrated calculators from vendor_engine.py
        # Note: LetsGetMovingCalculator removed - using standalone system instead
        # Easy2Go, Velocity Movers, and Pierre & Sons use integrated calculators from vendor_engine.py
    
    def get_available_vendors_for_location(self, origin_address: str, destination_address: str) -> List[Dict[str, Any]]:
        """Get all available vendors for a location"""
        print(f"🔍 GET_AVAILABLE_VENDORS_DEBUG:")
        print(f"  Origin: {origin_address}")
        print(f"  Destination: {destination_address}")
        
        available_vendors = []
        
        # Check each vendor's service area
        vendors_to_check = [
            ("lets-get-moving", "Let's Get Moving"),
            ("easy2go", "Easy2Go"),
            ("velocity-movers", "Velocity Movers"),
            ("pierre-sons", "Pierre & Sons")
        ]
        
        for vendor_slug, vendor_name in vendors_to_check:
            print(f"  Checking vendor: {vendor_slug}")
            if self._vendor_serves_location(vendor_slug, origin_address, destination_address):
                print(f"    ✅ {vendor_slug} serves location")
                vendor_info = self._get_vendor_info(vendor_slug, vendor_name, origin_address)
                if vendor_info:
                    available_vendors.append(vendor_info)
                    print(f"    ✅ {vendor_slug} added to available vendors")
                else:
                    print(f"    ❌ {vendor_slug} vendor info not found")
            else:
                print(f"    ❌ {vendor_slug} does not serve location")
        
        print(f"  Total available vendors: {len(available_vendors)}")
        return available_vendors
    
    def _vendor_serves_location(self, vendor_slug: str, origin_address: str, destination_address: str) -> bool:
        """Check if vendor serves the location"""
        try:
            origin_city = self._extract_city_from_address(origin_address)
            dest_city = self._extract_city_from_address(destination_address)
            
            print(f"🔍 VENDOR_SERVES_LOCATION DEBUG:")
            print(f"  Vendor: {vendor_slug}")
            print(f"  Origin: {origin_address}")
            print(f"  Destination: {destination_address}")
            print(f"  Extracted origin city: {origin_city}")
            print(f"  Extracted dest city: {dest_city}")
            
            # Special handling for Let's Get Moving using standalone system
            if vendor_slug == "lets-get-moving":
                print(f"  🔍 LGM VENDOR_SERVES_LOCATION DEBUG:")
                print(f"    Origin: {origin_address}")
                print(f"    Destination: {destination_address}")
                print(f"    Origin city: {origin_city}")
                print(f"    Dest city: {dest_city}")
                try:
                    print(f"    Attempting to import LGM calculator...")
                    from .letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
                    print(f"    ✅ LGM calculator imported successfully")
                    print(f"    Calling serves_location...")
                    serves = standalone_lgm_calculator.serves_location(origin_address, destination_address)
                    print(f"    LGM serves location result: {serves}")
                except Exception as e:
                    print(f"    ❌ Error with LGM calculator: {e}")
                    import traceback
                    print(f"    Traceback: {traceback.format_exc()}")
                    serves = False
            else:
                # All other vendors use GeographicVendorDispatcher for service area validation
                serves = GeographicVendorDispatcher._vendor_serves_location(vendor_slug, origin_city)
                print(f"  Serves location: {serves}")
            
            return serves
        except Exception as e:
            print(f"❌ CRITICAL ERROR in _vendor_serves_location: {e}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            return False
    
    def _get_vendor_info(self, vendor_slug: str, vendor_name: str, origin_address: str) -> Optional[Dict[str, Any]]:
        """Get vendor information for availability check"""
        origin_city = self._extract_city_from_address(origin_address)
        
        print(f"🔍 GET_VENDOR_INFO DEBUG:")
        print(f"  Vendor: {vendor_slug}")
        print(f"  Vendor name: {vendor_name}")
        print(f"  Origin address: {origin_address}")
        print(f"  Extracted city: {origin_city}")
        
        if vendor_slug == "lets-get-moving":
            # Let's Get Moving uses GeographicVendorDispatcher
            print(f"  Calling _get_best_dispatcher_for_vendor for LGM...")
            dispatcher_info = GeographicVendorDispatcher._get_best_dispatcher_for_vendor(
                vendor_slug, origin_address, origin_address
            )
            print(f"  Dispatcher info result: {dispatcher_info is not None}")
            if dispatcher_info:
                print(f"  Dispatcher name: {dispatcher_info.get('name', 'Unknown')}")
                # Add vendor_slug to the dispatcher info
                dispatcher_info["vendor_slug"] = vendor_slug
                dispatcher_info["vendor_name"] = vendor_name
                # Add service area data for Let's Get Moving
                dispatcher_info["service_area"] = {
                    "cities": ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering"],
                    "regions": ["GTA", "Greater Toronto Area", "Golden Horseshoe"],
                    "max_distance_km": 150
                }
                print(f"  Returning dispatcher info for LGM")
                return dispatcher_info
            print(f"  No dispatcher info found for LGM")
            return None
        
        else:
            # For Easy2Go, Velocity Movers, and Pierre & Sons, use GeographicVendorDispatcher
            dispatcher_info = GeographicVendorDispatcher._get_best_dispatcher_for_vendor(
                vendor_slug, origin_address, origin_address
            )
            if dispatcher_info:
                dispatcher_info["vendor_slug"] = vendor_slug
                dispatcher_info["vendor_name"] = vendor_name
                return dispatcher_info
            return None
    
    @monitor_quote_calculation("vendor")
    def calculate_vendor_quote(self, vendor_slug: str, quote_request: QuoteRequest, db=None) -> Optional[Dict[str, Any]]:
        """Calculate quote for a specific vendor"""
        
        print(f"🔍 CALCULATE_VENDOR_QUOTE DEBUG:")
        print(f"  Vendor: {vendor_slug}")
        print(f"  Origin: {quote_request.origin_address}")
        print(f"  Destination: {quote_request.destination_address}")
        
        if vendor_slug == "lets-get-moving":
            try:
                # Use standalone Let's Get Moving system
                from .letsgetmoving.standalone_lgm_calculator import standalone_lgm_calculator
                
                print(f"  Using standalone LGM calculator...")
                
                # Convert QuoteRequest to dict for standalone calculator
                quote_request_dict = {
                    "origin_address": quote_request.origin_address,
                    "destination_address": quote_request.destination_address,
                    "move_date": quote_request.move_date.isoformat() if hasattr(quote_request.move_date, 'isoformat') else str(quote_request.move_date),
                    "move_time": quote_request.move_time,
                    "total_rooms": quote_request.total_rooms,
                    "square_footage": quote_request.square_footage,
                    "estimated_weight": quote_request.estimated_weight,
                    "heavy_items": quote_request.heavy_items,
                    "stairs_at_pickup": quote_request.stairs_at_pickup,
                    "stairs_at_dropoff": quote_request.stairs_at_dropoff,
                    "elevator_at_pickup": quote_request.elevator_at_pickup,
                    "elevator_at_dropoff": quote_request.elevator_at_dropoff,
                    "additional_services": quote_request.additional_services
                }
                
                # Calculate quote using standalone system
                quote_result = standalone_lgm_calculator.calculate_quote(quote_request_dict)
                
                if quote_result:
                    print(f"  ✅ Standalone LGM quote calculated: ${quote_result.get('total_cost', 0)}")
                    return quote_result
                else:
                    print(f"  ❌ Standalone LGM calculator returned None")
                    return None
                
            except Exception as e:
                print(f"Error calculating quote for {vendor_slug}: {e}")
                import traceback
                print(f"Traceback: {traceback.format_exc()}")
                return None
        
        else:
            # For Easy2Go, Velocity Movers, and Pierre & Sons, use integrated calculators from vendor_engine.py
            try:
                # Get the integrated calculator
                calculator = get_vendor_calculator(vendor_slug)
                if not calculator:
                    print(f"No calculator found for vendor: {vendor_slug}")
                    return None
                
                # Get dispatcher info using GeographicVendorDispatcher
                dispatcher_info = GeographicVendorDispatcher._get_best_dispatcher_for_vendor(
                    vendor_slug, quote_request.origin_address, quote_request.destination_address
                )
                
                if not dispatcher_info:
                    # Fallback dispatcher info
                    fallback_dispatchers = {
                        "easy2go": {
                            "name": "Easy2Go Depot",
                            "address": "3397 American Drive, Mississauga, ON L4V 1T8",
                            "total_distance_km": 0
                        },
                        "velocity-movers": {
                            "name": "Velocity HQ",
                            "address": "100 Howden Road, Unit 2, Toronto, ON M1R 3E4",
                            "total_distance_km": 0
                        },
                        "pierre-sons": {
                            "name": "Pierre & Sons Etobicoke",
                            "address": "1155 Kipling Ave, Etobicoke, ON M9B 3M4",
                            "total_distance_km": 0
                        }
                    }
                    dispatcher_info = fallback_dispatchers.get(vendor_slug, {
                        "name": f"{vendor_slug.title()}",
                        "address": "Toronto, ON",
                        "total_distance_km": 0
                    })
                
                # Calculate quote using the integrated calculator
                result = calculator.calculate_quote(quote_request, dispatcher_info, db)
                
                # Check if the quote was rejected due to validation (long distance, etc.)
                if result and result.get('rejected'):
                    print(f"Quote rejected for {vendor_slug}: {result.get('rejection_reason', 'Unknown reason')}")
                    return None  # Don't include rejected quotes
                
                # Check if this is a long distance move (zero cost with special message)
                if result and result.get('total_cost') == 0.0 and result.get('special_notes'):
                    print(f"Long distance move for {vendor_slug}: {result.get('special_notes', '')}")
                    return None  # Don't include long distance moves
                
                return result
                
            except ValueError as e:
                # This is a validation error (long distance, outside service area, etc.)
                print(f"Quote validation failed for {vendor_slug}: {e}")
                return None
            except Exception as e:
                print(f"Error calculating quote for {vendor_slug}: {e}")
                return None
    
    def _extract_city_from_address(self, address: str) -> str:
        """Extract city from address"""
        address_lower = address.lower()
        
        print(f"🔍 EXTRACT_CITY_DEBUG:")
        print(f"  Address: {address}")
        print(f"  Address lower: {address_lower}")
        
        # Check for all possible cities from all vendors
        all_cities = [
            "Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill",
            "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering",
            "Scarborough", "North York", "Etobicoke", "York", "East York"
        ]
        
        for city in all_cities:
            if city.lower() in address_lower:
                print(f"  Found city: {city}")
                return city
        
        # Default to Toronto if no match
        print(f"  No city found, defaulting to Toronto")
        return "Toronto"

# Global instance
vendor_dispatcher = VendorDispatcher() 