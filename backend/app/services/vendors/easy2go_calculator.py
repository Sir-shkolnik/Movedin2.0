from typing import Dict, Any
from app.schemas.quote import QuoteRequest
from app.services.mapbox_service import mapbox_service

class Easy2GoCalculator:
    """Easy2Go - Simple Weight-Based Pricing (No Google Sheets)"""
    
    # Service Area
    SERVICE_AREAS = {
        "cities": ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering"],
        "regions": ["GTA", "Ontario"],
        "max_distance_km": 50  # CANADA ONLY - 50KM MAX PER LOCATION
    }
    
    # Location-Based Pricing
    LOCATION_RATES = {
        "Toronto": {"base_multiplier": 1.0, "fuel_surcharge": 0},
        "Mississauga": {"base_multiplier": 0.98, "fuel_surcharge": 20},
        "Brampton": {"base_multiplier": 0.95, "fuel_surcharge": 35},
        "Vaughan": {"base_multiplier": 0.98, "fuel_surcharge": 25},
        "Markham": {"base_multiplier": 0.98, "fuel_surcharge": 30},
        "Richmond Hill": {"base_multiplier": 0.98, "fuel_surcharge": 35}
    }
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on weight estimation - Based on old app data table"""
        weight = self._estimate_weight(quote_request)
        return self._get_crew_size_from_weight(weight)
    
    def _estimate_weight(self, quote_request: QuoteRequest) -> float:
        """Estimate weight based on rooms and square footage - Based on old app data"""
        if quote_request.estimated_weight > 0:
            return quote_request.estimated_weight
        
        # Estimate from room count
        room_weight_map = {
            1: 1000, 2: 2000, 3: 3000, 4: 4000, 5: 5000, 6: 6000
        }
        
        base_weight = room_weight_map.get(quote_request.total_rooms, 4000)
        
        # Adjust for square footage if available
        if quote_request.square_footage:
            try:
                sqft = float(quote_request.square_footage.replace("sq ft", "").strip())
                weight_per_sqft = 8  # Average pounds per square foot
                sqft_weight = sqft * weight_per_sqft
                return max(base_weight, sqft_weight)
            except:
                pass
        
        return base_weight
    
    def _get_crew_size_from_weight(self, weight: float) -> int:
        """Get crew size from weight using old app data table"""
        # Easy2Go weight table from old app data
        weight_table = [
            [500, 1000, 2], [1000, 2000, 2], [2000, 3000, 2], [3000, 4000, 3],
            [4000, 5000, 3], [5000, 6000, 3], [6000, 7000, 3], [7000, 8000, 3],
            [8000, 9000, 3], [9000, 10000, 3], [10000, 11000, 4], [11000, 12000, 4],
            [12000, 13000, 5], [13000, 14000, 5], [14000, 15000, 5]
        ]
        
        for min_weight, max_weight, crew_size in weight_table:
            if min_weight <= weight <= max_weight:
                return crew_size
        
        return 5  # Default for very heavy moves
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on weight - Based on old app data table"""
        weight = self._estimate_weight(quote_request)
        return self._get_truck_count_from_weight(weight)
    
    def _get_truck_count_from_weight(self, weight: float) -> int:
        """Get truck count from weight using old app data table"""
        # Easy2Go weight table from old app data
        weight_table = [
            [500, 1000, 1], [1000, 2000, 1], [2000, 3000, 1], [3000, 4000, 1],
            [4000, 5000, 1], [5000, 6000, 1], [6000, 7000, 1], [7000, 8000, 1],
            [8000, 9000, 1], [9000, 10000, 1], [10000, 11000, 2], [11000, 12000, 2],
            [12000, 13000, 2], [13000, 14000, 2], [14000, 15000, 2]
        ]
        
        for min_weight, max_weight, truck_count in weight_table:
            if min_weight <= weight <= max_weight:
                return truck_count
        
        return 2  # Default for very heavy moves
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """Calculate Easy2Go quote with simple weight-based pricing"""
        try:
            # Validate input parameters
            if not quote_request:
                raise ValueError("Invalid quote_request provided")
            
            # Estimate weight first
            weight = self._estimate_weight(quote_request)
            
            crew_size = self.get_crew_size(quote_request)
            truck_count = self.get_truck_count(quote_request, crew_size)
            
            # Get hourly rate from crew size - Based on old app data (NO ADJUSTMENTS)
            hourly_rate = self._get_hourly_rate(crew_size)
            
            # No geographic pricing adjustments - use original rates
            origin_city = self._extract_city_from_address(quote_request.origin_address)
            fuel_surcharge = 0  # No fuel surcharge adjustments
            
            # Estimate labor hours from rooms - Based on old app data (room-based, not weight-based)
            labor_hours = self._estimate_labor_hours_from_rooms(quote_request.total_rooms)
            
            # Calculate travel time with validation
            try:
                travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
            except ValueError as e:
                # This is a long distance move or outside service area - reject the quote
                print(f"Easy2Go: Rejecting quote - {str(e)}")
                return {
                    "vendor_name": "Easy2Go",
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
            
            # Calculate truck fee based on weight
            truck_fee = self._get_truck_fee_from_weight(weight)
            
            # Calculate costs
            labor_cost = hourly_rate * labor_hours
            travel_cost = hourly_rate * travel_hours
            fuel_cost = self._calculate_fuel_charge(travel_hours) + fuel_surcharge
            heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
            additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
            
            total_cost = labor_cost + truck_fee + travel_cost + fuel_cost + heavy_items_cost + additional_services_cost
            
            return {
            "vendor_name": "Easy2Go",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "labor": round(labor_cost, 2),
                "truck_fee": round(truck_fee, 2),
                "travel": round(travel_cost, 2),
                "fuel": round(fuel_cost, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "travel_time_hours": travel_hours,
            "hourly_rate": hourly_rate,
            "dispatcher_info": dispatcher_info or {
                "name": "Easy2Go Depot",
                "address": "3397 American Drive, Mississauga, ON L4V 1T8",
                "total_distance_km": None,
                "location_name": "Easy2Go Depot",
                "gmb_url": "https://www.google.com/maps/search/Easy2Go+Depot+3397+American+Drive+Mississauga+ON"
            },
            "geographic_adjustments": {
                "origin_city": origin_city,
                "base_multiplier": 1.0,
                "fuel_surcharge": 0,
                "adjusted_hourly_rate": hourly_rate
            },
            "available_slots": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM"],
            "rating": 4.6,
            "reviews": 892,
            "special_notes": "Best value"
        }
        
        except Exception as e:
            print(f"Error calculating Easy2Go quote: {e}")
            # Return a fallback quote with error information
            return {
                "vendor_name": "Easy2Go",
                "total_cost": 0.0,
                "breakdown": {
                    "labor": 0.0,
                    "truck_fee": 0.0,
                    "travel": 0.0,
                    "fuel": 0.0,
                    "heavy_items": 0.0,
                    "additional_services": 0.0
                },
                "crew_size": 0,
                "truck_count": 0,
                "estimated_hours": 0.0,
                "travel_time_hours": 0.0,
                "hourly_rate": 0.0,
                "dispatcher_info": dispatcher_info or {
                    "name": "Easy2Go Depot",
                    "address": "3397 American Drive, Mississauga, ON L4V 1T8",
                    "total_distance_km": None,
                    "location_name": "Easy2Go Depot",
                    "gmb_url": "https://www.google.com/maps/search/Easy2Go+Depot+3397+American+Drive+Mississauga+ON"
                },
                "geographic_adjustments": {
                    "origin_city": "Unknown",
                    "base_multiplier": 1.0,
                    "fuel_surcharge": 0,
                    "adjusted_hourly_rate": 0.0
                },
                "available_slots": [],
                "rating": 4.6,
                "reviews": 892,
                "special_notes": f"Error calculating quote: {str(e)}"
            }
    
    def _get_hourly_rate(self, crew_size: int) -> float:
        """Get hourly rate based on crew size - REDUCED BY 10% FOR COMPETITIVENESS"""
        rates = {
            2: 135,  # 2 movers = $135/hr (was 150)
            3: 180,  # 3 movers = $180/hr (was 200)
            4: 225,  # 4 movers = $225/hr (was 250)
            5: 270   # 5 movers = $270/hr (was 300)
        }
        return rates.get(crew_size, 135)
    
    def _estimate_labor_hours_from_rooms(self, rooms: int) -> float:
        """Estimate labor hours from rooms - Based on old app data"""
        # Easy2Go room-based labor hours from old app data
        labor_hours_map = {
            1: 3.5,  # 1 room = 3.5 hours
            2: 4.5,  # 2 rooms = 4.5 hours
            3: 5.5,  # 3 rooms = 5.5 hours
            4: 6.5,  # 4 rooms = 6.5 hours
            5: 7.5   # 5+ rooms = 7.5 hours
        }
        return labor_hours_map.get(rooms, 7.5)  # Default to 7.5 for larger moves
    
    def _get_truck_fee_from_weight(self, weight: float) -> float:
        """Get truck fee from weight using old app data table"""
        # Easy2Go truck fees from old app data
        truck_fees = {
            16: 150,  # 16ft Truck Fee = $150
            20: 150,  # 20ft Truck Fee = $150
            26: 200,  # 26ft Truck Fee = $200
            30: 200   # 30ft Truck Fee = $200
        }
        
        # Determine truck size based on weight
        if weight <= 10000:
            return truck_fees[16]  # 16ft truck for lighter moves
        else:
            return truck_fees[26]  # 26ft truck for heavier moves
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time using Mapbox API with proper distance validation"""
        try:
            # First, try to get directions
            origin_to_dest = mapbox_service.get_directions(origin, destination)
            
            if origin_to_dest and 'duration' in origin_to_dest:
                one_way_hours = origin_to_dest['duration'] / 3600
                distance_km = origin_to_dest['distance'] / 1000
                
                # Check if this exceeds Easy2Go's service area (200km max)
                if distance_km > self.SERVICE_AREAS["max_distance_km"]:
                    print(f"Easy2Go: Distance {distance_km:.1f}km exceeds max service area of {self.SERVICE_AREAS['max_distance_km']}km")
                    raise ValueError(f"Distance {distance_km:.1f}km exceeds Easy2Go service area")
                
                # Check if this is a long distance move (>10 hours one-way)
                if one_way_hours > 10:
                    print(f"Easy2Go: One-way travel time {one_way_hours:.1f}h exceeds 10h limit for long distance moves")
                    raise ValueError(f"One-way travel time {one_way_hours:.1f}h exceeds 10h limit")
            else:
                # If Mapbox fails to get directions, this is outside service area
                print(f"Easy2Go: Could not get directions for {origin} to {destination} - outside service area")
                raise ValueError("Could not calculate directions - outside service area")
                
                # Calculate 3-leg journey: Dispatcher -> Origin -> Destination -> Dispatcher
                dispatcher_address = "3397 American Drive, Mississauga, ON L4V 1T8"
                
                # Leg 1: Dispatcher to Origin
                leg1 = mapbox_service.get_directions(dispatcher_address, origin)
                # Leg 2: Origin to Destination (already calculated)
                leg2 = origin_to_dest
                # Leg 3: Destination to Dispatcher
                leg3 = mapbox_service.get_directions(destination, dispatcher_address)
                
                total_duration = 0
                legs_with_data = 0
                
                # Sum up all legs that have data
                for leg in [leg1, leg2, leg3]:
                    if leg and 'duration' in leg:
                        total_duration += leg['duration']
                        legs_with_data += 1
                
                if legs_with_data >= 2:  # Need at least 2 legs (origin->dest is required)
                    # Convert seconds to hours
                    car_travel_hours = total_duration / 3600
                    
                    # Apply truck factor (1.3x for commercial trucks)
                    TRUCK_FACTOR = 1.3
                    truck_travel_hours = car_travel_hours * TRUCK_FACTOR
                    
                    print(f"Easy2Go Mapbox travel calculation: {legs_with_data}/3 legs, car: {car_travel_hours:.2f}h, truck: {truck_travel_hours:.2f}h")
                    return truck_travel_hours
                
                # If we can't get all legs, use the one-way calculation with proper 3-leg estimation
                # For 3-leg journey: Dispatcher->Origin->Destination->Dispatcher
                # This is approximately: (Dispatcher->Origin) + (Origin->Destination) + (Destination->Dispatcher)
                # We have Origin->Destination, estimate the other two as similar distances
                car_three_leg_hours = one_way_hours * 2.2  # More accurate than 2.5x
                TRUCK_FACTOR = 1.3
                truck_three_leg_hours = car_three_leg_hours * TRUCK_FACTOR
                
                print(f"Easy2Go Mapbox 3-leg estimation: car: {car_three_leg_hours:.2f}h, truck: {truck_three_leg_hours:.2f}h")
                return truck_three_leg_hours
            
            # If we can't get directions at all, this is likely outside service area
            print("Easy2Go: Could not calculate directions - likely outside service area")
            raise ValueError("Could not calculate directions - likely outside service area")
            
        except Exception as e:
            print(f"Easy2Go travel calculation error: {e}")
            raise ValueError(f"Travel calculation failed: {str(e)}")
    
    
    def _calculate_fuel_charge(self, travel_hours: float) -> float:
        """Calculate fuel charge based on travel time"""
        fuel_table = {
            0.5: 50, 1.0: 75, 1.5: 100, 2.0: 125, 2.5: 150,
            3.0: 175, 3.5: 200, 4.0: 225, 4.5: 250, 5.0: 275
        }
        
        # Find closest travel time
        closest_time = min(fuel_table.keys(), key=lambda x: abs(x - travel_hours))
        return fuel_table[closest_time]
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost - Easy2Go specific rates"""
        # Easy2Go has competitive rates for heavy items
        rates = {"piano": 200, "safe": 250, "treadmill": 80}
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