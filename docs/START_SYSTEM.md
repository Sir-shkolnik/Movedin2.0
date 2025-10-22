# 🚀 Start MovedIn 3.0 System

## Quick Start Guide

This guide will help you start both the backend and frontend servers.

---

## 📋 Prerequisites

- Python 3.11+ installed
- Node.js and npm installed
- All dependencies installed

---

## 🚀 Start the System

### **Option 1: Manual Start (Recommended)**

#### **1. Start Backend (Terminal 1)**
```bash
cd backend
./start.sh
```

**Backend runs on**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

#### **2. Start Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```

**Frontend runs on**: http://localhost:5176

---

### **Option 2: Quick Start Script**

```bash
# Start backend
cd backend && ./start.sh &

# Start frontend
cd frontend && npm run dev
```

---

## 🧪 Test the System

### **1. Test Backend**
```bash
# Health check
curl http://localhost:8000/health

# Should return: {"status": "healthy"}
```

### **2. Test Frontend**
1. Open http://localhost:5176
2. Click "Get a Quote"
3. Fill out the quote wizard
4. Complete all 8 steps

### **3. Test Payment Flow**
1. Go through quote wizard
2. Select a vendor
3. Enter contact info
4. Click "Pay Deposit" (TEST MODE: $1)
5. Complete payment with test card: `4242 4242 4242 4242`

---

## 🔧 Troubleshooting

### **Backend Won't Start**
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Try again
cd backend && ./start.sh
```

### **Frontend Won't Start**
```bash
# Check if port 5176 is in use
lsof -i :5176

# Kill process on port 5176
lsof -ti:5176 | xargs kill -9

# Try again
cd frontend && npm run dev
```

### **Backend Connection Refused**
```bash
# Make sure backend is running
curl http://localhost:8000/health

# If it fails, start backend:
cd backend && ./start.sh
```

---

## 📊 System Status

### **Backend**
- ✅ API: http://localhost:8000
- ✅ Docs: http://localhost:8000/docs
- ✅ Health: http://localhost:8000/health

### **Frontend**
- ✅ App: http://localhost:5176
- ✅ Quote Wizard: http://localhost:5176/quote

---

## 🎯 Quick Test

### **Test Backend API**
```bash
# Create a test lead
curl -X POST http://localhost:8000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "quote_data": {
      "origin_address": "123 Main St, Toronto, ON",
      "destination_address": "456 Oak Ave, Toronto, ON",
      "move_date": "2025-10-30",
      "move_time": "Morning",
      "home_type": "house",
      "total_rooms": 3
    },
    "selected_quote": {
      "vendor_name": "Test Vendor",
      "vendor_slug": "test-vendor",
      "total_cost": 1000,
      "hourly_rate": 100
    },
    "contact_data": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-1234"
    }
  }'
```

---

## ✅ Success Indicators

### **Backend Running**
- ✅ Terminal shows: "Application startup complete"
- ✅ `curl http://localhost:8000/health` returns `{"status": "healthy"}`
- ✅ http://localhost:8000/docs shows API documentation

### **Frontend Running**
- ✅ Terminal shows: "Local: http://localhost:5176"
- ✅ Browser opens and shows MovedIn homepage
- ✅ No console errors

### **System Working**
- ✅ Quote wizard loads
- ✅ All 4 vendors generate quotes
- ✅ Payment button works
- ✅ Backend receives API calls

---

## 🎉 You're Ready!

Once both servers are running:
1. Open http://localhost:5176
2. Click "Get a Quote"
3. Complete the quote wizard
4. Test the payment flow (TEST MODE: $1)

---

**Need Help?**
- Check the logs in the terminal
- Review `backend/README.md`
- Review `frontend/README.md`
- Check `INTEGRATION_COMPLETE.md`

