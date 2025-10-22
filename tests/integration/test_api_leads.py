"""
Integration tests for Leads API
Tests: API endpoints, request/response, error handling
"""

import pytest
import sys
import os
import requests
from datetime import date

sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

# Base URL for API
BASE_URL = "http://localhost:8000"

class TestLeadsAPI:
    """Test suite for Leads API endpoints"""
    
    # ============ LEAD CREATION TESTS ============
    
    def test_create_lead_success(self):
        """Test successful lead creation"""
        payload = {
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "customer_phone": "+1234567890",
            "move_from": "123 Main St, Toronto",
            "move_to": "456 Oak Ave, Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Test Movers",
            "total_cost": 1000.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["customer_name"] == "John Doe"
        assert data["vendor_name"] == "Test Movers"
    
    def test_create_lead_missing_required_field(self):
        """Test lead creation with missing required field"""
        payload = {
            "customer_name": "John Doe",
            # Missing customer_email
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 500.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        assert response.status_code in [400, 422]  # Bad request or validation error
    
    def test_create_lead_invalid_email(self):
        """Test lead creation with invalid email"""
        payload = {
            "customer_name": "John Doe",
            "customer_email": "invalid-email",  # Invalid format
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 500.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        assert response.status_code in [400, 422]
    
    def test_create_lead_invalid_phone(self):
        """Test lead creation with invalid phone"""
        payload = {
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "customer_phone": "123",  # Too short
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 500.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        assert response.status_code in [400, 422]
    
    def test_create_lead_negative_cost(self):
        """Test lead creation with negative cost"""
        payload = {
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": -500.00  # Negative cost
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        assert response.status_code in [400, 422]
    
    # ============ RATE LIMITING TESTS ============
    
    def test_rate_limiting_multiple_requests(self):
        """Test rate limiting with rapid requests"""
        payload = {
            "customer_name": "Spam User",
            "customer_email": "spam@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        # Send multiple rapid requests
        responses = []
        for _ in range(10):
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            responses.append(response.status_code)
        
        # Should get rate limited eventually
        assert 429 in responses  # 429 = Too Many Requests
    
    # ============ GET LEAD TESTS ============
    
    def test_get_lead_by_id_success(self):
        """Test getting a lead by ID"""
        # First create a lead
        payload = {
            "customer_name": "Jane Doe",
            "customer_email": "jane@example.com",
            "customer_phone": "+9876543210",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Afternoon",
            "vendor_name": "Movers Inc",
            "total_cost": 750.00
        }
        
        create_response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        lead_id = create_response.json()["id"]
        
        # Now get the lead
        get_response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["id"] == lead_id
        assert data["customer_name"] == "Jane Doe"
    
    def test_get_lead_not_found(self):
        """Test getting a non-existent lead"""
        response = requests.get(f"{BASE_URL}/api/leads/99999")
        
        assert response.status_code == 404
    
    def test_list_all_leads(self):
        """Test listing all leads"""
        response = requests.get(f"{BASE_URL}/api/leads")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    # ============ SECURITY TESTS ============
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention"""
        payload = {
            "customer_name": "'; DROP TABLE leads; --",
            "customer_email": "hacker@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        # Should either reject or sanitize
        if response.status_code == 200:
            data = response.json()
            # Name should be sanitized
            assert "DROP TABLE" not in data["customer_name"]
    
    def test_xss_prevention(self):
        """Test XSS prevention"""
        payload = {
            "customer_name": "<script>alert('XSS')</script>",
            "customer_email": "xss@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        # Should either reject or sanitize
        if response.status_code == 200:
            data = response.json()
            # Script tags should be removed
            assert "<script>" not in data["customer_name"].lower()
    
    def test_very_large_payload(self):
        """Test handling of very large payload"""
        payload = {
            "customer_name": "A" * 100000,  # Very large name
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        # Should reject or truncate
        assert response.status_code in [200, 400, 413, 422]
    
    # ============ CORS TESTS ============
    
    def test_cors_headers_present(self):
        """Test CORS headers are present"""
        response = requests.options(f"{BASE_URL}/api/leads")
        
        assert "access-control-allow-origin" in [
            h.lower() for h in response.headers
        ]
    
    # ============ CONTENT TYPE TESTS ============
    
    def test_json_content_type_required(self):
        """Test that JSON content type is required"""
        response = requests.post(
            f"{BASE_URL}/api/leads",
            data="not json",
            headers={"Content-Type": "text/plain"}
        )
        
        assert response.status_code in [400, 415, 422]
    
    def test_response_content_type_json(self):
        """Test that response is JSON"""
        payload = {
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        assert "application/json" in response.headers.get("content-type", "")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

