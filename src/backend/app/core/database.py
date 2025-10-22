"""
Database configuration for MovedIn 3.0 - Smart & Secure
Simple SQLite database for V3.0
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool, QueuePool
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Create database engine with optimizations
if "sqlite" in settings.DATABASE_URL:
    # SQLite-specific optimizations
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={
            "check_same_thread": False,
            "timeout": 30  # 30 second timeout for busy database
        },
        poolclass=StaticPool,  # StaticPool for SQLite (single connection reuse)
        echo=False  # Set to True for SQL query debugging
    )
else:
    # PostgreSQL/other database optimizations
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=QueuePool,
        pool_size=5,
        max_overflow=10,
        pool_pre_ping=True,  # Check connection health before using
        echo=False
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class
Base = declarative_base()

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database with optimizations"""
    try:
        # Import all models
        from app.models.lead import Lead
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created")
        
        # Apply optimizations
        from app.core.db_optimizer import optimize_database
        optimize_database()
        
        logger.info("✅ Database initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise
