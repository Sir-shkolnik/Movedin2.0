from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class VendorUser(Base):
    __tablename__ = "vendor_users"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Link to base user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="vendor_profile")
    
    # Vendor-specific details
    vendor_name = Column(String, nullable=False)  # Let's Get Moving, Easy2Go, etc.
    vendor_id = Column(String, nullable=False)    # Unique vendor identifier
    company_name = Column(String, nullable=False)
    business_address = Column(Text, nullable=False)
    phone_number = Column(String, nullable=False)
    
    # Vendor permissions and settings
    can_manage_locations = Column(Boolean, default=True)
    can_manage_pricing = Column(Boolean, default=True)
    can_view_leads = Column(Boolean, default=True)
    can_manage_profile = Column(Boolean, default=True)
    can_view_analytics = Column(Boolean, default=True)
    
    # Vendor status
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    def __repr__(self):
        return f"<VendorUser(id={self.id}, vendor_name='{self.vendor_name}', company_name='{self.company_name}')>" 