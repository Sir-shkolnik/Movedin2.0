#!/usr/bin/env python3
"""
Manual Payment Processing Script
Process recent payments that weren't handled by webhook
"""

import os
import sys
import stripe
from datetime import datetime
import requests
import json

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.lead import Lead
from app.services.email_service import EmailService

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Payment IDs from Stripe dashboard
RECENT_PAYMENTS = [
    "pi_3S2MYvE963QK6A6z10zC3O8M",  # Sep 1, 1:29 AM
    "pi_3S2MSHE963QK6A6z1Jfupkcb",  # Sep 1, 1:22 AM
    "pi_3S2MJxE963QK6A6z1WtYUX5S",  # Sep 1, 1:14 AM
]

async def process_payment(payment_intent_id):
    """Process a single payment"""
    try:
        print(f"🔍 Processing payment: {payment_intent_id}")
        
        # Retrieve payment from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status != 'succeeded':
            print(f"❌ Payment {payment_intent_id} not succeeded. Status: {payment_intent.status}")
            return False
        
        # Get metadata
        metadata = payment_intent.metadata
        lead_id = metadata.get('lead_id')
        
        if not lead_id:
            print(f"❌ No lead_id in metadata for payment {payment_intent_id}")
            return False
        
        print(f"📋 Found lead_id: {lead_id}")
        
        # Update lead in database
        db = SessionLocal()
        try:
            lead = db.query(Lead).filter(Lead.id == int(lead_id)).first()
            
            if not lead:
                print(f"❌ Lead {lead_id} not found in database")
                return False
            
            # Update lead status
            lead.status = 'payment_completed'
            lead.payment_intent_id = payment_intent_id
            db.commit()
            
            print(f"✅ Lead {lead_id} updated to payment_completed")
            
            # Send email notifications
            email_service = EmailService()
            
            # Prepare lead data for email
            lead_data = {
                'quote_data': {
                    'originAddress': lead.origin_address,
                    'destinationAddress': lead.destination_address,
                    'moveDate': lead.move_date.isoformat() if lead.move_date else '',
                    'moveTime': lead.move_time,
                    'totalRooms': lead.total_rooms,
                    'squareFootage': lead.square_footage,
                    'estimatedWeight': lead.estimated_weight,
                    'heavyItems': lead.heavy_items or {},
                    'stairsAtPickup': lead.stairs_at_pickup,
                    'stairsAtDropoff': lead.stairs_at_dropoff,
                    'elevatorAtPickup': lead.elevator_at_pickup,
                    'elevatorAtDropoff': lead.elevator_at_dropoff,
                    'additionalServices': lead.additional_services or {}
                },
                'selected_quote': {
                    'vendor_name': 'Selected Vendor',  # Will be updated from vendor table
                    'total_cost': 100.00,  # $1 deposit
                    'crew_size': 2,
                    'truck_count': 1,
                    'estimated_hours': 4.0,
                    'travel_time_hours': 1.0
                },
                'contact_data': {
                    'firstName': lead.first_name,
                    'lastName': lead.last_name,
                    'email': lead.email,
                    'phone': lead.phone
                }
            }
            
            # Send support notification
            await email_service.send_payment_notification_to_support(lead_data, int(lead_id), payment_intent_id)
            print(f"📧 Support email sent for lead {lead_id}")
            
            # Send vendor notification if vendor exists
            if lead.selected_vendor_id:
                from app.models.vendor import Vendor
                vendor = db.query(Vendor).filter(Vendor.id == lead.selected_vendor_id).first()
                if vendor and vendor.email:
                    await email_service.send_vendor_notification(lead_data, vendor.email, int(lead_id))
                    print(f"📧 Vendor email sent to {vendor.email} for lead {lead_id}")
                else:
                    print(f"⚠️ No vendor email found for vendor {lead.selected_vendor_id}")
            
            return True
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error processing payment {payment_intent_id}: {str(e)}")
        return False

async def main():
    """Main function to process all recent payments"""
    print("🚀 Starting manual payment processing...")
    print(f"📅 Processing {len(RECENT_PAYMENTS)} recent payments")
    
    success_count = 0
    
    for payment_id in RECENT_PAYMENTS:
        if await process_payment(payment_id):
            success_count += 1
        print("-" * 50)
    
    print(f"✅ Processing complete: {success_count}/{len(RECENT_PAYMENTS)} payments processed successfully")
    
    if success_count > 0:
        print("📧 Email notifications sent for successful payments")
        print("💳 Payment status updated in database")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
