#!/usr/bin/env python3
"""
Test email with provided credentials
"""

import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Set credentials
os.environ['SMTP_PASSWORD'] = 'gagxov-syxkek-8byvDu'

# Import email service
import sys
sys.path.append('/Users/udishkolnik/6/Movedin2.0/backend')

from app.services.email_service import EmailService

def test_email():
    print("🧪 Testing GoDaddy 365 Email with Credentials")
    print("=" * 50)
    
    # Create email service
    email_service = EmailService()
    
    print(f"📧 Server: {email_service.smtp_server}")
    print(f"🔌 Port: {email_service.smtp_port}")
    print(f"👤 Username: {email_service.smtp_username}")
    print(f"🔑 Password configured: {'Yes' if email_service.smtp_password else 'No'}")
    
    # Test email
    subject = f"MovedIn 2.0 Test - {datetime.now().strftime('%H:%M:%S')}"
    body = f"""
    🧪 MovedIn 2.0 Email Test
    
    This is a test email using GoDaddy 365 credentials.
    
    Test Details:
    - Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    - SMTP Server: {email_service.smtp_server}
    - Port: {email_service.smtp_port}
    - Username: {email_service.smtp_username}
    
    If you receive this email, the system is working!
    
    Best regards,
    MovedIn 2.0 Test System
    """
    
    print("\n📤 Sending test email...")
    success = email_service.send_email(
        to_email="support@movedin.com",
        subject=subject,
        body=body
    )
    
    if success:
        print("✅ SUCCESS: Email sent successfully!")
        print("📬 Check support@movedin.com inbox")
    else:
        print("❌ FAILED: Email could not be sent")
    
    return success

if __name__ == "__main__":
    test_email()
