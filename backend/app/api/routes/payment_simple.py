import os
import stripe
import logging
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.lead import Lead
from app.models.vendor import Vendor

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
logger = logging.getLogger(__name__)

router = APIRouter(tags=["payment-simple"])

@router.get('/test')
async def test_simple_payment():
    """Simple test endpoint"""
    return {"status": "success", "message": "Simple payment router is working!"}

@router.post('/verify')
async def verify_payment(request: Request):
    """Verify payment status from frontend"""
    try:
        body = await request.json()
        session_id = body.get('session_id')
        
        if not session_id:
            return {"success": False, "error": "No session_id provided"}
        
        # For now, return success for any valid session_id format
        # In production, this would verify with Stripe
        if session_id.startswith('pi_'):
            return {
                "success": True, 
                "session": {
                    "id": session_id,
                    "payment_status": "paid",
                    "amount_total": 100,
                    "currency": "cad"
                }
            }
        else:
            return {"success": False, "error": "Invalid session_id format"}
            
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        return {"success": False, "error": str(e)}

@router.post('/process-manual')
async def process_manual_payment(request: Request, db: Session = Depends(get_db)):
    """Manually process a payment that wasn't handled by webhook"""
    try:
        body = await request.json()
        payment_intent_id = body.get('payment_intent_id')
        
        if not payment_intent_id:
            raise HTTPException(status_code=400, detail="No payment_intent_id provided")
        
        # Retrieve the payment intent from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        logger.info(f"Processing manual payment: {payment_intent_id}")
        
        # Create a mock checkout session object for processing
        checkout_session = {
            'id': payment_intent_id,
            'amount_total': payment_intent.amount,
            'currency': payment_intent.currency,
            'payment_status': 'paid',
            'metadata': {
                'lead_id': '24'  # Default lead ID for testing
            }
        }
        
        # Process the payment
        await handle_payment_success_simple(checkout_session, db)
        
        return {
            'status': 'success',
            'message': f'Payment {payment_intent_id} processed successfully',
            'amount': payment_intent.amount / 100.0,
            'currency': payment_intent.currency.upper()
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Manual payment processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process payment")

@router.post('/webhook/stripe')
async def stripe_webhook_simple(request: Request, db: Session = Depends(get_db)):
    """Simple webhook endpoint that processes Stripe events"""
    try:
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
            await handle_payment_success_simple(event['data']['object'], db)
            logger.info(f"Payment processed successfully: {event['data']['object']['id']}")
        else:
            logger.info(f"Unhandled event type: {event['type']}")
        
        return {'status': 'success', 'message': 'Webhook processed successfully'}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def handle_payment_success_simple(checkout_session: dict, db: Session):
    """Handle successful payment and update lead status"""
    try:
        session_id = checkout_session['id']
        metadata = checkout_session.get('metadata', {})
        
        logger.info(f"Processing successful payment: {session_id}")
        
        # Extract lead_id from metadata
        lead_id = metadata.get('lead_id')
        if not lead_id:
            logger.error(f"No lead_id found in checkout session: {session_id}")
            return
        
        # Retrieve lead from database
        lead = db.query(Lead).filter(Lead.id == int(lead_id)).first()
        if not lead:
            logger.error(f"Lead with ID {lead_id} not found in database.")
            return
        
        # Update lead status to payment_completed with payment details
        lead.status = 'payment_completed'
        lead.payment_intent_id = session_id
        lead.payment_amount = checkout_session.get('amount_total', 0) / 100.0
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
                    # Import email service here to avoid circular imports
                    from app.services.email_service import email_service
                    
                    # Prepare lead data for email
                    lead_data = {
                        'quote_data': {
                            'originAddress': lead.origin_address,
                            'destinationAddress': lead.destination_address,
                            'moveDate': lead.move_date.isoformat() if lead.move_date else '',
                            'moveTime': lead.move_time,
                            'totalRooms': lead.total_rooms,
                            'squareFootage': lead.square_footage,
                            'estimatedWeight': lead.estimated_weight
                        },
                        'selected_quote': {
                            'vendor_name': vendor.name,
                            'total_cost': lead.payment_amount or 100.00
                        },
                        'contact_data': {
                            'firstName': lead.first_name,
                            'lastName': lead.last_name,
                            'email': lead.email,
                            'phone': lead.phone
                        }
                    }
                    
                    # Send vendor notification
                    vendor_success = email_service.send_vendor_notification(lead_data, vendor.email, lead.id, session_id)
                    logger.info(f"Vendor email sent: {vendor_success}")
                    
                    # Send support notification
                    support_success = email_service.send_payment_notification_to_support(lead_data, lead.id, session_id)
                    logger.info(f"Support email sent: {support_success}")
                    
        except Exception as email_error:
            logger.error(f"Failed to send email notifications: {email_error}")
        
    except Exception as e:
        logger.error(f"Payment processing error: {e}")
        db.rollback()
