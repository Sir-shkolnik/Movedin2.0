from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # User details
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    full_name = Column(String, nullable=False)
    
    # Authentication
    hashed_password = Column(String, nullable=False)
    
    # Role and permissions
    role = Column(String, default="user")  # admin, user, vendor
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationship to vendor profile
    vendor_profile = relationship("VendorUser", back_populates="user", uselist=False) 