from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from datetime import datetime, date
import math
import logging
from sqlalchemy.orm import Session
from app.models.vendor import Vendor, Dispatcher
from app.schemas.quote import QuoteRequest
from app.services.mapbox_service import mapbox_service
from app.services.dispatcher_cache_service import dispatcher_cache_service
from app.services.google_sheets_service import google_sheets_service

logger = logging.getLogger(__name__)

class GeographicVendorDispatcher:
    """Handles geographic-based vendor dispatching and service area validation"""
    
    # Vendor service areas - TRUE NATIONAL COVERAGE (not limited to Ontario)
    VENDOR_SERVICE_AREAS = {
        "lets-get-moving": {
            "cities": [
                # ONTARIO
                "Toronto", "North York", "Scarborough", "Etobicoke", "York", "East York",
                "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", 
                "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering",
                "Barrie", "Aurora", "Brantford", "Kitchener", "Waterloo", "Windsor", "Peterborough",
                # BRITISH COLUMBIA
                "Vancouver", "Burnaby", "Richmond", "Victoria", "Abbotsford", "Port Moody",
                # ALBERTA
                "Calgary", "Edmonton",
                # MANITOBA
                "Winnipeg",
                # SASKATCHEWAN
                "Regina",
                # QUEBEC
                "Montreal",
                # NOVA SCOTIA
                "Halifax",
                # NEW BRUNSWICK
                "Fredericton"
            ],
            "regions": ["GTA", "Greater Toronto Area", "Golden Horseshoe", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Quebec", "Nova Scotia", "New Brunswick"],
            "max_distance_km": 500,  # TRUE NATIONAL COVERAGE
            "location_based_rates": {}  # Uses Google Sheets data with 23+ locations
        },
        "easy2go": {
            "cities": [
                # GTA CORE + ONTARIO EXPANSION
                "Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill",
                "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering",
                "Barrie", "Aurora", "Newmarket", "Milton", "Caledon", "King City", "Stouffville",
                "Uxbridge", "Port Perry", "Bowmanville", "Cobourg", "Belleville", "Kingston",
                "Ottawa", "Kitchener", "Waterloo", "Cambridge", "Guelph", "St. Catharines",
                "Niagara Falls", "Welland", "Brantford", "Woodstock", "London", "Windsor",
                "Sarnia", "Chatham", "Sault Ste. Marie", "Sudbury", "North Bay", "Timmins",
                "Thunder Bay", "Kenora"
            ],
            "regions": ["GTA", "Greater Toronto Area", "Golden Horseshoe", "Ontario"],
            "max_distance_km": 200,  # EXPANDED ONTARIO COVERAGE
            "location_based_rates": {
                "Toronto": {"base_multiplier": 1.0, "fuel_surcharge": 0},
                "Mississauga": {"base_multiplier": 0.98, "fuel_surcharge": 20},
                "Brampton": {"base_multiplier": 0.95, "fuel_surcharge": 35},
                "Vaughan": {"base_multiplier": 0.98, "fuel_surcharge": 25},
                "Markham": {"base_multiplier": 0.98, "fuel_surcharge": 30},
                "Richmond Hill": {"base_multiplier": 0.98, "fuel_surcharge": 35},
                "Oakville": {"base_multiplier": 0.95, "fuel_surcharge": 40},
                "Burlington": {"base_multiplier": 0.92, "fuel_surcharge": 50},
                "Hamilton": {"base_multiplier": 0.90, "fuel_surcharge": 60},
                "Oshawa": {"base_multiplier": 0.88, "fuel_surcharge": 70},
                "Barrie": {"base_multiplier": 0.85, "fuel_surcharge": 80},
                "Ottawa": {"base_multiplier": 0.80, "fuel_surcharge": 120},
                "London": {"base_multiplier": 0.75, "fuel_surcharge": 150},
                "Windsor": {"base_multiplier": 0.70, "fuel_surcharge": 180}
            }
        },
        "velocity-movers": {
            "cities": [
                # GTA WEST + ONTARIO EXPANSION
                "Toronto", "Mississauga", "Oakville", "Burlington", "Hamilton",
                "Brampton", "Vaughan", "Milton", "Georgetown", "Acton", "Guelph",
                "Kitchener", "Waterloo", "Cambridge", "Brantford", "St. Catharines",
                "Niagara Falls", "Welland", "Grimsby", "Stoney Creek", "Ancaster",
                "Dundas", "Flamborough", "Milton", "Georgetown", "Acton", "Guelph",
                "Kitchener", "Waterloo", "Cambridge", "Brantford", "Woodstock",
                "London", "St. Thomas", "Ingersoll", "Tillsonburg", "Simcoe",
                "Brantford", "Paris", "Caledonia", "Dunnville", "Port Colborne",
                "Fort Erie", "Niagara-on-the-Lake", "St. Catharines", "Thorold",
                "Pelham", "Lincoln", "West Lincoln", "Grimsby", "Lincoln"
            ],
            "regions": ["GTA West", "Golden Horseshoe West", "Southwestern Ontario"],
            "max_distance_km": 150,  # EXPANDED COVERAGE
            "location_based_rates": {
                "Toronto": {"base_multiplier": 1.0, "fuel_surcharge": 0},
                "Mississauga": {"base_multiplier": 0.97, "fuel_surcharge": 30},
                "Oakville": {"base_multiplier": 0.92, "fuel_surcharge": 50},
                "Burlington": {"base_multiplier": 0.88, "fuel_surcharge": 65},
                "Hamilton": {"base_multiplier": 0.85, "fuel_surcharge": 80},
                "Brampton": {"base_multiplier": 0.90, "fuel_surcharge": 45},
                "Vaughan": {"base_multiplier": 0.93, "fuel_surcharge": 35},
                "Milton": {"base_multiplier": 0.87, "fuel_surcharge": 70},
                "Guelph": {"base_multiplier": 0.80, "fuel_surcharge": 100},
                "Kitchener": {"base_multiplier": 0.78, "fuel_surcharge": 110},
                "Waterloo": {"base_multiplier": 0.78, "fuel_surcharge": 110},
                "Cambridge": {"base_multiplier": 0.75, "fuel_surcharge": 120},
                "Brantford": {"base_multiplier": 0.72, "fuel_surcharge": 130},
                "St. Catharines": {"base_multiplier": 0.70, "fuel_surcharge": 140},
                "Niagara Falls": {"base_multiplier": 0.68, "fuel_surcharge": 150},
                "London": {"base_multiplier": 0.65, "fuel_surcharge": 170}
            }
        },
        "pierre-sons": {
            "cities": [
                # TORONTO CORE + GTA EXPANSION
                "Toronto", "Scarborough", "North York", "Etobicoke", "York", "East York",
                "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill",
                "Oakville", "Burlington", "Ajax", "Pickering", "Whitby", "Oshawa",
                "Aurora", "Newmarket", "King City", "Stouffville", "Uxbridge",
                "Port Perry", "Bowmanville", "Cobourg", "Belleville", "Kingston",
                "Ottawa", "Barrie", "Orillia", "Midland", "Penetanguishene",
                "Collingwood", "Wasaga Beach", "Alliston", "Bradford", "Innisfil",
                "Keswick", "Sutton", "Georgina", "Uxbridge", "Port Perry",
                "Bowmanville", "Cobourg", "Belleville", "Kingston", "Ottawa"
            ],
            "regions": ["Toronto Core", "GTA", "Greater Toronto Area", "Eastern Ontario"],
            "max_distance_km": 100,  # EXPANDED COVERAGE
            "location_based_rates": {
                "Toronto": {"base_multiplier": 1.0, "fuel_surcharge": 0},
                "Scarborough": {"base_multiplier": 0.98, "fuel_surcharge": 15},
                "North York": {"base_multiplier": 0.98, "fuel_surcharge": 10},
                "Etobicoke": {"base_multiplier": 0.98, "fuel_surcharge": 20},
                "York": {"base_multiplier": 0.98, "fuel_surcharge": 5},
                "East York": {"base_multiplier": 0.98, "fuel_surcharge": 12},
                "Mississauga": {"base_multiplier": 0.95, "fuel_surcharge": 25},
                "Brampton": {"base_multiplier": 0.92, "fuel_surcharge": 40},
                "Vaughan": {"base_multiplier": 0.95, "fuel_surcharge": 30},
                "Markham": {"base_multiplier": 0.95, "fuel_surcharge": 35},
                "Richmond Hill": {"base_multiplier": 0.95, "fuel_surcharge": 40},
                "Oakville": {"base_multiplier": 0.90, "fuel_surcharge": 50},
                "Burlington": {"base_multiplier": 0.88, "fuel_surcharge": 60},
                "Ajax": {"base_multiplier": 0.93, "fuel_surcharge": 35},
                "Pickering": {"base_multiplier": 0.93, "fuel_surcharge": 40},
                "Whitby": {"base_multiplier": 0.90, "fuel_surcharge": 50},
                "Oshawa": {"base_multiplier": 0.88, "fuel_surcharge": 60},
                "Barrie": {"base_multiplier": 0.85, "fuel_surcharge": 70},
                "Ottawa": {"base_multiplier": 0.75, "fuel_surcharge": 120}
            }
        }
    }
    
    # Dispatcher locations - TRUE NATIONAL COVERAGE (from Google Sheets data)
    DISPATCHER_LOCATIONS = {
        # ONTARIO LOCATIONS
        "toronto-north-york": {
            "name": "Toronto (North York)",
            "address": "Toronto, ON",
            "coordinates": {"lat": 43.7615, "lng": -79.4111},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 119.0}
        },
        "downtown-toronto": {
            "name": "Downtown Toronto", 
            "address": "Toronto, ON",
            "coordinates": {"lat": 43.6532, "lng": -79.3832},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 119.0}
        },
        "mississauga": {
            "name": "Mississauga",
            "address": "3225 Lenworth Dr, Mississauga, ON",
            "coordinates": {"lat": 43.6247, "lng": -79.5783},
            "serves_vendors": ["lets-get-moving", "easy2go", "velocity-movers"],
            "base_rates": {"lets-get-moving": 139.0, "easy2go": 140.0, "velocity-movers": 155.0}
        },
        "ajax": {
            "name": "Ajax",
            "address": "18 Gadsden Ct, Ajax, ON",
            "coordinates": {"lat": 43.8850, "lng": -79.0192},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "aurora": {
            "name": "Aurora",
            "address": "Aurora, ON",
            "coordinates": {"lat": 44.0001, "lng": -79.4663},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "barrie": {
            "name": "Barrie",
            "address": "92 Caplan Ave, Barrie, ON",
            "coordinates": {"lat": 44.3385, "lng": -79.6971},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "brampton": {
            "name": "Brampton",
            "address": "Brampton, ON",
            "coordinates": {"lat": 43.6831, "lng": -79.7663},
            "serves_vendors": ["lets-get-moving", "easy2go"],
            "base_rates": {"lets-get-moving": 139.0, "easy2go": 130.0}
        },
        "brantford": {
            "name": "Brantford",
            "address": "Brantford, ON",
            "coordinates": {"lat": 43.1394, "lng": -80.2644},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "burlington": {
            "name": "Burlington",
            "address": "750 Guelph Line, Burlington, ON",
            "coordinates": {"lat": 43.3456, "lng": -79.7957},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "hamilton": {
            "name": "Hamilton",
            "address": "65 Biggar Ave, Hamilton, ON",
            "coordinates": {"lat": 43.2600, "lng": -79.8308},
            "serves_vendors": ["lets-get-moving", "velocity-movers"],
            "base_rates": {"lets-get-moving": 139.0, "velocity-movers": 155.0}
        },
        "kitchener": {
            "name": "Kitchener",
            "address": "Kitchener, ON",
            "coordinates": {"lat": 43.4516, "lng": -80.4925},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "oakville": {
            "name": "Oakville",
            "address": "550 Speers Rd, Oakville, ON",
            "coordinates": {"lat": 43.4347, "lng": -79.7001},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "peterborough": {
            "name": "Peterborough",
            "address": "796 Technology Drive, Peterborough, ON",
            "coordinates": {"lat": 44.3091, "lng": -78.3197},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "vaughan": {
            "name": "Vaughan",
            "address": "Vaughan, ON",
            "coordinates": {"lat": 43.8361, "lng": -79.4987},
            "serves_vendors": ["lets-get-moving", "easy2go"],
            "base_rates": {"lets-get-moving": 139.0, "easy2go": 140.0}
        },
        "windsor": {
            "name": "Windsor",
            "address": "Windsor, ON",
            "coordinates": {"lat": 42.3149, "lng": -83.0364},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "pierre-sons-etobicoke": {
            "name": "Pierre & Sons Etobicoke",
            "address": "1155 Kipling Ave, Etobicoke, ON M9B 3M4",
            "coordinates": {"lat": 43.6247, "lng": -79.5783},
            "serves_vendors": ["pierre-sons"],
            "base_rates": {"pierre-sons": 135.0}
        },
        
        # BRITISH COLUMBIA LOCATIONS
        "vancouver": {
            "name": "Vancouver",
            "address": "400 Industrial Avenue, Vancouver, BC",
            "coordinates": {"lat": 49.2692, "lng": -123.0955},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "victoria": {
            "name": "Victoria Island",
            "address": "4402 West Shore pky, Victoria, BC",
            "coordinates": {"lat": 48.4262, "lng": -123.5484},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "richmond-bc": {
            "name": "Richmond, BC",
            "address": "13353 Commerce Pkwy, Richmond, BC",
            "coordinates": {"lat": 49.1721, "lng": -123.0728},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "abbotsford": {
            "name": "Abbotsford",
            "address": "Abbotsford, BC",
            "coordinates": {"lat": 49.0504, "lng": -122.3045},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "burnaby": {
            "name": "Burnaby",
            "address": "Burnaby, BC",
            "coordinates": {"lat": 49.2488, "lng": -122.9805},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "port-moody": {
            "name": "Port Moody",
            "address": "Port Moody, BC",
            "coordinates": {"lat": 49.2833, "lng": -122.8319},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "kelowna": {
            "name": "Kelowna",
            "address": "852 Crowley Ave, Kelowna, BC",
            "coordinates": {"lat": 49.8983, "lng": -119.4841},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # ALBERTA LOCATIONS
        "calgary": {
            "name": "Calgary",
            "address": "Calgary, AB",
            "coordinates": {"lat": 51.0447, "lng": -114.0719},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        "edmonton": {
            "name": "Edmonton",
            "address": "Edmonton, AB",
            "coordinates": {"lat": 53.5461, "lng": -113.4938},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # MANITOBA LOCATIONS
        "winnipeg": {
            "name": "Winnipeg",
            "address": "50 Scurfield Boulevard, Winnipeg, MB",
            "coordinates": {"lat": 49.8178, "lng": -97.1862},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # SASKATCHEWAN LOCATIONS
        "regina": {
            "name": "Regina",
            "address": "2125 11th Avenue, Regina, SK",
            "coordinates": {"lat": 50.4502, "lng": -104.6119},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # QUEBEC LOCATIONS
        "montreal": {
            "name": "Montreal",
            "address": "3700 Rue Griffith, Saint-Laurent, QC",
            "coordinates": {"lat": 45.4851, "lng": -73.6972},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # NOVA SCOTIA LOCATIONS
        "halifax": {
            "name": "Halifax",
            "address": "Halifax, NS",
            "coordinates": {"lat": 44.6488, "lng": -63.5752},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # NEW BRUNSWICK LOCATIONS
        "fredericton": {
            "name": "Fredericton",
            "address": "Fredericton, NB",
            "coordinates": {"lat": 45.9636, "lng": -66.6431},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # WATERLOO LOCATION
        "waterloo": {
            "name": "Waterloo",
            "address": "110 Manitou Dr, Kitchener, ON",
            "coordinates": {"lat": 43.4115, "lng": -80.4488},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        },
        
        # MILTON LOCATION
        "milton": {
            "name": "Milton",
            "address": "5393 steeles avenue west milton, ON",
            "coordinates": {"lat": 43.4978, "lng": -79.9213},
            "serves_vendors": ["lets-get-moving"],
            "base_rates": {"lets-get-moving": 139.0}
        }
    }
    
    @classmethod
    def get_available_vendors_for_location(cls, origin_address: str, destination_address: str) -> List[Dict[str, Any]]:
        """Get list of vendors that can serve the given origin and destination"""
        available_vendors = []
        
        # Extract city names from addresses
        origin_city = cls._extract_city_from_address(origin_address)
        dest_city = cls._extract_city_from_address(destination_address)
        
        # Calculate distance between origin and destination
        distance_km = cls._calculate_distance_km(origin_address, destination_address)
        
        for vendor_slug, service_area in cls.VENDOR_SERVICE_AREAS.items():
            # Check if vendor serves both origin and destination cities
            serves_origin = cls._vendor_serves_location(vendor_slug, origin_city)
            serves_destination = cls._vendor_serves_location(vendor_slug, dest_city)
            within_distance = distance_km <= service_area["max_distance_km"]
            
            if serves_origin and serves_destination and within_distance:
                # Get best dispatcher for this vendor and location
                best_dispatcher = cls._get_best_dispatcher_for_vendor(vendor_slug, origin_address, destination_address)
                
                if best_dispatcher:
                    available_vendors.append({
                        "vendor_slug": vendor_slug,
                        "vendor_name": cls._get_vendor_name(vendor_slug),
                        "dispatcher": best_dispatcher,
                        "service_area": service_area,
                        "location_rates": service_area["location_based_rates"].get(origin_city, {"base_multiplier": 1.0, "fuel_surcharge": 0}),
                        "distance_km": distance_km,
                        "serves_origin": serves_origin,
                        "serves_destination": serves_destination,
                        "within_distance": within_distance
                    })
        
        return available_vendors
    
    @classmethod
    def _extract_city_from_address(cls, address: str) -> str:
        """Extract city name from address string"""
        address_lower = address.lower()
        
        # Check for specific cities - order matters! Check longer/more specific names first
        cities = [
            "scarborough", "north york", "etobicoke", "east york", "richmond hill",  # More specific first
            "toronto", "mississauga", "brampton", "vaughan", "markham", 
            "oakville", "burlington", "hamilton", "oshawa", "whitby", "ajax", "pickering",
            "york"
        ]
        
        for city in cities:
            if city in address_lower:
                return city.title()
        
        # Return None if no specific city found (will be handled by vendor service area check)
        return None
    
    @classmethod
    def _vendor_serves_location(cls, vendor_slug: str, city: str) -> bool:
        """Check if vendor serves a specific city"""
        if vendor_slug not in cls.VENDOR_SERVICE_AREAS:
            return False
        
        # If city is None, vendor doesn't serve it
        if city is None:
            return False
        
        service_area = cls.VENDOR_SERVICE_AREAS[vendor_slug]
        return city in service_area["cities"]
    
    @classmethod
    def _calculate_distance_km(cls, origin: str, destination: str) -> float:
        """Calculate distance between two addresses in kilometers"""
        try:
            directions = mapbox_service.get_directions(origin, destination)
            if directions and 'distance' in directions:
                return directions['distance'] / 1000  # Convert meters to kilometers
            return cls._fallback_distance_calculation(origin, destination)
        except Exception as e:
            print(f"Mapbox directions error: {e}")
            return cls._fallback_distance_calculation(origin, destination)
    
    @classmethod
    def _fallback_distance_calculation(cls, origin: str, destination: str) -> float:
        """Fallback distance calculation using city-based estimates"""
        origin_city = cls._extract_city_from_address(origin)
        dest_city = cls._extract_city_from_address(destination)
        
        # City-to-city distance estimates (in km)
        city_distances = {
            "Toronto": {
                "Toronto": 0,
                "Mississauga": 25,
                "Brampton": 35,
                "Vaughan": 30,
                "Markham": 25,
                "Richmond Hill": 30,
                "Oakville": 40,
                "Burlington": 55,
                "Hamilton": 70,
                "Oshawa": 45,
                "Whitby": 50,
                "Ajax": 40,
                "Pickering": 35,
                "Scarborough": 15,
                "North York": 10,
                "Etobicoke": 20,
                "York": 5,
                "East York": 8
            },
            "Mississauga": {
                "Toronto": 25,
                "Mississauga": 0,
                "Brampton": 15,
                "Vaughan": 20,
                "Markham": 35,
                "Richmond Hill": 40,
                "Oakville": 15,
                "Burlington": 30,
                "Hamilton": 45,
                "Oshawa": 60,
                "Whitby": 65,
                "Ajax": 55,
                "Pickering": 50,
                "Scarborough": 40,
                "North York": 35,
                "Etobicoke": 25,
                "York": 30,
                "East York": 33
            },
            "Brampton": {
                "Toronto": 35,
                "Mississauga": 15,
                "Brampton": 0,
                "Vaughan": 10,
                "Markham": 25,
                "Richmond Hill": 30,
                "Oakville": 30,
                "Burlington": 45,
                "Hamilton": 60,
                "Oshawa": 75,
                "Whitby": 80,
                "Ajax": 70,
                "Pickering": 65,
                "Scarborough": 50,
                "North York": 45,
                "Etobicoke": 35,
                "York": 40,
                "East York": 43
            },
            "Markham": {
                "Toronto": 25,
                "Mississauga": 35,
                "Brampton": 25,
                "Vaughan": 5,
                "Markham": 0,
                "Richmond Hill": 5,
                "Oakville": 50,
                "Burlington": 65,
                "Hamilton": 80,
                "Oshawa": 20,
                "Whitby": 25,
                "Ajax": 15,
                "Pickering": 10,
                "Scarborough": 20,
                "North York": 15,
                "Etobicoke": 45,
                "York": 20,
                "East York": 17
            }
        }
        
        # Get distance from lookup table
        if origin_city in city_distances and dest_city in city_distances[origin_city]:
            return city_distances[origin_city][dest_city]
        
        # Default fallback for unknown cities
        return 25.0
    
    @classmethod
    def _get_best_dispatcher_for_vendor(cls, vendor_slug: str, origin: str, destination: str) -> Optional[Dict[str, Any]]:
        """Get the best dispatcher for a vendor based on location"""
        
        # For Let's Get Moving, use Google Sheets data
        if vendor_slug == "lets-get-moving":
            # Use a default date for availability check (will be overridden in actual quote calculation)
            from datetime import datetime
            default_date = datetime.now().strftime("%Y-%m-%d")
            return cls.get_best_dispatcher_from_sheets(vendor_slug, origin, destination, default_date)
        
        # For other vendors, use hardcoded dispatcher locations
        best_dispatcher = None
        min_total_distance = float('inf')
        
        for dispatcher_id, dispatcher_info in cls.DISPATCHER_LOCATIONS.items():
            if vendor_slug in dispatcher_info["serves_vendors"]:
                # Calculate total distance: dispatcher -> origin -> destination -> dispatcher
                try:
                    # Use fallback distance calculation
                    disp_to_origin = cls._fallback_distance_calculation(dispatcher_info["address"], origin)
                    origin_to_dest = cls._fallback_distance_calculation(origin, destination)
                    dest_to_disp = cls._fallback_distance_calculation(destination, dispatcher_info["address"])
                    
                    total_distance = disp_to_origin + origin_to_dest + dest_to_disp
                    
                    if total_distance < min_total_distance:
                        min_total_distance = total_distance
                        best_dispatcher = {
                            "id": dispatcher_id,
                            "name": dispatcher_info["name"],
                            "address": dispatcher_info["address"],
                            "coordinates": dispatcher_info["coordinates"],
                            "base_rate": dispatcher_info["base_rates"][vendor_slug],
                            "total_distance_km": total_distance
                        }
                except Exception as e:
                    print(f"Error calculating dispatcher distance: {e}")
                    continue
        
        return best_dispatcher

    @classmethod
    def get_best_dispatcher_from_sheets(cls, vendor_slug: str, origin: str, destination: str, move_date: str) -> Optional[Dict[str, Any]]:
        """Get the best dispatcher from cached Google Sheets data for Let's Get Moving, using 4-hour cache."""
        from datetime import datetime, timedelta
        from app.services.dispatcher_cache_service import dispatcher_cache_service
        from app.core.database import get_db
        
        try:
            # Use Google Sheets service directly (same as admin panel) for fresh data
            from app.services.google_sheets_service import google_sheets_service
            all_dispatchers = google_sheets_service.get_all_dispatchers_data()
            
            logger.info(f"Loaded {len(all_dispatchers)} dispatchers from Google Sheets")
            
            if not all_dispatchers:
                logger.warning("No dispatcher data available from Google Sheets")
                return None
            
            # Hardcoded GTA dispatcher coordinates as fallback
            gta_dispatcher_coordinates = {
                # Standard GTA location names
                "TORONTO (NORTH YORK)": (43.7615, -79.4111),
                "DOWNTOWN TORONTO": (43.6532, -79.3832),
                "MISSISSAUGA": (43.5890, -79.6441),
                "BRAMPTON": (43.6832, -79.7629),
                "VAUGHAN": (43.8361, -79.4987),
                "MARKHAM": (43.9068, -79.2629),
                "RICHMOND HILL": (43.8828, -79.4403),
                "OAKVILLE": (43.4675, -79.6877),
                "BURLINGTON": (43.3255, -79.7990),
                "HAMILTON": (43.2557, -79.8711),
                "AJAX": (43.8509, -79.0205),
                "PICKERING": (43.8384, -79.0868),
                "WHITBY": (43.8975, -78.9428),
                "OSHAWA": (43.8971, -78.8658),
                "AURORA": (44.0001, -79.4663),
                "BARRIE": (44.3894, -79.6903),
                "SCARBOROUGH": (43.7764, -79.2318),
                "ETOBICOKE": (43.6205, -79.5132),
                "NORTH YORK": (43.7615, -79.4111),
                "YORK": (43.6869, -79.4000),
                "EAST YORK": (43.6900, -79.3400),
                # Actual names from Google Sheets data (with GTA coordinates)
                "SAINT JOHN": (43.6532, -79.3832),  # Map to Downtown Toronto coordinates
                "HALIFAX": (43.5890, -79.6441),     # Map to Mississauga coordinates
                "Owner:  Aerish 416-570-0828": (43.6832, -79.7629),  # Map to Brampton coordinates
                "STARTING OCT 1ST": (43.9068, -79.2629),  # Map to Markham coordinates
                "HALIFAX  Owner: Mahmoud": (43.8361, -79.4987),  # Map to Vaughan coordinates
                # Add more mappings as needed
            }
            
            # Find the closest dispatcher using Google Sheets data format
            best_gid = None
            min_distance = float('inf')
            
            # Get user coordinates
            try:
                user_coords = mapbox_service.get_coordinates(origin)
                if not user_coords:
                    logger.warning("Could not get user coordinates")
                    return None
            except Exception as e:
                logger.warning(f"Error getting user coordinates: {e}")
                return None
            
            # Find closest dispatcher
            for gid, dispatcher_data in all_dispatchers.items():
                # Get coordinates from Google Sheets format - handle both formats
                lat = None
                lng = None
                
                # Try direct lat/lng fields first
                if 'lat' in dispatcher_data and 'lng' in dispatcher_data:
                    lat = dispatcher_data.get('lat')
                    lng = dispatcher_data.get('lng')
                # Try coordinates dictionary format (from smart parser)
                elif 'coordinates' in dispatcher_data:
                    coords = dispatcher_data.get('coordinates', {})
                    lat = coords.get('lat')
                    lng = coords.get('lng')
                
                # If no coordinates found, try to get from location name using hardcoded GTA coordinates
                if not lat or not lng:
                    location_name = dispatcher_data.get('location', '')
                    if location_name in gta_dispatcher_coordinates:
                        lat, lng = gta_dispatcher_coordinates[location_name]
                        logger.info(f"Using hardcoded coordinates for {location_name}: ({lat}, {lng})")
                
                if lat and lng:
                    # Calculate distance using Haversine formula
                    import math
                    R = 6371  # Earth radius in km
                    lat1, lon1 = math.radians(user_coords[0]), math.radians(user_coords[1])
                    lat2, lon2 = math.radians(lat), math.radians(lng)
                    dlat = lat2 - lat1
                    dlon = lon2 - lon1
                    a = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
                    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
                    distance = R * c
                    
                    # Apply GTA priority scoring
                    location_name = dispatcher_data.get('location', '')
                    gta_priority_score = 0
                    
                    # Check if origin is in GTA
                    origin_lower = origin.lower()
                    is_gta_origin = any(city in origin_lower for city in [
                        'toronto', 'mississauga', 'brampton', 'vaughan', 'markham', 
                        'richmond hill', 'oakville', 'burlington', 'hamilton', 'ajax', 
                        'pickering', 'whitby', 'oshawa', 'aurora', 'barrie', 'scarborough', 
                        'etobicoke', 'north york', 'york', 'east york'
                    ])
                    
                    # If origin is in GTA, prioritize GTA dispatchers
                    if is_gta_origin:
                        # Check if dispatcher location name contains GTA city names
                        location_lower = location_name.lower()
                        gta_cities_in_dispatcher = [
                            'toronto', 'mississauga', 'brampton', 'vaughan', 'markham',
                            'richmond hill', 'oakville', 'burlington', 'hamilton', 'ajax',
                            'pickering', 'whitby', 'oshawa', 'aurora', 'barrie', 'scarborough',
                            'etobicoke', 'north york', 'york', 'east york'
                        ]
                        
                        for city in gta_cities_in_dispatcher:
                            if city in location_lower:
                                gta_priority_score = 1000  # High priority for GTA dispatchers
                                break
                        
                        # Penalize non-GTA dispatchers
                        non_gta_indicators = ['saint john', 'halifax', 'moncton', 'fredericton', 'new brunswick', 'nova scotia']
                        for indicator in non_gta_indicators:
                            if indicator in location_lower:
                                gta_priority_score = -1000  # Low priority for non-GTA dispatchers
                                break
                    
                    # Apply priority score to distance
                    adjusted_distance = distance - gta_priority_score
                    
                    logger.info(f"Dispatcher {gid} ({location_name}) at ({lat}, {lng}) - distance: {distance:.2f}km, priority_score: {gta_priority_score}, adjusted_distance: {adjusted_distance:.2f}km")
                    
                    if adjusted_distance < min_distance:
                        min_distance = adjusted_distance
                        best_gid = gid
                else:
                    logger.warning(f"Dispatcher {gid} has no coordinates: lat={lat}, lng={lng}")
            
            if not best_gid:
                logger.warning("No suitable dispatcher found with coordinates")
                return None
            
            # Debug: Check if coordinates are available
            best_dispatcher_data = all_dispatchers[best_gid]
            
            # Get coordinates in the same way as above
            lat = None
            lng = None
            if 'lat' in best_dispatcher_data and 'lng' in best_dispatcher_data:
                lat = best_dispatcher_data.get('lat')
                lng = best_dispatcher_data.get('lng')
            elif 'coordinates' in best_dispatcher_data:
                coords = best_dispatcher_data.get('coordinates', {})
                lat = coords.get('lat')
                lng = coords.get('lng')
            
            # Fallback to hardcoded coordinates if still missing
            if not lat or not lng:
                location_name = best_dispatcher_data.get('location', '')
                if location_name in gta_dispatcher_coordinates:
                    lat, lng = gta_dispatcher_coordinates[location_name]
            
            logger.info(f"Selected dispatcher {best_gid} with coordinates: ({lat}, {lng}) at {min_distance:.2f}km")
            
            # Get data in Google Sheets format
            location_name = best_dispatcher_data.get('location', 'Unknown')
            metadata = best_dispatcher_data.get('metadata', {})
            calendar_data = best_dispatcher_data.get('calendar_hourly_price', {})
            address = best_dispatcher_data.get('address', metadata.get('address', ''))
            
            # Parse move_date as YYYY-MM-DD (smart parser format)
            try:
                move_dt = datetime.fromisoformat(move_date)
            except Exception:
                move_dt = datetime.strptime(move_date, "%Y-%m-%d")
            
            # Find the next available date
            base_rate = None
            for offset in range(0, 30):
                check_date = move_dt + timedelta(days=offset)
                date_key = check_date.strftime("%Y-%m-%d")  # Use YYYY-MM-DD format to match smart parser data
                
                if date_key in calendar_data:
                    base_rate = calendar_data[date_key]
                    break
            
            if not base_rate:
                logger.warning(f"No available rates found for {move_date}")
                return None
            
            # Calculate 3-leg distance for travel time
            try:
                disp_to_origin = cls._fallback_distance_calculation(address, origin)
                origin_to_dest = cls._fallback_distance_calculation(origin, destination)
                dest_to_disp = cls._fallback_distance_calculation(destination, address)
                total_distance = disp_to_origin + origin_to_dest + dest_to_disp
            except Exception as e:
                logger.warning(f"Error calculating dispatcher distance: {e}")
                total_distance = 0
            
            best_dispatcher = {
                "gid": best_gid,
                "name": location_name,
                "address": address,
                "sales_phone": metadata.get('sales_phone', ''),
                "email": metadata.get('email', ''),
                "truck_count": metadata.get('truck_count', ''),
                "base_rate": base_rate,
                "total_distance_km": total_distance,
                "calendar_data": {"daily_rates": calendar_data},  # Convert to expected format
                "operational_notes": best_dispatcher_data.get('operational_rules', {})
            }
            
            logger.info(f"Selected dispatcher: {best_dispatcher['name']} at {total_distance:.1f}km")
            return best_dispatcher
            
        except Exception as e:
            logger.error(f"Error getting dispatcher from cached sheets: {e}")
            return None
    
    @classmethod
    def _get_vendor_name(cls, vendor_slug: str) -> str:
        """Get vendor display name from slug"""
        names = {
            "lets-get-moving": "Let's Get Moving",
            "easy2go": "Easy2Go",
            "velocity-movers": "Velocity Movers",
            "pierre-sons": "Pierre & Sons"
        }
        return names.get(vendor_slug, vendor_slug.title())
    
    @classmethod
    def get_location_based_pricing(cls, vendor_slug: str, origin_city: str, base_rate: float) -> Dict[str, float]:
        """Get location-based pricing adjustments"""
        if vendor_slug not in cls.VENDOR_SERVICE_AREAS:
            return {"adjusted_rate": base_rate, "fuel_surcharge": 0}
        
        location_rates = cls.VENDOR_SERVICE_AREAS[vendor_slug]["location_based_rates"]
        city_rates = location_rates.get(origin_city, {"base_multiplier": 1.0, "fuel_surcharge": 0})
        
        adjusted_rate = base_rate * city_rates["base_multiplier"]
        fuel_surcharge = city_rates["fuel_surcharge"]
        
        return {
            "adjusted_rate": adjusted_rate,
            "fuel_surcharge": fuel_surcharge,
            "base_multiplier": city_rates["base_multiplier"]
        }

    @classmethod
    def _generate_gmb_url(cls, location_name: str, address: str) -> str:
        """Generate Google My Business URL for a location"""
        if not location_name or not address:
            return ""
        
        # Clean up the location name and address for URL encoding
        clean_name = location_name.replace(" ", "+").replace("&", "and")
        clean_address = address.replace(" ", "+").replace(",", "")
        
        # Create Google Maps search URL (this will show GMB if available)
        gmb_url = f"https://www.google.com/maps/search/{clean_name}+{clean_address}"
        
        return gmb_url

class VendorCalculator(ABC):
    """Base class for vendor-specific quote calculations"""
    
    @abstractmethod
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        """Calculate quote for a specific vendor"""
        pass
    
    @abstractmethod
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Determine crew size based on move details"""
        pass
    
    @abstractmethod
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Determine truck count based on crew size and move details"""
        pass

class LetsGetMovingCalculator(VendorCalculator):
    """Let's Get Moving - Dynamic Calendar-Based Pricing with Geographic Adjustments"""
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on room count and heavy items"""
        base_crew = self._get_base_crew_size(quote_request.total_rooms)
        
        # Heavy items auto-upgrade crew to at least 3
        heavy_items_count = sum(quote_request.heavy_items.values())
        if heavy_items_count > 0:
            return max(base_crew, 3)
        
        return base_crew
    
    def _get_base_crew_size(self, room_count: int) -> int:
        """Get base crew size based on room count - FIXED LOGIC"""
        if room_count <= 2:
            return 2
        elif room_count <= 3:
            return 3  # FIXED: 3 rooms = 3 crew
        elif room_count <= 4:
            return 4
        elif room_count <= 5:
            return 5  # FIXED: 5 rooms = 5 crew
        else:
            return 5  # FIXED: 6+ rooms = 5 crew
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on crew size - FIXED: 4+ movers need 2 trucks"""
        if crew_size <= 3:
            return 1
        else:
            return 2
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        """Calculate LGM quote with true dynamic calendar-based pricing, using YYYY-MM-DD keys."""
        from datetime import timedelta
        crew_size = self.get_crew_size(quote_request)
        truck_count = self.get_truck_count(quote_request, crew_size)
        move_date = quote_request.move_date
        calendar_data = dispatcher_info.get('calendar_data', {})
        daily_rates = calendar_data.get('daily_rates', {})
        # Find the next available rate from move_date forward
        base_rate = None
        for offset in range(0, 366):
            check_date = move_date + timedelta(days=offset)
            date_key = check_date.strftime("%Y-%m-%d")  # Use YYYY-MM-DD format to match smart parser data
            # Debug print
            print(f"[LGM] Looking for date_key: {date_key} in daily_rates keys: {list(daily_rates.keys())}")
            if date_key in daily_rates:
                base_rate = daily_rates[date_key]
                break
        if base_rate is None:
            raise ValueError(f"No base rate found for date {move_date} at location {dispatcher_info.get('name')}")
        # No geographic pricing adjustments - use original base rate
        origin_city = GeographicVendorDispatcher._extract_city_from_address(quote_request.origin_address)
        fuel_surcharge = 0  # No fuel surcharge adjustments
        # Calculate hourly rate with crew multiplier
        hourly_rate = self._calculate_hourly_rate(base_rate, crew_size, truck_count)
        # Estimate labor hours
        labor_hours = self._estimate_labor_hours(quote_request.total_rooms, crew_size, quote_request)
        # Calculate travel time (3-leg journey)
        travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
        
        # Check 10-hour travel time limit - Let's Get Moving doesn't do these moves
        if travel_hours > 10:
            return {
                "vendor_name": "Let's Get Moving",
                "error": "Travel time exceeds 10 hours. Let's Get Moving doesn't do moves with more than 10 hours of travel time.",
                "travel_time_hours": travel_hours,
                "max_allowed_hours": 10,
                "suggestion": "Please contact us directly for very long distance moves."
            }
        
        # Calculate total billable hours (labor + travel) - TRUE LGM LOGIC
        total_billable_hours = labor_hours + travel_hours
        
        # Calculate costs
        labor_cost = hourly_rate * total_billable_hours  # Include travel time in billable hours
        fuel_cost = self._calculate_fuel_charge(travel_hours) + fuel_surcharge
        heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
        additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
        total_cost = labor_cost + fuel_cost + heavy_items_cost + additional_services_cost
        return {
            "vendor_name": "Let's Get Moving",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "labor": round(labor_cost, 2),
                "fuel": round(fuel_cost, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "travel_time_hours": travel_hours,
            "hourly_rate": hourly_rate,
            "dispatcher_info": {
                "name": dispatcher_info["name"],
                "address": dispatcher_info["address"],
                "total_distance_km": dispatcher_info.get("total_distance_km"),
                "sales_phone": dispatcher_info.get("sales_phone", ""),
                "email": dispatcher_info.get("email", ""),
                "truck_count": dispatcher_info.get("truck_count", ""),
                "location_name": dispatcher_info.get("name", ""),
                "gmb_url": GeographicVendorDispatcher._generate_gmb_url(dispatcher_info.get("name", ""), dispatcher_info.get("address", ""))
            },
            "geographic_adjustments": {
                "origin_city": origin_city,
                "base_multiplier": 1.0,
                "fuel_surcharge": 0,
                "adjusted_base_rate": base_rate
            },
            "travel_details": {
                "origin": quote_request.origin_address,
                "destination": quote_request.destination_address,
                "journey_type": "3-leg (Dispatcher → Origin → Destination → Dispatcher)",
                "estimated_travel_time": f"{travel_hours:.1f} hours"
            },
            "stairs_info": {
                "pickup_stairs": quote_request.stairs_at_pickup,
                "dropoff_stairs": quote_request.stairs_at_dropoff,
                "note": "Stairs included in labor cost"
            },
            "additional_services": {
                "services": quote_request.additional_services,
                "total_cost": round(additional_services_cost, 2)
            },
            "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"],
            "rating": 4.8,
            "reviews": 1247,
            "special_notes": "Most popular choice",
            "base_rate": base_rate,
            "move_date": move_date,
            "location_name": dispatcher_info.get('name'),
        }
    
    def _calculate_hourly_rate(self, base_rate: float, crew_size: int, truck_count: int) -> float:
        """Calculate hourly rate with crew and truck multipliers - TRUE LGM LOGIC"""
        if truck_count == 1:
            if crew_size == 2:
                return base_rate  # e.g., $169
            elif crew_size == 3:
                return base_rate + 60  # e.g., $169 + $60 = $229
            elif crew_size == 4:
                return base_rate + 140  # e.g., $169 + $140 = $309
            else:
                # Fallback: treat as 4 movers
                return base_rate + 140
        elif truck_count == 2:
            if crew_size == 4:
                return 2 * base_rate + 20
            elif crew_size == 5:
                return 2 * base_rate + 80
            elif crew_size == 6:
                return 2 * base_rate + 140
            else:
                # Fallback: treat as 6 movers
                return 2 * base_rate + 140
        
        return base_rate
    
    def _estimate_labor_hours(self, room_count: int, crew_size: int, quote_request: QuoteRequest = None) -> float:
        """Estimate labor hours based on room count, crew efficiency, and stairs - TRUE LGM LOGIC"""
        # Base hours from old app data
        base_hours = {
            1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 8.5, 7: 9.5
        }.get(room_count, 9.5)
        
        # Crew efficiency adjustments from old app data
        if crew_size >= 4:
            base_hours = max(base_hours * 0.8, base_hours - 1)  # 20% faster or 1 hour less
        elif crew_size >= 3:
            base_hours = max(base_hours * 0.85, base_hours - 0.5)  # 15% faster or 0.5 hour less
        
        # Add stair time if quote_request is provided
        if quote_request:
            stair_time = self._calculate_stair_time(quote_request)
            base_hours += stair_time
        
        return base_hours
    
    def _calculate_stair_time(self, quote_request: QuoteRequest) -> float:
        """Calculate additional time for stairs - GENERAL RULE FOR ALL VENDORS"""
        # General rule: 15 minutes per flight of stairs (up or down)
        # This accounts for the extra time to carry items up/down stairs
        stair_time_per_flight = 0.25  # 15 minutes = 0.25 hours
        
        total_stair_time = 0
        
        # Add time for pickup stairs
        if quote_request.stairs_at_pickup > 0:
            total_stair_time += quote_request.stairs_at_pickup * stair_time_per_flight
        
        # Add time for dropoff stairs  
        if quote_request.stairs_at_dropoff > 0:
            total_stair_time += quote_request.stairs_at_dropoff * stair_time_per_flight
        
        return total_stair_time
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time using Mapbox API with 3-leg journey and truck factor"""
        try:
            # Let's Get Moving dispatcher address (from Google Sheets data)
            # We'll use a central GTA location as fallback
            dispatcher_address = "Toronto, ON"
            
            # Calculate 3-leg journey: Dispatcher -> Origin -> Destination -> Dispatcher
            # Leg 1: Dispatcher to Origin
            leg1 = mapbox_service.get_directions(dispatcher_address, origin)
            # Leg 2: Origin to Destination  
            leg2 = mapbox_service.get_directions(origin, destination)
            # Leg 3: Destination to Dispatcher
            leg3 = mapbox_service.get_directions(destination, dispatcher_address)
            
            total_duration = 0
            legs_with_data = 0
            
            # Sum up all legs that have data
            for leg in [leg1, leg2, leg3]:
                if leg and 'duration' in leg:
                    total_duration += leg['duration']
                    legs_with_data += 1
            
            if legs_with_data > 0:
                # Convert seconds to hours
                car_travel_hours = total_duration / 3600
                
                # Apply truck factor (1.3x for commercial trucks)
                TRUCK_FACTOR = 1.3
                truck_travel_hours = car_travel_hours * TRUCK_FACTOR
                
                print(f"Let's Get Moving Mapbox travel calculation: {legs_with_data}/3 legs, car: {car_travel_hours:.2f}h, truck: {truck_travel_hours:.2f}h")
                return truck_travel_hours
            
            # If Mapbox fails for all legs, try a simpler approach
            # Just calculate Origin to Destination and estimate 3-leg with truck factor
            origin_to_dest = mapbox_service.get_directions(origin, destination)
            if origin_to_dest and 'duration' in origin_to_dest:
                one_way_hours = origin_to_dest['duration'] / 3600
                # Estimate 3-leg as 2.5x one-way (Dispatcher->Origin->Destination->Dispatcher)
                car_three_leg_hours = one_way_hours * 2.5
                # Apply truck factor
                TRUCK_FACTOR = 1.3
                truck_three_leg_hours = car_three_leg_hours * TRUCK_FACTOR
                
                print(f"Let's Get Moving Mapbox fallback calculation: car: {car_three_leg_hours:.2f}h, truck: {truck_three_leg_hours:.2f}h")
                return truck_three_leg_hours
            
            # Final fallback - should rarely happen
            print("Let's Get Moving Mapbox calculation failed, using conservative estimate with truck factor")
            return 2.0 * 1.3  # Default 2 hours for 3-leg journey with truck factor
        except Exception as e:
            print(f"Let's Get Moving Mapbox directions error: {e}")
            return 2.0 * 1.3  # Default 2 hours for 3-leg journey with truck factor
    
    def _calculate_fuel_charge(self, travel_hours: float) -> float:
        """Calculate fuel charge based on travel time - TRUE LGM FUEL TABLE"""
        # Official Let's Get Moving fuel charge table based on round-trip travel time
        fuel_charge_table = [
            [1.75, 2.75, 260],   # 1:45–2:45 Hours, $260
            [2.75, 3.75, 450],   # 2:45–3:45 Hours, $450
            [3.75, 4.75, 580],   # 3:45–4:45 Hours, $580
            [4.75, 5.75, 710],   # 4:45–5:45 Hours, $710
            [5.75, 6.75, 840],   # 5:45–6:45 Hours, $840
            [6.75, 7.75, 970],   # 6:45–7:45 Hours, $970
            [7.75, 8.75, 1100],  # 7:45–8:45 Hours, $1,100
            [8.75, 9.75, 1230],  # 8:45–9:45 Hours, $1,230
            [9.75, 10.75, 1360]  # 9:45–10:45 Hours, $1,360
        ]
        
        # Check 10-hour travel time limit
        if travel_hours > 10:
            return 0  # Let's Get Moving doesn't do moves with more than 10 hours travel time
        
        # Find the appropriate fuel charge based on travel time
        for min_hours, max_hours, charge in fuel_charge_table:
            if travel_hours >= min_hours and travel_hours < max_hours:
                return charge
        
        # If travel time is less than 1.75 hours, no fuel charge
        return 0
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost"""
        rates = {"piano": 250, "safe": 300, "treadmill": 100}
        total = 0
        for item, count in heavy_items.items():
            if item in rates:
                total += rates[item] * count
        return total
    
    def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
        """Calculate additional services cost - REMOVED: Services require vendor assessment"""
        # Additional services (packing, storage, cleaning, junk) require vendor assessment
        # based on size, time, weight, and other factors - not included in base quote
        return 0.0

class Easy2GoCalculator(VendorCalculator):
    """Easy2Go - Crew Size Based Pricing (Official Rules)"""
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on room count AND heavy items - OFFICIAL EASY2GO RULES"""
        # Official Easy2Go crew sizing based on room count
        if quote_request.total_rooms <= 2:
            base_crew = 2
        elif quote_request.total_rooms <= 3:
            base_crew = 3
        elif quote_request.total_rooms <= 4:
            base_crew = 4
        else:
            base_crew = 5
        
        # Heavy items auto-upgrade crew to at least 3
        heavy_items_count = sum(quote_request.heavy_items.values())
        if heavy_items_count > 0:
            return max(base_crew, 3)
        
        return base_crew
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on crew size"""
        if crew_size <= 3:
            return 1
        else:
            return 2
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        """Calculate Easy2Go quote with official crew-based pricing"""
        crew_size = self.get_crew_size(quote_request)
        truck_count = self.get_truck_count(quote_request, crew_size)
        
        # Get official hourly rate based on crew size
        hourly_rate = self._get_hourly_rate(crew_size)
        
        # Apply geographic pricing adjustments
        origin_city = GeographicVendorDispatcher._extract_city_from_address(quote_request.origin_address)
        location_pricing = GeographicVendorDispatcher.get_location_based_pricing(
            "easy2go", origin_city, hourly_rate
        )
        
        adjusted_hourly_rate = location_pricing["adjusted_rate"]
        fuel_surcharge = location_pricing["fuel_surcharge"]
        
        # Calculate labor and travel hours
        labor_hours = self._estimate_labor_hours(quote_request.total_rooms, quote_request)
        travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
        
        # Calculate costs using official Easy2Go rules
        labor_cost = labor_hours * adjusted_hourly_rate
        travel_cost = travel_hours * adjusted_hourly_rate  # Travel charged at hourly rate
        truck_fee = self._get_truck_fee(crew_size)  # One-time truck fee
        fuel_cost = fuel_surcharge  # Only geographic fuel surcharge
        heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
        additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
        
        total_cost = labor_cost + travel_cost + truck_fee + fuel_cost + heavy_items_cost + additional_services_cost
        
        return {
            "vendor_name": "Easy2Go",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "labor": round(labor_cost, 2),
                "travel": round(travel_cost, 2),
                "fuel": round(fuel_cost, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "travel_time_hours": travel_hours,
            "dispatcher_info": {
                "name": dispatcher_info["name"],
                "address": dispatcher_info["address"],
                "total_distance_km": dispatcher_info["total_distance_km"],
                "location_name": dispatcher_info["name"],
                "gmb_url": GeographicVendorDispatcher._generate_gmb_url(dispatcher_info["name"], dispatcher_info["address"])
            },
            "geographic_adjustments": {
                "origin_city": origin_city,
                "base_multiplier": location_pricing["base_multiplier"],
                "fuel_surcharge": fuel_surcharge,
                "adjusted_hourly_rate": adjusted_hourly_rate
            },
            "available_slots": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM"],
            "rating": 4.6,
            "reviews": 892,
            "special_notes": "Best value",
            "hourly_rate": adjusted_hourly_rate
        }
    
    def _get_hourly_rate(self, crew_size: int) -> float:
        """Get hourly rate based on crew size - OFFICIAL EASY2GO RULES"""
        rates = {
            2: 150,  # 2 movers = $150/hr ✅
            3: 200,  # 3 movers = $200/hr ✅
            4: 250,  # 4 movers = $250/hr ✅
            5: 300   # 5 movers = $300/hr ✅
        }
        return rates.get(crew_size, 150)
    
    def _estimate_labor_hours(self, room_count: int, quote_request: QuoteRequest = None) -> float:
        """Estimate labor hours based on room count and stairs"""
        base_hours = {
            1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 8.5, 7: 9.5
        }.get(room_count, 7.5)
        
        # Add stair time if quote_request is provided
        if quote_request:
            stair_time = self._calculate_stair_time(quote_request)
            base_hours += stair_time
        
        return base_hours
    
    def _calculate_stair_time(self, quote_request: QuoteRequest) -> float:
        """Calculate additional time for stairs - GENERAL RULE FOR ALL VENDORS"""
        # General rule: 15 minutes per flight of stairs (up or down)
        stair_time_per_flight = 0.25  # 15 minutes = 0.25 hours
        
        total_stair_time = 0
        
        # Add time for pickup stairs
        if quote_request.stairs_at_pickup > 0:
            total_stair_time += quote_request.stairs_at_pickup * stair_time_per_flight
        
        # Add time for dropoff stairs  
        if quote_request.stairs_at_dropoff > 0:
            total_stair_time += quote_request.stairs_at_dropoff * stair_time_per_flight
        
        return total_stair_time
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time using 3-leg journey to depot"""
        try:
            dispatcher_address = "3397 American Drive, Mississauga, ON L4V 1T8"
            
            # Calculate 3-leg journey: Dispatcher -> Origin -> Destination -> Dispatcher
            leg1 = mapbox_service.get_directions(dispatcher_address, origin)
            leg2 = mapbox_service.get_directions(origin, destination)
            leg3 = mapbox_service.get_directions(destination, dispatcher_address)
            
            total_duration = 0
            legs_with_data = 0
            
            for leg in [leg1, leg2, leg3]:
                if leg and 'duration' in leg:
                    total_duration += leg['duration']
                    legs_with_data += 1
            
            if legs_with_data > 0:
                car_travel_hours = total_duration / 3600
                TRUCK_FACTOR = 1.3
                truck_travel_hours = car_travel_hours * TRUCK_FACTOR
                return truck_travel_hours
            
            # Fallback calculation
            origin_to_dest = mapbox_service.get_directions(origin, destination)
            if origin_to_dest and 'duration' in origin_to_dest:
                one_way_hours = origin_to_dest['duration'] / 3600
                car_three_leg_hours = one_way_hours * 2.5
                TRUCK_FACTOR = 1.3
                truck_three_leg_hours = car_three_leg_hours * TRUCK_FACTOR
                return truck_three_leg_hours
            
            return 2.0 * 1.3
        except Exception as e:
            return 2.0 * 1.3
    
    def _get_truck_fee(self, crew_size: int) -> float:
        """Get truck fee based on crew size - OFFICIAL EASY2GO RULES"""
        # Official Easy2Go truck fees
        if crew_size <= 3:
            return 150  # 16ft or 20ft truck - $150
        else:
            return 200  # 26ft or 30ft truck - $200
    
    def _calculate_fuel_charge(self, travel_hours: float) -> float:
        """Calculate fuel charge - only geographic surcharge for Easy2Go"""
        return 0  # Easy2Go doesn't charge fuel per hour, only geographic surcharge
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost"""
        rates = {"piano": 250, "safe": 300, "treadmill": 100}
        total = 0
        for item, count in heavy_items.items():
            if item in rates:
                total += rates[item] * count
        return total
    
    def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
        """Calculate additional services cost - REMOVED: Services require vendor assessment"""
        # Additional services (packing, storage, cleaning, junk) require vendor assessment
        # based on size, time, weight, and other factors - not included in base quote
        return 0.0

class VelocityMoversCalculator(VendorCalculator):
    """Velocity Movers - Official Crew-Based Pricing"""
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on room count AND heavy items - OFFICIAL VELOCITY MOVERS RULES"""
        # Official Velocity Movers crew sizing based on room count
        if quote_request.total_rooms <= 2:
            base_crew = 2
        elif quote_request.total_rooms <= 3:
            base_crew = 3
        elif quote_request.total_rooms <= 4:
            base_crew = 4
        else:
            base_crew = 5
        
        # Heavy items auto-upgrade crew to at least 3
        heavy_items_count = sum(quote_request.heavy_items.values())
        if heavy_items_count > 0:
            return max(base_crew, 3)
        
        return base_crew
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on crew size"""
        if crew_size <= 3:
            return 1
        else:
            return 2
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        """Calculate Velocity Movers quote with official pricing"""
        crew_size = self.get_crew_size(quote_request)
        truck_count = self.get_truck_count(quote_request, crew_size)
        
        # Get official hourly rate based on crew size
        hourly_rate = self._get_hourly_rate(crew_size)
        
        # Apply geographic pricing adjustments
        origin_city = GeographicVendorDispatcher._extract_city_from_address(quote_request.origin_address)
        location_pricing = GeographicVendorDispatcher.get_location_based_pricing(
            "velocity-movers", origin_city, hourly_rate
        )
        
        adjusted_hourly_rate = location_pricing["adjusted_rate"]
        fuel_surcharge = location_pricing["fuel_surcharge"]
        
        # Calculate labor and travel hours
        labor_hours = self._estimate_labor_hours(quote_request.total_rooms, quote_request)
        travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
        
        # Calculate costs using official Velocity Movers rules
        labor_cost = labor_hours * adjusted_hourly_rate
        travel_cost = travel_hours * adjusted_hourly_rate
        fuel_cost = fuel_surcharge  # Only geographic fuel surcharge
        heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
        additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
        
        total_cost = labor_cost + travel_cost + fuel_cost + heavy_items_cost + additional_services_cost
        
        return {
            "vendor_name": "Velocity Movers",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "labor": round(labor_cost, 2),
                "travel": round(travel_cost, 2),
                "fuel": round(fuel_cost, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "travel_time_hours": travel_hours,
            "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM"],
            "rating": 4.9,
            "reviews": 567,
            "special_notes": "Premium service",
            "premium_available": True,
            "premium_rate": adjusted_hourly_rate + 10,  # $10 premium per hour
            "hourly_rate": adjusted_hourly_rate,
            "dispatcher_info": {
                "name": dispatcher_info["name"],
                "address": dispatcher_info["address"],
                "total_distance_km": dispatcher_info["total_distance_km"],
                "location_name": dispatcher_info["name"],
                "gmb_url": GeographicVendorDispatcher._generate_gmb_url(dispatcher_info["name"], dispatcher_info["address"])
            }
        }
    
    def _get_hourly_rate(self, crew_size: int) -> float:
        """Get hourly rate based on crew size - OFFICIAL VELOCITY MOVERS RULES"""
        # Official Velocity Movers rule: "Two Movers $150.00 | Additional Movers $40.00"
        base_rate = 150  # Two Movers base rate
        additional_mover_rate = 40  # Additional movers rate
        
        if crew_size == 2:
            return base_rate
        else:
            additional_movers = crew_size - 2
            return base_rate + (additional_movers * additional_mover_rate)
    
    def _estimate_labor_hours(self, room_count: int, quote_request: QuoteRequest = None) -> float:
        """Estimate labor hours based on room count and stairs"""
        base_hours = {
            1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 8.5, 7: 9.5
        }.get(room_count, 7.5)
        
        # Add stair time if quote_request is provided
        if quote_request:
            stair_time = self._calculate_stair_time(quote_request)
            base_hours += stair_time
        
        return base_hours
    
    def _calculate_stair_time(self, quote_request: QuoteRequest) -> float:
        """Calculate additional time for stairs - GENERAL RULE FOR ALL VENDORS"""
        # General rule: 15 minutes per flight of stairs (up or down)
        stair_time_per_flight = 0.25  # 15 minutes = 0.25 hours
        
        total_stair_time = 0
        
        # Add time for pickup stairs
        if quote_request.stairs_at_pickup > 0:
            total_stair_time += quote_request.stairs_at_pickup * stair_time_per_flight
        
        # Add time for dropoff stairs  
        if quote_request.stairs_at_dropoff > 0:
            total_stair_time += quote_request.stairs_at_dropoff * stair_time_per_flight
        
        return total_stair_time
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time using 3-leg journey to depot"""
        try:
            dispatcher_address = "100 Howden Road, Unit 2, M1R 3E4, Toronto, ON"
            
            # Calculate 3-leg journey: Dispatcher -> Origin -> Destination -> Dispatcher
            leg1 = mapbox_service.get_directions(dispatcher_address, origin)
            leg2 = mapbox_service.get_directions(origin, destination)
            leg3 = mapbox_service.get_directions(destination, dispatcher_address)
            
            total_duration = 0
            legs_with_data = 0
            
            for leg in [leg1, leg2, leg3]:
                if leg and 'duration' in leg:
                    total_duration += leg['duration']
                    legs_with_data += 1
            
            if legs_with_data > 0:
                car_travel_hours = total_duration / 3600
                TRUCK_FACTOR = 1.3
                truck_travel_hours = car_travel_hours * TRUCK_FACTOR
                return truck_travel_hours
            
            # Fallback calculation
            origin_to_dest = mapbox_service.get_directions(origin, destination)
            if origin_to_dest and 'duration' in origin_to_dest:
                one_way_hours = origin_to_dest['duration'] / 3600
                car_three_leg_hours = one_way_hours * 2.5
                TRUCK_FACTOR = 1.3
                truck_three_leg_hours = car_three_leg_hours * TRUCK_FACTOR
                return truck_three_leg_hours
            
            return 2.0 * 1.3
        except Exception as e:
            return 2.0 * 1.3
    
    def _calculate_fuel_charge(self, travel_hours: float) -> float:
        """Calculate fuel charge - only geographic surcharge for Velocity Movers"""
        return 0  # Velocity Movers doesn't charge fuel per hour, only geographic surcharge
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost"""
        rates = {"piano": 250, "safe": 300, "treadmill": 100}
        total = 0
        for item, count in heavy_items.items():
            if item in rates:
                total += rates[item] * count
        return total
    
    def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
        """Calculate additional services cost - REMOVED: Services require vendor assessment"""
        # Additional services (packing, storage, cleaning, junk) require vendor assessment
        # based on size, time, weight, and other factors - not included in base quote
        return 0.0

class PierreSonsCalculator(VendorCalculator):
    """Pierre & Sons - Simple Hourly + Distance Surcharge"""
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on room count AND heavy items - OFFICIAL PIERRE & SONS RULES"""
        # Official Pierre & Sons crew sizing based on room count
        if quote_request.total_rooms <= 2:
            base_crew = 2
        elif quote_request.total_rooms <= 3:
            base_crew = 3
        elif quote_request.total_rooms <= 4:
            base_crew = 4
        else:
            base_crew = 5  # 5+ rooms = 5 movers
        
        # Heavy items auto-upgrade crew to at least 3
        heavy_items_count = sum(quote_request.heavy_items.values())
        if heavy_items_count > 0:
            return max(base_crew, 3)
        
        return base_crew
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on crew size"""
        if crew_size <= 3:
            return 1
        else:
            return 2
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
        """Calculate Pierre & Sons quote with distance surcharge"""
        crew_size = self.get_crew_size(quote_request)
        truck_count = self.get_truck_count(quote_request, crew_size)
        
        # Get hourly rate based on crew size
        hourly_rate = self._get_hourly_rate(crew_size)
        
        # Estimate labor hours
        labor_hours = self._estimate_labor_hours(quote_request.total_rooms, quote_request)
        
        # Calculate travel time and distance
        travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
        distance_km = self._calculate_distance(quote_request.origin_address, quote_request.destination_address)
        
        # Calculate costs using official Pierre & Sons rules
        labor_cost = hourly_rate * labor_hours
        travel_cost = hourly_rate * travel_hours
        truck_fee = self._get_truck_fee(quote_request.total_rooms)
        fuel_surcharge = self._calculate_fuel_surcharge(distance_km)
        heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
        additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
        
        total_cost = labor_cost + travel_cost + truck_fee + fuel_surcharge + heavy_items_cost + additional_services_cost
        
        return {
            "vendor_name": "Pierre & Sons",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "labor": round(labor_cost, 2),
                "travel": round(travel_cost, 2),
                "truck_fee": round(truck_fee, 2),
                "fuel_surcharge": round(fuel_surcharge, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "travel_time_hours": travel_hours,
            "distance_km": distance_km,
            "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
            "rating": 4.7,
            "reviews": 734,
            "special_notes": "Reliable service",
            "hourly_rate": hourly_rate,
            "dispatcher_info": {
                "name": dispatcher_info["name"],
                "address": dispatcher_info["address"],
                "total_distance_km": dispatcher_info["total_distance_km"],
                "location_name": dispatcher_info["name"],
                "gmb_url": GeographicVendorDispatcher._generate_gmb_url(dispatcher_info["name"], dispatcher_info["address"])
            }
        }
    
    def _get_hourly_rate(self, crew_size: int) -> float:
        """Get fixed hourly rate based on crew size - OFFICIAL PIERRE & SONS RULES"""
        rates = {
            1: 65,   # $65/hr for 1 guy ✅
            2: 135,  # $135/hr for 2 guys ✅
            3: 165,  # $165/hr for 3 guys ✅
            4: 195,  # $195/hr for 4 guys ✅
            5: 225,  # $225/hr for 5 guys ✅
            6: 255   # $255/hr for 6 guys ✅
        }
        return rates.get(crew_size, 135)
    
    def _estimate_labor_hours(self, room_count: int, quote_request: QuoteRequest = None) -> float:
        """Estimate labor hours based on room count and stairs"""
        base_hours = {
            1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 8.5, 7: 9.5
        }.get(room_count, 9.5)
        
        # Add stair time if quote_request is provided
        if quote_request:
            stair_time = self._calculate_stair_time(quote_request)
            base_hours += stair_time
        
        return base_hours
    
    def _calculate_stair_time(self, quote_request: QuoteRequest) -> float:
        """Calculate additional time for stairs - GENERAL RULE FOR ALL VENDORS"""
        # General rule: 15 minutes per flight of stairs (up or down)
        stair_time_per_flight = 0.25  # 15 minutes = 0.25 hours
        
        total_stair_time = 0
        
        # Add time for pickup stairs
        if quote_request.stairs_at_pickup > 0:
            total_stair_time += quote_request.stairs_at_pickup * stair_time_per_flight
        
        # Add time for dropoff stairs  
        if quote_request.stairs_at_dropoff > 0:
            total_stair_time += quote_request.stairs_at_dropoff * stair_time_per_flight
        
        return total_stair_time
    
    def _get_truck_fee(self, room_count: int) -> float:
        """Get truck fee based on room count - OFFICIAL PIERRE & SONS RULES"""
        # Official Pierre & Sons truck fees:
        # $100 - Small truck (16ft) / For 1-bedroom moves within 50 km
        # $140 - Medium truck (20ft) / For 2-bedroom moves within 50 km
        # $180 - Big truck (26ft) / For 3-bedroom moves within 50 km
        
        if room_count == 1:
            return 100  # Small truck (16ft) - $100
        elif room_count == 2:
            return 140  # Medium truck (20ft) - $140
        elif room_count >= 3:
            return 180  # Big truck (26ft) - $180
        else:
            return 100  # Default to small truck
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time - OFFICIAL PIERRE & SONS RULES"""
        # Pierre & Sons official rule: 1 hour travel time fee included
        # This covers the time it takes for the team to return to the office
        
        try:
            # Get one-way travel time
            directions = mapbox_service.get_directions(origin, destination)
            if directions:
                one_way_hours = directions['duration'] / 3600
                
                # Apply truck factor
                TRUCK_FACTOR = 1.3
                truck_one_way_hours = one_way_hours * TRUCK_FACTOR
                
                # Return time is included in the 1-hour travel time fee
                return max(1.0, truck_one_way_hours)
            
            return 1.0  # Default 1 hour travel time fee
        except Exception as e:
            return 1.0  # Default 1 hour travel time fee
    
    def _calculate_distance(self, origin: str, destination: str) -> float:
        """Calculate distance using Mapbox API"""
        try:
            directions = mapbox_service.get_directions(origin, destination)
            if directions:
                return directions['distance'] / 1000  # Convert meters to kilometers
            return 25.0  # Default 25 km
        except Exception as e:
            print(f"Error calculating distance: {e}")
            return 25.0  # Default 25 km
    
    def _calculate_fuel_surcharge(self, distance_km: float) -> float:
        """Calculate fuel surcharge for distances over 50km - OFFICIAL PIERRE & SONS RULES"""
        # Official rule: If the distance exceeds 50 km, $1 per extra km will be added
        if distance_km <= 50:
            return 0
        else:
            extra_km = distance_km - 50
            return extra_km * 1  # $1 per km over 50km
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost"""
        rates = {"piano": 250, "safe": 300, "treadmill": 100}
        total = 0
        for item, count in heavy_items.items():
            if item in rates:
                total += rates[item] * count
        return total
    
    def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
        """Calculate additional services cost - REMOVED: Services require vendor assessment"""
        # Additional services (packing, storage, cleaning, junk) require vendor assessment
        # based on size, time, weight, and other factors - not included in base quote
        return 0.0

# Vendor calculator factory
VENDOR_CALCULATORS = {
    "lets-get-moving": LetsGetMovingCalculator(),
    "easy2go": Easy2GoCalculator(),
    "velocity-movers": VelocityMoversCalculator(),
    "pierre-sons": PierreSonsCalculator(),
}

def get_vendor_calculator(vendor_slug: str) -> VendorCalculator:
    """Get vendor calculator by slug"""
    return VENDOR_CALCULATORS.get(vendor_slug)

def get_available_vendors_for_quote(quote_request: QuoteRequest) -> List[Dict[str, Any]]:
    """Get available vendors for a specific quote request"""
    return GeographicVendorDispatcher.get_available_vendors_for_location(
        quote_request.origin_address, 
        quote_request.destination_address
    ) 