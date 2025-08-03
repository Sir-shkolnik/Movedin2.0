# 🚀 **VENDOR ACCOUNT SETUP GUIDE**

## 📋 **Vendor User Accounts to Create**

### **1. Let's Get Moving**
- **Username**: `letsgetmoving`
- **Password**: `password123`
- **Email**: `admin@letsgetmovinggroup.com`
- **Full Name**: `Let's Get Moving Admin`
- **Company**: `Let's Get Moving Group`
- **Address**: `400 Industrial Avenue, Vancouver V6A2P3`
- **Phone**: `(604) 555-0123`

### **2. Easy2Go**
- **Username**: `easy2go`
- **Password**: `password123`
- **Email**: `admin@easy2go.ca`
- **Full Name**: `Easy2Go Admin`
- **Company**: `Easy2Go Moving`
- **Address**: `3397 American Drive, Mississauga, ON L4V 1T8`
- **Phone**: `(905) 555-0123`

### **3. Velocity Movers**
- **Username**: `velocitymovers`
- **Password**: `password123`
- **Email**: `admin@velocitymovers.ca`
- **Full Name**: `Velocity Movers Admin`
- **Company**: `Velocity Movers`
- **Address**: `1234 Moving Street, Toronto, ON M5V 2H1`
- **Phone**: `(416) 555-0123`

### **4. Pierre & Sons**
- **Username**: `pierresons`
- **Password**: `password123`
- **Email**: `admin@pierresons.ca`
- **Full Name**: `Pierre & Sons Admin`
- **Company**: `Pierre & Sons Moving`
- **Address**: `5678 Transport Road, Toronto, ON M5V 3K9`
- **Phone**: `(416) 555-0456`

---

## 🔧 **Setup Commands**

### **Once Backend is Deployed:**

```bash
# Test vendor login endpoint
curl -X POST "https://movedin-backend.onrender.com/vendor/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "letsgetmoving", "password": "password123"}'

# Test vendor profile endpoint
curl -X GET "https://movedin-backend.onrender.com/vendor/profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test vendor analytics endpoint
curl -X GET "https://movedin-backend.onrender.com/vendor/analytics" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Frontend URLs to Test:**

```bash
# Vendor login page
curl -I "https://movedin-frontend.onrender.com/vendor/login"

# Vendor dashboard (after login)
curl -I "https://movedin-frontend.onrender.com/vendor/dashboard"
```

---

## 🎯 **Expected Results**

### **✅ Successful Login Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "vendor_id": "lgm_001",
  "vendor_name": "Let's Get Moving",
  "permissions": [
    "manage_locations",
    "manage_pricing", 
    "view_leads",
    "manage_profile",
    "view_analytics"
  ]
}
```

### **✅ Vendor Profile Response:**
```json
{
  "vendor_id": "lgm_001",
  "vendor_name": "Let's Get Moving",
  "company_name": "Let's Get Moving Group",
  "business_address": "400 Industrial Avenue, Vancouver V6A2P3",
  "phone_number": "(604) 555-0123",
  "email": "admin@letsgetmovinggroup.com",
  "full_name": "Let's Get Moving Admin",
  "permissions": [...],
  "is_verified": true,
  "is_active": true
}
```

---

## 🚨 **Troubleshooting**

### **If Vendor Routes Not Found:**
1. **Check Deployment Status**: Wait for backend deployment to complete
2. **Verify Routes**: Check if `/vendor/*` endpoints are available
3. **Check Dependencies**: Ensure all required packages are installed

### **If Login Fails:**
1. **Check User Creation**: Ensure vendor users are created in database
2. **Verify Password**: Use `password123` for all test accounts
3. **Check Role**: Ensure user role is set to "vendor"

### **If Frontend 404:**
1. **Check Build**: Ensure frontend build includes vendor routes
2. **Verify Deployment**: Wait for frontend deployment to complete
3. **Check Routing**: Ensure vendor routes are in AppWithRouter

---

## 📊 **Status Tracking**

- [ ] Backend vendor routes deployed
- [ ] Frontend vendor pages deployed  
- [ ] Vendor user accounts created
- [ ] Login functionality tested
- [ ] Dashboard functionality tested
- [ ] Profile management tested
- [ ] Analytics functionality tested

---

**Status**: Waiting for deployment to complete 