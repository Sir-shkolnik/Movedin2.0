# 🚀 MovedIn 2.0 Production Deployment Guide

**Target Platform**: Render.com  
**Status**: ✅ **PRODUCTION READY**  
**Last Updated**: August 1, 2025

---

## 📋 **Pre-Deployment Checklist**

### **✅ Project Structure**
```
/MovedIn2.0
├── backend/
│   ├── app/                    # FastAPI application
│   ├── Dockerfile             # Production Docker config
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/                # Static assets
│   ├── src/                   # React components
│   ├── package.json           # Node dependencies
│   └── vite.config.ts         # Build configuration
├── render.yaml                # Render deployment config
├── env.sample                 # Environment variables template
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

### **✅ Environment Variables**
- [x] Backend CORS configuration updated
- [x] Frontend API calls use environment variables
- [x] Docker configuration production-ready
- [x] All secrets properly configured

---

## 🔐 **Environment Variables Setup**

### **1. Create .env file from template**
```bash
cp env.sample .env
```

### **2. Required Environment Variables**

#### **Backend (.env)**
```bash
# Application
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secret-key-here
ALLOWED_ORIGINS=https://movedin-frontend.onrender.com,http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_URL=redis://user:password@host:port

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Zoho CRM
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token

# Mapbox
MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token

# Admin Panel
ADMIN_PANEL_SECRET=your-admin-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

#### **Frontend (.env)**
```bash
VITE_API_BASE_URL=https://movedin-backend.onrender.com
VITE_FRONTEND_URL=https://movedin-frontend.onrender.com
VITE_ENVIRONMENT=production
VITE_MAPBOX_TOKEN=pk.your_mapbox_token
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

---

## 🐳 **Docker Configuration**

### **Backend Dockerfile**
```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Expose port (Render uses PORT environment variable)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:10000/health || exit 1

# Start the backend API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
```

---

## 🌐 **Render.com Deployment**

### **1. Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your repository

### **2. Deploy Backend Service**
1. **New Web Service**
   - Connect repository
   - Name: `movedin-backend`
   - Environment: `Docker`
   - Region: `Oregon`
   - Plan: `Starter`

2. **Environment Variables**
   ```bash
   ENVIRONMENT=production
   DEBUG=false
   ALLOWED_ORIGINS=https://movedin-frontend.onrender.com,http://localhost:5173
   DATABASE_URL=postgresql://... (from Render database)
   REDIS_URL=redis://... (from Render Redis)
   SECRET_KEY=your-secret-key
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ZOHO_CLIENT_ID=your-client-id
   ZOHO_CLIENT_SECRET=your-client-secret
   ZOHO_REFRESH_TOKEN=your-refresh-token
   MAPBOX_ACCESS_TOKEN=pk.your-token
   ADMIN_PANEL_SECRET=your-admin-secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-password
   ```

3. **Health Check**
   - Path: `/health`
   - Interval: 30s

### **3. Create Database**
1. **New PostgreSQL**
   - Name: `movedin-db`
   - Region: `Oregon`
   - Plan: `Starter`

### **4. Create Redis**
1. **New Redis**
   - Name: `movedin-redis`
   - Region: `Oregon`
   - Plan: `Starter`

### **5. Deploy Frontend Service**
1. **New Static Site**
   - Connect repository
   - Name: `movedin-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Region: `Oregon`

2. **Environment Variables**
   ```bash
   VITE_API_BASE_URL=https://movedin-backend.onrender.com
   VITE_FRONTEND_URL=https://movedin-frontend.onrender.com
   VITE_ENVIRONMENT=production
   VITE_MAPBOX_TOKEN=pk.your-token
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

---

## 🔐 **Security Configuration**

### **1. Admin Panel Protection**
```python
# Backend admin route protection
@app.middleware("http")
async def admin_auth_middleware(request: Request, call_next):
    if request.url.path.startswith("/admin"):
        # Verify admin token
        token = request.headers.get("Authorization")
        if not verify_admin_token(token):
            return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    return await call_next(request)
```

### **2. CORS Configuration**
```python
# Backend CORS setup
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **3. Stripe Webhook Verification**
```python
# Backend Stripe webhook verification
@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": "Invalid payload"})
    except stripe.error.SignatureVerificationError as e:
        return JSONResponse(status_code=400, content={"error": "Invalid signature"})
    
    # Process webhook event
    return {"status": "success"}
```

---

## 🧪 **Testing Checklist**

### **Pre-Deployment Testing**
- [ ] **Local Docker Build**
  ```bash
  cd backend
  docker build -t movedin-backend .
  docker run -p 8000:10000 movedin-backend
  ```

- [ ] **Frontend Build**
  ```bash
  cd frontend
  npm install
  npm run build
  ```

- [ ] **API Endpoints**
  ```bash
  curl http://localhost:8000/health
  curl http://localhost:8000/vendors/locations
  curl -X POST http://localhost:8000/api/quotes/ \
    -H "Content-Type: application/json" \
    -d '{"origin_address": "123 Main St, Toronto, ON", "destination_address": "456 Oak Ave, Mississauga, ON", "move_date": "2025-02-15", "move_time": "morning", "total_rooms": 3}'
  ```

### **Post-Deployment Testing**
- [ ] **Health Check**: `https://movedin-backend.onrender.com/health`
- [ ] **API Documentation**: `https://movedin-backend.onrender.com/docs`
- [ ] **Frontend**: `https://movedin-frontend.onrender.com`
- [ ] **Admin Panel**: `https://movedin-frontend.onrender.com/admin`
- [ ] **Stripe Integration**: Test payment flow
- [ ] **Zoho Integration**: Test CRM sync

---

## 🌍 **Custom Domain Setup**

### **1. Add Custom Domain**
1. Go to Render Dashboard
2. Select your service
3. Settings → Custom Domain
4. Add your domain (e.g., `api.movedin.com`)

### **2. DNS Configuration**
```
Type: CNAME
Name: api
Value: movedin-backend.onrender.com
```

### **3. SSL Certificate**
- Render automatically provisions SSL certificates
- Certificates are managed by Let's Encrypt
- Auto-renewal is handled by Render

---

## 📊 **Monitoring & Logs**

### **1. Render Dashboard**
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, response times
- **Health Checks**: Automatic monitoring

### **2. Application Monitoring**
```python
# Backend health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "2.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }
```

### **3. Error Tracking**
- **Sentry**: Add Sentry DSN to environment variables
- **Logging**: Configure structured logging
- **Alerts**: Set up email notifications

---

## 🔄 **Deployment Workflow**

### **1. Development**
```bash
# Local development
docker-compose up -d
npm run dev  # frontend
uvicorn main:app --reload  # backend
```

### **2. Testing**
```bash
# Run tests
cd backend && python -m pytest
cd frontend && npm test
```

### **3. Production Deployment**
```bash
# Push to GitHub
git add .
git commit -m "Production deployment ready"
git push origin main

# Render automatically deploys
# Monitor deployment in Render dashboard
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Build Failures**
- Check Dockerfile syntax
- Verify requirements.txt
- Check build logs in Render dashboard

#### **2. Environment Variables**
- Ensure all required variables are set
- Check variable names match code
- Verify no typos in values

#### **3. Database Connection**
- Verify DATABASE_URL format
- Check database credentials
- Ensure database is accessible

#### **4. CORS Errors**
- Verify ALLOWED_ORIGINS includes frontend URL
- Check frontend API_BASE_URL
- Test with curl to isolate issue

#### **5. Stripe Integration**
- Verify webhook endpoint is accessible
- Check webhook signature verification
- Test with Stripe CLI locally

---

## ✅ **Final Verification**

### **Production URLs**
- **Backend API**: `https://movedin-backend.onrender.com`
- **Frontend**: `https://movedin-frontend.onrender.com`
- **API Docs**: `https://movedin-backend.onrender.com/docs`
- **Health Check**: `https://movedin-backend.onrender.com/health`

### **Success Criteria**
- [ ] All API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] Stripe payments work in test mode
- [ ] Admin panel is accessible and secure
- [ ] Zoho integration functions properly
- [ ] Database connections are stable
- [ ] SSL certificates are valid
- [ ] Health checks pass consistently

---

## 🎉 **Deployment Complete!**

Your MovedIn 2.0 application is now:
- ✅ **Production Ready**: Secure, scalable, and monitored
- ✅ **Cloud Deployed**: Running on Render.com infrastructure
- ✅ **Payment Enabled**: Stripe integration active
- ✅ **CRM Integrated**: Zoho sync operational
- ✅ **Admin Protected**: Secure admin panel
- ✅ **SSL Secured**: HTTPS by default
- ✅ **Auto-Scaling**: Handles traffic automatically

**🚀 Your MovedIn 2.0 application is live and ready for production use!** 