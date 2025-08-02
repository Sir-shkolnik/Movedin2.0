from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import asyncio
import json
import redis
from datetime import datetime, timedelta
from app.core.database import get_db
from app.schemas.quote import QuoteRequest, QuoteResponse, QuoteListResponse
from app.services.vendor_dispatcher import vendor_dispatcher
from app.models.vendor import Vendor, Dispatcher
from app.models.quote import Quote, QuoteItem
from app.services.dispatcher_cache_service import dispatcher_cache_service
from app.services.google_sheets_service import google_sheets_service
from app.core.config import settings
import re

router = APIRouter()

# Redis client for caching
redis_client = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

def get_cached_google_sheets_data():
    """Get Google Sheets data from dispatcher cache service (4-hour TTL)"""
    try:
        from app.core.database import get_db
        db = next(get_db())
        
        # Get all dispatchers from cache (4-hour TTL)
        all_data = {}
        gids = google_sheets_service._load_gids_from_file()
        
        for gid in gids:
            cached_data = dispatcher_cache_service.get_dispatcher_data(gid, db)
            if cached_data:
                all_data[gid] = cached_data
        
        return all_data
    except Exception as e:
        print(f"Error getting cached Google Sheets data: {e}")
        return {}

def get_or_create_vendor(db: Session, vendor_slug: str, vendor_name: str):
    """Get existing vendor or create new one"""
    vendor = db.query(Vendor).filter(Vendor.slug == vendor_slug).first()
    
    if not vendor:
        # Create new vendor
        vendor = Vendor(
            name=vendor_name,
            slug=vendor_slug,
            display_name=vendor_name,
            vendor_type="moving_company",
            is_active=True,
            is_featured=False
        )
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        print(f"Created new vendor: {vendor_name} (ID: {vendor.id})")
    
    return vendor

def save_quote_to_database(db: Session, quote_data: dict, vendor: Vendor, lead_id: int = None):
    """Save quote to database"""
    try:
        # Create quote record
        quote = Quote(
            lead_id=lead_id,
            vendor_id=vendor.id,
            origin_address=quote_data.get('origin_address'),
            destination_address=quote_data.get('destination_address'),
            move_date=quote_data.get('move_date'),
            move_time=quote_data.get('move_time'),
            total_rooms=quote_data.get('total_rooms'),
            square_footage=quote_data.get('square_footage'),
            estimated_weight=quote_data.get('estimated_weight'),
            heavy_items=quote_data.get('heavy_items'),
            stairs_at_pickup=quote_data.get('stairs_at_pickup', 0),
            stairs_at_dropoff=quote_data.get('stairs_at_dropoff', 0),
            elevator_at_pickup=quote_data.get('elevator_at_pickup', False),
            elevator_at_dropoff=quote_data.get('elevator_at_dropoff', False),
            additional_services=quote_data.get('additional_services'),
            total_cost=quote_data.get('total_cost', 0),
            breakdown=quote_data.get('breakdown'),
            crew_size=quote_data.get('crew_size', 1),
            truck_count=quote_data.get('truck_count', 1),
            estimated_hours=quote_data.get('estimated_hours', 0),
            travel_time_hours=quote_data.get('travel_time_hours', 0),
            status="pending"
        )
        
        db.add(quote)
        db.commit()
        db.refresh(quote)
        
        # Save quote items if breakdown exists
        if quote_data.get('breakdown'):
            breakdown = quote_data['breakdown']
            if isinstance(breakdown, dict):
                for item_type, item_data in breakdown.items():
                    if isinstance(item_data, dict) and 'cost' in item_data:
                        quote_item = QuoteItem(
                            quote_id=quote.id,
                            item_type=item_type,
                            description=item_data.get('description', item_type),
                            quantity=item_data.get('quantity', 1),
                            unit_price=item_data.get('rate', item_data.get('cost', 0)),
                            total_price=item_data.get('cost', 0)
                        )
                        db.add(quote_item)
        
        db.commit()
        print(f"Saved quote to database: ID {quote.id}, Vendor: {vendor.name}, Cost: ${quote.total_cost}")
        return quote
        
    except Exception as e:
        db.rollback()
        print(f"Error saving quote to database: {e}")
        return None

async def process_vendor_quote(vendor_info, quote_request, db):
    """Process a single vendor quote asynchronously"""
    try:
        vendor_slug = vendor_info['vendor_slug']
        vendor_name = vendor_info.get('vendor_name', vendor_slug.replace('-', ' ').title())
        
        # Get or create vendor in database
        vendor = get_or_create_vendor(db, vendor_slug, vendor_name)
        
        # Use the new vendor dispatcher for all vendors
        quote_data = vendor_dispatcher.calculate_vendor_quote(vendor_slug, quote_request, db)
        
        if quote_data:
            # Add vendor-specific info
            quote_data.update({
                'vendor_slug': vendor_slug,
                'vendor_name': vendor_name,
                'origin_address': quote_request.origin_address,
                'destination_address': quote_request.destination_address,
                'move_date': quote_request.move_date,
                'move_time': quote_request.move_time,
                'total_rooms': quote_request.total_rooms,
                'square_footage': quote_request.square_footage,
                'estimated_weight': quote_request.estimated_weight,
                'heavy_items': quote_request.heavy_items,
                'stairs_at_pickup': quote_request.stairs_at_pickup,
                'stairs_at_dropoff': quote_request.stairs_at_dropoff,
                'elevator_at_pickup': quote_request.elevator_at_pickup,
                'elevator_at_dropoff': quote_request.elevator_at_dropoff,
                'additional_services': quote_request.additional_services,
            })
            
            # Save quote to database
            saved_quote = save_quote_to_database(db, quote_data, vendor)
            
            if saved_quote:
                # Add database ID to response
                quote_data['quote_id'] = saved_quote.id
                quote_data['vendor_id'] = vendor.id
            
            return QuoteResponse(**quote_data)
        
        return None
            
    except Exception as e:
        print(f"Error in process_vendor_quote for {vendor_info.get('vendor_slug', 'unknown')}: {e}")
        return None

@router.post("/generate", response_model=QuoteListResponse)
async def generate_quotes(
    quote_request: QuoteRequest,
    db: Session = Depends(get_db)
):
    """
    Generate quotes from vendors that serve the specific origin and destination locations
    """
    try:
        # Get available vendors for this location using new vendor dispatcher
        available_vendors = vendor_dispatcher.get_available_vendors_for_location(
            quote_request.origin_address, quote_request.destination_address
        )
        
        if not available_vendors:
            return QuoteListResponse(quotes=[], total_count=0)
        
        # Process vendors in parallel with timeout
        tasks = []
        for vendor_info in available_vendors:
            task = asyncio.create_task(
                process_vendor_quote(vendor_info, quote_request, db)
            )
            tasks.append(task)
        
        # Wait for all tasks with 30-second timeout
        try:
            quotes = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=30.0
            )
        except asyncio.TimeoutError:
            # Cancel remaining tasks
            for task in tasks:
                task.cancel()
            raise HTTPException(status_code=408, detail="Quote generation timeout")
        
        # Filter out None results and exceptions
        valid_quotes = []
        for quote in quotes:
            if quote is not None and not isinstance(quote, Exception):
                valid_quotes.append(quote)
        
        return QuoteListResponse(quotes=valid_quotes, total_count=len(valid_quotes))
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating quotes: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/vendors", response_model=List[dict])
async def get_vendors(db: Session = Depends(get_db)):
    """
    Get list of all vendors (for admin purposes)
    """
    vendors = db.query(Vendor).filter(Vendor.is_active == True).all()
    
    return [
        {
            "id": vendor.id,
            "name": vendor.name,
            "slug": vendor.slug,
            "display_name": vendor.display_name,
            "logo_url": vendor.logo_url,
            "vendor_type": vendor.vendor_type,
            "coverage_areas": vendor.coverage_areas,
            "is_featured": vendor.is_featured
        }
        for vendor in vendors
    ]

@router.get("/vendors/available", response_model=List[dict])
async def get_available_vendors_for_location(
    origin_address: str,
    destination_address: str,
    db: Session = Depends(get_db)
):
    """
    Get list of vendors available for a specific origin and destination
    """
    try:
        available_vendors = vendor_dispatcher.get_available_vendors_for_location(
            origin_address, destination_address
        )
        
        return available_vendors
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting available vendors: {str(e)}")

@router.get("/service-areas", response_model=dict)
async def get_service_areas():
    """
    Get all vendor service areas and dispatcher locations
    """
    return {
        "vendor_service_areas": GeographicVendorDispatcher.VENDOR_SERVICE_AREAS,
        "dispatcher_locations": GeographicVendorDispatcher.DISPATCHER_LOCATIONS
    } 