#!/usr/bin/env python3
"""
Standalone Let's Get Moving Calculator
Completely independent calculator that works with its own logic
"""

from typing import Dict, Any, Optional
from datetime import datetime
import logging
from .standalone_lgm_service import standalone_lgm_service

logger = logging.getLogger(__name__)

class StandaloneLGMCalculator:
    """Standalone Let's Get Moving calculator that works independently"""
    
    def __init__(self):
        self.vendor_slug = "lets-get-moving"
        self.vendor_name = "Let's Get Moving"
        self.service = standalone_lgm_service
    
    def calculate_quote(self, quote_request: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Calculate quote for Let's Get Moving using standalone service"""
        try:
            logger.info(f"🔍 Standalone LGM Calculator: Processing quote for {quote_request.get('origin_address')} → {quote_request.get('destination_address')}")
            
            # Find best dispatcher
            dispatcher_data = self.service.find_best_dispatcher(
                quote_request.get("origin_address", ""),
                quote_request.get("destination_address", ""),
                quote_request.get("move_date", "2025-02-15")
            )
            
            if not dispatcher_data:
                logger.warning("❌ No suitable dispatcher found for Let's Get Moving")
                return None
            
            logger.info(f"✅ Found dispatcher: {dispatcher_data.get('location_name', 'Unknown')}")
            
            # Calculate quote
            quote_result = self.service.calculate_quote(quote_request, dispatcher_data)
            
            if quote_result:
                logger.info(f"✅ LGM Quote calculated: ${quote_result.get('total_cost', 0)}")
                return quote_result
            else:
                logger.error("❌ Failed to calculate LGM quote")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error in StandaloneLGMCalculator: {e}")
            import traceback
            logger.error(f"❌ Traceback: {traceback.format_exc()}")
            return None
    
    def serves_location(self, origin: str, destination: str) -> bool:
        """Check if Let's Get Moving serves the given locations"""
        try:
            origin_city = self.service._extract_city(origin)
            dest_city = self.service._extract_city(destination)
            
            if not origin_city:
                return False
            
            # Check if we have any dispatchers that serve this area
            for gid, location_name in self.service.gid_location_map.items():
                if self.service._serves_location(location_name, origin_city):
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking service area: {e}")
            return False

# Global instance
standalone_lgm_calculator = StandaloneLGMCalculator()
