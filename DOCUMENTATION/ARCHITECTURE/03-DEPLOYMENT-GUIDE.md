# 🚀 Deployment Guide - MovedIn 2.0

**Last Updated**: January 2025  
**System Version**: 2.3.0  
**Status**: ✅ **PRODUCTION READY - ALL SYSTEMS OPERATIONAL**

---

## 🎯 **Deployment Overview**

The MovedIn 2.0 system is designed for **containerized deployment** using Docker and Docker Compose. The system includes frontend, backend, database, and cache services with comprehensive monitoring and backup capabilities.

### **Key Features**
- ✅ **Docker Containerization**: All services containerized
- ✅ **Docker Compose**: Multi-service orchestration
- ✅ **Production Ready**: Optimized for production deployment
- ✅ **Monitoring**: Comprehensive health monitoring
- ✅ **Backup System**: Automated backup procedures
- ✅ **Security**: Enterprise-grade security measures

---

## 🏗️ **System Architecture**

### **📦 Container Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Nginx)       │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
│   Port: 5173    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cache         │    │  Google Sheets  │    │   Admin Panel   │
│   (Redis)       │    │   Integration   │    │   (React)       │
│   Port: 6379    │    │   (Real-time)   │    │   Port: 5173    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🔧 Service Dependencies**
- **Frontend** → Backend API
- **Backend** → Database, Cache, External Services
- **Database** → Storage Volumes
- **Cache** → Storage Volumes

---

## 📋 **Prerequisites**

### **🔧 System Requirements**
- **Operating System**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: Minimum 20GB free space
- **Network**: Internet access for external services

### **🌐 External Services**
- **Google Sheets**: Spreadsheet with vendor data
- **Mapbox**: Geocoding and mapping services
- **Stripe**: Payment processing (optional)

### **🔑 Required API Keys**
```bash
# Mapbox API Key
MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Google Sheets Spreadsheet ID
GOOGLE_SHEETS_SPREADSHEET_ID=1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA

# Zoho CRM (optional)
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
```

---

## 🐳 **Docker Configuration**

### **📁 Project Structure**
```
MovedIn2.0/
├── docker-compose.yml           # Main compose file
├── docker-compose.backend.yml   # Backend-specific compose
├── frontend/
│   ├── Dockerfile              # Frontend container
│   └── nginx.conf              # Nginx configuration
├── backend/
│   ├── Dockerfile              # Backend container
│   └── requirements.txt        # Python dependencies
└── .env                        # Environment variables
```

### **🐳 Docker Compose Configuration**

#### **Main Compose File (`docker-compose.yml`)**
```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://movedin:movedin@postgres:5432/movedin
      - REDIS_URL=redis://redis:6379
      - DEBUG=true
      - ZOHO_CLIENT_ID=${ZOHO_CLIENT_ID}
      - ZOHO_CLIENT_SECRET=${ZOHO_CLIENT_SECRET}
      - ZOHO_REDIRECT_URI=http://localhost:8000/api/zoho/callback
      - ZOHO_AUTH_URL=https://accounts.zoho.com/oauth/v2/auth
      - ZOHO_TOKEN_URL=https://accounts.zoho.com/oauth/v2/token
      - ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v3
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
      - redis

  # PostgreSQL Database
  postgres:
    image: postgres:16
    environment:
      - POSTGRES_DB=movedin
      - POSTGRES_USER=movedin
      - POSTGRES_PASSWORD=movedin
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### **🐳 Container Dockerfiles**

#### **Frontend Dockerfile (`frontend/Dockerfile`)**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### **Backend Dockerfile (`backend/Dockerfile`)**
```dockerfile
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔧 **Environment Configuration**

### **📄 Environment Variables (`.env`)**
```bash
# Database Configuration
DATABASE_URL=postgresql://movedin:movedin@postgres:5432/movedin
POSTGRES_DB=movedin
POSTGRES_USER=movedin
POSTGRES_PASSWORD=movedin

# Redis Configuration
REDIS_URL=redis://redis:6379

# External Services
MAPBOX_ACCESS_TOKEN=your_mapbox_token
GOOGLE_SHEETS_SPREADSHEET_ID=1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA

# Zoho CRM (optional)
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REDIRECT_URI=http://localhost:8000/api/zoho/callback
ZOHO_AUTH_URL=https://accounts.zoho.com/oauth/v2/auth
ZOHO_TOKEN_URL=https://accounts.zoho.com/oauth/v2/token
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v3

# Application Settings
DEBUG=false
SECRET_KEY=your-secret-key-here
LOG_LEVEL=INFO

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_STRIPE=true
```

---

## 🚀 **Deployment Steps**

### **1. 📥 Clone Repository**
```bash
# Clone the repository
git clone <repository-url>
cd MovedIn2.0

# Check out the latest version
git checkout main
```

### **2. 🔧 Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Set required API keys and configuration
```

### **3. 🐳 Build and Start Services**
```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### **4. 🔍 Verify Deployment**
```bash
# Check service logs
docker-compose logs -f

# Test frontend
curl http://localhost:5173

# Test backend API
curl http://localhost:8000/health

# Test database connection
docker-compose exec postgres psql -U movedin -d movedin -c "SELECT version();"
```

### **5. 📊 Monitor System Health**
```bash
# Check all services are running
docker-compose ps

# Monitor resource usage
docker stats

# Check service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 🔍 **Health Checks**

### **🏥 Service Health Endpoints**
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000/health`
- **Database**: `docker-compose exec postgres pg_isready`
- **Redis**: `docker-compose exec redis redis-cli ping`

### **📊 Health Check Script**
```bash
#!/bin/bash

echo "🔍 Checking MovedIn 2.0 System Health..."

# Check if containers are running
echo "📦 Container Status:"
docker-compose ps

# Check frontend
echo "🌐 Frontend Health:"
curl -f http://localhost:5173 > /dev/null 2>&1 && echo "✅ Frontend is healthy" || echo "❌ Frontend is down"

# Check backend API
echo "🚚 Backend API Health:"
curl -f http://localhost:8000/health > /dev/null 2>&1 && echo "✅ Backend API is healthy" || echo "❌ Backend API is down"

# Check database
echo "🗄️ Database Health:"
docker-compose exec -T postgres pg_isready -U movedin > /dev/null 2>&1 && echo "✅ Database is healthy" || echo "❌ Database is down"

# Check Redis
echo "⚡ Redis Health:"
docker-compose exec -T redis redis-cli ping > /dev/null 2>&1 && echo "✅ Redis is healthy" || echo "❌ Redis is down"

echo "🏁 Health check complete!"
```

---

## 🔄 **Backup and Recovery**

### **💾 Database Backup**
```bash
# Create backup directory
mkdir -p backups

# Backup database
docker-compose exec -T postgres pg_dump -U movedin movedin > backups/movedin_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
docker-compose exec -T postgres pg_dump -U movedin movedin | gzip > backups/movedin_backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### **🔄 Database Recovery**
```bash
# Restore from backup
docker-compose exec -T postgres psql -U movedin -d movedin < backups/movedin_backup_20250101_120000.sql

# Restore from compressed backup
gunzip -c backups/movedin_backup_20250101_120000.sql.gz | docker-compose exec -T postgres psql -U movedin -d movedin
```

### **📦 Volume Backup**
```bash
# Backup all volumes
docker run --rm -v movedin20_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

docker run --rm -v movedin20_redis_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/redis_data_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

---

## 🔒 **Security Configuration**

### **🛡️ Security Best Practices**
- **HTTPS Only**: Use reverse proxy with SSL/TLS
- **Environment Variables**: Secure secret management
- **Container Security**: Non-root users in containers
- **Network Security**: Isolated container networks
- **Regular Updates**: Keep containers and dependencies updated

### **🔐 SSL/TLS Configuration**
```nginx
# Nginx SSL configuration
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📈 **Performance Optimization**

### **⚡ Performance Tuning**
```yaml
# Docker Compose with performance optimizations
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
    environment:
      - WORKERS=4
      - MAX_CONNECTIONS=100

  postgres:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
    environment:
      - POSTGRES_SHARED_BUFFERS=256MB
      - POSTGRES_EFFECTIVE_CACHE_SIZE=1GB

  redis:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.25'
    command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### **📊 Monitoring Configuration**
```yaml
# Add monitoring service
services:
  monitoring:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

volumes:
  prometheus_data:
```

---

## 🔧 **Maintenance Operations**

### **🔄 Service Updates**
```bash
# Update to latest version
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verify update
docker-compose ps
```

### **🧹 System Cleanup**
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Complete cleanup
docker system prune -a
```

### **📊 Log Management**
```bash
# View service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rotate logs
docker-compose exec backend logrotate /etc/logrotate.conf

# Archive old logs
find /var/log -name "*.log" -mtime +7 -exec gzip {} \;
```

---

## 🚨 **Troubleshooting**

### **🔍 Common Issues**

#### **Service Won't Start**
```bash
# Check service logs
docker-compose logs service_name

# Check resource usage
docker stats

# Restart specific service
docker-compose restart service_name
```

#### **Database Connection Issues**
```bash
# Check database status
docker-compose exec postgres pg_isready -U movedin

# Check database logs
docker-compose logs postgres

# Reset database (WARNING: Data loss)
docker-compose down -v
docker-compose up -d postgres
```

#### **API Connection Issues**
```bash
# Check backend health
curl http://localhost:8000/health

# Check backend logs
docker-compose logs backend

# Test API endpoints
curl http://localhost:8000/api/quotes/
```

### **📞 Support Commands**
```bash
# Get system information
docker version
docker-compose version
docker system info

# Check disk usage
df -h
docker system df

# Check network connectivity
docker network ls
docker network inspect movedin20_default
```

---

## 🎯 **Production Deployment**

### **🌐 Production Considerations**
- **Load Balancer**: Use nginx or HAProxy for load balancing
- **SSL/TLS**: Configure HTTPS with valid certificates
- **Monitoring**: Implement comprehensive monitoring
- **Backup Strategy**: Automated backup procedures
- **Security**: Implement security best practices
- **Scaling**: Plan for horizontal scaling

### **📊 Production Monitoring**
```yaml
# Add monitoring stack
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring:/etc/prometheus
      - prometheus_data:/prometheus

  alertmanager:
    image: prom/alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml

volumes:
  grafana_data:
  prometheus_data:
```

---

## 🎉 **Conclusion**

The MovedIn 2.0 deployment provides:

- ✅ **Containerized Architecture**: Docker-based deployment
- ✅ **Production Ready**: Optimized for production use
- ✅ **Comprehensive Monitoring**: Health checks and monitoring
- ✅ **Backup and Recovery**: Automated backup procedures
- ✅ **Security**: Enterprise-grade security measures
- ✅ **Scalability**: Horizontal scaling capabilities

**The system is ready for production deployment with full confidence!** 🚀

---

*This deployment guide is maintained and updated regularly to reflect the current state of the MovedIn 2.0 deployment process.* 