#!/usr/bin/env python3
"""
Test script for MovedIn 3.0 Email System
Tests the complete flow: lead creation + email notifications
"""

import requests
import json
import time

# Configuration
API_BASE = "http://localhost:8000"

def test_lead_creation_and_emails():
    """Test the complete lead creation and email flow"""
    
    print("🧪 Testing MovedIn 3.0 Email System")
    print("=" * 50)
    
    # Test data
    lead_data = {
        "customer_name": "John Doe",
        "customer_email": "test@example.com",
        "customer_phone": "5551234567",
        "move_from": "123 Main St, Toronto, ON",
        "move_to": "456 Oak Ave, Mississauga, ON",
        "move_date": "2025-11-15",
        "move_time": "Morning",
        "vendor_name": "Let's Get Moving",
        "total_cost": 2500.00
    }
    
    try:
        # 1. Create lead
        print("📝 Step 1: Creating lead...")
        response = requests.post(f"{API_BASE}/api/leads", json=lead_data)
        
        if response.status_code == 200:
            lead_result = response.json()
            lead_id = lead_result['id']
            print(f"✅ Lead created successfully: ID #{lead_id}")
            print(f"   Customer: {lead_result['customer_name']}")
            print(f"   Vendor: {lead_result['vendor_name']}")
        else:
            print(f"❌ Lead creation failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
        
        # 2. Send email notifications
        print("\n📧 Step 2: Sending email notifications...")
        email_response = requests.post(f"{API_BASE}/api/leads/{lead_id}/notify")
        
        if email_response.status_code == 200:
            email_result = email_response.json()
            print(f"✅ Email notifications sent: {email_result['message']}")
            print(f"   Status: {email_result['status']}")
        else:
            print(f"❌ Email notification failed: {email_response.status_code}")
            print(f"   Error: {email_response.text}")
            return False
        
        # 3. Check lead details
        print("\n📋 Step 3: Verifying lead details...")
        lead_response = requests.get(f"{API_BASE}/api/leads/{lead_id}")
        
        if lead_response.status_code == 200:
            lead_details = lead_response.json()
            print(f"✅ Lead details retrieved:")
            print(f"   ID: {lead_details['id']}")
            print(f"   Customer: {lead_details['customer_name']}")
            print(f"   Email: {lead_details['customer_email']}")
            print(f"   Vendor: {lead_details['vendor_name']}")
            print(f"   Total Cost: ${lead_details['total_cost']}")
            print(f"   Status: {lead_details['payment_status']}")
        else:
            print(f"❌ Failed to retrieve lead details: {lead_response.status_code}")
            return False
        
        print("\n🎉 Email System Test COMPLETED Successfully!")
        print("📧 Check the Docker logs for email details:")
        print("   docker-compose logs movedin-backend")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend API")
        print("   Make sure the Docker container is running:")
        print("   docker-compose up -d")
        return False
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

def check_backend_health():
    """Check if backend is healthy"""
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            health = response.json()
            print(f"✅ Backend is healthy")
            print(f"   Status: {health['status']}")
            print(f"   Database: {health['services']['database']}")
            print(f"   Email: {health['services']['email']}")
            print(f"   Stripe: {health['services']['stripe']}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        return False

if __name__ == "__main__":
    print("🚀 MovedIn 3.0 Email System Test")
    print("=" * 50)
    
    # Check backend health first
    if not check_backend_health():
        print("\n❌ Backend is not healthy. Please check Docker container.")
        exit(1)
    
    print("\n" + "=" * 50)
    
    # Run the email test
    success = test_lead_creation_and_emails()
    
    if success:
        print("\n✅ All tests passed! Email system is working.")
        exit(0)
    else:
        print("\n❌ Tests failed. Check the logs for details.")
        exit(1)
