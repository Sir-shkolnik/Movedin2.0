# 🔧 **STRIPE INTEGRATION FIX GUIDE**

## 🚨 **Critical Issues Identified:**

### **1. Security Issue: STRIPE_SECRET_KEY on Frontend**
- **Problem**: `STRIPE_SECRET_KEY` is incorrectly configured on the `movedin-frontend` service
- **Risk**: This exposes the secret key to the frontend, which is a major security vulnerability
- **Fix**: Remove from frontend, add to backend only

### **2. Missing Frontend Key**
- **Problem**: `VITE_STRIPE_PUBLISHABLE_KEY` is not configured on the frontend
- **Impact**: Stripe.js cannot load, causing payment errors
- **Fix**: Add the publishable key to frontend service

### **3. Invalid Stripe Keys**
- **Problem**: The current Stripe keys appear to be invalid or test keys
- **Impact**: Payment intents cannot be created properly
- **Fix**: Use valid Stripe keys

## 🔧 **Step-by-Step Fix Instructions:**

### **Step 1: Get Valid Stripe Keys**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Get Test Keys** (for development):
   - **Publishable Key**: `pk_test_...` (starts with pk_test_)
   - **Secret Key**: `sk_test_...` (starts with sk_test_)
3. **Get Live Keys** (for production):
   - **Publishable Key**: `pk_live_...` (starts with pk_live_)
   - **Secret Key**: `sk_live_...` (starts with sk_live_)

### **Step 2: Fix Backend Service Environment Variables**

1. Go to Render Dashboard → `movedin-backend` service → Environment
2. **Add these environment variables:**

```bash
# Stripe Configuration (Backend Only)
STRIPE_SECRET_KEY=sk_test_YOUR_VALID_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Zoho CRM Configuration
ZOHO_CLIENT_ID=YOUR_ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET=YOUR_ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN=YOUR_ZOHO_REFRESH_TOKEN
```

### **Step 3: Fix Frontend Service Environment Variables**

1. Go to Render Dashboard → `movedin-frontend` service → Environment
2. **Remove the incorrectly placed key:**
   - ❌ **REMOVE**: `STRIPE_SECRET_KEY` (this should NOT be on frontend)

3. **Add the correct frontend key:**
   - ✅ **ADD**: `VITE_STRIPE_PUBLISHABLE_KEY` with value: `pk_test_YOUR_VALID_STRIPE_PUBLISHABLE_KEY`

### **Step 4: Test Stripe Connection**

```bash
# Test backend Stripe connection
curl -X GET "https://movedin-backend.onrender.com/api/test-connection"

# Test frontend Stripe key
# Open browser console and check:
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Missing');
```

## 🧪 **Testing the Complete Payment Flow:**

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
3. On Step 6, the payment should work with real Stripe
4. Check browser console for: "Stripe publishable key: Configured"

## 🔍 **Stripe API Key Format:**

### **Test Keys (Development):**
- **Publishable**: `pk_test_51RgBS0E963QK6A6z1ydxY1ZK`
- **Secret**: `sk_test_51RgBS0E963QK6A6z1ydxY1ZK`

### **Live Keys (Production):**
- **Publishable**: `pk_live_51RgBS0E963QK6A6z1ydxY1ZK`
- **Secret**: `sk_live_51RgBS0E963QK6A6z1ydxY1ZK`

## 🚀 **Deployment Steps:**

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
- ✅ Payment flow redirects to Stripe payment page
- ✅ Lead data is saved to database after payment

## 🔒 **Security Notes:**

- **NEVER** put `STRIPE_SECRET_KEY` on frontend services
- **ONLY** use `VITE_STRIPE_PUBLISHABLE_KEY` on frontend
- Keep all secret keys on backend services only
- Use environment variables for all sensitive configuration

## 📋 **Current Status:**

- ✅ **Payment Intent Creation**: Working
- ✅ **Backend Stripe Integration**: Working
- ✅ **Lead Saving**: Working
- ⚠️ **Frontend Stripe Integration**: Needs proper keys
- ⚠️ **Payment Flow**: Currently using simulation

---

**Status**: 🔧 **READY FOR DEPLOYMENT**  
**Last Updated**: August 1, 2025 