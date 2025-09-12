from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.email_service import email_service
from typing import Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/demo-beautiful-emails")
async def demo_beautiful_emails():
    """Demo the beautiful email templates with realistic move data"""
    try:
        logger.info("🎨 Starting beautiful email demo...")
        
        # Create realistic demo data
        demo_lead_data = {
            'contact_data': {
                'firstName': 'Sarah',
                'lastName': 'Johnson',
                'email': 'sarah.johnson@email.com',
                'phone': '416-555-0123'
            },
            'quote_data': {
                'originAddress': '123 King Street West, Toronto, ON M5H 1A1',
                'destinationAddress': '456 Queen Street East, Mississauga, ON L5A 1B2',
                'moveDate': '2025-04-15',
                'moveTime': '09:00',
                'totalRooms': 3,
                'squareFootage': '1,500-2,000',
                'estimatedWeight': 2500,
                'heavyItems': {'piano': 1, 'safe': 0, 'treadmill': 1},
                'stairsAtPickup': 2,
                'stairsAtDropoff': 0,
                'elevatorAtPickup': False,
                'elevatorAtDropoff': True,
                'additionalServices': {'packing': True, 'storage': False, 'cleaning': True, 'junk': False}
            },
            'selected_quote': {
                'vendor_name': 'Let\'s Get Moving',
                'total_cost': 1847.50,
                'crew_size': 3,
                'truck_count': 1,
                'estimated_hours': 5.5,
                'travel_time_hours': 1.2,
                'dispatcher_info': {
                    'name': 'Toronto Central',
                    'address': '789 Moving Lane, Toronto, ON M1M 1M1',
                    'total_distance_km': 28.5,
                    'sales_phone': '416-555-MOVE',
                    'email': 'toronto@letsgetmoving.com'
                }
            }
        }
        
        lead_id = 999
        payment_intent_id = "pi_demo_123456789"
        
        logger.info("📧 Sending beautiful vendor notification...")
        vendor_success = email_service.send_vendor_notification(
            lead_data=demo_lead_data,
            vendor_email="demo@letsgetmoving.com",
            lead_id=lead_id,
            payment_intent_id=payment_intent_id
        )
        
        logger.info("📧 Sending beautiful support notification...")
        support_success = email_service.send_lead_notification_to_support(
            lead_data=demo_lead_data,
            lead_id=lead_id
        )
        
        logger.info("📧 Sending beautiful payment notification...")
        payment_success = email_service.send_payment_notification_to_support(
            lead_data=demo_lead_data,
            lead_id=lead_id,
            payment_intent_id=payment_intent_id
        )
        
        logger.info(f"✅ Beautiful email demo completed!")
        logger.info(f"   Vendor notification: {'✅' if vendor_success else '❌'}")
        logger.info(f"   Support notification: {'✅' if support_success else '❌'}")
        logger.info(f"   Payment notification: {'✅' if payment_success else '❌'}")
        
        return {
            "success": True,
            "message": "Beautiful email demo completed successfully!",
            "timestamp": datetime.now().isoformat(),
            "demo_data": {
                "customer": f"{demo_lead_data['contact_data']['firstName']} {demo_lead_data['contact_data']['lastName']}",
                "move": f"{demo_lead_data['quote_data']['originAddress']} → {demo_lead_data['quote_data']['destinationAddress']}",
                "vendor": demo_lead_data['selected_quote']['vendor_name'],
                "total_cost": f"${demo_lead_data['selected_quote']['total_cost']:,.2f}",
                "lead_id": lead_id,
                "payment_id": payment_intent_id
            },
            "results": {
                "vendor_notification": vendor_success,
                "support_notification": support_success,
                "payment_notification": payment_success
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Beautiful email demo failed: {e}")
        raise HTTPException(status_code=500, detail=f"Beautiful email demo failed: {str(e)}")

@router.post("/demo-vendor-email")
async def demo_vendor_email():
    """Demo just the vendor email template"""
    try:
        logger.info("🎨 Demo vendor email template...")
        
        demo_data = {
            'contact_data': {
                'firstName': 'Michael',
                'lastName': 'Chen',
                'email': 'michael.chen@email.com',
                'phone': '647-555-0456'
            },
            'quote_data': {
                'originAddress': '789 Bay Street, Toronto, ON M5G 1M5',
                'destinationAddress': '321 Yonge Street, North York, ON M2N 6K5',
                'moveDate': '2025-04-20',
                'moveTime': '14:00',
                'totalRooms': 2,
                'squareFootage': '1,200-1,500',
                'estimatedWeight': 1800,
                'heavyItems': {'piano': 0, 'safe': 1, 'treadmill': 0},
                'stairsAtPickup': 1,
                'stairsAtDropoff': 1,
                'elevatorAtPickup': True,
                'elevatorAtDropoff': False,
                'additionalServices': {'packing': False, 'storage': True, 'cleaning': False, 'junk': True}
            },
            'selected_quote': {
                'vendor_name': 'Premium Movers Inc',
                'total_cost': 1245.75,
                'crew_size': 2,
                'truck_count': 1,
                'estimated_hours': 4.0,
                'travel_time_hours': 0.8,
                'dispatcher_info': {
                    'name': 'North York',
                    'address': '456 Moving Way, North York, ON M2M 2M2',
                    'total_distance_km': 15.2,
                    'sales_phone': '416-555-PREMIUM',
                    'email': 'northyork@premiummovers.com'
                }
            }
        }
        
        lead_id = 888
        payment_intent_id = "pi_demo_vendor_987654321"
        
        success = email_service.send_vendor_notification(
            lead_data=demo_data,
            vendor_email="demo@premiummovers.com",
            lead_id=lead_id,
            payment_intent_id=payment_intent_id
        )
        
        return {
            "success": success,
            "message": "Vendor email demo completed!",
            "timestamp": datetime.now().isoformat(),
            "demo_customer": f"{demo_data['contact_data']['firstName']} {demo_data['contact_data']['lastName']}",
            "demo_move": f"{demo_data['quote_data']['originAddress']} → {demo_data['quote_data']['destinationAddress']}",
            "demo_vendor": demo_data['selected_quote']['vendor_name']
        }
        
    except Exception as e:
        logger.error(f"❌ Vendor email demo failed: {e}")
        raise HTTPException(status_code=500, detail=f"Vendor email demo failed: {str(e)}")
