# app/models/

This folder contains all SQLAlchemy ORM models for the backend.

## Files
- `__init__.py` — Imports and exposes all models for unified access.
- `quote.py` — Quote and QuoteItem models (moving quotes and their breakdowns).
- `lead.py` — Lead model (customer lead/contact info and move details).
- `vendor.py` — Vendor and Dispatcher models (moving companies and their branches).
- `user.py` — User model (system users, authentication, and roles).

## Database Schema Overview

### Current Tables (6 total)
- **leads** - Customer lead information (2 records currently)
- **quotes** - Moving quotes and pricing
- **quote_items** - Individual items in quotes
- **vendors** - Moving company information
- **dispatchers** - Vendor dispatcher details
- **users** - System user accounts

### Model Relationships
- **Lead** → **Quote** (one-to-many)
- **Quote** → **QuoteItem** (one-to-many)
- **Vendor** → **Dispatcher** (one-to-many)
- **Quote** → **Vendor** (many-to-one)

### Key Model Features
- **Timestamps**: All models include `created_at` and `updated_at` fields
- **Foreign Keys**: Proper relationships between tables
- **Indexes**: Optimized database queries
- **Validation**: Pydantic schemas for API validation

### Database Operations
```python
from app.models import Lead, Quote, Vendor, User
from app.core.database import get_db

# Example: Create a new lead
lead = Lead(
    first_name="John",
    last_name="Doe",
    email="john@example.com",
    phone="555-1234",
    origin_address="123 Main St, Toronto, ON",
    destination_address="456 Oak Ave, Vancouver, BC",
    move_date="2024-06-15",
    move_time="09:00",
    total_rooms=3
)
``` 