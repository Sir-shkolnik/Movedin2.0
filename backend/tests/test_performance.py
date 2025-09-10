"""
Performance tests for quote calculation system
Tests response times, memory usage, and concurrent requests
"""
import time
import asyncio
import concurrent.futures
from datetime import datetime, timedelta
from app.schemas.quote import QuoteRequest
from app.services.vendor_dispatcher import VendorDispatcher


class TestPerformance:
    """Performance test suite for quote calculations"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.dispatcher = VendorDispatcher()
        self.move_date = datetime.now() + timedelta(days=7)
    
    def create_quote_request(self, origin, destination, rooms=3):
        """Helper to create quote requests"""
        return QuoteRequest(
            origin_address=origin,
            destination_address=destination,
            move_date=self.move_date,
            move_time="Morning",
            total_rooms=rooms,
            square_footage=None,
            estimated_weight=0,
            heavy_items={"piano": 0, "safe": 0, "treadmill": 0},
            stairs_at_pickup=0,
            stairs_at_dropoff=0,
            elevator_at_pickup=False,
            elevator_at_dropoff=False,
            additional_services={"packing": False, "storage": False, "cleaning": False, "junk": False}
        )
    
    def test_single_quote_performance(self):
        """Test single quote calculation performance"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3
        )
        
        # Measure time for single quote
        start_time = time.time()
        quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
        end_time = time.time()
        
        response_time = end_time - start_time
        
        print(f"Single quote response time: {response_time:.3f} seconds")
        
        # Should complete within reasonable time (under 5 seconds)
        assert response_time < 5.0, f"Single quote too slow: {response_time:.3f}s"
        assert quote is not None, "Quote should be returned"
    
    def test_all_vendors_performance(self):
        """Test performance when calculating quotes for all vendors"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3
        )
        
        vendors = [
            "lets-get-moving",
            "easy2go", 
            "velocity-movers",
            "pierre-sons"
        ]
        
        start_time = time.time()
        quotes = []
        
        for vendor in vendors:
            quote = self.dispatcher.calculate_vendor_quote(vendor, quote_request)
            if quote:
                quotes.append(quote)
        
        end_time = time.time()
        total_time = end_time - start_time
        
        print(f"All vendors response time: {total_time:.3f} seconds")
        print(f"Quotes returned: {len(quotes)}/{len(vendors)}")
        
        # Should complete within reasonable time (under 15 seconds for all vendors)
        assert total_time < 15.0, f"All vendors too slow: {total_time:.3f}s"
        assert len(quotes) >= 2, f"Should get at least 2 quotes, got {len(quotes)}"
    
    def test_concurrent_requests(self):
        """Test performance with concurrent requests"""
        quote_requests = [
            self.create_quote_request("Toronto, ON, Canada", "Mississauga, ON, Canada", rooms=2),
            self.create_quote_request("Vancouver, BC, Canada", "Calgary, AB, Canada", rooms=4),
            self.create_quote_request("Montreal, QC, Canada", "Ottawa, ON, Canada", rooms=3),
            self.create_quote_request("Halifax, NS, Canada", "Toronto, ON, Canada", rooms=5),
        ]
        
        def calculate_quote(quote_request):
            """Calculate quote for a single request"""
            start_time = time.time()
            quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
            end_time = time.time()
            return {
                'quote': quote,
                'response_time': end_time - start_time,
                'origin': quote_request.origin_address,
                'destination': quote_request.destination_address
            }
        
        # Run concurrent requests
        start_time = time.time()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(calculate_quote, req) for req in quote_requests]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        end_time = time.time()
        total_time = end_time - start_time
        
        print(f"Concurrent requests total time: {total_time:.3f} seconds")
        
        for result in results:
            print(f"{result['origin']} -> {result['destination']}: {result['response_time']:.3f}s")
        
        # Should complete within reasonable time
        assert total_time < 20.0, f"Concurrent requests too slow: {total_time:.3f}s"
        
        # All requests should complete
        assert len(results) == len(quote_requests), f"Expected {len(quote_requests)} results, got {len(results)}"
    
    def test_memory_usage(self):
        """Test memory usage during quote calculations"""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Generate many quotes
        quotes = []
        for i in range(10):
            quote_request = self.create_quote_request(
                f"City {i}, ON, Canada",
                f"Destination {i}, ON, Canada",
                rooms=3
            )
            
            quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
            if quote:
                quotes.append(quote)
        
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        
        print(f"Memory usage increase: {memory_increase:.2f} MB")
        print(f"Quotes generated: {len(quotes)}")
        
        # Memory increase should be reasonable (under 100MB for 10 quotes)
        assert memory_increase < 100.0, f"Memory usage too high: {memory_increase:.2f} MB"
    
    def test_large_move_performance(self):
        """Test performance with large/complex moves"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Vancouver, BC, Canada",
            rooms=10  # Large move
        )
        
        # Add heavy items
        quote_request.heavy_items = {"piano": 2, "safe": 3, "treadmill": 5}
        quote_request.additional_services = {"packing": True, "storage": True, "cleaning": True, "junk": True}
        
        start_time = time.time()
        quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
        end_time = time.time()
        
        response_time = end_time - start_time
        
        print(f"Large move response time: {response_time:.3f} seconds")
        print(f"Large move cost: ${quote['total_cost']:.2f}" if quote else "No quote returned")
        
        # Should complete within reasonable time even for large moves
        assert response_time < 10.0, f"Large move too slow: {response_time:.3f}s"
        if quote:
            assert quote['total_cost'] > 0, "Large move should have positive cost"
    
    def test_error_recovery_performance(self):
        """Test performance when handling errors"""
        # Test with invalid addresses (should fail gracefully)
        invalid_quote_request = self.create_quote_request(
            "Invalid Address 12345",
            "Another Invalid Address",
            rooms=3
        )
        
        start_time = time.time()
        
        # Try multiple invalid requests
        for _ in range(5):
            try:
                quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", invalid_quote_request)
            except Exception as e:
                # Expected to handle errors gracefully
                pass
        
        end_time = time.time()
        error_handling_time = end_time - start_time
        
        print(f"Error handling time: {error_handling_time:.3f} seconds")
        
        # Should handle errors quickly (under 5 seconds for 5 requests)
        assert error_handling_time < 5.0, f"Error handling too slow: {error_handling_time:.3f}s"


if __name__ == "__main__":
    # Run performance tests
    test_suite = TestPerformance()
    test_suite.setup_method()
    
    print("Running Performance Tests...")
    print("=" * 50)
    
    try:
        test_suite.test_single_quote_performance()
        print("✓ Single quote performance test passed")
    except Exception as e:
        print(f"✗ Single quote performance test failed: {e}")
    
    try:
        test_suite.test_all_vendors_performance()
        print("✓ All vendors performance test passed")
    except Exception as e:
        print(f"✗ All vendors performance test failed: {e}")
    
    try:
        test_suite.test_concurrent_requests()
        print("✓ Concurrent requests test passed")
    except Exception as e:
        print(f"✗ Concurrent requests test failed: {e}")
    
    try:
        test_suite.test_memory_usage()
        print("✓ Memory usage test passed")
    except Exception as e:
        print(f"✗ Memory usage test failed: {e}")
    
    try:
        test_suite.test_large_move_performance()
        print("✓ Large move performance test passed")
    except Exception as e:
        print(f"✗ Large move performance test failed: {e}")
    
    try:
        test_suite.test_error_recovery_performance()
        print("✓ Error recovery performance test passed")
    except Exception as e:
        print(f"✗ Error recovery performance test failed: {e}")
    
    print("=" * 50)
    print("Performance test suite completed!")
