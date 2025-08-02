from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://movedin:movedin@postgres:5432/movedin"
    
    # Redis
    REDIS_URL: str = "redis://redis:6379"
    
    # API Keys
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    ZOHO_CRM_API_KEY: Optional[str] = None
    
    # Zoho CRM Integration
    ZOHO_CLIENT_ID: Optional[str] = None
    ZOHO_CLIENT_SECRET: Optional[str] = None
    ZOHO_REDIRECT_URI: Optional[str] = None
    ZOHO_AUTH_URL: str = "https://accounts.zoho.com/oauth/v2/auth"
    ZOHO_TOKEN_URL: str = "https://accounts.zoho.com/oauth/v2/token"
    ZOHO_CRM_API_URL: str = "https://www.zohoapis.com/crm/v3"
    
    # Google Sheets Integration
    GOOGLE_SHEETS_SPREADSHEET_ID: str = "1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA"
    GOOGLE_SHEETS_CREDENTIALS_FILE: str = "google-sheets-credentials.json"
    
    # App Settings
    APP_NAME: str = "MovedIn 2.0"
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-here"
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:5177", "http://localhost:5178", "http://localhost:3000"]
    
    # Vendor Settings
    GOOGLE_SHEETS_SYNC_INTERVAL: int = 14400  # 4 hours in seconds
    
    class Config:
        case_sensitive = False

settings = Settings() 