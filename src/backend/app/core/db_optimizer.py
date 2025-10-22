"""
Database Optimization Script
Adds indexes and optimizations for SQLite
"""

import logging
from sqlalchemy import text
from app.core.database import engine

logger = logging.getLogger(__name__)


def create_indexes():
    """Create database indexes for faster queries"""
    
    indexes = [
        # Index on customer_email for faster lead lookups
        "CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(customer_email);",
        
        # Index on created_at for sorting and time-based queries
        "CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);",
        
        # Index on payment_status for filtering by status
        "CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(payment_status);",
        
        # Index on vendor_name for vendor-specific queries
        "CREATE INDEX IF NOT EXISTS idx_leads_vendor ON leads(vendor_name);",
        
        # Composite index for common query patterns
        "CREATE INDEX IF NOT EXISTS idx_leads_status_created ON leads(payment_status, created_at DESC);",
    ]
    
    try:
        with engine.connect() as conn:
            for index_sql in indexes:
                conn.execute(text(index_sql))
                conn.commit()
        
        logger.info(f"✅ Created {len(indexes)} database indexes")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating indexes: {e}")
        return False


def optimize_sqlite():
    """Optimize SQLite database settings"""
    
    optimizations = [
        # Enable Write-Ahead Logging for better concurrency
        "PRAGMA journal_mode = WAL;",
        
        # Increase cache size (10MB)
        "PRAGMA cache_size = -10000;",
        
        # Enable foreign keys
        "PRAGMA foreign_keys = ON;",
        
        # Optimize for faster reads
        "PRAGMA synchronous = NORMAL;",
        
        # Use memory for temp storage
        "PRAGMA temp_store = MEMORY;",
    ]
    
    try:
        with engine.connect() as conn:
            for pragma in optimizations:
                conn.execute(text(pragma))
        
        logger.info(f"✅ Applied {len(optimizations)} SQLite optimizations")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error optimizing SQLite: {e}")
        return False


def analyze_database():
    """Run ANALYZE to update query planner statistics"""
    
    try:
        with engine.connect() as conn:
            conn.execute(text("ANALYZE;"))
            conn.commit()
        
        logger.info("✅ Database analyzed (query planner updated)")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error analyzing database: {e}")
        return False


def optimize_database():
    """Run all database optimizations"""
    
    logger.info("🔧 Starting database optimization...")
    
    results = {
        "indexes": create_indexes(),
        "optimizations": optimize_sqlite(),
        "analyze": analyze_database()
    }
    
    if all(results.values()):
        logger.info("✅ Database optimization complete!")
        return True
    else:
        logger.warning(f"⚠️ Some optimizations failed: {results}")
        return False


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    optimize_database()

