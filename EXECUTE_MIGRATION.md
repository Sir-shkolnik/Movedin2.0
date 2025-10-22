# 🚀 Execute Migration - Step-by-Step Commands

**Date:** October 22, 2025  
**Status:** Ready to Execute  
**Time Required:** 2-3 hours (including DNS propagation wait)

---

## ✅ Pre-Flight Check

Before starting, ensure you have:
- [ ] Access to Render Dashboard (https://dashboard.render.com)
- [ ] Access to your DNS provider (GoDaddy, Cloudflare, etc.)
- [ ] Access to Stripe Dashboard (https://dashboard.stripe.com)
- [ ] GitHub account with repository access
- [ ] All passwords and credentials ready

---

## 🎯 Step-by-Step Execution

### STEP 1: Extract Current Production Settings (10 minutes)

#### 1.1 Get Render Environment Variables

**Navigate to:** https://dashboard.render.com

**For EACH old MovedIn 2.0 service:**

1. Click on the service name
2. Go to "Environment" tab
3. Copy these values to a secure note:

```bash
# Save these values securely:
SMTP_PASSWORD=_______________
STRIPE_SECRET_KEY=sk_live_________________
STRIPE_PUBLISHABLE_KEY=pk_live_________________
STRIPE_WEBHOOK_SECRET=whsec_________________
MAPBOX_ACCESS_TOKEN=pk.________________
SECRET_KEY=_______________
```

#### 1.2 Document Current Render Services

**List all service names to retire:**
- Frontend service: `_______________`
- Backend service: `_______________`
- Any others: `_______________`

#### 1.3 Get DNS Records

**Navigate to:** Your DNS provider dashboard

**Document current DNS:**
```
movedin.ca → A record or CNAME → _______________
www.movedin.ca → CNAME → _______________
```

---

### STEP 2: Prepare Local V3.0 Code (5 minutes)

#### 2.1 Rebuild Docker with Latest Changes

```bash
cd "/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0"

# Stop current containers
docker-compose down

# Rebuild with fixed API URL
docker-compose up --build -d

# Wait 15 seconds for services to start
sleep 15

# Verify services are running
docker ps | grep movedin
```

#### 2.2 Test Locally

```bash
# Test frontend
curl -f http://localhost:3000/ && echo "✅ Frontend OK" || echo "❌ Frontend FAILED"

# Test backend health
curl -f http://localhost:8000/health && echo "✅ Backend OK" || echo "❌ Backend FAILED"

# Test backend API
curl -f http://localhost:8000/docs && echo "✅ API Docs OK" || echo "❌ API Docs FAILED"
```

**If all tests pass, continue to Step 3.**

---

### STEP 3: Push to GitHub (10 minutes)

#### 3.1 Check Git Status

```bash
cd "/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0"

# Check current status
git status
```

#### 3.2 Commit Latest Changes

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Production ready: Fixed API URLs, added migration docs, SEO + Blog #1 complete"
```

#### 3.3 Push to GitHub

**Option A: If this is a NEW repository**
```bash
# Initialize if not already done
git init
git branch -M main

# Create a new repository on GitHub:
# 1. Go to https://github.com/new
# 2. Name it: movedin-v3 (or movedin)
# 3. Make it PRIVATE
# 4. Don't add README, .gitignore, or license (we already have them)
# 5. Copy the repository URL

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/movedin-v3.git

# Push to GitHub
git push -u origin main
```

**Option B: If using existing repository**
```bash
# Check remote
git remote -v

# If remote exists, just push:
git push origin main

# Or if you want a separate branch for V3:
git checkout -b production-v3
git push origin production-v3
```

---

### STEP 4: Deploy to Render via Blueprint (15 minutes)

#### 4.1 Create Services from Blueprint

**Navigate to:** https://dashboard.render.com

**Steps:**
1. Click "New +" (top right)
2. Select "Blueprint"
3. Select "Connect a repository"
4. Authorize GitHub if needed
5. Select your repository: `movedin-v3` (or whatever you named it)
6. Click "Connect"
7. Render will detect `render.yaml`
8. Click "Apply" to create both services

**Render will create:**
- ✅ `movedin-backend` (Web Service, Docker)
- ✅ `movedin-frontend` (Web Service, Docker)

#### 4.2 Configure Backend Environment Variables

**Navigate to:** Dashboard → `movedin-backend` → Environment

**Click "Add Environment Variable" for each:**

```bash
# Copy these and fill in values from STEP 1:

ENVIRONMENT=production
DATABASE_URL=sqlite:///./movedin.db
SMTP_SERVER=smtp.zoho.com
SMTP_PORT=587
SMTP_USERNAME=support@alicesolutionsgroup.com
SMTP_PASSWORD=[PASTE FROM STEP 1]
STRIPE_SECRET_KEY=[PASTE FROM STEP 1 - starts with sk_live_]
STRIPE_PUBLISHABLE_KEY=[PASTE FROM STEP 1 - starts with pk_live_]
STRIPE_WEBHOOK_SECRET=[PASTE FROM STEP 1 - starts with whsec_]
MAPBOX_ACCESS_TOKEN=[PASTE FROM STEP 1 - starts with pk.]
SECRET_KEY=[PASTE FROM STEP 1 or generate new]
DEBUG=false
PORT=8000
ALLOWED_ORIGINS=https://movedin.ca,https://www.movedin.ca,https://movedin-frontend.onrender.com
```

**Click "Save Changes"**

#### 4.3 Configure Frontend Environment Variables

**Navigate to:** Dashboard → `movedin-frontend` → Environment

**Get Backend URL:**
- Look at `movedin-backend` service
- Copy the URL (e.g., `https://movedin-backend-abc123.onrender.com`)

**Add these variables:**

```bash
VITE_API_URL=https://movedin-backend-abc123.onrender.com
VITE_ENVIRONMENT=production
PORT=3000
```

**Replace `movedin-backend-abc123` with YOUR actual backend service URL!**

**Click "Save Changes"**

#### 4.4 Trigger Deployment

**Backend:**
1. Go to Dashboard → `movedin-backend`
2. Click "Manual Deploy" → "Deploy latest commit"
3. Watch logs (takes ~3-5 minutes)
4. Wait for "Build succeeded" and "Deploy live"

**Frontend:**
1. Go to Dashboard → `movedin-frontend`
2. Click "Manual Deploy" → "Deploy latest commit"
3. Watch logs (takes ~2-3 minutes)
4. Wait for "Build succeeded" and "Deploy live"

#### 4.5 Verify Render Services

**Get Render URLs:**
- Backend: `https://movedin-backend-abc123.onrender.com`
- Frontend: `https://movedin-frontend-abc123.onrender.com`

**Test Health Endpoints:**

```bash
# Test backend (replace with YOUR URL)
curl https://movedin-backend-abc123.onrender.com/health

# Expected response:
# {"status":"healthy","timestamp":"...","database":"connected"}

# Test frontend (replace with YOUR URL)
curl https://movedin-frontend-abc123.onrender.com/

# Expected: HTML content
```

**If both return success, continue to Step 5.**

---

### STEP 5: Configure Custom Domain (15 minutes)

#### 5.1 Add Custom Domains to Render

**Navigate to:** Dashboard → `movedin-frontend` → Settings

**Scroll to "Custom Domains" section**

**Add Domain:**
1. Click "Add Custom Domain"
2. Enter: `movedin.ca`
3. Click "Save"

**Add WWW Domain:**
1. Click "Add Custom Domain" again
2. Enter: `www.movedin.ca`
3. Click "Save"

**Render will show DNS instructions:**
- For `movedin.ca`: Add A record pointing to `216.24.57.1`
- For `www.movedin.ca`: Add CNAME pointing to `movedin-frontend-abc123.onrender.com`

**Copy these instructions!**

#### 5.2 Update DNS Records

**Navigate to:** Your DNS provider dashboard

**Update/Add Records:**

**For Root Domain (movedin.ca):**
```
Type: A
Name: @ (or leave blank for root)
Value: 216.24.57.1
TTL: 300 (5 minutes)
```

**For WWW Subdomain (www.movedin.ca):**
```
Type: CNAME
Name: www
Value: movedin-frontend-abc123.onrender.com
TTL: 300 (5 minutes)
```

**⚠️ Replace `movedin-frontend-abc123` with YOUR actual Render subdomain!**

**Save DNS Changes**

#### 5.3 Wait for DNS Propagation

**Check DNS propagation:**

```bash
# Check from command line
dig movedin.ca
dig www.movedin.ca

# Or use online tool:
# https://dnschecker.org/#A/movedin.ca
```

**Wait time:** 5 minutes to 2 hours (usually 10-30 minutes)

**While waiting, continue to Step 6 to configure Stripe.**

---

### STEP 6: Update Stripe Webhook (5 minutes)

#### 6.1 Get New Backend URL

**Your new backend URL:** `https://movedin-backend-abc123.onrender.com`

**Webhook endpoint:** `https://movedin-backend-abc123.onrender.com/api/payment/webhook`

#### 6.2 Update Stripe Webhook

**Navigate to:** https://dashboard.stripe.com

**Switch to LIVE mode** (toggle in top right)

**Update Webhook:**
1. Go to "Developers" → "Webhooks"
2. Find existing webhook OR create new one
3. Click "Update" (or "Add endpoint")
4. Update URL to: `https://movedin-backend-abc123.onrender.com/api/payment/webhook`
5. Select events: `checkout.session.completed`
6. Click "Update endpoint" (or "Add endpoint")

**Copy Webhook Secret:**
1. Click on the webhook
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

#### 6.3 Update Render Backend Env Var

**Navigate to:** Dashboard → `movedin-backend` → Environment

**Update variable:**
```
STRIPE_WEBHOOK_SECRET=[PASTE NEW SECRET]
```

**Click "Save Changes"**

**Render will automatically redeploy the backend.**

---

### STEP 7: Test Production Deployment (20 minutes)

#### 7.1 Wait for SSL Certificate

**After DNS propagates, wait an additional 5-10 minutes for SSL.**

**Check SSL:**
```bash
# Should return 200 OK
curl -I https://movedin.ca
```

**If you get SSL error, wait another 5 minutes.**

#### 7.2 Test Frontend

**Open browser and visit:**
- https://movedin.ca
- https://www.movedin.ca

**Check:**
- [ ] Homepage loads
- [ ] Logo displays
- [ ] Navigation works
- [ ] "Get Quote" button works
- [ ] No console errors (F12 → Console)

#### 7.3 Test Quote Wizard (Full Flow)

**Navigate to:** https://movedin.ca

**Complete Full Flow:**
1. Click "Get Quote"
2. Enter "From" address: `123 King St, Toronto, ON`
3. Enter "To" address: `456 Queen St, Toronto, ON`
4. Select date: Tomorrow's date
5. Select time: "Morning"
6. Choose items: Select 2-3 items, click "Next"
7. Check vendor quotes appear (should show 4 vendors)
8. Select a vendor, click "Next"
9. Enter contact info:
   - First Name: Test
   - Last Name: Production
   - Email: YOUR_EMAIL@example.com
   - Phone: 416-555-1234
10. Click "Pay $1.00 Deposit"

**Expected Result:**
- ✅ Stripe checkout page opens
- ✅ Shows LIVE mode (not TEST mode)
- ✅ Amount is $1.00 CAD

**⚠️ DON'T complete payment yet unless you want to test with a real card!**

#### 7.4 Test Email Delivery

**Option A: Complete payment with real card**
- Complete Stripe checkout
- Check YOUR_EMAIL@example.com for confirmation

**Option B: Test without payment**
```bash
# Use curl to create a test lead
curl -X POST https://movedin-backend-abc123.onrender.com/api/leads \
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

# Then trigger email notification (replace LEAD_ID with the returned ID)
curl -X POST https://movedin-backend-abc123.onrender.com/api/leads/LEAD_ID/notify
```

**Check inbox for:**
- ✅ Customer confirmation email
- ✅ Support notification (to support@alicesolutionsgroup.com)
- ✅ Vendor notification (if enabled)

#### 7.5 Test Blog & SEO

**Visit blog pages:**
- https://movedin.ca/blogs
- https://movedin.ca/blog/best-neighbourhoods-families-gta

**Check in browser DevTools (F12):**
1. Go to "Elements" tab
2. Find `<head>` section
3. Verify meta tags:
   - [ ] `<title>` tag present
   - [ ] `<meta name="description">` present
   - [ ] `<meta property="og:title">` present
   - [ ] `<script type="application/ld+json">` present (Schema.org)

#### 7.6 Test Mobile Responsiveness

**Open Chrome DevTools (F12):**
1. Click "Toggle device toolbar" (Ctrl+Shift+M)
2. Select "iPhone 12 Pro"
3. Test quote wizard flow on mobile
4. Check all steps are usable

#### 7.7 Run Lighthouse Audit

**In Chrome DevTools:**
1. Go to "Lighthouse" tab
2. Select "Mobile" and all categories
3. Click "Analyze page load"

**Target Scores:**
- Performance: 70+ (acceptable)
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

---

### STEP 8: Submit Sitemap to Google (5 minutes)

#### 8.1 Verify Sitemap

**Visit:** https://movedin.ca/sitemap.xml

**Check:**
- [ ] XML file loads
- [ ] Contains all pages (homepage, blogs, etc.)
- [ ] URLs use `https://movedin.ca` (not `movedin.com` or Render URLs)

#### 8.2 Submit to Google Search Console

**Navigate to:** https://search.google.com/search-console

**Add Property:**
1. Click "Add Property"
2. Select "URL prefix"
3. Enter: `https://movedin.ca`
4. Verify ownership (use DNS TXT record method)

**Submit Sitemap:**
1. Go to "Sitemaps" in left menu
2. Enter: `sitemap.xml`
3. Click "Submit"

**Check for errors** (may take a few hours for Google to process)

---

### STEP 9: Set Up Monitoring (10 minutes)

#### 9.1 Enable Render Notifications

**Navigate to:** Dashboard → Account Settings → Notifications

**Enable:**
- [ ] Deploy notifications
- [ ] Service health notifications
- [ ] Set email: `udi.shkolnik@alicesolutions.com`

#### 9.2 Set Up UptimeRobot (Optional)

**Navigate to:** https://uptimerobot.com (free account)

**Add Monitors:**

**Monitor 1: Frontend**
```
Type: HTTPS
URL: https://movedin.ca/
Interval: 5 minutes
Alert email: udi.shkolnik@alicesolutions.com
```

**Monitor 2: Backend**
```
Type: HTTPS
URL: https://movedin-backend-abc123.onrender.com/health
Interval: 5 minutes
Alert email: udi.shkolnik@alicesolutions.com
```

---

### STEP 10: Monitor for 48-72 Hours (2-3 days)

#### 10.1 Check Daily

**For the next 2-3 days, check:**
- [ ] Render logs for errors (Dashboard → Service → Logs)
- [ ] Email delivery (test 1-2 quotes per day)
- [ ] No customer complaints or errors
- [ ] Uptime monitoring (if set up)

**If any issues arise:**
1. Check Render logs first
2. Check browser console errors
3. Test specific failing endpoint
4. If critical, consider rollback (see STEP 11)

#### 10.2 Success Criteria

**After 48-72 hours, verify:**
- ✅ No errors in Render logs
- ✅ All emails delivering successfully
- ✅ Quote wizard working smoothly
- ✅ Payment links created successfully
- ✅ Blog pages loading with SEO
- ✅ Mobile responsiveness confirmed
- ✅ No customer complaints

**If all criteria met, proceed to STEP 11 (Decommission old services).**

---

### STEP 11: Decommission Old Services (10 minutes)

#### 11.1 Suspend Old Services (NOT delete)

**Navigate to:** Dashboard → Old Service

**For EACH V2.0 service:**
1. Click service name
2. Go to "Settings"
3. Scroll to "Suspend Service"
4. Click "Suspend"
5. Confirm

**Services to suspend:**
- [ ] Old frontend service
- [ ] Old backend service
- [ ] Any other V2.0 services

**Why suspend instead of delete?**
- Allows quick rollback if needed
- Can review logs later if issues arise
- No charges while suspended

#### 11.2 Wait Another 7 Days

**Monitor V3.0 for another 7 days while old services are suspended.**

**If no issues arise, proceed to delete old services:**

**Navigate to:** Dashboard → Old Service → Settings

**Scroll to "Delete Service":**
1. Type service name to confirm
2. Click "Delete"
3. Repeat for all old services

---

## 🚨 ROLLBACK PROCEDURE

### If Something Goes Wrong

#### Immediate Rollback (Within 24 hours):

**1. Revert DNS:**
```
# Change DNS back to old Render services
movedin.ca → OLD_FRONTEND_URL
www.movedin.ca → OLD_FRONTEND_URL
```

**2. Resume Old Services:**
- Dashboard → Old Service → Settings → Resume

**3. Investigate Issue:**
- Check Render logs
- Check browser console
- Test specific endpoint

#### Partial Rollback:

**Frontend Only:**
- Keep backend on V3.0
- Revert frontend to V2.0
- Update old frontend API URL to new backend

**Backend Only:**
- Keep frontend on V3.0
- Revert backend to V2.0
- Update frontend `VITE_API_URL` to old backend

---

## ✅ FINAL CHECKLIST

### Pre-Migration
- [ ] Extracted all environment variables from old Render services
- [ ] Documented current DNS records
- [ ] Listed all old Render services to retire
- [ ] Tested V3.0 locally with Docker

### Deployment
- [ ] Pushed V3.0 to GitHub
- [ ] Created Render services via Blueprint
- [ ] Configured backend environment variables
- [ ] Configured frontend environment variables
- [ ] Both services deployed successfully
- [ ] Health endpoints responding

### DNS & Domain
- [ ] Added custom domains to Render
- [ ] Updated DNS A/CNAME records
- [ ] DNS propagated (checked with dnschecker.org)
- [ ] SSL certificate issued (HTTPS working)

### Stripe
- [ ] Updated Stripe webhook URL
- [ ] Updated webhook secret in Render
- [ ] Webhook tested (or will be tested on first payment)

### Testing
- [ ] Homepage loads on https://movedin.ca
- [ ] Quote wizard completes full flow
- [ ] Vendor quotes displayed correctly
- [ ] Payment link created (Stripe LIVE mode)
- [ ] Email delivery tested (all 3 emails)
- [ ] Blog pages load with SEO meta tags
- [ ] Mobile responsiveness verified
- [ ] Lighthouse audit passed (70+ performance, 90+ SEO)
- [ ] Sitemap submitted to Google Search Console

### Monitoring
- [ ] Render notifications enabled
- [ ] UptimeRobot configured (optional)
- [ ] Monitoring logs daily for 48-72 hours

### Decommission
- [ ] Waited 48-72 hours after deployment
- [ ] No errors in Render logs
- [ ] No customer complaints
- [ ] Suspended old V2.0 services
- [ ] Waited 7 more days
- [ ] Deleted old V2.0 services (after confirmation)

---

## 🎉 MIGRATION COMPLETE!

**Congratulations! MovedIn V3.0 is now live in production!**

**What's Next:**
1. Monitor performance for the first month
2. Collect user feedback
3. Create remaining 9 blog posts (Blogs #2-10)
4. Implement any additional features
5. Scale up Render plans if needed (based on traffic)

**Support:**
- Primary: udi.shkolnik@alicesolutions.com
- Render Dashboard: https://dashboard.render.com
- Stripe Dashboard: https://dashboard.stripe.com

---

**Estimated Total Time:** 2-3 hours (including DNS propagation)  
**Complexity:** Moderate (follow steps carefully)  
**Risk:** Low (rollback plan in place)

**Let's make it happen! 🚀**


