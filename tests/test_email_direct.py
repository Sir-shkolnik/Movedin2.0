#!/usr/bin/env python3
"""
Direct email test for MovedIn 3.0
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../src/backend'))

def test_email_sending():
    print("🧪 Testing MovedIn 3.0 Email System")
    print("=" * 50)
    
    try:
        # SMTP Configuration
        smtp_host = 'smtp.office365.com'
        smtp_port = 587
        smtp_user = 'support@movedin.com'
        smtp_pass = 'gagxov-syxkek-8byvDu'
        
        # Connect to SMTP server
        print("📡 Connecting to SMTP server...")
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        print("✅ SMTP connection successful!")
        
        # Test 1: Customer Email
        print("\n📧 Sending customer confirmation email...")
        msg1 = MIMEMultipart()
        msg1['From'] = smtp_user
        msg1['To'] = 'udishkolnik@gmail.com'
        msg1['Subject'] = '🎉 Move Booking Confirmed - Lead #4 - MovedIn'
        
        customer_body = """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #5340FF 0%, #4230dd 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h1>🎉 Your Move is Confirmed!</h1>
                <p>Thank you for choosing MovedIn</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb; color: #155724; margin: 20px 0;">
                <h2>✅ Booking Confirmed - Reference #4</h2>
                <p>Your $1.00 CAD deposit has been received and your move is now scheduled!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #5340FF;">
                <h2>📅 Your Move Details</h2>
                <p><strong>From:</strong> 16 Island Green Lane, Markham, Ontario L6C 0Y7, Canada</p>
                <p><strong>To:</strong> 21 Four Seasons Place, Etobicoke, Ontario M9B 0A5, Canada</p>
                <p><strong>Date:</strong> 2025-01-30</p>
                <p><strong>Time:</strong> Morning</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #5340FF;">
                <h2>🚚 Your Moving Company</h2>
                <p><strong>Company:</strong> Pierre & Sons Moving</p>
                <p><strong>Estimated Total:</strong> $849.00</p>
                <p><strong>Deposit Paid:</strong> $1.00 CAD ✅</p>
                <p><strong>Balance Due on Move Day:</strong> $848.00</p>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666;">
                <strong>Questions?</strong> Contact us at support@movedin.com<br>
                <strong>Booking Reference:</strong> #4 | <strong>Status:</strong> Confirmed ✅
            </div>
        </body>
        </html>
        """
        
        msg1.attach(MIMEText(customer_body, 'html'))
        server.send_message(msg1)
        print("✅ Customer email sent to udishkolnik@gmail.com")
        
        # Test 2: Vendor Email
        print("\n📧 Sending vendor notification email...")
        msg2 = MIMEMultipart()
        msg2['From'] = smtp_user
        msg2['To'] = 'support@movedin.com'
        msg2['Subject'] = '📋 NEW VENDOR ORDER - Lead #4 - Pierre & Sons Moving'
        
        vendor_body = """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h1>📋 NEW VENDOR ORDER</h1>
                <p>Lead #4 - Action Required</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 10px 0;">
                <h2>⚡ URGENT: Contact Customer Within 24 Hours</h2>
                <p><strong>Deposit paid:</strong> $1.00 CAD ✅ | <strong>Status:</strong> Ready for vendor contact</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #ff6b35;">
                <h2>👤 Customer Contact Details</h2>
                <p><strong>Name:</strong> Udi Shkolnik</p>
                <p><strong>Email:</strong> udishkolnik@gmail.com</p>
                <p><strong>Phone:</strong> +1234567890</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #ff6b35;">
                <h2>🏠 Move Details</h2>
                <p><strong>Pickup Address:</strong> 16 Island Green Lane, Markham, Ontario L6C 0Y7, Canada</p>
                <p><strong>Delivery Address:</strong> 21 Four Seasons Place, Etobicoke, Ontario M9B 0A5, Canada</p>
                <p><strong>Move Date:</strong> 2025-01-30</p>
                <p><strong>Preferred Time:</strong> Morning</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb;">
                <h2>📞 Required Actions</h2>
                <ol>
                    <li><strong>CALL CUSTOMER:</strong> Contact Udi Shkolnik at +1234567890 within 24 hours</li>
                    <li><strong>CONFIRM DETAILS:</strong> Verify move date, time, addresses, and special requirements</li>
                    <li><strong>SCHEDULE CREW:</strong> Assign movers and truck for 2025-01-30</li>
                    <li><strong>FINAL PAYMENT:</strong> Collect $848.00 on move completion</li>
                </ol>
            </div>
        </body>
        </html>
        """
        
        msg2.attach(MIMEText(vendor_body, 'html'))
        server.send_message(msg2)
        print("✅ Vendor email sent to support@movedin.com")
        
        # Test 3: Support Email
        print("\n📧 Sending support notification email...")
        msg3 = MIMEMultipart()
        msg3['From'] = smtp_user
        msg3['To'] = 'udi.shkolnik@alicesolutions.com'
        msg3['Subject'] = '📊 SYSTEM ALERT - Lead #4 - MovedIn 3.0'
        
        support_body = """
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h1>📊 SYSTEM ALERT</h1>
                <p>MovedIn 3.0 - Lead #4</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 6px;">
                <h2>✅ System Health Status</h2>
                <p>
                    <strong>Lead Created:</strong> Successfully ✅<br>
                    <strong>Payment Status:</strong> test_payment_completed ✅<br>
                    <strong>Email Notifications:</strong> Sent ✅<br>
                    <strong>Database:</strong> Updated ✅
                </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea;">
                <h2>📈 Lead Summary</h2>
                <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace;">
                    Lead ID: 4<br>
                    Customer: Udi Shkolnik<br>
                    Email: udishkolnik@gmail.com<br>
                    Phone: +1234567890<br>
                    Vendor: Pierre & Sons Moving<br>
                    Total: $849.00<br>
                    Deposit: $1.00<br>
                    Status: test_payment_completed
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea;">
                <h2>🗺️ Move Details</h2>
                <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace;">
                    From: 16 Island Green Lane, Markham, Ontario L6C 0Y7, Canada<br>
                    To: 21 Four Seasons Place, Etobicoke, Ontario M9B 0A5, Canada<br>
                    Date: 2025-01-30<br>
                    Time: Morning
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea;">
                <h2>💰 Revenue Tracking</h2>
                <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace;">
                    Deposit Collected: $1.00 CAD<br>
                    Total Contract Value: $849.00<br>
                    Pending Collection: $848.00<br>
                    Payment Intent ID: test_pi_4
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666;">
                <strong>System:</strong> MovedIn 3.0 Smart & Secure<br>
                <strong>Timestamp:</strong> 2025-10-21 16:19:00<br>
                <strong>Environment:</strong> Production
            </div>
        </body>
        </html>
        """
        
        msg3.attach(MIMEText(support_body, 'html'))
        server.send_message(msg3)
        print("✅ Support email sent to udi.shkolnik@alicesolutions.com")
        
        server.quit()
        print("\n🎉 ALL 3 EMAILS SENT SUCCESSFULLY!")
        print("=" * 50)
        print("📧 Customer email → udishkolnik@gmail.com")
        print("📧 Vendor email → support@movedin.com")
        print("📧 Support email → udi.shkolnik@alicesolutions.com")
        
    except Exception as e:
        print(f"❌ Email test failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_email_sending()
