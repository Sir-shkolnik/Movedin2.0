#!/usr/bin/env python3
"""
Comprehensive test runner for MovedIn 2.0 Backend
Runs all tests with coverage reporting and proper test discovery
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(command)}")
    print('='*60)
    
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running {description}:")
        print(f"Return code: {e.returncode}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return False

def main():
    """Main test runner function"""
    print("🚀 MovedIn 2.0 Backend Test Suite")
    print("=" * 60)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Test results tracking
    test_results = []
    
    # 1. Run linting
    print("\n📋 Running code linting...")
    lint_success = run_command(
        ["python", "-m", "flake8", "app", "--max-line-length=120", "--ignore=E501,W503"],
        "Code linting with flake8"
    )
    test_results.append(("Linting", lint_success))
    
    # 2. Run type checking
    print("\n🔍 Running type checking...")
    type_check_success = run_command(
        ["python", "-m", "mypy", "app", "--ignore-missing-imports"],
        "Type checking with mypy"
    )
    test_results.append(("Type Checking", type_check_success))
    
    # 3. Run unit tests with coverage
    print("\n🧪 Running unit tests with coverage...")
    unit_tests_success = run_command([
        "python", "-m", "pytest", 
        "tests/", 
        "-v", 
        "--cov=app", 
        "--cov-report=term-missing", 
        "--cov-report=html:htmlcov",
        "--cov-report=xml:coverage.xml",
        "--tb=short"
    ], "Unit tests with coverage")
    test_results.append(("Unit Tests", unit_tests_success))
    
    # 4. Run specific test categories
    test_categories = [
        ("Vendor Engine Tests", "tests/test_vendor_engine.py"),
        ("API Route Tests", "tests/test_api_routes.py"),
        ("Mapbox Service Tests", "tests/test_mapbox_service.py"),
        ("Schema Tests", "tests/test_schemas.py"),
        ("Dispatcher Cache Tests", "tests/test_dispatcher_cache_service.py"),
        ("Google Sheets Tests", "tests/test_google_sheets_service.py")
    ]
    
    for category, test_file in test_categories:
        if os.path.exists(test_file):
            print(f"\n🎯 Running {category}...")
            category_success = run_command([
                "python", "-m", "pytest", test_file, "-v", "--tb=short"
            ], f"{category}")
            test_results.append((category, category_success))
    
    # 5. Run integration tests
    print("\n🔗 Running integration tests...")
    integration_success = run_command([
        "python", "-m", "pytest", 
        "tests/test_api_routes.py::TestQuotesAPI::test_generate_quotes_success",
        "tests/test_api_routes.py::TestLeadsAPI::test_create_lead_success",
        "-v", "--tb=short"
    ], "Integration tests")
    test_results.append(("Integration Tests", integration_success))
    
    # 6. Run performance tests (if available)
    print("\n⚡ Running performance tests...")
    perf_success = run_command([
        "python", "-m", "pytest", 
        "tests/", 
        "-k", "performance or slow", 
        "-v", 
        "--tb=short"
    ], "Performance tests")
    test_results.append(("Performance Tests", perf_success))
    
    # 7. Generate test report
    print("\n📊 Test Results Summary")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, success in test_results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"\n📈 Summary: {passed} passed, {failed} failed")
    
    if failed > 0:
        print("\n⚠️  Some tests failed. Please review the output above.")
        sys.exit(1)
    else:
        print("\n🎉 All tests passed successfully!")
        
        # Show coverage summary
        if os.path.exists("htmlcov/index.html"):
            print("\n📊 Coverage report generated at: htmlcov/index.html")
        
        print("\n✨ Test suite completed successfully!")

if __name__ == "__main__":
    main() 