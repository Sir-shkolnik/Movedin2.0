import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe

router = APIRouter()

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

class PaymentIntentRequest(BaseModel):
    amount: int  # in cents
    currency: str = 'cad'
    metadata: dict = {}

@router.post('/create-intent')
async def create_payment_intent(req: PaymentIntentRequest):
    try:
        intent = stripe.PaymentIntent.create(
            amount=req.amount,
            currency=req.currency,
            metadata=req.metadata,
            payment_method_types=['card'],
            description='Movedin2.0 $1 CAD deposit'
        )
        return { 'client_secret': intent.client_secret }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 