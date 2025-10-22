/**
 * Let's Get Moving Calculator
 * Dynamic calendar-based pricing + tiered travel fees (NEW August 2025 Model)
 * Note: Currently using mock base rates. Google Sheets integration to be added.
 */

import mapboxService from '../mapboxService.js';
import { 
  calculateTotalLaborHours,
  calculateHeavyItemsCost,
  calculateAdditionalServicesCost,
  applyMarkup,
  getHeavyItemsCount
} from '../utils/commonCalculations.js';
import { 
  LETS_GET_MOVING_HEAVY_ITEMS,
  LGM_TRAVEL_FEE_THRESHOLDS,
  LGM_DISPATCHER_LOCATIONS,
  MAX_TRAVEL_TIME_HOURS
} from '../utils/constants.js';
import { findClosestDispatcher } from '../utils/validation.js';

class LetsGetMovingCalculator {
  constructor() {
    this.vendorSlug = 'lets-get-moving';
    this.vendorName = "Let's Get Moving";
    
    // Mock base rates (to be replaced with Google Sheets data)
    this.mockBaseRates = {
      'Toronto': 169,
      'Mississauga': 165,
      'Brampton': 160,
      'Vaughan': 167,
      'Markham': 169,
      'Richmond Hill': 168,
      'Oakville': 170,
      'Burlington': 165,
      'Hamilton': 160,
      'Calgary': 175,
      'Edmonton': 175,
      'Vancouver': 180,
      'Montreal': 165
    };
  }

  /**
   * Get base rate for location (mock data - to be replaced with Google Sheets)
   * @param {string} city - City name
   * @returns {number} - Base rate
   */
  getBaseRateForLocation(city) {
    return this.mockBaseRates[city] || this.mockBaseRates['Toronto'];
  }

  /**
   * Get crew size based on room count and heavy items
   * @param {number} roomCount - Number of rooms
   * @param {number} heavyItemsCount - Number of heavy items
   * @returns {number} - Crew size
   */
  getCrewSize(roomCount, heavyItemsCount) {
    // Base crew size by room count
    let crewSize;
    if (roomCount >= 7) crewSize = 5;      // 7+ rooms → 5 movers
    else if (roomCount >= 5) crewSize = 4;  // 5-6 rooms → 4 movers
    else if (roomCount >= 4) crewSize = 3;  // 4 rooms → 3 movers
    else crewSize = 2;                      // <4 rooms → 2 movers
    
    // Heavy items auto-upgrade crew to at least 3
    if (heavyItemsCount > 0) {
      crewSize = Math.max(crewSize, 3);
    }
    
    return crewSize;
  }

  /**
   * Get truck count based on crew size and room count
   * @param {number} crewSize - Crew size
   * @param {number} roomCount - Number of rooms
   * @returns {number} - Truck count
   */
  getTruckCount(crewSize, roomCount) {
    // 5+ movers OR 6+ rooms → 2 trucks
    if (crewSize >= 5 || roomCount >= 6) return 2;
    // 4+ movers OR 5+ rooms → 2 trucks
    if (crewSize >= 4 || roomCount >= 5) return 2;
    // Otherwise → 1 truck
    return 1;
  }

  /**
   * Calculate hourly rate with crew and truck multipliers
   * @param {number} baseRate - Base rate from calendar
   * @param {number} crewSize - Crew size
   * @param {number} truckCount - Truck count
   * @returns {number} - Hourly rate
   */
  calculateHourlyRate(baseRate, crewSize, truckCount) {
    if (truckCount === 1) {
      // 1 Truck scenarios
      if (crewSize === 2) return baseRate;
      if (crewSize === 3) return baseRate + 60;
      if (crewSize === 4) return baseRate + 140;
      return baseRate + 140; // Fallback
    } else if (truckCount === 2) {
      // 2 Truck scenarios
      if (crewSize === 4) return 2 * baseRate + 20;
      if (crewSize === 5) return 2 * baseRate + 80;
      if (crewSize === 6) return 2 * baseRate + 140;
      return 2 * baseRate + 140; // Fallback
    }
    
    return baseRate;
  }

  /**
   * Calculate origin to destination travel time (for job time billing)
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @returns {Promise<number>} - Travel time in hours (with truck factor)
   */
  async calculateOriginToDestinationTravel(origin, destination) {
    try {
      const carTravelTime = await mapboxService.getTravelTimeHours(origin, destination);
      const truckTravelTime = carTravelTime * 1.3; // Truck factor
      
      console.log(`LGM: Origin→Destination ${carTravelTime.toFixed(2)}h car → ${truckTravelTime.toFixed(2)}h truck`);
      
      return truckTravelTime;
    } catch (error) {
      console.error('LGM: Error calculating origin to destination travel:', error);
      return 0.0;
    }
  }

  /**
   * Get travel time between two addresses
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @returns {Promise<number>} - Travel time in hours
   */
  async getTravelTimeHours(origin, destination) {
    try {
      return await mapboxService.getTravelTimeHours(origin, destination);
    } catch (error) {
      console.error('LGM: Error getting travel time:', error);
      return 0.0;
    }
  }

  /**
   * Calculate travel fees based on NEW tiered pricing model (August 2025)
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @param {number} hourlyRate - Hourly rate
   * @param {number} truckCount - Truck count
   * @param {string} dispatcherAddress - Dispatcher office address
   * @returns {Promise<number>} - Travel fees
   */
  async calculateTravelFees(origin, destination, hourlyRate, truckCount, dispatcherAddress) {
    try {
      // Calculate office to origin travel time
      const officeToOrigin = await this.getTravelTimeHours(dispatcherAddress, origin);
      
      // Calculate destination to office travel time
      const destToOffice = await this.getTravelTimeHours(destination, dispatcherAddress);
      
      // Total travel time (office → origin + destination → office)
      const totalTravelHours = officeToOrigin + destToOffice;
      
      console.log(`LGM: Office→Origin ${officeToOrigin.toFixed(2)}h, Dest→Office ${destToOffice.toFixed(2)}h, Total ${totalTravelHours.toFixed(2)}h`);
      
      // Apply UPDATED tiered pricing (Aug 22, 2025) - 15-minute increments
      if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['15_min']) {
        // 0-14 minutes
        return hourlyRate * 0.25 * truckCount;
      } else if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['30_min']) {
        // 15-29 minutes
        return hourlyRate * 0.5 * truckCount;
      } else if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['45_min']) {
        // 30-44 minutes
        return hourlyRate * 0.75 * truckCount;
      } else if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['1_hour']) {
        // 45-59 minutes
        return hourlyRate * 1.0 * truckCount;
      } else if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['1_15']) {
        // 1:00-1:14
        return hourlyRate * 1.25 * truckCount;
      } else if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['1_30']) {
        // 1:15-1:29
        return hourlyRate * 1.5 * truckCount;
      } else if (totalTravelHours <= LGM_TRAVEL_FEE_THRESHOLDS['1_45']) {
        // 1:30-1:44
        return hourlyRate * 1.75 * truckCount;
      } else {
        // Long distance: $5.99 per mile per truck (over 1:44)
        const totalMiles = await this.calculateTotalMiles(origin, destination, dispatcherAddress);
        return totalMiles * LGM_TRAVEL_FEE_THRESHOLDS['long_distance_rate'] * truckCount;
      }
    } catch (error) {
      console.error('LGM: Error calculating travel fees:', error);
      return hourlyRate * 1.0 * truckCount; // Fallback
    }
  }

  /**
   * Calculate total miles for long distance pricing
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @param {string} dispatcherAddress - Dispatcher office address
   * @returns {Promise<number>} - Total miles
   */
  async calculateTotalMiles(origin, destination, dispatcherAddress) {
    try {
      // Calculate office to origin miles
      const officeToOrigin = await mapboxService.getDistanceKm(dispatcherAddress, origin);
      
      // Calculate destination to office miles
      const destToOffice = await mapboxService.getDistanceKm(destination, dispatcherAddress);
      
      const totalMiles = (officeToOrigin + destToOffice) / 1.60934; // Convert km to miles
      
      console.log(`LGM: Total travel miles ${totalMiles.toFixed(1)}`);
      
      return totalMiles;
    } catch (error) {
      console.error('LGM: Error calculating total miles:', error);
      return 25.0; // Default fallback
    }
  }

  /**
   * Calculate fuel charge
   * @param {number} originToDestTravel - Origin to destination travel time in hours
   * @returns {number} - Fuel charge
   */
  calculateFuelCharge(originToDestTravel) {
    // Fuel only for job travel (origin to destination)
    // Estimate: $0.50 per km
    const estimatedKm = originToDestTravel * 50; // Rough estimate
    return estimatedKm * 0.50;
  }

  /**
   * Extract city from address
   * @param {string} address - Full address
   * @returns {string} - City name
   */
  extractCity(address) {
    const cities = ['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill', 
                    'Oakville', 'Burlington', 'Hamilton', 'Calgary', 'Edmonton', 'Vancouver', 'Montreal'];
    
    for (const city of cities) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    
    return 'Toronto'; // Default
  }

  /**
   * Calculate quote
   * @param {Object} quoteRequest - Quote request
   * @returns {Promise<Object>} - Quote result
   */
  async calculateQuote(quoteRequest) {
    console.log('📊 Let\'s Get Moving: Calculating quote...');
    
    try {
      const {
        origin_address,
        destination_address,
        total_rooms,
        square_footage,
        heavy_items = {},
        stairs_at_pickup = 0,
        stairs_at_dropoff = 0,
        elevator_at_pickup = false,
        elevator_at_dropoff = false
      } = quoteRequest;

      // Geocode origin to find closest dispatcher
      const originCoords = await mapboxService.geocodeAddress(origin_address);
      const closestDispatcher = findClosestDispatcher(originCoords, LGM_DISPATCHER_LOCATIONS);
      
      console.log(`LGM: Closest dispatcher is ${closestDispatcher.name} (${closestDispatcher.address})`);

      // Check if this is a long-distance move (>10 hours one-way)
      const oneWayTravelHours = await mapboxService.getTravelTimeHours(origin_address, destination_address);
      console.log(`LGM: One-way travel time: ${oneWayTravelHours.toFixed(2)} hours`);
      
      if (oneWayTravelHours > MAX_TRAVEL_TIME_HOURS) {
        console.log(`LGM: ❌ Long distance move rejected (>${MAX_TRAVEL_TIME_HOURS}h)`);
        return {
          vendor_name: this.vendorName,
          vendor_slug: this.vendorSlug,
          total_cost: 0,
          is_long_distance: true,
          contact_sales: true,
          rejection_reason: `This is a long-distance move (${oneWayTravelHours.toFixed(1)} hours one-way). We don't handle moves over ${MAX_TRAVEL_TIME_HOURS} hours. Please contact our sales team for a custom quote.`,
          special_notes: `Long-distance move - contact sales team`
        };
      }

      // Get base rate for location (mock data)
      const city = this.extractCity(origin_address);
      const baseRate = this.getBaseRateForLocation(city);

      // Calculate crew and truck count
      const heavyItemsCount = getHeavyItemsCount(heavy_items);
      const crewSize = this.getCrewSize(total_rooms, heavyItemsCount);
      const truckCount = this.getTruckCount(crewSize, total_rooms);

      // Calculate hourly rate
      const hourlyRate = this.calculateHourlyRate(baseRate, crewSize, truckCount);

      // Calculate labor hours (with 1.3x multiplier for 4+ rooms)
      const complexityMultiplier = total_rooms >= 4 ? 1.3 : 1.0;
      const laborHours = calculateTotalLaborHours({
        roomCount: total_rooms,
        pickupStairs: stairs_at_pickup,
        dropoffStairs: stairs_at_dropoff,
        elevatorPickup: elevator_at_pickup,
        elevatorDropoff: elevator_at_dropoff,
        squareFootage: square_footage,
        complexityMultiplier
      });

      // Calculate origin to destination travel (for job time)
      const originToDestTravel = await this.calculateOriginToDestinationTravel(origin_address, destination_address);

      // Job time = Labor hours + Origin to destination travel
      const jobHours = laborHours + originToDestTravel;

      // Calculate travel fees (office to origin + destination to office)
      const travelFees = await this.calculateTravelFees(origin_address, destination_address, hourlyRate, truckCount, closestDispatcher.address);

      // Calculate fuel charge (job travel only)
      const fuelCharge = this.calculateFuelCharge(originToDestTravel);

      // Calculate heavy items cost
      const heavyItemsCost = calculateHeavyItemsCost(heavy_items, LETS_GET_MOVING_HEAVY_ITEMS);

      // Calculate additional services cost
      const additionalServicesCost = calculateAdditionalServicesCost(quoteRequest.additional_services || {});

      // Calculate total cost
      const jobCost = hourlyRate * jobHours;
      const totalCost = jobCost + travelFees + fuelCharge + heavyItemsCost.cost + additionalServicesCost;

      // Apply 20% markup
      const { original, markup, final, markupPercentage } = applyMarkup(totalCost);

      console.log(`✅ Let's Get Moving: $${final.toFixed(2)} (${crewSize} movers, ${truckCount} truck, ${closestDispatcher.name})`);

      return {
        vendor_name: this.vendorName,
        vendor_slug: this.vendorSlug,
        total_cost: final,
        original_cost: original,
        markup_amount: markup,
        markup_percentage: markupPercentage,
        breakdown: {
          job_cost: Math.round(jobCost * 100) / 100,
          travel_fees: Math.round(travelFees * 100) / 100,
          fuel: Math.round(fuelCharge * 100) / 100,
          heavy_items: Math.round(heavyItemsCost.cost * 100) / 100,
          additional_services: Math.round(additionalServicesCost * 100) / 100,
          original_total: original
        },
        crew_size: crewSize,
        truck_count: truckCount,
        estimated_hours: laborHours,
        travel_time_hours: originToDestTravel,
        job_travel_hours: originToDestTravel,
        office_travel_fees: Math.round(travelFees * 100) / 100,
        hourly_rate: hourlyRate,
        dispatcher_info: {
          name: closestDispatcher.name,
          address: closestDispatcher.address,
          location_name: closestDispatcher.name
        },
        available_slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
        rating: 4.8,
        reviews: 1247,
        special_notes: 'UPDATED PRICING MODEL - August 22, 2025 (15-min increments)',
        pricing_model: 'NEW_TIERED_TRAVEL_FEES',
        base_rate: baseRate,
        location_name: closestDispatcher.name
      };

    } catch (error) {
      console.error('❌ Let\'s Get Moving: Error calculating quote:', error);
      throw error;
    }
  }
}

export default LetsGetMovingCalculator;



