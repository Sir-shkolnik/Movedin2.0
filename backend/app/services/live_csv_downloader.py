import requests
import csv
import os
import re
import logging
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from urllib.parse import urlparse, parse_qs

logger = logging.getLogger(__name__)

class LiveCSVDownloader:
    """Downloads and updates all dispatcher CSV data from Google Sheets URLs"""
    
    def __init__(self):
        self.spreadsheet_id = "1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA"
        self.csv_exports_dir = "csv_exports"
        self.gids_file = "app/services/g.txt"
        
    def extract_gid_from_url(self, url: str) -> Optional[str]:
        """Extract GID from Google Sheets URL"""
        try:
            # Handle both formats: #gid=123456789 and &gid=123456789
            if "#gid=" in url:
                gid = url.split("#gid=")[1]
            elif "&gid=" in url:
                gid = url.split("&gid=")[1]
            else:
                return None
            
            # Clean up any additional parameters
            gid = gid.split("&")[0].split("#")[0]
            return gid
        except Exception as e:
            logger.error(f"Error extracting GID from URL {url}: {e}")
            return None
    
    def load_all_gids(self) -> List[str]:
        """Load all GIDs from g.txt file - ONLY Canadian URLs"""
        gids = []
        try:
            with open(self.gids_file, 'r') as f:
                lines = f.readlines()
            
            # Only process Canadian URLs (before USA section)
            in_canada_section = True
            
            for line in lines:
                line = line.strip()
                if line == "USA":
                    # Stop processing when we hit the USA section
                    in_canada_section = False
                    break
                if in_canada_section and line.startswith('http'):
                    gid = self.extract_gid_from_url(line)
                    if gid:
                        gids.append(gid)
            
            logger.info(f"Loaded {len(gids)} Canadian GIDs from {self.gids_file} (filtered out USA URLs)")
            return gids
        except Exception as e:
            logger.error(f"Error loading GIDs from {self.gids_file}: {e}")
            return []
    
    def download_csv_for_gid(self, gid: str) -> Optional[str]:
        """Download CSV data for a specific GID"""
        try:
            # Create export URL
            export_url = f"https://docs.google.com/spreadsheets/d/{self.spreadsheet_id}/export?format=csv&gid={gid}"
            
            # Download with proper headers and redirect handling
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(export_url, headers=headers, timeout=30, allow_redirects=True)
            
            if response.status_code == 200:
                csv_data = response.text
                if csv_data.strip():  # Check if we got actual data
                    logger.info(f"Successfully downloaded CSV for GID {gid} ({len(csv_data)} characters)")
                    return csv_data
                else:
                    logger.warning(f"Empty CSV data for GID {gid}")
                    return None
            else:
                logger.error(f"Failed to download CSV for GID {gid}: HTTP {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error downloading CSV for GID {gid}: {e}")
            return None
    
    def save_csv_to_file(self, gid: str, csv_data: str) -> bool:
        """Save CSV data to local file"""
        try:
            # Ensure directory exists
            os.makedirs(self.csv_exports_dir, exist_ok=True)
            
            # Save to file
            file_path = os.path.join(self.csv_exports_dir, f"{gid}.csv")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(csv_data)
            
            logger.info(f"Saved CSV data to {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving CSV for GID {gid}: {e}")
            return False
    
    def download_all_dispatchers(self) -> Dict[str, bool]:
        """Download all dispatcher CSV files"""
        results = {}
        gids = self.load_all_gids()
        
        logger.info(f"Starting download of {len(gids)} dispatcher CSV files...")
        
        for gid in gids:
            logger.info(f"Downloading GID: {gid}")
            csv_data = self.download_csv_for_gid(gid)
            
            if csv_data:
                success = self.save_csv_to_file(gid, csv_data)
                results[gid] = success
            else:
                results[gid] = False
        
        # Summary
        successful = sum(1 for success in results.values() if success)
        failed = len(results) - successful
        
        logger.info(f"Download complete: {successful} successful, {failed} failed")
        
        return results
    
    def validate_csv_data(self, csv_data: str) -> bool:
        """Validate that CSV data contains expected content"""
        try:
            # Check if it's not just an error page
            if "error" in csv_data.lower() or "not found" in csv_data.lower():
                return False
            
            # Check if it has some content
            lines = csv_data.strip().split('\n')
            if len(lines) < 5:  # Should have at least 5 lines
                return False
            
            # Check if it has some non-empty cells
            non_empty_cells = 0
            for line in lines[:10]:  # Check first 10 lines
                cells = line.split(',')
                non_empty_cells += sum(1 for cell in cells if cell.strip())
            
            if non_empty_cells < 10:  # Should have at least 10 non-empty cells
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating CSV data: {e}")
            return False
    
    def get_download_status(self) -> Dict[str, any]:
        """Get status of all CSV files"""
        gids = self.load_all_gids()
        status = {}
        
        for gid in gids:
            file_path = os.path.join(self.csv_exports_dir, f"{gid}.csv")
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
                last_modified = datetime.fromtimestamp(os.path.getmtime(file_path))
                status[gid] = {
                    "exists": True,
                    "size": file_size,
                    "last_modified": last_modified.isoformat(),
                    "valid": file_size > 0
                }
            else:
                status[gid] = {
                    "exists": False,
                    "size": 0,
                    "last_modified": None,
                    "valid": False
                }
        
        return status

# Global instance
live_csv_downloader = LiveCSVDownloader() 