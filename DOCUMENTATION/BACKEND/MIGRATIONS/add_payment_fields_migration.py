#!/usr/bin/env python3
"""
Database Migration: Add Payment Fields to Leads Table
Adds payment_amount, payment_currency, and payment_status fields
"""

import os
import sys
from sqlalchemy import text

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, SessionLocal

def run_migration():
    """Run the database migration"""
    print("🔧 Starting database migration: Add Payment Fields")
    
    try:
        with engine.connect() as connection:
            # Check if columns already exist
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'leads' 
                AND column_name IN ('payment_amount', 'payment_currency', 'payment_status')
            """))
            
            existing_columns = [row[0] for row in result]
            
            if 'payment_amount' not in existing_columns:
                print("➕ Adding payment_amount column...")
                connection.execute(text("ALTER TABLE leads ADD COLUMN payment_amount FLOAT"))
                connection.commit()
                print("✅ payment_amount column added")
            else:
                print("✅ payment_amount column already exists")
            
            if 'payment_currency' not in existing_columns:
                print("➕ Adding payment_currency column...")
                connection.execute(text("ALTER TABLE leads ADD COLUMN payment_currency VARCHAR(10) DEFAULT 'CAD'"))
                connection.commit()
                print("✅ payment_currency column added")
            else:
                print("✅ payment_currency column already exists")
            
            if 'payment_status' not in existing_columns:
                print("➕ Adding payment_status column...")
                connection.execute(text("ALTER TABLE leads ADD COLUMN payment_status VARCHAR(50)"))
                connection.commit()
                print("✅ payment_status column added")
            else:
                print("✅ payment_status column already exists")
            
            # Update existing completed payments with default values
            print("🔄 Updating existing completed payments...")
            connection.execute(text("""
                UPDATE leads 
                SET payment_amount = 1.00, 
                    payment_currency = 'CAD', 
                    payment_status = 'succeeded'
                WHERE status = 'payment_completed' 
                AND payment_amount IS NULL
            """))
            connection.commit()
            
            # Count updated records
            result = connection.execute(text("""
                SELECT COUNT(*) 
                FROM leads 
                WHERE status = 'payment_completed' 
                AND payment_amount IS NOT NULL
            """))
            
            updated_count = result.fetchone()[0]
            print(f"✅ Updated {updated_count} completed payments with payment details")
            
        print("🎉 Database migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = run_migration()
    if success:
        print("🚀 Migration ready for deployment")
    else:
        print("💥 Migration failed - check logs")
        sys.exit(1)
