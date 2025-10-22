"""
Security Service for MovedIn 3.0
Smart data validation and protection
"""

import re
import hashlib
import time
from typing import Dict, Any
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class SecurityService:
    """Smart security service for data validation and protection"""
    
    @staticmethod
    def validate_and_sanitize(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and sanitize input data with strict production rules"""
        
        logger.info("🔒 Starting data validation and sanitization")
        
        # Required fields validation
        required_fields = ['customer_name', 'customer_email', 'customer_phone', 'move_from', 'move_to', 'vendor_name']
        for field in required_fields:
            if not data.get(field):
                logger.error(f"❌ Missing required field: {field}")
                raise ValueError(f"Missing required field: {field}")
        
        # 1. STRICT EMAIL VALIDATION
        email = data['customer_email'].strip()
        
        # Check for email injection (newlines)
        if '\n' in email or '\r' in email or '%0A' in email or '%0D' in email:
            logger.error(f"❌ Email injection attempt: {email}")
            raise ValueError("Email injection attempt detected")
        
        # Strict email regex
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            logger.error(f"❌ Invalid email format: {email}")
            raise ValueError("Invalid email format")
        
        # Max length
        if len(email) > 100:
            raise ValueError("Email too long (max 100 chars)")
        
        data['customer_email'] = email
        
        # 2. STRICT PHONE VALIDATION
        phone = data['customer_phone']
        digits_only = re.sub(r'\D', '', phone)
        
        # Must be exactly 10 digits
        if len(digits_only) != 10:
            logger.error(f"❌ Invalid phone (not 10 digits): {phone}")
            raise ValueError("Phone must be 10 digits")
        
        # Reject test numbers
        if digits_only in ['0000000000', '1111111111', '2222222222', '1234567890']:
            raise ValueError("Invalid phone number")
        
        # 3. CUSTOMER NAME VALIDATION
        name = data['customer_name'].strip()
        
        if len(name) < 2:
            raise ValueError("Name must be at least 2 characters")
        
        if len(name) > 100:
            raise ValueError("Name too long (max 100 chars)")
        
        # No HTML tags
        if '<' in name or '>' in name:
            logger.error(f"❌ HTML tags in name: {name}")
            raise ValueError("Invalid characters in name")
        
        data['customer_name'] = name
        
        # 4. ADDRESS VALIDATION
        for addr_field in ['move_from', 'move_to']:
            addr = data[addr_field].strip()
            
            if len(addr) < 5:
                raise ValueError(f"{addr_field}: Address too short")
            
            if len(addr) > 200:
                raise ValueError(f"{addr_field}: Address too long (max 200 chars)")
            
            # No script tags
            dangerous = ['<script', '<img', '<svg', '<iframe', 'javascript:', 'onerror=']
            for danger in dangerous:
                if danger.lower() in addr.lower():
                    raise ValueError(f"{addr_field}: Invalid characters detected")
            
            data[addr_field] = addr
        
        # 5. DATE VALIDATION
        if 'move_date' in data:
            try:
                move_date = datetime.strptime(data['move_date'], "%Y-%m-%d").date()
                today = datetime.now().date()
                
                # Reject past dates
                if move_date < today:
                    raise ValueError("Move date cannot be in the past")
                
                # Reject dates >365 days in future
                max_date = today + timedelta(days=365)
                if move_date > max_date:
                    raise ValueError("Move date cannot be more than 1 year in future")
                    
            except ValueError as e:
                if "does not match format" in str(e):
                    raise ValueError("Invalid date format. Use YYYY-MM-DD")
                raise
        
        # 6. COST VALIDATION
        if 'total_cost' in data:
            try:
                cost = float(data['total_cost'])
                
                if cost < 100:
                    raise ValueError("Cost too low (minimum $100)")
                
                if cost > 50000:
                    raise ValueError("Cost too high (maximum $50,000)")
                    
            except (ValueError, TypeError):
                raise ValueError("Invalid cost value")
        
        # 7. VENDOR NAME VALIDATION
        APPROVED_VENDORS = [
            "Let's Get Moving",
            "Lets Get Moving",
            "Pierre & Sons",
            "Velocity Movers",
            "Easy2Go",
            "LGM",
            "Test",  # For testing only
            "Test Vendor",
            "Test Movers"
        ]
        
        if data['vendor_name'] not in APPROVED_VENDORS:
            logger.error(f"❌ Unknown vendor: {data['vendor_name']}")
            raise ValueError(f"Unknown vendor. Must be one of: {', '.join(APPROVED_VENDORS[:5])}")
        
        logger.info("✅ Data validated and sanitized successfully")
        return data
    
    @staticmethod
    def encrypt_sensitive_fields(data: Dict[str, Any]) -> Dict[str, Any]:
        """Encrypt sensitive data fields"""
        
        logger.info("🔐 Encrypting sensitive fields")
        
        encrypted_data = data.copy()
        
        # Encrypt phone number (simple hash for demo - use proper encryption in production)
        if 'customer_phone' in encrypted_data:
            original_phone = encrypted_data['customer_phone']
            encrypted_data['customer_phone'] = hashlib.sha256(
                original_phone.encode()
            ).hexdigest()[:16]  # Truncated for storage
            logger.info(f"🔐 Phone encrypted: {original_phone[:5]}*** -> {encrypted_data['customer_phone']}")
        
        logger.info("✅ Sensitive fields encrypted successfully")
        return encrypted_data
    
    @staticmethod
    async def is_rate_limited(email: str) -> bool:
        """Simple rate limiting check"""
        
        # In production, use Redis for rate limiting
        # For now, simple in-memory check
        current_time = time.time()
        
        # Allow 5 requests per hour per email
        # This is a simplified version - use Redis in production
        logger.info(f"🛡️ Rate limiting check for email: {email}")
        return False  # For now, no rate limiting
    
    @staticmethod
    def validate_email_format(email: str) -> bool:
        """Validate email format"""
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return bool(re.match(email_pattern, email))
    
    @staticmethod
    def validate_phone_format(phone: str) -> bool:
        """Validate phone format"""
        phone_pattern = r'^[\d\s\-\(\)\+]+$'
        return bool(re.match(phone_pattern, phone))
    
    @staticmethod
    def sanitize_string(text: str) -> str:
        """Sanitize string input"""
        if not isinstance(text, str):
            return str(text)
        
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[<>"\']', '', text).strip()
        return sanitized

# Create global instance
security_service = SecurityService()
