#!/usr/bin/env python3
"""
CSV Analyzer for Let's Get Moving Canadian GIDs
Analyzes each CSV to understand patterns and improve parsing
"""

import os
import re
import csv
from typing import Dict, List, Any, Tuple
from collections import defaultdict

class CSVAnalyzer:
    def __init__(self, csv_dir: str = "csv_data/canada"):
        self.csv_dir = csv_dir
        self.analysis_results = {}
        self.patterns_found = defaultdict(list)
        
    def analyze_all_csvs(self):
        """Analyze all CSV files in the directory"""
        print("🔍 ANALYZING ALL CANADIAN GID CSVs")
        print("=" * 50)
        
        csv_files = [f for f in os.listdir(self.csv_dir) if f.endswith('.csv')]
        csv_files.sort()
        
        for csv_file in csv_files:
            print(f"\n📄 Analyzing: {csv_file}")
            self.analyze_single_csv(csv_file)
            
        self.summarize_patterns()
        
    def analyze_single_csv(self, csv_file: str):
        """Analyze a single CSV file"""
        file_path = os.path.join(self.csv_dir, csv_file)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            analysis = {
                'file_name': csv_file,
                'file_size': len(content),
                'lines': content.count('\n'),
                'structure_type': self.detect_structure_type(content),
                'location_details': self.extract_location_details(content),
                'month_patterns': self.find_month_patterns(content),
                'calendar_data': self.find_calendar_data(content),
                'pricing_tables': self.find_pricing_tables(content),
                'special_notes': self.find_special_notes(content)
            }
            
            self.analysis_results[csv_file] = analysis
            self.print_analysis(analysis)
            
        except Exception as e:
            print(f"❌ Error analyzing {csv_file}: {e}")
            
    def detect_structure_type(self, content: str) -> str:
        """Detect the type of CSV structure"""
        if 'LOCATION DETAILS:' in content and 'SUNDAY,MONDAY,TUESDAY' in content:
            return "CALENDAR_STRUCTURE"
        elif 'LOCATION' in content and 'CONTACT' in content:
            return "TABULAR_STRUCTURE"
        elif 'TIME ZONE' in content or 'CALL AT' in content:
            return "TIMEZONE_STRUCTURE"
        elif 'DISCOUNT' in content or 'SPECIAL' in content:
            return "DISCOUNT_STRUCTURE"
        else:
            return "UNKNOWN_STRUCTURE"
            
    def extract_location_details(self, content: str) -> Dict[str, str]:
        """Extract location details from CSV"""
        details = {}
        
        # Look for common location detail patterns
        patterns = {
            'ops_manager': r'OPS MANAGER:\s*([^\n,]+)',
            'address': r'ADDRESS:\s*([^\n,]+)',
            'intersection': r'INTERSECTION:\s*([^\n,]+)',
            'email': r'E-TRANSFER:\s*([^\n,]+)',
            'terminal_id': r'Terminal ID:\s*([^\n,]+)',
            'truck_count': r'# OF TRUCKS:\s*([^\n,]+)',
            'sales_phone': r'SALES #:\s*([^\n,]+)'
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                details[key] = match.group(1).strip()
                
        return details
        
    def find_month_patterns(self, content: str) -> List[str]:
        """Find month patterns in the CSV"""
        months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        
        found_months = []
        for month in months:
            if re.search(month, content):
                found_months.append(month)
                
        return found_months
        
    def find_calendar_data(self, content: str) -> Dict[str, Any]:
        """Find calendar data patterns"""
        calendar_info = {
            'has_sunday_header': 'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY' in content,
            'has_date_numbers': bool(re.search(r'\b[1-3]?[0-9]\b', content)),
            'has_price_numbers': bool(re.search(r'\b[1-9][0-9]{2,3}\b', content)),
            'calendar_sections': len(re.findall(r'SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY', content))
        }
        
        return calendar_info
        
    def find_pricing_tables(self, content: str) -> Dict[str, Any]:
        """Find pricing table patterns"""
        pricing_info = {
            'has_truck_pricing': 'TRUCK' in content.upper(),
            'has_crew_pricing': bool(re.search(r'\d+\s*>\s*\d+\s*>\s*\d+', content)),
            'has_hourly_rates': bool(re.search(r'\d+\s*/\s*HR', content, re.IGNORECASE)),
            'pricing_sections': len(re.findall(r'\d+\s*>\s*\d+\s*>\s*\d+', content))
        }
        
        return pricing_info
        
    def find_special_notes(self, content: str) -> List[str]:
        """Find special notes and important information"""
        notes = []
        
        # Look for important notes sections
        if 'IMPORTANT NOTES' in content:
            notes.append("Has important notes section")
            
        if 'MIN PRICE' in content:
            notes.append("Has minimum price information")
            
        if 'RESTRICTED' in content:
            notes.append("Has restricted arrival windows")
            
        if 'FRANCHISE' in content:
            notes.append("Contains franchise information")
            
        return notes
        
    def print_analysis(self, analysis: Dict[str, Any]):
        """Print analysis results for a single CSV"""
        print(f"  📊 Structure: {analysis['structure_type']}")
        print(f"  📏 Size: {analysis['file_size']} chars, {analysis['lines']} lines")
        
        if analysis['location_details']:
            print(f"  📍 Location Details: {len(analysis['location_details'])} fields")
            for key, value in analysis['location_details'].items():
                print(f"    {key}: {value[:50]}...")
                
        if analysis['month_patterns']:
            print(f"  📅 Months: {', '.join(analysis['month_patterns'])}")
            
        if analysis['calendar_data']['has_sunday_header']:
            print(f"  📆 Calendar: {analysis['calendar_data']['calendar_sections']} sections")
            
        if analysis['pricing_tables']['has_crew_pricing']:
            print(f"  💰 Pricing: {analysis['pricing_tables']['pricing_sections']} pricing sections")
            
        if analysis['special_notes']:
            print(f"  📝 Notes: {', '.join(analysis['special_notes'])}")
            
    def summarize_patterns(self):
        """Summarize patterns found across all CSVs"""
        print("\n" + "=" * 50)
        print("📊 PATTERN SUMMARY")
        print("=" * 50)
        
        # Count structure types
        structure_types = defaultdict(int)
        for analysis in self.analysis_results.values():
            structure_types[analysis['structure_type']] += 1
            
        print(f"\n🏗️ Structure Types:")
        for struct_type, count in structure_types.items():
            print(f"  {struct_type}: {count} files")
            
        # Find common location detail patterns
        common_details = defaultdict(int)
        for analysis in self.analysis_results.values():
            for detail in analysis['location_details'].keys():
                common_details[detail] += 1
                
        print(f"\n📍 Common Location Details:")
        for detail, count in sorted(common_details.items(), key=lambda x: x[1], reverse=True):
            print(f"  {detail}: {count} files")
            
        # Find month patterns
        all_months = set()
        for analysis in self.analysis_results.values():
            all_months.update(analysis['month_patterns'])
            
        print(f"\n📅 Month Patterns Found:")
        for month in sorted(all_months):
            count = sum(1 for analysis in self.analysis_results.values() if month in analysis['month_patterns'])
            print(f"  {month}: {count} files")
            
        # Find calendar patterns
        calendar_files = [f for f, analysis in self.analysis_results.items() 
                         if analysis['calendar_data']['has_sunday_header']]
        print(f"\n📆 Calendar Files: {len(calendar_files)}")
        for file in calendar_files[:10]:  # Show first 10
            print(f"  {file}")
        if len(calendar_files) > 10:
            print(f"  ... and {len(calendar_files) - 10} more")
            
        # Find pricing patterns
        pricing_files = [f for f, analysis in self.analysis_results.items() 
                        if analysis['pricing_tables']['has_crew_pricing']]
        print(f"\n💰 Pricing Files: {len(pricing_files)}")
        for file in pricing_files[:10]:  # Show first 10
            print(f"  {file}")
        if len(pricing_files) > 10:
            print(f"  ... and {len(pricing_files) - 10} more")

def main():
    analyzer = CSVAnalyzer()
    analyzer.analyze_all_csvs()

if __name__ == "__main__":
    main()
