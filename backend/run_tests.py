#!/usr/bin/env python3
"""
Test runner for the MovedIn quote calculation system
Runs all tests and provides comprehensive reporting
"""
import sys
import os
import time
import subprocess
from datetime import datetime

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_test_file(test_file, test_name):
    """Run a single test file and return results"""
    print(f"\n{'='*60}")
    print(f"Running {test_name}")
    print(f"{'='*60}")
    
    start_time = time.time()
    
    try:
        # Run the test file
        result = subprocess.run([sys.executable, test_file], 
                              capture_output=True, 
                              text=True, 
                              timeout=300)  # 5 minute timeout
        
        end_time = time.time()
        duration = end_time - start_time
        
        if result.returncode == 0:
            print(f"✅ {test_name} PASSED ({duration:.2f}s)")
            print("STDOUT:")
            print(result.stdout)
            return True, duration, result.stdout
        else:
            print(f"❌ {test_name} FAILED ({duration:.2f}s)")
            print("STDOUT:")
            print(result.stdout)
            print("STDERR:")
            print(result.stderr)
            return False, duration, result.stderr
            
    except subprocess.TimeoutExpired:
        print(f"⏰ {test_name} TIMED OUT (300s)")
        return False, 300, "Test timed out"
    except Exception as e:
        print(f"💥 {test_name} ERROR: {e}")
        return False, 0, str(e)

def run_api_tests():
    """Run API integration tests"""
    print(f"\n{'='*60}")
    print("Running API Integration Tests")
    print(f"{'='*60}")
    
    import requests
    import json
    
    # Test API endpoints
    base_url = "https://movedin-backend.onrender.com/api"
    
    test_cases = [
        {
            "name": "Local Move Test",
            "data": {
                "origin_address": "Toronto, ON, Canada",
                "destination_address": "Mississauga, ON, Canada",
                "move_date": "2025-02-15",
                "move_time": "Morning",
                "total_rooms": 3,
                "square_footage": None,
                "estimated_weight": 0,
                "heavy_items": {"piano": 0, "safe": 0, "treadmill": 0},
                "stairs_at_pickup": 0,
                "stairs_at_dropoff": 0,
                "elevator_at_pickup": False,
                "elevator_at_dropoff": False,
                "additional_services": {"packing": False, "storage": False, "cleaning": False, "junk": False}
            }
        },
        {
            "name": "Long Distance Move Test",
            "data": {
                "origin_address": "Toronto, ON, Canada",
                "destination_address": "Vancouver, BC, Canada",
                "move_date": "2025-02-15",
                "move_time": "Morning",
                "total_rooms": 4,
                "square_footage": None,
                "estimated_weight": 0,
                "heavy_items": {"piano": 1, "safe": 0, "treadmill": 1},
                "stairs_at_pickup": 0,
                "stairs_at_dropoff": 0,
                "elevator_at_pickup": False,
                "elevator_at_dropoff": False,
                "additional_services": {"packing": True, "storage": False, "cleaning": False, "junk": False}
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        
        try:
            start_time = time.time()
            
            response = requests.post(
                f"{base_url}/generate",
                json=test_case['data'],
                timeout=30
            )
            
            end_time = time.time()
            duration = end_time - start_time
            
            if response.status_code == 200:
                data = response.json()
                quotes = data.get('quotes', [])
                
                print(f"✅ {test_case['name']} PASSED ({duration:.2f}s)")
                print(f"   Quotes returned: {len(quotes)}")
                
                for quote in quotes:
                    vendor = quote.get('vendor_name', 'Unknown')
                    cost = quote.get('total_cost', 0)
                    print(f"   {vendor}: ${cost:.2f}")
                
                results.append(True)
            else:
                print(f"❌ {test_case['name']} FAILED ({duration:.2f}s)")
                print(f"   Status: {response.status_code}")
                print(f"   Response: {response.text}")
                results.append(False)
                
        except Exception as e:
            print(f"💥 {test_case['name']} ERROR: {e}")
            results.append(False)
    
    return all(results)

def main():
    """Main test runner"""
    print("🧪 MovedIn Quote Calculation Test Suite")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test files to run
    test_files = [
        ("tests/test_quote_calculations.py", "Quote Calculation Tests"),
        ("tests/test_performance.py", "Performance Tests"),
    ]
    
    # Results tracking
    results = []
    total_duration = 0
    
    # Run unit tests
    for test_file, test_name in test_files:
        if os.path.exists(test_file):
            success, duration, output = run_test_file(test_file, test_name)
            results.append((test_name, success, duration))
            total_duration += duration
        else:
            print(f"⚠️  Test file not found: {test_file}")
            results.append((test_name, False, 0))
    
    # Run API tests
    try:
        api_success = run_api_tests()
        results.append(("API Integration Tests", api_success, 0))
    except Exception as e:
        print(f"💥 API Tests ERROR: {e}")
        results.append(("API Integration Tests", False, 0))
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = 0
    failed = 0
    
    for test_name, success, duration in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        duration_str = f" ({duration:.2f}s)" if duration > 0 else ""
        print(f"{status} {test_name}{duration_str}")
        
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Total Duration: {total_duration:.2f}s")
    
    if failed == 0:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n💥 {failed} test(s) failed!")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
