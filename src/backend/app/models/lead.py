"""
Lead Model for MovedIn 3.0
Simple and secure lead storage
"""

from sqlalchemy import Column, Integer, String, Text, Date, DateTime, DECIMAL
from datetime import datetime
from app.core.database import Base

class Lead(Base):
    """Simple lead model for MovedIn 3.0"""
    
    __tablename__ = "leads"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # Customer information
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(255), nullable=False)
    
    # Move details
    move_from = Column(Text, nullable=False)
    move_to = Column(Text, nullable=False)
    move_date = Column(Date, nullable=False)
    move_time = Column(String(50), nullable=False)
    
    # Vendor information
    vendor_name = Column(String(255), nullable=False)
    total_cost = Column(DECIMAL(10, 2), nullable=False)
    
    # Payment information
    deposit_paid = Column(DECIMAL(10, 2), default=1.00)
    payment_status = Column(String(50), default='pending')
    payment_intent_id = Column(String(255))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<Lead(id={self.id}, customer_name='{self.customer_name}', vendor_name='{self.vendor_name}')>"
    
    def to_dict(self):
        """Convert lead to dictionary"""
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'move_from': self.move_from,
            'move_to': self.move_to,
            'move_date': self.move_date.isoformat() if self.move_date else None,
            'move_time': self.move_time,
            'vendor_name': self.vendor_name,
            'total_cost': float(self.total_cost) if self.total_cost else None,
            'deposit_paid': float(self.deposit_paid) if self.deposit_paid else None,
            'payment_status': self.payment_status,
            'payment_intent_id': self.payment_intent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
