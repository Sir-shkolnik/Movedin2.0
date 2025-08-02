import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import stripe
import logging

from app.core.database import get_db
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

class PaymentIntentRequest(BaseModel):
    amount: int  # in cents
    currency: str = 'cad'
    metadata: Dict[str, Any] = {}
    customer_email: Optional[str] = None
    description: Optional[str] = None

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
        
        # Create payment intent for $1 CAD (100 cents)
        intent = stripe.PaymentIntent.create(
            amount=req.amount,
            currency=req.currency,
            metadata=req.metadata,
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

@router.post('/confirm-payment')
async def confirm_payment(
    req: PaymentConfirmRequest,
    db: Session = Depends(get_db)
):
    """
    Confirm payment and save lead data
    """
    try:
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe not configured")
        
        # Retrieve the payment intent
        payment_intent = stripe.PaymentIntent.retrieve(req.payment_intent_id)
        
        if payment_intent.status != 'succeeded':
            raise HTTPException(status_code=400, detail="Payment not completed")
        
        # Save lead data to database
        from app.api.routes.leads import create_lead_internal
        lead_result = await create_lead_internal(req.lead_data, db)
        
        logger.info(f"Payment confirmed and lead saved: {lead_result.get('id')}")
        
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
async def test_payment_connection():
    """
    Test Stripe connection
    """
    try:
        if not stripe.api_key:
            return {
                'status': 'error',
                'message': 'Stripe not configured - STRIPE_SECRET_KEY missing'
            }
        
        # Test connection by creating a test payment intent
        test_intent = stripe.PaymentIntent.create(
            amount=100,  # $1 CAD
            currency='cad',
            description='Test payment intent',
            automatic_payment_methods={
                'enabled': True,
            }
        )
        
        # Immediately cancel it
        stripe.PaymentIntent.cancel(test_intent.id)
        
        return {
            'status': 'success',
            'message': 'Stripe connection successful',
            'test_intent_id': test_intent.id
        }
        
    except Exception as e:
        logger.error(f"Stripe connection test failed: {e}")
        return {
            'status': 'error',
            'message': f'Stripe connection failed: {str(e)}'
        } 