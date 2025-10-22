"""
Smart & Secure Lead API for MovedIn 3.0
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.lead import Lead
from app.services.smart_email_service import smart_email_service
from app.services.security_service import security_service
from app.core.database import get_db
from pydantic import BaseModel
from typing import Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()

class LeadRequest(BaseModel):
    """Lead creation request model"""
    customer_name: str
    customer_email: str
    customer_phone: str
    move_from: str
    move_to: str
    move_date: str
    move_time: str
    vendor_name: str
    total_cost: float

@router.post('/leads')
async def create_lead(lead_request: LeadRequest, db: Session = Depends(get_db)):
    """Smart & Secure lead creation"""
    
    try:
        logger.info(f"🏗️ Creating smart lead for {lead_request.customer_name}")
        
        # 1. Validate and sanitize data
        lead_data = lead_request.dict()
        validated_data = security_service.validate_and_sanitize(lead_data)
        
        # 2. Check rate limiting
        if await security_service.is_rate_limited(validated_data['customer_email']):
            logger.warning(f"⚠️ Rate limited for email: {validated_data['customer_email']}")
            raise HTTPException(status_code=429, detail="Too many requests")
        
        # 3. Encrypt sensitive data
        encrypted_data = security_service.encrypt_sensitive_fields(validated_data)
        
        # 4. Save to database
        lead = Lead(
            customer_name=encrypted_data['customer_name'],
            customer_email=encrypted_data['customer_email'],
            customer_phone=encrypted_data['customer_phone'],
            move_from=encrypted_data['move_from'],
            move_to=encrypted_data['move_to'],
            move_date=datetime.strptime(encrypted_data['move_date'], '%Y-%m-%d').date(),
            move_time=encrypted_data['move_time'],
            vendor_name=encrypted_data['vendor_name'],
            total_cost=encrypted_data['total_cost'],
            payment_status='pending'
        )
        
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        logger.info(f"✅ Lead created successfully: {lead.id}")
        
        return {
            'id': lead.id,
            'status': 'created',
            'message': 'Lead created successfully',
            'customer_name': lead.customer_name,
            'vendor_name': lead.vendor_name
        }
        
    except ValueError as e:
        logger.error(f"❌ Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"❌ Lead creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/leads/{lead_id}/notify')
async def send_smart_notification(lead_id: int, db: Session = Depends(get_db)):
    """Send smart notification email"""
    
    try:
        logger.info(f"📧 Sending smart notification for lead {lead_id}")
        
        # Get lead data
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            logger.error(f"❌ Lead not found: {lead_id}")
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Send smart email
        result = await smart_email_service.send_smart_notification(lead)
        
        if result:
            logger.info(f"✅ Smart notification sent for lead {lead_id}")
            return {
                'status': 'success',
                'email_sent': True,
                'message': 'Smart notification sent successfully'
            }
        else:
            logger.error(f"❌ Failed to send notification for lead {lead_id}")
            return {
                'status': 'error',
                'email_sent': False,
                'message': 'Failed to send notification'
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Notification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/leads/{lead_id}')
async def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get lead by ID"""
    
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        return lead.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to get lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/leads')
async def list_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all leads"""
    
    try:
        leads = db.query(Lead).offset(skip).limit(limit).all()
        return [lead.to_dict() for lead in leads]
        
    except Exception as e:
        logger.error(f"❌ Failed to list leads: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put('/leads/{lead_id}/payment')
async def update_payment_status(lead_id: int, payment_data: Dict[str, Any], db: Session = Depends(get_db)):
    """Update payment status"""
    
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Update payment information
        if 'payment_status' in payment_data:
            lead.payment_status = payment_data['payment_status']
        if 'payment_intent_id' in payment_data:
            lead.payment_intent_id = payment_data['payment_intent_id']
        
        lead.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"✅ Payment status updated for lead {lead_id}")
        
        return {
            'status': 'success',
            'message': 'Payment status updated successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to update payment status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
