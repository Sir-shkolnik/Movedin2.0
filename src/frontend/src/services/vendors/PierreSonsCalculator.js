/**
 * Pierre & Sons Calculator
 * Fixed hourly rates + distance surcharge
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
  PIERRE_SONS_HEAVY_ITEMS,
  MAX_TRAVEL_TIME_HOURS
} from '../utils/constants.js';

class PierreSonsCalculator {
  constructor() {
    this.vendorSlug = 'pierre-sons';
    this.vendorName = 'Pierre & Sons';
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
    const rates = {
      1: 65,   // $65/hr for 1 guy
      2: 135,  // $135/hr for 2 guys
      3: 165,  // $165/hr for 3 guys
      4: 195,  // $195/hr for 4 guys
      5: 225,  // $225/hr for 5 guys
      6: 255   // $255/hr for 6 guys
    };
    
    return rates[crewSize] || 135;
  }

  /**
   * Get truck fee based on room count
   * @param {number} roomCount - Number of rooms
   * @returns {number} - Truck fee
   */
  getTruckFee(roomCount) {
    if (roomCount === 1) return 100;  // Small truck (16ft)
    if (roomCount === 2) return 140;  // Medium truck (20ft)
    if (roomCount >= 3) return 180;   // Big truck (26ft)
    return 100;
  }

  /**
   * Calculate travel time (fixed 1 hour)
   * @returns {number} - Travel time in hours
   */
  async calculateTravelTime() {
    // Pierre & Sons official rule: 1 hour travel time fee included
    return 1.0;
  }

  /**
   * Calculate distance in kilometers
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @returns {Promise<number>} - Distance in kilometers
   */
  async calculateDistance(origin, destination) {
    try {
      return await mapboxService.getDistanceKm(origin, destination);
    } catch (error) {
      console.error('Pierre & Sons: Error calculating distance:', error);
      return 25.0; // Default 25 km
    }
  }

  /**
   * Calculate fuel surcharge
   * @param {number} distanceKm - Distance in kilometers
   * @returns {number} - Fuel surcharge
   */
  calculateFuelSurcharge(distanceKm) {
    // Official rule: If distance exceeds 50 km, $1 per extra km
    if (distanceKm <= 50) return 0;
    return (distanceKm - 50) * 1;
  }

  /**
   * Calculate quote
   * @param {Object} quoteRequest - Quote request
   * @returns {Promise<Object>} - Quote result
   */
  async calculateQuote(quoteRequest) {
    console.log('📊 Pierre & Sons: Calculating quote...');
    
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

      // Check if this is a long-distance move (>10 hours one-way)
      const oneWayTravelHours = await mapboxService.getTravelTimeHours(origin_address, destination_address);
      console.log(`Pierre & Sons: One-way travel time: ${oneWayTravelHours.toFixed(2)} hours`);
      
      if (oneWayTravelHours > MAX_TRAVEL_TIME_HOURS) {
        console.log(`Pierre & Sons: ❌ Long distance move rejected (>${MAX_TRAVEL_TIME_HOURS}h)`);
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

      // Calculate travel time (fixed 1 hour)
      const travelHours = 1.0; // Pierre & Sons: Fixed 1 hour travel time

      // Calculate distance and fuel surcharge
      const distanceKm = await this.calculateDistance(origin_address, destination_address);
      const fuelSurcharge = this.calculateFuelSurcharge(distanceKm);

      // Calculate truck fee
      const truckFee = this.getTruckFee(total_rooms);

      // Calculate heavy items cost using V2.0 rates
      const heavyItemsCost = calculateHeavyItemsCost(heavy_items, PIERRE_SONS_HEAVY_ITEMS);

      // Calculate additional services cost
      const additionalServicesCost = calculateAdditionalServicesCost(quoteRequest.additional_services || {});

      // Calculate costs with validation
      const laborCost = (hourlyRate || 0) * (laborHours || 0);
      const travelCost = (hourlyRate || 0) * (travelHours || 0);
      const truckFeeValue = truckFee || 0;
      const fuelSurchargeValue = fuelSurcharge || 0;
      const heavyItemsCostValue = heavyItemsCost?.cost || 0;
      const additionalServicesCostValue = additionalServicesCost || 0;
      
      const totalCost = laborCost + travelCost + truckFeeValue + fuelSurchargeValue + heavyItemsCostValue + additionalServicesCostValue;
      
      // Debug logging
      console.log('Pierre & Sons Debug:', {
        hourlyRate,
        laborHours,
        travelHours,
        laborCost,
        travelCost,
        truckFee: truckFeeValue,
        fuelSurcharge: fuelSurchargeValue,
        heavyItemsCost: heavyItemsCostValue,
        additionalServicesCost: additionalServicesCostValue,
        totalCost
      });

      // Apply 20% markup
      const { original, markup, final, markupPercentage } = applyMarkup(totalCost);

      console.log(`✅ Pierre & Sons: $${final.toFixed(2)} (${crewSize} movers, ${truckCount} truck)`);

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
          fuel_surcharge: Math.round(fuelSurcharge * 100) / 100,
          heavy_items: Math.round(heavyItemsCost.cost * 100) / 100,
          additional_services: Math.round(additionalServicesCost * 100) / 100,
          original_total: original
        },
        crew_size: crewSize,
        truck_count: truckCount,
        estimated_hours: laborHours,
        travel_time_hours: travelHours,
        distance_km: Math.round(distanceKm * 10) / 10,
        hourly_rate: hourlyRate,
        dispatcher_info: {
          name: 'Pierre & Sons',
          address: 'Toronto, ON',
          location_name: 'Toronto Office'
        },
        available_slots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
        rating: 4.7,
        reviews: 734,
        special_notes: 'Fixed hourly rates with distance surcharge'
      };

    } catch (error) {
      console.error('❌ Pierre & Sons: Error calculating quote:', error);
      throw error;
    }
  }
}

export default PierreSonsCalculator;



