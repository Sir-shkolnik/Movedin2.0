import os
import stripe
import logging
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.core.database import get_db
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.models.lead import Lead
from app.models.vendor import Vendor

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
logger = logging.getLogger(__name__)

router = APIRouter(tags=["payment"])

class PaymentIntentRequest(BaseModel):
    amount: int
    currency: str = "cad"
    customer_email: Optional[str] = None
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    selectedQuote: Optional[Dict[str, Any]] = None
    vendor: Optional[Dict[str, Any]] = None
    fromDetails: Optional[Dict[str, Any]] = None
    contact: Optional[Dict[str, Any]] = None

class PaymentConfirmRequest(BaseModel):
    payment_intent_id: str
    lead_data: Dict[str, Any]

from app.services.email_service import email_service

async def send_vendor_email(lead_data: Dict[str, Any], vendor_email: str, lead_id: int, payment_intent_id: str = None):
    """
    Send email notification to vendor after successful payment
    """
    try:
        # Send vendor notification
        vendor_success = email_service.send_vendor_notification(lead_data, vendor_email, lead_id, payment_intent_id)
        
        # Send support notification for new leads
        if not payment_intent_id:
            support_success = email_service.send_lead_notification_to_support(lead_data, lead_id)
            logger.info(f"Support notification sent: {support_success}")
        
        return vendor_success
        
    except Exception as e:
        logger.error(f"Failed to send vendor email: {e}")
        return False

@router.post('/create-intent')
async def create_payment_intent(req: PaymentIntentRequest, db: Session = Depends(get_db)):
    """
    Create a Stripe PaymentIntent for the $1 CAD deposit
    """
    try:
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # IMPORTANT: Create lead BEFORE payment with status 'pending_payment'
        logger.info("Creating lead BEFORE payment...")
        
        # Create lead with pending payment status
        try:
            # Import here to avoid circular imports
            from app.api.routes.leads import create_lead_internal
            
            # Prepare lead data in the format expected by create_lead_internal
            lead_data_for_creation = {
                'quote_data': {
                    'originAddress': req.fromDetails.get('originAddress', req.fromDetails.get('from', '')),
                    'destinationAddress': req.fromDetails.get('destinationAddress', req.fromDetails.get('to', '')),
                    'moveDate': req.fromDetails.get('moveDate', req.fromDetails.get('date', '')),
                    'moveTime': req.fromDetails.get('moveTime', req.fromDetails.get('time', '')),
                    'totalRooms': req.fromDetails.get('totalRooms', req.fromDetails.get('rooms', 0)),
                    'squareFootage': req.fromDetails.get('squareFootage', req.fromDetails.get('sqft', '')),
                    'estimatedWeight': req.fromDetails.get('estimatedWeight', 2500),
                    'heavyItems': req.fromDetails.get('heavyItems', {'piano': 0, 'safe': 0, 'treadmill': 0}),
                    'stairsAtPickup': req.fromDetails.get('stairsAtPickup', req.fromDetails.get('stairs', 0)),
                    'stairsAtDropoff': req.fromDetails.get('stairsAtDropoff', 0),
                    'elevatorAtPickup': req.fromDetails.get('elevatorAtPickup', False),
                    'elevatorAtDropoff': req.fromDetails.get('elevatorAtDropoff', False),
                    'additionalServices': req.fromDetails.get('additionalServices', {'packing': False, 'storage': False, 'cleaning': False, 'junk': False})
                },
                'selected_quote': {
                    'vendor_slug': req.selectedQuote.get('vendor_id'),  # Use vendor_id as slug
                    'vendor_name': req.selectedQuote.get('vendor_name'),
                    'total_cost': req.selectedQuote.get('total_cost'),
                    'crew_size': req.selectedQuote.get('crew_size', 2),
                    'truck_count': req.selectedQuote.get('truck_count', 1),
                    'estimated_hours': req.selectedQuote.get('estimated_hours', 4.0),
                    'travel_time_hours': req.selectedQuote.get('travel_time_hours', 1.0),
                    'breakdown': req.selectedQuote.get('breakdown', {})
                },
                'contact_data': req.contact
            }
            
            lead_result = await create_lead_internal(lead_data_for_creation, db, 'pending_payment')
            lead_id = lead_result.get('id')
            logger.info(f"Lead created with ID: {lead_id} and status 'pending_payment'")
        except Exception as lead_error:
            logger.error(f"Failed to create lead: {lead_error}")
            # Continue with payment intent creation even if lead creation fails
            lead_id = None
        
        # Store lead data in metadata for webhook processing (keep under 500 chars)
        metadata = {
            'lead_id': str(lead_id) if lead_id else '',
            'vendor_slug': req.selectedQuote.get('vendor_id', '') if req.selectedQuote else '',
            'customer_email': req.customer_email or '',
            'amount': str(req.amount),
            'currency': req.currency
        }
        
        # Create a dynamic Stripe Payment Link with proper redirect URL
        payment_link = stripe.PaymentLink.create(
            line_items=[{
                'price_data': {
                    'currency': req.currency,
                    'product_data': {
                        'name': 'MovedIn 2.0 - $1 CAD Deposit',
                        'description': 'Deposit to reserve your move date and time'
                    },
                    'unit_amount': req.amount,
                },
                'quantity': 1,
            }],
            after_completion={
                'type': 'redirect',
                'redirect': {
                    'url': 'https://movedin-frontend.onrender.com/payment-redirect'
                }
            },
            metadata=metadata,
            allow_promotion_codes=True
        )
        
        logger.info(f"Created payment link: {payment_link.id} for amount: {req.amount}")
        
        return {
            'payment_link_url': payment_link.url,
            'payment_intent_id': payment_link.id,
            'amount': req.amount,
            'currency': req.currency,
            'lead_id': lead_id
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment intent creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment intent")

@router.post("/process-manual")
async def process_manual_payment(request: Request, db: Session = Depends(get_db)):
    """Manually process a payment that wasn't handled by webhook"""
    try:
        body = await request.json()
        payment_intent_id = body.get('payment_intent_id')
        
        if not payment_intent_id:
            return {"success": False, "error": "No payment_intent_id provided"}
        
        # Retrieve the payment from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status != 'succeeded':
            return {"success": False, "error": f"Payment not succeeded. Status: {payment_intent.status}"}
        
        # Get metadata
        metadata = payment_intent.metadata
        lead_id = metadata.get('lead_id')
        
        if not lead_id:
            return {"success": False, "error": "No lead_id in payment metadata"}
        
        # Update lead in database
        lead = db.query(Lead).filter(Lead.id == int(lead_id)).first()
        if not lead:
            return {"success": False, "error": f"Lead {lead_id} not found"}
        
        # Update lead status and payment details
        lead.status = 'payment_completed'
        lead.payment_intent_id = payment_intent_id
        lead.payment_amount = payment_intent.amount / 100.0  # Convert from cents to dollars
        lead.payment_currency = payment_intent.currency.upper()
        lead.payment_status = payment_intent.status
        db.commit()
        
        # Send email notifications
        try:
            if lead.selected_vendor_id:
                vendor = db.query(Vendor).filter(Vendor.id == lead.selected_vendor_id).first()
                if vendor and vendor.email:
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
                            'vendor_name': vendor.name,
                            'total_cost': lead.payment_amount or 100.00,  # Use actual payment amount
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
                    
                    await send_vendor_email(lead_data, vendor.email, int(lead_id))
                    logger.info(f"Vendor email sent to {vendor.email} for lead {lead_id}")
                else:
                    logger.warning(f"No vendor email found for vendor {lead.selected_vendor_id}")
        except Exception as email_error:
            logger.error(f"Failed to send vendor email: {email_error}")
        
        return {
            "success": True, 
            "message": f"Payment {payment_intent_id} processed successfully",
            "lead_id": lead_id,
            "status": "payment_completed"
        }
            
    except Exception as e:
        logger.error(f"Manual payment processing error: {str(e)}")
        return {"success": False, "error": str(e)}

@router.post("/verify")
async def verify_payment(request: Request):
    """Verify payment status from frontend"""
    try:
        body = await request.json()
        session_id = body.get('session_id')
        
        if not session_id:
            return {"success": False, "error": "No session_id provided"}
        
        # Retrieve the session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            return {"success": True, "session": session}
        else:
            return {"success": False, "error": "Payment not completed"}
            
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        return {"success": False, "error": str(e)}

@router.post('/webhook/stripe')
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle Stripe webhook events (payment success, etc.)
    """
    try:
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Get the webhook secret
        webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
        if not webhook_secret:
            logger.error("STRIPE_WEBHOOK_SECRET not configured")
            raise HTTPException(status_code=500, detail="Webhook secret not configured")
        
        # Get the request body
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        if not sig_header:
            logger.error("No stripe-signature header")
            raise HTTPException(status_code=400, detail="No signature header")
        
        try:
            # Verify webhook signature
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            logger.error(f"Invalid payload: {e}")
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {e}")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        if event['type'] == 'checkout.session.completed':
            await handle_payment_success(event['data']['object'], db)
        elif event['type'] == 'checkout.session.expired':
            await handle_payment_failure(event['data']['object'], db)
        else:
            logger.info(f"Unhandled event type: {event['type']}")
        
        return {'status': 'success'}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def handle_payment_success(checkout_session: Dict[str, Any], db: Session):
    """
    Handle successful payment and update lead status
    """
    try:
        session_id = checkout_session['id']
        metadata = checkout_session.get('metadata', {})
        
        logger.info(f"Processing successful payment: {session_id}")
        
        # Extract lead_id from metadata
        lead_id = metadata.get('lead_id')
        if not lead_id:
            logger.error(f"No lead_id found in checkout session: {session_id}")
            return
        
        # Retrieve full lead data from the database
        lead = db.query(Lead).filter(Lead.id == int(lead_id)).first()
        if not lead:
            logger.error(f"Lead with ID {lead_id} not found in database.")
            return
        
        # Update lead status to payment_completed with payment details
        lead.status = 'payment_completed'
        lead.payment_intent_id = session_id
        lead.payment_amount = checkout_session.get('amount_total', 0) / 100.0  # Convert from cents to dollars
        lead.payment_currency = checkout_session.get('currency', 'cad').upper()
        lead.payment_status = checkout_session.get('payment_status', 'paid')
        db.commit()
        db.refresh(lead)
        
        logger.info(f"Payment confirmed and lead {lead_id} status updated to 'payment_completed'")
        
        # Send email notification to vendor
        try:
            if lead.selected_vendor_id:
                vendor = db.query(Vendor).filter(Vendor.id == lead.selected_vendor_id).first()
                if vendor and vendor.email:
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
                            'vendor_name': vendor.name,
                            'total_cost': lead.payment_amount or 100.00,  # Use actual payment amount
                            'crew_size': 2,   # Default values
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
                    
                    await send_vendor_email(lead_data, vendor.email, int(lead_id))
                    logger.info(f"Vendor email sent to {vendor.email} for lead {lead_id}")
                else:
                    logger.warning(f"No vendor email found for vendor {lead.selected_vendor_id}")
            else:
                logger.warning(f"No vendor found for lead {lead_id}")
        except Exception as email_error:
            logger.error(f"Failed to send vendor email: {email_error}")
            # Don't fail the payment processing if email fails
        
    except Exception as e:
        logger.error(f"Failed to handle payment success: {e}")

async def handle_payment_failure(checkout_session: Dict[str, Any], db: Session):
    """
    Handle failed payment
    """
    try:
        session_id = checkout_session['id']
        logger.info(f"Payment failed: {session_id}")
        # You could implement retry logic or customer notification here
    except Exception as e:
        logger.error(f"Failed to handle payment failure: {e}")

@router.post('/confirm-payment')
async def confirm_payment(
    req: PaymentConfirmRequest,
    db: Session = Depends(get_db)
):
    """
    Confirm payment and save lead data (manual confirmation endpoint)
    """
    try:
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Retrieve the payment intent
        payment_intent = stripe.PaymentIntent.retrieve(req.payment_intent_id)
        
        # For development/testing, allow payment intents that are not yet succeeded
        # In production, this should only allow 'succeeded' status
        allowed_statuses = ['succeeded', 'requires_payment_method', 'requires_confirmation']
        if payment_intent.status not in allowed_statuses:
            raise HTTPException(status_code=400, detail=f"Payment not in valid state: {payment_intent.status}")
        
        # Check if lead already exists (from create-intent)
        existing_lead = None
        if req.lead_data.get('lead_id'):
            try:
                existing_lead = db.query(Lead).filter(Lead.id == req.lead_data['lead_id']).first()
            except:
                pass
        
        if existing_lead:
            # Update existing lead status to 'payment_completed'
            existing_lead.status = 'payment_completed'
            existing_lead.payment_intent_id = req.payment_intent_id
            db.commit()
            db.refresh(existing_lead)
            lead_id = existing_lead.id
            logger.info(f"Updated existing lead {lead_id} status to 'payment_completed'")
        else:
            # Create new lead if none exists
            try:
                from app.api.routes.leads import create_lead_internal
                lead_result = await create_lead_internal(req.lead_data, db, 'payment_completed')
                lead_id = lead_result.get('id')
                logger.info(f"Created new lead {lead_id} with status 'payment_completed'")
            except Exception as lead_error:
                logger.error(f"Failed to save lead data: {lead_error}")
                raise HTTPException(status_code=500, detail=f"Failed to save lead: {str(lead_error)}")
        
        # Send email notifications
        try:
            # Get vendor email from the lead
            lead = db.query(Lead).filter(Lead.id == lead_id).first()
            if lead and lead.selected_vendor_id:
                # Get vendor details
                vendor = db.query(Vendor).filter(Vendor.id == lead.selected_vendor_id).first()
                if vendor and vendor.email:
                    # Send vendor notification with payment intent
                    await send_vendor_email(req.lead_data, vendor.email, lead_id, req.payment_intent_id)
                    logger.info(f"Vendor email sent to {vendor.email} for lead {lead_id}")
                else:
                    logger.warning(f"No vendor email found for vendor {lead.selected_vendor_id}")
            else:
                logger.warning(f"No vendor found for lead {lead_id}")
            
            # Send payment notification to support
            support_success = email_service.send_payment_notification_to_support(req.lead_data, lead_id, req.payment_intent_id)
            logger.info(f"Payment notification sent to support: {support_success}")
            
        except Exception as email_error:
            logger.error(f"Failed to send email notifications: {email_error}")
            # Don't fail the payment confirmation if email fails
        
        return {
            'status': 'success',
            'payment_intent_id': req.payment_intent_id,
            'lead_id': lead_id,
            'message': 'Payment processed and lead saved successfully'
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment confirmation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to confirm payment")

@router.get('/test-connection')
async def test_stripe_connection():
    """
    Test Stripe API connection
    """
    try:
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Create a test payment intent
        intent = stripe.PaymentIntent.create(
            amount=100,
            currency='cad',
            description='Test connection',
            automatic_payment_methods={'enabled': True}
        )
        
        return {
            'status': 'success',
            'message': 'Stripe connection successful',
            'test_intent_id': intent.id
        }
        
    except Exception as e:
        logger.error(f"Stripe connection test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Connection test failed: {str(e)}") 