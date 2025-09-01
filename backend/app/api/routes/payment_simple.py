from fastapi import APIRouter

router = APIRouter(tags=["payment-simple"])

@router.get('/test')
async def test_simple_payment():
    """Simple test endpoint"""
    return {"status": "success", "message": "Simple payment router is working!"}

@router.post('/webhook/stripe')
async def stripe_webhook_simple():
    """Simple webhook endpoint"""
    return {"status": "success", "message": "Webhook endpoint is working!"}
