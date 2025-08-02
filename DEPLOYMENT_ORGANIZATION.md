# 🚀 MovedIn 2.0 Deployment Organization Guide

## 📋 Project Overview

This guide organizes the MovedIn 2.0 project for deployment to Render and other cloud platforms. The project includes:

- **Backend**: FastAPI Python application with PostgreSQL and Redis
- **Frontend**: React 18 + TypeScript with Vite
- **Database**: PostgreSQL with real data (12 leads, 9 quotes, 4 vendors)
- **Cache**: Redis for session and data caching
- **Admin Panel**: Complete management interface with database monitoring

## 🏗️ Project Structure

```
Archive/
├── backend/                    # FastAPI Backend
│   ├── app/                   # Application code
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container
│   └── main.py              # Application entry point
├── frontend/                  # React Frontend
│   ├── src/                  # Source code
│   ├── package.json          # Node.js dependencies
│   ├── Dockerfile            # Frontend container
│   └── nginx.conf           # Nginx configuration
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml   # Production environment
├── render.yaml               # Render deployment config
├── deploy.sh                 # Deployment script
├── env.production            # Production environment variables
└── README.md                # Project documentation
```

## 🚀 Deployment Options

### 1. Render Deployment (Recommended)

#### Prerequisites
- GitHub repository with the project
- Render account (free tier available)

#### Steps
1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Deploy to Render"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will use `render.yaml` for configuration

3. **Environment Variables**
   - Set production environment variables in Render dashboard
   - Update `VITE_API_URL` to your backend URL
   - Configure Mapbox token and Zoho credentials

#### Render Services Created
- **movedin-backend**: Python web service
- **movedin-frontend**: Static site
- **movedin-database**: PostgreSQL database
- **movedin-redis**: Redis cache

### 2. Local Production Deployment

#### Using Docker Compose
```bash
# Setup environment
cp env.production .env
# Edit .env with your values

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
./deploy.sh status
```

#### Using Deployment Script
```bash
# Make script executable
chmod +x deploy.sh

# Start production environment
./deploy.sh start

# Check status
./deploy.sh status

# Stop services
./deploy.sh stop
```

### 3. Manual Deployment

#### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend Deployment
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with any web server
```

## 🔧 Configuration Files

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
DEBUG=false
ZOHO_CLIENT_ID=your-client-id
ZOHO_CLIENT_SECRET=your-client-secret
```

#### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-url.com
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

### Docker Configuration

#### Development (docker-compose.yml)
- Hot reload enabled
- Volume mounts for development
- Debug mode enabled

#### Production (docker-compose.prod.yml)
- Optimized builds
- Health checks
- Restart policies
- SSL ready

## 📊 System Health Monitoring

### Health Endpoints
- **Backend**: `GET /health`
- **Database**: `GET /admin/database/health`
- **Vendors**: `GET /vendors/live-status`

### Monitoring Dashboard
- **Admin Panel**: `/admin` (Database Management, System Monitoring)
- **Real-time Data**: All endpoints return live database data

## 🔒 Security Considerations

### Production Security
1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Enable SSL/TLS in production
3. **Database**: Use strong passwords and restrict access
4. **API Keys**: Rotate Mapbox and Zoho tokens regularly

### Security Checklist
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Database access restricted
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation enabled

## 📈 Performance Optimization

### Backend Optimization
- **Database**: Indexes on frequently queried columns
- **Caching**: Redis for session and data caching
- **Connection Pooling**: Database connection optimization

### Frontend Optimization
- **Build**: Production build with minification
- **CDN**: Static assets served from CDN
- **Caching**: Browser caching headers

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs
docker-compose logs backend

# Check database connection
curl http://localhost:8000/health

# Check environment variables
docker-compose exec backend env
```

#### Frontend Build Fails
```bash
# Clear node_modules
rm -rf frontend/node_modules
npm install

# Check TypeScript errors
npm run lint

# Check build
npm run build
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec postgres pg_isready

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec backend python -c "
import psycopg2
conn = psycopg2.connect('postgresql://movedin:movedin@postgres:5432/movedin')
print('Connected successfully')
"
```

### Debug Commands
```bash
# Check all services
./deploy.sh status

# View logs
docker-compose logs -f

# Restart services
./deploy.sh restart

# Clean up
./deploy.sh cleanup
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates ready
- [ ] Domain DNS configured

### Deployment
- [ ] Code pushed to repository
- [ ] Render services created
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Health checks passing

### Post-Deployment
- [ ] Frontend accessible
- [ ] Backend API responding
- [ ] Database connections working
- [ ] Admin panel functional
- [ ] All features tested

## 🎯 Quick Start Commands

```bash
# Development
./deploy.sh start

# Production
docker-compose -f docker-compose.prod.yml up -d

# Render (after pushing to GitHub)
# Use Render dashboard with render.yaml

# Status check
./deploy.sh status

# Cleanup
./deploy.sh cleanup
```

## 📞 Support

### Logs and Monitoring
- **Application Logs**: Docker logs or Render logs
- **Database Logs**: PostgreSQL logs
- **System Monitoring**: Admin panel at `/admin`

### Backup and Recovery
- **Database**: Automatic backups in Render
- **Code**: Git repository
- **Configuration**: Environment variables in Render

---

**🎉 Your MovedIn 2.0 system is now organized and ready for deployment!** 