"""
Complete Email Flow Testing - Customer + Admin Notifications
Tests the full email system with both customer confirmation and admin notifications
"""

from fastapi import APIRouter, Body, HTTPException
from datetime import datetime
from typing import Dict, Any
import logging
from app.services.email_service import email_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/test-complete-email-flow")
async def test_complete_email_flow(
    customer_email: str = Body("udi.shkolnik@alicesolutions.co.il", embed=True),
    admin_email: str = Body("support@movedin.com", embed=True),
    lead_id: int = Body(999, embed=True)
):
    """
    Test the complete email flow:
    1. Customer confirmation email (to customer)
    2. Admin notification email (to support@movedin.com)
    """
    try:
        logger.info(f"🎯 Testing complete email flow for lead #{lead_id}")
        
        # Mock lead data for testing
        mock_lead_data = {
            "contact_data": {
                "firstName": "Sarah",
                "lastName": "Johnson", 
                "email": customer_email,
                "phone": "416-555-0123"
            },
            "quote_data": {
                "originAddress": "123 King Street West, Toronto, ON M5H 1A1",
                "destinationAddress": "456 Queen Street East, Mississauga, ON L5A 1B2",
                "moveDate": "2025-04-15",
                "moveTime": "09:00",
                "totalRooms": 3,
                "squareFootage": "1500-2000",
                "estimatedWeight": 2500,
                "stairsAtPickup": 2,
                "stairsAtDropoff": 0,
                "elevatorAtPickup": False,
                "elevatorAtDropoff": True,
                "heavyItems": {"piano": 1, "safe": 0, "treadmill": 1},
                "additionalServices": {"packing": True, "storage": False, "cleaning": True, "junk": False}
            },
            "selected_quote": {
                "vendor_slug": "pierre-sons",
                "vendor_name": "Pierre & Sons",
                "total_cost": 1847.50,
                "crew_size": 3,
                "truck_count": 1,
                "estimated_hours": 6.5,
                "travel_time_hours": 1.0,
                "breakdown": {
                    "labor": 1500.00,
                    "travel": 165.00,
                    "truck_fee": 180.00,
                    "heavy_items": 350.00,
                    "markup": 369.50
                }
            }
        }
        
        payment_id = "pi_demo_123456789"
        
        # Send customer confirmation email
        logger.info(f"📧 Sending customer confirmation to {customer_email}")
        customer_success = email_service.send_customer_confirmation(
            mock_lead_data, 
            customer_email, 
            lead_id, 
            payment_id
        )
        
        # Send admin notification email
        logger.info(f"📧 Sending admin notification to {admin_email}")
        admin_success = email_service.send_lead_notification_to_support(
            mock_lead_data, 
            lead_id
        )
        
        # Send payment confirmation to admin
        logger.info(f"📧 Sending payment confirmation to {admin_email}")
        payment_success = email_service.send_payment_notification_to_support(
            mock_lead_data, 
            lead_id, 
            payment_id
        )
        
        results = {
            "customer_confirmation": customer_success,
            "admin_lead_notification": admin_success,
            "admin_payment_notification": payment_success
        }
        
        all_success = all(results.values())
        
        logger.info(f"✅ Complete email flow test completed - Results: {results}")
        
        return {
            "success": all_success,
            "message": "Complete email flow test completed successfully!" if all_success else "Some emails failed to send",
            "timestamp": datetime.now().isoformat(),
            "test_data": {
                "customer": f"{mock_lead_data['contact_data']['firstName']} {mock_lead_data['contact_data']['lastName']}",
                "move": f"{mock_lead_data['quote_data']['originAddress']} → {mock_lead_data['quote_data']['destinationAddress']}",
                "vendor": mock_lead_data['selected_quote']['vendor_name'],
                "total_cost": f"${mock_lead_data['selected_quote']['total_cost']:.2f}",
                "lead_id": lead_id,
                "payment_id": payment_id
            },
            "results": results,
            "emails_sent": {
                "customer_email": customer_email,
                "admin_email": admin_email
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Complete email flow test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Complete email flow test failed: {str(e)}")

@router.post("/test-customer-email-only")
async def test_customer_email_only(
    customer_email: str = Body("udi.shkolnik@alicesolutions.co.il", embed=True),
    lead_id: int = Body(888, embed=True)
):
    """
    Test only the customer confirmation email
    """
    try:
        logger.info(f"🎯 Testing customer email only for lead #{lead_id}")
        
        # Mock lead data
        mock_lead_data = {
            "contact_data": {
                "firstName": "Michael",
                "lastName": "Chen",
                "email": customer_email,
                "phone": "647-555-0199"
            },
            "quote_data": {
                "originAddress": "789 Bay Street, Toronto, ON M5G 1M5",
                "destinationAddress": "321 Yonge Street, North York, ON M2N 6K5",
                "moveDate": "2025-05-20",
                "moveTime": "10:00",
                "totalRooms": 2,
                "squareFootage": "1200-1500",
                "estimatedWeight": 1800,
                "stairsAtPickup": 1,
                "stairsAtDropoff": 1,
                "elevatorAtPickup": True,
                "elevatorAtDropoff": True,
                "heavyItems": {"piano": 0, "safe": 1, "treadmill": 0},
                "additionalServices": {"packing": False, "storage": True, "cleaning": False, "junk": True}
            },
            "selected_quote": {
                "vendor_slug": "velocity-movers",
                "vendor_name": "Velocity Movers",
                "total_cost": 1295.75,
                "crew_size": 2,
                "truck_count": 1,
                "estimated_hours": 4.5,
                "travel_time_hours": 0.5,
                "breakdown": {
                    "labor": 900.00,
                    "travel": 95.75,
                    "truck_fee": 150.00,
                    "heavy_items": 150.00,
                    "markup": 259.15
                }
            }
        }
        
        payment_id = "pi_demo_987654321"
        
        # Send customer confirmation email
        logger.info(f"📧 Sending customer confirmation to {customer_email}")
        success = email_service.send_customer_confirmation(
            mock_lead_data, 
            customer_email, 
            lead_id, 
            payment_id
        )
        
        logger.info(f"✅ Customer email test completed - Success: {success}")
        
        return {
            "success": success,
            "message": "Customer email test completed successfully!" if success else "Customer email failed to send",
            "timestamp": datetime.now().isoformat(),
            "test_data": {
                "customer": f"{mock_lead_data['contact_data']['firstName']} {mock_lead_data['contact_data']['lastName']}",
                "move": f"{mock_lead_data['quote_data']['originAddress']} → {mock_lead_data['quote_data']['destinationAddress']}",
                "vendor": mock_lead_data['selected_quote']['vendor_name'],
                "total_cost": f"${mock_lead_data['selected_quote']['total_cost']:.2f}",
                "lead_id": lead_id,
                "payment_id": payment_id
            },
            "email_sent_to": customer_email
        }
        
    except Exception as e:
        logger.error(f"❌ Customer email test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Customer email test failed: {str(e)}")
