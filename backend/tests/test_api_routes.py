import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient

class TestQuotesAPI:
    """Test quotes API endpoints"""
    
    @patch('app.services.vendor_engine.GeographicVendorDispatcher._get_best_dispatcher_for_vendor')
    @patch('app.services.vendor_engine.GeographicVendorDispatcher._calculate_distance_km')
    @patch('app.services.mapbox_service.mapbox_service.get_directions')
    @patch('app.services.mapbox_service.mapbox_service.get_coordinates')
    def test_generate_quotes_success(self, mock_get_coordinates, mock_get_directions, mock_calculate_distance, mock_get_dispatcher, client, sample_vendors, sample_dispatchers):
        """Test successful quote generation"""
        # Mock Mapbox responses
        mock_get_coordinates.return_value = (43.6532, -79.3832)  # Return coordinates tuple
        mock_get_directions.return_value = {
            "distance": 3500.0,
            "duration": 3600.0,
            "coordinates": [[-79.3832, 43.6532], [-123.1207, 49.2827]]
        }
        mock_calculate_distance.return_value = 25.0  # Return 25km distance
        
        # Mock dispatcher info
        mock_get_dispatcher.return_value = {
            "id": "toronto-central",
            "name": "Toronto Central",
            "address": "123 Queen St W, Toronto, ON",
            "coordinates": {"lat": 43.6532, "lng": -79.3832},
            "base_rate": 159.0,
            "total_distance_km": 25.0
        }
        
        quote_request = {
            "origin_address": "123 Main St, Toronto, ON",
            "destination_address": "456 Oak Ave, Mississauga, ON",
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
        
        response = client.post("/api/quotes", json=quote_request)
        
        if response.status_code != 200:
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")
        
        assert response.status_code == 200
        data = response.json()
        assert "quotes" in data
        assert "total_count" in data
        assert len(data["quotes"]) > 0

    def test_generate_quotes_invalid_data(self, client):
        """Test quote generation with invalid data"""
        invalid_request = {
            "origin_address": "",  # Invalid empty address
            "destination_address": "456 Oak Ave, Vancouver, BC",
            "move_date": "2024-02-15",
            "move_time": "09:00",
            "total_rooms": 0  # Invalid: must be > 0
        }
        
        response = client.post("/api/quotes", json=invalid_request)
        
        assert response.status_code == 422  # Validation error

    def test_get_vendors_success(self, client, sample_vendors):
        """Test successful vendor retrieval"""
        response = client.get("/api/quotes/vendors")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Let's Get Moving"
        assert data[1]["name"] == "Easy2Go"


class TestLeadsAPI:
    """Test leads API endpoints"""
    
    def test_create_lead_success(self, client):
        """Test successful lead creation"""
        lead_data = {
            "quote_data": {
                "originAddress": "123 Main St, Toronto, ON",
                "destinationAddress": "456 Oak Ave, Vancouver, BC",
                "moveDate": "2024-02-15",
                "moveTime": "09:00",
                "totalRooms": 3,
                "squareFootage": "1500",
                "estimatedWeight": 4000,
                "heavyItems": {"piano": 1},
                "stairsAtPickup": 2,
                "stairsAtDropoff": 1,
                "elevatorAtPickup": False,
                "elevatorAtDropoff": True,
                "additionalServices": {"packing": True, "storage": False}
            },
            "selected_quote": {
                "vendor_id": 1,
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
        
        response = client.post("/api/leads", json=lead_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["status"] == "new"

    def test_create_lead_invalid_data(self, client):
        """Test lead creation with invalid data"""
        invalid_data = {
            "quote_data": {
                "originAddress": "",  # Empty required field
                "destinationAddress": "456 Oak Ave, Vancouver, BC",
                "moveDate": "2024-02-15",
                "moveTime": "09:00",
                "totalRooms": 3
            },
            "selected_quote": {
                "vendor_id": 1
            },
            "contact_data": {
                "firstName": "",  # Empty required field
                "lastName": "Doe",
                "email": "invalid-email",  # Invalid email format
                "phone": "+1-555-123-4567"
            }
        }
        
        response = client.post("/api/leads", json=invalid_data)
        
        assert response.status_code == 422  # Validation error

    def test_get_leads_success(self, client, sample_leads):
        """Test successful leads retrieval"""
        response = client.get("/api/leads")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == 1


class TestVendorsAPI:
    """Test vendors API endpoints"""
    
    def test_get_vendors_success(self, client, sample_vendors):
        """Test successful vendor retrieval"""
        response = client.get("/api/vendors")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Let's Get Moving"
        assert data[1]["name"] == "Easy2Go"

    def test_get_vendor_by_id_success(self, client, sample_vendors):
        """Test successful vendor retrieval by ID"""
        response = client.get("/api/vendors/1")
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Let's Get Moving"
        assert data["slug"] == "lets-get-moving"

    def test_get_vendor_by_id_not_found(self, client):
        """Test vendor retrieval by ID when not found"""
        response = client.get("/api/vendors/999")
        
        assert response.status_code == 404


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy" 