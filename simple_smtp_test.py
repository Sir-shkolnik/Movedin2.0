#!/usr/bin/env python3
"""
Ultra-simple SMTP test
"""

import smtplib
import ssl
from email.mime.text import MIMEText

def test():
    print("🧪 Ultra-Simple SMTP Test")
    
    # Credentials
    server = "smtp.office365.com"
    port = 587
    username = "support@movedin.com"
    password = "gagxov-syxkek-8byvDu"
    
    print(f"Server: {server}:{port}")
    print(f"Username: {username}")
    print(f"Password: {'*' * len(password)}")
    
    try:
        # Create message
        msg = MIMEText("Hello from MovedIn 2.0 test!")
        msg['Subject'] = "MovedIn 2.0 Test"
        msg['From'] = username
        msg['To'] = username
        
        print("Connecting...")
        
        # Connect
        with smtplib.SMTP(server, port) as smtp:
            print("Starting TLS...")
            smtp.starttls()
            
            print("Logging in...")
            smtp.login(username, password)
            
            print("Sending email...")
            smtp.send_message(msg)
        
        print("✅ SUCCESS!")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test()
