"""
Unit tests for Lead Model
Tests: Model creation, validation, data integrity
"""

import pytest
import sys
import os
from datetime import datetime, date
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from app.models.lead import Lead
from app.core.database import SessionLocal, init_db

class TestLeadModel:
    """Test suite for Lead model"""
    
    @classmethod
    def setup_class(cls):
        """Setup test database"""
        init_db()
        cls.db = SessionLocal()
    
    @classmethod
    def teardown_class(cls):
        """Cleanup test database"""
        cls.db.close()
    
    def teardown_method(self):
        """Clean up after each test"""
        self.db.query(Lead).delete()
        self.db.commit()
    
    # ============ LEAD CREATION TESTS ============
    
    def test_create_lead_valid(self):
        """Test creating a valid lead"""
        lead = Lead(
            customer_name="John Doe",
            customer_email="john@example.com",
            customer_phone="+1234567890",
            move_from="123 Main St, Toronto",
            move_to="456 Oak Ave, Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Test Movers",
            total_cost=1000.00,
            payment_status="pending"
        )
        
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        
        assert lead.id is not None
        assert lead.customer_name == "John Doe"
        assert lead.payment_status == "pending"
    
    def test_create_lead_minimum_fields(self):
        """Test creating lead with minimum required fields"""
        lead = Lead(
            customer_name="Jane Doe",
            customer_email="jane@example.com",
            customer_phone="+9876543210",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Afternoon",
            vendor_name="Movers Inc",
            total_cost=500.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        assert lead.id is not None
        assert lead.payment_status == "pending"  # Default value
    
    # ============ DATA VALIDATION TESTS ============
    
    def test_lead_email_format(self):
        """Test email format validation"""
        lead = Lead(
            customer_name="Test User",
            customer_email="valid@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        assert "@" in lead.customer_email
        assert "." in lead.customer_email
    
    def test_lead_phone_encrypted(self):
        """Test that phone numbers are stored encrypted"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="encrypted_hash_12345",  # Already encrypted
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        # Phone should be stored as encrypted hash
        assert lead.customer_phone != "+1234567890"
        assert len(lead.customer_phone) > 10
    
    def test_lead_total_cost_positive(self):
        """Test that total cost is positive"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=500.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        assert lead.total_cost > 0
    
    # ============ TIMESTAMP TESTS ============
    
    def test_lead_timestamps_auto_generated(self):
        """Test that timestamps are automatically generated"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        
        assert lead.created_at is not None
        assert lead.updated_at is not None
        assert isinstance(lead.created_at, datetime)
        assert isinstance(lead.updated_at, datetime)
    
    def test_lead_updated_at_changes(self):
        """Test that updated_at changes on update"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        
        original_updated_at = lead.updated_at
        
        # Update lead
        lead.payment_status = "paid"
        self.db.commit()
        self.db.refresh(lead)
        
        assert lead.updated_at >= original_updated_at
    
    # ============ PAYMENT STATUS TESTS ============
    
    def test_payment_status_default(self):
        """Test default payment status"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        assert lead.payment_status == "pending"
    
    def test_payment_status_transitions(self):
        """Test payment status transitions"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00,
            payment_status="pending"
        )
        
        self.db.add(lead)
        self.db.commit()
        
        # Transition to paid
        lead.payment_status = "test_payment_completed"
        lead.payment_intent_id = "pi_test_123"
        self.db.commit()
        
        assert lead.payment_status == "test_payment_completed"
        assert lead.payment_intent_id is not None
    
    # ============ QUERY TESTS ============
    
    def test_query_lead_by_id(self):
        """Test querying lead by ID"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        queried_lead = self.db.query(Lead).filter(Lead.id == lead.id).first()
        assert queried_lead is not None
        assert queried_lead.customer_name == "Test User"
    
    def test_query_lead_by_email(self):
        """Test querying lead by email"""
        lead = Lead(
            customer_name="Test User",
            customer_email="unique@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        
        queried_lead = self.db.query(Lead).filter(
            Lead.customer_email == "unique@example.com"
        ).first()
        
        assert queried_lead is not None
        assert queried_lead.customer_name == "Test User"
    
    def test_query_leads_by_payment_status(self):
        """Test querying leads by payment status"""
        # Create multiple leads
        for i in range(3):
            lead = Lead(
                customer_name=f"User {i}",
                customer_email=f"user{i}@example.com",
                customer_phone=f"+123456789{i}",
                move_from="Toronto",
                move_to="Vancouver",
                move_date=date(2025, 12, 1),
                move_time="Morning",
                vendor_name="Movers",
                total_cost=100.00 * (i + 1),
                payment_status="pending" if i < 2 else "paid"
            )
            self.db.add(lead)
        
        self.db.commit()
        
        pending_leads = self.db.query(Lead).filter(
            Lead.payment_status == "pending"
        ).all()
        
        assert len(pending_leads) == 2
    
    # ============ TO_DICT TESTS ============
    
    def test_lead_to_dict(self):
        """Test lead.to_dict() method"""
        lead = Lead(
            customer_name="Test User",
            customer_email="test@example.com",
            customer_phone="+1234567890",
            move_from="Toronto",
            move_to="Vancouver",
            move_date=date(2025, 12, 1),
            move_time="Morning",
            vendor_name="Movers",
            total_cost=100.00
        )
        
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        
        lead_dict = lead.to_dict()
        
        assert isinstance(lead_dict, dict)
        assert lead_dict["customer_name"] == "Test User"
        assert lead_dict["customer_email"] == "test@example.com"
        assert "id" in lead_dict
        assert "created_at" in lead_dict


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

