"""
Performance and Load Tests
Tests: Response times, concurrent requests, resource usage
"""

import pytest
import requests
import time
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "http://localhost:8000"

class TestPerformance:
    """Performance test suite"""
    
    # ============ RESPONSE TIME TESTS ============
    
    def test_health_check_response_time(self):
        """Test health check responds quickly"""
        start = time.time()
        response = requests.get(f"{BASE_URL}/health")
        duration = (time.time() - start) * 1000  # Convert to ms
        
        assert response.status_code == 200
        assert duration < 100  # Should respond in under 100ms
    
    def test_lead_creation_response_time(self):
        """Test lead creation responds within acceptable time"""
        payload = {
            "customer_name": "Performance Test",
            "customer_email": "perf@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        start = time.time()
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        duration = (time.time() - start) * 1000
        
        assert response.status_code == 200
        assert duration < 500  # Should respond in under 500ms
    
    def test_lead_retrieval_response_time(self):
        """Test lead retrieval is fast"""
        # First create a lead
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
        
        create_response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        lead_id = create_response.json()["id"]
        
        # Now test retrieval speed
        start = time.time()
        response = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        duration = (time.time() - start) * 1000
        
        assert response.status_code == 200
        assert duration < 200  # Should respond in under 200ms
    
    # ============ LOAD TESTS ============
    
    def test_concurrent_health_checks(self):
        """Test handling concurrent health check requests"""
        num_requests = 50
        
        def make_request():
            start = time.time()
            response = requests.get(f"{BASE_URL}/health")
            duration = (time.time() - start) * 1000
            return response.status_code, duration
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(num_requests)]
            results = [future.result() for future in as_completed(futures)]
        
        # All requests should succeed
        status_codes = [r[0] for r in results]
        durations = [r[1] for r in results]
        
        assert all(code == 200 for code in status_codes)
        assert statistics.mean(durations) < 200  # Average under 200ms
        assert max(durations) < 1000  # Max under 1 second
    
    def test_concurrent_lead_creation(self):
        """Test handling concurrent lead creation"""
        num_requests = 20
        
        def create_lead(i):
            payload = {
                "customer_name": f"Concurrent User {i}",
                "customer_email": f"concurrent{i}@example.com",
                "customer_phone": f"+1234567{i:03d}",
                "move_from": "Toronto",
                "move_to": "Vancouver",
                "move_date": "2025-12-01",
                "move_time": "Morning",
                "vendor_name": "Movers",
                "total_cost": 100.00
            }
            
            start = time.time()
            response = requests.post(f"{BASE_URL}/api/leads", json=payload)
            duration = (time.time() - start) * 1000
            return response.status_code, duration
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(create_lead, i) for i in range(num_requests)]
            results = [future.result() for future in as_completed(futures)]
        
        # Most requests should succeed (some might be rate limited)
        status_codes = [r[0] for r in results]
        success_rate = sum(1 for code in status_codes if code == 200) / len(status_codes)
        
        assert success_rate >= 0.7  # At least 70% success rate
    
    # ============ SUSTAINED LOAD TESTS ============
    
    def test_sustained_load_health_check(self):
        """Test sustained load on health check"""
        duration_seconds = 10
        request_count = 0
        start_time = time.time()
        
        while time.time() - start_time < duration_seconds:
            response = requests.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                request_count += 1
            time.sleep(0.1)  # 10 requests per second
        
        # Should handle sustained load
        requests_per_second = request_count / duration_seconds
        assert requests_per_second >= 8  # At least 8 req/sec
    
    # ============ STRESS TESTS ============
    
    def test_large_payload_handling(self):
        """Test handling of large payloads"""
        # Create a payload with large text fields
        large_text = "A" * 10000
        
        payload = {
            "customer_name": "Test User",
            "customer_email": "test@example.com",
            "customer_phone": "+1234567890",
            "move_from": large_text,  # 10KB address
            "move_to": large_text,
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        start = time.time()
        response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        duration = (time.time() - start) * 1000
        
        # Should handle or reject large payload gracefully
        assert response.status_code in [200, 400, 413, 422]
        assert duration < 2000  # Should respond within 2 seconds
    
    def test_memory_leak_detection(self):
        """Test for memory leaks with repeated requests"""
        # Send many requests and measure response times
        num_requests = 100
        response_times = []
        
        for i in range(num_requests):
            start = time.time()
            response = requests.get(f"{BASE_URL}/health")
            duration = (time.time() - start) * 1000
            
            if response.status_code == 200:
                response_times.append(duration)
        
        # Response times should not increase significantly
        # (indicating memory leak)
        first_10_avg = statistics.mean(response_times[:10])
        last_10_avg = statistics.mean(response_times[-10:])
        
        # Last 10 should not be more than 50% slower than first 10
        assert last_10_avg < first_10_avg * 1.5
    
    # ============ DATABASE PERFORMANCE TESTS ============
    
    def test_database_query_performance(self):
        """Test database query performance"""
        # Create multiple leads first
        for i in range(10):
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
            requests.post(f"{BASE_URL}/api/leads", json=payload)
        
        # Now test list query performance
        start = time.time()
        response = requests.get(f"{BASE_URL}/api/leads")
        duration = (time.time() - start) * 1000
        
        assert response.status_code == 200
        assert duration < 300  # Should respond in under 300ms
    
    # ============ CACHING TESTS ============
    
    def test_repeated_request_performance(self):
        """Test that repeated requests are fast (caching)"""
        # Create a lead
        payload = {
            "customer_name": "Cache Test",
            "customer_email": "cache@example.com",
            "customer_phone": "+1234567890",
            "move_from": "Toronto",
            "move_to": "Vancouver",
            "move_date": "2025-12-01",
            "move_time": "Morning",
            "vendor_name": "Movers",
            "total_cost": 100.00
        }
        
        create_response = requests.post(f"{BASE_URL}/api/leads", json=payload)
        lead_id = create_response.json()["id"]
        
        # First request
        start = time.time()
        response1 = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        first_duration = (time.time() - start) * 1000
        
        # Second request (should be cached or fast)
        start = time.time()
        response2 = requests.get(f"{BASE_URL}/api/leads/{lead_id}")
        second_duration = (time.time() - start) * 1000
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        # Second request should not be significantly slower
        assert second_duration <= first_duration * 1.5
    
    # ============ THROUGHPUT TESTS ============
    
    def test_maximum_throughput(self):
        """Test maximum throughput capacity"""
        duration_seconds = 5
        max_workers = 10
        request_count = 0
        
        def make_request():
            try:
                response = requests.get(f"{BASE_URL}/health", timeout=2)
                return response.status_code == 200
            except:
                return False
        
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            while time.time() - start_time < duration_seconds:
                future = executor.submit(make_request)
                if future.result(timeout=3):
                    request_count += 1
        
        throughput = request_count / duration_seconds
        print(f"\n📊 Throughput: {throughput:.2f} requests/second")
        
        # Should handle at least 10 requests per second
        assert throughput >= 10


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short", "-s"])

