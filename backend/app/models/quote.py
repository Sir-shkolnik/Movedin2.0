from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Quote(Base):
    __tablename__ = "quotes"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    
    # Quote details
    origin_address = Column(String, nullable=False)
    destination_address = Column(String, nullable=False)
    move_date = Column(DateTime, nullable=False)
    move_time = Column(String, nullable=False)
    
    # Home details
    total_rooms = Column(Integer, nullable=False)
    square_footage = Column(String)
    estimated_weight = Column(Float)
    
    # Services
    heavy_items = Column(JSON)  # {"piano": 1, "safe": 0, "treadmill": 2}
    stairs_at_pickup = Column(Integer, default=0)
    stairs_at_dropoff = Column(Integer, default=0)
    elevator_at_pickup = Column(Boolean, default=False)
    elevator_at_dropoff = Column(Boolean, default=False)
    additional_services = Column(JSON)  # {"packing": true, "storage": false}
    
    # Pricing
    total_cost = Column(Float, nullable=False)
    breakdown = Column(JSON)  # Detailed cost breakdown
    
    # Crew details
    crew_size = Column(Integer, nullable=False)
    truck_count = Column(Integer, nullable=False)
    estimated_hours = Column(Float, nullable=False)
    travel_time_hours = Column(Float, nullable=False)
    
    # Status
    status = Column(String, default="pending")  # pending, accepted, rejected, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    lead = relationship("Lead", back_populates="quotes")
    vendor = relationship("Vendor", back_populates="quotes")
    items = relationship("QuoteItem", back_populates="quote")

class QuoteItem(Base):
    __tablename__ = "quote_items"
    
    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"))
    
    item_type = Column(String, nullable=False)  # labor, travel, fuel, heavy_items, etc.
    description = Column(String, nullable=False)
    quantity = Column(Float, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    quote = relationship("Quote", back_populates="items") 