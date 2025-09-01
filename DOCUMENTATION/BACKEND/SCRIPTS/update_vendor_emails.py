#!/usr/bin/env python3
"""
Script to update vendor emails in the database
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models.vendor import Vendor

def update_vendor_emails():
    """Update vendor emails with proper addresses"""
    
    # Vendor email mappings
    vendor_emails = {
        "lets-get-moving": "bookings@letsgetmovinggroup.com",
        "easy2go": "info@easy2gomoving.com", 
        "velocity-movers": "bookings@velocitymovers.ca",
        "pierre-sons": "info@pierreandsonsmoving.com"
    }
    
    db = SessionLocal()
    
    try:
        for slug, email in vendor_emails.items():
            vendor = db.query(Vendor).filter(Vendor.slug == slug).first()
            if vendor:
                vendor.email = email
                print(f"✅ Updated {vendor.name} email to: {email}")
            else:
                print(f"❌ Vendor not found: {slug}")
        
        db.commit()
        print("\n🎉 All vendor emails updated successfully!")
        
        # Display updated vendors
        print("\n📧 Updated Vendor Emails:")
        vendors = db.query(Vendor).all()
        for vendor in vendors:
            print(f"  {vendor.name}: {vendor.email or 'No email set'}")
            
    except Exception as e:
        print(f"❌ Error updating vendor emails: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_vendor_emails()
