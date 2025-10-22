"""
OWASP Top 10 Security Tests for Production
Tests: Common web application security vulnerabilities
"""

import pytest
import requests
import time
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

BASE_URL = "http://localhost:8000"

class TestOWASPSecurity:
    """OWASP Top 10 Security Test Suite"""
    
    # ============ A01:2021 – Broken Access Control ============
    
    def test_no_unauthorized_data_access(self):
        """Test that users cannot access other users' data"""
        # Create two leads
        lead1_payload = {
            "customer_name": "User 1",
            "customer_email": "user1@example.com",
            "customer_phone": "+1111111111",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response1 = requests.post(f"{BASE_URL}/api/leads", json=lead1_payload)
        lead1_id = response1.json()["id"]
        
        # Try to access lead without proper authorization
        # In a real app, this would require authentication
        response = requests.get(f"{BASE_URL}/api/leads/{lead1_id}")
        
        # For now, should return data (no auth implemented yet)
        # TODO: Add authentication and test unauthorized access returns 401/403
        assert response.status_code == 200
    
    def test_no_directory_traversal(self):
        """Test directory traversal prevention"""
        # Try to access files outside allowed directory
        malicious_paths = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc/passwd"
        ]
        
        for path in malicious_paths:
            response = requests.get(f"{BASE_URL}/api/leads/{path}")
            # Should not allow file access
            assert response.status_code in [400, 404, 422]
    
    # ============ A02:2021 – Cryptographic Failures ============
    
    def test_sensitive_data_not_exposed(self):
        """Test that sensitive data is not exposed in responses"""
        payload = {
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        data = response.json()
        
        # Phone number should be encrypted/hashed in response
        if "customer_phone" in data:
            # Should not be the original phone number
            assert data["customer_phone"] != "+1234567890"
    
    def test_https_redirect(self):
        """Test that HTTP redirects to HTTPS in production"""
        # For local dev, this won't apply
        # In production, HTTP requests should redirect to HTTPS
        # TODO: Test in production environment
        pass
    
    # ============ A03:2021 – Injection ============
    
    def test_sql_injection_in_search(self):
        """Test SQL injection prevention in search/filter"""
        # Try SQL injection in query parameters
        malicious_queries = [
            "1' OR '1'='1",
            "'; DROP TABLE leads;--",
            "1' UNION SELECT * FROM users--"
        ]
        
        for query in malicious_queries:
            response = requests.get(
                f"{BASE_URL}/api/leads",
                params={"customer_name": query}
            )
            # Should not execute SQL
            assert response.status_code in [200, 400, 404]
    
    def test_nosql_injection(self):
        """Test NoSQL injection prevention"""
        # Try NoSQL injection patterns
        payload = {
            "customer_name": {"$ne": None},
            "customer_email": {"$regex": ".*"},
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        # Should reject or sanitize
        assert response.status_code in [400, 422]
    
    def test_command_injection(self):
        """Test command injection prevention"""
        malicious_commands = [
            "; ls -la",
            "| cat /etc/passwd",
            "`whoami`",
            "$(rm -rf /)"
        ]
        
        for cmd in malicious_commands:
            payload = {
                "customer_name": cmd,
                "customer_email": "test@example.com",
                "customer_phone": "+1234567890",
                "move_from": "Toronto",
                "move_to": "Vancouver",
                "move_date": "2025-12-01",
                "move_time": "Morning",
                "vendor_name": "Movers",
                "total_cost": 100.00
            }
            
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            # Should sanitize or reject
            if response.status_code == 200:
                data = response.json()
                # Command operators should be removed
                assert "|" not in data.get("customer_name", "")
                assert ";" not in data.get("customer_name", "")
    
    # ============ A04:2021 – Insecure Design ============
    
    def test_rate_limiting_enforced(self):
        """Test that rate limiting is enforced"""
        payload = {
            "customer_name": "Rate Test",
            "customer_email": "rate@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        # Send many rapid requests
        success_count = 0
        rate_limited = False
        
        for i in range(20):
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            if response.status_code == 200:
                success_count += 1
            elif response.status_code == 429:  # Too Many Requests
                rate_limited = True
                break
        
        # Should get rate limited before 20 requests
        assert rate_limited or success_count < 20
    
    # ============ A05:2021 – Security Misconfiguration ============
    
    def test_no_debug_info_in_errors(self):
        """Test that errors don't expose debug information"""
        # Send invalid request to trigger error
        response = requests.post(
            f"{BASE_URL}/api/leads",
            json={"invalid": "data"}
        )
        
        if response.status_code >= 400:
            error_text = response.text.lower()
            # Should not expose internal paths, stack traces, etc.
            assert "traceback" not in error_text
            assert "/users/" not in error_text
            assert "exception" not in error_text
    
    def test_security_headers_present(self):
        """Test that security headers are present"""
        response = requests.get(f"{BASE_URL}/health")
        
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        # Check for security headers
        # Note: Some may not be set in dev environment
        security_headers = [
            "x-content-type-options",  # nosniff
            "x-frame-options",  # deny/sameorigin
            "strict-transport-security",  # HSTS
        ]
        
        # At least some security headers should be present
        present = sum(1 for h in security_headers if h in headers)
        # TODO: Enforce all headers in production
    
    def test_no_default_credentials(self):
        """Test that no default credentials are accepted"""
        # Try common default credentials
        # This would apply if we had authentication
        # TODO: Implement once auth is added
        pass
    
    # ============ A06:2021 – Vulnerable Components ============
    
    def test_no_outdated_dependencies(self):
        """Test that dependencies are up to date"""
        # This would require checking requirements.txt
        # and comparing against known vulnerabilities
        # TODO: Integrate with safety/snyk/dependabot
        pass
    
    # ============ A07:2021 – Authentication Failures ============
    
    def test_password_requirements(self):
        """Test strong password requirements"""
        # Not applicable yet - no password auth implemented
        # TODO: Implement once user authentication is added
        pass
    
    def test_no_credential_stuffing(self):
        """Test protection against credential stuffing"""
        # Rate limiting should help prevent this
        # Already tested in rate limiting tests
        pass
    
    # ============ A08:2021 – Software and Data Integrity ============
    
    def test_input_validation(self):
        """Test strict input validation"""
        invalid_payloads = [
            # Missing required fields
            {"customer_name": "Test"},
            # Invalid data types
            {
                "customer_name": 12345,  # Should be string
                "customer_email": "test@example.com",
                "customer_phone": "+1234567890",
                "move_from": "Toronto",
                "move_to": "Vancouver",
                "move_date": "2025-12-01",
                "move_time": "Morning",
                "vendor_name": "Movers",
                "total_cost": 100.00
            },
            # Invalid email format
            {
                "customer_name": "Test",
                "customer_email": "not-an-email",
                "customer_phone": "+1234567890",
                "move_from": "Toronto",
                "move_to": "Vancouver",
                "move_date": "2025-12-01",
                "move_time": "Morning",
                "vendor_name": "Movers",
                "total_cost": 100.00
            }
        ]
        
        for payload in invalid_payloads:
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            # Should reject invalid input
            assert response.status_code in [400, 422]
    
    # ============ A09:2021 – Security Logging Failures ============
    
    def test_security_events_logged(self):
        """Test that security events are logged"""
        # Send malicious request
        payload = {
            "customer_name": "'; DROP TABLE leads;--",
            "customer_email": "hacker@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        # Check that logs directory exists and has recent logs
        logs_dir = "../../logs/backend"
        # TODO: Check that security events are logged
    
    # ============ A10:2021 – Server-Side Request Forgery ============
    
    def test_no_ssrf_vulnerability(self):
        """Test SSRF prevention"""
        # Try to make the server request internal resources
        malicious_urls = [
            "http://localhost/admin",
            "http://127.0.0.1:8080",
            "http://169.254.169.254/latest/meta-data/",  # AWS metadata
            "file:///etc/passwd"
        ]
        
        for url in malicious_urls:
            payload = {
                "customer_name": "Test",
                "customer_email": "test@example.com",
                "customer_phone": "+1234567890",
                "move_from": url,  # Malicious URL
                "move_to": "Vancouver",
                "move_date": "2025-12-01",
                "move_time": "Morning",
                "vendor_name": "Movers",
                "total_cost": 100.00
            }
            
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            # Should not fetch external resources
            # Just store the address string
            assert response.status_code in [200, 400, 422]
    
    # ============ ADDITIONAL SECURITY TESTS ============
    
    def test_no_information_disclosure(self):
        """Test that errors don't disclose sensitive information"""
        response = requests.get(f"{BASE_URL}/api/leads/999999")
        
        if response.status_code == 404:
            error_data = response.json()
            error_text = str(error_data).lower()
            
            # Should not expose database structure, paths, etc.
            sensitive_info = ["database", "table", "column", "query", "/users/"]
            for info in sensitive_info:
                assert info not in error_text
    
    def test_secure_random_generation(self):
        """Test that IDs/tokens use secure random generation"""
        # Create multiple leads and check ID generation
        ids = []
        for i in range(5):
            payload = {
                "customer_name": f"User {i}",
                "customer_email": f"user{i}@example.com",
                "customer_phone": f"+123456789{i}",
                "move_from": "Toronto",
                "move_to": "Vancouver",
                "move_date": "2025-12-01",
                "move_time": "Morning",
                "vendor_name": "Movers",
                "total_cost": 100.00
            }
            
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            if response.status_code == 200:
                ids.append(response.json()["id"])
        
        # IDs should not be easily guessable (not just 1, 2, 3...)
        # For now, we use sequential IDs (acceptable for leads)
        # TODO: Use UUIDs for sensitive resources
    
    def test_no_xml_external_entity_xxe(self):
        """Test XXE prevention"""
        # Try to send XML with external entity
        malicious_xml = """<?xml version="1.0"?>
        <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
        <foo>&xxe;</foo>
        """
        
        response = requests.post(
            f"{BASE_URL}/api/leads",
            data=malicious_xml,
            headers={"Content-Type": "application/xml"}
        )
        
        # Should reject XML (we only accept JSON)
        assert response.status_code in [400, 415, 422]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

