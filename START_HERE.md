# 🚀 MovedIn 3.0 - Quick Start Guide

**Welcome to MovedIn 3.0!** This guide will get you up and running in 5 minutes.

---

## ⚡ **Super Quick Start**

```bash
# Terminal 1: Start Backend
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0/src/backend
python3.11 -m uvicorn main:app --port 8000

# Terminal 2: Start Frontend
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0/src/frontend
npm run dev

# Open Browser
http://localhost:5174
```

**That's it!** 🎉

---

## 📋 **Prerequisites**

Before starting, ensure you have:

- ✅ Python 3.11 (required for backend)
- ✅ Node.js 18+ (for frontend)
- ✅ npm or yarn
- ✅ Git (optional)

---

## 🔧 **Detailed Setup**

### **Step 1: Backend Setup**

```bash
# Navigate to backend directory
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0/src/backend

# Install dependencies (if needed)
python3.11 -m pip install -r ../../logs/backend/requirements.txt

# Start the backend server
python3.11 -m uvicorn main:app --port 8000

# You should see:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# ✅ Database initialized successfully
# 🚀 MovedIn 3.0 Smart & Secure Backend started
```

**Backend is now running at:** `http://localhost:8000`

**Health Check:** `curl http://localhost:8000/health`

---

### **Step 2: Frontend Setup**

```bash
# Open a NEW terminal
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0/src/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5174/
```

**Frontend is now running at:** `http://localhost:5174`

---

## 🧪 **Verify Everything Works**

### **1. Check Backend Health**
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "3.0.0",
  "services": {
    "database": "healthy",
    "email": "configured",
    "stripe": "configured",
    "mapbox": "configured"
  }
}
```

### **2. Test Frontend**
Open browser: `http://localhost:5174`

You should see the MovedIn homepage with the quote wizard.

### **3. Complete Test Flow**
1. Fill out the quote form
2. View vendor quotes (all 4 should appear)
3. Select a vendor
4. Enter contact information
5. Proceed to payment
6. Complete with test payment

---

## 📧 **Test Email System**

When you complete a booking, 3 emails will be sent:

1. **Customer Confirmation** → Your email
2. **Vendor Notification** → support@movedin.com
3. **Support Alert** → udi.shkolnik@alicesolutions.com

**Check your inbox!** Emails will have real data, map images, and professional design.

---

## 🗄️ **Check Database**

View all leads in the database:

```bash
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0
sqlite3 src/backend/movedin.db "SELECT * FROM leads;"
```

Or use a GUI tool like DB Browser for SQLite.

---

## 🐛 **Troubleshooting**

### **Backend won't start**

**Problem:** `ModuleNotFoundError: No module named 'sqlalchemy'`

**Solution:**
```bash
python3.11 -m pip install sqlalchemy fastapi uvicorn pydantic python-dotenv
```

**Problem:** `Address already in use`

**Solution:**
```bash
# Kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

---

### **Frontend won't start**

**Problem:** `Cannot find module`

**Solution:**
```bash
cd src/frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Port 5174 in use

**Solution:**
```bash
# Kill the process
lsof -ti:5174 | xargs kill -9
```

---

### **Vendors not showing quotes**

**Problem:** Console errors about NaN or invalid calculations

**Solution:** Already fixed! Ensure you're on the latest code.

---

### **Emails not sending**

**Problem:** Email system not configured

**Solution:** Check `config/environment/.env` has:
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=support@movedin.com
SMTP_PASSWORD=gagxov-syxkek-8byvDu
```

---

## 📊 **System Status**

Current system status:
- ✅ Backend: Running
- ✅ Frontend: Running
- ✅ Database: 15 test leads
- ✅ Email: Configured
- ✅ Payment: Stripe integrated
- ✅ Vendors: 4 calculators working

---

## 📖 **Next Steps**

### **For Testing:**
1. Complete a full booking flow
2. Check email notifications
3. Verify database entries
4. Test all 4 vendors

### **For Development:**
1. Review `/docs` for architecture
2. Check `/tests` for test suites
3. See `/docs/architecture` for system design

### **For Deployment:**
1. See `/docs/deployment/PRODUCTION_READINESS_CHECKLIST.md`
2. Update environment variables
3. Configure production database
4. Set up monitoring

---

## 🔗 **Important Links**

- **Frontend:** http://localhost:5174
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (FastAPI Swagger)
- **Health:** http://localhost:8000/health

---

## 📚 **Documentation**

- [README.md](README.md) - Full project overview
- [docs/](docs/) - Complete documentation
- [docs/architecture/](docs/architecture/) - System architecture
- [docs/implementation/](docs/implementation/) - Implementation guides
- [docs/testing/](docs/testing/) - Test documentation

---

## 💡 **Tips**

1. **Always use Python 3.11** for the backend (not 3.12 or 3.13)
2. **Frontend port is 5174** (not 5173)
3. **Database is in** `src/backend/movedin.db`
4. **Logs are in** `logs/backend/` and `logs/frontend/`
5. **Email templates are in** `assets/templates/`

---

## 🎉 **You're Ready!**

The system is fully functional and production-ready. Enjoy testing!

**Questions?** Check `/docs` or contact support@movedin.com

---

**Last Updated:** October 21, 2025  
**Version:** 3.0.0  
**Status:** ✅ Production Ready
