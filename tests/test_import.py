"""Test if all imports work"""
import sys
import os
import traceback

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../src/backend'))

try:
    print("Testing imports...")
    print("1. Importing config...")
    from app.core.config import settings
    print(f"✅ Config: {settings.APP_NAME}")
    
    print("2. Importing database...")
    from app.core.database import engine, Base, get_db
    print("✅ Database imports successful")
    
    print("3. Importing models...")
    from app.models.lead import Lead
    print("✅ Lead model imported")
    
    print("4. Importing services...")
    from app.services.smart_email_service import smart_email_service
    from app.services.security_service import security_service
    print("✅ Services imported")
    
    print("5. Importing routes...")
    from app.api.routes import leads
    print("✅ Routes imported")
    
    print("\n✅ All imports successful!")
    
except Exception as e:
    print(f"\n❌ Import failed: {e}")
    traceback.print_exc()
    sys.exit(1)
