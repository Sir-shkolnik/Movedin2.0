#!/usr/bin/env python3
"""
Initialize vendors in the database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models.vendor import Vendor
from sqlalchemy import text

def init_vendors():
    """Initialize vendors in the database"""
    db = SessionLocal()
    
    try:
        # Check if vendors already exist
        existing_vendors = db.query(Vendor).count()
        if existing_vendors > 0:
            print(f"✅ {existing_vendors} vendors already exist in database")
            return
        
        # Create vendors
        vendors = [
            {
                "name": "Let's Get Moving",
                "slug": "lets-get-moving",
                "display_name": "Let's Get Moving",
                "logo_url": "/logos/lets_get_moving_logo.svg",
                "vendor_type": "hourly",
                "pricing_model": {
                    "base_rate_source": "google_sheets",
                    "crew_sizes": [2, 3, 4],
                    "fuel_charge": "dynamic",
                    "heavy_items": True
                },
                "coverage_areas": ["GTA", "Greater Toronto Area", "Golden Horseshoe"],
                "service_radius": 150.0,
                "phone": "1-800-668-8383",
                "email": "info@letsgetmoving.ca",
                "website": "https://letsgetmoving.ca",
                "is_active": True,
                "is_featured": True
            },
            {
                "name": "Easy2Go",
                "slug": "easy2go",
                "display_name": "Easy2Go",
                "logo_url": "/logos/easy2go.png",
                "vendor_type": "weight-based",
                "pricing_model": {
                    "base_rate_per_100lbs": 25.0,
                    "minimum_charge": 150.0,
                    "fuel_charge": "percentage",
                    "heavy_items": True
                },
                "coverage_areas": ["Mississauga", "Brampton", "Oakville"],
                "service_radius": 50.0,
                "phone": "800-989-8833",
                "email": "info@easy2go.ca",
                "website": "https://easy2go.ca",
                "is_active": True,
                "is_featured": False
            },
            {
                "name": "Pierre & Sons",
                "slug": "pierre-sons",
                "display_name": "Pierre & Sons",
                "logo_url": "/logos/pierre&sons logo.png",
                "vendor_type": "fixed-rate",
                "pricing_model": {
                    "base_rate": 199.0,
                    "additional_rooms": 50.0,
                    "fuel_charge": "fixed",
                    "heavy_items": True
                },
                "coverage_areas": ["Etobicoke", "Toronto", "Mississauga"],
                "service_radius": 75.0,
                "phone": "519-808-5122",
                "email": "info@pierreandsons.ca",
                "website": "https://pierreandsons.ca",
                "is_active": True,
                "is_featured": False
            },
            {
                "name": "Velocity Movers",
                "slug": "velocity-movers",
                "display_name": "Velocity Movers",
                "logo_url": "/logos/velocity movers logo.jpg",
                "vendor_type": "weight-based",
                "pricing_model": {
                    "base_rate_per_100lbs": 30.0,
                    "minimum_charge": 180.0,
                    "fuel_charge": "dynamic",
                    "heavy_items": True
                },
                "coverage_areas": ["Toronto", "Scarborough", "Markham"],
                "service_radius": 60.0,
                "phone": "905-499-2820",
                "email": "info@velocitymovers.ca",
                "website": "https://velocitymovers.ca",
                "is_active": True,
                "is_featured": False
            }
        ]
        
        for vendor_data in vendors:
            vendor = Vendor(**vendor_data)
            db.add(vendor)
            print(f"➕ Adding vendor: {vendor_data['name']}")
        
        db.commit()
        print(f"✅ Successfully initialized {len(vendors)} vendors")
        
    except Exception as e:
        print(f"❌ Error initializing vendors: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing vendors in database...")
    init_vendors()
    print("✅ Vendor initialization complete!") 