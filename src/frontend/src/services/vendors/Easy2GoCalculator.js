/**
 * Easy2Go Calculator
 * Weight-based pricing
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
  EASY2GO_HEAVY_ITEMS,
  LGM_DISPATCHER_LOCATIONS,
  MAX_TRAVEL_TIME_HOURS
} from '../utils/constants.js';
import { findClosestDispatcher } from '../utils/validation.js';

class Easy2GoCalculator {
  constructor() {
    this.vendorSlug = 'easy2go';
    this.vendorName = 'Easy2Go';
  }

  /**
   * Estimate weight based on rooms and square footage
   * @param {number} roomCount - Number of rooms
   * @param {string} squareFootage - Square footage range
   * @returns {number} - Estimated weight in lbs
   */
  estimateWeight(roomCount, squareFootage) {
    // Base weight by rooms
    const baseWeight = {
      1: 2000,
      2: 3000,
      3: 4500,
      4: 6000,
      5: 7500,
      6: 9000,
      7: 10500
    };
    
    let weight = baseWeight[roomCount] || 10500;
    
    // Square footage multiplier
    let sqftMultiplier = 1.0;
    if (squareFootage) {
      if (squareFootage.includes('1000-1500')) sqftMultiplier = 1.2;
      else if (squareFootage.includes('1500-2000')) sqftMultiplier = 1.4;
      else if (squareFootage.includes('2000-2500')) sqftMultiplier = 1.6;
      else if (squareFootage.includes('2500-3000')) sqftMultiplier = 1.8;
      else if (squareFootage.includes('3000')) sqftMultiplier = 2.0;
    }
    
    return weight * sqftMultiplier;
  }

  /**
   * Get crew size from weight
   * @param {number} weight - Estimated weight
   * @returns {number} - Crew size
   */
  getCrewSizeFromWeight(weight) {
    if (weight <= 2000) return 2;
    if (weight <= 4000) return 3;
    if (weight <= 6000) return 4;
    return 5;
  }

  /**
   * Get crew size based on room count, weight, and heavy items
   * @param {number} roomCount - Number of rooms
   * @param {string} squareFootage - Square footage range
   * @param {number} heavyItemsCount - Number of heavy items
   * @returns {number} - Crew size
   */
  getCrewSize(roomCount, squareFootage, heavyItemsCount) {
    const weight = this.estimateWeight(roomCount, squareFootage);
    let crewSize = this.getCrewSizeFromWeight(weight);
    
    // Heavy items auto-upgrade crew to at least 3
    if (heavyItemsCount > 0) {
      crewSize = Math.max(crewSize, 3);
    }
    
    return crewSize;
  }

  /**
   * Get truck count from weight
   * @param {number} weight - Estimated weight
   * @returns {number} - Truck count
   */
  getTruckCountFromWeight(weight) {
    if (weight <= 10000) return 1;
    return 2;
  }

  /**
   * Get truck count based on weight
   * @param {number} roomCount - Number of rooms
   * @param {string} squareFootage - Square footage range
   * @returns {number} - Truck count
   */
  getTruckCount(roomCount, squareFootage) {
    const weight = this.estimateWeight(roomCount, squareFootage);
    return this.getTruckCountFromWeight(weight);
  }

  /**
   * Get hourly rate based on crew size
   * @param {number} crewSize - Crew size
   * @returns {number} - Hourly rate
   */
  getHourlyRate(crewSize) {
    const rates = {
      2: 140,
      3: 180,
      4: 220,
      5: 260
    };
    
    return rates[crewSize] || 140;
  }

  /**
   * Get truck fee from weight
   * @param {number} weight - Estimated weight
   * @returns {number} - Truck fee
   */
  getTruckFeeFromWeight(weight) {
    if (weight <= 2000) return 150;
    if (weight <= 4000) return 200;
    return 250;
  }

  /**
   * Calculate travel time with 3-leg journey and truck factor
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @param {string} dispatcherAddress - Dispatcher office address
   * @returns {Promise<number>} - Travel time in hours
   */
  async calculateTravelTime(origin, destination, dispatcherAddress) {
    try {
      // Calculate 3-leg journey: Dispatcher → Origin → Destination → Dispatcher
      const carTravelTime = await mapboxService.calculate3LegJourney(origin, destination, dispatcherAddress);
      
      // Apply truck factor (30% slower)
      const truckTravelTime = carTravelTime * 1.3;
      
      console.log(`Easy2Go: Travel time ${carTravelTime.toFixed(2)}h car → ${truckTravelTime.toFixed(2)}h truck`);
      
      return truckTravelTime;
    } catch (error) {
      console.error('Easy2Go: Error calculating travel time:', error);
      return 2.0 * 1.3; // Default fallback
    }
  }

  /**
   * Calculate quote
   * @param {Object} quoteRequest - Quote request
   * @returns {Promise<Object>} - Quote result
   */
  async calculateQuote(quoteRequest) {
    console.log('📊 Easy2Go: Calculating quote...');
    
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
      
      console.log(`Easy2Go: Closest dispatcher is ${closestDispatcher.name}`);

      // Check if this is a long-distance move (>10 hours one-way)
      const oneWayTravelHours = await mapboxService.getTravelTimeHours(origin_address, destination_address);
      console.log(`Easy2Go: One-way travel time: ${oneWayTravelHours.toFixed(2)} hours`);
      
      if (oneWayTravelHours > MAX_TRAVEL_TIME_HOURS) {
        console.log(`Easy2Go: ❌ Long distance move rejected (>${MAX_TRAVEL_TIME_HOURS}h)`);
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

      // Calculate weight, crew, and truck count
      const weight = this.estimateWeight(total_rooms, square_footage);
      const heavyItemsCount = getHeavyItemsCount(heavy_items);
      const crewSize = this.getCrewSize(total_rooms, square_footage, heavyItemsCount);
      const truckCount = this.getTruckCount(total_rooms, square_footage);

      // Get hourly rate
      const hourlyRate = this.getHourlyRate(crewSize);

      // Calculate labor hours
      const laborHours = calculateTotalLaborHours({
        roomCount: total_rooms,
        pickupStairs: stairs_at_pickup,
        dropoffStairs: stairs_at_dropoff,
        elevatorPickup: elevator_at_pickup,
        elevatorDropoff: elevator_at_dropoff,
        squareFootage: square_footage
      });

      // Calculate travel time (3-leg journey with truck factor)
      const travelHours = await this.calculateTravelTime(origin_address, destination_address, closestDispatcher.address);
      
      // Validate travel hours
      if (!travelHours || isNaN(travelHours)) {
        throw new Error('Invalid travel time calculated');
      }

      // Calculate truck fee
      const truckFee = this.getTruckFeeFromWeight(weight);

      // Calculate heavy items cost using V2.0 rates
      const heavyItemsCost = calculateHeavyItemsCost(heavy_items, EASY2GO_HEAVY_ITEMS);

      // Calculate additional services cost
      const additionalServicesCost = calculateAdditionalServicesCost(quoteRequest.additional_services || {});

      // Calculate costs with validation
      const laborCost = (hourlyRate || 0) * (laborHours || 0);
      const travelCost = (hourlyRate || 0) * (travelHours || 0);
      const truckFeeValue = truckFee || 0;
      const heavyItemsCostValue = heavyItemsCost?.cost || 0;
      const additionalServicesCostValue = additionalServicesCost || 0;
      
      const totalCost = laborCost + travelCost + truckFeeValue + heavyItemsCostValue + additionalServicesCostValue;
      
      // Debug logging
      console.log('Easy2Go Debug:', {
        hourlyRate,
        laborHours,
        travelHours,
        laborCost,
        travelCost,
        truckFee: truckFeeValue,
        heavyItemsCost: heavyItemsCostValue,
        additionalServicesCost: additionalServicesCostValue,
        totalCost
      });
      
      // Validate total cost
      if (isNaN(totalCost) || totalCost <= 0) {
        console.error('Easy2Go: Invalid total cost:', { laborCost, travelCost, truckFee, heavyItemsCost, additionalServicesCost });
        throw new Error('Invalid total cost calculated');
      }

      // Apply 20% markup
      const { original, markup, final, markupPercentage } = applyMarkup(totalCost);

      console.log(`✅ Easy2Go: $${final.toFixed(2)} (${crewSize} movers, ${truckCount} truck, ${weight}lbs)`);

      return {
        vendor_name: this.vendorName,
        vendor_slug: this.vendorSlug,
        total_cost: final,
        original_cost: original,
        markup_amount: markup,
        markup_percentage: markupPercentage,
        breakdown: {
          labor: Math.round(laborCost * 100) / 100,
          travel: Math.round(travelCost * 100) / 100,
          truck_fee: truckFee,
          heavy_items: Math.round(heavyItemsCost.cost * 100) / 100,
          additional_services: Math.round(additionalServicesCost * 100) / 100,
          original_total: original
        },
        crew_size: crewSize,
        truck_count: truckCount,
        estimated_hours: laborHours,
        travel_time_hours: travelHours,
        estimated_weight: Math.round(weight),
        hourly_rate: hourlyRate,
        dispatcher_info: {
          name: closestDispatcher.name,
          address: closestDispatcher.address,
          location_name: closestDispatcher.name
        },
        available_slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'],
        rating: 4.5,
        reviews: 567,
        special_notes: 'Weight-based pricing with truck fees'
      };

    } catch (error) {
      console.error('❌ Easy2Go: Error calculating quote:', error);
      throw error;
    }
  }
}

export default Easy2GoCalculator;



