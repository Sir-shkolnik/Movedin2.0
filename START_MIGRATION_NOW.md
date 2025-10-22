# 🚀 START MIGRATION NOW - Quick Action Guide

**⏱️ Total Time:** 2-3 hours  
**☕ Recommended:** Have coffee ready  
**📖 Full Guide:** See `EXECUTE_MIGRATION.md` for detailed steps

---

## 🎯 What We're Doing

**Replacing MovedIn 2.0 with MovedIn V3.0 on production** ✅

**Result:** movedin.ca will run the new V3.0 with:
- Modern React frontend
- FastAPI backend
- Full SEO + Blog system
- 3-email notification system
- Stripe payment integration
- 4 vendor integrations
- Mobile-first design

---

## ✅ Before You Start - 5 Minutes

### Open These Dashboards:
1. **Render:** https://dashboard.render.com (login)
2. **DNS Provider:** Your DNS dashboard (GoDaddy, Cloudflare, etc.)
3. **Stripe:** https://dashboard.stripe.com (login)
4. **GitHub:** https://github.com (login)

### Prepare a Text File:
Create a file called `migration-notes.txt` to store:
- Environment variables you'll extract
- Render service names
- DNS records
- Any notes as you go

---

## 📝 STEP 1: Extract Old Settings (10 minutes)

### 1.1 Get Environment Variables from Render

**Navigate to:** Render Dashboard

**For EACH old MovedIn 2.0 service:**
1. Find services with "movedin" in the name
2. Click on each service
3. Go to "Environment" tab
4. Copy these values to `migration-notes.txt`:

```bash
# Copy these EXACT values:
SMTP_PASSWORD=
STRIPE_SECRET_KEY=sk_live_
STRIPE_PUBLISHABLE_KEY=pk_live_
STRIPE_WEBHOOK_SECRET=whsec_
MAPBOX_ACCESS_TOKEN=pk.
SECRET_KEY=
```

### 1.2 Document Old Service Names

**Write down:**
```
Old Frontend Service: _________________
Old Backend Service: _________________
```

### 1.3 Check Current DNS

**Navigate to:** Your DNS provider

**Write down current DNS for movedin.ca:**
```
A Record or CNAME: _________________
```

---

## 🐙 STEP 2: Push V3.0 to GitHub (10 minutes)

### Option A: New Repository (Recommended)

**On GitHub:**
1. Go to: https://github.com/new
2. Repository name: `movedin-v3` (or `movedin`)
3. Make it: **PRIVATE**
4. Click "Create repository"

**On Your Mac Terminal:**
```bash
cd "/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0"

# Initialize git (if not already)
git init
git add .
git commit -m "MovedIn V3.0 - Production Ready"
git branch -M main

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/movedin-v3.git
git push -u origin main
```

### Option B: Existing Repository

```bash
cd "/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0"

git add .
git commit -m "MovedIn V3.0 - Production Ready with SEO & Blog"
git push origin main
```

**✅ Verify:** Go to your GitHub repo and confirm files are there

---

## 🏗️ STEP 3: Deploy to Render (15 minutes)

### 3.1 Create Services via Blueprint

**Render Dashboard:**
1. Click "New +" (top right)
2. Select "Blueprint"
3. Click "Connect a repository"
4. Authorize GitHub (if needed)
5. Select your repo: `movedin-v3`
6. Click "Connect"
7. Render detects `render.yaml`
8. Click "Apply"

**Wait 2-3 minutes.** Render creates:
- `movedin-backend` service
- `movedin-frontend` service

### 3.2 Configure Backend Environment Variables

**Navigate to:** Dashboard → `movedin-backend` → Environment

**Click "Add Environment Variable" and add these:**

```bash
ENVIRONMENT=production
DATABASE_URL=sqlite:///./movedin.db
SMTP_SERVER=smtp.zoho.com
SMTP_PORT=587
SMTP_USERNAME=support@alicesolutionsgroup.com
```

**Then add these with values from your `migration-notes.txt`:**

```bash
SMTP_PASSWORD=[PASTE]
STRIPE_SECRET_KEY=[PASTE - starts with sk_live_]
STRIPE_PUBLISHABLE_KEY=[PASTE - starts with pk_live_]
STRIPE_WEBHOOK_SECRET=[PASTE - starts with whsec_]
MAPBOX_ACCESS_TOKEN=[PASTE - starts with pk.]
SECRET_KEY=[PASTE or generate new random string]
```

**Then add these:**

```bash
DEBUG=false
PORT=8000
ALLOWED_ORIGINS=https://movedin.ca,https://www.movedin.ca,https://movedin-frontend.onrender.com
```

**Click "Save Changes"** → Render will deploy backend

### 3.3 Configure Frontend Environment Variables

**Navigate to:** Dashboard → `movedin-frontend` → Settings

**Copy the backend URL:**
- Look at `movedin-backend` service
- Copy URL (e.g., `https://movedin-backend-xyz123.onrender.com`)

**Navigate to:** Dashboard → `movedin-frontend` → Environment

**Add these:**

```bash
VITE_API_URL=https://movedin-backend-xyz123.onrender.com
VITE_ENVIRONMENT=production
PORT=3000
```

**⚠️ Replace `movedin-backend-xyz123` with YOUR actual backend URL!**

**Click "Save Changes"** → Render will deploy frontend

### 3.4 Wait for Deployment

**Watch the logs:**
- Backend: Takes ~3-5 minutes
- Frontend: Takes ~2-3 minutes

**Wait until both show:**
- ✅ "Build succeeded"
- ✅ "Deploy live"

### 3.5 Test Render URLs

**Get your Render URLs:**
- Backend: `https://movedin-backend-xyz123.onrender.com`
- Frontend: `https://movedin-frontend-xyz123.onrender.com`

**Test in browser:**
```
# Open in browser:
https://movedin-backend-xyz123.onrender.com/health
# Should show: {"status":"healthy",...}

# Open in browser:
https://movedin-frontend-xyz123.onrender.com/
# Should show: MovedIn homepage
```

**✅ If both work, continue to STEP 4**

---

## 🌐 STEP 4: Point Domain to V3.0 (15 minutes)

### 4.1 Add Custom Domains in Render

**Navigate to:** Dashboard → `movedin-frontend` → Settings

**Scroll to "Custom Domains"**

**Add root domain:**
1. Click "Add Custom Domain"
2. Enter: `movedin.ca`
3. Click "Save"

**Add www subdomain:**
1. Click "Add Custom Domain"
2. Enter: `www.movedin.ca`
3. Click "Save"

**Render will show DNS instructions. Copy them!**

### 4.2 Update DNS Records

**Navigate to:** Your DNS provider dashboard

**Update these records:**

**For movedin.ca (root):**
```
Type: A
Name: @ (or blank)
Value: 216.24.57.1
TTL: 300
```

**For www.movedin.ca:**
```
Type: CNAME
Name: www
Value: movedin-frontend-xyz123.onrender.com
TTL: 300
```

**⚠️ Use YOUR actual frontend subdomain from Render!**

**Save changes**

### 4.3 Wait for DNS Propagation

**Check DNS with online tool:**
- Go to: https://dnschecker.org/#A/movedin.ca
- Enter: `movedin.ca`
- Wait until most locations show: `216.24.57.1`

**Or check from terminal:**
```bash
dig movedin.ca
# Look for: 216.24.57.1
```

**Time:** Usually 5-30 minutes, max 2 hours

**☕ Take a coffee break while waiting**

---

## ✅ STEP 5: Test Production (20 minutes)

### 5.1 Wait for SSL Certificate

**After DNS propagates, wait 5-10 more minutes for SSL.**

**Test HTTPS:**
```bash
# Should return 200 OK
curl -I https://movedin.ca
```

### 5.2 Test Website

**Open in browser:**
- https://movedin.ca
- https://www.movedin.ca

**Check:**
- [ ] Homepage loads
- [ ] Logo displays
- [ ] Navigation works
- [ ] No errors in console (F12)

### 5.3 Test Quote Wizard

**Complete full flow:**
1. Click "Get Quote"
2. From: `123 King St, Toronto, ON`
3. To: `456 Queen St, Toronto, ON`
4. Date: Tomorrow
5. Time: Morning
6. Items: Select 2-3 items
7. Click "Next"
8. Verify: 4 vendor quotes appear
9. Select vendor, click "Next"
10. Enter contact info (use YOUR real email)
11. Click "Pay $1.00 Deposit"

**Expected:**
- ✅ Stripe checkout opens
- ✅ Shows LIVE mode
- ✅ Amount is $1.00 CAD

**⚠️ DON'T complete payment unless testing with real card**

### 5.4 Test Email (Simple Method)

**Send a test lead via curl:**
```bash
curl -X POST https://movedin-backend-xyz123.onrender.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Production Test",
    "customer_email": "YOUR_EMAIL@example.com",
    "customer_phone": "416-555-9999",
    "move_from": "Toronto, ON",
    "move_to": "Ottawa, ON",
    "move_date": "2026-01-15",
    "move_time": "Morning",
    "vendor_name": "Pierre & Sons",
    "total_cost": "1500"
  }'
```

**Replace:**
- `movedin-backend-xyz123` with YOUR backend URL
- `YOUR_EMAIL@example.com` with YOUR real email

**Then trigger notification:**
```bash
# Get the lead ID from the response above, then:
curl -X POST https://movedin-backend-xyz123.onrender.com/api/leads/1/notify
```

**Check your email for:**
- ✅ Customer confirmation
- ✅ Support notification (to support@alicesolutionsgroup.com)

### 5.5 Test Blog Pages

**Open in browser:**
- https://movedin.ca/blogs
- https://movedin.ca/blog/best-neighbourhoods-families-gta

**Check:**
- [ ] Pages load
- [ ] Styles look good
- [ ] No errors

### 5.6 Test Mobile

**Chrome DevTools:**
1. Press F12
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test quote wizard on mobile
5. Verify all steps work

---

## 🔔 STEP 6: Update Stripe Webhook (5 minutes)

**Navigate to:** https://dashboard.stripe.com

**Switch to LIVE mode** (toggle top right)

**Update webhook:**
1. Go to "Developers" → "Webhooks"
2. Find existing webhook OR create new
3. Update URL to: `https://movedin-backend-xyz123.onrender.com/api/payment/webhook`
4. Select events: `checkout.session.completed`
5. Click "Update endpoint"
6. Copy webhook secret (click "Reveal")

**Update Render:**
1. Go to: Dashboard → `movedin-backend` → Environment
2. Find: `STRIPE_WEBHOOK_SECRET`
3. Update value to new secret
4. Save changes

---

## 📊 STEP 7: Monitor for 48-72 Hours (2-3 days)

### Daily Checks:

**Day 1-3:**
- [ ] Check Render logs (Dashboard → Service → Logs)
- [ ] Test 1-2 quotes per day
- [ ] Verify emails deliver
- [ ] Check for any errors

**If everything works smoothly for 48-72 hours, proceed to STEP 8**

---

## 🗑️ STEP 8: Retire Old Services (10 minutes)

### After 48-72 Hours of Stable V3.0:

**Suspend (don't delete yet):**
1. Go to: Dashboard → Old Service
2. Click service name
3. Go to "Settings"
4. Click "Suspend"
5. Confirm

**Suspend these:**
- [ ] Old frontend service
- [ ] Old backend service

### After 7 More Days:

**If V3.0 is stable, delete old services:**
1. Go to: Dashboard → Old Service → Settings
2. Scroll to "Delete Service"
3. Type service name
4. Click "Delete"

---

## 🎉 DONE!

### You Now Have:
- ✅ Modern V3.0 running on movedin.ca
- ✅ Full SEO optimization
- ✅ Blog system (1 article live, 9 ready)
- ✅ 3-email notification system
- ✅ Stripe LIVE mode payment
- ✅ 4 vendor integrations
- ✅ Mobile-first design
- ✅ Security hardened

### Next Steps:
1. Monitor for first month
2. Create remaining 9 blog posts
3. Collect user feedback
4. Scale as needed

---

## 🚨 If Something Goes Wrong

### Quick Rollback:

**1. Revert DNS (5 minutes):**
- Go to DNS provider
- Change A/CNAME back to old values
- Wait 5-10 minutes

**2. Resume Old Services (2 minutes):**
- Render Dashboard → Old Service → Resume

**3. Investigate:**
- Check Render logs for errors
- Check browser console
- Test specific endpoint

---

## 📞 Need Help?

**Contact:**
- udi.shkolnik@alicesolutions.com

**Dashboards:**
- Render: https://dashboard.render.com
- Stripe: https://dashboard.stripe.com

**Documentation:**
- Full guide: `EXECUTE_MIGRATION.md`
- Strategic plan: `MIGRATION_TO_PRODUCTION_PLAN.md`

---

## ✅ Quick Checklist

**Before:**
- [ ] Dashboards open (Render, DNS, Stripe, GitHub)
- [ ] `migration-notes.txt` created
- [ ] 2-3 hours available

**During:**
- [ ] Extract env vars (10 min)
- [ ] Push to GitHub (10 min)
- [ ] Deploy to Render (15 min)
- [ ] Update DNS (15 min)
- [ ] Wait for DNS (5-60 min)
- [ ] Test everything (20 min)
- [ ] Update Stripe webhook (5 min)

**After:**
- [ ] Monitor 48-72 hours
- [ ] Suspend old services
- [ ] Wait 7 days
- [ ] Delete old services

---

**🚀 Let's do this! You've got everything you need. The hardest part (building V3.0) is already done!**

**Start Time:** ___________  
**Expected Finish:** ___________ (2-3 hours later)

**Good luck! 🍀**


