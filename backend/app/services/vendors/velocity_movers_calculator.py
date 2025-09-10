from typing import Dict, Any
from app.schemas.quote import QuoteRequest
from app.services.mapbox_service import mapbox_service

class VelocityMoversCalculator:
    """Velocity Movers - Simple Weight-Based Pricing (No Google Sheets)"""
    
    # Service Area
    SERVICE_AREAS = {
        "cities": ["Toronto", "Mississauga", "Oakville", "Burlington", "Hamilton", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oshawa", "Whitby", "Ajax", "Pickering"],
        "regions": ["GTA", "Ontario"],
        "max_distance_km": 200
    }
    
    # Location-Based Pricing
    LOCATION_RATES = {
        "Toronto": {"base_multiplier": 1.0, "fuel_surcharge": 0},
        "Mississauga": {"base_multiplier": 0.97, "fuel_surcharge": 30},
        "Oakville": {"base_multiplier": 0.92, "fuel_surcharge": 50},
        "Burlington": {"base_multiplier": 0.88, "fuel_surcharge": 65},
        "Hamilton": {"base_multiplier": 0.85, "fuel_surcharge": 80}
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
        # Velocity Movers weight table from old app data
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
        # Velocity Movers weight table from old app data
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
        """Calculate Velocity Movers quote with simple weight-based pricing"""
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
        
        # Calculate travel time
        travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address)
        
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
            "vendor_name": "Velocity Movers",
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
                "name": "Velocity HQ",
                "address": "100 Howden Road, Unit 2, Toronto, ON M1R 3E4",
                "total_distance_km": None,
                "location_name": "Velocity HQ",
                "gmb_url": "https://www.google.com/maps/search/Velocity+Moving+100+Howden+Road+Toronto+ON"
            },
            "geographic_adjustments": {
                "origin_city": origin_city,
                "base_multiplier": 1.0,
                "fuel_surcharge": 0,
                "adjusted_hourly_rate": hourly_rate
            },
            "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM"],
            "rating": 4.9,
            "reviews": 567,
            "special_notes": "Premium service"
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
    
    def _estimate_labor_hours_from_rooms(self, rooms: int) -> float:
        """Estimate labor hours from rooms - Based on old app data"""
        # Velocity Movers room-based labor hours from old app data
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
        # Velocity Movers truck fees - dynamic based on move size
        if weight <= 10000:
            return 200  # Base truck fee for lighter moves
        else:
            return 250  # Higher truck fee for heavier moves (2 trucks)
    
    def _calculate_travel_time(self, origin: str, destination: str) -> float:
        """Calculate travel time using Mapbox API with actual dispatcher location and truck factor"""
        try:
            # Velocity Movers dispatcher address
            dispatcher_address = "100 Howden Road, Unit 2, Toronto, ON M1R 3E4"
            
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
                
                print(f"Velocity Movers Mapbox travel calculation: {legs_with_data}/3 legs, car: {car_travel_hours:.2f}h, truck: {truck_travel_hours:.2f}h")
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
                
                print(f"Velocity Movers Mapbox fallback calculation: car: {car_three_leg_hours:.2f}h, truck: {truck_three_leg_hours:.2f}h")
                return truck_three_leg_hours
            
            # Final fallback - should rarely happen
            print("Velocity Movers Mapbox calculation failed, using conservative estimate with truck factor")
            return 2.0 * 1.3  # Conservative 2 hours for 3-leg journey with truck factor
        except Exception as e:
            print(f"Velocity Movers Mapbox directions error: {e}")
            return 2.0 * 1.3  # Default 2 hours for 3-leg journey with truck factor
    
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
        """Calculate heavy items cost - Velocity Movers specific rates"""
        # Velocity Movers has premium rates for heavy items
        rates = {"piano": 300, "safe": 350, "treadmill": 120}
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