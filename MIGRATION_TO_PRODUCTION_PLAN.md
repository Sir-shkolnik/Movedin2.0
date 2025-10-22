# 🚀 MovedIn V3.0 Production Migration Plan

**Date:** October 22, 2025  
**Status:** Ready to Execute  
**Objective:** Completely replace MovedIn 2.0 with MovedIn V3.0 on production

---

## 📋 Current State Assessment

### ✅ MovedIn V3.0 (Ready to Deploy)
- **Location:** `/MovedinV3.0`
- **Frontend:** React + Vite + Nginx (Dockerized)
- **Backend:** FastAPI + Python 3.11 (Dockerized)
- **Database:** SQLite with optimization
- **Features:**
  - ✅ Complete quote wizard (6 steps)
  - ✅ 4 vendor integrations with real pricing
  - ✅ 3-email notification system
  - ✅ Stripe payment integration
  - ✅ Mapbox integration
  - ✅ Full SEO implementation
  - ✅ Blog system with schema markup
  - ✅ Docker deployment ready
  - ✅ Security hardened (95% score)
  - ✅ Tested and verified (Lead #104 success)

### 🗑️ MovedIn 2.0 (To Be Retired)
- **Location:** Deleted locally, but still on Render/GitHub
- **Status:** Old codebase, needs complete removal
- **Action:** Extract settings only, then decommission

---

## 🎯 Migration Strategy

### Phase 1: Pre-Migration (Extract & Backup)
**Objective:** Save all critical settings and assets from V2.0 before removal

#### 1.1 Extract Environment Variables
**Action Required:** Manual extraction from Render Dashboard

Navigate to: Render Dashboard → Each Service → Environment Tab

**Variables to Extract:**

```bash
# Email Configuration
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=support@movedin.com
SMTP_PASSWORD=[EXTRACT FROM RENDER]

# Stripe Keys (LIVE MODE)
STRIPE_SECRET_KEY=[EXTRACT FROM RENDER - starts with sk_live_]
STRIPE_PUBLISHABLE_KEY=[EXTRACT FROM RENDER - starts with pk_live_]
STRIPE_WEBHOOK_SECRET=[EXTRACT FROM RENDER - starts with whsec_]

# Mapbox
MAPBOX_ACCESS_TOKEN=[EXTRACT FROM RENDER]

# Other
SECRET_KEY=[EXTRACT FROM RENDER]
DATABASE_URL=[EXTRACT IF CUSTOM]
```

#### 1.2 Extract DNS Configuration
**Action Required:** Document current DNS setup

Navigate to: Your DNS Provider (GoDaddy/Cloudflare/etc.)

**DNS Records to Document:**

```
# A Records
movedin.ca → [Current IP or CNAME]
www.movedin.ca → [Current IP or CNAME]

# Email DNS (SPF/DKIM/DMARC)
@ TXT → v=spf1 include:spf.protection.outlook.com -all
_dmarc TXT → v=DMARC1; p=none; rua=mailto:support@movedin.com
[Any DKIM records]

# Other Records
[Any other custom DNS records]
```

#### 1.3 Backup Static Assets
**Status:** ✅ Already in V3.0

V3.0 already includes:
- ✅ All vendor logos (`/public/logos/`)
- ✅ All truck images (`/public/trucks/`)
- ✅ All UI assets (`/public/assets/`)
- ✅ Favicon (`/public/favicon.ico`, `/public/favicon.svg`)
- ✅ SEO files (`/public/robots.txt`, `/public/sitemap.xml`)

**No additional backup needed.**

#### 1.4 Document Current Render Services
**Action Required:** List all V2.0 services to retire

Navigate to: Render Dashboard → Services

**Services to Identify:**
- [ ] Frontend service name: `_______________`
- [ ] Backend service name: `_______________`
- [ ] Any additional services: `_______________`
- [ ] Custom domains attached: `_______________`

---

### Phase 2: V3.0 Deployment Setup

#### 2.1 Fix Hardcoded API URLs
**Status:** ⚠️ Needs Fix

**Current Issue:**
```javascript
// PaymentStep.jsx line 34
const API_URL = 'http://localhost:8000'; // ❌ Hardcoded
```

**Required Fix:**
```javascript
// Use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

**Files to Update:**
- `/src/frontend/src/components/quote-wizard/steps/PaymentStep.jsx`
- Any other files with hardcoded `localhost:8000`

#### 2.2 Update Render Configuration
**Status:** ✅ Already Configured

V3.0 includes `render.yaml` with:
- ✅ Backend service (Docker + FastAPI)
- ✅ Frontend service (Docker + Nginx)
- ✅ Environment variables template
- ✅ Health checks
- ✅ Auto-deployment on main branch

**No changes needed to `render.yaml`.**

#### 2.3 Create GitHub Repository (if needed)
**Action Required:** Ensure V3.0 is on GitHub

```bash
# If not already on GitHub:
cd /Users/udishkolnik/Downloads/Movedin2.0\ 3/MovedinV3.0
git init
git add .
git commit -m "MovedIn V3.0 - Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/movedin-v3.git
git push -u origin main
```

**Or update existing repository:**
```bash
# If using existing repo, push V3.0 to a new branch first:
git checkout -b movedin-v3
git add .
git commit -m "MovedIn V3.0 - Complete Rewrite"
git push origin movedin-v3
```

---

### Phase 3: Deploy V3.0 to Render

#### 3.1 Create New Render Services
**Action Required:** Set up two new services on Render

**Option A: Use Render Blueprint (Recommended)**
1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect GitHub repository
4. Select `MovedinV3.0` directory
5. Render will read `render.yaml` and create both services automatically

**Option B: Manual Service Creation**
1. Create Backend Service:
   - Type: Web Service
   - Environment: Docker
   - Dockerfile Path: `./src/backend/Dockerfile`
   - Docker Context: `./src/backend`
   - Plan: Starter
   - Region: Oregon (or closest to users)
   - Branch: main
   
2. Create Frontend Service:
   - Type: Web Service
   - Environment: Docker
   - Dockerfile Path: `./src/frontend/Dockerfile`
   - Docker Context: `./src/frontend`
   - Plan: Starter
   - Region: Oregon
   - Branch: main

#### 3.2 Configure Environment Variables
**Action Required:** Add environment variables to BOTH services

**Backend Service Environment Variables:**
```bash
ENVIRONMENT=production
DATABASE_URL=sqlite:///./movedin.db
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=support@movedin.com
SMTP_PASSWORD=[PASTE FROM PHASE 1]
STRIPE_SECRET_KEY=[PASTE FROM PHASE 1 - LIVE KEY]
STRIPE_PUBLISHABLE_KEY=[PASTE FROM PHASE 1 - LIVE KEY]
STRIPE_WEBHOOK_SECRET=[PASTE FROM PHASE 1]
MAPBOX_ACCESS_TOKEN=[PASTE FROM PHASE 1]
SECRET_KEY=[PASTE FROM PHASE 1 or GENERATE NEW]
DEBUG=false
PORT=8000
ALLOWED_ORIGINS=https://movedin.ca,https://www.movedin.ca,https://movedin-frontend.onrender.com
```

**Frontend Service Environment Variables:**
```bash
VITE_API_URL=https://movedin-backend.onrender.com
VITE_ENVIRONMENT=production
PORT=3000
```

⚠️ **IMPORTANT:** Replace `movedin-backend` with actual Render backend service name!

#### 3.3 Deploy Services
**Action Required:** Trigger initial deployment

1. Backend: Click "Manual Deploy" (wait ~3-5 minutes)
2. Frontend: Click "Manual Deploy" (wait ~2-3 minutes)
3. Monitor logs for any errors
4. Verify health endpoints:
   - Backend: `https://movedin-backend.onrender.com/health`
   - Frontend: `https://movedin-frontend.onrender.com/health`

---

### Phase 4: DNS & Domain Configuration

#### 4.1 Add Custom Domains to Render
**Action Required:** Configure custom domains on NEW services

Navigate to: Render Dashboard → Frontend Service → Settings → Custom Domains

**Add Domains:**
- `movedin.ca` (root domain)
- `www.movedin.ca` (www subdomain)

Render will provide DNS instructions:
- A record IP: `216.24.57.1`
- Or CNAME target: `movedin-frontend.onrender.com`

#### 4.2 Update DNS Records
**Action Required:** Point domains to NEW Render services

Navigate to: Your DNS Provider

**DNS Changes:**
```
# Root domain (movedin.ca)
Type: A
Name: @ (or leave blank)
Value: 216.24.57.1
TTL: 300 (5 minutes - for easy rollback)

# WWW subdomain (www.movedin.ca)
Type: CNAME
Name: www
Value: movedin-frontend.onrender.com
TTL: 300

# Keep email DNS unchanged
[Don't modify SPF/DKIM/DMARC records]
```

⚠️ **DNS Propagation:** Can take 5 minutes to 48 hours. Use https://dnschecker.org to monitor.

#### 4.3 Configure SSL
**Action Required:** None (automatic)

Render automatically provisions SSL certificates via Let's Encrypt.
- Wait 2-5 minutes after DNS propagation
- HTTPS will be enabled automatically
- HTTP will redirect to HTTPS

---

### Phase 5: Verification & Testing

#### 5.1 Smoke Tests
**Action Required:** Test critical paths on production URL

1. **Homepage:**
   - Visit: https://movedin.ca
   - Check: Logo, navigation, quote button

2. **Quote Wizard:**
   - Complete full 6-step flow
   - Check: Address autocomplete, vendor quotes, contact form

3. **Payment Flow:**
   - Select vendor and submit contact info
   - Verify: Stripe checkout link opens (LIVE MODE)
   - **Don't complete payment** (unless testing with real card)

4. **Email System:**
   - Complete quote wizard with YOUR email
   - Check inbox for:
     - ✅ Customer confirmation email
     - ✅ Support notification (if support@movedin.com forwards to you)
     - ✅ Vendor notification (if enabled)

5. **Blog/SEO:**
   - Visit: https://movedin.ca/blogs
   - Visit: https://movedin.ca/blog/best-neighbourhoods-families-gta
   - Check: Meta tags, Open Graph, Schema.org (use browser DevTools)

6. **Mobile Responsiveness:**
   - Test on mobile device or Chrome DevTools
   - Check: All steps work on small screens

#### 5.2 SEO Verification
**Action Required:** Submit sitemap to Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property: `movedin.ca`
3. Verify ownership (DNS TXT record or HTML file)
4. Submit sitemap: `https://movedin.ca/sitemap.xml`
5. Request indexing for key pages

#### 5.3 Performance Check
**Action Required:** Run Lighthouse audit

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Run audit on:
   - Homepage: https://movedin.ca
   - Quote page: https://movedin.ca/quote
   - Blog page: https://movedin.ca/blogs

**Target Scores:**
- Performance: 80+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 95+

#### 5.4 Security Headers Check
**Action Required:** Verify security headers

```bash
curl -I https://movedin.ca
```

**Expected Headers:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: ...`
- `Strict-Transport-Security: max-age=31536000`

---

### Phase 6: Stripe Webhook Configuration

#### 6.1 Update Stripe Webhook
**Action Required:** Point webhook to NEW backend

1. Go to: https://dashboard.stripe.com
2. Switch to LIVE mode (top right)
3. Navigate to: Developers → Webhooks
4. Find existing webhook or create new one
5. Update endpoint URL:
   - Old: `https://movedin-backend-v2.onrender.com/api/payment/webhook`
   - New: `https://movedin-backend.onrender.com/api/payment/webhook`
6. Select events: `checkout.session.completed`
7. Copy webhook secret (starts with `whsec_`)
8. Update Render backend environment variable: `STRIPE_WEBHOOK_SECRET`

---

### Phase 7: Monitor & Stabilize

#### 7.1 Monitoring (First 24-48 Hours)
**Action Required:** Watch for errors

**Render Dashboard:**
- Check logs for both services every 2-4 hours
- Look for: 500 errors, failed requests, memory issues

**Email Inbox:**
- Verify customer emails are being sent
- Check spam folder
- Monitor support@movedin.com for test leads

**Analytics:**
- Google Analytics (if installed)
- Stripe Dashboard for payment attempts

#### 7.2 Set Up Alerts
**Action Required:** Configure uptime monitoring

**Option 1: UptimeRobot (Free)**
1. Go to: https://uptimerobot.com
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://movedin.ca/health` (frontend)
   - Interval: 5 minutes
3. Add monitor:
   - Type: HTTP(s)
   - URL: `https://movedin-backend.onrender.com/health`
   - Interval: 5 minutes
4. Set alert email: `udi.shkolnik@alicesolutions.com`

**Option 2: Render Built-in Monitoring**
- Enable email notifications in Render Dashboard
- Set threshold: 3 failures in 15 minutes

---

### Phase 8: Decommission V2.0

#### 8.1 Pause Old Services (48-72 Hours Wait)
**Action Required:** AFTER V3.0 is stable for 48-72 hours

Navigate to: Render Dashboard → Old Services

**For Each V2.0 Service:**
1. Click service name
2. Go to Settings
3. Click "Suspend" (NOT delete)
4. Confirm suspension

**Why wait?**
- Allows rollback if critical issues found
- Ensures DNS has fully propagated
- Verifies all email/payment flows working

#### 8.2 Remove Old Webhooks/Integrations
**Action Required:** Clean up old integrations

**Stripe:**
- Disable/delete old webhook endpoints

**Google Search Console:**
- Verify sitemap is updated
- Check for crawl errors

**Email Provider:**
- Remove any old SMTP configurations (if applicable)

#### 8.3 Delete Old Services (After Verification)
**Action Required:** ONLY after 7 days of stable V3.0 operation

Navigate to: Render Dashboard → Old Services

**For Each V2.0 Service:**
1. Click service name
2. Go to Settings
3. Scroll to "Danger Zone"
4. Click "Delete Service"
5. Type service name to confirm
6. Confirm deletion

**Archive Old Repository (Optional):**
```bash
# If V2.0 is in a separate repo:
# 1. Create a final commit
git checkout movedin-v2-branch
git add .
git commit -m "ARCHIVED: MovedIn 2.0 - Replaced by V3.0 on [DATE]"
git push origin movedin-v2-branch

# 2. Create archive branch
git branch archive/movedin-v2 movedin-v2-branch
git push origin archive/movedin-v2

# 3. Delete old branch (optional)
git push origin --delete movedin-v2-branch
```

---

## 📊 Migration Checklist

### Phase 1: Pre-Migration ☐
- [ ] Extract SMTP_PASSWORD from Render
- [ ] Extract STRIPE_SECRET_KEY (LIVE)
- [ ] Extract STRIPE_PUBLISHABLE_KEY (LIVE)
- [ ] Extract STRIPE_WEBHOOK_SECRET
- [ ] Extract MAPBOX_ACCESS_TOKEN
- [ ] Document current DNS records
- [ ] List all V2.0 Render services to retire

### Phase 2: V3.0 Setup ☐
- [ ] Fix hardcoded API URLs in PaymentStep.jsx
- [ ] Commit and push V3.0 to GitHub
- [ ] Verify all static assets in place

### Phase 3: Deploy V3.0 ☐
- [ ] Create new Render services (backend + frontend)
- [ ] Configure backend environment variables
- [ ] Configure frontend environment variables
- [ ] Deploy backend service
- [ ] Deploy frontend service
- [ ] Verify health endpoints

### Phase 4: DNS & Domain ☐
- [ ] Add custom domains to Render (movedin.ca, www.movedin.ca)
- [ ] Update DNS A/CNAME records
- [ ] Wait for DNS propagation (check dnschecker.org)
- [ ] Verify SSL certificate issued

### Phase 5: Testing ☐
- [ ] Test homepage
- [ ] Test quote wizard (full flow)
- [ ] Test payment link creation (Stripe LIVE mode)
- [ ] Test email delivery (all 3 emails)
- [ ] Test blog pages and SEO
- [ ] Test mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Verify security headers
- [ ] Submit sitemap to Google Search Console

### Phase 6: Stripe ☐
- [ ] Update webhook URL in Stripe
- [ ] Update STRIPE_WEBHOOK_SECRET in Render
- [ ] Test webhook with test payment

### Phase 7: Monitor ☐
- [ ] Set up UptimeRobot monitoring
- [ ] Enable Render email alerts
- [ ] Monitor logs for 24-48 hours
- [ ] Check email delivery
- [ ] Monitor Stripe Dashboard

### Phase 8: Decommission ☐
- [ ] WAIT 48-72 hours for stability
- [ ] Suspend old V2.0 services (not delete)
- [ ] Remove old webhooks
- [ ] WAIT 7 days
- [ ] Delete old V2.0 services
- [ ] Archive old repository (optional)

---

## 🚨 Rollback Plan

If something goes wrong during migration:

### Immediate Rollback (Within 24 hours)
1. **DNS Revert:**
   - Change DNS A/CNAME records back to old V2.0 Render services
   - Wait 5-10 minutes for propagation

2. **Resume Old Services:**
   - Go to Render → Old Services → Settings → Resume

3. **Investigate Issue:**
   - Check Render logs for errors
   - Check browser console for frontend errors
   - Test specific failing endpoint

### Partial Rollback (After 24 hours)
1. **Keep New Frontend:**
   - If only backend issues, keep frontend on V3.0
   - Revert backend to V2.0
   - Update frontend `VITE_API_URL` to old backend

2. **Or Keep New Backend:**
   - If only frontend issues, keep backend on V3.0
   - Revert frontend to V2.0
   - Update old frontend API URL to new backend

---

## 📞 Emergency Contacts

- **Primary:** udi.shkolnik@alicesolutions.com
- **Support Email:** support@movedin.com
- **Render Dashboard:** https://dashboard.render.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **DNS Provider:** [Your DNS provider dashboard URL]

---

## 🎉 Success Criteria

Migration is complete when:
- ✅ movedin.ca loads V3.0 homepage
- ✅ Quote wizard completes full flow
- ✅ Emails sent successfully (all 3)
- ✅ Stripe payment links created (LIVE mode)
- ✅ Blog pages load with SEO meta tags
- ✅ Mobile responsiveness verified
- ✅ Lighthouse scores: 80+ Performance, 90+ SEO
- ✅ No errors in Render logs for 24 hours
- ✅ Old V2.0 services suspended/deleted
- ✅ Uptime monitoring active

---

**Let's do this! 🚀**


