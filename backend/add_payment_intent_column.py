#!/usr/bin/env python3
"""
Script to add payment_intent_id column to leads table
Run this script to update the database schema
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError

# Database connection - using Docker container
DATABASE_URL = "postgresql://movedin:movedin@postgres:5432/movedin"

def add_payment_intent_column():
    """Add payment_intent_id column to leads table"""
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Check if column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'leads' 
                AND column_name = 'payment_intent_id'
            """))
            
            if result.fetchone():
                print("✅ payment_intent_id column already exists")
                return
            
            # Add the column
            conn.execute(text("""
                ALTER TABLE leads 
                ADD COLUMN payment_intent_id VARCHAR
            """))
            conn.commit()
            print("✅ Successfully added payment_intent_id column to leads table")
            
    except ProgrammingError as e:
        print(f"❌ Error adding column: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🔧 Adding payment_intent_id column to leads table...")
    add_payment_intent_column()
    print("✅ Database schema update completed!") 