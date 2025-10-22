# 📧 Enable Real Email Sending - Quick Guide

**Current Status**: Emails are being **logged to files** (test mode)  
**To Send Real Emails**: Add your SMTP password

---

## 🔧 STEP-BY-STEP GUIDE

### **Step 1: Get Your SMTP Password**

You need the password for `support@movedin.com` from GoDaddy 365.

**Option A: If you already know the password** - proceed to Step 2

**Option B: Reset password in GoDaddy:**
1. Go to https://admin.microsoft.com
2. Log in with your GoDaddy 365 account
3. Go to Users → Active users
4. Find `support@movedin.com`
5. Reset password
6. Copy the new password

---

### **Step 2: Update the .env File**

**Location**: `/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0/backend/.env`

**Current Line:**
```bash
SMTP_PASSWORD=your_smtp_password_here
```

**Change To:**
```bash
SMTP_PASSWORD=your_actual_godaddy_password_here
```

**Quick Edit Command:**
```bash
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0/backend
nano .env
# Find the SMTP_PASSWORD line
# Replace with your real password
# Press Ctrl+X, then Y, then Enter to save
```

---

### **Step 3: Restart the Backend**

Kill the current backend and restart it:

```bash
# Find and kill the backend process
lsof -ti:8000 | xargs kill -9

# Start backend again with the correct Python
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0/backend
/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

### **Step 4: Test Real Email Sending**

**Option A: Test via API:**
```bash
# Create a test lead
curl -X POST http://localhost:8000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "udi.shkolnik@alicesolutions.com",
    "customer_phone": "(416) 555-0000",
    "move_from": "Test Address",
    "move_to": "Test Address 2",
    "move_date": "2025-05-01",
    "move_time": "Morning",
    "vendor_name": "Test Vendor",
    "total_cost": 500.00
  }'

# Trigger payment (which sends emails)
curl -X POST http://localhost:8000/api/payment/create-link \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"cad","lead_id":3,"customer_email":"udi.shkolnik@alicesolutions.com","vendor_slug":"test"}'
```

**Option B: Test via Frontend:**
1. Go to http://localhost:5173
2. Fill out the quote form
3. Use `udi.shkolnik@alicesolutions.com` as the customer email
4. Complete the flow
5. Check your inbox!

---

### **Step 5: Verify Emails Were Sent**

After testing, you should receive **3 emails**:

1. **Your inbox** (`udi.shkolnik@alicesolutions.com`):
   - ✉️ Customer confirmation email
   - ✉️ Support alert email

2. **`support@movedin.com` inbox**:
   - ✉️ Vendor notification email

---

## 🔍 TROUBLESHOOTING

### **Issue 1: Emails still not sending**

Check backend logs for errors:
```bash
# The backend will show SMTP errors if password is wrong
# Look for lines like:
# ❌ Failed to send email: Authentication failed
```

### **Issue 2: Authentication Failed**

This means the password is wrong. Options:
- Double-check you copied the password correctly
- Make sure there are no extra spaces
- Try resetting the password in GoDaddy 365

### **Issue 3: Emails going to spam**

If emails are being sent but going to spam:
- Check your spam folder
- Add `support@movedin.com` to your contacts
- Mark the email as "Not Spam"

---

## 📊 CURRENT EMAIL CONFIGURATION

**From V3.0 .env file:**
```bash
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=support@movedin.com
SMTP_PASSWORD=your_smtp_password_here  ← CHANGE THIS!
```

**Email Recipients:**
- Customer email → Customer's email address (from form)
- Vendor email → `support@movedin.com`
- Support email → `udi.shkolnik@alicesolutions.com`

---

## 🎯 QUICK TEST SCRIPT

Save this as `test_email.sh` and run it after updating the password:

```bash
#!/bin/bash

echo "🧪 Testing Email System..."

# Create test lead
echo "📝 Creating test lead..."
LEAD_RESPONSE=$(curl -s -X POST http://localhost:8000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Email Test",
    "customer_email": "udi.shkolnik@alicesolutions.com",
    "customer_phone": "(416) 555-TEST",
    "move_from": "Test From",
    "move_to": "Test To",
    "move_date": "2025-05-01",
    "move_time": "Morning",
    "vendor_name": "Test Vendor",
    "total_cost": 100.00
  }')

LEAD_ID=$(echo $LEAD_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "✅ Lead created with ID: $LEAD_ID"

# Trigger payment (sends emails)
echo "💳 Triggering payment (this sends 3 emails)..."
curl -s -X POST http://localhost:8000/api/payment/create-link \
  -H "Content-Type: application/json" \
  -d "{\"amount\":100,\"currency\":\"cad\",\"lead_id\":$LEAD_ID,\"customer_email\":\"udi.shkolnik@alicesolutions.com\",\"vendor_slug\":\"test\"}"

echo ""
echo "✅ Test complete!"
echo ""
echo "📧 You should receive 3 emails:"
echo "   1. Customer confirmation → udi.shkolnik@alicesolutions.com"
echo "   2. Vendor notification → support@movedin.com"  
echo "   3. Support alert → udi.shkolnik@alicesolutions.com"
echo ""
echo "Check your inbox and spam folder!"
```

---

## 🚨 IMPORTANT SECURITY NOTES

1. **Never commit the `.env` file to Git** - it contains passwords!
2. **Keep the password secure** - don't share it publicly
3. **Use strong passwords** - GoDaddy 365 should enforce this
4. **Enable 2FA** on the GoDaddy account for extra security

---

## ✅ CHECKLIST

- [ ] Get SMTP password for `support@movedin.com`
- [ ] Update `.env` file with real password
- [ ] Restart backend server
- [ ] Test email sending
- [ ] Verify all 3 emails received
- [ ] Check spam folders if needed

---

## 📞 NEED THE PASSWORD?

**If you don't have the password:**

1. You manage the GoDaddy account → Reset it in GoDaddy 365 admin
2. Someone else manages it → Ask them for the SMTP password
3. It's a new setup → Create the email account in GoDaddy first

**GoDaddy 365 Admin Portal**: https://admin.microsoft.com

---

**Status**: ⚠️ **WAITING FOR SMTP PASSWORD**  
**Next Step**: Add password to `.env` and restart backend  
**Then**: Emails will send automatically! 🚀
