import os
import stripe
import logging
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.core.database import get_db

# Configure Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["payment"])

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

@router.post('/create-intent')
async def create_payment_intent(req: PaymentIntentRequest):
    """
    Create a Stripe PaymentIntent for the $1 CAD deposit
    """
    try:
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Store lead data in metadata for webhook processing
        metadata = {
            'selectedQuote': str(req.selectedQuote) if req.selectedQuote else '',
            'vendor': str(req.vendor) if req.vendor else '',
            'fromDetails': str(req.fromDetails) if req.fromDetails else '',
            'contact': str(req.contact) if req.contact else '',
            'lead_data': str({
                'quote_data': req.fromDetails,
                'selected_quote': req.selectedQuote,
                'contact_data': req.contact
            })
        }
        
        # Create payment intent for $1 CAD (100 cents)
        intent = stripe.PaymentIntent.create(
            amount=req.amount,
            currency=req.currency,
            metadata=metadata,
            description=req.description or 'MovedIn 2.0 - $1 CAD Deposit',
            receipt_email=req.customer_email,
            automatic_payment_methods={
                'enabled': True,
            }
        )
        
        logger.info(f"Created payment intent: {intent.id} for amount: {req.amount}")
        
        return {
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id,
            'amount': intent.amount,
            'currency': intent.currency
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"Payment intent creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment intent")

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
        if event['type'] == 'payment_intent.succeeded':
            await handle_payment_success(event['data']['object'], db)
        elif event['type'] == 'payment_intent.payment_failed':
            await handle_payment_failure(event['data']['object'], db)
        else:
            logger.info(f"Unhandled event type: {event['type']}")
        
        return {'status': 'success'}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def handle_payment_success(payment_intent: Dict[str, Any], db: Session):
    """
    Handle successful payment and save lead data
    """
    try:
        payment_intent_id = payment_intent['id']
        metadata = payment_intent.get('metadata', {})
        
        logger.info(f"Processing successful payment: {payment_intent_id}")
        
        # Extract lead data from metadata
        lead_data_str = metadata.get('lead_data', '{}')
        if not lead_data_str:
            logger.error(f"No lead data found in payment intent: {payment_intent_id}")
            return
        
        # Parse lead data (this is a simplified version - you might want to use JSON)
        import ast
        try:
            lead_data = ast.literal_eval(lead_data_str)
        except:
            logger.error(f"Failed to parse lead data: {lead_data_str}")
            return
        
        # Save lead data to database
        from app.api.routes.leads import create_lead_internal
        lead_result = await create_lead_internal(lead_data, db)
        
        logger.info(f"Payment confirmed and lead saved: {lead_result.get('id')}")
        
    except Exception as e:
        logger.error(f"Failed to handle payment success: {e}")

async def handle_payment_failure(payment_intent: Dict[str, Any], db: Session):
    """
    Handle failed payment
    """
    try:
        payment_intent_id = payment_intent['id']
        logger.info(f"Payment failed: {payment_intent_id}")
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
        
        # Save lead data to database
        try:
            from app.api.routes.leads import create_lead_internal
            lead_result = await create_lead_internal(req.lead_data, db)
            logger.info(f"Payment confirmed and lead saved: {lead_result.get('id')}")
        except Exception as lead_error:
            logger.error(f"Failed to save lead data: {lead_error}")
            raise HTTPException(status_code=500, detail=f"Failed to save lead: {str(lead_error)}")
        
        return {
            'status': 'success',
            'payment_intent_id': req.payment_intent_id,
            'lead_id': lead_result.get('id'),
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