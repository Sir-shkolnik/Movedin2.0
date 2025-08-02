# app/core/

This folder contains core configuration and database setup for the backend.

## Files
- `__init__.py` — Marks this as the core package. Comment: "Core configuration and database".
- `config.py` — Loads all environment variables and app settings using Pydantic.
- `database.py` — SQLAlchemy database engine, session management, and model base class.

## Database Configuration

### Connection Details
- **Database URL**: `postgresql://movedin:movedin@postgres:5432/movedin`
- **Engine Settings**: Pool pre-ping enabled, 300s recycle
- **Session Management**: Auto-commit disabled, auto-flush disabled

### Environment Variables
The application loads database configuration from:
- Environment variables (DATABASE_URL)
- `.env` file in backend directory
- Docker Compose environment settings

### Database Engine Features
- **Connection Pooling**: Automatic connection management
- **Health Checks**: Pool pre-ping validates connections
- **Connection Recycling**: Connections recycled every 300 seconds
- **Session Factory**: SQLAlchemy session management with dependency injection

### Usage in Application
```python
from app.core.database import get_db, SessionLocal

# Dependency injection in FastAPI routes
def some_route(db: Session = Depends(get_db)):
    # Use database session
    pass

# Direct session usage
db = SessionLocal()
try:
    # Database operations
    pass
finally:
    db.close()
``` 