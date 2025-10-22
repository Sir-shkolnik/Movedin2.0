"""
Unit tests for Security Service
Tests: Data validation, sanitization, rate limiting, encryption
"""

import pytest
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from app.services.security_service import SecurityService

class TestSecurityService:
    """Test suite for SecurityService"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.security = SecurityService()
    
    # ============ DATA VALIDATION TESTS ============
    
    def test_validate_email_valid(self):
        """Test valid email validation"""
        data = {"customer_email": "test@example.com"}
        result = self.security.validate_and_sanitize(data)
        assert result["customer_email"] == "test@example.com"
    
    def test_validate_email_invalid(self):
        """Test invalid email validation"""
        data = {"customer_email": "invalid-email"}
        with pytest.raises(ValueError):
            self.security.validate_and_sanitize(data)
    
    def test_validate_phone_valid(self):
        """Test valid phone validation"""
        data = {"customer_phone": "+1234567890"}
        result = self.security.validate_and_sanitize(data)
        assert result["customer_phone"] == "+1234567890"
    
    def test_validate_phone_invalid(self):
        """Test invalid phone validation"""
        data = {"customer_phone": "12345"}  # Too short
        with pytest.raises(ValueError):
            self.security.validate_and_sanitize(data)
    
    def test_validate_required_fields(self):
        """Test required fields validation"""
        data = {}  # Missing required fields
        with pytest.raises(ValueError):
            self.security.validate_and_sanitize(data)
    
    # ============ SANITIZATION TESTS ============
    
    def test_sanitize_html_injection(self):
        """Test HTML injection prevention"""
        data = {
            "customer_name": "<script>alert('xss')</script>",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890"
        }
        result = self.security.validate_and_sanitize(data)
        assert "<script>" not in result["customer_name"]
        assert "alert" not in result["customer_name"]
    
    def test_sanitize_sql_injection(self):
        """Test SQL injection prevention"""
        data = {
            "customer_name": "'; DROP TABLE users; --",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890"
        }
        result = self.security.validate_and_sanitize(data)
        # Should be sanitized but not contain SQL commands
        assert "DROP TABLE" not in result["customer_name"]
    
    def test_sanitize_whitespace(self):
        """Test whitespace trimming"""
        data = {
            "customer_name": "  John Doe  ",
            "customer_email": "  test@example.com  ",
            "customer_phone": "+1234567890"
        }
        result = self.security.validate_and_sanitize(data)
        assert result["customer_name"] == "John Doe"
        assert result["customer_email"] == "test@example.com"
    
    # ============ RATE LIMITING TESTS ============
    
    @pytest.mark.asyncio
    async def test_rate_limiting_first_request(self):
        """Test first request is not rate limited"""
        is_limited = await self.security.is_rate_limited("new_user@example.com")
        assert is_limited is False
    
    @pytest.mark.asyncio
    async def test_rate_limiting_multiple_requests(self):
        """Test multiple rapid requests trigger rate limit"""
        email = "spam_user@example.com"
        
        # First 5 requests should pass
        for _ in range(5):
            is_limited = await self.security.is_rate_limited(email)
            assert is_limited is False
        
        # 6th request should be rate limited
        is_limited = await self.security.is_rate_limited(email)
        assert is_limited is True
    
    # ============ ENCRYPTION TESTS ============
    
    def test_encrypt_phone_number(self):
        """Test phone number encryption"""
        data = {"customer_phone": "+1234567890"}
        result = self.security.encrypt_sensitive_fields(data)
        
        # Phone should be encrypted (hashed)
        assert result["customer_phone"] != "+1234567890"
        assert len(result["customer_phone"]) > 10  # Hash is longer
    
    def test_encrypt_consistent(self):
        """Test encryption is consistent for same input"""
        data1 = {"customer_phone": "+1234567890"}
        data2 = {"customer_phone": "+1234567890"}
        
        result1 = self.security.encrypt_sensitive_fields(data1)
        result2 = self.security.encrypt_sensitive_fields(data2)
        
        # Same input should produce same hash
        assert result1["customer_phone"] == result2["customer_phone"]
    
    def test_encrypt_different_inputs(self):
        """Test different inputs produce different hashes"""
        data1 = {"customer_phone": "+1234567890"}
        data2 = {"customer_phone": "+9876543210"}
        
        result1 = self.security.encrypt_sensitive_fields(data1)
        result2 = self.security.encrypt_sensitive_fields(data2)
        
        # Different inputs should produce different hashes
        assert result1["customer_phone"] != result2["customer_phone"]
    
    # ============ EDGE CASES ============
    
    def test_empty_data(self):
        """Test handling of empty data"""
        with pytest.raises(ValueError):
            self.security.validate_and_sanitize({})
    
    def test_none_values(self):
        """Test handling of None values"""
        data = {
            "customer_name": None,
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890"
        }
        with pytest.raises(ValueError):
            self.security.validate_and_sanitize(data)
    
    def test_very_long_input(self):
        """Test handling of very long input"""
        data = {
            "customer_name": "A" * 10000,  # Very long name
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890"
        }
        result = self.security.validate_and_sanitize(data)
        # Should be truncated or handled appropriately
        assert len(result["customer_name"]) <= 1000
    
    def test_unicode_characters(self):
        """Test handling of unicode characters"""
        data = {
            "customer_name": "José García 日本語",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890"
        }
        result = self.security.validate_and_sanitize(data)
        assert "José" in result["customer_name"]
    
    # ============ SECURITY VULNERABILITIES ============
    
    def test_xss_prevention(self):
        """Test XSS attack prevention"""
        malicious_inputs = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src='javascript:alert(\"XSS\")'></iframe>"
        ]
        
        for malicious in malicious_inputs:
            data = {
                "customer_name": malicious,
                "customer_email": "test@example.com",
                "customer_phone": "+1234567890"
            }
            result = self.security.validate_and_sanitize(data)
            # Should not contain any script tags
            assert "<script>" not in result["customer_name"].lower()
            assert "javascript:" not in result["customer_name"].lower()
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention"""
        malicious_inputs = [
            "'; DROP TABLE leads; --",
            "1' OR '1'='1",
            "admin'--",
            "' UNION SELECT * FROM users--"
        ]
        
        for malicious in malicious_inputs:
            data = {
                "customer_name": malicious,
                "customer_email": "test@example.com",
                "customer_phone": "+1234567890"
            }
            result = self.security.validate_and_sanitize(data)
            # Should not contain SQL keywords
            sanitized = result["customer_name"].upper()
            assert "DROP" not in sanitized or "TABLE" not in sanitized
    
    def test_command_injection_prevention(self):
        """Test command injection prevention"""
        malicious_inputs = [
            "; ls -la",
            "| cat /etc/passwd",
            "`whoami`",
            "$(rm -rf /)"
        ]
        
        for malicious in malicious_inputs:
            data = {
                "move_from": malicious,
                "customer_email": "test@example.com",
                "customer_phone": "+1234567890"
            }
            result = self.security.validate_and_sanitize(data)
            # Should not contain shell operators
            assert "|" not in result["move_from"]
            assert "`" not in result["move_from"]
            assert "$(" not in result["move_from"]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

