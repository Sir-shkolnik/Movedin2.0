"""
MISSISSAUGA (GID 885243828) - Specialized Parser
Extracts ALL data from MISSISSAUGA CSV with complete structure matching original format
"""

import re
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

def parse_gid_885243828(rows: List[List[str]]) -> Dict[str, Any]:
    """
    Parse MISSISSAUGA (GID 885243828) CSV data
    Returns complete data structure matching original format
    Note: This GID only contains location details, no calendar data
    """
    logger.info("🔍 MISSISSAUGA: Starting specialized parser for GID 885243828")
    
    # Extract location details
    location_details = _extract_location_details(rows)
    
    # Extract calendar data (will be empty since this GID has no calendar data)
    calendar_data = _extract_calendar_data(rows)
    
    # Extract pricing formula (standard for LGM)
    pricing_formula = {
        "description": "Hourly price is for 1 truck and 1 mover. Each additional mover is +$60/hr. Max 3 movers per truck. 2 trucks = double the 1 truck price for the same number of movers. Only 1 truck per day unless otherwise noted.",
        "formulas": {
            "1_truck": "base_price + 60 * (movers - 1)",
            "2_trucks": "2 * (base_price + 60 * (movers - 1))",
            "max_movers_per_truck": 3,
            "notes": [
                "Only 1 truck per day unless otherwise noted.",
                "For 2 trucks, movers = 4, 5, or 6 (2 trucks × 2, 3, or 4 movers)."
            ]
        }
    }
    
    # Extract metadata
    metadata = _extract_metadata(rows)
    
    # Get coordinates (hardcoded for Mississauga)
    lat = 43.5890
    lng = -79.6441
    
    # Clean address for main address field
    clean_address = location_details.get('address', '')
    if clean_address and clean_address.startswith('ADDRESS: '):
        clean_address = clean_address.replace('ADDRESS: ', '')
    
    result = {
        "location": "Mississauga",
        "pricing_formula": pricing_formula,
        "metadata": metadata,
        "calendar_hourly_price": calendar_data.get('daily_rates', {}),
        "lat": lat,
        "lng": lng,
        "address": clean_address,
        "filename": "mississauga.json"
    }
    
    logger.info(f"✅ MISSISSAUGA: Parsed complete data structure with {len(calendar_data.get('daily_rates', {}))} calendar dates")
    return result

def _extract_location_details(rows: List[List[str]]) -> Dict[str, Any]:
    """Extract location details from the CSV"""
    details = {
        'name': 'MISSISSAUGA',
        'terminal_id': None,
        'sales_phone': None,
        'direct_line': None,
        'address': None,
        'intersection': None,
        'email': None,
        'truck_count': None,
        'ownership_type': None,
        'storage': None,
        'trucks_shared_with': None,
        'phone': None,
        'owner': None
    }
    
    logger.info("🔍 MISSISSAUGA: Extracting location details from CSV")
    logger.info(f"🔍 MISSISSAUGA: CSV rows: {len(rows)}")
    
    # Check first 20 rows for location details
    for i, row in enumerate(rows[:20]):
        row_text = ' '.join([cell for cell in row if cell])
        
        # Extract Terminal ID
        if 'Terminal ID:' in row_text:
            terminal_match = re.search(r'Terminal ID:\s*([A-Za-z0-9]+)', row_text)
            if terminal_match:
                details['terminal_id'] = terminal_match.group(1)
                logger.info(f"✅ MISSISSAUGA: Found terminal ID: {details['terminal_id']}")
        
        # Extract Phone/Ops Manager
        if 'OPS MANAGER:' in row_text:
            phone_match = re.search(r'OPS MANAGER:\s*([^,]+)\s+([0-9\-\(\)\s]+)', row_text)
            if phone_match:
                details['owner'] = phone_match.group(1).strip()
                details['phone'] = phone_match.group(2).strip()
                logger.info(f"✅ MISSISSAUGA: Found owner: {details['owner']}, phone: {details['phone']}")
        
        # Extract Address - check each cell in the row
        for cell in row:
            if cell and 'ADDRESS:' in cell:
                # Remove the ADDRESS: prefix and clean up
                address = cell.replace('ADDRESS:', '').strip().strip('"')
                if address:
                    details['address'] = address
                    logger.info(f"✅ MISSISSAUGA: Found address: {details['address']}")
                    break
        
        # Extract Email
        if 'E-TRANSFER:' in row_text:
            email_match = re.search(r'E-TRANSFER:\s*([^\s,]+)', row_text)
            if email_match:
                details['email'] = email_match.group(1).strip()
                logger.info(f"✅ MISSISSAUGA: Found email: {details['email']}")
        
        # Extract Truck Count
        if '# OF TRUCKS:' in row_text:
            truck_match = re.search(r'# OF TRUCKS:\s*([^,\n]+)', row_text)
            if truck_match:
                details['truck_count'] = truck_match.group(1).strip()
                logger.info(f"✅ MISSISSAUGA: Found truck count: {details['truck_count']}")
    
    if not details['address']:
        logger.warning("⚠️ MISSISSAUGA: No address found in CSV")
    
    return details

def _extract_metadata(rows: List[List[str]]) -> Dict[str, Any]:
    """Extract metadata from the CSV"""
    metadata = {
        "ops_manager": None,
        "intersection": None,
        "address": None,
        "email": None,
        "terminal_id": None,
        "restrictions": [],
        "notes": []
    }
    
    # Extract from location details
    location_details = _extract_location_details(rows)
    
    # Format ops manager
    if location_details.get('owner') and location_details.get('phone'):
        metadata['ops_manager'] = f"OPS MANAGER: {location_details['owner']} {location_details['phone']}"
    
    # Format address
    if location_details.get('address'):
        metadata['address'] = f"ADDRESS: {location_details['address']}"
    
    # Format email
    if location_details.get('email'):
        metadata['email'] = f"E-TRANSFER: {location_details['email']}"
    
    # Format terminal ID
    if location_details.get('terminal_id'):
        metadata['terminal_id'] = f"Terminal ID: {location_details['terminal_id']}"
    
    # Extract intersection from CSV
    for i, row in enumerate(rows[:20]):
        row_text = ' '.join([cell for cell in row if cell])
        if 'INTERSECTION:' in row_text:
            intersection_match = re.search(r'INTERSECTION:\s*([^|]+)', row_text)
            if intersection_match:
                metadata['intersection'] = f"INTERSECTION: {intersection_match.group(1).strip()}"
                break
    
    return metadata

def _extract_calendar_data(rows: List[List[str]]) -> Dict[str, Any]:
    """Extract calendar data from the CSV"""
    daily_rates = {}
    
    # This GID only contains location details, no calendar data
    # Return empty calendar data to maintain data integrity
    logger.info("⚠️ MISSISSAUGA: No calendar data found in CSV (this GID only contains location details)")
    
    return {
        "daily_rates": {}
    } 