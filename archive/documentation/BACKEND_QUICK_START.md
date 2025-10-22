# Backend Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you set up the Movedin 3.0 backend system quickly.

---

## 📋 Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- API keys (Stripe, Zoho CRM, SendGrid)

---

## ⚡ Quick Setup

### **Step 1: Create Backend Directory**
```bash
cd MovedinV3.0
mkdir -p backend/app/{models,schemas,api/routes,services,core}
mkdir -p backend/tests
```

### **Step 2: Create Virtual Environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### **Step 3: Install Dependencies**
```bash
pip install fastapi uvicorn sqlalchemy stripe sendgrid python-dotenv pydantic
```

### **Step 4: Create .env File**
```bash
cat > .env << 'EOF'
# Database
DATABASE_URL=sqlite:///./database.db

# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# Zoho CRM
ZOHO_CLIENT_ID=1000.YOUR_CLIENT_ID
ZOHO_CLIENT_SECRET=YOUR_CLIENT_SECRET
ZOHO_REFRESH_TOKEN=1000.YOUR_REFRESH_TOKEN
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v2

# Email Service
SENDGRID_API_KEY=SG.YOUR_API_KEY
FROM_EMAIL=support@movedin.ca
VENDOR_EMAIL=vendors@movedin.ca
SUPPORT_EMAIL=support@movedin.ca

# Application
APP_NAME=MovedIn 3.0
API_V1_STR=/api
DEBUG=True
CORS_ORIGINS=http://localhost:5176
EOF
```

### **Step 5: Create Main Application File**
```bash
cat > app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="MovedIn 3.0 API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5176").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "MovedIn 3.0 API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
```

### **Step 6: Run the Server**
```bash
python app/main.py
```

### **Step 7: Test the API**
```bash
curl http://localhost:8000/
# Should return: {"message": "MovedIn 3.0 API", "status": "running"}

curl http://localhost:8000/health
# Should return: {"status": "healthy"}
```

---

## 🎯 Next Steps

1. **Read the full implementation plan**: `docs/BACKEND_IMPLEMENTATION_PLAN.md`
2. **Set up database**: Create SQLite schema
3. **Implement endpoints**: Add lead, payment, and Zoho endpoints
4. **Test integration**: Test with frontend
5. **Deploy**: Deploy to production

---

## 📚 Documentation

- **Full Implementation Plan**: `docs/BACKEND_IMPLEMENTATION_PLAN.md`
- **Status Report**: `docs/ZOHO_STRIPE_STATUS.md`
- **System Comparison**: `docs/SYSTEM_COMPARISON.md`

---

## 🆘 Troubleshooting

### **Port Already in Use**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### **Import Errors**
```bash
# Make sure you're in the backend directory
cd backend
# Activate virtual environment
source venv/bin/activate
```

### **API Keys Not Working**
- Check `.env` file exists
- Verify API keys are correct
- Make sure no extra spaces in keys

---

## ✅ Checklist

- [ ] Backend directory created
- [ ] Virtual environment activated
- [ ] Dependencies installed
- [ ] `.env` file created with API keys
- [ ] Main application file created
- [ ] Server running on http://localhost:8000
- [ ] Health check endpoint working

---

**Ready to implement?** Follow the full implementation plan in `docs/BACKEND_IMPLEMENTATION_PLAN.md`!

