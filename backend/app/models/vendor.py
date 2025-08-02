from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Vendor details
    name = Column(String, nullable=False, unique=True)
    slug = Column(String, nullable=False, unique=True)  # lets-get-moving, easy2go, etc.
    display_name = Column(String, nullable=False)
    logo_url = Column(String)
    
    # Vendor type and pricing model
    vendor_type = Column(String, nullable=False)  # hourly, weight-based, hybrid
    pricing_model = Column(JSON)  # Vendor-specific pricing rules
    
    # Coverage areas
    coverage_areas = Column(JSON)  # List of covered cities/regions
    service_radius = Column(Float)  # Service radius in km
    
    # Contact information
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    dispatchers = relationship("Dispatcher", back_populates="vendor")
    quotes = relationship("Quote", back_populates="vendor")

class Dispatcher(Base):
    __tablename__ = "dispatchers"
    
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    
    # Dispatcher details
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)  # City/region
    address = Column(String)
    
    # Contact information
    phone = Column(String)
    email = Column(String)
    
    # Pricing data
    base_rates = Column(JSON)  # Date-based hourly rates
    crew_rates = Column(JSON)  # Crew size multipliers
    fuel_charges = Column(JSON)  # Fuel charge table
    
    # Availability
    is_active = Column(Boolean, default=True)
    blackout_dates = Column(JSON)  # Dates when not available
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vendor = relationship("Vendor", back_populates="dispatchers") 