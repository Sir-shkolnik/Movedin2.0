#!/usr/bin/env python3
"""
Simple SMTP Test for GoDaddy 365
"""

import smtplib
import ssl
from email.mime.text import MIMEText

# Test credentials
username = "support@movedin.com"
password = "gagxov-syxkek-8byvDu"
server = "smtp.office365.com"
port = 587

print("Testing GoDaddy 365 SMTP...")
print(f"Server: {server}:{port}")
print(f"Username: {username}")

try:
    # Create message
    msg = MIMEText("Test email from MovedIn 2.0")
    msg['Subject'] = "Test Email"
    msg['From'] = username
    msg['To'] = username
    
    # Connect and send
    with smtplib.SMTP(server, port) as smtp:
        smtp.starttls()
        smtp.login(username, password)
        smtp.send_message(msg)
    
    print("✅ SUCCESS: Email sent!")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
