"""
Simple test to verify testing framework works
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_basic_functionality():
    """Test basic Python functionality"""
    print("Running basic functionality test...")
    
    # Test basic math
    assert 2 + 2 == 4, "Basic math should work"
    
    # Test string operations
    assert "hello" + " " + "world" == "hello world", "String concatenation should work"
    
    # Test list operations
    test_list = [1, 2, 3, 4, 5]
    assert len(test_list) == 5, "List length should be correct"
    assert sum(test_list) == 15, "List sum should be correct"
    
    print("✅ Basic functionality test passed!")

def test_imports():
    """Test that we can import our modules"""
    print("Testing imports...")
    
    try:
        from app.schemas.quote import QuoteRequest
        print("✅ QuoteRequest import successful")
    except ImportError as e:
        print(f"❌ QuoteRequest import failed: {e}")
        return False
    
    try:
        from app.services.vendor_dispatcher import VendorDispatcher
        print("✅ VendorDispatcher import successful")
    except ImportError as e:
        print(f"❌ VendorDispatcher import failed: {e}")
        return False
    
    print("✅ All imports successful!")
    return True

def test_quote_request_creation():
    """Test creating a QuoteRequest"""
    print("Testing QuoteRequest creation...")
    
    try:
        from app.schemas.quote import QuoteRequest
        from datetime import datetime, timedelta
        
        move_date = datetime.now() + timedelta(days=7)
        
        quote_request = QuoteRequest(
            origin_address="Toronto, ON, Canada",
            destination_address="Mississauga, ON, Canada",
            move_date=move_date,
            move_time="Morning",
            total_rooms=3,
            square_footage=None,
            estimated_weight=0,
            heavy_items={"piano": 0, "safe": 0, "treadmill": 0},
            stairs_at_pickup=0,
            stairs_at_dropoff=0,
            elevator_at_pickup=False,
            elevator_at_dropoff=False,
            additional_services={"packing": False, "storage": False, "cleaning": False, "junk": False}
        )
        
        assert quote_request.origin_address == "Toronto, ON, Canada"
        assert quote_request.destination_address == "Mississauga, ON, Canada"
        assert quote_request.total_rooms == 3
        
        print("✅ QuoteRequest creation successful!")
        return True
        
    except Exception as e:
        print(f"❌ QuoteRequest creation failed: {e}")
        return False

if __name__ == "__main__":
    print("Running Simple Tests...")
    print("=" * 50)
    
    all_passed = True
    
    try:
        test_basic_functionality()
    except Exception as e:
        print(f"❌ Basic functionality test failed: {e}")
        all_passed = False
    
    try:
        if not test_imports():
            all_passed = False
    except Exception as e:
        print(f"❌ Import test failed: {e}")
        all_passed = False
    
    try:
        if not test_quote_request_creation():
            all_passed = False
    except Exception as e:
        print(f"❌ QuoteRequest creation test failed: {e}")
        all_passed = False
    
    print("=" * 50)
    if all_passed:
        print("🎉 All simple tests passed!")
    else:
        print("💥 Some tests failed!")
    
    print("Simple test suite completed!")
