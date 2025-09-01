import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List
import logging
from datetime import datetime
import os

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending email notifications to vendors and support"""
    
    def __init__(self):
        # Email configuration - these should be set as environment variables
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "support@movedin.com")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.support_email = "support@movedin.com"
        
    def send_email(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email using SMTP"""
        try:
            if not self.smtp_password:
                logger.warning("SMTP password not configured - logging email instead")
                logger.info(f"📧 EMAIL NOTIFICATION")
                logger.info(f"📧 To: {to_email}")
                logger.info(f"📧 Subject: {subject}")
                logger.info(f"📧 Body: {body}")
                return True
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send email to {to_email}: {e}")
            return False
    
    def send_lead_notification_to_support(self, lead_data: Dict[str, Any], lead_id: int) -> bool:
        """Send notification to support@movedin.com when a new lead is created"""
        try:
            subject = f"🆕 New Lead Created - Lead #{lead_id} - MovedIn 2.0"
            
            # Extract data
            contact_data = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            body = f"""
🚚 NEW LEAD CREATED - MovedIn 2.0

Lead ID: #{lead_id}
Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Status: New Lead - Awaiting Payment
Source: MovedIn 2.0 Platform (movedin.com)

📋 CUSTOMER DETAILS:
Name: {contact_data.get('firstName', '')} {contact_data.get('lastName', '')}
Email: {contact_data.get('email', '')}
Phone: {contact_data.get('phone', '')}

🏠 MOVE DETAILS:
From: {quote_data.get('originAddress', '')}
To: {quote_data.get('destinationAddress', '')}
Date: {quote_data.get('moveDate', '')}
Time: {quote_data.get('moveTime', '')}
Rooms: {quote_data.get('totalRooms', '')}
Square Footage: {quote_data.get('squareFootage', '')}
Estimated Weight: {quote_data.get('estimatedWeight', '')} lbs

🚪 PROPERTY DETAILS:
Stairs at Pickup: {quote_data.get('stairsAtPickup', 0)} flights
Stairs at Dropoff: {quote_data.get('stairsAtDropoff', 0)} flights
Elevator at Pickup: {'Yes' if quote_data.get('elevatorAtPickup') else 'No'}
Elevator at Dropoff: {'Yes' if quote_data.get('elevatorAtDropoff') else 'No'}

📦 HEAVY ITEMS:
Piano: {quote_data.get('heavyItems', {}).get('piano', 0)} units
Safe: {quote_data.get('heavyItems', {}).get('safe', 0)} units
Treadmill: {quote_data.get('heavyItems', {}).get('treadmill', 0)} units

🛠️ ADDITIONAL SERVICES:
Packing: {'Yes' if quote_data.get('additionalServices', {}).get('packing') else 'No'}
Storage: {'Yes' if quote_data.get('additionalServices', {}).get('storage') else 'No'}
Cleaning: {'Yes' if quote_data.get('additionalServices', {}).get('cleaning') else 'No'}
Junk Removal: {'Yes' if quote_data.get('additionalServices', {}).get('junk') else 'No'}

💰 QUOTE DETAILS:
Vendor: {selected_quote.get('vendor_name', '')}
Total Cost: ${selected_quote.get('total_cost', 0):.2f} CAD
Crew Size: {selected_quote.get('crew_size', '')} movers
Truck Count: {selected_quote.get('truck_count', '')} trucks
Estimated Hours: {selected_quote.get('estimated_hours', '')} hours
Travel Time: {selected_quote.get('travel_time_hours', '')} hours

📊 DISPATCHER INFO:
Location: {selected_quote.get('dispatcher_info', {}).get('name', '')}
Address: {selected_quote.get('dispatcher_info', {}).get('address', '')}
Distance: {selected_quote.get('dispatcher_info', {}).get('total_distance_km', 0)} km
Phone: {selected_quote.get('dispatcher_info', {}).get('sales_phone', '')}
Email: {selected_quote.get('dispatcher_info', {}).get('email', '')}

💳 PAYMENT STATUS:
Deposit Required: $100.00 CAD
Payment Method: Stripe (Credit/Debit Card)
Status: Pending - Customer needs to complete payment

🎯 NEXT STEPS:
1. Customer will receive payment link via email
2. Customer completes $100 deposit payment
3. Payment confirmation triggers vendor notification
4. Vendor contacts customer to arrange move details

---
This notification was automatically generated by MovedIn 2.0
Lead ID: {lead_id}
Platform: movedin.com
Support: support@movedin.com
            """
            
            return self.send_email(self.support_email, subject, body)
            
        except Exception as e:
            logger.error(f"Failed to send support notification: {e}")
            return False
    
    def send_payment_notification_to_support(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str) -> bool:
        """Send notification to support@movedin.com when payment is completed"""
        try:
            subject = f"💰 Payment Completed - Lead #{lead_id} - MovedIn 2.0"
            
            # Extract data
            contact_data = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            body = f"""
💰 PAYMENT COMPLETED - MovedIn 2.0

Lead ID: #{lead_id}
Payment Intent: {payment_intent_id}
Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Status: Payment Completed
Source: MovedIn 2.0 Platform (movedin.com)

📋 CUSTOMER DETAILS:
Name: {contact_data.get('firstName', '')} {contact_data.get('lastName', '')}
Email: {contact_data.get('email', '')}
Phone: {contact_data.get('phone', '')}

🏠 MOVE DETAILS:
From: {quote_data.get('originAddress', '')}
To: {quote_data.get('destinationAddress', '')}
Date: {quote_data.get('moveDate', '')}
Time: {quote_data.get('moveTime', '')}
Rooms: {quote_data.get('totalRooms', '')}
Square Footage: {quote_data.get('squareFootage', '')}
Estimated Weight: {quote_data.get('estimatedWeight', '')} lbs

🚪 PROPERTY DETAILS:
Stairs at Pickup: {quote_data.get('stairsAtPickup', 0)} flights
Stairs at Dropoff: {quote_data.get('stairsAtDropoff', 0)} flights
Elevator at Pickup: {'Yes' if quote_data.get('elevatorAtPickup') else 'No'}
Elevator at Dropoff: {'Yes' if quote_data.get('elevatorAtDropoff') else 'No'}

📦 HEAVY ITEMS:
Piano: {quote_data.get('heavyItems', {}).get('piano', 0)} units
Safe: {quote_data.get('heavyItems', {}).get('safe', 0)} units
Treadmill: {quote_data.get('heavyItems', {}).get('treadmill', 0)} units

🛠️ ADDITIONAL SERVICES:
Packing: {'Yes' if quote_data.get('additionalServices', {}).get('packing') else 'No'}
Storage: {'Yes' if quote_data.get('additionalServices', {}).get('storage') else 'No'}
Cleaning: {'Yes' if quote_data.get('additionalServices', {}).get('cleaning') else 'No'}
Junk Removal: {'Yes' if quote_data.get('additionalServices', {}).get('junk') else 'No'}

💰 QUOTE DETAILS:
Vendor: {selected_quote.get('vendor_name', '')}
Total Cost: ${selected_quote.get('total_cost', 0):.2f} CAD
Crew Size: {selected_quote.get('crew_size', '')} movers
Truck Count: {selected_quote.get('truck_count', '')} trucks
Estimated Hours: {selected_quote.get('estimated_hours', '')} hours
Travel Time: {selected_quote.get('travel_time_hours', '')} hours

📊 DISPATCHER INFO:
Location: {selected_quote.get('dispatcher_info', {}).get('name', '')}
Address: {selected_quote.get('dispatcher_info', {}).get('address', '')}
Distance: {selected_quote.get('dispatcher_info', {}).get('total_distance_km', 0)} km
Phone: {selected_quote.get('dispatcher_info', {}).get('sales_phone', '')}
Email: {selected_quote.get('dispatcher_info', {}).get('email', '')}

🎉 REVENUE GENERATED:
Deposit Amount: $100.00 CAD
Total Quote: ${selected_quote.get('total_cost', 0):.2f} CAD
Payment Method: Stripe (Credit/Debit Card)
Payment Status: Confirmed
Transaction ID: {payment_intent_id}

📈 BUSINESS IMPACT:
- New booking confirmed
- Revenue generated: $100.00 CAD deposit
- Vendor notified automatically
- Customer ready for move coordination

---
This notification was automatically generated by MovedIn 2.0
Lead ID: {lead_id}
Payment Intent: {payment_intent_id}
Platform: movedin.com
Support: support@movedin.com
            """
            
            return self.send_email(self.support_email, subject, body)
            
        except Exception as e:
            logger.error(f"Failed to send payment notification to support: {e}")
            return False
    
    def send_vendor_notification(self, lead_data: Dict[str, Any], vendor_email: str, lead_id: int, payment_intent_id: str = None) -> bool:
        """Send notification to vendor when payment is completed"""
        try:
            # Extract data
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            contact_data = lead_data.get('contact_data', {})
            
            if payment_intent_id:
                subject = f"🚚 New Move Booking - Lead #{lead_id} - Payment Confirmed - MovedIn"
                status_text = "Payment Completed - $100 Deposit Received"
            else:
                subject = f"🆕 New Lead - Lead #{lead_id} - Awaiting Payment - MovedIn"
                status_text = "Awaiting Payment"
            
            body = f"""
🚚 NEW MOVE BOOKING - MovedIn 2.0

Lead ID: #{lead_id}
Status: {status_text}
{f"Payment Intent: {payment_intent_id}" if payment_intent_id else ""}
Received: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Source: MovedIn 2.0 Platform (movedin.com)

📋 CUSTOMER DETAILS:
Name: {contact_data.get('firstName', '')} {contact_data.get('lastName', '')}
Email: {contact_data.get('email', '')}
Phone: {contact_data.get('phone', '')}

🏠 MOVE DETAILS:
From: {quote_data.get('originAddress', '')}
To: {quote_data.get('destinationAddress', '')}
Date: {quote_data.get('moveDate', '')}
Time: {quote_data.get('moveTime', '')}
Rooms: {quote_data.get('totalRooms', '')}
Square Footage: {quote_data.get('squareFootage', '')}
Estimated Weight: {quote_data.get('estimatedWeight', '')} lbs

🚪 PROPERTY DETAILS:
Stairs at Pickup: {quote_data.get('stairsAtPickup', 0)} flights
Stairs at Dropoff: {quote_data.get('stairsAtDropoff', 0)} flights
Elevator at Pickup: {'Yes' if quote_data.get('elevatorAtPickup') else 'No'}
Elevator at Dropoff: {'Yes' if quote_data.get('elevatorAtDropoff') else 'No'}

📦 HEAVY ITEMS:
Piano: {quote_data.get('heavyItems', {}).get('piano', 0)} units
Safe: {quote_data.get('heavyItems', {}).get('safe', 0)} units
Treadmill: {quote_data.get('heavyItems', {}).get('treadmill', 0)} units

🛠️ ADDITIONAL SERVICES:
Packing: {'Yes' if quote_data.get('additionalServices', {}).get('packing') else 'No'}
Storage: {'Yes' if quote_data.get('additionalServices', {}).get('storage') else 'No'}
Cleaning: {'Yes' if quote_data.get('additionalServices', {}).get('cleaning') else 'No'}
Junk Removal: {'Yes' if quote_data.get('additionalServices', {}).get('junk') else 'No'}

💰 QUOTE DETAILS:
Vendor: {selected_quote.get('vendor_name', '')}
Total Cost: ${selected_quote.get('total_cost', 0):.2f} CAD
Crew Size: {selected_quote.get('crew_size', '')} movers
Truck Count: {selected_quote.get('truck_count', '')} trucks
Estimated Hours: {selected_quote.get('estimated_hours', '')} hours
Travel Time: {selected_quote.get('travel_time_hours', '')} hours

📊 DISPATCHER INFO:
Location: {selected_quote.get('dispatcher_info', {}).get('name', '')}
Address: {selected_quote.get('dispatcher_info', {}).get('address', '')}
Distance: {selected_quote.get('dispatcher_info', {}).get('total_distance_km', 0)} km
Phone: {selected_quote.get('dispatcher_info', {}).get('sales_phone', '')}
Email: {selected_quote.get('dispatcher_info', {}).get('email', '')}

💳 PAYMENT INFORMATION:
{f"Deposit Amount: $100.00 CAD (PAID)" if payment_intent_id else "Deposit Required: $100.00 CAD"}
Payment Method: Stripe (Credit/Debit Card)
{f"Transaction ID: {payment_intent_id}" if payment_intent_id else "Status: Pending"}

📞 IMMEDIATE ACTION REQUIRED:
Please contact the customer within 24 hours to:
1. Confirm the booking details
2. Arrange move date and time
3. Discuss any special requirements
4. Provide move day instructions

Customer phone: {contact_data.get('phone', '')}
Customer email: {contact_data.get('email', '')}

🎯 IMPORTANT NOTES:
- This lead came from MovedIn 2.0 platform
- Customer has completed quote selection process
- {f"$100 deposit has been paid and confirmed" if payment_intent_id else "Customer needs to complete $100 deposit payment"}
- Please provide excellent service to maintain MovedIn reputation

---
This email was automatically generated by MovedIn 2.0
Lead ID: {lead_id}
{f"Payment Intent: {payment_intent_id}" if payment_intent_id else ""}
Platform: movedin.com
Support: support@movedin.com
            """
            
            return self.send_email(vendor_email, subject, body)
            
        except Exception as e:
            logger.error(f"Failed to send vendor notification: {e}")
            return False

# Global email service instance
email_service = EmailService()
