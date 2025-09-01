# 🚚 MovedIn 2.0 Backend

## 🎯 **Quick Start**

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py

# Or with uvicorn
uvicorn main:app --reload
```

## 🏗️ **Core Structure**

- **`main.py`** - FastAPI application entry point
- **`app/`** - Main application code
  - **`api/routes/`** - API endpoints
  - **`core/`** - Configuration and database
  - **`models/`** - Database models
  - **`services/`** - Business logic services
- **`tests/`** - Test suite
- **`requirements.txt`** - Python dependencies

## 🔧 **Environment Variables**

```env
DATABASE_URL=postgresql://movedin:movedin@postgres:5432/movedin
REDIS_URL=redis://redis:6379
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 📚 **Documentation**

All detailed documentation has been moved to `../DOCUMENTATION/BACKEND/`:

- **Architecture** - System design and implementation details
- **Vendors** - Vendor integration documentation
- **Deployment** - Docker and deployment guides
- **Migrations** - Database migration scripts
- **Scripts** - Utility and setup scripts

## 🚀 **API Endpoints**

- **Health Check**: `GET /health`
- **API Docs**: `GET /docs`
- **Quotes**: `POST /api/quotes/`
- **Leads**: `POST /api/leads/`
- **Vendors**: `GET /vendors/locations`
- **Admin**: `/admin/*`

## 🧪 **Testing**

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app
```

---

**Status**: ✅ Production Ready  
**Version**: 2.4.0  
**Last Updated**: September 2025
