import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List
import logging
from datetime import datetime
import os
from .email_templates import email_templates

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending email notifications to vendors and support"""
    
    def __init__(self):
        # Email configuration - GoDaddy 365 Email settings
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.office365.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "support@movedin.com")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.support_email = "support@movedin.com"
        
        logger.info(f"📧 Email Service initialized with:")
        logger.info(f"   Server: {self.smtp_server}")
        logger.info(f"   Port: {self.smtp_port}")
        logger.info(f"   Username: {self.smtp_username}")
        logger.info(f"   Password configured: {'Yes' if self.smtp_password else 'No'}")
        
    def send_email(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email using Office 365 SMTP or log to file if SMTP not configured"""
        try:
            logger.info(f"📧 Attempting to send email to {to_email}")
            logger.info(f"📧 Subject: {subject}")
            logger.info(f"📧 Body length: {len(body)} characters")
            logger.info(f"📧 HTML format: {is_html}")
            
            if not self.smtp_password:
                # Enhanced logging system for testing
                self._log_email_to_file(to_email, subject, body)
                logger.warning("⚠️ SMTP password not configured - email logged to file")
                return True
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            msg['Reply-To'] = self.support_email
            
            # Add body
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Send email using Office 365 SMTP
            logger.info(f"🌐 Connecting to {self.smtp_server}:{self.smtp_port}")
            context = ssl.create_default_context()
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                logger.info("🔐 Starting TLS connection...")
                server.starttls(context=context)
                
                logger.info(f"🔑 Logging in as {self.smtp_username}")
                server.login(self.smtp_username, self.smtp_password)
                
                logger.info(f"📤 Sending message to {to_email}")
                server.send_message(msg)
            
            logger.info(f"✅ Email sent successfully to {to_email}")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"❌ SMTP Authentication failed: {e}")
            logger.error("💡 Check your email credentials and ensure 'Less secure app access' is enabled")
            return False
        except smtplib.SMTPRecipientsRefused as e:
            logger.error(f"❌ Recipient refused: {e}")
            return False
        except smtplib.SMTPServerDisconnected as e:
            logger.error(f"❌ Server disconnected: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Failed to send email to {to_email}: {e}")
            logger.error(f"❌ Error type: {type(e).__name__}")
            return False
    
    def _log_email_to_file(self, to_email: str, subject: str, body: str) -> None:
        """Log email to file for testing purposes"""
        try:
            # Create logs directory if it doesn't exist
            os.makedirs('logs', exist_ok=True)
            
            # Create email log file
            log_file = f"logs/email_log_{datetime.now().strftime('%Y%m%d')}.txt"
            
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(f"\n{'='*80}\n")
                f.write(f"📧 EMAIL NOTIFICATION - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"{'='*80}\n")
                f.write(f"To: {to_email}\n")
                f.write(f"Subject: {subject}\n")
                f.write(f"From: {self.smtp_username}\n")
                f.write(f"{'='*80}\n")
                f.write(f"Body:\n{body}\n")
                f.write(f"{'='*80}\n")
            
            logger.info(f"📧 Email logged to {log_file}")
            
        except Exception as e:
            logger.error(f"Failed to log email to file: {e}")
            # Fallback to console logging
            logger.info(f"📧 EMAIL NOTIFICATION")
            logger.info(f"📧 To: {to_email}")
            logger.info(f"📧 Subject: {subject}")
            logger.info(f"📧 Body: {body}")
    
    def send_lead_notification_to_support(self, lead_data: Dict[str, Any], lead_id: int) -> bool:
        """Send beautiful support notification email with stunning template"""
        try:
            subject = f"📊 New Lead Created #{lead_id} - MovedIn 2.0"
            
            logger.info(f"📧 Creating beautiful support notification for lead #{lead_id}")
            body = email_templates.support_notification_template(lead_data, lead_id)
            
            return self.send_email(self.support_email, subject, body, is_html=True)
            
        except Exception as e:
            logger.error(f"Failed to send support notification: {e}")
            return False
    
    def send_payment_notification_to_support(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str) -> bool:
        """Send beautiful payment notification email with stunning template"""
        try:
            subject = f"💰 Payment Completed #{lead_id} - MovedIn 2.0"
            
            logger.info(f"📧 Creating beautiful payment notification for lead #{lead_id}")
            body = email_templates.support_notification_template(lead_data, lead_id, payment_intent_id)
            
            return self.send_email(self.support_email, subject, body, is_html=True)
            
        except Exception as e:
            logger.error(f"Failed to send payment notification: {e}")
            return False
    
    def send_customer_confirmation(self, lead_data: Dict[str, Any], customer_email: str, lead_id: int, payment_intent_id: str = None) -> bool:
        """Send beautiful customer confirmation email with estimate details"""
        try:
            subject = f"🎉 Booking Confirmation #{lead_id} - MovedIn"
            
            logger.info(f"📧 Sending customer confirmation for lead #{lead_id} to {customer_email}")
            body = email_templates.customer_confirmation_template(lead_data, lead_id, payment_intent_id)
            
            return self.send_email(customer_email, subject, body, is_html=True)
            
        except Exception as e:
            logger.error(f"Failed to send customer confirmation: {e}")
            return False

    def send_vendor_notification(self, lead_data: Dict[str, Any], vendor_email: str, lead_id: int, payment_intent_id: str = None) -> bool:
        """Send beautiful vendor notification email with stunning template"""
        try:
            # Use beautiful HTML template with Mapbox integration
            if payment_intent_id:
                subject = f"🚛 New Move Booking #{lead_id} - Payment Confirmed - MovedIn"
            else:
                subject = f"🆕 New Lead #{lead_id} - Awaiting Payment - MovedIn"
            
            logger.info(f"📧 Creating beautiful vendor notification for lead #{lead_id}")
            body = email_templates.vendor_notification_template(lead_data, lead_id, payment_intent_id)
            
            return self.send_email(vendor_email, subject, body, is_html=True)
            
        except Exception as e:
            logger.error(f"Failed to send vendor notification: {e}")
            return False

# Global email service instance
email_service = EmailService()
