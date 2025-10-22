/**
 * Validation Utilities
 * Input validation and service area checking
 */

import { VENDOR_SERVICE_AREAS } from './constants.js';

/**
 * Extract city from address string
 * @param {string} address - Full address
 * @returns {string|null} - City name or null
 */
export function extractCityFromAddress(address) {
  if (!address) return null;
  
  // Common Canadian cities
  const cities = [
    'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York',
    'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill',
    'Oakville', 'Burlington', 'Hamilton', 'Oshawa', 'Whitby', 'Ajax', 'Pickering',
    'Barrie', 'Aurora', 'Brantford', 'Kitchener', 'Waterloo', 'Windsor', 'Peterborough',
    'Vancouver', 'Burnaby', 'Richmond', 'Victoria', 'Abbotsford', 'Port Moody',
    'Calgary', 'Edmonton',
    'Winnipeg',
    'Regina',
    'Montreal',
    'Halifax',
    'Fredericton'
  ];
  
  // Check if address contains any city name
  for (const city of cities) {
    if (address.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }
  
  return null;
}

/**
 * Check if vendor serves the given location
 * @param {string} vendorSlug - Vendor identifier
 * @param {string} address - Address to check
 * @returns {boolean} - True if vendor serves this location
 */
export function isLocationInServiceArea(vendorSlug, address) {
  const serviceArea = VENDOR_SERVICE_AREAS[vendorSlug];
  if (!serviceArea) return false;
  
  const city = extractCityFromAddress(address);
  if (!city) return false;
  
  return serviceArea.cities.includes(city);
}

/**
 * Check if both origin and destination are in vendor's service area
 * @param {string} vendorSlug - Vendor identifier
 * @param {string} originAddress - Origin address
 * @param {string} destinationAddress - Destination address
 * @returns {boolean} - True if both locations are in service area
 */
export function validateServiceArea(vendorSlug, originAddress, destinationAddress) {
  return isLocationInServiceArea(vendorSlug, originAddress) &&
         isLocationInServiceArea(vendorSlug, destinationAddress);
}

/**
 * Calculate distance in kilometers between two addresses
 * @param {Array<number>} coords1 - [lng, lat] for origin
 * @param {Array<number>} coords2 - [lng, lat] for destination
 * @returns {number} - Distance in kilometers
 */
export function calculateDistanceKm(coords1, coords2) {
  const [lng1, lat1] = coords1;
  const [lng2, lat2] = coords2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Check if distance exceeds vendor's maximum service distance
 * @param {string} vendorSlug - Vendor identifier
 * @param {Array<number>} originCoords - [lng, lat] for origin
 * @param {Array<number>} destCoords - [lng, lat] for destination
 * @returns {boolean} - True if within service distance
 */
export function isWithinServiceDistance(vendorSlug, originCoords, destCoords) {
  const serviceArea = VENDOR_SERVICE_AREAS[vendorSlug];
  if (!serviceArea) return false;
  
  const distance = calculateDistanceKm(originCoords, destCoords);
  return distance <= serviceArea.maxDistanceKm;
}

/**
 * Validate quote request has all required fields
 * @param {Object} quoteRequest - Quote request object
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateQuoteRequest(quoteRequest) {
  const errors = [];
  
  if (!quoteRequest.origin_address) {
    errors.push('Origin address is required');
  }
  
  if (!quoteRequest.destination_address) {
    errors.push('Destination address is required');
  }
  
  if (!quoteRequest.move_date) {
    errors.push('Move date is required');
  }
  
  if (!quoteRequest.move_time) {
    errors.push('Move time is required');
  }
  
  // Room count is required for personal moves (not commercial)
  if (quoteRequest.home_type !== 'commercial') {
    if (!quoteRequest.total_rooms || quoteRequest.total_rooms < 1) {
      errors.push('Valid room count is required');
    }
  }
  
  // Square footage is required for commercial moves
  if (quoteRequest.home_type === 'commercial') {
    if (!quoteRequest.square_footage) {
      errors.push('Square footage is required for commercial moves');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if move is long distance (>10 hours one-way)
 * @param {number} travelHours - One-way travel time in hours
 * @returns {boolean} - True if long distance move
 */
export function isLongDistanceMove(travelHours) {
  return travelHours > 10;
}

/**
 * Find closest dispatcher to origin address
 * @param {Array<number>} originCoords - [lng, lat] for origin
 * @param {Object} dispatcherLocations - Object of dispatcher locations
 * @returns {Object} - Closest dispatcher info
 */
export function findClosestDispatcher(originCoords, dispatcherLocations) {
  let closestDispatcher = null;
  let minDistance = Infinity;
  
  for (const [key, location] of Object.entries(dispatcherLocations)) {
    const distance = calculateDistanceKm(originCoords, location.coordinates);
    if (distance < minDistance) {
      minDistance = distance;
      closestDispatcher = location;
    }
  }
  
  return closestDispatcher;
}



