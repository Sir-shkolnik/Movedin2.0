from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.email_service import email_service
from typing import Dict, Any

router = APIRouter()

@router.post("/test-email")
async def test_email_notification(db: Session = Depends(get_db)):
    """Test endpoint to verify email notifications work"""
    try:
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
        
        # Test support notification
        support_success = email_service.send_lead_notification_to_support(test_lead_data, 999)
        
        # Test vendor notification
        vendor_success = email_service.send_vendor_notification(test_lead_data, 'test@vendor.com', 999)
        
        # Test payment notification
        payment_success = email_service.send_payment_notification_to_support(test_lead_data, 999, 'pi_test123')
        
        return {
            'status': 'success',
            'message': 'Email test completed',
            'results': {
                'support_notification': support_success,
                'vendor_notification': vendor_success,
                'payment_notification': payment_success
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email test failed: {str(e)}")
