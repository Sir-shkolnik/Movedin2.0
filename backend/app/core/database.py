from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Try to import config, with fallback
try:
    from app.core.config import settings
    DATABASE_URL = settings.DATABASE_URL
except Exception as e:
    print(f"Config import error: {e}")
    # Fallback to environment variable
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://movedin:movedin@postgres:5432/movedin")

print(f"Using DATABASE_URL: {DATABASE_URL}")

# Create database engine
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
    )
    print("Database engine created successfully")
except Exception as e:
    print(f"Engine creation error: {e}")
    raise

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Initialize database function
def init_db():
    """Initialize the database by creating all tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")
        raise

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 