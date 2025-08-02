# 🔑 **RENDER SSH SETUP GUIDE - DIRECT CONNECTION**

## 📋 **Overview**
This guide provides SSH access to your Render services for direct debugging and troubleshooting of the MovedIn 2.0 backend deployment.

## 🔑 **SSH Key Information**

### **Key Details**
- **Key Name**: `Movedin2.0_cursorAI`
- **Type**: RSA 4096-bit
- **Purpose**: Direct access to Render services for debugging
- **Generated**: August 2, 2025

### **Public Key**
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDlH2gG9mvgcbTNLyh0Rr/M7YFhBcXtM4NaZ6uJSAfviRApx42gVyNnN4e/Dg6jum4A0etb4N04Z1kiQ/YeLmSYGuniimzV4wXIQlr4/O5ja0I7Ubqp5XA4Bb6cJOa0dep5Z05MEAbYmUBjiXDwyHB1DgjW4rfV4SKWx7hPxqCW4mo2G85N1pCk/SmOoVvI8UYHOrCsbNEmLIIDuRydik30/l8F8P0gcs6fKH241i7tVGTU8mcEXjjqFZOPzVhPdT9P9xbxDW5GvW7jy8ENrgbBTnsFoB6SC3p5vzKADOSC4/gkNGrVD26dQgMLwkpJF5Bs1lKVEcsGwbs8vf//2JUkHSEA/57d38K1Gw/AiNm4HOCOtYSvemAgfL6gSZJvSX0orqWZZwAmwHzVhw/fvyR5q/GBwwuZGYvoi2eEfeRVfOJLRAuAlSVzlR2Pjl3cfYnf2WesQjfO3bER+vdSGfs1HscMZHncUv+JMVKmJOoiM2LzatbLZOaoU5hL4FhrTfj0Mf9OThyf3XCB7jyQkQnz6KxnuFEGuSFDGg7P8tDJ7KsitxN7JagEOA08YfcIiyy306zJwGAoGFIxgAcNar+uJdkZIfvxRaIEjITS6eFkpYt04TBCTc7847YyEl+GPOB8050j3KZzVzXlqdpzHrBou2BEzD0WLcPdUKn3z4witQ== movedin2.0@render.com
```

### **File Locations**
- **Private Key**: `~/.ssh/render_movedin`
- **Public Key**: `~/.ssh/render_movedin.pub`

## 🚀 **Setup Instructions**

### **Step 1: Add SSH Key to Render**
1. **Go to Render Dashboard**
2. **Navigate to**: Settings → SSH Public Keys
3. **Click**: "+ Add SSH Public Key"
4. **Fill in the modal**:
   - **Name**: `Movedin2.0_cursorAI`
   - **Key**: Paste the entire public key above
5. **Click**: "Add SSH Public Key"

### **Step 2: Connect to Backend Service**
```bash
# Connect to the backend service
ssh -i ~/.ssh/render_movedin srv-d26qr1muk2gs73cb4ak0@ssh.render.com
```

### **Step 3: Connect to Database Service**
```bash
# Connect to the PostgreSQL database
ssh -i ~/.ssh/render_movedin pserv-movedin-database@ssh.render.com
```

## 🔍 **Debugging Commands**

### **Backend Service Debugging**
Once connected to the backend service:

#### **Environment Check**
```bash
# Check environment variables
env | grep DATABASE
env | grep REDIS
env | grep ZOHO
env | grep DEBUG

# Check if Python can import modules
python -c "from app.core.database import engine; print('Database engine OK')"
python -c "from app.core.config import settings; print('Config OK')"
python -c "import uvicorn; print('Uvicorn OK')"
```

#### **Application Logs**
```bash
# Check application logs
tail -f /var/log/app.log
tail -f /var/log/uvicorn.log

# Check system logs
journalctl -u movedin-backend -f
```

#### **Process Monitoring**
```bash
# Check running processes
ps aux | grep uvicorn
ps aux | grep python

# Check port usage
netstat -tlnp | grep 8000
lsof -i :8000
```

#### **File System Check**
```bash
# Check application files
ls -la /app/
ls -la /app/app/core/
cat /app/app/core/database.py
cat /app/app/core/config.py
```

### **Database Service Debugging**
Once connected to the database service:

#### **Database Connection**
```bash
# Connect to PostgreSQL
psql -U movedin -d movedin

# Check database status
pg_isready -U movedin -d movedin

# List databases
psql -U movedin -l
```

#### **Database Tables**
```sql
-- Check if tables exist
\dt

-- Check table structure
\d leads
\d quotes
\d vendors

-- Check data
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM quotes;
SELECT COUNT(*) FROM vendors;
```

## 🛠️ **Troubleshooting Commands**

### **Common Issues**

#### **Import Errors**
```bash
# Test Python imports
python -c "import sys; print(sys.path)"
python -c "from app.core.database import engine"
python -c "from app.api.routes import admin"
```

#### **Database Connection Issues**
```bash
# Test database connection
python -c "
from app.core.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text('SELECT 1'))
    print('Database connection OK')
"
```

#### **Environment Variable Issues**
```bash
# Check all environment variables
env | sort

# Check specific variables
echo "DATABASE_URL: $DATABASE_URL"
echo "REDIS_URL: $REDIS_URL"
echo "DEBUG: $DEBUG"
```

#### **Application Startup Issues**
```bash
# Try starting the application manually
cd /app
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Check for syntax errors
python -m py_compile main.py
python -m py_compile app/core/database.py
python -m py_compile app/core/config.py
```

## 📊 **Service Information**

### **Backend Service**
- **Service ID**: `srv-d26qr1muk2gs73cb4ak0`
- **Type**: Web Service (Docker)
- **Plan**: Starter
- **URL**: `https://movedin-backend.onrender.com`

### **Database Service**
- **Service ID**: `pserv-movedin-database`
- **Type**: PostgreSQL
- **Plan**: Basic-256mb
- **Database**: `movedin`

### **Redis Service**
- **Service ID**: `keyvalue-movedin-redis`
- **Type**: Key Value (Redis)
- **Plan**: Starter

### **Frontend Service**
- **Service ID**: `static-movedin-frontend`
- **Type**: Static Site
- **URL**: `https://movedin-frontend.onrender.com`

## 🔒 **Security Notes**

### **SSH Key Security**
- **Keep private key secure**: Never share `~/.ssh/render_movedin`
- **Use specific key**: This key is only for Render services
- **Monitor access**: Check Render logs for SSH connections

### **Connection Security**
- **Temporary access**: SSH access is for debugging only
- **Limited permissions**: SSH users have restricted access
- **Audit trail**: All SSH connections are logged

## 📝 **Usage Examples**

### **Quick Health Check**
```bash
# Connect and check health
ssh -i ~/.ssh/render_movedin srv-d26qr1muk2gs73cb4ak0@ssh.render.com << 'EOF'
echo "=== Environment Check ==="
env | grep -E "(DATABASE|REDIS|DEBUG)" | sort
echo "=== Process Check ==="
ps aux | grep -E "(uvicorn|python)" | grep -v grep
echo "=== Port Check ==="
netstat -tlnp | grep 8000
EOF
```

### **Database Health Check**
```bash
# Connect and check database
ssh -i ~/.ssh/render_movedin pserv-movedin-database@ssh.render.com << 'EOF'
echo "=== Database Status ==="
pg_isready -U movedin -d movedin
echo "=== Table Counts ==="
psql -U movedin -d movedin -c "SELECT 'leads' as table_name, COUNT(*) as count FROM leads UNION ALL SELECT 'quotes', COUNT(*) FROM quotes UNION ALL SELECT 'vendors', COUNT(*) FROM vendors;"
EOF
```

---

**🎯 Use this guide to connect directly to your Render services and debug deployment issues!**

**This provides complete visibility into your MovedIn 2.0 deployment!** 🚀 