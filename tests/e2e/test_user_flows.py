"""
End-to-End Tests for Critical User Flows
Tests: Complete user journeys from start to finish
"""

import pytest
import requests
import time

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5174"

class TestE2EUserFlows:
    """End-to-end test suite for user flows"""
    
    # ============ COMPLETE QUOTE FLOW ============
    
    def test_complete_quote_to_payment_flow(self):
        """Test complete flow from quote to payment"""
        print("\n🎯 Testing Complete Quote → Payment Flow")
        
        # Step 1: Customer fills out quote form
        print("📝 Step 1: Customer fills quote form...")
        quote_data = {
            "customer_name": "E2E Test User",
            "customer_email": "e2e@example.com",
            "customer_phone": "+1234567890",
            "move_from": "123 Main St, Toronto, ON",
            "move_to": "456 Oak Ave, Vancouver, BC",
            "move_date": "2025-12-15",
            "move_time": "Morning",
            "vendor_name": "Pierre & Sons Moving",
            "total_cost": 849.00
        }
        
        # Step 2: Create lead
        print("🏗️  Step 2: Creating lead...")
        lead_response = requests.post(f"{BASE_URL}/api/leads", json=quote_data)
        
        assert lead_response.status_code == 200
        lead_data = lead_response.json()
        lead_id = lead_data["id"]
        print(f"✅ Lead created with ID: {lead_id}")
        
        # Step 3: Create payment link
        print("💳 Step 3: Creating payment link...")
        payment_payload = {
            "amount": 100,  # $1.00 CAD
            "currency": "cad",
            "lead_id": lead_id,
            "customer_email": quote_data["customer_email"],
            "vendor_slug": "pierre-sons"
        }
        
        payment_response = requests.post(
            f"{BASE_URL}/api/payment/create-link",
            json=payment_payload
        )
        
        assert payment_response.status_code == 200
        payment_data = payment_response.json()
        print(f"✅ Payment link created: {payment_data['payment_link_url']}")
        
        # Step 4: Verify payment status
        print("🔍 Step 4: Verifying payment status...")
        verify_response = requests.get(f"{BASE_URL}/api/payment/verify/{lead_id}")
        
        assert verify_response.status_code == 200
        verify_data = verify_response.json()
        print(f"✅ Payment status: {verify_data['payment_status']}")
        
        # Step 5: Verify lead was updated
        print("📊 Step 5: Verifying lead data...")
        lead_check_response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        
        assert lead_check_response.status_code == 200
        final_lead = lead_check_response.json()
        print(f"✅ Final lead status: {final_lead.get('payment_status', 'N/A')}")
        
        print("🎉 Complete flow successful!")
        
        # Assertions
        assert lead_id is not None
        assert payment_data["status"] in ["test_mode", "created"]
        assert verify_data["payment_status"] in ["pending", "test_payment_completed"]
    
    # ============ ERROR HANDLING FLOW ============
    
    def test_invalid_data_error_handling(self):
        """Test error handling with invalid data"""
        print("\n⚠️  Testing Error Handling Flow")
        
        # Step 1: Try to create lead with invalid email
        print("📝 Step 1: Attempting invalid email...")
        invalid_data = {
            "customer_name": "Invalid User",
            "customer_email": "not-an-email",  # Invalid
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=invalid_data)
        
        assert response.status_code in [400, 422]
        print(f"✅ Invalid email rejected: {response.status_code}")
        
        # Step 2: Try with invalid phone
        print("📞 Step 2: Attempting invalid phone...")
        invalid_data["customer_email"] = "valid@example.com"
        invalid_data["customer_phone"] = "123"  # Too short
        
        response = requests.post(f"{BASE_URL}/api/leads", json=invalid_data)
        
        assert response.status_code in [400, 422]
        print(f"✅ Invalid phone rejected: {response.status_code}")
        
        # Step 3: Try with missing fields
        print("❌ Step 3: Attempting missing fields...")
        response = requests.post(f"{BASE_URL}/api/leads", json={})
        
        assert response.status_code in [400, 422]
        print(f"✅ Missing fields rejected: {response.status_code}")
        
        print("🎉 Error handling working correctly!")
    
    # ============ RECOVERY FLOW ============
    
    def test_payment_recovery_flow(self):
        """Test recovering from payment failure"""
        print("\n🔄 Testing Payment Recovery Flow")
        
        # Step 1: Create a valid lead
        print("📝 Step 1: Creating lead...")
        lead_data = {
            "customer_name": "Recovery Test",
            "customer_email": "recovery@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 500.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=lead_data)
        assert response.status_code == 200
        lead_id = response.json()["id"]
        print(f"✅ Lead created: {lead_id}")
        
        # Step 2: Try payment with invalid lead_id first
        print("💳 Step 2: Attempting payment with invalid ID...")
        payment_payload = {
            "amount": 100,
            "currency": "cad",
            "lead_id": 99999,  # Non-existent
            "customer_email": "recovery@example.com",
            "vendor_slug": "movers"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/payment/create-link",
            json=payment_payload
        )
        
        assert response.status_code in [404, 400, 422]
        print(f"✅ Invalid payment rejected: {response.status_code}")
        
        # Step 3: Retry with correct lead_id
        print("💳 Step 3: Retrying with correct ID...")
        payment_payload["lead_id"] = lead_id
        
        response = requests.post(
            f"{BASE_URL}/api/payment/create-link",
            json=payment_payload
        )
        
        assert response.status_code == 200
        print("✅ Payment successful on retry!")
        
        print("🎉 Recovery flow working!")
    
    # ============ CONCURRENT USER FLOW ============
    
    def test_concurrent_users_flow(self):
        """Test multiple users creating quotes simultaneously"""
        print("\n👥 Testing Concurrent Users Flow")
        
        from concurrent.futures import ThreadPoolExecutor
        
        def create_quote_for_user(user_id):
            try:
                data = {
                    "customer_name": f"Concurrent User {user_id}",
                    "customer_email": f"user{user_id}@example.com",
                    "customer_phone": f"+1234567{user_id:03d}",
                    "move_from": f"Address {user_id}, Toronto",
                    "move_to": f"Address {user_id}, Vancouver",
                    "move_date": "2025-12-01",
                    "move_time": "Morning",
                    "vendor_name": "Movers",
                    "total_cost": 100.00 + (user_id * 10)
                }
                
                response = requests.post(f"{BASE_URL}/api/leads", json=data)
                return response.status_code == 200, response.json().get("id")
            except Exception as e:
                return False, str(e)
        
        # Create 10 quotes simultaneously
        print("📝 Creating 10 quotes simultaneously...")
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(create_quote_for_user, i)
                for i in range(10)
            ]
            results = [f.result() for f in futures]
        
        successes = sum(1 for success, _ in results if success)
        print(f"✅ {successes}/10 quotes created successfully")
        
        # At least 70% should succeed (some might be rate limited)
        assert successes >= 7
        
        print("🎉 Concurrent users handled correctly!")
    
    # ============ DATA PERSISTENCE FLOW ============
    
    def test_data_persistence_flow(self):
        """Test that data persists correctly"""
        print("\n💾 Testing Data Persistence Flow")
        
        # Step 1: Create a lead
        print("📝 Step 1: Creating lead...")
        original_data = {
            "customer_name": "Persistence Test",
            "customer_email": "persist@example.com",
            "customer_phone": "+1234567890",
            "move_from": "123 Original St",
            "move_to": "456 Final Ave",
            "move_date": "2025-12-01",
            "move_time": "Afternoon",
            "vendor_name": "Test Movers",
            "total_cost": 750.00
        }
        
        create_response = requests.post(f"{BASE_URL}/api/leads", json=original_data)
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        print(f"✅ Lead created: {lead_id}")
        
        # Step 2: Retrieve the lead immediately
        print("🔍 Step 2: Retrieving lead immediately...")
        retrieve_response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert retrieve_response.status_code == 200
        retrieved_data = retrieve_response.json()
        print("✅ Lead retrieved immediately")
        
        # Step 3: Wait and retrieve again
        print("⏳ Step 3: Waiting and retrieving again...")
        time.sleep(1)
        
        retrieve_again = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        assert retrieve_again.status_code == 200
        persistent_data = retrieve_again.json()
        print("✅ Lead still persists")
        
        # Verify data matches
        assert retrieved_data["customer_name"] == original_data["customer_name"]
        assert persistent_data["customer_name"] == original_data["customer_name"]
        assert retrieved_data["total_cost"] == persistent_data["total_cost"]
        
        print("🎉 Data persistence verified!")
    
    # ============ FULL SYSTEM HEALTH CHECK ============
    
    def test_system_health_check(self):
        """Test overall system health"""
        print("\n🏥 Testing System Health")
        
        # Check backend health
        print("🖥️  Checking backend health...")
        backend_health = requests.get(f"{BASE_URL}/health")
        assert backend_health.status_code == 200
        health_data = backend_health.json()
        
        print(f"✅ Backend: {health_data['status']}")
        print(f"   Database: {health_data['services']['database']}")
        print(f"   Email: {health_data['services']['email']}")
        print(f"   Stripe: {health_data['services']['stripe']}")
        print(f"   Mapbox: {health_data['services']['mapbox']}")
        
        # Verify all services are healthy
        assert health_data["status"] == "healthy"
        assert health_data["services"]["database"] == "healthy"
        assert health_data["services"]["email"] == "configured"
        
        print("🎉 All systems healthy!")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short", "-s"])

