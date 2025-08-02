import requests
import urllib.parse
import re
from typing import Optional, Tuple, Dict, Any
from app.core.config import settings

class MapboxService:
    """Mapbox API service for geocoding and directions"""
    
    def __init__(self):
        self.access_token = "pk.eyJ1Ijoic3VwcG9ydG1vdmVkaW4iLCJhIjoiY21kZmdxdHh6MGQ2aDJqcHE2YTIwbTFrMiJ9.I1xkq82JXLMlgB02xT8LMw"
        self.base_url = "https://api.mapbox.com"
        self.timeout = 10  # 10 second timeout to prevent hanging
    
    def geocode_address(self, query: str, country: Optional[str] = None) -> list:
        """Geocode an address to get coordinates with enhanced logic for GTA area"""
        # Enhanced parameters for better GTA area results
        params = {
            'access_token': self.access_token,
            'types': 'address,poi,place',
            'limit': '10',  # Get more results to find the best match
            'language': 'en',
            'country': 'CA',  # Prioritize Canada
            'bbox': '-79.8,43.5,-79.0,44.0'  # GTA bounding box (Toronto area)
        }
        
        # Override bbox for specific areas if needed
        if country:
            params['country'] = country
            if country == 'CA':
                # Use GTA bounding box for Canadian addresses
                params['bbox'] = '-79.8,43.5,-79.0,44.0'
        
        url = f"{self.base_url}/geocoding/v5/mapbox.places/{query}.json"
        
        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            return data.get('features', [])
        except (requests.RequestException, requests.Timeout) as e:
            print(f"Mapbox geocoding error: {e}")
            return []
    
    def get_directions(
        self, 
        origin: str, 
        destination: str, 
        profile: str = 'driving'
    ) -> Optional[Dict[str, Any]]:
        """Get directions between two addresses with improved geocoding"""
        try:
            # Use improved geocoding with fallback
            origin_coords = self.get_coordinates_with_fallback(origin)
            dest_coords = self.get_coordinates_with_fallback(destination)
            
            if not origin_coords or not dest_coords:
                print(f"Could not geocode addresses: origin={origin}, destination={destination}")
                return None
            
            # Use coordinates for directions API
            origin_str = f"{origin_coords[0]},{origin_coords[1]}"
            dest_str = f"{dest_coords[0]},{dest_coords[1]}"
            
            params = {
                'access_token': self.access_token,
                'geometries': 'geojson',
                'overview': 'full',
                'steps': 'true',
            }
            
            url = f"{self.base_url}/directions/v5/mapbox/{profile}/{origin_str};{dest_str}"
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            
            if not data.get('routes'):
                return None
            
            route = data['routes'][0]
            leg = route['legs'][0]
            
            return {
                'distance': leg['distance'],  # meters
                'duration': leg['duration'],  # seconds
                'coordinates': route['geometry']['coordinates']
            }
        except Exception as e:
            print(f"Mapbox directions error: {e}")
            return None
    

    
    def get_distance_from_coordinates(
        self, 
        origin: Tuple[float, float], 
        destination: Tuple[float, float], 
        profile: str = 'driving'
    ) -> Optional[Dict[str, float]]:
        """Get distance and duration between coordinates"""
        origin_str = f"{origin[0]},{origin[1]}"
        dest_str = f"{destination[0]},{destination[1]}"
        
        params = {
            'access_token': self.access_token,
            'geometries': 'geojson',
            'overview': 'false',
        }
        
        url = f"{self.base_url}/directions/v5/mapbox/{profile}/{origin_str};{dest_str}"
        
        try:
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            data = response.json()
            
            if not data.get('routes'):
                return None
            
            leg = data['routes'][0]['legs'][0]
            
            return {
                'distance_km': leg['distance'] / 1000,  # Convert to kilometers
                'duration_hours': leg['duration'] / 3600  # Convert to hours
            }
        except (requests.RequestException, requests.Timeout) as e:
            print(f"Mapbox coordinates error: {e}")
            return None
    
    def validate_address(self, address: str) -> bool:
        """Validate if an address exists"""
        features = self.geocode_address(address)
        return len(features) > 0
    
    def normalize_address(self, address: str) -> str:
        """Normalize address for better geocoding results"""
        # Common address corrections for GTA area
        corrections = {
            'L6C 3L7, Markham, Ontario, Canada': 'Markham, Ontario, Canada',
            'L6C 3L7, Markham, ON, Canada': 'Markham, Ontario, Canada',
            'M9B 0A5, Etobicoke, Ontario, Canada': 'Etobicoke, Ontario, Canada',
            'M9B 0A5, Etobicoke, ON, Canada': 'Etobicoke, Ontario, Canada'
        }
        
        # Check for exact matches first
        if address in corrections:
            return corrections[address]
        
        # Handle postal code + city format
        if re.match(r'[A-Z]\d[A-Z]\s+\d[A-Z]\d,\s*[A-Za-z\s]+,\s*(?:ON|Ontario),\s*Canada', address):
            # Extract city name from address
            city_match = re.search(r'[A-Z]\d[A-Z]\s+\d[A-Z]\d,\s*([A-Za-z\s]+),\s*(?:ON|Ontario)', address)
            if city_match:
                city = city_match.group(1).strip()
                return f"{city}, Ontario, Canada"
        
        return address
    
    def get_coordinates_with_fallback(self, address: str) -> Optional[Tuple[float, float]]:
        """Get coordinates with smart fallback logic"""
        # First try with original address
        coords = self.get_coordinates(address)
        if coords:
            return coords
        
        # Try with normalized address
        normalized_address = self.normalize_address(address)
        if normalized_address != address:
            print(f"Trying normalized address: {normalized_address}")
            coords = self.get_coordinates(normalized_address)
            if coords:
                return coords
        
        # Try with just the city name
        city_match = re.search(r'([A-Za-z\s]+),\s*(?:ON|Ontario)', address)
        if city_match:
            city = city_match.group(1).strip()
            print(f"Trying city-only: {city}")
            coords = self.get_coordinates(f"{city}, Ontario, Canada")
            if coords:
                return coords
        
        return None
    
    def get_coordinates(self, address: str) -> Optional[Tuple[float, float]]:
        """Get coordinates for an address with smart GTA-aware geocoding logic"""
        features = self.geocode_address(address)
        if not features:
            print(f"No geocoding results for: {address}")
            return None
        
        # Smart scoring system for GTA area
        best_feature = None
        best_score = -1
        
        address_lower = address.lower()
        
        # GTA priority cities with their coordinates for validation
        gta_cities = {
            'markham': {'lat': 43.906779, 'lng': -79.262931, 'priority': 10},
            'toronto': {'lat': 43.6532, 'lng': -79.3832, 'priority': 10},
            'mississauga': {'lat': 43.5890, 'lng': -79.6441, 'priority': 10},
            'brampton': {'lat': 43.6832, 'lng': -79.7629, 'priority': 10},
            'vaughan': {'lat': 43.8361, 'lng': -79.4987, 'priority': 10},
            'etobicoke': {'lat': 43.6205, 'lng': -79.5132, 'priority': 10},
            'scarborough': {'lat': 43.7764, 'lng': -79.2318, 'priority': 10},
            'north york': {'lat': 43.7615, 'lng': -79.4111, 'priority': 10},
            'oakville': {'lat': 43.4675, 'lng': -79.6877, 'priority': 9},
            'burlington': {'lat': 43.3255, 'lng': -79.7990, 'priority': 9},
            'hamilton': {'lat': 43.2557, 'lng': -79.8711, 'priority': 9},
            'ajax': {'lat': 43.8509, 'lng': -79.0205, 'priority': 9},
            'pickering': {'lat': 43.8384, 'lng': -79.0868, 'priority': 9},
            'richmond hill': {'lat': 43.8828, 'lng': -79.4403, 'priority': 9}
        }
        
        for feature in features:
            score = 0
            place_name = feature.get('place_name', '').lower()
            center = feature.get('center', [])
            
            if len(center) != 2:
                continue
            
            lng, lat = center
            
            # Score based on city name matching
            for city, city_data in gta_cities.items():
                if city in place_name and city in address_lower:
                    score += city_data['priority']
                    
                    # Bonus for coordinate proximity to expected city location
                    expected_lat, expected_lng = city_data['lat'], city_data['lng']
                    distance = ((lat - expected_lat) ** 2 + (lng - expected_lng) ** 2) ** 0.5
                    if distance < 0.1:  # Within ~10km
                        score += 5
                    elif distance < 0.5:  # Within ~50km
                        score += 2
            
            # Penalty for non-GTA cities that might be confused
            non_gta_cities = ['nepean', 'ottawa', 'kingston', 'london', 'windsor', 'sarnia']
            for non_gta_city in non_gta_cities:
                if non_gta_city in place_name:
                    score -= 10
            
            # Bonus for postal code matching (if present)
            if 'L6C' in address and 'L6C' in place_name:
                score += 3
            if 'M9B' in address and 'M9B' in place_name:
                score += 3
            
            # Bonus for exact address matching
            if address_lower in place_name or place_name in address_lower:
                score += 5
            
            # Bonus for being in Ontario
            if 'ontario' in place_name:
                score += 2
            
            # Penalty for being outside GTA area (roughly)
            if lat < 43.0 or lat > 44.5 or lng < -80.0 or lng > -78.5:
                score -= 5
            
            if score > best_score:
                best_score = score
                best_feature = feature
        
        if best_feature:
            print(f"Smart geocoding for '{address}' -> '{best_feature['place_name']}' (score: {best_score})")
            return tuple(best_feature['center'])
        
        # Fallback to first result if no good match found
        print(f"Fallback geocoding for '{address}' -> '{features[0]['place_name']}'")
        return tuple(features[0]['center'])

    def calculate_3leg_journey_time(
        self, 
        dispatcher_address: str, 
        origin: str, 
        destination: str
    ) -> Optional[Dict[str, float]]:
        """Calculate 3-leg journey time: Dispatcher -> Origin -> Destination -> Dispatcher"""
        try:
            # Get coordinates for all three points
            dispatcher_coords = self.get_coordinates_with_fallback(dispatcher_address)
            origin_coords = self.get_coordinates_with_fallback(origin)
            dest_coords = self.get_coordinates_with_fallback(destination)
            
            if not all([dispatcher_coords, origin_coords, dest_coords]):
                print(f"Could not geocode all addresses for 3-leg journey")
                return None
            
            # Calculate individual legs
            disp_to_origin = self.get_distance_from_coordinates(dispatcher_coords, origin_coords)
            origin_to_dest = self.get_distance_from_coordinates(origin_coords, dest_coords)
            dest_to_disp = self.get_distance_from_coordinates(dest_coords, dispatcher_coords)
            
            if not all([disp_to_origin, origin_to_dest, dest_to_disp]):
                print(f"Could not calculate all legs for 3-leg journey")
                return None
            
            # Sum up the journey
            total_distance = disp_to_origin['distance_km'] + origin_to_dest['distance_km'] + dest_to_disp['distance_km']
            total_time = disp_to_origin['duration_hours'] + origin_to_dest['duration_hours'] + dest_to_disp['duration_hours']
            
            print(f"3-leg journey calculation:")
            print(f"  Dispatcher -> Origin: {disp_to_origin['distance_km']:.1f}km, {disp_to_origin['duration_hours']:.1f}h")
            print(f"  Origin -> Destination: {origin_to_dest['distance_km']:.1f}km, {origin_to_dest['duration_hours']:.1f}h")
            print(f"  Destination -> Dispatcher: {dest_to_disp['distance_km']:.1f}km, {dest_to_disp['duration_hours']:.1f}h")
            print(f"  Total: {total_distance:.1f}km, {total_time:.1f}h")
            
            return {
                'total_distance_km': total_distance,
                'total_time_hours': total_time,
                'disp_to_origin_km': disp_to_origin['distance_km'],
                'origin_to_dest_km': origin_to_dest['distance_km'],
                'dest_to_disp_km': dest_to_disp['distance_km'],
                'disp_to_origin_hours': disp_to_origin['duration_hours'],
                'origin_to_dest_hours': origin_to_dest['duration_hours'],
                'dest_to_disp_hours': dest_to_disp['duration_hours']
            }
            
        except Exception as e:
            print(f"Error calculating 3-leg journey: {e}")
        return None
    
    def validate_gta_coordinates(self, lat: float, lng: float) -> bool:
        """Validate if coordinates are within GTA area"""
        # GTA bounding box (roughly)
        gta_bounds = {
            'min_lat': 43.0,
            'max_lat': 44.5,
            'min_lng': -80.0,
            'max_lng': -78.5
        }
        
        return (gta_bounds['min_lat'] <= lat <= gta_bounds['max_lat'] and 
                gta_bounds['min_lng'] <= lng <= gta_bounds['max_lng'])

# Global instance
mapbox_service = MapboxService() 