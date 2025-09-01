#!/usr/bin/env python3
"""
Fix Payment Amounts Script
Updates all payment_completed leads with correct payment amounts and status
"""

import os
import sys
import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "https://movedin-backend.onrender.com"
PAYMENT_AMOUNT = 1.00  # $1 CAD deposit
PAYMENT_CURRENCY = "CAD"
PAYMENT_STATUS = "succeeded"

def update_lead_payment(lead_id):
    """Update a single lead with payment information"""
    try:
        print(f"🔧 Updating lead {lead_id}...")
        url = f"{BACKEND_URL}/api/payment-simple/update-payment-amounts"
        data = {
            "lead_id": lead_id,
            "amount": int(PAYMENT_AMOUNT * 100),  # Convert to cents
            "currency": PAYMENT_CURRENCY.lower()
        }
        
        print(f"📡 Sending request to: {url}")
        print(f"📦 Data: {data}")
        
        response = requests.post(url, json=data)
        print(f"📥 Response status: {response.status_code}")
        print(f"📥 Response text: {response.text}")
        
        if response.status_code == 200:
            print(f"✅ Lead {lead_id}: Updated successfully")
            return True
        else:
            print(f"❌ Lead {lead_id}: Failed - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Lead {lead_id}: Error - {e}")
        return False

def get_payment_completed_leads():
    """Get all leads with payment_completed status"""
    try:
        print(f"📡 Getting leads from: {BACKEND_URL}/api/leads")
        response = requests.get(f"{BACKEND_URL}/api/leads")
        print(f"📥 Response status: {response.status_code}")
        
        if response.status_code == 200:
            leads = response.json()
            print(f"📊 Total leads: {len(leads)}")
            payment_completed = [lead for lead in leads if lead.get('status') == 'payment_completed']
            print(f"📊 Payment completed leads: {len(payment_completed)}")
            return payment_completed
        else:
            print(f"❌ Failed to get leads: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Error getting leads: {e}")
        return []

def main():
    print("🔧 Fixing Payment Amounts for Completed Leads")
    print("=" * 50)
    
    # Get all payment_completed leads
    leads = get_payment_completed_leads()
    print(f"📊 Found {len(leads)} leads with payment_completed status")
    
    if not leads:
        print("❌ No leads to update")
        return
    
    # Update each lead
    success_count = 0
    for lead in leads:
        lead_id = lead.get('id')
        if lead_id:
            if update_lead_payment(lead_id):
                success_count += 1
    
    print("=" * 50)
    print(f"✅ Successfully updated {success_count}/{len(leads)} leads")
    print(f"💰 Payment amount: ${PAYMENT_AMOUNT} {PAYMENT_CURRENCY}")
    print(f"📅 Updated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
