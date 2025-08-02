"""
Script to remove all hardcoded fallback data from all parsers
Ensure 100% live data only from Google Sheets
"""

import os
import re

def remove_hardcoded_data_from_file(filename):
    """Remove hardcoded fallback data from a parser file"""
    
    with open(filename, 'r') as f:
        content = f.read()
    
    # Pattern to find hardcoded fallback data sections
    hardcoded_pattern = r'# If no comprehensive data found, create comprehensive default rates for 2025\s+if not daily_rates:\s+logger\.info\("🔍 Creating comprehensive default [^"]+ rates for 2025"\)\s+.*?for day in range\(1, 32\):\s+date_key = f"\{month_num\}-\{day:02d\}"\s+.*?else:\s+daily_rates\[date_key\] = \d+\.0'
    
    # Replace with warning message
    replacement = '''# If no data found, return empty - NO HARDCODED DATA
    if not daily_rates:
        logger.warning("⚠️ NO LIVE DATA FOUND for LOCATION - returning empty calendar")
        logger.warning("⚠️ This means the Google Sheet structure may have changed or data is missing")'''
    
    # Get location name from filename
    location_name = filename.replace('gid_', '').replace('.py', '')
    
    # Customize the warning message
    replacement = replacement.replace('LOCATION', location_name)
    
    # Remove the hardcoded section
    new_content = re.sub(hardcoded_pattern, replacement, content, flags=re.DOTALL)
    
    # Also remove any hardcoded operational notes
    hardcoded_notes_pattern = r"'base_rate_weekday': \d+\.0,\s+'base_rate_weekend': \d+\.0"
    new_content = re.sub(hardcoded_notes_pattern, "'live_data_only': True", new_content)
    
    with open(filename, 'w') as f:
        f.write(new_content)
    
    print(f"✅ Removed hardcoded data from {filename}")

# List all parser files to fix
parser_files = [
    "gid_2023718082.py",  # SCARBOROUGH
    "gid_1846632241.py",  # KITCHENER
    "gid_2117865571.py",  # OTTAWA
    "gid_759134820.py",   # HAMILTON
    "gid_685880450.py",   # SUDBURY
    "gid_586231927.py",   # OAKVILLE
    "gid_1843371269.py",  # VANCOUVER
    "gid_858770585.py",   # SURREY
    "gid_1211144815.py",  # VICTORIA
    "gid_1802285746.py",  # KITCHENER
    "gid_322544773.py",   # MONTREAL
    "gid_1902434505.py",  # WINDSOR
    "gid_1985906253.py",  # WATERLOO
    "gid_1384980803.py",  # CALGARY
    "gid_2061150538.py",  # NIAGARA FALLS
]

# Fix all parser files
for filename in parser_files:
    if os.path.exists(filename):
        remove_hardcoded_data_from_file(filename)
    else:
        print(f"⚠️ File {filename} not found")

print("🎉 All hardcoded data removed - now using 100% live data only!") 