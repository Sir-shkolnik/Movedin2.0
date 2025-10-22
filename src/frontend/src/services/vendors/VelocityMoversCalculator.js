/**
 * Velocity Movers Calculator
 * Crew-based pricing: "Two Movers $150 + $40 per additional mover"
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
  VELOCITY_MOVERS_HEAVY_ITEMS,
  LGM_DISPATCHER_LOCATIONS,
  MAX_TRAVEL_TIME_HOURS
} from '../utils/constants.js';
import { findClosestDispatcher } from '../utils/validation.js';

class VelocityMoversCalculator {
  constructor() {
    this.vendorSlug = 'velocity-movers';
    this.vendorName = 'Velocity Movers';
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
    if (roomCount <= 2) crewSize = 2;
    else if (roomCount <= 3) crewSize = 3;
    else if (roomCount <= 4) crewSize = 4;
    else crewSize = 5; // 5+ rooms = 5 movers
    
    // Heavy items auto-upgrade crew to at least 3
    if (heavyItemsCount > 0) {
      crewSize = Math.max(crewSize, 3);
    }
    
    return crewSize;
  }

  /**
   * Get truck count based on crew size
   * @param {number} crewSize - Crew size
   * @returns {number} - Truck count
   */
  getTruckCount(crewSize) {
    return crewSize <= 3 ? 1 : 2;
  }

  /**
   * Get hourly rate based on crew size
   * @param {number} crewSize - Crew size
   * @returns {number} - Hourly rate
   */
  getHourlyRate(crewSize) {
    // Official Velocity Movers rule: "Two Movers $150.00 | Additional Movers $40.00"
    const baseRate = 150; // Two movers
    const additionalMoverRate = 40;
    
    if (crewSize === 2) {
      return baseRate;
    } else {
      const additionalMovers = crewSize - 2;
      return baseRate + (additionalMovers * additionalMoverRate);
    }
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
      
      console.log(`Velocity Movers: Travel time ${carTravelTime.toFixed(2)}h car → ${truckTravelTime.toFixed(2)}h truck`);
      
      return truckTravelTime;
    } catch (error) {
      console.error('Velocity Movers: Error calculating travel time:', error);
      return 2.0 * 1.3; // Default fallback
    }
  }

  /**
   * Calculate quote
   * @param {Object} quoteRequest - Quote request
   * @returns {Promise<Object>} - Quote result
   */
  async calculateQuote(quoteRequest) {
    console.log('📊 Velocity Movers: Calculating quote...');
    
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
      
      console.log(`Velocity Movers: Closest dispatcher is ${closestDispatcher.name}`);

      // Check if this is a long-distance move (>10 hours one-way)
      const oneWayTravelHours = await mapboxService.getTravelTimeHours(origin_address, destination_address);
      console.log(`Velocity Movers: One-way travel time: ${oneWayTravelHours.toFixed(2)} hours`);
      
      if (oneWayTravelHours > MAX_TRAVEL_TIME_HOURS) {
        console.log(`Velocity Movers: ❌ Long distance move rejected (>${MAX_TRAVEL_TIME_HOURS}h)`);
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

      // Calculate crew and truck count
      const heavyItemsCount = getHeavyItemsCount(heavy_items);
      const crewSize = this.getCrewSize(total_rooms, heavyItemsCount);
      const truckCount = this.getTruckCount(crewSize);

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

      // Calculate heavy items cost using V2.0 rates
      const heavyItemsCost = calculateHeavyItemsCost(heavy_items, VELOCITY_MOVERS_HEAVY_ITEMS);

      // Calculate additional services cost
      const additionalServicesCost = calculateAdditionalServicesCost(quoteRequest.additional_services || {});

      // Calculate costs with validation
      const laborCost = (hourlyRate || 0) * (laborHours || 0);
      const travelCost = (hourlyRate || 0) * (travelHours || 0);
      const heavyItemsCostValue = heavyItemsCost?.cost || 0;
      const additionalServicesCostValue = additionalServicesCost || 0;
      
      const totalCost = laborCost + travelCost + heavyItemsCostValue + additionalServicesCostValue;
      
      // Debug logging
      console.log('Velocity Movers Debug:', {
        hourlyRate,
        laborHours,
        travelHours,
        laborCost,
        travelCost,
        heavyItemsCost: heavyItemsCostValue,
        additionalServicesCost: additionalServicesCostValue,
        totalCost
      });
      
      // Validate total cost
      if (isNaN(totalCost) || totalCost <= 0) {
        console.error('Velocity Movers: Invalid total cost:', { laborCost, travelCost, heavyItemsCost, additionalServicesCost });
        throw new Error('Invalid total cost calculated');
      }

      // Apply 20% markup
      const { original, markup, final, markupPercentage } = applyMarkup(totalCost);

      console.log(`✅ Velocity Movers: $${final.toFixed(2)} (${crewSize} movers, ${truckCount} truck)`);

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
          heavy_items: Math.round(heavyItemsCost.cost * 100) / 100,
          additional_services: Math.round(additionalServicesCost * 100) / 100,
          original_total: original
        },
        crew_size: crewSize,
        truck_count: truckCount,
        estimated_hours: laborHours,
        travel_time_hours: travelHours,
        hourly_rate: hourlyRate,
        dispatcher_info: {
          name: closestDispatcher.name,
          address: closestDispatcher.address,
          location_name: closestDispatcher.name
        },
        available_slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        rating: 4.6,
        reviews: 892,
        special_notes: 'Crew-based pricing: $150 for 2 movers + $40 per additional mover'
      };

    } catch (error) {
      console.error('❌ Velocity Movers: Error calculating quote:', error);
      throw error;
    }
  }
}

export default VelocityMoversCalculator;



