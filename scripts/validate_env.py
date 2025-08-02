#!/usr/bin/env python3
"""
Environment Variable Validation Script for MovedIn 2.0
Validates that all required environment variables are properly configured.
"""

import os
import sys
import requests
from typing import Dict, List, Tuple

# Required environment variables for each service
REQUIRED_VARS = {
    'backend': [
        'DATABASE_URL',
        'REDIS_URL', 
        'DEBUG',
        'ALLOWED_ORIGINS',
        'ZOHO_CLIENT_ID',
        'ZOHO_CLIENT_SECRET',
        'ZOHO_REFRESH_TOKEN',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET'
    ],
    'frontend': [
        'VITE_API_URL',
        'VITE_MAPBOX_ACCESS_TOKEN',
        'VITE_STRIPE_PUBLISHABLE_KEY'
    ]
}

# Optional but recommended variables
OPTIONAL_VARS = {
    'backend': [
        'LOG_LEVEL',
        'ENVIRONMENT',
        'SENTRY_DSN'
    ],
    'frontend': [
        'VITE_APP_VERSION',
        'VITE_ENVIRONMENT'
    ]
}

def check_environment_variables() -> Dict[str, List[str]]:
    """Check which environment variables are set."""
    results = {
        'backend': {'missing': [], 'present': [], 'optional_missing': []},
        'frontend': {'missing': [], 'present': [], 'optional_missing': []}
    }
    
    for service, required_vars in REQUIRED_VARS.items():
        for var in required_vars:
            if os.getenv(var):
                results[service]['present'].append(var)
            else:
                results[service]['missing'].append(var)
    
    for service, optional_vars in OPTIONAL_VARS.items():
        for var in optional_vars:
            if not os.getenv(var):
                results[service]['optional_missing'].append(var)
    
    return results

def validate_urls() -> Dict[str, bool]:
    """Validate that URLs are accessible."""
    urls_to_check = {
        'backend_health': os.getenv('VITE_API_URL', '') + '/health',
        'frontend': os.getenv('VITE_API_URL', '').replace('backend', 'frontend')
    }
    
    results = {}
    for name, url in urls_to_check.items():
        if not url or url == '/health':
            results[name] = False
            continue
            
        try:
            response = requests.get(url, timeout=10)
            results[name] = response.status_code == 200
        except Exception:
            results[name] = False
    
    return results

def check_database_connection() -> bool:
    """Check if database connection string is valid."""
    db_url = os.getenv('DATABASE_URL', '')
    if not db_url:
        return False
    
    # Basic validation - check if it looks like a PostgreSQL URL
    return db_url.startswith('postgresql://') and '@' in db_url

def check_redis_connection() -> bool:
    """Check if Redis connection string is valid."""
    redis_url = os.getenv('REDIS_URL', '')
    if not redis_url:
        return False
    
    # Basic validation - check if it looks like a Redis URL
    return redis_url.startswith('redis://') and '@' in redis_url

def print_results(results: Dict[str, List[str]], url_results: Dict[str, bool]):
    """Print validation results in a formatted way."""
    print("🔍 MovedIn 2.0 Environment Variable Validation")
    print("=" * 60)
    
    # Backend validation
    print("\n📋 BACKEND ENVIRONMENT VARIABLES:")
    print("-" * 40)
    
    if results['backend']['present']:
        print("✅ Present variables:")
        for var in results['backend']['present']:
            value = os.getenv(var, '')
            if 'SECRET' in var or 'KEY' in var:
                print(f"   {var}: {'*' * min(len(value), 8)}...")
            else:
                print(f"   {var}: {value[:50]}{'...' if len(value) > 50 else ''}")
    
    if results['backend']['missing']:
        print("❌ Missing required variables:")
        for var in results['backend']['missing']:
            print(f"   {var}")
    
    if results['backend']['optional_missing']:
        print("⚠️  Missing optional variables:")
        for var in results['backend']['optional_missing']:
            print(f"   {var}")
    
    # Frontend validation
    print("\n📋 FRONTEND ENVIRONMENT VARIABLES:")
    print("-" * 40)
    
    if results['frontend']['present']:
        print("✅ Present variables:")
        for var in results['frontend']['present']:
            value = os.getenv(var, '')
            if 'TOKEN' in var or 'KEY' in var:
                print(f"   {var}: {'*' * min(len(value), 8)}...")
            else:
                print(f"   {var}: {value[:50]}{'...' if len(value) > 50 else ''}")
    
    if results['frontend']['missing']:
        print("❌ Missing required variables:")
        for var in results['frontend']['missing']:
            print(f"   {var}")
    
    if results['frontend']['optional_missing']:
        print("⚠️  Missing optional variables:")
        for var in results['frontend']['optional_missing']:
            print(f"   {var}")
    
    # Connection validation
    print("\n🔗 CONNECTION VALIDATION:")
    print("-" * 40)
    
    print(f"Database URL: {'✅ Valid' if check_database_connection() else '❌ Invalid/Missing'}")
    print(f"Redis URL: {'✅ Valid' if check_redis_connection() else '❌ Invalid/Missing'}")
    
    for name, is_accessible in url_results.items():
        status = "✅ Accessible" if is_accessible else "❌ Not accessible"
        print(f"{name.replace('_', ' ').title()}: {status}")
    
    # Summary
    print("\n📊 SUMMARY:")
    print("-" * 40)
    
    total_required = len(REQUIRED_VARS['backend']) + len(REQUIRED_VARS['frontend'])
    total_present = len(results['backend']['present']) + len(results['frontend']['present'])
    total_missing = len(results['backend']['missing']) + len(results['frontend']['missing'])
    
    print(f"Required variables: {total_present}/{total_required} configured")
    print(f"Missing variables: {total_missing}")
    
    if total_missing == 0:
        print("🎉 All required environment variables are configured!")
        return True
    else:
        print("⚠️  Some required environment variables are missing.")
        return False

def main():
    """Main validation function."""
    print("Starting environment variable validation...\n")
    
    # Check environment variables
    results = check_environment_variables()
    
    # Validate URLs
    url_results = validate_urls()
    
    # Print results
    is_valid = print_results(results, url_results)
    
    # Exit with appropriate code
    sys.exit(0 if is_valid else 1)

if __name__ == "__main__":
    main() 