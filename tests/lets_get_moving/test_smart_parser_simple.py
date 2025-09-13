#!/usr/bin/env python3
"""
Test smart parser with simple CSV content
"""
import re

def test_regex_patterns():
    """Test regex patterns with actual CSV content"""
    
    # Test CSV content from the downloaded file
    csv_content = """DURHAM,,,,,,,MAR,,DURHAM,,,,,,,APR,
,,,,,,,,,,,,,,,,,
SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,,SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,,
,,,1,2,3,4,,,,,,,,,1,,
,,,149,139,139,139,,,,,,,,,169,,
5,6,7,8,9,10,11,,,2,3,4,5,6,7,8,,
139,139,139,139,139,139,139,,,139,139,139,139,139,139,139,,
12,13,14,15,16,17,18,,,9,10,11,12,13,14,15,,
139,139,139,139,139,139,139,,,139,139,139,139,139,139,139,,
19,20,21,22,23,24,25,,,16,17,18,19,20,21,22,,
139,139,139,139,139,139,139,,,139,139,139,139,139,139,139,,"""
    
    print("Testing regex patterns...")
    
    # Test month pattern
    mar_pattern = r'[A-Z]+.*?MAR.*?[A-Z]+.*?APR'
    mar_match = re.search(mar_pattern, csv_content, re.DOTALL)
    print(f"MAR pattern match: {mar_match is not None}")
    if mar_match:
        print(f"MAR match: {mar_match.group()[:100]}...")
    
    # Test day extraction
    lines = csv_content.split('\n')
    for i, line in enumerate(lines):
        days = re.findall(r'\b([1-3]?[0-9])\b', line)
        if days:
            print(f"Line {i}: {line}")
            print(f"Days found: {days}")
            
            # Test rate extraction in same line
            rates = re.findall(r'\b(139|149|169|179|199)\b', line)
            print(f"Rates in same line: {rates}")
            
            if rates:
                print(f"Day-rate pairs: {list(zip(days, rates))}")
            break

if __name__ == "__main__":
    test_regex_patterns()
