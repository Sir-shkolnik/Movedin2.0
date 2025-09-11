# 🚀 MovedIn 2.0 - Deployment Guide

**Last Updated:** September 11, 2025  
**Version:** 2.4.1  
**Status:** 🟢 **ACTIVE**

## 📋 **Quick Reference**

### **✅ Safe to Push**
- ✅ Code files: `.tsx`, `.ts`, `.js`, `.py`
- ✅ Configuration: `package.json`, `requirements.txt`, `Dockerfile*`
- ✅ Documentation: `.md` files
- ✅ Assets: Images, icons, CSS in `/frontend/src` and `/frontend/public`
- ✅ Scripts: Build and deployment scripts

### **❌ Never Push**
- ❌ Environment files: `.env*`
- ❌ API keys: `STRIPE_SECRET_KEY`, `SMTP_PASSWORD`, etc.
- ❌ Database files: `.db`, `.sqlite`
- ❌ Logs: `*.log`, `debug_logs/`
- ❌ Dependencies: `node_modules/`, `dist/`, `build/`
- ❌ IDE files: `.vscode/`, `.idea/`
- ❌ OS files: `.DS_Store`, `Thumbs.db`

## 🔧 **Deployment Process**

### **1. Pre-Deployment Checklist**
```bash
# Navigate to project directory
cd /Users/udishkolnik/6/Movedin2.0

# Check git status
git status

# Verify no sensitive files
git diff --name-only | grep -E "\.(env|key|secret|password)"

# Test locally (optional but recommended)
cd frontend && npm run build
cd ../backend && python -m pytest
```

### **2. Commit Changes**
```bash
# Add all changes (respects .gitignore)
git add -A

# Commit with descriptive message
git commit -m "feat: Add new feature description"

# Examples of good commit messages:
# "fix: Resolve Step7 redirect issue"
# "feat: Add favicon and improve homepage layout"
# "docs: Update deployment guide"
# "refactor: Optimize vendor calculations"
```

### **3. Push to GitHub**
```bash
# Push to main branch (triggers Render deployment)
git push origin main
```

### **4. Monitor Deployment**
- **Render Dashboard**: Check deployment status at [render.com](https://render.com)
- **Deployment Time**: ~60 seconds for frontend, ~2-3 minutes for backend
- **Auto-deploy**: Triggered automatically on push to `main` branch

## 🌐 **Live URLs**

### **Frontend**
- **URL**: https://movedin-frontend.onrender.com
- **Admin Panel**: https://movedin-frontend.onrender.com/#/admin
- **Health Check**: Check browser console for errors

### **Backend**
- **API**: https://movedin-backend.onrender.com
- **Health**: https://movedin-backend.onrender.com/health
- **Docs**: https://movedin-backend.onrender.com/docs

## 🧪 **Post-Deployment Testing**

### **Frontend Tests**
```bash
# Test homepage
curl -I https://movedin-frontend.onrender.com

# Test favicon
curl -I https://movedin-frontend.onrender.com/favicon.ico

# Test Step7 redirect
curl -I "https://movedin-frontend.onrender.com/#/step7?session_id=test&lead_id=1"
```

### **Backend Tests**
```bash
# Health check
curl https://movedin-backend.onrender.com/health

# Test payment creation
curl -X POST https://movedin-backend.onrender.com/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "lead_id": 1}'
```

## 🔐 **Authentication**

### **GitHub Access**
- **Repository**: `Sir-shkolnik/Movedin2.0`
- **Collaborator**: `udishkolnik` (has write access)
- **Authentication**: Uses GitHub CLI or SSH keys

### **Render Access**
- **Platform**: Render.com
- **Auto-deploy**: Enabled for `main` branch
- **Environment**: Production secrets configured

## 🚨 **Troubleshooting**

### **Push Failures**
```bash
# Check remote URL
git remote -v

# Verify authentication
git config --list | grep user

# Reset if needed
git remote set-url origin https://github.com/Sir-shkolnik/Movedin2.0.git
```

### **Deployment Failures**
1. **Check Render logs** in dashboard
2. **Verify build commands** in `package.json`
3. **Check environment variables** are set
4. **Test locally** before pushing

### **Common Issues**
- **403 Forbidden**: Check collaborator access
- **Build failures**: Check for syntax errors
- **Environment errors**: Verify all required env vars are set

## 📊 **Deployment History**

| Date | Commit | Changes | Status |
|------|--------|---------|--------|
| Sep 11, 2025 | `ba9ef89` | Auto-detect Stripe redirect to Step7 | ✅ Deployed |
| Sep 11, 2025 | `3ceb6da` | Fix homepage layout, add favicon | ✅ Deployed |
| Sep 11, 2025 | `4bc5b26` | Improve thank you page redirect | ✅ Deployed |

## 📞 **Support**

- **Developer**: Sagi Ehud Shkolnik (AliceSolutions Venture)
- **Repository**: https://github.com/Sir-shkolnik/Movedin2.0
- **Documentation**: See `/DOCUMENTATION` folder
- **Issues**: GitHub Issues for bug reports

---

**Built with ❤️ by Sagi Ehud Shkolnik from AliceSolutions Venture**
