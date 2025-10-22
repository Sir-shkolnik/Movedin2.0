/**
 * Vendor Calculators
 * Export all vendor calculator classes
 */

import LetsGetMovingCalculator from './LetsGetMovingCalculator.js';
import PierreSonsCalculator from './PierreSonsCalculator.js';
import VelocityMoversCalculator from './VelocityMoversCalculator.js';
import Easy2GoCalculator from './Easy2GoCalculator.js';

// Export all calculators
export {
  LetsGetMovingCalculator,
  PierreSonsCalculator,
  VelocityMoversCalculator,
  Easy2GoCalculator
};

// Export calculator instances
export const vendorCalculators = {
  'lets-get-moving': new LetsGetMovingCalculator(),
  'pierre-sons': new PierreSonsCalculator(),
  'velocity-movers': new VelocityMoversCalculator(),
  'easy2go': new Easy2GoCalculator()
};

