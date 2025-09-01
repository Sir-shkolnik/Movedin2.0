#!/usr/bin/env python3
"""
Initialize vendor users for testing the vendor admin portal
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.core.database import get_db, engine, Base
from app.models.user import User
from app.models.vendor_user import VendorUser

# Create database tables
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_vendor_user(db: Session, username: str, email: str, full_name: str, 
                      vendor_name: str, vendor_id: str, company_name: str, 
                      business_address: str, phone_number: str, password: str = "password123"):
    """Create a vendor user with all necessary details"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        print(f"User {username} already exists, skipping...")
        return existing_user
    
    # Create base user
    user = User(
        username=username,
        email=email,
        full_name=full_name,
        hashed_password=get_password_hash(password),
        role="vendor",
        is_active=True
    )
    db.add(user)
    db.flush()  # Get the user ID
    
    # Create vendor profile
    vendor_user = VendorUser(
        user_id=user.id,
        vendor_name=vendor_name,
        vendor_id=vendor_id,
        company_name=company_name,
        business_address=business_address,
        phone_number=phone_number,
        can_manage_locations=True,
        can_manage_pricing=True,
        can_view_leads=True,
        can_manage_profile=True,
        can_view_analytics=True,
        is_verified=True,
        is_active=True
    )
    db.add(vendor_user)
    db.commit()
    
    print(f"✅ Created vendor user: {username} ({vendor_name})")
    return user

def main():
    print("🚀 Initializing vendor users...")
    
    db = next(get_db())
    
    # Create vendor users for each vendor
    vendors = [
        {
            "username": "letsgetmoving",
            "email": "admin@letsgetmovinggroup.com",
            "full_name": "Let's Get Moving Admin",
            "vendor_name": "Let's Get Moving",
            "vendor_id": "lgm_001",
            "company_name": "Let's Get Moving Group",
            "business_address": "400 Industrial Avenue, Vancouver V6A2P3",
            "phone_number": "(604) 555-0123"
        },
        {
            "username": "easy2go",
            "email": "admin@easy2go.ca",
            "full_name": "Easy2Go Admin",
            "vendor_name": "Easy2Go",
            "vendor_id": "e2g_001",
            "company_name": "Easy2Go Moving",
            "business_address": "3397 American Drive, Mississauga, ON L4V 1T8",
            "phone_number": "(905) 555-0123"
        },
        {
            "username": "velocitymovers",
            "email": "admin@velocitymovers.ca",
            "full_name": "Velocity Movers Admin",
            "vendor_name": "Velocity Movers",
            "vendor_id": "vm_001",
            "company_name": "Velocity Movers",
            "business_address": "100 Howden Road, Unit 2, Toronto, ON M1R 3E4",
            "phone_number": "(416) 555-0123"
        },
        {
            "username": "pierresons",
            "email": "admin@pierresons.ca",
            "full_name": "Pierre & Sons Admin",
            "vendor_name": "Pierre & Sons",
            "vendor_id": "ps_001",
            "company_name": "Pierre & Sons Moving",
            "business_address": "1155 Kipling Ave, Etobicoke, ON M9B 3M4",
            "phone_number": "(416) 555-0124"
        }
    ]
    
    for vendor in vendors:
        create_vendor_user(db, **vendor)
    
    print("\n🎉 Vendor users initialized successfully!")
    print("\n📋 Login Credentials:")
    print("All vendors use password: password123")
    print("\nVendor Portals:")
    for vendor in vendors:
        print(f"- {vendor['vendor_name']}: {vendor['username']}")
    
    print("\n🌐 Access vendor portal at: /vendor/login")
    
    db.close()

if __name__ == "__main__":
    main() 