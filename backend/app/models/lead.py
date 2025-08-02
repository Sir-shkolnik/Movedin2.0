from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Contact information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    
    # Lead details
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
    
    # Selected quote
    selected_vendor_id = Column(Integer)
    selected_quote_id = Column(Integer)
    
    # Payment information
    payment_intent_id = Column(String)  # Stripe payment intent ID
    
    # Status
    status = Column(String, default="new")  # new, contacted, qualified, converted, lost
    source = Column(String, default="website")  # website, phone, referral, etc.
    
    # CRM integration
    crm_lead_id = Column(String)  # External CRM lead ID
    crm_synced = Column(Boolean, default=False)
    crm_sync_date = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    quotes = relationship("Quote", back_populates="lead") 