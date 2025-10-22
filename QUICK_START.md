# MovedIn 3.0 - Quick Start Guide

**Status:** ✅ **FULLY OPERATIONAL**  
**Last Updated:** October 22, 2025

---

## 🚀 **Get Started in 2 Minutes**

### **1. Start the System**
```bash
# Clone and navigate to the project
cd MovedinV3.0

# Start everything with Docker
docker-compose up --build
```

### **2. Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

### **3. Test the Complete Flow**
1. Go to http://localhost:3000/quote
2. Complete the 6-step quote wizard
3. Select a vendor
4. Complete payment (demo mode)
5. Check your email for notifications

---

## ✅ **What's Working**

### **Quote Wizard**
- ✅ Complete 6-step flow
- ✅ Real-time quote calculations
- ✅ 4 vendor pricing options
- ✅ Responsive design (mobile-first)
- ✅ 2-column layouts on desktop

### **Email System**
- ✅ 3-email notification system
- ✅ Beautiful HTML templates
- ✅ Real SMTP delivery
- ✅ Customer, Vendor, Support notifications

### **Payment System**
- ✅ Demo mode with Stripe integration
- ✅ Payment link generation
- ✅ Thank you page redirect
- ✅ Email notifications

### **Recent Test Results**
- ✅ **Lead #104:** Created and processed successfully
- ✅ **Email Delivery:** All 3 emails sent to correct recipients
- ✅ **Quote Generation:** 4 vendor quotes calculated accurately
- ✅ **Payment Flow:** Demo payment link created successfully

---

## 📊 **Sample Quote Results**

**Test Route:** Athens, ON → Port Hope, ON (217.4 km)

- **Pierre & Sons:** $1,259.87 (2 movers, 1 truck)
- **Velocity Movers:** $2,559.12 (2 movers, 1 truck)
- **Let's Get Moving:** $3,704.69 (2 movers, 1 truck)
- **Easy2Go:** $3,310.94 (3 movers, 1 truck)

---

## 📧 **Email Notifications**

When you complete a quote, you'll receive:

1. **Customer Confirmation** (to your email)
   - Beautiful booking confirmation
   - Complete move details
   - Next steps

2. **Vendor Order** (to support@movedin.com)
   - Professional order notification
   - Complete customer details
   - Action items for vendor

3. **Support Alert** (to udi.shkolnik@alicesolutions.com)
   - System monitoring alert
   - Complete lead information
   - System status

---

## 🔧 **System Architecture**

### **Frontend**
- **React 18** with Vite
- **Nginx** for serving
- **Lucide React** icons
- **CSS Grid** layouts
- **Mobile-first** design

### **Backend**
- **FastAPI** with Python 3.11
- **SQLite** database
- **SMTP** email system
- **Security** middleware
- **Health checks**

### **Infrastructure**
- **Docker** containerization
- **Docker Compose** orchestration
- **Bridge networking**
- **Volume persistence**
- **Automated health checks**

---

## 🎯 **Key Features**

### **Smart Quote Calculator**
- Real-time distance calculations
- Multi-leg journey calculations
- Dispatcher location matching
- Accurate pricing algorithms

### **Professional Email System**
- Beautiful HTML templates
- Responsive design
- Professional branding
- Complete lead information

### **Secure & Reliable**
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting
- Security headers

---

## 📋 **Troubleshooting**

### **If Docker won't start:**
```bash
# Clean up and restart
docker-compose down
docker system prune -f
docker-compose up --build
```

### **If emails aren't sending:**
- Check SMTP credentials in docker-compose.yml
- Verify network connectivity
- Check backend logs: `docker-compose logs movedin-backend`

### **If frontend won't load:**
- Check if port 3000 is available
- Verify Docker containers are running
- Check frontend logs: `docker-compose logs movedin-frontend`

---

## 🎉 **Success!**

If you can:
- ✅ Access http://localhost:3000
- ✅ Complete the quote wizard
- ✅ Receive email notifications
- ✅ See the thank you page

**Then the system is working perfectly!**

---

**Need Help?** Check the full documentation:
- [README.md](README.md) - Complete overview
- [SYSTEM_STATUS_2025.md](SYSTEM_STATUS_2025.md) - Detailed status
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment

**The system is production ready and fully operational!** 🚀
