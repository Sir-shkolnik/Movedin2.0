from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Vendor Authentication Schemas
class VendorLoginRequest(BaseModel):
    username: str
    password: str

class VendorLoginResponse(BaseModel):
    access_token: str
    token_type: str
    vendor_id: str
    vendor_name: str
    permissions: List[str]
    expires_in: int

class VendorProfile(BaseModel):
    id: int
    user_id: int
    vendor_name: str
    vendor_id: str
    company_name: str
    business_address: str
    phone_number: str
    email: str
    full_name: str
    username: str
    
    # Permissions
    can_manage_locations: bool
    can_manage_pricing: bool
    can_view_leads: bool
    can_manage_profile: bool
    can_view_analytics: bool
    
    # Status
    is_verified: bool
    is_active: bool
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime]
    last_login: Optional[datetime]

class VendorProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    business_address: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

class VendorPasswordChange(BaseModel):
    current_password: str
    new_password: str

class VendorLocation(BaseModel):
    id: int
    location_name: str
    address: str
    city: str
    province: str
    postal_code: str
    phone: str
    email: str
    is_active: bool
    created_at: datetime

class VendorLocationCreate(BaseModel):
    location_name: str
    address: str
    city: str
    province: str
    postal_code: str
    phone: str
    email: str

class VendorLocationUpdate(BaseModel):
    location_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None

class VendorLead(BaseModel):
    id: int
    origin_address: str
    destination_address: str
    move_date: str
    move_time: str
    total_rooms: int
    square_footage: Optional[int]
    estimated_weight: int
    heavy_items: dict
    stairs_at_pickup: int
    stairs_at_dropoff: int
    elevator_at_pickup: bool
    elevator_at_dropoff: bool
    additional_services: dict
    customer_name: str
    customer_email: str
    customer_phone: str
    created_at: datetime
    status: str
    assigned_vendor: str
    quote_amount: Optional[float]
    notes: Optional[str]

class VendorAnalytics(BaseModel):
    total_leads: int
    leads_this_month: int
    leads_this_week: int
    conversion_rate: float
    average_quote: float
    total_revenue: float
    revenue_this_month: float
    top_locations: List[dict]
    recent_activity: List[dict]

class VendorPricingRule(BaseModel):
    id: int
    rule_name: str
    rule_type: str  # hourly_rate, crew_size, truck_fee, etc.
    rule_value: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

class VendorPricingRuleCreate(BaseModel):
    rule_name: str
    rule_type: str
    rule_value: str

class VendorPricingRuleUpdate(BaseModel):
    rule_name: Optional[str] = None
    rule_type: Optional[str] = None
    rule_value: Optional[str] = None
    is_active: Optional[bool] = None 