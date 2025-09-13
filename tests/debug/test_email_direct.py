#!/usr/bin/env python3
"""
Direct GoDaddy 365 Email Test
Simple, focused test using provided credentials
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Credentials from 50234923.txt
SMTP_SERVER = "smtp.office365.com"
SMTP_PORT = 587
SMTP_USERNAME = "support@movedin.com"
SMTP_PASSWORD = "gagxov-syxkek-8byvDu"

def test_direct_email():
    """Test direct email sending with GoDaddy 365"""
    print("🧪 Direct GoDaddy 365 Email Test")
    print("=" * 50)
    print(f"📧 Server: {SMTP_SERVER}")
    print(f"🔌 Port: {SMTP_PORT}")
    print(f"👤 Username: {SMTP_USERNAME}")
    print(f"🔑 Password: {'*' * len(SMTP_PASSWORD)}")
    print(f"⏰ Time: {datetime.now()}")
    print("=" * 50)
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = SMTP_USERNAME
        msg['To'] = SMTP_USERNAME  # Send to self for testing
        msg['Subject'] = f"MovedIn 2.0 - Direct Email Test - {datetime.now().strftime('%H:%M:%S')}"
        
        # Email body
        body = f"""
        🧪 MovedIn 2.0 Direct Email Test
        
        This is a direct test email using GoDaddy 365 SMTP.
        
        Test Details:
        - Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        - SMTP Server: {SMTP_SERVER}
        - Port: {SMTP_PORT}
        - Username: {SMTP_USERNAME}
        - Test Type: Direct SMTP Connection
        
        If you receive this email, the GoDaddy 365 email system is working correctly!
        
        Best regards,
        MovedIn 2.0 Test System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        print("🌐 Connecting to SMTP server...")
        # Create secure connection
        context = ssl.create_default_context()
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            print("🔐 Starting TLS connection...")
            server.starttls(context=context)
            
            print("🔑 Authenticating...")
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            
            print("📤 Sending email...")
            server.send_message(msg)
        
        print("✅ Email sent successfully!")
        print("📬 Check your inbox at support@movedin.com")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Authentication failed: {e}")
        print("💡 Check your email credentials")
        return False
    except smtplib.SMTPRecipientsRefused as e:
        print(f"❌ Recipient refused: {e}")
        return False
    except smtplib.SMTPServerDisconnected as e:
        print(f"❌ Server disconnected: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🚀 Starting direct email test...")
    success = test_direct_email()
    
    if success:
        print("\n🎉 SUCCESS: Email system is working!")
        print("📧 Check support@movedin.com for the test email")
    else:
        print("\n💥 FAILED: Email system needs configuration")
        print("🔧 Check credentials and SMTP settings")
