from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import os

# Create base class for models
Base = declarative_base()

# Lazy database engine creation
def get_engine():
    """Get database engine, creating it if it doesn't exist"""
    if not hasattr(get_engine, '_engine'):
        database_url = os.getenv('DATABASE_URL', settings.DATABASE_URL)
        get_engine._engine = create_engine(
            database_url,
            pool_pre_ping=True,
            pool_recycle=300,
        )
    return get_engine._engine

# Create session factory
def get_session_local():
    """Get session factory"""
    engine = get_engine()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_db():
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database tables
def init_db():
    """Initialize database tables"""
    try:
        engine = get_engine()
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Database initialization warning: {e}")
        # Don't fail the build if database is not available 