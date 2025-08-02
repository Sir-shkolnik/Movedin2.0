"""
Let's Get Moving - Specialized GID Parsers
Each GID has its own specialized parser for 100% accuracy
"""

from .gid_parsers import *

__all__ = [
    'parse_gid_1324028052',  # DOWNTOWN TORONTO
    'parse_gid_627208617',   # BURNABY (FREDERICTON data)
    'parse_gid_445545962',   # RICHMOND BC
    'parse_gid_1604601748',  # VAUGHAN
    'parse_gid_1257914670',  # WINDSOR
    'parse_gid_586231927',   # OAKVILLE (ABBOTSFORD data)
    'parse_gid_759134820',   # HAMILTON (AJAX data)
    'parse_gid_685880450',   # SUDBURY (BURLINGTON data)
    'parse_gid_2117865571',  # OTTAWA (BRAMPTON data)
    'parse_gid_1846632241',  # KITCHENER
    'parse_gid_1843371269',  # VANCOUVER (HALIFAX data)
    'parse_gid_858770585',   # SURREY
    'parse_gid_1211144815',  # VICTORIA
    'parse_gid_1802285746',  # KITCHENER (duplicate)
    'parse_gid_322544773',   # MONTREAL
    'parse_gid_895613602',   # TORONTO (NORTH YORK)
    'parse_gid_885243828',   # MISSISSAUGA
    'parse_gid_2023718082',  # SCARBOROUGH
    'parse_gid_205064403',   # BARRIE
    'parse_gid_1902434505',  # WINDSOR
    'parse_gid_1985906253',  # WATERLOO
    'parse_gid_1384980803',  # CALGARY
    'parse_gid_2061150538',  # NIAGARA FALLS
] 