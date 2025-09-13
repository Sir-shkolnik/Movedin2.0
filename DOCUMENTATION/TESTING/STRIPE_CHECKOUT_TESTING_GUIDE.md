# 🧪 STRIPE CHECKOUT TESTING GUIDE

## ✅ System Verified (September 11, 2025)

End-to-end Stripe Checkout flow verified in production:

- Create Checkout Session (Step 6): working
- Redirect back to Step 7 with session_id in search or hash: working
- Verify Checkout Session (Step 7): working; Lead updated to payment_completed
- Email logging: working (file-based when SMTP disabled)
- Debug logs: working (per-lead timeline available)

Key curl commands:

```bash
# 1) Create Checkout Session (Step 6)
curl -X POST "https://movedin-backend.onrender.com/api/create-checkout-session" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "cad",
    "contact": {"firstName": "Test", "lastName": "User", "email": "test@example.com", "phone": "4161234567"},
    "quote_data": {"originAddress": "Toronto, ON", "destinationAddress": "Mississauga, ON", "moveDate": "2025-09-25", "moveTime": "Morning", "totalRooms": 2, "squareFootage": "2 Bedrooms"},
    "vendor": {"vendor_slug": "pierre-sons"}
  }'

# 2) Verify Checkout Session (Step 7) – replace with real session id
curl -X POST "https://movedin-backend.onrender.com/api/verify-checkout-session" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "cs_live_..."}'

# 3) Admin checks
curl -X GET "https://movedin-backend.onrender.com/admin/leads"
curl -X GET "https://movedin-backend.onrender.com/admin/comprehensive-stats"
curl -X GET "https://movedin-backend.onrender.com/admin/debug-logs?lead_id=LEAD_ID"

# 4) Email logging (file-based)
curl -X POST "https://movedin-backend.onrender.com/api/test-email" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"System Test","body":"Verifying email logging.","lead_id":123}'
```

Notes:
- Step 7 logic handles `session_id` in both `location.search` and `location.hash`.
- Additional services are set to $0 intentionally; vendors quote them after confirmation.

**Date:** January 15, 2025  
**Status:** ✅ **READY FOR TESTING**  
**Purpose:** Test the new Stripe Checkout Session implementation

---

## 🚀 **IMPLEMENTATION SUMMARY**

### **What We've Built:**
1. ✅ **Backend Checkout Session Endpoint** - `/api/create-checkout-session`
2. ✅ **Backend Payment Verification** - `/api/verify-checkout-session`
3. ✅ **Frontend Step6 Update** - Uses Checkout Sessions instead of Payment Links
4. ✅ **Frontend Step7 Update** - Loads data from URL parameters
5. ✅ **Email Logging System** - Logs emails to files for testing

---

## 🧪 **TESTING STEPS**

### **Step 1: Test Backend Endpoints**

#### **Test 1.1: Checkout Session Creation**
```bash
curl -X POST https://movedin-backend.onrender.com/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "cad",
    "contact": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "555-1234"
    },
    "quote_data": {
      "originAddress": "123 Test St, Toronto, ON",
      "destinationAddress": "456 Test Ave, Mississauga, ON",
      "moveDate": "2025-02-15",
      "moveTime": "Morning",
      "totalRooms": 3
    },
    "vendor": {
      "vendor_slug": "test-vendor"
    }
  }'
```

**Expected Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "session_id": "cs_test_...",
  "lead_id": 123
}
```

#### **Test 1.2: Email System Test**
```bash
curl -X POST https://movedin-backend.onrender.com/api/test-email
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email test completed - check logs/email_log_*.txt for details",
  "email_logged": true
}
```

### **Step 2: Test Frontend Flow**

#### **Test 2.1: Complete User Journey**
1. **Go to:** `https://movedin-frontend.onrender.com`
2. **Fill out Steps 1-5** with test data
3. **In Step 6:** Click "Pay $1.00 CAD Deposit"
4. **Expected:** Redirect to Stripe Checkout
5. **Complete payment** with test card: `4242 4242 4242 4242`
6. **Expected:** Redirect to Step7 with all form data displayed

#### **Test 2.2: Verify Data Persistence**
- ✅ Contact information displayed
- ✅ Move details displayed  
- ✅ Quote information displayed
- ✅ Payment confirmation shown
- ✅ Confetti animation plays

### **Step 3: Test Email Logging**

#### **Test 3.1: Check Email Logs**
After completing a payment, check for email logs:
```bash
# Check if logs directory exists
ls -la logs/

# View today's email log
cat logs/email_log_$(date +%Y%m%d).txt
```

**Expected Content:**
```
================================================================================
📧 EMAIL NOTIFICATION - 2025-01-15 14:30:00
================================================================================
To: support@movedin.com
Subject: 💳 Payment Completed - Lead #123 - MovedIn 2.0
From: support@movedin.com
================================================================================
Body:
[Detailed email content with all form data]
================================================================================
```

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues & Solutions:**

#### **Issue 1: "Failed to create checkout session"**
- **Check:** Stripe API key is configured
- **Check:** Backend is running
- **Solution:** Verify environment variables

#### **Issue 2: "Payment verification failed"**
- **Check:** Session ID is valid
- **Check:** Lead exists in database
- **Solution:** Check backend logs

#### **Issue 3: "Error loading payment data"**
- **Check:** URL parameters are present
- **Check:** Backend verification endpoint
- **Solution:** Check network requests in browser dev tools

#### **Issue 4: No email logs created**
- **Check:** Logs directory permissions
- **Check:** Backend email service
- **Solution:** Check backend logs for errors

---

## 📊 **SUCCESS CRITERIA**

### **✅ Payment Flow Working:**
- [ ] User can complete payment in Stripe Checkout
- [ ] Redirect to Step7 with all form data
- [ ] Payment status shows as completed
- [ ] Confetti animation plays

### **✅ Data Persistence:**
- [ ] All form data displayed correctly
- [ ] Lead saved to database
- [ ] Payment details recorded

### **✅ Email System:**
- [ ] Email notifications logged to file
- [ ] Support notification sent
- [ ] Customer confirmation sent

---

## 🚀 **DEPLOYMENT CHECKLIST**

### **Before Deploying:**
- [ ] Test all endpoints locally
- [ ] Verify Stripe API keys are set
- [ ] Check database connection
- [ ] Test email logging system

### **After Deploying:**
- [ ] Test complete payment flow
- [ ] Verify email logs are created
- [ ] Check database for new leads
- [ ] Monitor error logs

---

## 📝 **NEXT STEPS**

1. **Test the implementation** using the steps above
2. **Deploy to production** when testing is complete
3. **Monitor logs** for any issues
4. **Set up real SMTP** when ready for production emails

---

**🎯 Ready to test! Follow the steps above to verify everything is working correctly.**
