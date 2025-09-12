from typing import Dict, Any
from app.schemas.quote import QuoteRequest
from app.services.mapbox_service import mapbox_service

class PierreSonsCalculator:
    """Pierre & Sons - Simple Fixed Rate Pricing (No Google Sheets)"""
    
    # Service Area
    SERVICE_AREAS = {
        "cities": ["Toronto", "Scarborough", "North York", "Etobicoke", "York", "East York", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill"],
        "regions": ["Toronto", "GTA"],
        "max_distance_km": 50  # CANADA ONLY - 50KM MAX PER LOCATION
    }
    
    # Location-Based Pricing
    LOCATION_RATES = {
        "Toronto": {"base_multiplier": 1.0, "fuel_surcharge": 0},
        "Scarborough": {"base_multiplier": 0.98, "fuel_surcharge": 15},
        "North York": {"base_multiplier": 0.98, "fuel_surcharge": 10},
        "Etobicoke": {"base_multiplier": 0.98, "fuel_surcharge": 20},
        "York": {"base_multiplier": 0.98, "fuel_surcharge": 5},
        "East York": {"base_multiplier": 0.98, "fuel_surcharge": 12}
    }
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on room count - Based on old app data"""
        rooms = quote_request.total_rooms
        size = quote_request.square_footage if hasattr(quote_request, 'square_footage') else ''
        
        # Pierre & Sons crew logic from old app data
        crew = 2  # Default
        if rooms >= 6 or size == '5+ Bedrooms':
            crew = 5
        elif rooms >= 4 or size == '4 Bedrooms':
            crew = 4
        elif rooms >= 3 or size == '3 Bedrooms':
            crew = 3
        elif rooms >= 2 or size == '2 Bedrooms':
            crew = 2
        elif rooms == 1 or size == '1 Bedroom' or size == 'Studio':
            crew = 1
        
        # Minimum 2 for most moves (as per old app data)
        if crew < 2:
            crew = 2
        
        return crew
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on room count - Based on old app data"""
        rooms = quote_request.total_rooms
        size = quote_request.square_footage if hasattr(quote_request, 'square_footage') else ''
        
        # Pierre & Sons truck logic from old app data
        if rooms >= 4 or size == '4 Bedrooms' or size == '5+ Bedrooms':
            return 2  # Larger truck for bigger moves
        else:
            return 1  # Standard truck for smaller moves
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """Calculate Pierre & Sons quote with simple fixed rate pricing"""
        crew_size = self.get_crew_size(quote_request)
        truck_count = self.get_truck_count(quote_request, crew_size)
        
        # Get fixed hourly rate based on crew size (NO ADJUSTMENTS)
        hourly_rate = self._get_hourly_rate(crew_size)
        
        # No geographic pricing adjustments - use original rates
        origin_city = self._extract_city_from_address(quote_request.origin_address)
        fuel_surcharge = 0  # No fuel surcharge adjustments
        
        # Estimate labor hours with 3-hour minimum
        labor_hours = max(self._estimate_labor_hours(quote_request.total_rooms), 3.0)
        
        # Calculate travel time and distance with validation
        try:
            travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
            distance_km = self._calculate_distance(quote_request.origin_address, quote_request.destination_address)
        except ValueError as e:
            # This is a long distance move or outside service area - reject the quote
            print(f"Pierre & Sons: Rejecting quote - {str(e)}")
            return {
                "vendor_name": "Pierre & Sons",
                "total_cost": 0,
                "breakdown": {},
                "crew_size": 0,
                "truck_count": 0,
                "estimated_hours": 0,
                "travel_time_hours": 0,
                "hourly_rate": 0,
                "rejected": True,
                "rejection_reason": str(e)
            }
        
        # Calculate truck fee based on move size AND distance
        truck_fee = self._get_truck_fee_with_distance(quote_request.total_rooms, distance_km)
        
        # Calculate additional fuel surcharge for distance over 50km
        distance_fuel_surcharge = self._calculate_fuel_surcharge(distance_km)
        
        # Calculate costs
        labor_cost = hourly_rate * labor_hours
        travel_cost = hourly_rate * travel_hours
        fuel_cost = fuel_surcharge + distance_fuel_surcharge
        heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
        additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
        
        total_cost = labor_cost + truck_fee + travel_cost + fuel_cost + heavy_items_cost + additional_services_cost
        
        return {
            "vendor_name": "Pierre & Sons",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "labor": round(labor_cost, 2),
                "truck_fee": round(truck_fee, 2),
                "travel": round(travel_cost, 2),
                "fuel_surcharge": round(fuel_cost, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "travel_time_hours": travel_hours,
            "hourly_rate": hourly_rate,
            "dispatcher_info": dispatcher_info or {
                "name": "Etobicoke HQ",
                "address": "1155 Kipling Ave, Etobicoke, ON M9B 3M4",
                "total_distance_km": distance_km,
                "location_name": "Etobicoke HQ",
                "gmb_url": "https://www.google.com/maps/search/Pierre+and+Sons+1155+Kipling+Ave+Etobicoke+ON"
            },
            "geographic_adjustments": {
                "origin_city": origin_city,
                "base_multiplier": 1.0,
                "fuel_surcharge": 0,
                "distance_fuel_surcharge": distance_fuel_surcharge,
                "adjusted_hourly_rate": hourly_rate
            },
            "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
            "rating": 4.7,
            "reviews": 734,
            "special_notes": "Reliable service"
        }
    
    def _get_hourly_rate(self, crew_size: int) -> float:
        """Get fixed hourly rate based on crew size - Based on old app data"""
        rates = {
            1: 65,   # $65/hr for 1 guy
            2: 135,  # $135/hr for 2 guys
            3: 165,  # $165/hr for 3 guys
            4: 195,  # $195/hr for 4 guys
            5: 225,  # $225/hr for 5 guys
            6: 255   # $255/hr for 6 guys
        }
        return rates.get(crew_size, 135)
    
    def _estimate_labor_hours(self, room_count: int) -> float:
        """Estimate labor hours based on room count - Based on old app data"""
        labor_hours_map = {
            1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 7.5
        }
        return labor_hours_map.get(room_count, 7.5)  # Default to 7.5 for larger moves
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time with proper distance validation"""
        try:
            # Get one-way travel time
            directions = mapbox_service.get_directions(origin, destination)
            if directions:
                one_way_hours = directions['duration'] / 3600
                distance_km = directions['distance'] / 1000
                
                # Check if this exceeds Pierre & Sons service area (200km max)
                if distance_km > self.SERVICE_AREAS["max_distance_km"]:
                    print(f"Pierre & Sons: Distance {distance_km:.1f}km exceeds max service area of {self.SERVICE_AREAS['max_distance_km']}km")
                    raise ValueError(f"Distance {distance_km:.1f}km exceeds Pierre & Sons service area")
                
                # Check if this is a long distance move (>10 hours one-way)
                if one_way_hours > 10:
                    print(f"Pierre & Sons: One-way travel time {one_way_hours:.1f}h exceeds 10h limit for long distance moves")
                    raise ValueError(f"One-way travel time {one_way_hours:.1f}h exceeds 10h limit")
                
                # Apply truck factor
                TRUCK_FACTOR = 1.3
                truck_one_way_hours = one_way_hours * TRUCK_FACTOR
                
                # Pierre & Sons rule: If move is more than 1 hour away, 
                # travel time fee matches the time it takes to return to office
                if truck_one_way_hours > 1:
                    print(f"Pierre & Sons travel time: {truck_one_way_hours:.2f}h (over 1 hour, full travel time)")
                    return truck_one_way_hours  # Full travel time
                else:
                    print(f"Pierre & Sons travel time: 1.0h (minimum 1 hour travel time fee)")
                    return 1.0  # Minimum 1 hour travel time fee
            
            # If we can't get directions at all, this is likely outside service area
            print("Pierre & Sons: Could not calculate directions - likely outside service area")
            raise ValueError("Could not calculate directions - likely outside service area")
            
        except Exception as e:
            print(f"Pierre & Sons travel calculation error: {e}")
            raise ValueError(f"Travel calculation failed: {str(e)}")
    
    def _calculate_distance(self, origin: str, destination: str) -> float:
        """Calculate distance using Mapbox API"""
        try:
            directions = mapbox_service.get_directions(origin, destination)
            if directions:
                # Convert meters to kilometers
                distance_km = directions['distance'] / 1000
                return distance_km
            
            return 25.0  # Default 25km if Mapbox fails
        except Exception as e:
            print(f"Mapbox distance error: {e}")
            return 25.0  # Default 25km if Mapbox fails
    
    def _calculate_fuel_surcharge(self, distance_km: float) -> float:
        """Calculate fuel surcharge - OFFICIAL PIERRE & SONS RULES"""
        # Pierre & Sons rule: If distance exceeds 50 km, $1 per extra km
        if distance_km <= 50:
            return 0.0
        
        extra_km = distance_km - 50
        return extra_km * 1.0  # $1 per extra km
    
    def _get_truck_fee_from_rooms(self, room_count: int) -> float:
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
    
    def _get_truck_fee_with_distance(self, room_count: int, distance_km: float) -> float:
        """Get truck fee based on room count AND distance - OFFICIAL PIERRE & SONS RULES"""
        # Base truck fee based on room count
        base_fee = self._get_truck_fee_from_rooms(room_count)
        
        # Distance surcharge: $1 per extra km if distance exceeds 50 km
        if distance_km > 50:
            extra_km = distance_km - 50
            distance_surcharge = extra_km * 1.0  # $1 per extra km
            return base_fee + distance_surcharge
        
        return base_fee
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost - Pierre & Sons specific rates"""
        # Pierre & Sons has mid-range rates for heavy items
        rates = {"piano": 275, "safe": 325, "treadmill": 110}
        total = 0
        for item, count in heavy_items.items():
            if item in rates:
                total += rates[item] * count
        return total
    
    def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
        """Calculate additional services cost"""
        rates = {
            "packing": 110, "storage": 200, "cleaning": 396, "junk": 150
        }
        total = 0
        for service, enabled in services.items():
            if enabled and service in rates:
                total += rates[service]
        return total
    
    def _extract_city_from_address(self, address: str) -> str:
        """Extract city from address"""
        address_lower = address.lower()
        
        # Check for specific cities
        for city in self.LOCATION_RATES.keys():
            if city.lower() in address_lower:
                return city
        
        # Default to Toronto if no match
        return "Toronto"
    
    def _get_location_based_pricing(self, origin_city: str, base_rate: float) -> Dict[str, float]:
        """Get location-based pricing adjustments"""
        location_data = self.LOCATION_RATES.get(origin_city, self.LOCATION_RATES["Toronto"])
        
        adjusted_rate = base_rate * location_data["base_multiplier"]
        fuel_surcharge = location_data["fuel_surcharge"]
        
        return {
            "adjusted_rate": adjusted_rate,
            "fuel_surcharge": fuel_surcharge,
            "base_multiplier": location_data["base_multiplier"]
        } 