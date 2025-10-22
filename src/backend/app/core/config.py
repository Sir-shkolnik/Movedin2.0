"""
Configuration for MovedIn 3.0 - Smart & Secure
Using real credentials from V2.0
"""

from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///../../assets/data/movedin.db"  # Simple SQLite for V3.0
    
    # Redis (optional for V3.0)
    REDIS_URL: Optional[str] = None
    
    # API Keys (from V2.0)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Mapbox (from V2.0)
    MAPBOX_ACCESS_TOKEN: Optional[str] = None
    
    # Email Configuration (from V2.0 - using working Zoho credentials)
    SMTP_SERVER: str = "smtp.zoho.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = "support@alicesolutionsgroup.com"
    SMTP_PASSWORD: str = "hUqfyc-wabfe0-qergam"
    
    # App Settings
    APP_NAME: str = "MovedIn 3.0 - Smart & Secure"
    DEBUG: bool = True
    SECRET_KEY: str = "movedin3-smart-secure-key-2025"
    
    # CORS - Handle as string and split into list
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,"
        "http://localhost:5174,"
        "http://localhost:5177,"
        "http://localhost:5178,"
        "http://localhost:3000,"
        "https://movedin-frontend.onrender.com,"
        "https://movedin.com,"
        "https://www.movedin.com"
    )
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert ALLOWED_ORIGINS string to list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
    
    class Config:
        env_file = "../../config/environment/.env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env

# Create settings instance
settings = Settings()
