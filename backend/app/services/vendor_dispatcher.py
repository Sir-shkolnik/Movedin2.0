from typing import Dict, Any, List, Optional
from app.schemas.quote import QuoteRequest
from app.services.vendor_engine import GeographicVendorDispatcher, get_vendor_calculator
from app.services.vendors.lets_get_moving_calculator import LetsGetMovingCalculator

class VendorDispatcher:
    """Main vendor dispatcher - calls all vendors with their specific logic"""
    
    def __init__(self):
        # Initialize vendor calculators - use integrated calculators from vendor_engine.py
        self.lets_get_moving_calculator = LetsGetMovingCalculator()  # Keep this for Google Sheets integration
        # Easy2Go, Velocity Movers, and Pierre & Sons use integrated calculators from vendor_engine.py
    
    def get_available_vendors_for_location(self, origin_address: str, destination_address: str) -> List[Dict[str, Any]]:
        """Get all available vendors for a location"""
        available_vendors = []
        
        # Check each vendor's service area
        vendors_to_check = [
            ("lets-get-moving", "Let's Get Moving"),
            ("easy2go", "Easy2Go"),
            ("velocity-movers", "Velocity Movers"),
            ("pierre-sons", "Pierre & Sons")
        ]
        
        for vendor_slug, vendor_name in vendors_to_check:
            if self._vendor_serves_location(vendor_slug, origin_address, destination_address):
                vendor_info = self._get_vendor_info(vendor_slug, vendor_name, origin_address)
                if vendor_info:
                    available_vendors.append(vendor_info)
        
        return available_vendors
    
    def _vendor_serves_location(self, vendor_slug: str, origin_address: str, destination_address: str) -> bool:
        """Check if vendor serves the location"""
        origin_city = self._extract_city_from_address(origin_address)
        dest_city = self._extract_city_from_address(destination_address)
        
        # All vendors now use GeographicVendorDispatcher for service area validation
        return GeographicVendorDispatcher._vendor_serves_location(vendor_slug, origin_city)
    
    def _get_vendor_info(self, vendor_slug: str, vendor_name: str, origin_address: str) -> Optional[Dict[str, Any]]:
        """Get vendor information for availability check"""
        origin_city = self._extract_city_from_address(origin_address)
        
        if vendor_slug == "lets-get-moving":
            # Let's Get Moving uses GeographicVendorDispatcher
            dispatcher_info = GeographicVendorDispatcher._get_best_dispatcher_for_vendor(
                vendor_slug, origin_address, origin_address
            )
            if dispatcher_info:
                # Add vendor_slug to the dispatcher info
                dispatcher_info["vendor_slug"] = vendor_slug
                dispatcher_info["vendor_name"] = vendor_name
                # Add service area data for Let's Get Moving
                dispatcher_info["service_area"] = {
                    "cities": ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering"],
                    "regions": ["GTA", "Greater Toronto Area", "Golden Horseshoe"],
                    "max_distance_km": 150
                }
                return dispatcher_info
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
    
    def calculate_vendor_quote(self, vendor_slug: str, quote_request: QuoteRequest, db=None) -> Optional[Dict[str, Any]]:
        """Calculate quote for a specific vendor"""
        
        if vendor_slug == "lets-get-moving":
            try:
                # Let's Get Moving uses Google Sheets - get dispatcher info
                move_date = quote_request.move_date.isoformat() if hasattr(quote_request.move_date, 'isoformat') else str(quote_request.move_date)
                
                # Try to get dispatcher info from Google Sheets using GeographicVendorDispatcher
                dispatcher_info = None
                try:
                    dispatcher_info = GeographicVendorDispatcher.get_best_dispatcher_from_sheets(
                        vendor_slug,
                        quote_request.origin_address, 
                        quote_request.destination_address,
                        move_date
                    )
                except Exception as e:
                    print(f"Error getting dispatcher info: {e}")
                
                if not dispatcher_info:
                    print(f"No dispatcher info found for {vendor_slug} - no Google Sheets data available")
                    return {
                        "vendor_name": "Let's Get Moving",
                        "error": "No dispatcher data available from Google Sheets. Please try again later or contact support.",
                        "vendor_slug": vendor_slug
                    }
                
                # Calculate quote with Google Sheets data
                return self.lets_get_moving_calculator.calculate_quote(quote_request, dispatcher_info, db)
            except Exception as e:
                print(f"Error calculating quote for {vendor_slug}: {e}")
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
                return calculator.calculate_quote(quote_request, dispatcher_info, db)
                
            except Exception as e:
                print(f"Error calculating quote for {vendor_slug}: {e}")
                return None
    
    def _extract_city_from_address(self, address: str) -> str:
        """Extract city from address"""
        address_lower = address.lower()
        
        # Check for all possible cities from all vendors
        all_cities = [
            "Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill",
            "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering",
            "Scarborough", "North York", "Etobicoke", "York", "East York"
        ]
        
        for city in all_cities:
            if city.lower() in address_lower:
                return city
        
        # Default to Toronto if no match
        return "Toronto"

# Global instance
vendor_dispatcher = VendorDispatcher() 