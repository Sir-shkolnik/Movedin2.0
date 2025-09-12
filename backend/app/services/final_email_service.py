"""
Final Email Service for MovedIn 2.0
Sends exactly 3 emails with NO duplicates and clear payment status
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional
import logging
import os
from datetime import datetime
from app.core.config import settings
from app.services.professional_email_templates import professional_email_templates

logger = logging.getLogger(__name__)

class FinalEmailService:
    """Final email service - NO duplicates, clear payment status"""
    
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.support_email = "support@movedin.com"
        
        logger.info(f"📧 Final Email Service initialized")
        logger.info(f"📧 SMTP Server: {self.smtp_server}:{self.smtp_port}")
        logger.info(f"📧 Username: {self.smtp_username}")
        logger.info(f"📧 Password configured: {bool(self.smtp_password)}")
    
    def send_email(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email using Office 365 SMTP"""
        try:
            logger.info(f"📧 Sending email to {to_email}")
            logger.info(f"📧 Subject: {subject}")
            
            if not self.smtp_password:
                logger.warning("⚠️ SMTP password not configured - email will be logged to file")
                self._log_email_to_file(to_email, subject, body)
                return True
            
            msg = MIMEMultipart('alternative')
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            msg['Reply-To'] = self.support_email
            
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
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
    
    def _log_email_to_file(self, to_email: str, subject: str, body: str) -> None:
        """Log email to file for testing"""
        try:
            os.makedirs('logs', exist_ok=True)
            log_file = f"logs/email_log_{datetime.now().strftime('%Y%m%d')}.txt"
            
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(f"\n{'='*80}\n")
                f.write(f"📧 EMAIL - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"To: {to_email}\n")
                f.write(f"Subject: {subject}\n")
                f.write(f"{'='*80}\n")
                f.write(f"{body}\n")
                f.write(f"{'='*80}\n")
            
            logger.info(f"📧 Email logged to {log_file}")
            
        except Exception as e:
            logger.error(f"Failed to log email: {e}")
    
    def send_final_booking_emails(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> Dict[str, bool]:
        """
        Send exactly 3 emails for a complete booking - NO DUPLICATES:
        1. Customer confirmation email (to customer)
        2. Vendor order email (to support@movedin.com - for now all vendors go here)
        3. Admin health status email (to support@movedin.com - but different subject)
        """
        try:
            logger.info(f"🎯 Sending FINAL booking emails for lead #{lead_id}")
            
            # Extract data
            contact = lead_data.get('contact_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            customer_email = contact.get('email', '')
            vendor_name = selected_quote.get('vendor_name', 'Unknown Vendor')
            
            results = {
                "customer_email": False,
                "vendor_email": False,
                "admin_email": False
            }
            
            # 1. Customer Confirmation Email (to customer)
            if customer_email:
                logger.info(f"📧 Sending customer confirmation to {customer_email}")
                customer_subject = f"🎉 Booking Confirmation #{lead_id} - MovedIn"
                customer_body = professional_email_templates.customer_confirmation_email(
                    lead_data, lead_id, payment_intent_id
                )
                results["customer_email"] = self.send_email(
                    customer_email, customer_subject, customer_body, is_html=True
                )
            
            # 2. Vendor Order Email (to support@movedin.com - for vendor management)
            logger.info(f"📧 Sending vendor order to {self.support_email}")
            vendor_subject = f"📋 VENDOR ORDER #{lead_id} - {vendor_name} - MovedIn Platform"
            vendor_body = professional_email_templates.vendor_order_email(
                lead_data, lead_id, vendor_name, payment_intent_id
            )
            results["vendor_email"] = self.send_email(
                self.support_email, vendor_subject, vendor_body, is_html=True
            )
            
            # 3. Admin Health Status Email (to support@movedin.com - for system tracking)
            logger.info(f"📧 Sending admin health status to {self.support_email}")
            admin_subject = f"📊 SYSTEM STATUS #{lead_id} - MovedIn Admin Dashboard"
            admin_body = professional_email_templates.admin_health_email(
                lead_data, lead_id, payment_intent_id
            )
            results["admin_email"] = self.send_email(
                self.support_email, admin_subject, admin_body, is_html=True
            )
            
            logger.info(f"✅ FINAL booking emails sent - Results: {results}")
            return results
            
        except Exception as e:
            logger.error(f"❌ Failed to send final booking emails: {e}")
            return {
                "customer_email": False,
                "vendor_email": False,
                "admin_email": False
            }

# Create global instance
final_email_service = FinalEmailService()
