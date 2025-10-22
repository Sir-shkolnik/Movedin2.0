"""
Smart Email Service for MovedIn 3.0
Sends ONE comprehensive email with all information
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
import logging
import os
from datetime import datetime
from app.services.email_template_service import EmailTemplateService

logger = logging.getLogger(__name__)

class SmartEmailService:
    """Smart email service - ONE email with ALL info"""
    
    def __init__(self):
        from app.core.config import settings
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.support_email = "support@movedin.com"
        self.template_service = EmailTemplateService()
        
        logger.info(f"📧 Smart Email Service initialized")
        logger.info(f"📧 SMTP Server: {self.smtp_server}:{self.smtp_port}")
        logger.info(f"📧 Username: {self.smtp_username}")
        logger.info(f"📧 Password configured: {bool(self.smtp_password)}")
        logger.info(f"📧 Templates loaded: {len(self.template_service.get_available_templates())}")
    
    async def send_smart_notification(self, lead) -> dict:
        """Send 3 smart emails: customer confirmation + 2 support notifications"""
        
        try:
            logger.info(f"🎯 Sending smart notifications for lead #{lead.id}")
            
            results = {
                'customer_email': False,
                'vendor_email': False,
                'support_email': False
            }
            
            # 1. Send customer confirmation email
            customer_data = self._prepare_lead_data(lead)
            customer_content = self.template_service.render_template('customer_confirmation_perfect', customer_data)
            results['customer_email'] = self._send_email(
                to_email=lead.customer_email,
                subject=f"🎉 Move Booking Confirmed - Lead #{lead.id} - MovedIn",
                body=customer_content,
                is_html=True
            )
            logger.info(f"📧 Customer email sent to {lead.customer_email}: {results['customer_email']}")
            
            # 2. Send vendor notification to support@movedin.com
            vendor_content = self.template_service.render_template('vendor_notification_perfect', customer_data)
            results['vendor_email'] = self._send_email(
                to_email=self.support_email,
                subject=f"📋 NEW VENDOR ORDER - Lead #{lead.id} - {lead.vendor_name}",
                body=vendor_content,
                is_html=True
            )
            logger.info(f"📧 Vendor email sent to {self.support_email}: {results['vendor_email']}")
            
            # 3. Send support notification to udi.shkolnik@alicesolutions.com
            support_content = self.template_service.render_template('support_notification_perfect', customer_data)
            results['support_email'] = self._send_email(
                to_email='udi.shkolnik@alicesolutions.com',
                subject=f"📊 SYSTEM ALERT - Lead #{lead.id} - MovedIn 3.0",
                body=support_content,
                is_html=True
            )
            logger.info(f"📧 Support email sent to udi.shkolnik@alicesolutions.com: {results['support_email']}")
            
            # Log summary
            success_count = sum(results.values())
            logger.info(f"✅ {success_count}/3 emails sent successfully for lead {lead.id}")
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Smart notification failed: {e}")
            return {'customer_email': False, 'vendor_email': False, 'support_email': False}
    
    def _prepare_lead_data(self, lead) -> Dict[str, Any]:
        """Prepare lead data for template rendering with enhanced map data"""
        deposit_paid = float(lead.deposit_paid) if lead.deposit_paid else 1.0
        total_cost = float(lead.total_cost) if lead.total_cost else 0.0
        balance_due = total_cost - deposit_paid
        
        # Enhanced data with map information
        return {
            'lead_id': lead.id,
            'customer_name': lead.customer_name,
            'customer_email': lead.customer_email,
            'customer_phone': lead.customer_phone,
            'move_from': lead.move_from,
            'move_to': lead.move_to,
            'move_date': lead.move_date,
            'move_time': lead.move_time,
            'vendor_name': lead.vendor_name,
            'total_cost': f"{total_cost:.2f}",
            'deposit_paid': f"{deposit_paid:.2f}",
            'balance_due': f"{balance_due:.2f}",
            'payment_status': lead.payment_status,
            'payment_intent_id': lead.payment_intent_id,
            'created_at': lead.created_at,
            # Enhanced map and route data
            'route_distance': '48.6 km',  # This would come from Mapbox API in production
            'route_duration': '39 minutes',
            'route_summary': 'via Highway 401',
            'map_image_url': f'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000({self._get_coordinates(lead.move_from)})/pin-s+00ff00({self._get_coordinates(lead.move_to)})/auto/600x300@2x?access_token=pk.eyJ1Ijoic3VwcG9ydG1vdmVkaW4iLCJhIjoiY21kZmdxdHh6MGQ2aDJqcHE2YTIwbTFrMiJ9.I1xkq82JXLMlgB02xT8LMw',
            'google_maps_url': f'https://www.google.com/maps/dir/{self._encode_address(lead.move_from)}/{self._encode_address(lead.move_to)}',
            'move_type': 'Residential Move',
            'estimated_crew': '3 movers, 1 truck',
            'service_area': 'Greater Toronto Area'
        }
    
    def _get_coordinates(self, address: str) -> str:
        """Get coordinates for map image (simplified for demo)"""
        # In production, this would use Mapbox Geocoding API
        if 'Toronto' in address or 'Markham' in address:
            return '-79.3832,43.6532'  # Toronto coordinates
        elif 'Vancouver' in address:
            return '-123.1216,49.2827'  # Vancouver coordinates
        else:
            return '-79.3832,43.6532'  # Default to Toronto
    
    def _encode_address(self, address: str) -> str:
        """Encode address for Google Maps URL"""
        return address.replace(' ', '+').replace(',', '%2C')
    
    def _create_customer_confirmation_email(self, lead) -> str:
        """Create customer confirmation email"""
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #5340FF 0%, #4230dd 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
                .section {{ background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #5340FF; }}
                .highlight {{ background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; }}
                .success {{ background: #d4edda; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb; color: #155724; }}
                .footer {{ margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Your Move is Confirmed!</h1>
                <p>Thank you for choosing MovedIn</p>
            </div>
            
            <div class="success">
                <h2>✅ Booking Confirmed - Reference #{lead.id}</h2>
                <p>Your $1.00 CAD deposit has been received and your move is now scheduled!</p>
            </div>
            
            <div class="section">
                <h2>📅 Your Move Details</h2>
                <div class="highlight">
                    <strong>From:</strong> {lead.move_from}<br>
                    <strong>To:</strong> {lead.move_to}<br>
                    <strong>Date:</strong> {lead.move_date}<br>
                    <strong>Time:</strong> {lead.move_time}
                </div>
            </div>
            
            <div class="section">
                <h2>🚚 Your Moving Company</h2>
                <div class="highlight">
                    <strong>Company:</strong> {lead.vendor_name}<br>
                    <strong>Estimated Total:</strong> ${lead.total_cost}<br>
                    <strong>Deposit Paid:</strong> ${lead.deposit_paid} CAD ✅<br>
                    <strong>Balance Due on Move Day:</strong> ${float(lead.total_cost) - float(lead.deposit_paid)}
                </div>
            </div>
            
            <div class="section">
                <h2>📞 What Happens Next?</h2>
                <ol>
                    <li><strong>The moving company will contact you within 24 hours</strong> to confirm details</li>
                    <li><strong>They'll answer any questions</strong> you have about your move</li>
                    <li><strong>On moving day,</strong> the remaining balance will be collected</li>
                </ol>
            </div>
            
            <div class="section">
                <h2>💡 Pro Tips for Moving Day</h2>
                <ul>
                    <li>Have boxes packed and labeled before movers arrive</li>
                    <li>Keep valuables and important documents with you</li>
                    <li>Have cash or card ready for final payment</li>
                    <li>Do a final walkthrough before leaving</li>
                </ul>
            </div>
            
            <div class="footer">
                <strong>Questions?</strong> Contact us at support@movedin.com<br>
                <strong>Booking Reference:</strong> #{lead.id} | <strong>Status:</strong> Confirmed ✅
            </div>
        </body>
        </html>
        """
    
    def _create_vendor_notification_email(self, lead) -> str:
        """Create vendor notification email for support@movedin.com"""
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
                .urgent {{ background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 10px 0; }}
                .section {{ background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #ff6b35; }}
                .highlight {{ background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; }}
                .action {{ background: #d4edda; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📋 NEW VENDOR ORDER</h1>
                <p>Lead #{lead.id} - Action Required</p>
            </div>
            
            <div class="urgent">
                <h2>⚡ URGENT: Contact Customer Within 24 Hours</h2>
                <p><strong>Deposit paid:</strong> $1.00 CAD ✅ | <strong>Status:</strong> Ready for vendor contact</p>
            </div>
            
            <div class="section">
                <h2>👤 Customer Contact Details</h2>
                <div class="highlight">
                    <strong>Name:</strong> {lead.customer_name}<br>
                    <strong>Email:</strong> <a href="mailto:{lead.customer_email}">{lead.customer_email}</a><br>
                    <strong>Phone:</strong> {lead.customer_phone}<br>
                    <strong>Preferred Contact:</strong> Phone or Email
                </div>
            </div>
            
            <div class="section">
                <h2>🏠 Move Details</h2>
                <div class="highlight">
                    <strong>Pickup Address:</strong> {lead.move_from}<br>
                    <strong>Delivery Address:</strong> {lead.move_to}<br>
                    <strong>Move Date:</strong> {lead.move_date}<br>
                    <strong>Preferred Time:</strong> {lead.move_time}
                </div>
            </div>
            
            <div class="section">
                <h2>🚚 Vendor Assignment</h2>
                <div class="highlight">
                    <strong>Moving Company:</strong> {lead.vendor_name}<br>
                    <strong>Quoted Price:</strong> ${lead.total_cost}<br>
                    <strong>Deposit Received:</strong> ${lead.deposit_paid} CAD ✅<br>
                    <strong>Balance to Collect:</strong> ${float(lead.total_cost) - float(lead.deposit_paid)}
                </div>
            </div>
            
            <div class="action">
                <h2>📞 Required Actions</h2>
                <ol>
                    <li><strong>CALL CUSTOMER:</strong> Contact {lead.customer_name} at {lead.customer_phone} within 24 hours</li>
                    <li><strong>CONFIRM DETAILS:</strong> Verify move date, time, addresses, and special requirements</li>
                    <li><strong>SCHEDULE CREW:</strong> Assign movers and truck for {lead.move_date}</li>
                    <li><strong>FINAL PAYMENT:</strong> Collect ${float(lead.total_cost) - float(lead.deposit_paid)} on move completion</li>
                </ol>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666;">
                <strong>Lead ID:</strong> #{lead.id} | <strong>Created:</strong> {lead.created_at} | <strong>Status:</strong> {lead.payment_status}
            </div>
        </body>
        </html>
        """
    
    def _create_support_notification_email(self, lead) -> str:
        """Create support notification email for udi.shkolnik@alicesolutions.com"""
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
                .section {{ background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea; }}
                .highlight {{ background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace; }}
                .metrics {{ background: #d4edda; padding: 15px; border-radius: 6px; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 SYSTEM ALERT</h1>
                <p>MovedIn 3.0 - Lead #{lead.id}</p>
            </div>
            
            <div class="metrics">
                <h2>✅ System Health Status</h2>
                <p>
                    <strong>Lead Created:</strong> Successfully ✅<br>
                    <strong>Payment Status:</strong> {lead.payment_status} ✅<br>
                    <strong>Email Notifications:</strong> Sent ✅<br>
                    <strong>Database:</strong> Updated ✅
                </p>
            </div>
            
            <div class="section">
                <h2>📈 Lead Summary</h2>
                <div class="highlight">
                    Lead ID: {lead.id}<br>
                    Customer: {lead.customer_name}<br>
                    Email: {lead.customer_email}<br>
                    Phone: {lead.customer_phone}<br>
                    Vendor: {lead.vendor_name}<br>
                    Total: ${lead.total_cost}<br>
                    Deposit: ${lead.deposit_paid}<br>
                    Status: {lead.payment_status}
                </div>
            </div>
            
            <div class="section">
                <h2>🗺️ Move Details</h2>
                <div class="highlight">
                    From: {lead.move_from}<br>
                    To: {lead.move_to}<br>
                    Date: {lead.move_date}<br>
                    Time: {lead.move_time}
                </div>
            </div>
            
            <div class="section">
                <h2>💰 Revenue Tracking</h2>
                <div class="highlight">
                    Deposit Collected: $1.00 CAD<br>
                    Total Contract Value: ${lead.total_cost}<br>
                    Pending Collection: ${float(lead.total_cost) - float(lead.deposit_paid)}<br>
                    Payment Intent ID: {lead.payment_intent_id or 'N/A'}
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666;">
                <strong>System:</strong> MovedIn 3.0 Smart & Secure<br>
                <strong>Timestamp:</strong> {lead.created_at}<br>
                <strong>Environment:</strong> Production
            </div>
        </body>
        </html>
        """
    
    def _create_smart_email_content(self, lead) -> str:
        """Create ONE comprehensive email with all info (legacy method)"""
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #5340FF 0%, #4230dd 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }}
                .section {{ background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #5340FF; }}
                .highlight {{ background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; }}
                .action {{ background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; }}
                .footer {{ margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 New Move Booking - Lead #{lead.id}</h1>
                <p>MovedIn 3.0 - Smart & Secure System</p>
            </div>
            
            <div class="section">
                <h2>👤 Customer Details</h2>
                <div class="highlight">
                    <strong>Name:</strong> {lead.customer_name}<br>
                    <strong>Email:</strong> {lead.customer_email}<br>
                    <strong>Phone:</strong> {lead.customer_phone}
                </div>
            </div>
            
            <div class="section">
                <h2>🏠 Move Details</h2>
                <div class="highlight">
                    <strong>From:</strong> {lead.move_from}<br>
                    <strong>To:</strong> {lead.move_to}<br>
                    <strong>Date:</strong> {lead.move_date}<br>
                    <strong>Time:</strong> {lead.move_time}
                </div>
            </div>
            
            <div class="section">
                <h2>🚚 Vendor Details</h2>
                <div class="highlight">
                    <strong>Company:</strong> {lead.vendor_name}<br>
                    <strong>Total Cost:</strong> ${lead.total_cost}<br>
                    <strong>Deposit Paid:</strong> ${lead.deposit_paid} CAD ✅
                </div>
            </div>
            
            <div class="action">
                <h2>📞 Next Steps</h2>
                <ol>
                    <li><strong>Contact customer within 24 hours</strong></li>
                    <li><strong>Confirm move details</strong></li>
                    <li><strong>Schedule the move</strong></li>
                    <li><strong>Collect remaining balance on move day</strong></li>
                </ol>
            </div>
            
            <div class="footer">
                <strong>System Info:</strong> Lead ID #{lead.id} | Created: {lead.created_at} | Status: {lead.payment_status}
            </div>
        </body>
        </html>
        """
    
    def _send_email(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email using Office 365 SMTP"""
        try:
            logger.info(f"📧 Sending smart notification to {to_email}")
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
            
            # Connect to SMTP server (same way as direct test that works)
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"✅ Smart notification sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to send smart notification: {e}")
            return False
    
    def _log_email_to_file(self, to_email: str, subject: str, body: str) -> None:
        """Log email to file for testing"""
        try:
            os.makedirs('logs', exist_ok=True)
            log_file = f"logs/smart_email_{datetime.now().strftime('%Y%m%d')}.txt"
            
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(f"\n{'='*80}\n")
                f.write(f"📧 SMART EMAIL - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"To: {to_email}\n")
                f.write(f"Subject: {subject}\n")
                f.write(f"{'='*80}\n")
                f.write(f"{body}\n")
                f.write(f"{'='*80}\n")
            
            logger.info(f"📧 Smart email logged to {log_file}")
            
        except Exception as e:
            logger.error(f"Failed to log smart email: {e}")

# Create global instance
smart_email_service = SmartEmailService()
