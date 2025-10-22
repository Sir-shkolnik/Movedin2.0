"""
Smart Payment API for MovedIn 3.0
Stripe integration with $1 CAD deposit
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.lead import Lead
from app.services.smart_email_service import smart_email_service
from pydantic import BaseModel
from typing import Optional
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()

# Stripe configuration
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')

class PaymentLinkRequest(BaseModel):
    """Payment link creation request"""
    amount: int  # Amount in cents (100 = $1.00)
    currency: str  # 'cad'
    lead_id: int
    customer_email: str
    vendor_slug: str

@router.post('/payment/create-link')
async def create_payment_link(request: PaymentLinkRequest, db: Session = Depends(get_db)):
    """Create Stripe payment link for $1 CAD deposit"""
    
    try:
        logger.info(f"💳 Creating payment link for lead {request.lead_id}")
        
        # Verify lead exists
        lead = db.query(Lead).filter(Lead.id == request.lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # For now, create a mock payment link for testing
        # In production, this will use real Stripe API
        
        if not STRIPE_SECRET_KEY or STRIPE_SECRET_KEY == 'sk_test_your_stripe_secret_key_here':
            logger.warning("⚠️ Stripe not configured - creating test payment link")
            
            # Mock payment link for testing
            payment_link_url = f"http://localhost:3000/quote/thank-you?payment_success=true&lead_id={request.lead_id}"
            
            # Simulate successful payment immediately for testing
            lead.payment_status = 'test_payment_completed'
            lead.payment_intent_id = f'test_pi_{request.lead_id}'
            db.commit()
            
            # Send notification email
            logger.info(f"📧 Sending notification for test payment")
            await smart_email_service.send_smart_notification(lead)
            
            return {
                'payment_link_url': payment_link_url,
                'status': 'test_mode',
                'message': 'Test payment link created - will redirect to thank you page'
            }
        
        # Real Stripe integration (when configured)
        try:
            import stripe
            stripe.api_key = STRIPE_SECRET_KEY
            
            # Create Stripe Checkout Session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': request.currency,
                        'unit_amount': request.amount,
                        'product_data': {
                            'name': 'MovedIn Moving Deposit',
                            'description': f'$1.00 CAD deposit for move with {request.vendor_slug}'
                        }
                    },
                    'quantity': 1
                }],
                mode='payment',
                success_url=f'http://localhost:3000/quote/thank-you?payment_success=true&session_id={{CHECKOUT_SESSION_ID}}&lead_id={request.lead_id}',
                cancel_url=f'http://localhost:3000/quote/payment?payment_cancelled=true',
                customer_email=request.customer_email,
                metadata={
                    'lead_id': str(request.lead_id),
                    'vendor_slug': request.vendor_slug
                }
            )
            
            logger.info(f"✅ Stripe checkout session created: {checkout_session.id}")
            
            return {
                'payment_link_url': checkout_session.url,
                'session_id': checkout_session.id,
                'status': 'created'
            }
            
        except ImportError:
            logger.error("❌ Stripe package not installed")
            raise HTTPException(status_code=500, detail="Stripe not configured")
        except Exception as e:
            logger.error(f"❌ Stripe error: {e}")
            raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Payment link creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/payment/webhook')
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        logger.info("📨 Received Stripe webhook")
        
        if not STRIPE_WEBHOOK_SECRET:
            logger.warning("⚠️ Stripe webhook secret not configured")
            return {'status': 'skipped', 'reason': 'test_mode'}
        
        try:
            import stripe
            stripe.api_key = STRIPE_SECRET_KEY
            
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
            
            logger.info(f"📨 Webhook event type: {event['type']}")
            
            # Handle successful payment
            if event['type'] == 'checkout.session.completed':
                session = event['data']['object']
                lead_id = int(session['metadata']['lead_id'])
                
                logger.info(f"💰 Payment completed for lead {lead_id}")
                
                # Update lead status
                lead = db.query(Lead).filter(Lead.id == lead_id).first()
                if lead:
                    lead.payment_status = 'payment_completed'
                    lead.payment_intent_id = session.get('payment_intent')
                    db.commit()
                    
                    # Send notification email
                    await smart_email_service.send_smart_notification(lead)
                    logger.info(f"✅ Lead {lead_id} updated and notification sent")
                else:
                    logger.error(f"❌ Lead {lead_id} not found")
            
            return {'status': 'success'}
            
        except ImportError:
            logger.error("❌ Stripe package not installed")
            return {'status': 'error', 'message': 'Stripe not configured'}
        except Exception as e:
            logger.error(f"❌ Webhook processing error: {e}")
            raise HTTPException(status_code=400, detail=str(e))
        
    except Exception as e:
        logger.error(f"❌ Webhook handler error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/payment/verify/{lead_id}')
async def verify_payment(lead_id: int, db: Session = Depends(get_db)):
    """Verify payment status for a lead"""
    
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        return {
            'lead_id': lead_id,
            'payment_status': lead.payment_status,
            'payment_intent_id': lead.payment_intent_id,
            'deposit_paid': float(lead.deposit_paid) if lead.deposit_paid else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Payment verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
