"""
Email Template Service for MovedIn 3.0
Handles loading and rendering of beautiful email templates
"""

import os
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class EmailTemplateService:
    """Service for loading and rendering email templates"""
    
    def __init__(self):
        self.templates = {}
        self._load_embedded_templates()
    
    def _load_embedded_templates(self):
        """Load embedded email templates"""
        try:
            # Customer confirmation template
            self.templates['customer_confirmation_perfect'] = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Move Booking Confirmed - MovedIn</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Move Booking Confirmed!</h1>
            <p>Your move is scheduled with {{ vendor_name }}</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ customer_name }}!</h2>
            <p>Thank you for choosing MovedIn for your upcoming move. Your booking has been confirmed!</p>
            
            <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <p><strong>Lead ID:</strong> #{{ lead_id }}</p>
                <p><strong>Moving Company:</strong> {{ vendor_name }}</p>
                <p><strong>Move Date:</strong> {{ move_date }}</p>
                <p><strong>Move Time:</strong> {{ move_time }}</p>
                <p><strong>From:</strong> {{ move_from }}</p>
                <p><strong>To:</strong> {{ move_to }}</p>
                <p><strong>Total Cost:</strong> ${{ total_cost }}</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>The moving company will contact you within 24 hours</li>
                <li>Confirm final details and any special requirements</li>
                <li>Prepare for your move day</li>
            </ul>
            
            <p>If you have any questions, please contact us at support@movedin.com</p>
        </div>
        
        <div class="footer">
            <p>MovedIn - Making Your Move Easy</p>
            <p>This email was sent to {{ customer_email }}</p>
        </div>
    </div>
</body>
</html>
"""
            
            # Vendor notification template
            self.templates['vendor_notification_perfect'] = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Vendor Order - MovedIn</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #059669; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 New Vendor Order</h1>
            <p>You have a new move booking!</p>
        </div>
        
        <div class="content">
            <h2>New Order for {{ vendor_name }}</h2>
            <p>A new move has been booked through MovedIn and assigned to your company.</p>
            
            <div class="order-details">
                <h3>📋 Order Details</h3>
                <p><strong>Lead ID:</strong> #{{ lead_id }}</p>
                <p><strong>Customer Name:</strong> {{ customer_name }}</p>
                <p><strong>Customer Email:</strong> {{ customer_email }}</p>
                <p><strong>Customer Phone:</strong> {{ customer_phone }}</p>
                <p><strong>Move Date:</strong> {{ move_date }}</p>
                <p><strong>Move Time:</strong> {{ move_time }}</p>
                <p><strong>From Address:</strong> {{ move_from }}</p>
                <p><strong>To Address:</strong> {{ move_to }}</p>
                <p><strong>Total Cost:</strong> ${{ total_cost }}</p>
            </div>
            
            <p><strong>Action Required:</strong></p>
            <ul>
                <li>Contact the customer within 24 hours</li>
                <li>Confirm move details and requirements</li>
                <li>Provide final quote if needed</li>
                <li>Schedule the move</li>
            </ul>
            
            <p>Customer contact: {{ customer_email }} | {{ customer_phone }}</p>
        </div>
        
        <div class="footer">
            <p>MovedIn Vendor Portal</p>
            <p>This order was generated on {{ current_date }}</p>
        </div>
    </div>
</body>
</html>
"""
            
            # Support notification template
            self.templates['support_notification_perfect'] = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>System Alert - MovedIn</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .alert-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #DC2626; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 System Alert</h1>
            <p>New Lead Created - MovedIn 3.0</p>
        </div>
        
        <div class="content">
            <h2>New Lead Alert</h2>
            <p>A new lead has been created in the MovedIn system and requires monitoring.</p>
            
            <div class="alert-details">
                <h3>📋 Lead Information</h3>
                <p><strong>Lead ID:</strong> #{{ lead_id }}</p>
                <p><strong>Customer Name:</strong> {{ customer_name }}</p>
                <p><strong>Customer Email:</strong> {{ customer_email }}</p>
                <p><strong>Customer Phone:</strong> {{ customer_phone }}</p>
                <p><strong>Vendor Assigned:</strong> {{ vendor_name }}</p>
                <p><strong>Move Date:</strong> {{ move_date }}</p>
                <p><strong>Move Time:</strong> {{ move_time }}</p>
                <p><strong>From Address:</strong> {{ move_from }}</p>
                <p><strong>To Address:</strong> {{ move_to }}</p>
                <p><strong>Total Cost:</strong> ${{ total_cost }}</p>
                <p><strong>Created:</strong> {{ current_date }}</p>
            </div>
            
            <p><strong>System Status:</strong></p>
            <ul>
                <li>Lead created successfully ✅</li>
                <li>Customer notification sent ✅</li>
                <li>Vendor notification sent ✅</li>
                <li>System monitoring active ✅</li>
            </ul>
            
            <p>Monitor this lead for any issues or follow-up required.</p>
        </div>
        
        <div class="footer">
            <p>MovedIn 3.0 System Monitoring</p>
            <p>Alert generated on {{ current_date }}</p>
        </div>
    </div>
</body>
</html>
"""
            
            logger.info(f"✅ Loaded {len(self.templates)} embedded email templates")
            
        except Exception as e:
            logger.error(f"❌ Error loading embedded templates: {e}")
    
    def render_template(self, template_name: str, data: Dict[str, Any]) -> str:
        """
        Render an email template with the provided data
        
        Args:
            template_name: Name of the template to render
            data: Dictionary of data to substitute in the template
            
        Returns:
            Rendered HTML content
        """
        try:
            if template_name not in self.templates:
                logger.error(f"❌ Template not found: {template_name}")
                return self._get_fallback_template(template_name, data)
            
            template_content = self.templates[template_name]
            
            # Replace template variables with actual data
            rendered_content = template_content
            
            # Calculate balance due
            if 'total_cost' in data and 'deposit_paid' in data:
                data['balance_due'] = f"{float(data['total_cost']) - float(data.get('deposit_paid', 1.0)):.2f}"
            elif 'total_cost' in data:
                data['balance_due'] = f"{float(data['total_cost']) - 1.0:.2f}"
            else:
                data['balance_due'] = "0.00"
            
            # Replace all template variables (both with and without spaces)
            for key, value in data.items():
                # Replace {{ key }} (with spaces)
                placeholder_with_spaces = f"{{{{ {key} }}}}"
                rendered_content = rendered_content.replace(placeholder_with_spaces, str(value))
                
                # Replace {{key}} (without spaces)
                placeholder_no_spaces = f"{{{{{key}}}}}"
                rendered_content = rendered_content.replace(placeholder_no_spaces, str(value))
            
            logger.info(f"✅ Rendered template: {template_name}")
            return rendered_content
            
        except Exception as e:
            logger.error(f"❌ Error rendering template {template_name}: {e}")
            return self._get_fallback_template(template_name, data)
    
    def _get_fallback_template(self, template_name: str, data: Dict[str, Any]) -> str:
        """Generate a fallback template if the main template fails"""
        try:
            if template_name == 'customer_confirmation':
                return self._get_customer_fallback(data)
            elif template_name == 'vendor_notification':
                return self._get_vendor_fallback(data)
            elif template_name == 'support_notification':
                return self._get_support_fallback(data)
            else:
                return f"<h1>Email Template Error</h1><p>Template {template_name} not found.</p>"
        except Exception as e:
            logger.error(f"❌ Fallback template error: {e}")
            return f"<h1>Email Error</h1><p>Unable to render email template.</p>"
    
    def _get_customer_fallback(self, data: Dict[str, Any]) -> str:
        """Fallback customer confirmation template"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5340FF 0%, #4230dd 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h1>🎉 Your Move is Confirmed!</h1>
                <p>Thank you for choosing MovedIn</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb; color: #155724; margin: 20px 0;">
                <h2>✅ Booking Confirmed - Reference #{data.get('lead_id', 'N/A')}</h2>
                <p>Your $1.00 CAD deposit has been received and your move is now scheduled!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #5340FF;">
                <h2>📅 Your Move Details</h2>
                <p><strong>From:</strong> {data.get('move_from', 'N/A')}</p>
                <p><strong>To:</strong> {data.get('move_to', 'N/A')}</p>
                <p><strong>Date:</strong> {data.get('move_date', 'N/A')}</p>
                <p><strong>Time:</strong> {data.get('move_time', 'N/A')}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #5340FF;">
                <h2>🚚 Your Moving Company</h2>
                <p><strong>Company:</strong> {data.get('vendor_name', 'N/A')}</p>
                <p><strong>Estimated Total:</strong> ${data.get('total_cost', 'N/A')}</p>
                <p><strong>Deposit Paid:</strong> $1.00 CAD ✅</p>
                <p><strong>Balance Due on Move Day:</strong> ${data.get('balance_due', 'N/A')}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666;">
                <strong>Questions?</strong> Contact us at support@movedin.com<br>
                <strong>Booking Reference:</strong> #{data.get('lead_id', 'N/A')} | <strong>Status:</strong> Confirmed ✅
            </div>
        </body>
        </html>
        """
    
    def _get_vendor_fallback(self, data: Dict[str, Any]) -> str:
        """Fallback vendor notification template"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h1>📋 NEW VENDOR ORDER</h1>
                <p>Lead #{data.get('lead_id', 'N/A')} - Action Required</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 10px 0;">
                <h2>⚡ URGENT: Contact Customer Within 24 Hours</h2>
                <p><strong>Deposit paid:</strong> $1.00 CAD ✅ | <strong>Status:</strong> Ready for vendor contact</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #ff6b35;">
                <h2>👤 Customer Contact Details</h2>
                <p><strong>Name:</strong> {data.get('customer_name', 'N/A')}</p>
                <p><strong>Email:</strong> {data.get('customer_email', 'N/A')}</p>
                <p><strong>Phone:</strong> {data.get('customer_phone', 'N/A')}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #ff6b35;">
                <h2>🏠 Move Details</h2>
                <p><strong>Pickup Address:</strong> {data.get('move_from', 'N/A')}</p>
                <p><strong>Delivery Address:</strong> {data.get('move_to', 'N/A')}</p>
                <p><strong>Move Date:</strong> {data.get('move_date', 'N/A')}</p>
                <p><strong>Preferred Time:</strong> {data.get('move_time', 'N/A')}</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 6px; border: 1px solid #c3e6cb;">
                <h2>📞 Required Actions</h2>
                <ol>
                    <li><strong>CALL CUSTOMER:</strong> Contact {data.get('customer_name', 'customer')} at {data.get('customer_phone', 'phone')} within 24 hours</li>
                    <li><strong>CONFIRM DETAILS:</strong> Verify move date, time, addresses, and special requirements</li>
                    <li><strong>SCHEDULE CREW:</strong> Assign movers and truck for {data.get('move_date', 'date')}</li>
                    <li><strong>FINAL PAYMENT:</strong> Collect ${data.get('balance_due', 'N/A')} on move completion</li>
                </ol>
            </div>
        </body>
        </html>
        """
    
    def _get_support_fallback(self, data: Dict[str, Any]) -> str:
        """Fallback support notification template"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h1>📊 SYSTEM ALERT</h1>
                <p>MovedIn 3.0 - Lead #{data.get('lead_id', 'N/A')}</p>
            </div>
            
            <div style="background: #d4edda; padding: 15px; border-radius: 6px;">
                <h2>✅ System Health Status</h2>
                <p>
                    <strong>Lead Created:</strong> Successfully ✅<br>
                    <strong>Payment Status:</strong> {data.get('payment_status', 'N/A')} ✅<br>
                    <strong>Email Notifications:</strong> Sent ✅<br>
                    <strong>Database:</strong> Updated ✅
                </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea;">
                <h2>📈 Lead Summary</h2>
                <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace;">
                    Lead ID: {data.get('lead_id', 'N/A')}<br>
                    Customer: {data.get('customer_name', 'N/A')}<br>
                    Email: {data.get('customer_email', 'N/A')}<br>
                    Phone: {data.get('customer_phone', 'N/A')}<br>
                    Vendor: {data.get('vendor_name', 'N/A')}<br>
                    Total: ${data.get('total_cost', 'N/A')}<br>
                    Deposit: $1.00<br>
                    Status: {data.get('payment_status', 'N/A')}
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea;">
                <h2>💰 Revenue Tracking</h2>
                <div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 5px 0; font-family: monospace;">
                    Deposit Collected: $1.00 CAD<br>
                    Total Contract Value: ${data.get('total_cost', 'N/A')}<br>
                    Pending Collection: ${data.get('balance_due', 'N/A')}<br>
                    Payment Intent ID: {data.get('payment_intent_id', 'N/A')}
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #666;">
                <strong>System:</strong> MovedIn 3.0 Smart & Secure<br>
                <strong>Timestamp:</strong> {data.get('created_at', 'N/A')}<br>
                <strong>Environment:</strong> Production
            </div>
        </body>
        </html>
        """
    
    def get_available_templates(self) -> list:
        """Get list of available template names"""
        return list(self.templates.keys())
    
    def is_template_available(self, template_name: str) -> bool:
        """Check if a template is available"""
        return template_name in self.templates
