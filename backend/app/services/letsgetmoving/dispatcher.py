"""
Master Dispatcher for Let's Get Moving GID Parsers
Routes each GID to its specific parser for 100% accuracy
"""

import logging
from typing import Dict, List, Any, Optional
from .gid_parsers import *

logger = logging.getLogger(__name__)

# Import individual GID parsers
from .gid_895613602 import parse_gid_895613602
from .gid_885243828 import parse_gid_885243828
from .gid_205064403 import parse_gid_205064403
from .gid_2023718082 import parse_gid_2023718082
from .gid_1846632241 import parse_gid_1846632241
from .gid_2117865571 import parse_gid_2117865571
from .gid_759134820 import parse_gid_759134820
from .gid_685880450 import parse_gid_685880450
from .gid_586231927 import parse_gid_586231927
from .gid_1843371269 import parse_gid_1843371269
from .gid_858770585 import parse_gid_858770585
from .gid_1211144815 import parse_gid_1211144815
from .gid_1802285746 import parse_gid_1802285746
from .gid_322544773 import parse_gid_322544773
from .gid_1902434505 import parse_gid_1902434505
from .gid_1985906253 import parse_gid_1985906253
from .gid_1384980803 import parse_gid_1384980803
from .gid_2061150538 import parse_gid_2061150538
from .gid_1324028052 import parse_gid_1324028052
from .gid_627208617 import parse_gid_627208617
from .gid_445545962 import parse_gid_445545962
from .gid_1604601748 import parse_gid_1604601748
from .gid_1257914670 import parse_gid_1257914670

# GID to parser mapping
GID_PARSER_MAP = {
    "1324028052": parse_gid_1324028052,  # DOWNTOWN TORONTO
    "627208617": parse_gid_627208617,    # BURNABY (FREDERICTON data)
    "445545962": parse_gid_445545962,    # RICHMOND BC
    "1604601748": parse_gid_1604601748,  # VAUGHAN
    "1257914670": parse_gid_1257914670,  # WINDSOR
    "586231927": parse_gid_586231927,    # OAKVILLE (ABBOTSFORD data)
    "759134820": parse_gid_759134820,    # HAMILTON (AJAX data)
    "685880450": parse_gid_685880450,    # SUDBURY (BURLINGTON data)
    "2117865571": parse_gid_2117865571,  # OTTAWA (BRAMPTON data)
    "1846632241": parse_gid_1846632241,  # KITCHENER
    "1843371269": parse_gid_1843371269,  # VANCOUVER (HALIFAX data)
    "858770585": parse_gid_858770585,    # SURREY
    "1211144815": parse_gid_1211144815,  # VICTORIA
    "1802285746": parse_gid_1802285746,  # KITCHENER (duplicate)
    "322544773": parse_gid_322544773,    # MONTREAL
    "895613602": parse_gid_895613602,    # TORONTO (NORTH YORK)
    "885243828": parse_gid_885243828,    # MISSISSAUGA
    "2023718082": parse_gid_2023718082,  # SCARBOROUGH
    "205064403": parse_gid_205064403,    # BARRIE
    "1902434505": parse_gid_1902434505,  # WINDSOR
    "1985906253": parse_gid_1985906253,  # WATERLOO
    "1384980803": parse_gid_1384980803,  # CALGARY
    "2061150538": parse_gid_2061150538,  # NIAGARA FALLS
}

def parse_gid_specialized(gid: str, rows: List[List[str]]) -> Optional[Dict[str, Any]]:
    """
    Parse a specific GID using its specialized parser
    """
    if gid not in GID_PARSER_MAP:
        logger.warning(f"⚠️ No specialized parser found for GID: {gid}")
        return None
    
    try:
        parser_func = GID_PARSER_MAP[gid]
        logger.info(f"🔍 Using specialized parser for GID: {gid}")
        result = parser_func(rows)
        logger.info(f"✅ Specialized parser for GID {gid} completed successfully")
        return result
    except Exception as e:
        logger.error(f"❌ Error in specialized parser for GID {gid}: {e}")
        return None

def get_available_gids() -> List[str]:
    """
    Get list of all available GIDs with specialized parsers
    """
    return list(GID_PARSER_MAP.keys())

def is_gid_supported(gid: str) -> bool:
    """
    Check if a GID has a specialized parser
    """
    return gid in GID_PARSER_MAP 