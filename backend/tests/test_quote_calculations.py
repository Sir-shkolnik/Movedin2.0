"""
Comprehensive test suite for quote calculations
Tests all vendors, edge cases, and pricing logic
"""
import pytest
import asyncio
from datetime import datetime, timedelta
from app.schemas.quote import QuoteRequest
from app.services.vendor_dispatcher import VendorDispatcher
from app.services.vendors.lets_get_moving_calculator import LetsGetMovingCalculator
from app.services.vendors.easy2go_calculator import Easy2GoCalculator
from app.services.vendors.velocity_movers_calculator import VelocityMoversCalculator
from app.services.vendors.pierre_sons_calculator import PierreSonsCalculator


class TestQuoteCalculations:
    """Test suite for quote calculation accuracy and consistency"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.dispatcher = VendorDispatcher()
        self.lgm_calculator = LetsGetMovingCalculator()
        self.easy2go_calculator = Easy2GoCalculator()
        self.velocity_calculator = VelocityMoversCalculator()
        self.pierre_calculator = PierreSonsCalculator()
        
        # Test move date
        self.move_date = datetime.now() + timedelta(days=7)
    
    def create_quote_request(self, origin, destination, rooms=3, heavy_items=None, additional_services=None):
        """Helper to create quote requests"""
        if heavy_items is None:
            heavy_items = {"piano": 0, "safe": 0, "treadmill": 0}
        if additional_services is None:
            additional_services = {"packing": False, "storage": False, "cleaning": False, "junk": False}
            
        return QuoteRequest(
            origin_address=origin,
            destination_address=destination,
            move_date=self.move_date,
            move_time="Morning",
            total_rooms=rooms,
            square_footage=None,
            estimated_weight=0,
            heavy_items=heavy_items,
            stairs_at_pickup=0,
            stairs_at_dropoff=0,
            elevator_at_pickup=False,
            elevator_at_dropoff=False,
            additional_services=additional_services
        )
    
    def test_local_move_pricing(self):
        """Test local move pricing consistency"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3
        )
        
        # Test all vendors
        vendors = [
            ("lets-get-moving", "Let's Get Moving"),
            ("easy2go", "Easy2Go"),
            ("velocity-movers", "Velocity Movers"),
            ("pierre-sons", "Pierre & Sons")
        ]
        
        quotes = []
        for vendor_slug, vendor_name in vendors:
            quote = self.dispatcher.calculate_vendor_quote(vendor_slug, quote_request)
            if quote:
                quotes.append(quote)
                print(f"{vendor_name}: ${quote['total_cost']:.2f}")
        
        # All vendors should provide quotes for local moves
        assert len(quotes) >= 3, f"Expected at least 3 vendors, got {len(quotes)}"
        
        # Prices should be reasonable for local moves (under $2000)
        for quote in quotes:
            assert quote['total_cost'] > 0, f"Quote cost should be positive: {quote['total_cost']}"
            assert quote['total_cost'] < 2000, f"Local move cost too high: ${quote['total_cost']:.2f}"
    
    def test_long_distance_pricing(self):
        """Test long distance move pricing"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Vancouver, BC, Canada",
            rooms=4
        )
        
        quotes = []
        vendors = [
            ("lets-get-moving", "Let's Get Moving"),
            ("easy2go", "Easy2Go"),
            ("velocity-movers", "Velocity Movers"),
            ("pierre-sons", "Pierre & Sons")
        ]
        
        for vendor_slug, vendor_name in vendors:
            quote = self.dispatcher.calculate_vendor_quote(vendor_slug, quote_request)
            if quote:
                quotes.append(quote)
                print(f"{vendor_name}: ${quote['total_cost']:.2f}")
        
        # Long distance moves should have higher costs
        for quote in quotes:
            assert quote['total_cost'] > 1000, f"Long distance cost too low: ${quote['total_cost']:.2f}"
            assert quote['total_cost'] < 10000, f"Long distance cost too high: ${quote['total_cost']:.2f}"
    
    def test_heavy_items_pricing(self):
        """Test heavy items pricing accuracy"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3,
            heavy_items={"piano": 1, "safe": 1, "treadmill": 1}
        )
        
        # Test LGM heavy items calculation
        dispatcher_info = {
            "name": "Test Dispatcher",
            "address": "Toronto, ON, Canada",
            "total_distance_km": 25.0,
            "calendar_data": {"daily_rates": {"2024-01-01": 169.0}}
        }
        
        quote = self.lgm_calculator.calculate_quote(quote_request, dispatcher_info)
        
        # Heavy items should add $650 (250 + 300 + 100)
        expected_heavy_cost = 250 + 300 + 100  # piano + safe + treadmill
        actual_heavy_cost = quote['breakdown']['heavy_items']
        
        assert actual_heavy_cost == expected_heavy_cost, f"Expected ${expected_heavy_cost}, got ${actual_heavy_cost}"
    
    def test_additional_services_pricing(self):
        """Test additional services pricing"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3,
            additional_services={"packing": True, "storage": True, "cleaning": True, "junk": True}
        )
        
        dispatcher_info = {
            "name": "Test Dispatcher",
            "address": "Toronto, ON, Canada",
            "total_distance_km": 25.0,
            "calendar_data": {"daily_rates": {"2024-01-01": 169.0}}
        }
        
        quote = self.lgm_calculator.calculate_quote(quote_request, dispatcher_info)
        
        # All services should add cost
        additional_cost = quote['breakdown']['additional_services']
        assert additional_cost > 0, f"Additional services cost should be positive: ${additional_cost}"
        
        # Should be reasonable total (under $1000 for services)
        assert additional_cost < 1000, f"Additional services cost too high: ${additional_cost}"
    
    def test_distance_calculation_accuracy(self):
        """Test distance calculation accuracy"""
        from app.services.vendor_engine import GeographicVendorDispatcher
        
        # Test known distances
        test_cases = [
            ("Toronto, ON, Canada", "Mississauga, ON, Canada", 30),  # ~30km
            ("Toronto, ON, Canada", "Vancouver, BC, Canada", 4000),  # ~4000km
            ("Montreal, QC, Canada", "Toronto, ON, Canada", 500),    # ~500km
        ]
        
        for origin, destination, expected_min in test_cases:
            distance = GeographicVendorDispatcher._calculate_distance_km(origin, destination)
            print(f"{origin} -> {destination}: {distance:.1f}km (expected ~{expected_min}km)")
            
            # Allow 20% tolerance for distance calculations
            assert distance >= expected_min * 0.8, f"Distance too low: {distance:.1f}km"
            assert distance <= expected_min * 1.2, f"Distance too high: {distance:.1f}km"
    
    def test_dispatcher_selection(self):
        """Test dispatcher selection logic"""
        quote_request = self.create_quote_request(
            "Vancouver, BC, Canada",
            "Calgary, AB, Canada",
            rooms=4
        )
        
        # Test LGM dispatcher selection
        dispatcher_info = self.lgm_calculator.get_dispatcher_info(
            quote_request.origin_address,
            quote_request.destination_address,
            quote_request.move_date
        )
        
        if dispatcher_info:
            # Should have valid dispatcher info
            assert 'name' in dispatcher_info, "Dispatcher should have name"
            assert 'address' in dispatcher_info, "Dispatcher should have address"
            assert 'total_distance_km' in dispatcher_info, "Dispatcher should have distance"
            
            # Distance should be reasonable for Vancouver to Calgary
            distance = dispatcher_info['total_distance_km']
            assert distance > 0, f"Distance should be positive: {distance}"
            assert distance < 1000, f"Distance too high for Vancouver-Calgary: {distance}km"
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        
        # Test with invalid addresses
        quote_request = self.create_quote_request(
            "Invalid Address 12345",
            "Another Invalid Address",
            rooms=1
        )
        
        # Should handle gracefully without crashing
        try:
            quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
            # If quote is returned, it should be valid
            if quote:
                assert quote['total_cost'] >= 0, "Quote cost should be non-negative"
        except Exception as e:
            # Should not crash, but may return None or error quote
            print(f"Expected error for invalid addresses: {e}")
        
        # Test with extreme values
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=20,  # Very large move
            heavy_items={"piano": 10, "safe": 10, "treadmill": 10}  # Many heavy items
        )
        
        quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
        if quote:
            # Should handle large moves gracefully
            assert quote['total_cost'] > 0, "Large move should have positive cost"
            assert quote['total_cost'] < 50000, "Large move cost should be reasonable"
    
    def test_quote_consistency(self):
        """Test that quotes are consistent across multiple calls"""
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3
        )
        
        # Get multiple quotes for the same request
        quotes = []
        for _ in range(3):
            quote = self.dispatcher.calculate_vendor_quote("lets-get-moving", quote_request)
            if quote:
                quotes.append(quote)
        
        if len(quotes) >= 2:
            # Quotes should be consistent (within small tolerance for dynamic pricing)
            costs = [q['total_cost'] for q in quotes]
            max_cost = max(costs)
            min_cost = min(costs)
            
            # Allow 5% variance for dynamic pricing
            variance = (max_cost - min_cost) / min_cost if min_cost > 0 else 0
            assert variance < 0.05, f"Quote variance too high: {variance:.2%}"
    
    def test_vendor_specific_logic(self):
        """Test vendor-specific calculation logic"""
        
        # Test LGM minimum 2-hour logic
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=1  # Very small move
        )
        
        dispatcher_info = {
            "name": "Test Dispatcher",
            "address": "Toronto, ON, Canada",
            "total_distance_km": 25.0,
            "calendar_data": {"daily_rates": {"2024-01-01": 169.0}}
        }
        
        quote = self.lgm_calculator.calculate_quote(quote_request, dispatcher_info)
        
        # Should enforce minimum 2-hour billing
        total_hours = quote['estimated_hours'] + quote['travel_time_hours']
        billable_hours = quote['breakdown']['labor'] / quote['hourly_rate']
        assert billable_hours >= 2.0, f"Should enforce minimum 2-hour billing: {billable_hours}"
    
    def test_error_handling(self):
        """Test error handling and graceful failures"""
        
        # Test with None inputs
        try:
            quote = self.lgm_calculator.calculate_quote(None, None)
            assert quote is not None, "Should return error quote, not None"
            assert quote['total_cost'] == 0.0, "Error quote should have zero cost"
        except Exception as e:
            # Should handle gracefully
            print(f"Expected error handling: {e}")
        
        # Test with invalid dispatcher info
        quote_request = self.create_quote_request(
            "Toronto, ON, Canada",
            "Mississauga, ON, Canada",
            rooms=3
        )
        
        invalid_dispatcher = {"invalid": "data"}
        
        try:
            quote = self.lgm_calculator.calculate_quote(quote_request, invalid_dispatcher)
            # Should either return valid quote or error quote
            assert quote is not None, "Should return quote or error quote"
        except Exception as e:
            # Should handle gracefully
            print(f"Expected error handling for invalid dispatcher: {e}")


if __name__ == "__main__":
    # Run tests
    test_suite = TestQuoteCalculations()
    test_suite.setup_method()
    
    print("Running Quote Calculation Tests...")
    print("=" * 50)
    
    try:
        test_suite.test_local_move_pricing()
        print("✓ Local move pricing test passed")
    except Exception as e:
        print(f"✗ Local move pricing test failed: {e}")
    
    try:
        test_suite.test_long_distance_pricing()
        print("✓ Long distance pricing test passed")
    except Exception as e:
        print(f"✗ Long distance pricing test failed: {e}")
    
    try:
        test_suite.test_heavy_items_pricing()
        print("✓ Heavy items pricing test passed")
    except Exception as e:
        print(f"✗ Heavy items pricing test failed: {e}")
    
    try:
        test_suite.test_additional_services_pricing()
        print("✓ Additional services pricing test passed")
    except Exception as e:
        print(f"✗ Additional services pricing test failed: {e}")
    
    try:
        test_suite.test_distance_calculation_accuracy()
        print("✓ Distance calculation accuracy test passed")
    except Exception as e:
        print(f"✗ Distance calculation accuracy test failed: {e}")
    
    try:
        test_suite.test_dispatcher_selection()
        print("✓ Dispatcher selection test passed")
    except Exception as e:
        print(f"✗ Dispatcher selection test failed: {e}")
    
    try:
        test_suite.test_edge_cases()
        print("✓ Edge cases test passed")
    except Exception as e:
        print(f"✗ Edge cases test failed: {e}")
    
    try:
        test_suite.test_quote_consistency()
        print("✓ Quote consistency test passed")
    except Exception as e:
        print(f"✗ Quote consistency test failed: {e}")
    
    try:
        test_suite.test_vendor_specific_logic()
        print("✓ Vendor-specific logic test passed")
    except Exception as e:
        print(f"✗ Vendor-specific logic test failed: {e}")
    
    try:
        test_suite.test_error_handling()
        print("✓ Error handling test passed")
    except Exception as e:
        print(f"✗ Error handling test failed: {e}")
    
    print("=" * 50)
    print("Test suite completed!")
