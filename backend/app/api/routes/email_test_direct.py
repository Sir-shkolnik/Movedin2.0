from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class EmailTestRequest(BaseModel):
    password: str

@router.post("/test-direct")
async def test_direct_email(request: EmailTestRequest):
    """Test email directly with provided password"""
    try:
        logger.info("🧪 Starting direct email test with provided credentials")
        
        # SMTP settings
        smtp_server = "smtp.office365.com"
        smtp_port = 587
        smtp_username = "support@movedin.com"
        smtp_password = request.password
        
        logger.info(f"📧 Server: {smtp_server}:{smtp_port}")
        logger.info(f"👤 Username: {smtp_username}")
        logger.info(f"🔑 Password provided: {'Yes' if smtp_password else 'No'}")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = smtp_username
        msg['To'] = smtp_username
        msg['Subject'] = f"MovedIn 2.0 Direct Test - {datetime.now().strftime('%H:%M:%S')}"
        
        # Email body
        body = f"""
        🧪 MovedIn 2.0 Direct Email Test
        
        This is a direct test email using GoDaddy 365 SMTP with provided credentials.
        
        Test Details:
        - Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        - SMTP Server: {smtp_server}
        - Port: {smtp_port}
        - Username: {smtp_username}
        - Test Type: Direct API Test
        
        If you receive this email, the GoDaddy 365 email system is working correctly!
        
        Best regards,
        MovedIn 2.0 Test System
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        logger.info("🌐 Connecting to SMTP server...")
        
        # Send email using Office 365 SMTP
        context = ssl.create_default_context()
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            logger.info("🔐 Starting TLS connection...")
            server.starttls(context=context)
            
            logger.info("🔑 Authenticating...")
            server.login(smtp_username, smtp_password)
            
            logger.info("📤 Sending email...")
            server.send_message(msg)
        
        logger.info("✅ Email sent successfully!")
        
        return {
            "success": True,
            "message": "Direct email test successful with GoDaddy 365",
            "timestamp": datetime.now().isoformat(),
            "smtp_server": smtp_server,
            "smtp_port": smtp_port,
            "username": smtp_username
        }
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"❌ SMTP Authentication failed: {e}")
        raise HTTPException(status_code=400, detail=f"Authentication failed: {e}")
    except smtplib.SMTPRecipientsRefused as e:
        logger.error(f"❌ Recipient refused: {e}")
        raise HTTPException(status_code=400, detail=f"Recipient refused: {e}")
    except smtplib.SMTPServerDisconnected as e:
        logger.error(f"❌ Server disconnected: {e}")
        raise HTTPException(status_code=400, detail=f"Server disconnected: {e}")
    except Exception as e:
        logger.error(f"❌ Email test failed: {e}")
        raise HTTPException(status_code=500, detail=f"Email test failed: {e}")
