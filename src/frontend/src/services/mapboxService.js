/**
 * Mapbox Service
 * Wrapper for Mapbox Geocoding and Directions APIs
 */

import { MAPBOX_TOKEN, TRUCK_FACTOR } from './utils/constants.js';

class MapboxService {
  constructor() {
    this.accessToken = MAPBOX_TOKEN;
    this.baseUrl = 'https://api.mapbox.com';
    this.timeout = 10000; // 10 seconds
    
    // Cache for geocoding results (1 hour TTL)
    this.geocodingCache = {};
    this.cacheTTL = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  /**
   * Geocode address to coordinates
   * @param {string} address - Address to geocode
   * @returns {Promise<Array<number>>} - [lng, lat] coordinates
   */
  async geocodeAddress(address) {
    // Check cache first
    const cacheKey = `geocode:${address.toLowerCase().trim()}`;
    const cached = this.geocodingCache[cacheKey];
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log(`🗺️ Cache hit for geocoding: ${address}`);
      return cached.coordinates;
    }
    
    console.log(`🗺️ Geocoding: ${address}`);
    
    try {
      const url = `${this.baseUrl}/search/geocode/v6/forward?q=${encodeURIComponent(address)}&country=CA&access_token=${this.accessToken}`;
      
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(this.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('No geocoding results found');
      }
      
      const coordinates = data.features[0].geometry.coordinates;
      
      // Cache result
      this.geocodingCache[cacheKey] = {
        coordinates,
        timestamp: Date.now()
      };
      
      console.log(`✅ Geocoded: ${address} → [${coordinates[0]}, ${coordinates[1]}]`);
      
      return coordinates;
      
    } catch (error) {
      console.error(`❌ Geocoding error for "${address}":`, error);
      throw error;
    }
  }

  /**
   * Get directions between two addresses
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @param {string} profile - Routing profile (default: 'driving-traffic')
   * @returns {Promise<Object>} - { distance: number, duration: number, coordinates: Array }
   */
  async getDirections(origin, destination, profile = 'driving-traffic') {
    console.log(`🗺️ Getting directions: ${origin} → ${destination}`);
    
    try {
      // Geocode both addresses
      const originCoords = await this.geocodeAddress(origin);
      const destCoords = await this.geocodeAddress(destination);
      
      // Build directions URL
      const originStr = `${originCoords[0]},${originCoords[1]}`;
      const destStr = `${destCoords[0]},${destCoords[1]}`;
      
      const url = `${this.baseUrl}/directions/v5/mapbox/${profile}/${originStr};${destStr}?geometries=geojson&access_token=${this.accessToken}`;
      
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(this.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`Directions API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }
      
      const route = data.routes[0];
      const leg = route.legs[0];
      
      const result = {
        distance: leg.distance,      // meters
        duration: leg.duration,      // seconds
        coordinates: route.geometry.coordinates
      };
      
      console.log(`✅ Directions: ${(result.distance / 1000).toFixed(1)} km, ${(result.duration / 60).toFixed(0)} min`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Directions error: ${origin} → ${destination}`, error);
      throw error;
    }
  }

  /**
   * Get travel time in hours between two addresses
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @returns {Promise<number>} - Travel time in hours
   */
  async getTravelTimeHours(origin, destination) {
    try {
      const directions = await this.getDirections(origin, destination);
      return directions.duration / 3600; // Convert seconds to hours
    } catch (error) {
      console.error('Error getting travel time:', error);
      throw error;
    }
  }

  /**
   * Calculate 3-leg journey: Dispatcher → Origin → Destination → Dispatcher
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @param {string} dispatcherAddress - Dispatcher office address
   * @returns {Promise<number>} - Total travel time in hours
   */
  async calculate3LegJourney(origin, destination, dispatcherAddress) {
    console.log(`🗺️ Calculating 3-leg journey: ${dispatcherAddress} → ${origin} → ${destination} → ${dispatcherAddress}`);
    
    try {
      // Leg 1: Dispatcher to Origin
      const leg1 = await this.getDirections(dispatcherAddress, origin);
      
      // Leg 2: Origin to Destination
      const leg2 = await this.getDirections(origin, destination);
      
      // Leg 3: Destination to Dispatcher
      const leg3 = await this.getDirections(destination, dispatcherAddress);
      
      const totalDuration = leg1.duration + leg2.duration + leg3.duration;
      const totalHours = totalDuration / 3600;
      
      console.log(`✅ 3-leg journey: ${totalHours.toFixed(2)} hours`);
      
      return totalHours;
      
    } catch (error) {
      console.error('Error calculating 3-leg journey:', error);
      throw error;
    }
  }

  /**
   * Calculate 3-leg journey with truck factor (30% slower)
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @param {string} dispatcherAddress - Dispatcher office address
   * @returns {Promise<number>} - Total travel time in hours (with truck factor)
   */
  async calculate3LegJourneyWithTruckFactor(origin, destination, dispatcherAddress) {
    const carTime = await this.calculate3LegJourney(origin, destination, dispatcherAddress);
    const truckTime = carTime * TRUCK_FACTOR;
    
    console.log(`🚛 Truck travel time: ${carTime.toFixed(2)}h car → ${truckTime.toFixed(2)}h truck`);
    
    return truckTime;
  }

  /**
   * Calculate distance in kilometers between two addresses
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @returns {Promise<number>} - Distance in kilometers
   */
  async getDistanceKm(origin, destination) {
    try {
      const directions = await this.getDirections(origin, destination);
      return directions.distance / 1000; // Convert meters to kilometers
    } catch (error) {
      console.error('Error getting distance:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getCacheStats() {
    const now = Date.now();
    let hits = 0;
    let misses = 0;
    
    for (const key in this.geocodingCache) {
      const cached = this.geocodingCache[key];
      if (now - cached.timestamp < this.cacheTTL) {
        hits++;
      } else {
        misses++;
      }
    }
    
    return {
      totalEntries: Object.keys(this.geocodingCache).length,
      hits,
      misses,
      hitRate: hits / (hits + misses) || 0
    };
  }

  /**
   * Clear geocoding cache
   */
  clearCache() {
    this.geocodingCache = {};
    console.log('🗺️ Mapbox cache cleared');
  }
}

// Export singleton instance
export default new MapboxService();

