"""
Clean Email Test - Professional 3-Email System
Tests the clean email system with exactly 3 distinct emails
"""

from fastapi import APIRouter, Body, HTTPException
from datetime import datetime
from typing import Dict, Any
import logging
from app.services.clean_email_service import clean_email_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/test-clean-email-system")
async def test_clean_email_system(
    customer_email: str = Body("udi.shkolnik@alicesolutions.co.il", embed=True),
    lead_id: int = Body(777, embed=True)
):
    """
    Test the clean email system with exactly 3 emails:
    1. Customer confirmation (to customer_email)
    2. Vendor order (to support@movedin.com)
    3. Admin health status (to support@movedin.com)
    """
    try:
        logger.info(f"🎯 Testing clean email system for lead #{lead_id}")
        
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
        
        payment_id = "pi_demo_777888999"
        
        # Send exactly 3 emails
        results = clean_email_service.send_complete_booking_emails(
            mock_lead_data, 
            lead_id, 
            payment_id
        )
        
        all_success = all(results.values())
        
        logger.info(f"✅ Clean email system test completed - Results: {results}")
        
        return {
            "success": all_success,
            "message": "Clean email system test completed successfully!" if all_success else "Some emails failed to send",
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
                "vendor_email": "support@movedin.com",
                "admin_email": "support@movedin.com"
            },
            "email_types": {
                "1": "Customer Confirmation - Professional booking confirmation with estimate details",
                "2": "Vendor Order - Professional order with upsell opportunities and action items",
                "3": "Admin Health - System status and lead tracking information"
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Clean email system test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Clean email system test failed: {str(e)}")

@router.post("/test-customer-only-clean")
async def test_customer_only_clean(
    customer_email: str = Body("udi.shkolnik@alicesolutions.co.il", embed=True),
    lead_id: int = Body(666, embed=True)
):
    """
    Test only the customer confirmation email from clean system
    """
    try:
        logger.info(f"🎯 Testing customer-only clean email for lead #{lead_id}")
        
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
        
        payment_id = "pi_demo_666777888"
        
        # Send only customer email
        customer_subject = f"🎉 Booking Confirmation #{lead_id} - MovedIn"
        customer_body = clean_email_service.professional_email_templates.customer_confirmation_email(
            mock_lead_data, lead_id, payment_id
        )
        
        success = clean_email_service.send_email(
            customer_email, customer_subject, customer_body, is_html=True
        )
        
        logger.info(f"✅ Customer-only clean email test completed - Success: {success}")
        
        return {
            "success": success,
            "message": "Customer-only clean email test completed successfully!" if success else "Customer email failed to send",
            "timestamp": datetime.now().isoformat(),
            "test_data": {
                "customer": f"{mock_lead_data['contact_data']['firstName']} {mock_lead_data['contact_data']['lastName']}",
                "move": f"{mock_lead_data['quote_data']['originAddress']} → {mock_lead_data['quote_data']['destinationAddress']}",
                "vendor": mock_lead_data['selected_quote']['vendor_name'],
                "total_cost": f"${mock_lead_data['selected_quote']['total_cost']:.2f}",
                "lead_id": lead_id,
                "payment_id": payment_id
            },
            "email_sent_to": customer_email,
            "email_type": "Customer Confirmation - Professional booking confirmation with estimate details"
        }
        
    except Exception as e:
        logger.error(f"❌ Customer-only clean email test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Customer-only clean email test failed: {str(e)}")
