from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from typing import Dict, Any, List, Optional
from app.core.database import get_db
from app.models.lead import Lead
from app.models.quote import Quote
from app.models.vendor import Vendor
from datetime import datetime
import re

router = APIRouter()

class LeadRequest(BaseModel):
    """Lead creation request"""
    quote_data: Dict[str, Any]
    selected_quote: Dict[str, Any]
    contact_data: Dict[str, str]
    
    @validator('contact_data')
    def validate_contact_data(cls, v):
        if not v.get('firstName') or not v['firstName'].strip():
            raise ValueError('firstName is required and cannot be empty')
        if not v.get('lastName') or not v['lastName'].strip():
            raise ValueError('lastName is required and cannot be empty')
        if not v.get('email') or not v['email'].strip():
            raise ValueError('email is required and cannot be empty')
        if not v.get('phone') or not v['phone'].strip():
            raise ValueError('phone is required and cannot be empty')
        
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v['email']):
            raise ValueError('Invalid email format')
        
        return v
    
    @validator('quote_data')
    def validate_quote_data(cls, v):
        if not v.get('originAddress') or not v['originAddress'].strip():
            raise ValueError('originAddress is required and cannot be empty')
        if not v.get('destinationAddress') or not v['destinationAddress'].strip():
            raise ValueError('destinationAddress is required and cannot be empty')
        if not v.get('moveDate'):
            raise ValueError('moveDate is required')
        if not v.get('moveTime'):
            raise ValueError('moveTime is required')
        if not v.get('totalRooms') or v['totalRooms'] <= 0:
            raise ValueError('totalRooms must be greater than 0')
        
        return v

class LeadResponse(BaseModel):
    """Lead response"""
    id: int
    status: str
    created_at: datetime
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    origin_address: Optional[str] = None
    destination_address: Optional[str] = None
    move_date: Optional[datetime] = None
    move_time: Optional[str] = None
    total_rooms: Optional[int] = None
    square_footage: Optional[str] = None
    estimated_weight: Optional[int] = None
    heavy_items: Optional[Dict[str, Any]] = None
    stairs_at_pickup: Optional[int] = None
    stairs_at_dropoff: Optional[int] = None
    elevator_at_pickup: Optional[bool] = None
    elevator_at_dropoff: Optional[bool] = None
    additional_services: Optional[Dict[str, Any]] = None
    selected_vendor_id: Optional[int] = None
    payment_intent_id: Optional[str] = None
    source: Optional[str] = None

def get_vendor_by_slug(db: Session, vendor_slug: str) -> Optional[Vendor]:
    """Get vendor by slug"""
    return db.query(Vendor).filter(Vendor.slug == vendor_slug).first()

def get_quote_by_vendor_and_lead(db: Session, vendor_id: int, lead_id: int) -> Optional[Quote]:
    """Get quote by vendor and lead"""
    return db.query(Quote).filter(
        Quote.vendor_id == vendor_id,
        Quote.lead_id == lead_id
    ).first()

async def create_lead_internal(lead_data: Dict[str, Any], db: Session) -> Dict[str, Any]:
    """
    Internal function to create a lead (used by payment processing)
    """
    try:
        # Extract data
        quote_data = lead_data.get('quote_data', {})
        selected_quote = lead_data.get('selected_quote', {})
        contact_data = lead_data.get('contact_data', {})
        
        # Get vendor
        vendor_slug = selected_quote.get('vendor_id')
        vendor = get_vendor_by_slug(db, vendor_slug) if vendor_slug else None
        
        if not vendor:
            raise HTTPException(status_code=400, detail="Vendor not found")
        
        # Create lead
        lead = Lead(
            first_name=contact_data.get('firstName', ''),
            last_name=contact_data.get('lastName', ''),
            email=contact_data.get('email', ''),
            phone=contact_data.get('phone', ''),
            origin_address=quote_data.get('originAddress', ''),
            destination_address=quote_data.get('destinationAddress', ''),
            move_date=datetime.fromisoformat(quote_data.get('moveDate', '').replace('Z', '+00:00')),
            move_time=quote_data.get('moveTime', ''),
            total_rooms=quote_data.get('totalRooms', 0),
            square_footage=quote_data.get('squareFootage', 0),
            estimated_weight=quote_data.get('estimatedWeight', 0),
            heavy_items=quote_data.get('heavyItems', {}),
            stairs_at_pickup=quote_data.get('stairsAtPickup', 0),
            stairs_at_dropoff=quote_data.get('stairsAtDropoff', 0),
            elevator_at_pickup=quote_data.get('elevatorAtPickup', False),
            elevator_at_dropoff=quote_data.get('elevatorAtDropoff', False),
            additional_services=quote_data.get('additionalServices', {}),
            selected_vendor_id=vendor.id,
            payment_intent_id=selected_quote.get('payment_intent_id'),
            status='payment_completed',
            source='web_form'
        )
        
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        # Create quote record with all required fields
        quote = Quote(
            lead_id=lead.id,
            vendor_id=vendor.id,
            origin_address=quote_data.get('originAddress', ''),
            destination_address=quote_data.get('destinationAddress', ''),
            move_date=datetime.fromisoformat(quote_data.get('moveDate', '').replace('Z', '+00:00')),
            move_time=quote_data.get('moveTime', ''),
            total_rooms=quote_data.get('totalRooms', 0),
            square_footage=quote_data.get('squareFootage', ''),
            estimated_weight=quote_data.get('estimatedWeight', 0),
            heavy_items=quote_data.get('heavyItems', {}),
            stairs_at_pickup=quote_data.get('stairsAtPickup', 0),
            stairs_at_dropoff=quote_data.get('stairsAtDropoff', 0),
            elevator_at_pickup=quote_data.get('elevatorAtPickup', False),
            elevator_at_dropoff=quote_data.get('elevatorAtDropoff', False),
            additional_services=quote_data.get('additionalServices', {}),
            total_cost=selected_quote.get('total_cost', 0),
            breakdown=selected_quote.get('breakdown', {}),
            crew_size=selected_quote.get('crew_size', 2),
            truck_count=selected_quote.get('truck_count', 1),
            estimated_hours=selected_quote.get('estimated_hours', 4.0),
            travel_time_hours=selected_quote.get('travel_time_hours', 1.0),
            status='confirmed'
        )
        
        db.add(quote)
        db.commit()
        
        return {
            'id': lead.id,
            'status': 'success',
            'message': 'Lead created successfully'
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create lead: {str(e)}")

@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_request: LeadRequest,
    db: Session = Depends(get_db)
):
    """
    Create a new lead from quote selection
    """
    try:
        # Extract data
        quote_data = lead_request.quote_data
        selected_quote = lead_request.selected_quote
        contact_data = lead_request.contact_data
        
        # Get vendor by slug from selected quote
        vendor_slug = selected_quote.get('vendor_slug')
        vendor = None
        if vendor_slug:
            vendor = get_vendor_by_slug(db, vendor_slug)
        
        # Create lead
        lead = Lead(
            first_name=contact_data["firstName"],
            last_name=contact_data["lastName"],
            email=contact_data["email"],
            phone=contact_data["phone"],
            origin_address=quote_data["originAddress"],
            destination_address=quote_data["destinationAddress"],
            move_date=datetime.strptime(quote_data["moveDate"], "%Y-%m-%d"),
            move_time=quote_data["moveTime"],
            total_rooms=quote_data["totalRooms"],
            square_footage=quote_data.get("squareFootage"),
            estimated_weight=quote_data.get("estimatedWeight", 0),
            heavy_items=quote_data.get("heavyItems", {}),
            stairs_at_pickup=quote_data.get("stairsAtPickup", 0),
            stairs_at_dropoff=quote_data.get("stairsAtDropoff", 0),
            elevator_at_pickup=quote_data.get("elevatorAtPickup", False),
            elevator_at_dropoff=quote_data.get("elevatorAtDropoff", False),
            additional_services=quote_data.get("additionalServices", {}),
            selected_vendor_id=vendor.id if vendor else None,
            payment_intent_id=selected_quote.get("payment_intent_id"),
            status="new",
            source="website"
        )
        
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        # Link the selected quote to this lead
        if vendor and selected_quote.get('quote_id'):
            quote = db.query(Quote).filter(Quote.id == selected_quote['quote_id']).first()
            if quote:
                quote.lead_id = lead.id
                quote.status = "selected"
                db.commit()
                print(f"Linked quote {quote.id} to lead {lead.id}")
        
        # Return full lead data
        return LeadResponse(
            id=lead.id,
            status=lead.status,
            created_at=lead.created_at,
            first_name=lead.first_name,
            last_name=lead.last_name,
            email=lead.email,
            phone=lead.phone,
            origin_address=lead.origin_address,
            destination_address=lead.destination_address,
            move_date=lead.move_date,
            move_time=lead.move_time,
            total_rooms=lead.total_rooms,
            square_footage=lead.square_footage,
            estimated_weight=lead.estimated_weight,
            heavy_items=lead.heavy_items,
            stairs_at_pickup=lead.stairs_at_pickup,
            stairs_at_dropoff=lead.stairs_at_dropoff,
            elevator_at_pickup=lead.elevator_at_pickup,
            elevator_at_dropoff=lead.elevator_at_dropoff,
            additional_services=lead.additional_services,
            selected_vendor_id=lead.selected_vendor_id,
            payment_intent_id=lead.payment_intent_id,
            source=lead.source
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating lead: {str(e)}")

@router.get("/leads", response_model=List[LeadResponse])
async def get_leads(db: Session = Depends(get_db)):
    """
    Get all leads with full data
    """
    leads = db.query(Lead).all()
    return [
        LeadResponse(
            id=lead.id,
            status=lead.status,
            created_at=lead.created_at,
            first_name=lead.first_name,
            last_name=lead.last_name,
            email=lead.email,
            phone=lead.phone,
            origin_address=lead.origin_address,
            destination_address=lead.destination_address,
            move_date=lead.move_date,
            move_time=lead.move_time,
            total_rooms=lead.total_rooms,
            square_footage=lead.square_footage,
            estimated_weight=lead.estimated_weight,
            heavy_items=lead.heavy_items,
            stairs_at_pickup=lead.stairs_at_pickup,
            stairs_at_dropoff=lead.stairs_at_dropoff,
            elevator_at_pickup=lead.elevator_at_pickup,
            elevator_at_dropoff=lead.elevator_at_dropoff,
            additional_services=lead.additional_services,
            selected_vendor_id=lead.selected_vendor_id,
            payment_intent_id=lead.payment_intent_id,
            source=lead.source
        )
        for lead in leads
    ]

@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Get lead by ID with full data
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return LeadResponse(
        id=lead.id,
        status=lead.status,
        created_at=lead.created_at,
        first_name=lead.first_name,
        last_name=lead.last_name,
        email=lead.email,
        phone=lead.phone,
        origin_address=lead.origin_address,
        destination_address=lead.destination_address,
        move_date=lead.move_date,
        move_time=lead.move_time,
        total_rooms=lead.total_rooms,
        square_footage=lead.square_footage,
        estimated_weight=lead.estimated_weight,
        heavy_items=lead.heavy_items,
        stairs_at_pickup=lead.stairs_at_pickup,
        stairs_at_dropoff=lead.stairs_at_dropoff,
        elevator_at_pickup=lead.elevator_at_pickup,
        elevator_at_dropoff=lead.elevator_at_dropoff,
        additional_services=lead.additional_services,
        selected_vendor_id=lead.selected_vendor_id,
        payment_intent_id=lead.payment_intent_id,
        source=lead.source
    ) 