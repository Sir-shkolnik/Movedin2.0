/**
 * Common Calculation Utilities
 * Shared calculation logic used across all vendor calculators
 */

import { 
  MINIMUM_LABOR_HOURS, 
  STAIR_TIME_PER_FLIGHT, 
  ELEVATOR_TIME,
  HEAVY_ITEM_RATES,
  ADDITIONAL_SERVICES 
} from './constants.js';

/**
 * Calculate base labor hours by room count
 * @param {number} roomCount - Number of rooms
 * @returns {number} - Base labor hours
 */
export function getBaseLaborHours(roomCount) {
  const baseHours = {
    1: 3.5,
    2: 4.5,
    3: 5.5,
    4: 6.5,
    5: 7.5,
    6: 8.5,
    7: 9.5
  };
  
  return baseHours[roomCount] || 9.5;
}

/**
 * Calculate stair time (15 minutes per flight)
 * @param {number} pickupStairs - Number of flights at pickup
 * @param {number} dropoffStairs - Number of flights at dropoff
 * @returns {number} - Additional hours for stairs
 */
export function calculateStairTime(pickupStairs, dropoffStairs) {
  const totalStairs = (pickupStairs || 0) + (dropoffStairs || 0);
  return totalStairs * STAIR_TIME_PER_FLIGHT;
}

/**
 * Calculate elevator time (15 minutes per elevator)
 * @param {boolean} elevatorPickup - Has elevator at pickup
 * @param {boolean} elevatorDropoff - Has elevator at dropoff
 * @returns {number} - Additional hours for elevators
 */
export function calculateElevatorTime(elevatorPickup, elevatorDropoff) {
  let time = 0;
  if (elevatorPickup) time += ELEVATOR_TIME;
  if (elevatorDropoff) time += ELEVATOR_TIME;
  return time;
}

/**
 * Calculate square footage adjustment
 * Adds 0.5 hours per 400 sqft over 800 sqft
 * @param {string|number} sqft - Square footage
 * @returns {number} - Additional hours for large homes
 */
export function calculateSqftAdjustment(sqft) {
  if (!sqft) return 0;
  
  let sqftNum;
  if (typeof sqft === 'string') {
    // Extract number from string like "1500-2000"
    const match = sqft.match(/\d+/);
    sqftNum = match ? parseInt(match[0]) : 0;
  } else {
    sqftNum = sqft;
  }
  
  if (sqftNum <= 800) return 0;
  
  const extraBlocks = (sqftNum - 800) / 400;
  return Math.max(0, extraBlocks) * 0.5;
}

/**
 * Calculate total labor hours with all adjustments
 * @param {Object} params - Calculation parameters
 * @param {number} params.roomCount - Number of rooms
 * @param {number} params.pickupStairs - Flights of stairs at pickup
 * @param {number} params.dropoffStairs - Flights of stairs at dropoff
 * @param {boolean} params.elevatorPickup - Has elevator at pickup
 * @param {boolean} params.elevatorDropoff - Has elevator at dropoff
 * @param {string|number} params.squareFootage - Square footage
 * @param {number} params.complexityMultiplier - Optional complexity multiplier (e.g., 1.3 for 4+ rooms)
 * @returns {number} - Total labor hours (minimum 2.0)
 */
export function calculateTotalLaborHours({
  roomCount,
  pickupStairs = 0,
  dropoffStairs = 0,
  elevatorPickup = false,
  elevatorDropoff = false,
  squareFootage = null,
  complexityMultiplier = 1.0
}) {
  let hours = getBaseLaborHours(roomCount);
  
  // Apply complexity multiplier (e.g., for 4+ rooms)
  hours *= complexityMultiplier;
  
  // Add stair time
  hours += calculateStairTime(pickupStairs, dropoffStairs);
  
  // Add elevator time
  hours += calculateElevatorTime(elevatorPickup, elevatorDropoff);
  
  // Add square footage adjustment
  hours += calculateSqftAdjustment(squareFootage);
  
  // Enforce minimum
  return Math.max(MINIMUM_LABOR_HOURS, hours);
}

/**
 * Calculate heavy items cost and additional labor time
 * @param {Object} heavyItems - Heavy items object { piano: 1, safe: 0, ... }
 * @param {Object} rates - Heavy item rates (optional, defaults to shared rates)
 * @returns {Object} - { cost: number, laborHours: number }
 */
export function calculateHeavyItemsCost(heavyItems, rates = HEAVY_ITEM_RATES) {
  let cost = 0;
  let laborHours = 0;
  
  // Handle undefined, null, or empty heavyItems
  if (!heavyItems || typeof heavyItems !== 'object') {
    return { cost: 0, laborHours: 0 };
  }
  
  try {
    for (const [item, count] of Object.entries(heavyItems)) {
      // Ensure count is a valid number
      const itemCount = Number(count) || 0;
      if (itemCount > 0 && rates[item]) {
        const itemData = rates[item];
        cost += (itemData.base || 0) * itemCount;
        laborHours += (itemData.labor || 0) * itemCount;
      }
    }
  } catch (error) {
    console.warn('Error calculating heavy items cost:', error);
    return { cost: 0, laborHours: 0 };
  }
  
  // Ensure we return valid numbers
  return { 
    cost: isNaN(cost) ? 0 : cost, 
    laborHours: isNaN(laborHours) ? 0 : laborHours 
  };
}

/**
 * Calculate additional services cost
 * @param {Object} additionalServices - Additional services object { packing: true, ... }
 * @returns {number} - Total cost (usually 0, requires vendor assessment)
 */
export function calculateAdditionalServicesCost(additionalServices) {
  // Additional services typically require vendor assessment
  // Return 0 for base quote, vendor will provide custom pricing
  return 0;
}

/**
 * Calculate heavy items count
 * @param {Object} heavyItems - Heavy items object
 * @returns {number} - Total count of heavy items
 */
export function getHeavyItemsCount(heavyItems) {
  if (!heavyItems) return 0;
  return Object.values(heavyItems).reduce((sum, count) => sum + count, 0);
}

/**
 * Apply 20% markup to total cost
 * @param {number} totalCost - Original total cost
 * @returns {Object} - { original: number, markup: number, final: number }
 */
export function applyMarkup(totalCost) {
  // Validate and sanitize totalCost
  const sanitizedCost = Number(totalCost) || 0;
  
  if (isNaN(sanitizedCost) || sanitizedCost < 0) {
    console.error('Invalid totalCost for markup:', totalCost, 'sanitized:', sanitizedCost);
    throw new Error('Invalid total cost calculated');
  }
  
  const markup = sanitizedCost * 0.20;
  const final = sanitizedCost + markup;
  
  return {
    original: Math.round(sanitizedCost * 100) / 100,
    markup: Math.round(markup * 100) / 100,
    final: Math.round(final * 100) / 100,
    markupPercentage: 20.0
  };
}

/**
 * Round to 2 decimal places
 * @param {number} value - Value to round
 * @returns {number} - Rounded value
 */
export function roundTo2Decimals(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return `$${roundTo2Decimals(amount).toFixed(2)}`;
}

/**
 * Format hours to readable string
 * @param {number} hours - Hours to format
 * @returns {string} - Formatted hours string
 */
export function formatHours(hours) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  return `${wholeHours}h ${minutes}m`;
}

/**
 * Calculate crew size based on room count with heavy items override
 * @param {number} roomCount - Number of rooms
 * @param {number} heavyItemsCount - Number of heavy items
 * @param {Object} crewMapping - Room to crew size mapping
 * @param {number} minCrewWithHeavyItems - Minimum crew when heavy items present
 * @returns {number} - Crew size
 */
export function calculateCrewSize(roomCount, heavyItemsCount, crewMapping, minCrewWithHeavyItems = 3) {
  // Get base crew size from mapping
  let crewSize = crewMapping[roomCount] || crewMapping[roomCount > 7 ? 7 : roomCount];
  
  // Heavy items auto-upgrade crew to minimum
  if (heavyItemsCount > 0) {
    crewSize = Math.max(crewSize, minCrewWithHeavyItems);
  }
  
  return crewSize;
}

/**
 * Calculate truck count based on crew size and room count
 * @param {number} crewSize - Crew size
 * @param {number} roomCount - Number of rooms
 * @param {Object} truckRules - Truck count rules
 * @returns {number} - Truck count
 */
export function calculateTruckCount(crewSize, roomCount, truckRules) {
  // Check crew-based rules
  if (truckRules.crewSizeThreshold && crewSize >= truckRules.crewSizeThreshold) {
    return truckRules.trucksForLargeCrew;
  }
  
  // Check room-based rules
  if (truckRules.roomCountThreshold && roomCount >= truckRules.roomCountThreshold) {
    return truckRules.trucksForLargeRooms;
  }
  
  // Default to 1 truck
  return 1;
}



