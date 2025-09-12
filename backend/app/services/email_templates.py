"""
Beautiful HTML Email Templates for MovedIn 2.0
Includes move data, icons, logos, and Mapbox route visualization
"""

from typing import Dict, Any
from datetime import datetime
import requests
import base64
import logging

logger = logging.getLogger(__name__)

class EmailTemplates:
    """Beautiful email templates with move data, icons, and Mapbox integration"""
    
    def __init__(self):
        self.mapbox_token = "pk.eyJ1IjoibW92ZWRpbiIsImEiOiJjbW5hZ2V0Z2V0Z2V0In0.example"  # Replace with real token
        self.base_url = "https://movedin-frontend.onrender.com"
    
    def get_mapbox_route_image(self, origin: str, destination: str, width: int = 600, height: int = 300) -> str:
        """Generate Mapbox route visualization image"""
        try:
            # Encode addresses for URL
            origin_encoded = requests.utils.quote(origin)
            destination_encoded = requests.utils.quote(destination)
            
            # Mapbox Static Images API URL
            mapbox_url = f"https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-home+ff0000({origin_encoded}),pin-s-flag+00ff00({destination_encoded})/{origin_encoded},{destination_encoded},10,0,0/{width}x{height}@2x?access_token={self.mapbox_token}"
            
            # For now, return a placeholder - you'll need to implement actual Mapbox integration
            return f"https://via.placeholder.com/{width}x{height}/4A90E2/FFFFFF?text=Route+Map"
            
        except Exception as e:
            logger.error(f"Error generating Mapbox image: {e}")
            return f"https://via.placeholder.com/{width}x{height}/4A90E2/FFFFFF?text=Route+Map"
    
    def get_base_template(self, title: str, content: str) -> str:
        """Base HTML template with MovedIn branding"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{title}</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f8f9fa;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }}
                .logo {{
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }}
                .tagline {{
                    font-size: 14px;
                    opacity: 0.9;
                }}
                .content {{
                    padding: 30px;
                }}
                .section {{
                    margin-bottom: 25px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                }}
                .section-title {{
                    font-size: 18px;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }}
                .icon {{
                    margin-right: 10px;
                    font-size: 20px;
                }}
                .info-grid {{
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 15px;
                }}
                .info-item {{
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background-color: white;
                    border-radius: 6px;
                    border: 1px solid #e9ecef;
                }}
                .info-label {{
                    font-weight: bold;
                    color: #6c757d;
                    margin-right: 10px;
                    min-width: 80px;
                }}
                .info-value {{
                    color: #333;
                }}
                .route-map {{
                    width: 100%;
                    height: 200px;
                    border-radius: 8px;
                    margin: 15px 0;
                    object-fit: cover;
                }}
                .highlight {{
                    background-color: #e3f2fd;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #2196f3;
                    margin: 15px 0;
                }}
                .button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 10px 5px;
                }}
                .footer {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    color: #6c757d;
                    font-size: 12px;
                }}
                .status-badge {{
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }}
                .status-success {{
                    background-color: #d4edda;
                    color: #155724;
                }}
                .status-pending {{
                    background-color: #fff3cd;
                    color: #856404;
                }}
                .status-completed {{
                    background-color: #d1ecf1;
                    color: #0c5460;
                }}
                @media (max-width: 600px) {{
                    .info-grid {{
                        grid-template-columns: 1fr;
                    }}
                    .container {{
                        margin: 10px;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🚛 MovedIn</div>
                    <div class="tagline">Your Trusted Moving Partner</div>
                </div>
                <div class="content">
                    {content}
                </div>
                <div class="footer">
                    <p>© 2025 MovedIn 2.0 | Professional Moving Services</p>
                    <p>Need help? Contact us at support@movedin.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def vendor_notification_template(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> str:
        """Beautiful vendor notification email template"""
        try:
            # Extract data
            contact = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            # Generate route map
            origin = quote_data.get('originAddress', 'Unknown')
            destination = quote_data.get('destinationAddress', 'Unknown')
            route_image = self.get_mapbox_route_image(origin, destination)
            
            # Calculate move details
            move_date = quote_data.get('moveDate', 'TBD')
            move_time = quote_data.get('moveTime', 'TBD')
            total_rooms = quote_data.get('totalRooms', 0)
            square_footage = quote_data.get('squareFootage', 'Unknown')
            
            # Payment status
            payment_status = "Completed" if payment_intent_id else "Pending"
            status_class = "status-success" if payment_intent_id else "status-pending"
            
            content = f"""
            <div class="section">
                <div class="section-title">
                    <span class="icon">🎉</span>
                    New Moving Lead #{lead_id}
                </div>
                <div class="highlight">
                    <strong>💰 Payment Status:</strong> 
                    <span class="status-badge {status_class}">{payment_status}</span>
                    {f'<br><strong>💳 Payment ID:</strong> {payment_intent_id}' if payment_intent_id else ''}
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">👤</span>
                    Customer Information
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name:</span>
                        <span class="info-value">{contact.get('firstName', 'N/A')} {contact.get('lastName', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{contact.get('email', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">{contact.get('phone', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Lead ID:</span>
                        <span class="info-value">#{lead_id}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">📍</span>
                    Move Details
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">From:</span>
                        <span class="info-value">{origin}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">To:</span>
                        <span class="info-value">{destination}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span class="info-value">{move_date}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Time:</span>
                        <span class="info-value">{move_time}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Rooms:</span>
                        <span class="info-value">{total_rooms}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Size:</span>
                        <span class="info-value">{square_footage} sq ft</span>
                    </div>
                </div>
                
                <img src="{route_image}" alt="Move Route" class="route-map">
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">💰</span>
                    Quote Information
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Vendor:</span>
                        <span class="info-value">{selected_quote.get('vendor_name', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Total Cost:</span>
                        <span class="info-value">${selected_quote.get('total_cost', 0):,.2f}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Crew Size:</span>
                        <span class="info-value">{selected_quote.get('crew_size', 'N/A')} people</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Trucks:</span>
                        <span class="info-value">{selected_quote.get('truck_count', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Est. Hours:</span>
                        <span class="info-value">{selected_quote.get('estimated_hours', 'N/A')} hours</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Travel Time:</span>
                        <span class="info-value">{selected_quote.get('travel_time_hours', 'N/A')} hours</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">⚡</span>
                    Action Required
                </div>
                <div class="highlight">
                    <strong>📞 IMMEDIATE ACTION REQUIRED:</strong><br>
                    Please contact the customer within 24 hours to:<br>
                    • Confirm the booking details<br>
                    • Arrange move date and time<br>
                    • Discuss any special requirements<br>
                    • Provide move day instructions
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="tel:{contact.get('phone', '')}" class="button">📞 Call Customer</a>
                    <a href="mailto:{contact.get('email', '')}" class="button">📧 Email Customer</a>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">ℹ️</span>
                    Additional Information
                </div>
                <p>This lead was generated through the MovedIn 2.0 platform. The customer has completed the quote process and {payment_status.lower()} payment.</p>
                <p><strong>Lead generated:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
            """
            
            return self.get_base_template(f"New Moving Lead #{lead_id} - MovedIn Platform", content)
            
        except Exception as e:
            logger.error(f"Error creating vendor notification template: {e}")
            return self.get_fallback_template(lead_data, lead_id, payment_intent_id)
    
    def support_notification_template(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> str:
        """Beautiful support notification email template"""
        try:
            # Extract data
            contact = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            # Generate route map
            origin = quote_data.get('originAddress', 'Unknown')
            destination = quote_data.get('destinationAddress', 'Unknown')
            route_image = self.get_mapbox_route_image(origin, destination)
            
            # Payment status
            payment_status = "Completed" if payment_intent_id else "Pending"
            status_class = "status-success" if payment_intent_id else "status-pending"
            
            content = f"""
            <div class="section">
                <div class="section-title">
                    <span class="icon">📊</span>
                    Lead Summary #{lead_id}
                </div>
                <div class="highlight">
                    <strong>💰 Payment Status:</strong> 
                    <span class="status-badge {status_class}">{payment_status}</span>
                    {f'<br><strong>💳 Payment ID:</strong> {payment_intent_id}' if payment_intent_id else ''}
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">👤</span>
                    Customer Details
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name:</span>
                        <span class="info-value">{contact.get('firstName', 'N/A')} {contact.get('lastName', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{contact.get('email', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">{contact.get('phone', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Lead ID:</span>
                        <span class="info-value">#{lead_id}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">📍</span>
                    Move Information
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">From:</span>
                        <span class="info-value">{origin}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">To:</span>
                        <span class="info-value">{destination}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span class="info-value">{quote_data.get('moveDate', 'TBD')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Time:</span>
                        <span class="info-value">{quote_data.get('moveTime', 'TBD')}</span>
                    </div>
                </div>
                
                <img src="{route_image}" alt="Move Route" class="route-map">
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">💰</span>
                    Financial Summary
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Vendor:</span>
                        <span class="info-value">{selected_quote.get('vendor_name', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Total Cost:</span>
                        <span class="info-value">${selected_quote.get('total_cost', 0):,.2f}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Payment Status:</span>
                        <span class="info-value">{payment_status}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Lead Value:</span>
                        <span class="info-value">${selected_quote.get('total_cost', 0):,.2f}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">📈</span>
                    Platform Metrics
                </div>
                <p>This lead was successfully generated through the MovedIn 2.0 platform with {payment_status.lower()} payment processing.</p>
                <p><strong>Lead generated:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p><strong>Platform status:</strong> <span class="status-badge status-success">Operational</span></p>
            </div>
            """
            
            return self.get_base_template(f"Lead Notification #{lead_id} - MovedIn Platform", content)
            
        except Exception as e:
            logger.error(f"Error creating support notification template: {e}")
            return self.get_fallback_template(lead_data, lead_id, payment_intent_id)
    
    def customer_confirmation_template(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> str:
        """Beautiful customer confirmation email template with estimate details"""
        try:
            # Extract data
            contact = lead_data.get('contact_data', {})
            quote_data = lead_data.get('quote_data', {})
            selected_quote = lead_data.get('selected_quote', {})
            
            # Generate route map
            origin = quote_data.get('originAddress', 'Unknown')
            destination = quote_data.get('destinationAddress', 'Unknown')
            route_image = self.get_mapbox_route_image(origin, destination)
            
            # Calculate move details
            move_date = quote_data.get('moveDate', 'TBD')
            move_time = quote_data.get('moveTime', 'TBD')
            total_rooms = quote_data.get('totalRooms', 0)
            square_footage = quote_data.get('squareFootage', 'Unknown')
            
            # Payment status
            payment_status = "Completed" if payment_intent_id else "Pending"
            status_class = "status-success" if payment_intent_id else "status-pending"
            
            content = f"""
            <div class="section">
                <div class="section-title">
                    <span class="icon">🎉</span>
                    Booking Confirmation #{lead_id}
                </div>
                <div class="highlight">
                    <strong>✅ Thank you for choosing MovedIn!</strong><br>
                    Your moving quote has been confirmed and we're excited to help you move.
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">👤</span>
                    Your Information
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name:</span>
                        <span class="info-value">{contact.get('firstName', 'N/A')} {contact.get('lastName', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{contact.get('email', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">{contact.get('phone', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Booking ID:</span>
                        <span class="info-value">#{lead_id}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">📍</span>
                    Your Move Details
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">From:</span>
                        <span class="info-value">{origin}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">To:</span>
                        <span class="info-value">{destination}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span class="info-value">{move_date}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Time:</span>
                        <span class="info-value">{move_time}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Rooms:</span>
                        <span class="info-value">{total_rooms}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Size:</span>
                        <span class="info-value">{square_footage} sq ft</span>
                    </div>
                </div>
                
                <img src="{route_image}" alt="Your Move Route" class="route-map">
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">💰</span>
                    Your Quote Summary
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Moving Company:</span>
                        <span class="info-value">{selected_quote.get('vendor_name', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Estimated Total:</span>
                        <span class="info-value">${selected_quote.get('total_cost', 0):,.2f}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Crew Size:</span>
                        <span class="info-value">{selected_quote.get('crew_size', 'N/A')} people</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Trucks:</span>
                        <span class="info-value">{selected_quote.get('truck_count', 'N/A')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Est. Hours:</span>
                        <span class="info-value">{selected_quote.get('estimated_hours', 'N/A')} hours</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Travel Time:</span>
                        <span class="info-value">{selected_quote.get('travel_time_hours', 'N/A')} hours</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">⚠️</span>
                    Important Information
                </div>
                <div class="highlight">
                    <strong>📋 This is an ESTIMATE based on the information provided:</strong><br>
                    • Final pricing may vary based on actual items moved<br>
                    • Additional services may incur extra charges<br>
                    • The moving company will contact you within 24 hours to confirm details<br>
                    • Please have all items ready for packing on move day<br>
                    • Keep this email as your booking confirmation
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">📞</span>
                    What Happens Next?
                </div>
                <div class="highlight">
                    <strong>Your moving company will contact you within 24 hours to:</strong><br>
                    • Confirm the exact move date and time<br>
                    • Discuss any special requirements<br>
                    • Provide move day instructions<br>
                    • Answer any questions you may have
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="mailto:support@movedin.com" class="button">📧 Contact Support</a>
                    <a href="https://movedin.com" class="button">🌐 Visit MovedIn</a>
                </div>
            </div>

            <div class="section">
                <div class="section-title">
                    <span class="icon">ℹ️</span>
                    Booking Details
                </div>
                <p><strong>Booking confirmed:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p><strong>Payment status:</strong> <span class="status-badge {status_class}">{payment_status}</span></p>
                <p><strong>Platform:</strong> MovedIn 2.0 - Canada's Premier Moving Platform</p>
            </div>
            """
            
            return self.get_base_template(f"Booking Confirmation #{lead_id} - MovedIn", content)
            
        except Exception as e:
            logger.error(f"Error creating customer confirmation template: {e}")
            return self.get_fallback_template(lead_data, lead_id, payment_intent_id)
    
    def get_fallback_template(self, lead_data: Dict[str, Any], lead_id: int, payment_intent_id: str = None) -> str:
        """Fallback template if main templates fail"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head><title>MovedIn Lead #{lead_id}</title></head>
        <body>
            <h1>🚛 MovedIn 2.0 - New Lead #{lead_id}</h1>
            <p>Lead ID: {lead_id}</p>
            <p>Payment Status: {'Completed' if payment_intent_id else 'Pending'}</p>
            <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p>This is a fallback email template.</p>
        </body>
        </html>
        """

# Create global instance
email_templates = EmailTemplates()
