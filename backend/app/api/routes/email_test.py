from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.email_service import email_service
from typing import Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/test-email")
async def test_email_notification(db: Session = Depends(get_db)):
    """Test endpoint to verify GoDaddy 365 email notifications work"""
    try:
        logger.info("🧪 Starting GoDaddy 365 email test...")
        
        # Test data
        test_lead_data = {
            'contact_data': {
                'firstName': 'Test',
                'lastName': 'Customer',
                'email': 'test@example.com',
                'phone': '416-555-0123'
            },
            'quote_data': {
                'originAddress': '123 Test St, Toronto, ON',
                'destinationAddress': '456 Test Ave, Mississauga, ON',
                'moveDate': '2025-04-15',
                'moveTime': '09:00',
                'totalRooms': 3,
                'squareFootage': '1500-2000',
                'estimatedWeight': 2500,
                'heavyItems': {'piano': 0, 'safe': 0, 'treadmill': 0},
                'stairsAtPickup': 0,
                'stairsAtDropoff': 0,
                'elevatorAtPickup': False,
                'elevatorAtDropoff': False,
                'additionalServices': {'packing': False, 'storage': False, 'cleaning': False, 'junk': False}
            },
            'selected_quote': {
                'vendor_name': 'Let\'s Get Moving',
                'total_cost': 1734.36,
                'crew_size': 3,
                'truck_count': 1,
                'estimated_hours': 5.0,
                'travel_time_hours': 1.0,
                'dispatcher_info': {
                    'name': 'Toronto',
                    'address': '123 Main St, Toronto, ON',
                    'total_distance_km': 25.0,
                    'sales_phone': '416-555-0123',
                    'email': 'toronto@letsgetmoving.com'
                }
            }
        }
        
        logger.info("📧 Testing support notification...")
        # Test support notification
        support_success = email_service.send_lead_notification_to_support(test_lead_data, 999)
        
        logger.info("📧 Testing vendor notification...")
        # Test vendor notification
        vendor_success = email_service.send_vendor_notification(test_lead_data, 'test@vendor.com', 999)
        
        logger.info("📧 Testing payment notification...")
        # Test payment notification
        payment_success = email_service.send_payment_notification_to_support(test_lead_data, 999, 'pi_test123')
        
        logger.info(f"✅ Email test completed - Support: {support_success}, Vendor: {vendor_success}, Payment: {payment_success}")
        
        return {
            'status': 'success',
            'message': 'GoDaddy 365 email test completed',
            'timestamp': datetime.now().isoformat(),
            'smtp_server': 'smtp.office365.com',
            'results': {
                'support_notification': support_success,
                'vendor_notification': vendor_success,
                'payment_notification': payment_success
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Email test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Email test failed: {str(e)}")

@router.post("/test-simple")
async def test_simple_email():
    """Test simple email sending with GoDaddy 365"""
    try:
        logger.info("🧪 Testing simple email with GoDaddy 365...")
        
        test_subject = "MovedIn 2.0 - GoDaddy 365 Email Test"
        test_body = f"""
        🧪 MovedIn 2.0 Email System Test
        
        This is a test email from MovedIn 2.0 using GoDaddy 365 email.
        
        Test Details:
        - Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        - SMTP Server: smtp.office365.com
        - Port: 587
        
        If you receive this email, the GoDaddy 365 email system is working correctly!
        
        Best regards,
        MovedIn Team
        """
        
        logger.info("📧 Sending simple test email...")
        success = email_service.send_email(
            to_email="support@movedin.com",
            subject=test_subject,
            body=test_body
        )
        
        if success:
            logger.info("✅ Simple email test successful")
            return {
                "success": True,
                "message": "Simple email test successful with GoDaddy 365",
                "timestamp": datetime.now().isoformat(),
                "smtp_server": "smtp.office365.com"
            }
        else:
            logger.error("❌ Simple email test failed")
            return {
                "success": False,
                "message": "Simple email test failed",
                "timestamp": datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"❌ Simple email test error: {e}")
        raise HTTPException(status_code=500, detail=f"Simple email test failed: {str(e)}")

@router.get("/config")
async def get_email_config():
    """Get current email configuration"""
    try:
        return {
            "smtp_server": email_service.smtp_server,
            "smtp_port": email_service.smtp_port,
            "smtp_username": email_service.smtp_username,
            "password_configured": bool(email_service.smtp_password),
            "support_email": email_service.support_email,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Error getting email config: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get email config: {str(e)}")
