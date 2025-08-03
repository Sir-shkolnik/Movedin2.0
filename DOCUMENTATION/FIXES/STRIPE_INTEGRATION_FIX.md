# 🔧 **STRIPE INTEGRATION FIX GUIDE**

## 🚨 **Critical Issues Found:**

### **1. Security Issue: STRIPE_SECRET_KEY on Frontend**
- **Problem**: `STRIPE_SECRET_KEY` is incorrectly configured on the `movedin-frontend` service
- **Risk**: This exposes the secret key to the frontend, which is a major security vulnerability
- **Fix**: Remove from frontend, add to backend only

### **2. Missing Frontend Key**
- **Problem**: `VITE_STRIPE_PUBLISHABLE_KEY` is not configured on the frontend
- **Impact**: Stripe.js cannot load, causing payment errors
- **Fix**: Add the publishable key to frontend service

## 🔧 **Step-by-Step Fix Instructions:**

### **Step 1: Fix Backend Service Environment Variables**

1. Go to Render Dashboard → `movedin-backend` service → Environment
2. **Add these environment variables:**

```bash
# Stripe Configuration (Backend Only)
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY_HERE

# Zoho CRM Configuration
ZOHO_CLIENT_ID=YOUR_ZOHO_CLIENT_ID_HERE
ZOHO_CLIENT_SECRET=YOUR_ZOHO_CLIENT_SECRET_HERE
ZOHO_REFRESH_TOKEN=YOUR_ZOHO_REFRESH_TOKEN_HERE
```

### **Step 2: Fix Frontend Service Environment Variables**

1. Go to Render Dashboard → `movedin-frontend` service → Environment
2. **Remove the incorrectly placed key:**
   - ❌ **REMOVE**: `STRIPE_SECRET_KEY` (this should NOT be on frontend)

3. **Add the correct frontend key:**
   - ✅ **ADD**: `VITE_STRIPE_PUBLISHABLE_KEY` with your Stripe publishable key

### **Step 3: Verify Configuration**

After making these changes:

1. **Backend should have:**
   - ✅ `STRIPE_SECRET_KEY` (secret key for server-side operations)
   - ✅ `STRIPE_WEBHOOK_SECRET` (for webhook verification)
   - ✅ All Zoho CRM keys

2. **Frontend should have:**
   - ✅ `VITE_STRIPE_PUBLISHABLE_KEY` (public key for client-side Stripe.js)
   - ✅ `VITE_API_URL`
   - ✅ `VITE_MAPBOX_ACCESS_TOKEN`
   - ❌ **NO** `STRIPE_SECRET_KEY` (security risk)

## 🧪 **Testing the Fix:**

### **Test 1: Payment Intent Creation**
```bash
curl -X POST "https://movedin-backend.onrender.com/api/create-intent" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "cad",
    "customer_email": "test@example.com",
    "description": "Test payment"
  }'
```

**Expected Response:**
```json
{
  "client_secret": "pi_xxx_secret_xxx",
  "payment_intent_id": "pi_xxx",
  "amount": 100,
  "currency": "cad"
}
```

### **Test 2: Frontend Payment Flow**
1. Go to https://movedin-frontend.onrender.com
2. Complete the form steps
3. On Step 6, the payment should work without errors
4. Check browser console for: "Stripe publishable key: Configured"

## 🔍 **Debugging Commands:**

### **Check Backend Environment:**
```bash
curl https://movedin-backend.onrender.com/api/test-connection
```

### **Check Frontend Environment:**
Open browser console and check:
```javascript
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing');
```

## 🚀 **Deployment:**

After fixing the environment variables:

1. **Trigger Backend Redeploy:**
   ```bash
   render deploys create srv-d26qr1muk2gs73cbna2g
   ```

2. **Trigger Frontend Redeploy:**
   ```bash
   render deploys create srv-d26qqomuk2gs73cbmq0g
   ```

## ✅ **Success Indicators:**

- ✅ No more "Stripe not configured" errors
- ✅ Payment intent creation works
- ✅ Frontend shows "Stripe publishable key: Configured"
- ✅ Payment flow completes successfully
- ✅ Lead data is saved to database

## 🔒 **Security Notes:**

- **NEVER** put `STRIPE_SECRET_KEY` on frontend services
- **ONLY** use `VITE_STRIPE_PUBLISHABLE_KEY` on frontend
- Keep all secret keys on backend services only
- Use environment variables for all sensitive configuration

---

**Status**: 🔧 **READY FOR DEPLOYMENT**  
**Last Updated**: August 1, 2025 