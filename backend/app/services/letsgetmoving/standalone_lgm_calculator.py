#!/usr/bin/env python3
"""
Standalone Let's Get Moving Calculator
Completely independent calculator that works with its own logic
"""

from typing import Dict, Any, Optional
from datetime import datetime
import logging
from .standalone_lgm_service import StandaloneLGMService

logger = logging.getLogger(__name__)

class StandaloneLGMCalculator:
    """Standalone Let's Get Moving calculator that works independently"""
    
    def __init__(self):
        self.vendor_slug = "lets-get-moving"
        self.vendor_name = "Let's Get Moving"
        self.service = StandaloneLGMService()
    
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
        """Check if Let's Get Moving serves the given locations within 50km radius"""
        try:
            origin_city = self.service._extract_city(origin)
            dest_city = self.service._extract_city(destination)
            
            logger.info(f"🔍 LGM serves_location: origin='{origin}' -> '{origin_city}', dest='{destination}' -> '{dest_city}'")
            
            if not origin_city or not dest_city:
                logger.warning("❌ Missing origin or destination city")
                return False
            
            # Check if we have any dispatchers that can serve BOTH origin AND destination within 50km
            for gid, location_name in self.service.gid_location_map.items():
                logger.info(f"🔍 Checking dispatcher {gid} ({location_name})")
                
                # Check if dispatcher can serve origin within 50km
                serves_origin = self.service._serves_location(location_name, origin_city)
                logger.info(f"  Dispatcher {location_name} serves origin {origin_city}: {serves_origin}")
                
                if serves_origin:
                    # Check if dispatcher can also serve destination within 50km
                    serves_destination = self.service._serves_location(location_name, dest_city)
                    logger.info(f"  Dispatcher {location_name} serves destination {dest_city}: {serves_destination}")
                    
                    if serves_destination:
                        logger.info(f"✅ Found dispatcher that serves both: {location_name}")
                        return True
                    else:
                        logger.info(f"❌ Dispatcher {location_name} serves origin but not destination")
                else:
                    logger.info(f"❌ Dispatcher {location_name} does not serve origin")
            
            logger.warning("❌ No dispatcher found that serves both origin and destination within 50km")
            return False
            
        except Exception as e:
            logger.error(f"Error checking service area: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return False

# Global instance
standalone_lgm_calculator = StandaloneLGMCalculator()
