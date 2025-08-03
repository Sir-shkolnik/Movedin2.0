from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
import jwt
from passlib.context import CryptContext

from app.core.database import get_db
from app.models.user import User
from app.models.vendor_user import VendorUser
from app.schemas.vendor_auth import (
    VendorLoginRequest, VendorLoginResponse, VendorProfile, 
    VendorProfileUpdate, VendorPasswordChange, VendorLocation,
    VendorLocationCreate, VendorLocationUpdate, VendorLead,
    VendorAnalytics, VendorPricingRule, VendorPricingRuleCreate,
    VendorPricingRuleUpdate
)
from app.core.config import settings

router = APIRouter(prefix="/vendor", tags=["vendor"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="vendor/login")

# JWT Configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_current_vendor(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    
    vendor_user = db.query(VendorUser).filter(VendorUser.user_id == user.id).first()
    if vendor_user is None or not vendor_user.is_active:
        raise credentials_exception
    
    return vendor_user

@router.post("/login", response_model=VendorLoginResponse)
async def vendor_login(login_data: VendorLoginRequest, db: Session = Depends(get_db)):
    """Vendor login endpoint"""
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or user.role != "vendor":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    vendor_user = db.query(VendorUser).filter(VendorUser.user_id == user.id).first()
    if not vendor_user or not vendor_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Vendor account is not active"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    vendor_user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": "vendor", "vendor_id": vendor_user.vendor_id},
        expires_delta=access_token_expires
    )
    
    # Get permissions
    permissions = []
    if vendor_user.can_manage_locations:
        permissions.append("manage_locations")
    if vendor_user.can_manage_pricing:
        permissions.append("manage_pricing")
    if vendor_user.can_view_leads:
        permissions.append("view_leads")
    if vendor_user.can_manage_profile:
        permissions.append("manage_profile")
    if vendor_user.can_view_analytics:
        permissions.append("view_analytics")
    
    return VendorLoginResponse(
        access_token=access_token,
        token_type="bearer",
        vendor_id=vendor_user.vendor_id,
        vendor_name=vendor_user.vendor_name,
        permissions=permissions,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.get("/profile", response_model=VendorProfile)
async def get_vendor_profile(current_vendor: VendorUser = Depends(get_current_vendor), db: Session = Depends(get_db)):
    """Get vendor profile"""
    user = db.query(User).filter(User.id == current_vendor.user_id).first()
    
    return VendorProfile(
        id=current_vendor.id,
        user_id=current_vendor.user_id,
        vendor_name=current_vendor.vendor_name,
        vendor_id=current_vendor.vendor_id,
        company_name=current_vendor.company_name,
        business_address=current_vendor.business_address,
        phone_number=current_vendor.phone_number,
        email=user.email,
        full_name=user.full_name,
        username=user.username,
        can_manage_locations=current_vendor.can_manage_locations,
        can_manage_pricing=current_vendor.can_manage_pricing,
        can_view_leads=current_vendor.can_view_leads,
        can_manage_profile=current_vendor.can_manage_profile,
        can_view_analytics=current_vendor.can_view_analytics,
        is_verified=current_vendor.is_verified,
        is_active=current_vendor.is_active,
        created_at=current_vendor.created_at,
        updated_at=current_vendor.updated_at,
        last_login=current_vendor.last_login
    )

@router.put("/profile", response_model=VendorProfile)
async def update_vendor_profile(
    profile_update: VendorProfileUpdate,
    current_vendor: VendorUser = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Update vendor profile"""
    if not current_vendor.can_manage_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    user = db.query(User).filter(User.id == current_vendor.user_id).first()
    
    # Update vendor profile
    if profile_update.company_name is not None:
        current_vendor.company_name = profile_update.company_name
    if profile_update.business_address is not None:
        current_vendor.business_address = profile_update.business_address
    if profile_update.phone_number is not None:
        current_vendor.phone_number = profile_update.phone_number
    
    # Update user profile
    if profile_update.email is not None:
        user.email = profile_update.email
    if profile_update.full_name is not None:
        user.full_name = profile_update.full_name
    
    current_vendor.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_vendor)
    
    return get_vendor_profile(current_vendor, db)

@router.post("/change-password")
async def change_vendor_password(
    password_change: VendorPasswordChange,
    current_vendor: VendorUser = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Change vendor password"""
    if not current_vendor.can_manage_profile:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    user = db.query(User).filter(User.id == current_vendor.user_id).first()
    
    if not verify_password(password_change.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    user.hashed_password = get_password_hash(password_change.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.get("/leads", response_model=List[VendorLead])
async def get_vendor_leads(
    current_vendor: VendorUser = Depends(get_current_vendor),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Get leads assigned to this vendor"""
    if not current_vendor.can_view_leads:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    # Get leads where this vendor was assigned
    from app.models.lead import Lead
    leads = db.query(Lead).filter(
        Lead.assigned_vendor == current_vendor.vendor_name
    ).offset(skip).limit(limit).all()
    
    return [
        VendorLead(
            id=lead.id,
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
            customer_name=lead.customer_name,
            customer_email=lead.customer_email,
            customer_phone=lead.customer_phone,
            created_at=lead.created_at,
            status=lead.status,
            assigned_vendor=lead.assigned_vendor,
            quote_amount=lead.quote_amount,
            notes=lead.notes
        )
        for lead in leads
    ]

@router.get("/analytics", response_model=VendorAnalytics)
async def get_vendor_analytics(
    current_vendor: VendorUser = Depends(get_current_vendor),
    db: Session = Depends(get_db)
):
    """Get vendor analytics"""
    if not current_vendor.can_view_analytics:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    
    from app.models.lead import Lead
    from datetime import datetime, timedelta
    
    # Calculate date ranges
    now = datetime.utcnow()
    month_ago = now - timedelta(days=30)
    week_ago = now - timedelta(days=7)
    
    # Get leads for this vendor
    all_leads = db.query(Lead).filter(
        Lead.assigned_vendor == current_vendor.vendor_name
    ).all()
    
    month_leads = db.query(Lead).filter(
        Lead.assigned_vendor == current_vendor.vendor_name,
        Lead.created_at >= month_ago
    ).all()
    
    week_leads = db.query(Lead).filter(
        Lead.assigned_vendor == current_vendor.vendor_name,
        Lead.created_at >= week_ago
    ).all()
    
    # Calculate metrics
    total_leads = len(all_leads)
    leads_this_month = len(month_leads)
    leads_this_week = len(week_leads)
    
    # Calculate revenue
    total_revenue = sum(lead.quote_amount or 0 for lead in all_leads)
    revenue_this_month = sum(lead.quote_amount or 0 for lead in month_leads)
    
    # Calculate average quote
    quotes_with_amount = [lead.quote_amount for lead in all_leads if lead.quote_amount]
    average_quote = sum(quotes_with_amount) / len(quotes_with_amount) if quotes_with_amount else 0
    
    # Calculate conversion rate (simplified)
    conversion_rate = 0.15  # Placeholder - would need more complex logic
    
    # Get top locations (simplified)
    top_locations = [
        {"location": "Toronto", "leads": 25},
        {"location": "Mississauga", "leads": 18},
        {"location": "Brampton", "leads": 12}
    ]
    
    # Get recent activity
    recent_activity = [
        {"time": "2 hours ago", "action": "New lead received", "details": "Toronto to Mississauga"},
        {"time": "1 day ago", "action": "Quote sent", "details": "$1,250 for 3-bedroom move"},
        {"time": "3 days ago", "action": "Lead converted", "details": "Booking confirmed"}
    ]
    
    return VendorAnalytics(
        total_leads=total_leads,
        leads_this_month=leads_this_month,
        leads_this_week=leads_this_week,
        conversion_rate=conversion_rate,
        average_quote=average_quote,
        total_revenue=total_revenue,
        revenue_this_month=revenue_this_month,
        top_locations=top_locations,
        recent_activity=recent_activity
    ) 