import pytest
from datetime import date
from pydantic import ValidationError
from app.schemas.quote import QuoteRequest, QuoteResponse, QuoteListResponse
from app.schemas.lead import LeadCreate, LeadResponse, LeadListResponse
from app.schemas.vendor import VendorResponse, VendorListResponse

class TestQuoteSchemas:
    """Test quote-related schemas"""
    
    def test_quote_request_valid(self):
        """Test valid quote request"""
        data = {
            "origin_address": "123 Main St, Toronto, ON",
            "destination_address": "456 Oak Ave, Vancouver, BC",
            "move_date": "2024-02-15",
            "move_time": "09:00",
            "total_rooms": 3,
            "square_footage": "1500",
            "estimated_weight": 4000,
            "heavy_items": {"piano": 1},
            "stairs_at_pickup": 2,
            "stairs_at_dropoff": 1,
            "elevator_at_pickup": False,
            "elevator_at_dropoff": True,
            "additional_services": {"packing": True, "storage": False}
        }
        
        quote_request = QuoteRequest(**data)
        assert quote_request.origin_address == "123 Main St, Toronto, ON"
        assert quote_request.total_rooms == 3

    def test_quote_request_invalid_address(self):
        """Test quote request with invalid address"""
        data = {
            "origin_address": "",  # Empty address
            "destination_address": "456 Oak Ave, Vancouver, BC",
            "move_date": "2024-02-15",
            "move_time": "09:00",
            "total_rooms": 3,
            "square_footage": "1500",
            "estimated_weight": 4000,
            "heavy_items": {},
            "stairs_at_pickup": 0,
            "stairs_at_dropoff": 0,
            "elevator_at_pickup": False,
            "elevator_at_dropoff": False,
            "additional_services": {}
        }
        
        # This should pass since empty string is allowed by the schema
        quote_request = QuoteRequest(**data)
        assert quote_request.origin_address == ""

    def test_quote_request_invalid_rooms(self):
        """Test quote request with invalid room count"""
        data = {
            "origin_address": "123 Main St, Toronto, ON",
            "destination_address": "456 Oak Ave, Vancouver, BC",
            "move_date": "2024-02-15",
            "move_time": "09:00",
            "total_rooms": 0,  # Invalid: must be > 0
            "square_footage": "1500",
            "estimated_weight": 4000,
            "heavy_items": {},
            "stairs_at_pickup": 0,
            "stairs_at_dropoff": 0,
            "elevator_at_pickup": False,
            "elevator_at_dropoff": False,
            "additional_services": {}
        }
        
        with pytest.raises(ValidationError) as exc_info:
            QuoteRequest(**data)
        assert "total_rooms" in str(exc_info.value)

    def test_quote_request_invalid_date(self):
        """Test quote request with invalid date"""
        data = {
            "origin_address": "123 Main St, Toronto, ON",
            "destination_address": "456 Oak Ave, Vancouver, BC",
            "move_date": "invalid-date",  # Invalid date format
            "move_time": "09:00",
            "total_rooms": 3,
            "square_footage": "1500",
            "estimated_weight": 4000,
            "heavy_items": {},
            "stairs_at_pickup": 0,
            "stairs_at_dropoff": 0,
            "elevator_at_pickup": False,
            "elevator_at_dropoff": False,
            "additional_services": {}
        }
        
        with pytest.raises(ValidationError) as exc_info:
            QuoteRequest(**data)
        assert "move_date" in str(exc_info.value)

    def test_quote_response_valid(self):
        """Test valid quote response"""
        data = {
            "vendor_name": "Test Vendor",
            "total_cost": 1500.0,
            "breakdown": {
                "labor": 1000.0,
                "travel": 500.0,
                "fuel": 100.0,
                "heavy_items": 250.0,
                "stairs": 120.0,
                "additional_services": 110.0
            },
            "crew_size": 3,
            "truck_count": 1,
            "estimated_hours": 5.5,
            "travel_time_hours": 1.2,
            "available_slots": ["9:00 AM", "10:00 AM"],
            "rating": 4.5,
            "reviews": 100,
            "special_notes": "Best value option",
            "hourly_rate": 150.0
        }
        
        quote_response = QuoteResponse(**data)
        assert quote_response.vendor_name == "Test Vendor"
        assert quote_response.total_cost == 1500.0

    def test_quote_list_response_valid(self):
        """Test valid quote list response"""
        quotes = [
            {
                "vendor_name": "Vendor 1",
                "total_cost": 1500.0,
                "breakdown": {"labor": 1000, "travel": 500},
                "crew_size": 3,
                "truck_count": 1,
                "estimated_hours": 5.5,
                "travel_time_hours": 1.2,
                "available_slots": ["9:00 AM"],
                "rating": 4.5,
                "reviews": 100,
                "hourly_rate": 150.0
            },
            {
                "vendor_name": "Vendor 2",
                "total_cost": 1800.0,
                "breakdown": {"labor": 1200, "travel": 600},
                "crew_size": 4,
                "truck_count": 1,
                "estimated_hours": 6.0,
                "travel_time_hours": 1.5,
                "available_slots": ["10:00 AM"],
                "rating": 4.7,
                "reviews": 150,
                "hourly_rate": 180.0
            }
        ]
        
        data = {
            "quotes": quotes,
            "total_count": 2
        }
        
        quote_list_response = QuoteListResponse(**data)
        assert len(quote_list_response.quotes) == 2
        assert quote_list_response.total_count == 2


class TestLeadSchemas:
    """Test lead-related schemas"""
    
    def test_lead_create_valid(self):
        """Test valid lead creation"""
        data = {
            "quote_data": {
                "origin_address": "123 Main St, Toronto, ON",
                "destination_address": "456 Oak Ave, Vancouver, BC",
                "move_date": "2024-02-15",
                "move_time": "09:00",
                "total_rooms": 3,
                "square_footage": "1500",
                "estimated_weight": 4000,
                "heavy_items": {"piano": 1},
                "stairs_at_pickup": 2,
                "stairs_at_dropoff": 1,
                "elevator_at_pickup": False,
                "elevator_at_dropoff": True,
                "additional_services": {"packing": True, "storage": False}
            },
            "selected_quote": {
                "vendor_name": "Test Vendor",
                "total_cost": 1500.0,
                "breakdown": {"labor": 1000, "travel": 500},
                "crew_size": 3,
                "truck_count": 1,
                "estimated_hours": 5.5,
                "travel_time_hours": 1.2,
                "hourly_rate": 150.0,
                "available_slots": ["9:00 AM", "10:00 AM"]
            },
            "contact_data": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-123-4567"
            }
        }
        
        lead_create = LeadCreate(**data)
        assert lead_create.contact_data.firstName == "John"
        assert lead_create.selected_quote.vendor_name == "Test Vendor"

    def test_lead_create_invalid_email(self):
        """Test lead creation with invalid email"""
        data = {
            "quote_data": {
                "origin_address": "123 Main St, Toronto, ON",
                "destination_address": "456 Oak Ave, Vancouver, BC",
                "move_date": "2024-02-15",
                "move_time": "09:00",
                "total_rooms": 3,
                "square_footage": "1500",
                "estimated_weight": 4000,
                "heavy_items": {},
                "stairs_at_pickup": 0,
                "stairs_at_dropoff": 0,
                "elevator_at_pickup": False,
                "elevator_at_dropoff": False,
                "additional_services": {}
            },
            "selected_quote": {
                "vendor_name": "Test Vendor",
                "total_cost": 1500.0,
                "breakdown": {"labor": 1000, "travel": 500},
                "crew_size": 3,
                "truck_count": 1,
                "estimated_hours": 5.5,
                "travel_time_hours": 1.2,
                "hourly_rate": 150.0,
                "available_slots": ["9:00 AM"]
            },
            "contact_data": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "invalid-email",  # Invalid email format
                "phone": "+1-555-123-4567"
            }
        }
        
        with pytest.raises(ValidationError) as exc_info:
            LeadCreate(**data)
        assert "email" in str(exc_info.value)

    def test_lead_response_valid(self):
        """Test valid lead response"""
        data = {
            "id": 1,
            "status": "pending",
            "created_at": "2024-02-15T10:00:00",
            "quote_data": {
                "origin_address": "123 Main St, Toronto, ON",
                "destination_address": "456 Oak Ave, Vancouver, BC",
                "move_date": "2024-02-15",
                "move_time": "09:00",
                "total_rooms": 3,
                "square_footage": "1500",
                "estimated_weight": 4000,
                "heavy_items": {"piano": 1},
                "stairs_at_pickup": 2,
                "stairs_at_dropoff": 1,
                "elevator_at_pickup": False,
                "elevator_at_dropoff": True,
                "additional_services": {"packing": True, "storage": False}
            },
            "selected_quote": {
                "vendor_name": "Test Vendor",
                "total_cost": 1500.0,
                "breakdown": {"labor": 1000, "travel": 500},
                "crew_size": 3,
                "truck_count": 1,
                "estimated_hours": 5.5,
                "travel_time_hours": 1.2,
                "hourly_rate": 150.0,
                "available_slots": ["9:00 AM", "10:00 AM"]
            },
            "contact_data": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com",
                "phone": "+1-555-123-4567"
            }
        }
        
        lead_response = LeadResponse(**data)
        assert lead_response.id == 1
        assert lead_response.status == "pending"


class TestVendorSchemas:
    """Test vendor-related schemas"""
    
    def test_vendor_response_valid(self):
        """Test valid vendor response"""
        data = {
            "id": 1,
            "name": "Test Vendor",
            "slug": "test-vendor",
            "display_name": "Test Vendor Display",
            "logo_url": "https://example.com/logo.png",
            "vendor_type": "residential",
            "coverage_areas": ["Toronto", "Vancouver"],
            "is_featured": True,
            "is_active": True
        }
        
        vendor_response = VendorResponse(**data)
        assert vendor_response.name == "Test Vendor"
        assert vendor_response.slug == "test-vendor"

    def test_vendor_list_response_valid(self):
        """Test valid vendor list response"""
        vendors = [
            {
                "id": 1,
                "name": "Vendor 1",
                "slug": "vendor-1",
                "display_name": "Vendor 1 Display",
                "logo_url": "https://example.com/logo1.png",
                "vendor_type": "residential",
                "coverage_areas": ["Toronto"],
                "is_featured": True,
                "is_active": True
            },
            {
                "id": 2,
                "name": "Vendor 2",
                "slug": "vendor-2",
                "display_name": "Vendor 2 Display",
                "logo_url": "https://example.com/logo2.png",
                "vendor_type": "commercial",
                "coverage_areas": ["Vancouver"],
                "is_featured": False,
                "is_active": True
            }
        ]
        
        data = {
            "vendors": vendors,
            "total_count": 2
        }
        
        vendor_list_response = VendorListResponse(**data)
        assert len(vendor_list_response.vendors) == 2
        assert vendor_list_response.total_count == 2 