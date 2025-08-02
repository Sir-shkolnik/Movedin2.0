import pytest
import sys
import os
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from main import app
from app.core.database import Base, get_db
from app.models.vendor import Vendor, Dispatcher
from app.models.lead import Lead

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        # Drop all tables
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with a fresh database session"""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def sample_vendors(db_session):
    """Create sample vendors for testing"""
    vendors = [
        Vendor(
            id=1,
            name="Let's Get Moving",
            slug="lets-get-moving",
            display_name="Let's Get Moving",
            logo_url="https://example.com/lgm.png",
            vendor_type="residential",
            pricing_model="hourly",
            coverage_areas=["Toronto", "Vancouver"],
            service_radius=50,
            phone="+1-555-123-4567",
            email="info@letsgetmoving.com",
            website="https://letsgetmoving.com",
            is_active=True,
            is_featured=True
        ),
        Vendor(
            id=2,
            name="Easy2Go",
            slug="easy2go",
            display_name="Easy2Go",
            logo_url="https://example.com/easy2go.png",
            vendor_type="residential",
            pricing_model="weight_based",
            coverage_areas=["Toronto"],
            service_radius=30,
            phone="+1-555-234-5678",
            email="info@easy2go.com",
            website="https://easy2go.com",
            is_active=True,
            is_featured=False
        )
    ]
    
    for vendor in vendors:
        db_session.add(vendor)
    db_session.commit()
    
    return vendors

@pytest.fixture(scope="function")
def sample_dispatchers(db_session, sample_vendors):
    """Create sample dispatchers for testing"""
    dispatchers = [
        Dispatcher(
            id=1,
            vendor_id=1,
            name="Toronto Dispatcher",
            location="Toronto",
            base_rates={"2024-01-01": 159.0},
            crew_rates={"2": 159.0, "3": 219.0, "4": 299.0},
            fuel_charges={},
            is_active=True
        ),
        Dispatcher(
            id=2,
            vendor_id=2,
            name="Vancouver Dispatcher",
            location="Vancouver",
            base_rates={"2024-01-01": 150.0},
            crew_rates={"2": 150.0, "3": 200.0, "4": 250.0},
            fuel_charges={},
            is_active=True
        )
    ]
    
    for dispatcher in dispatchers:
        db_session.add(dispatcher)
    db_session.commit()
    
    return dispatchers

@pytest.fixture(scope="function")
def sample_leads(db_session):
    """Create sample leads for testing"""
    from datetime import datetime
    
    leads = [
        Lead(
            id=1,
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            phone="+1-555-123-4567",
            origin_address="123 Main St, Toronto, ON",
            destination_address="456 Oak Ave, Vancouver, BC",
            move_date=datetime(2024, 2, 15),
            move_time="09:00",
            total_rooms=3,
            square_footage="1500",
            estimated_weight=4000.0,
            heavy_items={"piano": 1, "safe": 0, "treadmill": 1},
            stairs_at_pickup=2,
            stairs_at_dropoff=1,
            elevator_at_pickup=False,
            elevator_at_dropoff=True,
            additional_services={"packing": True, "storage": False},
            selected_vendor_id=1,
            status="pending",
            source="website"
        )
    ]
    
    for lead in leads:
        db_session.add(lead)
    db_session.commit()
    
    return leads 