from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.schemas.quote import QuoteRequest
from app.services.mapbox_service import mapbox_service
from app.services.google_sheets_service import google_sheets_service
from app.services.dispatcher_cache_service import dispatcher_cache_service

class LetsGetMovingCalculator:
    """Let's Get Moving - NEW Tiered Travel Fee Pricing Model (August 2025)"""
    
    # NEW: Travel fee thresholds for new pricing model (EXACT EMAIL REQUIREMENTS)
    TRAVEL_FEE_THRESHOLDS = {
        "tier_1_max": 0.233,      # 14 minutes (0.233 hours)
        "tier_2_max": 0.483,      # 29 minutes (0.483 hours) 
        "tier_3_max": 0.733,      # 44 minutes (0.733 hours)
        "tier_4_max": 0.983,      # 59 minutes (0.983 hours)
        "tier_5_max": 1.233,      # 1:14 (1.233 hours)
        "tier_6_max": 1.483,      # 1:29 (1.483 hours)
        "tier_7_max": 1.733,      # 1:44 (1.733 hours)
        "long_distance_rate": 5.99     # $5.99 per mile per truck
    }
    
    # NEW: Time-based flat fees (EXACT EMAIL REQUIREMENTS)
    TIME_BASED_FLAT_FEES = {
        "0-14_min": 0.25,         # 15 minutes flat
        "15-29_min": 0.5,         # 30 minutes flat
        "30-44_min": 0.75,        # 45 minutes flat
        "45-59_min": 1.0,         # 1 hour flat
        "1:00-1:14": 1.25,        # 1 hour 15 minutes flat
        "1:15-1:29": 1.5,         # 1 hour 30 minutes flat
        "1:30-1:44": 1.75         # 1 hour 45 minutes flat
    }
    
    # Service Area
    SERVICE_AREAS = {
        "cities": ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Burlington", "Hamilton", "Oshawa", "Whitby", "Ajax", "Pickering", "Scarborough", "North York", "Etobicoke", "York", "East York"],
        "regions": ["GTA", "Greater Toronto Area", "Golden Horseshoe"],
        "max_distance_km": 150
    }
    
    def get_crew_size(self, quote_request: QuoteRequest) -> int:
        """Crew size based on room count and heavy items - TRUE LGM LOGIC"""
        base_crew = self._get_base_crew_size(quote_request.total_rooms)
        
        # Heavy items auto-upgrade crew to at least 3
        heavy_items_count = sum(quote_request.heavy_items.values())
        if heavy_items_count > 0:
            return max(base_crew, 3)
        
        return base_crew
    
    def _get_base_crew_size(self, room_count: int) -> int:
        """Get base crew size based on room count - FIXED LGM LOGIC"""
        # Expected behavior (used across codebase/tests):
        # 1–2 rooms → 2 crew, 3 rooms → 3 crew, 4 rooms → 4 crew,
        # 5+ rooms → 5 crew (cap at 5 by business rule)
        if room_count <= 2:
            return 2
        elif room_count <= 3:
            return 3
        elif room_count <= 4:
            return 4
        else:
            return 5
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on crew size - FIXED: 4+ movers need 2 trucks (max 3 per truck)"""
        if crew_size <= 3:
            return 1
        else:
            return 2
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db=None) -> Dict[str, Any]:
        """Calculate LGM quote with TRUE dynamic calendar-based pricing"""
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
            if date_key in daily_rates:
                base_rate = daily_rates[date_key]
                break
        
        if base_rate is None:
            # Return a valid quote response with zero cost to indicate no availability
            return {
                "vendor_name": "Let's Get Moving",
                "vendor_slug": "lets-get-moving",
                "total_cost": 0.0,
                "breakdown": {
                    "labor": 0.0,
                    "fuel": 0.0,
                    "heavy_items": 0.0,
                    "additional_services": 0.0
                },
                "crew_size": 0,
                "truck_count": 0,
                "estimated_hours": 0.0,
                "travel_time_hours": 0.0,
                "hourly_rate": 0.0,
                "available_slots": [],
                "rating": 4.8,
                "reviews": 1247,
                "special_notes": f"No availability for {move_date} at {dispatcher_info.get('name')}",
                "premium_available": None,
                "premium_rate": None
            }
        
        # Calculate hourly rate with crew multiplier - TRUE LGM LOGIC
        hourly_rate = self._calculate_hourly_rate(base_rate, crew_size, truck_count)
        
        # Estimate labor hours - TRUE LGM LOGIC
        labor_hours = self._estimate_labor_hours(quote_request.total_rooms, crew_size)
        
        # NEW PRICING MODEL (August 2025): Calculate job time (origin to destination only)
        origin_to_dest_travel = self._calculate_origin_to_destination_travel(quote_request.origin_address, quote_request.destination_address)
        job_hours = labor_hours + origin_to_dest_travel
        
        # NEW: Calculate travel fees (office to origin + destination to office)
        travel_fees = self._calculate_travel_fees(quote_request.origin_address, quote_request.destination_address, hourly_rate, truck_count, dispatcher_info)
        
        # NEW: Calculate total cost with new model
        job_cost = hourly_rate * job_hours
        fuel_cost = self._calculate_fuel_charge(origin_to_dest_travel)  # Fuel only for job travel
        heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
        additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
        total_cost = job_cost + travel_fees + fuel_cost + heavy_items_cost + additional_services_cost
        
        # NEW: Validate travel fee calculation
        self._validate_travel_fee_calculation(quote_request.origin_address, quote_request.destination_address, travel_fees, hourly_rate, truck_count, dispatcher_info)
        
        return {
            "vendor_name": "Let's Get Moving",
            "vendor_slug": "lets-get-moving",
            "total_cost": round(total_cost, 2),
            "breakdown": {
                "job_cost": round(job_cost, 2),           # NEW: Job time only
                "travel_fees": round(travel_fees, 2),     # NEW: Travel fees
                "fuel": round(fuel_cost, 2),
                "heavy_items": round(heavy_items_cost, 2),
                "additional_services": round(additional_services_cost, 2)
            },
            "crew_size": crew_size,
            "truck_count": truck_count,
            "estimated_hours": labor_hours,
            "job_travel_hours": origin_to_dest_travel,    # NEW: Origin to destination only
            "office_travel_fees": round(travel_fees, 2),  # NEW: Office travel fees
            "hourly_rate": hourly_rate,
            "dispatcher_info": {
                "name": dispatcher_info.get("name", "Let's Get Moving"),
                "address": dispatcher_info.get("address", ""),
                "total_distance_km": dispatcher_info.get("total_distance_km"),
                "sales_phone": dispatcher_info.get("sales_phone", ""),
                "email": dispatcher_info.get("email", ""),
                "truck_count": dispatcher_info.get("truck_count", ""),
                "location_name": dispatcher_info.get("name", "Let's Get Moving"),
                "gmb_url": self._generate_gmb_url(dispatcher_info.get("name", ""), dispatcher_info.get("address", ""))
            },
            "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"],
            "rating": 4.8,
            "reviews": 1247,
            "special_notes": "NEW PRICING MODEL - August 2025",
            "pricing_model": "NEW_TIERED_TRAVEL_FEES",    # NEW: Indicate new model
            "premium_available": None,
            "premium_rate": None
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
    
    def _generate_gmb_url(self, location_name: str, address: str) -> str:
        """Generate Google My Business URL for a location"""
        if not location_name or not address:
            return ""
        clean_name = location_name.replace(" ", "+").replace("&", "and")
        clean_address = address.replace(" ", "+").replace(",", "")
        gmb_url = f"https://www.google.com/maps/search/{clean_name}+{clean_address}"
        return gmb_url
    
    def _estimate_labor_hours(self, room_count: int, crew_size: int) -> float:
        """Estimate labor hours based on room count and crew efficiency - TRUE LGM LOGIC"""
        # Base hours from old app data - CORRECTED for 1 room
        base_hours = {
            1: 2.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 8.5, 7: 9.5
        }.get(room_count, 9.5)
        
        # Crew efficiency adjustments from old app data
        if crew_size >= 4:
            base_hours = max(base_hours * 0.8, base_hours - 1)  # 20% faster or 1 hour less
        elif crew_size >= 3:
            base_hours = max(base_hours * 0.85, base_hours - 0.5)  # 15% faster or 0.5 hour less
        
        # MINIMUM 2 HOURS LABOR COST - TRUE LGM REQUIREMENT
        return max(base_hours, 2.0)
    
    def _calculate_travel_time(self, origin: str, destination: str, dispatcher_address: str) -> float:
        """Calculate travel time using Mapbox API with 3-leg journey - ACCURATE MAPBOX CALCULATION"""
        try:
            # Use the actual selected dispatcher address for 3-leg calculation
            
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
                travel_hours = total_duration / 3600
                print(f"Mapbox travel calculation: {legs_with_data}/3 legs, {travel_hours:.2f} hours")
                return travel_hours
            
            # If Mapbox fails for all legs, try a simpler approach
            # Just calculate Origin to Destination and estimate 3-leg
            origin_to_dest = mapbox_service.get_directions(origin, destination)
            if origin_to_dest and 'duration' in origin_to_dest:
                one_way_hours = origin_to_dest['duration'] / 3600
                # Estimate 3-leg as 2.5x one-way (Dispatcher->Origin->Destination->Dispatcher)
                three_leg_hours = one_way_hours * 2.5
                print(f"Mapbox fallback calculation: {three_leg_hours:.2f} hours (2.5x one-way)")
                return three_leg_hours
            
            # Final fallback - should rarely happen
            print("Mapbox calculation failed, using conservative estimate")
            return 2.0  # Conservative 2 hours for 3-leg journey
            
        except Exception as e:
            print(f"Mapbox directions error: {e}")
            return 2.0  # Default 2 hours for 3-leg journey
    
    def _calculate_fuel_charge(self, travel_hours: float) -> float:
        """Calculate fuel charge - NEW: Only for long distance moves over 1:44 (August 2025)"""
        # NEW: Fuel charges only apply to long distance moves (job travel over 1:44)
        if travel_hours <= 1.733:  # 1 hour 44 minutes or less (matches tier 7 max)
            print(f"[LGM NEW MODEL] No fuel charge for local moves (≤1:44): {travel_hours:.2f}h")
            return 0  # No fuel charge for local moves
        
        # For long distance moves, use existing fuel table
        fuel_charge_table = [
            [1.75, 2.75, 260],   # 1:45–2:45 Hours, $260
            [2.75, 3.75, 450],   # 2:45–3:45 Hours, $450
            [3.75, 4.75, 580],   # 3:45–4:45 Hours, $580
            [4.75, 5.75, 710],   # 4:45–5:75 Hours, $710
            [5.75, 6.75, 840],   # 5:45–6:45 Hours, $840
            [6.75, 7.75, 970],   # 6:45–7:75 Hours, $970
            [7.75, 8.75, 1100],  # 7:45–8:75 Hours, $1,100
            [8.75, 9.75, 1230],  # 8:45–9:75 Hours, $1,230
            [9.75, 10.75, 1360]  # 9:45–10:75 Hours, $1,360
        ]
        
        # Check 10-hour travel time limit
        if travel_hours > 10:
            return 0  # Let's Get Moving doesn't do moves with more than 10 hours travel time
        
        # Find the appropriate fuel charge based on travel time
        for min_hours, max_hours, charge in fuel_charge_table:
            if travel_hours >= min_hours and travel_hours < max_hours:
                print(f"[LGM NEW MODEL] Fuel charge for long distance: {travel_hours:.2f}h = ${charge}")
                return charge
        
        # If travel time is less than 1.75 hours, no fuel charge
        return 0
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost - TRUE LGM RATES"""
        rates = {"piano": 250, "safe": 300, "treadmill": 100}
        total = 0
        for item, count in heavy_items.items():
            if item in rates:
                total += rates[item] * count
        return total
    
    def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
        """Calculate additional services cost - TRUE LGM RATES"""
        # Additional services rates from LGM documentation
        rates = {
            "packing": 110.0,
            "storage": 200.0, 
            "cleaning": 396.0,
            "junk": 150.0
        }
        
        total = 0.0
        for service, requested in services.items():
            if requested and service in rates:
                total += rates[service]
                print(f"Additional service {service}: ${rates[service]}")
        
        return total
    
    def get_dispatcher_info(self, origin_address: str, destination_address: str, move_date: str) -> Optional[Dict[str, Any]]:
        """Get dispatcher info from Google Sheets data"""
        try:
            # Get all dispatchers from cache
            all_dispatchers = {}
            gids = google_sheets_service._load_gids_from_file()
            
            for gid in gids:
                cached_data = dispatcher_cache_service.get_dispatcher_data(gid, None)
                if cached_data:
                    all_dispatchers[gid] = cached_data
            
            if not all_dispatchers:
                return None
            
            best_dispatcher = None
            min_total_distance = float('inf')
            
            # Parse move_date as MM-DD
            try:
                move_dt = datetime.fromisoformat(move_date)
            except Exception:
                move_dt = datetime.strptime(move_date, "%Y-%m-%d")
            
            # Check for available dates
            for offset in range(0, 30):
                check_date = move_dt + timedelta(days=offset)
                date_key = check_date.strftime("%Y-%m-%d")  # Use YYYY-MM-DD format to match smart parser
                
                for gid, dispatcher_data in all_dispatchers.items():
                    calendar_data = dispatcher_data.get('calendar_data', {})
                    daily_rates = calendar_data.get('daily_rates', {})
                    
                    if date_key not in daily_rates:
                        continue
                    
                    location_details = dispatcher_data.get('location_details', {})
                    dispatcher_address = location_details.get('address', '')
                    
                    if not dispatcher_address:
                        dispatcher_address = dispatcher_data.get('address', '')
                    
                    if not dispatcher_address:
                        continue
                    
                    try:
                        # Use proper distance calculation from GeographicVendorDispatcher
                        from app.services.vendor_engine import GeographicVendorDispatcher
                        
                        disp_to_origin = GeographicVendorDispatcher._fallback_distance_calculation(dispatcher_address, origin_address)
                        origin_to_dest = GeographicVendorDispatcher._fallback_distance_calculation(origin_address, destination_address)
                        dest_to_disp = GeographicVendorDispatcher._fallback_distance_calculation(destination_address, dispatcher_address)
                        total_distance = disp_to_origin + origin_to_dest + dest_to_disp
                        
                        if total_distance < min_total_distance:
                            min_total_distance = total_distance
                            best_dispatcher = {
                                "gid": gid,
                                "name": location_details.get('name', f'Location {gid}'),
                                "address": dispatcher_address,
                                "sales_phone": location_details.get('sales_phone', ''),
                                "email": location_details.get('email', ''),
                                "truck_count": location_details.get('truck_count', ''),
                                "base_rate": daily_rates[date_key],
                                "total_distance_km": total_distance,
                                "calendar_data": calendar_data,
                                "operational_notes": dispatcher_data.get('operational_notes', {})
                            }
                    except Exception as e:
                        print(f"Error calculating dispatcher distance for {gid}: {e}")
                        continue
                
                if best_dispatcher:
                    return best_dispatcher
            
            return best_dispatcher
            
        except Exception as e:
            print(f"Error getting dispatcher info: {e}")
            return None
    
    # NEW METHODS FOR NEW PRICING MODEL (August 2025)
    
    def _calculate_travel_fees(self, origin: str, destination: str, hourly_rate: float, truck_count: int, dispatcher_info: Dict[str, Any] = None) -> float:
        """Calculate travel fees based on NEW tiered pricing model (August 2025)"""
        try:
            # Get dispatcher address from dispatcher_info or use default
            if dispatcher_info and 'address' in dispatcher_info:
                dispatcher_address = dispatcher_info['address']
            else:
                dispatcher_address = "Toronto, ON"  # Default fallback
            
            # Calculate office to origin travel time
            office_to_origin_hours = self._get_travel_time_hours(dispatcher_address, origin)
            
            # Calculate destination to office travel time  
            dest_to_office_hours = self._get_travel_time_hours(destination, dispatcher_address)
            
            # Total travel time (office → origin + destination → office)
            total_travel_hours = office_to_origin_hours + dest_to_office_hours
            
            print(f"[LGM NEW MODEL] Office→Origin: {office_to_origin_hours:.2f}h, Dest→Office: {dest_to_office_hours:.2f}h, Total: {total_travel_hours:.2f}h")
            
            # Apply new tiered pricing (EXACT EMAIL REQUIREMENTS - 7 tiers)
            if total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_1_max"]:  # 0-14 minutes
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["0-14_min"] * truck_count
                print(f"[LGM NEW MODEL] Tier 1 (0-14min): 15 min flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            elif total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_2_max"]:  # 15-29 minutes
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["15-29_min"] * truck_count
                print(f"[LGM NEW MODEL] Tier 2 (15-29min): 30 min flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            elif total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_3_max"]:  # 30-44 minutes
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["30-44_min"] * truck_count
                print(f"[LGM NEW MODEL] Tier 3 (30-44min): 45 min flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            elif total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_4_max"]:  # 45-59 minutes
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["45-59_min"] * truck_count
                print(f"[LGM NEW MODEL] Tier 4 (45-59min): 1 hour flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            elif total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_5_max"]:  # 1:00-1:14
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["1:00-1:14"] * truck_count
                print(f"[LGM NEW MODEL] Tier 5 (1:00-1:14): 1h 15min flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            elif total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_6_max"]:  # 1:15-1:29
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["1:15-1:29"] * truck_count
                print(f"[LGM NEW MODEL] Tier 6 (1:15-1:29): 1h 30min flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            elif total_travel_hours <= self.TRAVEL_FEE_THRESHOLDS["tier_7_max"]:  # 1:30-1:44
                travel_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["1:30-1:44"] * truck_count
                print(f"[LGM NEW MODEL] Tier 7 (1:30-1:44): 1h 45min flat × ${hourly_rate} × {truck_count} trucks = ${travel_fee}")
                return travel_fee
            else:
                # Long distance: $4.50 per mile per truck (over 1:44)
                total_miles = self._calculate_total_miles(origin, destination, dispatcher_info)
                travel_fee = total_miles * self.TRAVEL_FEE_THRESHOLDS["long_distance_rate"] * truck_count
                print(f"[LGM NEW MODEL] Long distance (>1:44): {total_miles} miles × $4.50 × {truck_count} trucks = ${travel_fee}")
                return travel_fee
                
        except Exception as e:
            print(f"[LGM NEW MODEL] Error calculating travel fees: {e}")
            # Fallback to old method
            return hourly_rate * 1.0 * truck_count
    
    def _calculate_origin_to_destination_travel(self, origin: str, destination: str) -> float:
        """Calculate travel time ONLY from origin to destination (for job time billing)"""
        try:
            # Only calculate origin to destination (not office travel)
            directions = mapbox_service.get_directions(origin, destination)
            if directions and 'duration' in directions:
                travel_hours = directions['duration'] / 3600
                # Apply truck factor for commercial trucks
                TRUCK_FACTOR = 1.3
                truck_travel_hours = travel_hours * TRUCK_FACTOR
                print(f"[LGM NEW MODEL] Origin→Destination: {travel_hours:.2f}h car, {truck_travel_hours:.2f}h truck")
                return truck_travel_hours
            return 0.0
        except Exception as e:
            print(f"[LGM NEW MODEL] Error calculating origin to destination travel: {e}")
            return 0.0
    
    def _get_travel_time_hours(self, origin: str, destination: str) -> float:
        """Get travel time in hours between two addresses"""
        try:
            directions = mapbox_service.get_directions(origin, destination)
            if directions and 'duration' in directions:
                return directions['duration'] / 3600
            return 0.0
        except Exception as e:
            print(f"[LGM NEW MODEL] Error getting travel time: {e}")
            return 0.0
    
    def _calculate_total_miles(self, origin: str, destination: str, dispatcher_info: Dict[str, Any] = None) -> float:
        """Calculate total miles for long distance pricing"""
        try:
            # Get dispatcher address from dispatcher_info or use default
            if dispatcher_info and 'address' in dispatcher_info:
                dispatcher_address = dispatcher_info['address']
            else:
                dispatcher_address = "Toronto, ON"  # Default fallback
            
            # Calculate office to origin miles
            office_to_origin = mapbox_service.get_directions(dispatcher_address, origin)
            dest_to_office = mapbox_service.get_directions(destination, dispatcher_address)
            
            total_miles = 0
            if office_to_origin and 'distance' in office_to_origin:
                total_miles += office_to_origin['distance'] / 1609.34  # Convert meters to miles
            if dest_to_office and 'distance' in dest_to_office:
                total_miles += dest_to_office['distance'] / 1609.34  # Convert meters to miles
            
            print(f"[LGM NEW MODEL] Total travel miles: {total_miles:.1f}")
            return total_miles
        except Exception as e:
            print(f"[LGM NEW MODEL] Error calculating total miles: {e}")
            return 25.0  # Default fallback
    
    def _validate_travel_fee_calculation(self, origin: str, destination: str, travel_fees: float, hourly_rate: float, truck_count: int, dispatcher_info: Dict[str, Any] = None) -> bool:
        """Validate travel fee calculation meets new requirements"""
        try:
            # Get dispatcher address from dispatcher_info or use default
            if dispatcher_info and 'address' in dispatcher_info:
                dispatcher_address = dispatcher_info['address']
            else:
                dispatcher_address = "Toronto, ON"  # Default fallback
            
            # Calculate total travel time
            office_to_origin = self._get_travel_time_hours(dispatcher_address, origin)
            dest_to_office = self._get_travel_time_hours(destination, dispatcher_address)
            total_travel = office_to_origin + dest_to_office
            
            # Validate against thresholds (EXACT EMAIL REQUIREMENTS - 7 tiers)
            if total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_1_max"]:  # 0-14 minutes
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["0-14_min"] * truck_count
            elif total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_2_max"]:  # 15-29 minutes
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["15-29_min"] * truck_count
            elif total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_3_max"]:  # 30-44 minutes
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["30-44_min"] * truck_count
            elif total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_4_max"]:  # 45-59 minutes
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["45-59_min"] * truck_count
            elif total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_5_max"]:  # 1:00-1:14
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["1:00-1:14"] * truck_count
            elif total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_6_max"]:  # 1:15-1:29
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["1:15-1:29"] * truck_count
            elif total_travel <= self.TRAVEL_FEE_THRESHOLDS["tier_7_max"]:  # 1:30-1:44
                expected_fee = hourly_rate * self.TIME_BASED_FLAT_FEES["1:30-1:44"] * truck_count
            else:
                # Long distance - validate mileage calculation
                total_miles = self._calculate_total_miles(origin, destination, dispatcher_info)
                expected_fee = total_miles * self.TRAVEL_FEE_THRESHOLDS["long_distance_rate"] * truck_count
            
            # Allow small tolerance for floating point precision
            tolerance = 0.01
            is_valid = abs(travel_fees - expected_fee) <= tolerance
            
            print(f"[LGM NEW MODEL] Validation: Expected ${expected_fee:.2f}, Actual ${travel_fees:.2f}, Valid: {is_valid}")
            return is_valid
            
        except Exception as e:
            print(f"[LGM NEW MODEL] Error validating travel fee calculation: {e}")
            return False 