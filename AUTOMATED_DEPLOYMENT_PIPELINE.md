# 🔄 **AUTOMATED DEPLOYMENT PIPELINE GUIDE**

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Git Workflow](#git-workflow)
3. [Render Integration](#render-integration)
4. [Automated Deployment Process](#automated-deployment-process)
5. [Environment Management](#environment-management)
6. [Monitoring & Debugging](#monitoring--debugging)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 **Overview**

### **What is This Pipeline?**
This is a **fully automated deployment pipeline** that connects your local development environment to production on Render through Git. Every code change automatically triggers a deployment, ensuring your application is always up-to-date.

### **Pipeline Components**
```
Local Development → Git Repository → Render → Production
     ↓                    ↓              ↓         ↓
   Code Changes    →   Push to Main  →  Auto-Deploy → Live App
```

---

## 🔄 **Git Workflow**

### **1. Local Development Workflow**
```bash
# 1. Make code changes locally
# 2. Test changes
# 3. Stage changes
git add .

# 4. Commit with descriptive message
git commit -m "Fix vendor logo 404 errors: rename files to clean names and update paths"

# 5. Push to trigger deployment
git push origin main
```

### **2. Branch Strategy**
```bash
# Main branch (production)
main

# Feature branches (development)
feature/new-feature
bugfix/logo-issues
hotfix/cors-fix
```

### **3. Commit Message Convention**
```bash
# Format: <type>: <description>
git commit -m "fix: resolve CORS configuration issues"
git commit -m "feat: add vendor logo management"
git commit -m "docs: update deployment guide"
git commit -m "refactor: improve database connection handling"
```

### **4. Git Hooks (Optional)**
```bash
# Pre-commit hooks for code quality
# .git/hooks/pre-commit
#!/bin/bash
npm run lint  # Frontend linting
python -m flake8 backend/  # Backend linting
```

---

## ☁️ **Render Integration**

### **1. Render Blueprint (render.yaml)**
```yaml
# Infrastructure as Code
databases:
  - name: movedin-database
    databaseName: movedin
    user: movedin
    plan: basic-256mb

services:
  # Backend API
  - type: web
    name: movedin-backend
    runtime: docker
    plan: starter
    dockerfilePath: Dockerfile.backend
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: movedin-database
          property: connectionString
      - key: ALLOWED_ORIGINS
        value: "https://movedin-frontend.onrender.com,http://localhost:5173"

  # Frontend
  - type: web
    name: movedin-frontend
    runtime: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://movedin-backend.onrender.com
```

### **2. Auto-Deploy Configuration**
```yaml
# Automatic deployment settings
- name: movedin-backend
  autoDeploy: true  # Deploy on every push
  branch: main      # Deploy from main branch
  buildFilter:
    paths:
      - backend/**   # Only deploy if backend changes
      - render.yaml  # Or if config changes

- name: movedin-frontend
  autoDeploy: true
  branch: main
  buildFilter:
    paths:
      - frontend/**  # Only deploy if frontend changes
      - render.yaml
```

### **3. Environment Variables**
```bash
# Backend Environment Variables
DATABASE_URL=postgresql://user:pass@host/db
REDIS_URL=redis://user:pass@host:port
DEBUG=false
ALLOWED_ORIGINS=https://movedin-frontend.onrender.com,http://localhost:5173

# Frontend Environment Variables
VITE_API_URL=https://movedin-backend.onrender.com
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic3VwcG9ydG1vdmVkaW4iLCJhIjoiY21kZmdxdHh6MGQ2aDJqcHE2YTIwbTFrMiJ9.I1xkq82JXLMlgB02xT8LMw
```

---

## 🚀 **Automated Deployment Process**

### **1. Trigger Flow**
```
Code Change → Git Push → Render Webhook → Build → Deploy → Health Check
```

### **2. Detailed Process**

#### **Step 1: Code Change Detection**
```bash
# When you push to main branch
git push origin main

# Render receives webhook notification
# Checks if changes affect this service
# Triggers deployment if relevant files changed
```

#### **Step 2: Build Process**
```bash
# Backend Build
1. Clone repository
2. Build Docker image from Dockerfile.backend
3. Install Python dependencies
4. Copy application code
5. Create production image

# Frontend Build
1. Clone repository
2. Install Node.js dependencies
3. Run build command: npm run build
4. Generate static files in frontend/dist
```

#### **Step 3: Deployment**
```bash
# Backend Deployment
1. Stop existing container
2. Start new container with new image
3. Health check: curl /health
4. Route traffic to new container

# Frontend Deployment
1. Upload static files to CDN
2. Update DNS/routing
3. Serve new version
```

#### **Step 4: Health Checks**
```bash
# Automatic health monitoring
curl https://movedin-backend.onrender.com/health
# Expected: {"status": "healthy", "version": "2.0"}

# If health check fails
1. Rollback to previous version
2. Send notification
3. Log error details
```

### **3. Deployment Timeline**
```
0s    - Git push completed
10s   - Render receives webhook
30s   - Build starts
2m    - Backend build completes
3m    - Frontend build completes
4m    - Deployment starts
5m    - Health checks pass
6m    - New version live
```

---

## 🔧 **Environment Management**

### **1. Environment Separation**
```bash
# Development (Local)
DATABASE_URL=postgresql://movedin:movedin@localhost:5432/movedin
DEBUG=true
ALLOWED_ORIGINS=http://localhost:5173

# Production (Render)
DATABASE_URL=postgresql://user:pass@host/db
DEBUG=false
ALLOWED_ORIGINS=https://movedin-frontend.onrender.com,http://localhost:5173
```

### **2. Configuration Files**
```bash
# Local Development
.env                    # Local environment variables
docker-compose.yml      # Local services
docker-compose.prod.yml # Production-like local testing

# Production
render.yaml             # Render infrastructure
Dockerfile.backend      # Backend container
frontend/package.json   # Frontend dependencies
```

### **3. Secret Management**
```bash
# Sensitive data in Render
ZOHO_CLIENT_ID=sync: false      # Manual entry required
ZOHO_CLIENT_SECRET=sync: false  # Not in code
VITE_MAPBOX_ACCESS_TOKEN=sync: false  # User provides
```

---

## 📊 **Monitoring & Debugging**

### **1. Deployment Monitoring**
```bash
# Check deployment status
render logs movedin-backend
render logs movedin-frontend

# Monitor in real-time
render logs movedin-backend --follow
```

### **2. Health Monitoring**
```bash
# Backend health
curl https://movedin-backend.onrender.com/health

# Frontend availability
curl -I https://movedin-frontend.onrender.com

# Database connectivity
render logs movedin-database
```

### **3. Performance Monitoring**
```bash
# Check service metrics
render metrics movedin-backend
render metrics movedin-frontend

# Monitor resource usage
render logs movedin-backend | grep -E "(memory|cpu|disk)"
```

### **4. Error Tracking**
```bash
# View recent errors
render logs movedin-backend --level error

# Check build failures
render logs movedin-frontend --level error

# Monitor API errors
curl https://movedin-backend.onrender.com/health
```

---

## 🛠️ **Best Practices**

### **1. Code Quality**
```bash
# Pre-deployment checks
npm run lint          # Frontend linting
npm run test          # Frontend tests
python -m flake8      # Backend linting
python -m pytest      # Backend tests
```

### **2. Commit Strategy**
```bash
# Small, focused commits
git commit -m "fix: resolve CORS issue in production"

# Descriptive commit messages
git commit -m "feat: add vendor logo management to admin panel"

# Test before pushing
npm run build         # Ensure build works
docker build -f Dockerfile.backend .  # Test backend build
```

### **3. Environment Variables**
```bash
# Never commit secrets
echo "*.env" >> .gitignore
echo "secrets/" >> .gitignore

# Use environment-specific configs
# .env.development
# .env.production
# .env.test
```

### **4. Rollback Strategy**
```bash
# Quick rollback if needed
git revert HEAD       # Revert last commit
git push origin main  # Trigger rollback deployment

# Or use Render's rollback feature
# Dashboard → Service → Deployments → Rollback
```

---

## 🔍 **Troubleshooting**

### **1. Common Issues**

#### **Build Failures**
```bash
# Check build logs
render logs movedin-backend --level error

# Common causes:
- Missing dependencies
- Syntax errors
- Environment variable issues
- Docker build context problems
```

#### **Deployment Failures**
```bash
# Check deployment logs
render logs movedin-backend

# Common causes:
- Health check failures
- Port conflicts
- Database connection issues
- Environment variable parsing errors
```

#### **Runtime Errors**
```bash
# Check application logs
render logs movedin-backend --follow

# Common causes:
- CORS configuration issues
- Database connection problems
- Missing environment variables
- Import errors
```

### **2. Debug Commands**
```bash
# SSH into services
render shell movedin-backend
render shell movedin-database

# Check environment
env | grep -E "(DATABASE|REDIS|ALLOWED)"

# Test endpoints
curl -v https://movedin-backend.onrender.com/health
curl -v https://movedin-frontend.onrender.com
```

### **3. Emergency Procedures**
```bash
# Immediate rollback
git revert HEAD
git push origin main

# Manual deployment
render deploy movedin-backend
render deploy movedin-frontend

# Check service status
render status movedin-backend
render status movedin-frontend
```

---

## 📈 **Pipeline Benefits**

### **1. Automation Benefits**
- **Zero downtime deployments**
- **Automatic rollbacks** on failure
- **Consistent environments** across dev/prod
- **Faster iteration cycles**

### **2. Quality Assurance**
- **Automated testing** before deployment
- **Health checks** after deployment
- **Performance monitoring** in production
- **Error tracking** and alerting

### **3. Team Collaboration**
- **Shared deployment process**
- **Version control** for infrastructure
- **Environment consistency**
- **Easy onboarding** for new developers

---

## 🎯 **Quick Reference**

### **Daily Workflow**
```bash
# 1. Make changes
# 2. Test locally
npm run dev          # Frontend
docker-compose up    # Backend

# 3. Commit and push
git add .
git commit -m "descriptive message"
git push origin main

# 4. Monitor deployment
render logs movedin-backend --follow
```

### **Emergency Commands**
```bash
# Rollback deployment
git revert HEAD && git push origin main

# Check service status
render status movedin-backend

# View recent logs
render logs movedin-backend --level error
```

### **Useful URLs**
- **Frontend**: https://movedin-frontend.onrender.com
- **Backend**: https://movedin-backend.onrender.com
- **Admin**: https://movedin-frontend.onrender.com/admin
- **API Docs**: https://movedin-backend.onrender.com/docs
- **Health Check**: https://movedin-backend.onrender.com/health

---

## 🎉 **Summary**

This automated deployment pipeline provides:

✅ **Seamless Development**: Code → Git → Production  
✅ **Zero Downtime**: Automatic deployments with health checks  
✅ **Quality Assurance**: Automated testing and monitoring  
✅ **Easy Rollbacks**: Quick recovery from issues  
✅ **Team Collaboration**: Shared, consistent process  
✅ **Production Reliability**: Robust, monitored infrastructure  

**The pipeline ensures your MovedIn 2.0 platform is always up-to-date, reliable, and ready for customers!** 🚀 