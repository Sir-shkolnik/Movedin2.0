# 🔑 How to Get Your Real Stripe Keys

**You're Right!** All Stripe credentials exist - they're just stored securely on Render.

---

## 🎯 **WHERE YOUR STRIPE KEYS ARE**

### **Option 1: Render Dashboard** (Easiest - 2 minutes)

Your V2.0 system is already deployed on Render with working Stripe!

**Steps**:
1. Go to https://dashboard.render.com
2. Login with your account
3. Find service: `movedin-backend`
4. Click on "Environment" tab
5. Look for these secret variables:
   - `STRIPE_SECRET_KEY` (sk_live_***)
   - `STRIPE_WEBHOOK_SECRET` (whsec_***)
   - `STRIPE_PUBLISHABLE_KEY` (or check frontend for this)

6. Click "Show" next to each to reveal the values
7. Copy them to V3.0 `.env` file

**Time**: 2 minutes ✅

---

### **Option 2: Stripe Dashboard** (Alternative - 5 minutes)

If you can't access Render, get fresh keys from Stripe:

**Steps**:
1. Go to https://dashboard.stripe.com
2. Login with your Stripe account
3. Go to: **Developers** → **API Keys**
4. You'll see:
   - **Publishable key**: `pk_live_***` (you already have this!)
   - **Secret key**: `sk_live_***` (click "Reveal" to see)

5. Copy the secret key

6. For webhook secret:
   - Go to: **Developers** → **Webhooks**
   - Find existing webhook OR create new one
   - Endpoint URL: `https://movedin-backend.onrender.com/api/payment/webhook`
   - Copy the **Signing secret** (whsec_***)

**Time**: 5 minutes ✅

---

### **Option 3: Check V2.0 Backend Code** (Last Resort)

Sometimes keys are in environment examples:

```bash
# Search V2.0 backend for any Stripe references
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/Movedin2.0/backend
grep -r "sk_live" . 2>/dev/null
grep -r "whsec" . 2>/dev/null
```

---

## 📝 **WHAT TO DO WITH THE KEYS**

### **Update V3.0 Environment**:

```bash
# Edit: /Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0/config/environment/.env

# Update these lines:
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_51RgBSOE963QK6A6ztPM0FuDuo7yGZ93RiSbWuw3KlswwNdgjWoFnVKMd5V7WPjEskoIwKWDmTVDRNK9z8zDFDfoQ00TC0IpMWr
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

---

## 🧪 **TEST REAL STRIPE**

Once you have the keys, test immediately:

```bash
# 1. Update .env with real keys
# 2. Restart backend (it will auto-reload)
# 3. Run test:

cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0
python tests/test_complete_journey.py
```

**Expected**:
- Real Stripe checkout session created
- Actual payment link generated
- Webhook handler ready
- Real $1 CAD transaction

---

## 🎯 **CURRENT STATUS**

### **What You Have**:
```bash
✅ Stripe account active
✅ Public key: pk_live_51RgBSO...
✅ V2.0 using real Stripe successfully
✅ 126+ payments processed on V2.0
❓ Secret key: Hidden on Render (need to retrieve)
❓ Webhook secret: Hidden on Render (need to retrieve)
```

### **What You Need to Do**:
```bash
1. Login to Render dashboard (2 mins)
2. Copy STRIPE_SECRET_KEY (30 seconds)
3. Copy STRIPE_WEBHOOK_SECRET (30 seconds)
4. Update V3.0 .env file (1 min)
5. Test payment (5 mins)
```

**Total Time**: ~10 minutes ⚡

---

## 🚀 **AFTER YOU GET THE KEYS**

### **Immediate Actions**:
1. Update `config/environment/.env` with real keys
2. Backend will auto-reload (watch the terminal)
3. Test a real payment (use Stripe test card: 4242 4242 4242 4242)
4. Verify emails send
5. Ready for production! ✅

### **Then Deploy**:
1. Push V3.0 to GitHub
2. Deploy to Render (same as V2.0)
3. Add environment variables on Render
4. Launch! 🎉

---

## 📊 **WHY THIS IS EASY**

You've already done this for V2.0! Just:
- Use same Render account
- Use same Stripe account
- Use same process
- Deploy V3.0 the same way

**V2.0 is your blueprint** - you know exactly how to do this! 💪

---

## ✅ **RECOMMENDATION**

**Right Now** (10 minutes):
1. Login to Render → Copy Stripe keys
2. Update V3.0 .env
3. Test payment

**Tomorrow** (2-3 hours):
1. Deploy V3.0 to Render
2. Copy V2.0 deployment setup
3. Launch! 🚀

**You're literally ONE login away from having real Stripe working!** 🎯

