"""
Professional Email Templates for MovedIn 2.0
Three distinct email types: Customer, Vendor, Admin
Professional design, not web page style
"""

from typing import Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ProfessionalEmailTemplates:
    """Professional email templates with distinct designs for each recipient type"""
    
    def __init__(self):
        self.support_email = "support@movedin.com"
        self.company_name = "MovedIn"
        self.company_website = "https://movedin.com"
    
    def _get_base_styles(self) -> str:
        """Base CSS styles for professional emails"""
        return """
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #2c3e50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-bottom: 3px solid #3498db;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .header p {
                margin: 5px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .section {
                margin-bottom: 25px;
                padding: 20px;
                background-color: #f8f9fa;
                border-left: 4px solid #3498db;
                border-radius: 4px;
            }
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            .section-title .icon {
                margin-right: 10px;
                font-size: 20px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .info-row:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                color: #6c757d;
                min-width: 120px;
            }
            .info-value {
                color: #333333;
                flex: 1;
                text-align: right;
            }
            .highlight-box {
                background-color: #e8f4fd;
                border: 1px solid #bee5eb;
                border-radius: 4px;
                padding: 15px;
                margin: 15px 0;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
            }
            .status-completed {
                background-color: #d4edda;
                color: #155724;
            }
            .status-pending {
                background-color: #fff3cd;
                color: #856404;
            }
            .action-button {
                display: inline-block;
                background-color: #3498db;
                color: #ffffff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 600;
                margin: 10px 5px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
                font-size: 12px;
                border-top: 1px solid #e9ecef;
            }
            .urgent-notice {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
                padding: 15px;
                border-radius: 4px;
                margin: 15px 0;
            }
            .route-map {
                width: 100%;
                height: 200px;
                background-color: #f8f9fa;
                border: 2px dashed #dee2e6;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6c757d;
                font-style: italic;
                margin: 15px 0;
            }
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                }
                .content {
                    padding: 20px;
                }
                .info-row {
                    flex-direction: column;
                }
                .info-value {
                    text-align: left;
                    margin-top: 5px;
                }
            }
        </style>
        """
    
    def customer_confirmation_email(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> str:
        """Professional customer confirmation email"""
        try:
            contact = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            customer_name = f"{contact.get('firstName', '')} {contact.get('lastName', '')}".strip()
            origin = quote_data.get('originAddress', 'Unknown')
            destination = quote_data.get('destinationAddress', 'Unknown')
            move_date = quote_data.get('moveDate', 'TBD')
            move_time = quote_data.get('moveTime', 'TBD')
            vendor_name = selected_quote.get('vendor_name', 'N/A')
            total_cost = selected_quote.get('total_cost', 0)
            
            payment_status = "Completed" if payment_intent_id else "Pending"
            status_class = "status-completed" if payment_intent_id else "status-pending"
            
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation #{lead_id} - {self.company_name}</title>
                {self._get_base_styles()}
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>🚛 {self.company_name}</h1>
                        <p>Your Trusted Moving Partner</p>
                    </div>
                    
                    <div class="content">
                        <div class="section">
                            <div class="section-title">
                                <span class="icon">✅</span>
                                Booking Confirmation #{lead_id}
                            </div>
                            <p>Dear {customer_name},</p>
                            <p>Thank you for choosing {self.company_name}! Your moving quote has been confirmed and we're excited to help you move.</p>
                            
                            <div class="highlight-box">
                                <strong>📋 Important:</strong> This is an <strong>ESTIMATE</strong> based on the information provided. 
                                Final pricing may vary based on actual items moved. The moving company will contact you within 24 hours to confirm details.
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">👤</span>
                                Your Information
                            </div>
                            <div class="info-row">
                                <span class="info-label">Name:</span>
                                <span class="info-value">{customer_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">{contact.get('email', 'N/A')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">{contact.get('phone', 'N/A')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Booking ID:</span>
                                <span class="info-value">#{lead_id}</span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📍</span>
                                Move Details
                            </div>
                            <div class="info-row">
                                <span class="info-label">From:</span>
                                <span class="info-value">{origin}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">To:</span>
                                <span class="info-value">{destination}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Date:</span>
                                <span class="info-value">{move_date}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Time:</span>
                                <span class="info-value">{move_time}</span>
                            </div>
                            
                            <div class="route-map">
                                📍 Route Map: {origin} → {destination}
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">💰</span>
                                Your Quote Summary
                            </div>
                            <div class="info-row">
                                <span class="info-label">Moving Company:</span>
                                <span class="info-value">{vendor_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Estimated Total:</span>
                                <span class="info-value">${total_cost:,.2f}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Payment Status:</span>
                                <span class="info-value">
                                    <span class="status-badge {status_class}">{payment_status}</span>
                                </span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📞</span>
                                What Happens Next?
                            </div>
                            <p><strong>Your moving company will contact you within 24 hours to:</strong></p>
                            <ul>
                                <li>Confirm the exact move date and time</li>
                                <li>Discuss any special requirements</li>
                                <li>Provide move day instructions</li>
                                <li>Answer any questions you may have</li>
                            </ul>
                            
                            <div style="text-align: center; margin-top: 20px;">
                                <a href="mailto:{self.support_email}" class="action-button">📧 Contact Support</a>
                                <a href="{self.company_website}" class="action-button">🌐 Visit {self.company_name}</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>© 2025 {self.company_name} | Professional Moving Services</p>
                        <p>Need help? Contact us at {self.support_email}</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            return html_content
            
        except Exception as e:
            logger.error(f"Error creating customer confirmation email: {e}")
            return self._get_fallback_template("Customer Confirmation", lead_id)
    
    def vendor_order_email(self, lead_data: Dict[str, Any], lead_id: int, vendor_name: str, payment_intent_id: str = None) -> str:
        """Professional vendor order email with upsell opportunities"""
        try:
            contact = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            customer_name = f"{contact.get('firstName', '')} {contact.get('lastName', '')}".strip()
            origin = quote_data.get('originAddress', 'Unknown')
            destination = quote_data.get('destinationAddress', 'Unknown')
            move_date = quote_data.get('moveDate', 'TBD')
            move_time = quote_data.get('moveTime', 'TBD')
            total_cost = selected_quote.get('total_cost', 0)
            crew_size = selected_quote.get('crew_size', 'N/A')
            estimated_hours = selected_quote.get('estimated_hours', 'N/A')
            
            payment_status = "COMPLETED" if payment_intent_id else "PENDING"
            status_class = "status-completed" if payment_intent_id else "status-pending"
            
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Move Order #{lead_id} - {vendor_name}</title>
                {self._get_base_styles()}
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>📋 MOVE ORDER #{lead_id}</h1>
                        <p>From {self.company_name} Platform</p>
                    </div>
                    
                    <div class="content">
                        <div class="urgent-notice">
                            <strong>⚡ IMMEDIATE ACTION REQUIRED</strong><br>
                            Please contact the customer within 24 hours to confirm booking details and discuss requirements.
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">👤</span>
                                Customer Information
                            </div>
                            <div class="info-row">
                                <span class="info-label">Name:</span>
                                <span class="info-value">{customer_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">{contact.get('email', 'N/A')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">{contact.get('phone', 'N/A')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Order ID:</span>
                                <span class="info-value">#{lead_id}</span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📍</span>
                                Move Details
                            </div>
                            <div class="info-row">
                                <span class="info-label">From:</span>
                                <span class="info-value">{origin}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">To:</span>
                                <span class="info-value">{destination}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Date:</span>
                                <span class="info-value">{move_date}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Time:</span>
                                <span class="info-value">{move_time}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Rooms:</span>
                                <span class="info-value">{quote_data.get('totalRooms', 'N/A')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Square Footage:</span>
                                <span class="info-value">{quote_data.get('squareFootage', 'N/A')} sq ft</span>
                            </div>
                            
                            <div class="route-map">
                                🗺️ Route: {origin} → {destination}
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">💰</span>
                                Order Summary
                            </div>
                            <div class="info-row">
                                <span class="info-label">Vendor:</span>
                                <span class="info-value">{vendor_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Total Value:</span>
                                <span class="info-value">${total_cost:,.2f}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Crew Size:</span>
                                <span class="info-value">{crew_size} people</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Est. Hours:</span>
                                <span class="info-value">{estimated_hours} hours</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Payment Status:</span>
                                <span class="info-value">
                                    <span class="status-badge {status_class}">{payment_status}</span>
                                </span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📋</span>
                                Required Actions
                            </div>
                            <ol>
                                <li><strong>Call customer within 24 hours</strong> to confirm details</li>
                                <li><strong>Verify move date and time</strong> availability</li>
                                <li><strong>Discuss special requirements:</strong>
                                    <ul>
                                        <li>Storage needs</li>
                                        <li>Special items (piano, safe, etc.)</li>
                                        <li>Cleaning services</li>
                                        <li>Packing assistance</li>
                                        <li>Junk removal</li>
                                    </ul>
                                </li>
                                <li><strong>Provide move day instructions</strong></li>
                                <li><strong>Confirm final pricing</strong> based on actual requirements</li>
                            </ol>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">💡</span>
                                Upsell Opportunities
                            </div>
                            <div class="highlight-box">
                                <strong>Additional Services to Offer:</strong>
                                <ul>
                                    <li>📦 <strong>Packing Services</strong> - Professional packing for fragile items</li>
                                    <li>🧹 <strong>Cleaning Services</strong> - Post-move cleaning</li>
                                    <li>📦 <strong>Storage Solutions</strong> - Short or long-term storage</li>
                                    <li>🗑️ <strong>Junk Removal</strong> - Dispose of unwanted items</li>
                                    <li>🔧 <strong>Assembly Services</strong> - Furniture assembly at destination</li>
                                </ul>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 20px;">
                            <a href="tel:{contact.get('phone', '')}" class="action-button">📞 Call Customer</a>
                            <a href="mailto:{contact.get('email', '')}" class="action-button">📧 Email Customer</a>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>© 2025 {self.company_name} | Professional Moving Services</p>
                        <p>Order generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            return html_content
            
        except Exception as e:
            logger.error(f"Error creating vendor order email: {e}")
            return self._get_fallback_template("Vendor Order", lead_id)
    
    def admin_health_email(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> str:
        """Professional admin health status email"""
        try:
            contact = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            customer_name = f"{contact.get('firstName', '')} {contact.get('lastName', '')}".strip()
            origin = quote_data.get('originAddress', 'Unknown')
            destination = quote_data.get('destinationAddress', 'Unknown')
            vendor_name = selected_quote.get('vendor_name', 'N/A')
            total_cost = selected_quote.get('total_cost', 0)
            
            payment_status = "COMPLETED" if payment_intent_id else "PENDING"
            status_class = "status-completed" if payment_intent_id else "status-pending"
            
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lead Health Status #{lead_id} - {self.company_name} Admin</title>
                {self._get_base_styles()}
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>📊 LEAD HEALTH STATUS #{lead_id}</h1>
                        <p>{self.company_name} System Administration</p>
                    </div>
                    
                    <div class="content">
                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📈</span>
                                System Status
                            </div>
                            <div class="info-row">
                                <span class="info-label">Lead ID:</span>
                                <span class="info-value">#{lead_id}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Status:</span>
                                <span class="info-value">
                                    <span class="status-badge {status_class}">{payment_status}</span>
                                </span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Generated:</span>
                                <span class="info-value">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Platform:</span>
                                <span class="info-value">MovedIn 2.0 - OPERATIONAL</span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">👤</span>
                                Customer Data
                            </div>
                            <div class="info-row">
                                <span class="info-label">Name:</span>
                                <span class="info-value">{customer_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">{contact.get('email', 'N/A')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span class="info-value">{contact.get('phone', 'N/A')}</span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📍</span>
                                Move Information
                            </div>
                            <div class="info-row">
                                <span class="info-label">From:</span>
                                <span class="info-value">{origin}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">To:</span>
                                <span class="info-value">{destination}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Date:</span>
                                <span class="info-value">{quote_data.get('moveDate', 'TBD')}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Time:</span>
                                <span class="info-value">{quote_data.get('moveTime', 'TBD')}</span>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">💰</span>
                                Financial Summary
                            </div>
                            <div class="info-row">
                                <span class="info-label">Vendor:</span>
                                <span class="info-value">{vendor_name}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Lead Value:</span>
                                <span class="info-value">${total_cost:,.2f}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Payment Status:</span>
                                <span class="info-value">{payment_status}</span>
                            </div>
                            {f'<div class="info-row"><span class="info-label">Payment ID:</span><span class="info-value">{payment_intent_id}</span></div>' if payment_intent_id else ''}
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">✅</span>
                                System Actions Completed
                            </div>
                            <ul>
                                <li>✅ Lead created and saved to database</li>
                                <li>✅ Customer confirmation email sent</li>
                                <li>✅ Vendor order email sent</li>
                                <li>✅ Admin notification email sent</li>
                                <li>✅ Payment processing {'completed' if payment_intent_id else 'pending'}</li>
                                <li>✅ All system logs recorded</li>
                            </ul>
                        </div>

                        <div class="section">
                            <div class="section-title">
                                <span class="icon">📊</span>
                                Platform Metrics
                            </div>
                            <div class="info-row">
                                <span class="info-label">Lead Source:</span>
                                <span class="info-value">Website Quote Form</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Processing Time:</span>
                                <span class="info-value">< 2 seconds</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">System Health:</span>
                                <span class="info-value">
                                    <span class="status-badge status-completed">OPERATIONAL</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>© 2025 {self.company_name} | System Administration</p>
                        <p>Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')} | Lead #{lead_id}</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            return html_content
            
        except Exception as e:
            logger.error(f"Error creating admin health email: {e}")
            return self._get_fallback_template("Admin Health", lead_id)
    
    def _get_fallback_template(self, email_type: str, lead_id: int) -> str:
        """Fallback template if main templates fail"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>{email_type} - Lead #{lead_id}</title></head>
        <body>
            <h1>🚛 {self.company_name} - {email_type}</h1>
            <p>Lead ID: {lead_id}</p>
            <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p>This is a fallback email template.</p>
        </body>
        </html>
        """

# Create global instance
professional_email_templates = ProfessionalEmailTemplates()
