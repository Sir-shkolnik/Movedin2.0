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

@router.post('/create-payment-link')
async def create_payment_link(request: Request, db: Session = Depends(get_db)):
    """Create a Stripe Payment Link with proper metadata"""
    try:
        body = await request.json()
        amount = body.get('amount', 100)  # Default $1 CAD (testing)
        currency = body.get('currency', 'cad')
        lead_id = body.get('lead_id')
        customer_email = body.get('customer_email', '')
        vendor_slug = body.get('vendor_slug', '')
        
        if not lead_id:
            raise HTTPException(status_code=400, detail="lead_id is required")
        
        # Prepare metadata for the payment link
        metadata = {
            'lead_id': str(lead_id),
            'customer_email': customer_email,
            'vendor_slug': vendor_slug,
            'amount': str(amount),
            'currency': currency
        }
        
        logger.info(f"Creating payment link for lead {lead_id} with amount {amount} {currency}")
        
        # Create a dynamic Stripe Checkout Session for better redirect control
        checkout_session = stripe.checkout.Session.create(
            line_items=[{
                'price_data': {
                    'currency': currency,
                    'product_data': {
                        'name': 'MovedIn 2.0 - $1 CAD Deposit',
                        'description': 'Deposit to reserve your move date and time'
                    },
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'https://movedin-frontend.onrender.com/#/step7?lead_id={lead_id}&vendor={vendor_slug}&amount={amount}&currency={currency}&email={customer_email}&session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url='https://movedin-frontend.onrender.com/#/',
            metadata=metadata,
            allow_promotion_codes=True,
            # Fix Stripe internationalization issues
            locale='en',
            customer_email=customer_email,
            # Add proper billing address collection
            billing_address_collection='auto',
            # Add payment method types
            payment_method_types=['card'],
            # Add automatic tax calculation
            automatic_tax={'enabled': False}
        )
        
        logger.info(f"Created checkout session: {checkout_session.id} for lead {lead_id}")
        
        return {
            'payment_link_url': checkout_session.url,
            'payment_intent_id': checkout_session.id,
            'amount': amount,
            'currency': currency,
            'lead_id': lead_id,
            'metadata': metadata,
            'session_id': checkout_session.id
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment link creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment link")

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
        lead_id = body.get('lead_id')  # Get the provided lead_id
        
        if not payment_intent_id:
            raise HTTPException(status_code=400, detail="payment_intent_id is required")
        
        # Retrieve the payment intent from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        logger.info(f"Processing manual payment: {payment_intent_id} for lead: {lead_id}")
        
        # Create a mock checkout session object for processing
        checkout_session = {
            'id': payment_intent_id,
            'amount_total': payment_intent.amount,
            'currency': payment_intent.currency,
            'payment_status': 'paid',
            'metadata': {
                'lead_id': str(lead_id) if lead_id else None  # Use provided lead_id or None
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

@router.post('/update-payment-amounts')
async def update_payment_amounts(request: Request, db: Session = Depends(get_db)):
    """Manually update payment amounts for completed leads without Stripe verification"""
    try:
        body = await request.json()
        lead_id = body.get('lead_id')
        amount = body.get('amount', 100)  # Default $1 CAD (testing)
        currency = body.get('currency', 'cad')
        
        if not lead_id:
            raise HTTPException(status_code=400, detail="lead_id is required")
        
        # Retrieve lead from database
        lead = db.query(Lead).filter(Lead.id == int(lead_id)).first()
        if not lead:
            raise HTTPException(status_code=404, detail=f"Lead with ID {lead_id} not found")
        
        # Update payment details
        lead.payment_amount = amount / 100.0  # Convert cents to dollars
        lead.payment_currency = currency.upper()
        lead.payment_status = 'succeeded'
        lead.status = 'payment_completed'
        
        db.commit()
        db.refresh(lead)
        
        logger.info(f"Payment amounts updated for lead {lead_id}: ${amount/100.0} {currency.upper()}")
        
        return {
            'status': 'success',
            'message': f'Payment amounts updated for lead {lead_id}',
            'amount': amount / 100.0,
            'currency': currency.upper()
        }
        
    except Exception as e:
        logger.error(f"Update payment amounts error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update payment amounts")

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

@router.get('/test-redirect')
async def test_payment_redirect():
    """Test endpoint to simulate payment redirect flow"""
    try:
        # Create test payment data
        test_payment_data = {
            "payment_intent_id": "pi_test_redirect",
            "lead_id": "25",
            "amount": 100,
            "currency": "cad",
            "session_id": "cs_test_redirect",
            "payment_status": "success"
        }
        
        # Create test form data
        test_form_data = {
            "from": "Toronto, ON",
            "to": "Vancouver, BC",
            "date": "2025-02-01",
            "time": "Morning",
            "fromDetails": {
                "rooms": 3,
                "sqft": 1500,
                "weight": 2000,
                "bedrooms": 2,
                "bathrooms": 2,
                "heavyItems": ["piano", "safe"],
                "additionalServices": ["packing", "storage"]
            },
            "contact": {
                "firstName": "Sagi",
                "lastName": "Shkolnik",
                "email": "support@movedin.com",
                "phone": "416-555-0123"
            },
            "selectedQuote": {
                "vendor_name": "Lets Get Moving",
                "vendor_slug": "lets-get-moving",
                "total_cost": 1.00,
                "base_cost": 0.50,
                "fuel_surcharge": 0.25,
                "heavy_items_cost": 0.25,
                "estimated_hours": 4,
                "travel_time": 30,
                "crew_size": 2,
                "truck_size": "Medium"
            },
            "payment": {
                "amount": 1.00,
                "currency": "CAD",
                "status": "completed",
                "payment_intent_id": "pi_test_redirect"
            }
        }
        
        return {
            "status": "success",
            "message": "Test redirect data created",
            "redirect_url": "https://movedin-frontend.onrender.com/payment-redirect?session_id=cs_test_redirect&payment_status=success",
            "test_data": {
                "payment_intent_data": test_payment_data,
                "form_data": test_form_data
            },
            "instructions": "Use this URL to test the redirect flow without making a payment"
        }
        
    except Exception as e:
        logger.error(f"Test redirect error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create test redirect data")

@router.get('/test-step7')
async def test_step7_direct():
    """Test endpoint to directly access Step7 data without payment redirect"""
    try:
        # Create complete test data for Step7
        test_data = {
            "status": "success",
            "message": "Direct Step7 test data",
            "step7_url": "https://movedin-frontend.onrender.com/#/step7",
            "test_data": {
                "from": "Toronto, ON",
                "to": "Vancouver, BC",
                "date": "2025-02-01",
                "time": "Morning",
                "fromDetails": {
                    "rooms": 3,
                    "sqft": 1500,
                    "weight": 2000,
                    "bedrooms": 2,
                    "bathrooms": 2,
                    "heavyItems": ["piano", "safe"],
                    "additionalServices": ["packing", "storage"]
                },
                "contact": {
                    "firstName": "Sagi",
                    "lastName": "Shkolnik",
                    "email": "support@movedin.com",
                    "phone": "416-555-0123"
                },
                "selectedQuote": {
                    "vendor_name": "Lets Get Moving",
                    "vendor_slug": "lets-get-moving",
                    "total_cost": 1.00,
                    "base_cost": 0.50,
                    "fuel_surcharge": 0.25,
                    "heavy_items_cost": 0.25,
                    "estimated_hours": 4,
                    "travel_time": 30,
                    "crew_size": 2,
                    "truck_size": "Medium"
                },
                "payment": {
                    "amount": 1.00,
                    "currency": "CAD",
                    "status": "completed",
                    "payment_intent_id": "pi_test_direct"
                }
            },
            "instructions": "Use this data to test Step7 directly. The payment redirect is not working yet."
        }
        
        return test_data
        
    except Exception as e:
        logger.error(f"Test Step7 error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create test Step7 data")

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
                            'total_cost': checkout_session.get('amount_total', 0) / 100.0
                        },
                        'contact_data': {
                            'firstName': lead.first_name,
                            'lastName': lead.last_name,
                            'email': lead.email,
                            'phone': lead.phone
                        }
                    }
                    
                    # Send professional email notifications using final_email_service
                    from app.services.final_email_service import final_email_service
                    
                    # Send all 3 professional emails
                    email_results = final_email_service.send_final_booking_emails(lead_data, lead.id, session_id)
                    logger.info(f"Professional emails sent: {email_results}")
                    
                    # Also send individual emails for backward compatibility
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

@router.get('/test-thank-you')
async def test_thank_you():
    """Test endpoint to simulate thank you page redirect"""
    return {
        'message': 'Test thank you page redirect',
        'test_url': 'https://movedin-frontend.onrender.com/#/thank-you?lead_id=25&vendor=lets-get-moving&amount=100&currency=cad&email=support@movedin.com',
        'description': 'This URL simulates the redirect after payment completion',
        'data': {
            'lead_id': '25',
            'vendor': 'lets-get-moving',
            'amount': '100',
            'currency': 'cad',
            'email': 'support@movedin.com'
        }
    }
