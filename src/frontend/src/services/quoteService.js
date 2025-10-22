/**
 * Quote Service
 * Main service for generating quotes from all vendors
 */

import { vendorCalculators } from './vendors/index.js';
import { validateQuoteRequest } from './utils/validation.js';
import { VENDOR_METADATA } from './utils/constants.js';

class QuoteService {
  constructor() {
    this.calculators = vendorCalculators;
  }

  /**
   * Generate quotes from all available vendors
   * @param {Object} quoteRequest - Quote request
   * @returns {Promise<Array>} - Array of quotes
   */
  async generateQuotes(quoteRequest) {
    console.log('🚀 Generating quotes from all vendors...');
    
    // Validate quote request
    const validation = validateQuoteRequest(quoteRequest);
    if (!validation.valid) {
      throw new Error(`Invalid quote request: ${validation.errors.join(', ')}`);
    }

    // Generate quotes from all vendors in parallel
    const quotePromises = Object.entries(this.calculators).map(async ([vendorSlug, calculator]) => {
      try {
        console.log(`📊 Calculating quote for ${vendorSlug}...`);
        const quote = await calculator.calculateQuote(quoteRequest);
        
        // Add vendor metadata
        const metadata = VENDOR_METADATA[vendorSlug];
        if (metadata) {
          quote.logo = metadata.logo;
          quote.rating = metadata.rating;
          quote.reviews = metadata.reviews;
          quote.available_slots = metadata.availableSlots;
        }
        
        return quote;
      } catch (error) {
        console.error(`❌ Error calculating quote for ${vendorSlug}:`, error);
        // Return null for failed quotes
        return null;
      }
    });

    // Wait for all quotes to complete
    const quotes = await Promise.all(quotePromises);
    
    // Filter out null results (failed quotes)
    const validQuotes = quotes.filter(quote => quote !== null);
    
    // Sort by total cost (lowest first)
    validQuotes.sort((a, b) => a.total_cost - b.total_cost);
    
    console.log(`✅ Generated ${validQuotes.length} quotes`);
    
    return validQuotes;
  }

  /**
   * Generate quote from a specific vendor
   * @param {string} vendorSlug - Vendor identifier
   * @param {Object} quoteRequest - Quote request
   * @returns {Promise<Object>} - Quote result
   */
  async generateQuoteFromVendor(vendorSlug, quoteRequest) {
    const calculator = this.calculators[vendorSlug];
    
    if (!calculator) {
      throw new Error(`Unknown vendor: ${vendorSlug}`);
    }

    // Validate quote request
    const validation = validateQuoteRequest(quoteRequest);
    if (!validation.valid) {
      throw new Error(`Invalid quote request: ${validation.errors.join(', ')}`);
    }

    console.log(`📊 Generating quote from ${vendorSlug}...`);
    
    const quote = await calculator.calculateQuote(quoteRequest);
    
    // Add vendor metadata
    const metadata = VENDOR_METADATA[vendorSlug];
    if (metadata) {
      quote.logo = metadata.logo;
      quote.rating = metadata.rating;
      quote.reviews = metadata.reviews;
      quote.available_slots = metadata.availableSlots;
    }
    
    return quote;
  }

  /**
   * Get available vendors for a location
   * @param {string} originAddress - Origin address
   * @param {string} destinationAddress - Destination address
   * @returns {Array<string>} - Array of vendor slugs
   */
  getAvailableVendors(originAddress, destinationAddress) {
    // For now, return all vendors
    // In the future, we can add geographic validation here
    return Object.keys(this.calculators);
  }
}

// Export singleton instance
export default new QuoteService();

