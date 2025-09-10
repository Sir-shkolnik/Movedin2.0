from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.schemas.quote import QuoteRequest
from app.services.mapbox_service import mapbox_service
from app.services.google_sheets_service import google_sheets_service
from app.services.dispatcher_cache_service import dispatcher_cache_service

class LetsGetMovingCalculator:
    """Let's Get Moving - Dynamic Calendar-Based Pricing with Google Sheets Integration"""
    
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
        """Get base crew size based on room count - TRUE LGM LOGIC from old app data"""
        # Official LGM crew logic from old app data:
        # 7+ rooms → 5 movers, 5-6 rooms → 4 movers, 4 rooms → 3 movers, <4 rooms → 2 movers
        if room_count >= 7:
            return 5  # 5+ movers for very large homes
        elif room_count >= 5:
            return 4  # 4 movers for 5-6 bedroom homes
        elif room_count >= 4:
            return 3  # 3 movers for 4 bedroom homes
        else:
            return 2  # 2 movers for smaller homes
    
    def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
        """Truck count based on crew size and room count - TRUE LGM LOGIC from old app data"""
        # Official LGM truck logic from old app data:
        # 5+ movers OR 6+ rooms → 2 trucks
        # 4+ movers OR 5+ rooms → 2 trucks
        # Otherwise → 1 truck
        if crew_size >= 5 or quote_request.total_rooms >= 6:
            return 2  # 2 trucks for 5+ movers or 6+ bedrooms
        elif crew_size >= 4 or quote_request.total_rooms >= 5:
            return 2  # 2 trucks for 4+ movers or 5+ bedrooms
        else:
            return 1  # 1 truck for smaller moves
    
    def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db=None) -> Dict[str, Any]:
        """Calculate LGM quote with TRUE dynamic calendar-based pricing"""
        try:
            # Validate input parameters
            if not quote_request or not dispatcher_info:
                raise ValueError("Invalid quote_request or dispatcher_info provided")
            
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
            
            # Calculate travel time (3-leg journey) using actual dispatcher
            dispatcher_address = dispatcher_info.get('address', 'Toronto, ON, Canada')
            travel_hours = self._calculate_travel_time(quote_request.origin_address, quote_request.destination_address, dispatcher_address)
            
            # Check 10-hour travel time limit - Let's Get Moving doesn't do these moves
            if travel_hours > 10:
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
                    "travel_time_hours": travel_hours,
                    "hourly_rate": 0.0,
                    "available_slots": [],
                    "rating": 4.8,
                    "reviews": 1247,
                    "special_notes": f"Travel time {travel_hours:.1f} hours exceeds 10-hour limit",
                    "premium_available": None,
                    "premium_rate": None
                }
            
            # Calculate total billable hours (labor + travel) - TRUE LGM LOGIC
            total_billable_hours = labor_hours + travel_hours
            
            # MINIMUM 2 HOURS LABOR COST - TRUE LGM REQUIREMENT
            # Apply minimum to total billable hours, not just labor hours
            original_billable_hours = total_billable_hours
            total_billable_hours = max(total_billable_hours, 2.0)
            print(f"Minimum 2-hour logic: {original_billable_hours:.2f} -> {total_billable_hours:.2f} hours")
            
            # Calculate costs
            labor_cost = hourly_rate * total_billable_hours  # Include travel time in billable hours
            print(f"Labor cost calculation: ${hourly_rate:.2f} × {total_billable_hours:.2f} hours = ${labor_cost:.2f}")
            fuel_cost = self._calculate_fuel_charge(travel_hours)  # TRUE LGM fuel table
            heavy_items_cost = self._calculate_heavy_items_cost(quote_request.heavy_items)
            additional_services_cost = self._calculate_additional_services_cost(quote_request.additional_services)
            
            total_cost = labor_cost + fuel_cost + heavy_items_cost + additional_services_cost
        
        return {
            "vendor_name": "Let's Get Moving",
            "vendor_slug": "lets-get-moving",
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
            "special_notes": "Most popular choice",
            "premium_available": None,
            "premium_rate": None
        }
        
        except Exception as e:
            print(f"Error calculating LGM quote: {e}")
            # Return a fallback quote with error information
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
                "special_notes": f"Error calculating quote: {str(e)}",
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
        """Estimate labor hours based on room count - TRUE LGM LOGIC from old app data"""
        # Base hours from old app data (NO crew efficiency adjustments in original)
        base_hours = {
            1: 3.5, 2: 4.5, 3: 5.5, 4: 6.5, 5: 7.5, 6: 8.5, 7: 9.5
        }.get(room_count, 9.5)
        
        # ENHANCED: Apply 1.3x multiplier for 4+ rooms due to increased complexity
        # Larger homes require more coordination, quality control, and careful handling
        if room_count >= 4:
            base_hours = base_hours * 1.3
            print(f"LGM 4+ rooms complexity multiplier: {room_count} rooms × 1.3 = {base_hours:.2f} hours")
        
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
        """Calculate fuel charge based on travel time - TRUE LGM FUEL TABLE STARTING FROM 1:45 HOURS"""
        # Official Let's Get Moving fuel charge table based on round-trip travel time
        # Starting from 1:45 hours (1.75 hours) as specified
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
                print(f"Fuel charge: {travel_hours:.2f} hours = ${charge} (range {min_hours}-{max_hours})")
                return charge
        
        # If travel time is less than 1.75 hours, no fuel charge
        if travel_hours < 1.75:
            print(f"No fuel charge: {travel_hours:.2f} hours < 1.75 hours minimum")
            return 0
        
        # Fallback - should not happen with proper table
        print(f"Fuel charge fallback: {travel_hours:.2f} hours = $0")
        return 0
    
    def _calculate_heavy_items_cost(self, heavy_items: Dict[str, int]) -> float:
        """Calculate heavy items cost - Let's Get Moving specific rates"""
        # Let's Get Moving has standard rates for heavy items
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
                        # Use proper distance calculation with Mapbox API
                        from app.services.vendor_engine import GeographicVendorDispatcher
                        
                        # Use Mapbox API for accurate distance calculation
                        disp_to_origin = GeographicVendorDispatcher._calculate_distance_km(dispatcher_address, origin_address)
                        origin_to_dest = GeographicVendorDispatcher._calculate_distance_km(origin_address, destination_address)
                        dest_to_disp = GeographicVendorDispatcher._calculate_distance_km(destination_address, dispatcher_address)
                        total_distance = disp_to_origin + origin_to_dest + dest_to_disp
                        print(f"LGM Mapbox distances: {dispatcher_address}→{origin_address}: {disp_to_origin:.1f}km, {origin_address}→{destination_address}: {origin_to_dest:.1f}km, {destination_address}→{dispatcher_address}: {dest_to_disp:.1f}km")
                        
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