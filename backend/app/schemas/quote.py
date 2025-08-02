from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import date

class QuoteRequest(BaseModel):
    """Quote request schema"""
    origin_address: str = Field(..., description="Origin address")
    destination_address: str = Field(..., description="Destination address")
    origin_address_coordinates: Optional[tuple[float, float]] = Field(None, description="Origin coordinates")
    destination_address_coordinates: Optional[tuple[float, float]] = Field(None, description="Destination coordinates")
    move_date: date = Field(..., description="Move date")
    move_time: str = Field(..., description="Move time")
    
    # Home details
    total_rooms: int = Field(..., ge=1, le=20, description="Number of rooms")
    square_footage: Optional[str] = Field(None, description="Square footage")
    estimated_weight: float = Field(0, ge=0, description="Estimated weight in lbs")
    
    # Services
    heavy_items: Dict[str, int] = Field(default_factory=dict, description="Heavy items count")
    stairs_at_pickup: int = Field(0, ge=0, le=10, description="Number of stairs at pickup")
    stairs_at_dropoff: int = Field(0, ge=0, le=10, description="Number of stairs at dropoff")
    elevator_at_pickup: bool = Field(False, description="Elevator available at pickup")
    elevator_at_dropoff: bool = Field(False, description="Elevator available at dropoff")
    additional_services: Dict[str, bool] = Field(default_factory=dict, description="Additional services")

class QuoteResponse(BaseModel):
    """Quote response schema"""
    vendor_slug: str
    vendor_name: str
    total_cost: float
    breakdown: Dict[str, float]
    crew_size: int
    truck_count: int
    estimated_hours: float
    travel_time_hours: float
    hourly_rate: float
    available_slots: List[str]
    rating: Optional[float] = None
    reviews: Optional[int] = None
    special_notes: Optional[str] = None
    premium_available: Optional[bool] = None
    premium_rate: Optional[float] = None
    dispatcher_info: Optional[Dict[str, Any]] = None

class QuoteListResponse(BaseModel):
    """Multiple quotes response schema"""
    quotes: List[QuoteResponse]
    total_count: int 