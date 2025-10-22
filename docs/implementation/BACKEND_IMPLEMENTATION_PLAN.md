# 🚀 MovedIn 3.0 Backend Implementation Plan

## 🎯 **CRITICAL MISSING COMPONENTS**

Based on comparison with MovedIn 2.0, V3.0 is missing the **entire backend infrastructure** for:
- ❌ **Database Lead Storage** 
- ❌ **Email Notifications (3 emails)**
- ❌ **Payment Webhook Processing**
- ❌ **Vendor Management**

## 📊 **V2.0 vs V3.0 Comparison**

| Component | V2.0 (Working) | V3.0 (Current) | Status |
|-----------|-----------------|----------------|---------|
| **Frontend** | ✅ Complete | ✅ Complete | ✅ |
| **Payment Integration** | ✅ Stripe + $1 CAD | ✅ Stripe + $1 CAD | ✅ |
| **Database Storage** | ✅ SQLite + PostgreSQL | ❌ Missing | ❌ |
| **Email Notifications** | ✅ 3 emails sent | ❌ Missing | ❌ |
| **Lead Management** | ✅ Full pipeline | ❌ Missing | ❌ |
| **Vendor Notifications** | ✅ Automated | ❌ Missing | ❌ |

## 🔧 **IMPLEMENTATION PLAN**

### **Phase 1: Database & Lead Storage** (Week 1)

#### **1.1 Create Backend Structure**
```
MovedinV3.0/backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── leads.py          # Lead CRUD operations
│   │       ├── payment.py        # Payment processing
│   │       └── vendors.py        # Vendor management
│   ├── models/
│   │   ├── lead.py              # Lead database model
│   │   └── vendor.py            # Vendor database model
│   ├── services/
│   │   ├── email_service.py     # Email notifications
│   │   └── database_service.py  # Database operations
│   └── core/
│       └── config.py           # Configuration
├── requirements.txt
└── main.py
```

#### **1.2 Database Models**
```python
# Lead Model (from V2.0)
class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(255))
    phone = Column(String(20))
    
    # Move Details
    origin_address = Column(Text)
    destination_address = Column(Text)
    move_date = Column(Date)
    move_time = Column(String(50))
    total_rooms = Column(Integer)
    square_footage = Column(Integer)
    
    # Payment Details
    payment_amount = Column(Float, default=1.00)
    payment_currency = Column(String(3), default='CAD')
    payment_status = Column(String(50), default='pending')
    payment_intent_id = Column(String(255))
    
    # Vendor Details
    selected_vendor_id = Column(Integer)
    vendor_name = Column(String(255))
    
    # Status
    status = Column(String(50), default='new')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
```

### **Phase 2: Email Notification System** (Week 1-2)

#### **2.1 Email Service (Copy from V2.0)**
```python
# backend/app/services/email_service.py
class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.office365.com"
        self.smtp_port = 587
        self.smtp_username = "support@movedin.com"
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.support_email = "support@movedin.com"
    
    def send_final_booking_emails(self, lead_data, lead_id, payment_intent_id):
        """Send exactly 3 emails:
        1. Customer confirmation
        2. Vendor notification  
        3. Support notification
        """
        results = {
            "customer_email": False,
            "vendor_email": False, 
            "admin_email": False
        }
        
        # 1. Customer Email
        customer_email = lead_data['contact_data']['email']
        results["customer_email"] = self.send_email(
            customer_email,
            f"🎉 Booking Confirmation #{lead_id} - MovedIn",
            self.customer_confirmation_template(lead_data, lead_id)
        )
        
        # 2. Vendor Email (to support@movedin.com)
        results["vendor_email"] = self.send_email(
            self.support_email,
            f"📋 VENDOR ORDER #{lead_id} - {vendor_name}",
            self.vendor_order_template(lead_data, lead_id)
        )
        
        # 3. Admin Email (to support@movedin.com)
        results["admin_email"] = self.send_email(
            self.support_email,
            f"📊 SYSTEM STATUS #{lead_id} - MovedIn Admin",
            self.admin_health_template(lead_data, lead_id)
        )
        
        return results
```

#### **2.2 Email Templates**
```python
def customer_confirmation_template(self, lead_data, lead_id):
    return f"""
    <h1>🎉 Booking Confirmed!</h1>
    <p>Thank you for choosing MovedIn!</p>
    <p><strong>Lead ID:</strong> #{lead_id}</p>
    <p><strong>Move Date:</strong> {lead_data['quote_data']['move_date']}</p>
    <p><strong>Total Cost:</strong> ${lead_data['selected_quote']['total_cost']}</p>
    """

def vendor_order_template(self, lead_data, lead_id):
    return f"""
    <h1>📋 New Move Booking</h1>
    <p><strong>Lead ID:</strong> #{lead_id}</p>
    <p><strong>Customer:</strong> {lead_data['contact_data']['firstName']} {lead_data['contact_data']['lastName']}</p>
    <p><strong>Phone:</strong> {lead_data['contact_data']['phone']}</p>
    <p><strong>Email:</strong> {lead_data['contact_data']['email']}</p>
    """

def admin_health_template(self, lead_data, lead_id):
    return f"""
    <h1>📊 System Status Update</h1>
    <p><strong>Lead ID:</strong> #{lead_id}</p>
    <p><strong>Status:</strong> Payment Completed</p>
    <p><strong>Revenue:</strong> $1.00 CAD</p>
    """
```

### **Phase 3: Payment Integration** (Week 2)

#### **3.1 Update PaymentStep.jsx**
```javascript
// Current V3.0 PaymentStep.jsx - ADD these endpoints:

const handleSubmit = async () => {
  try {
    // 1. Create lead in database FIRST
    const leadResponse = await fetch('https://movedin-backend.onrender.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    });
    
    const leadData = await leadResponse.json();
    const leadId = leadData.id;
    
    // 2. Create Stripe payment link
    const paymentResponse = await fetch('https://movedin-backend.onrender.com/api/payment-simple/create-payment-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100, // $1.00 CAD
        currency: 'cad',
        lead_id: leadId,
        customer_email: data.contact.email,
        vendor_slug: data.selectedQuote.vendor_slug
      })
    });
    
    const result = await paymentResponse.json();
    
    // 3. Redirect to Stripe
    window.location.href = result.payment_link_url;
    
  } catch (error) {
    console.error('Payment error:', error);
    setError(error.message);
  }
};
```

#### **3.2 Payment Webhook Handler**
```python
# backend/app/api/routes/payment.py
@router.post('/webhook/stripe')
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook for payment completion"""
    
    # Verify webhook signature
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle payment completion
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_payment_success(session, db)
    
    return {"status": "success"}

async def handle_payment_success(session, db):
    """Process successful payment"""
    
    # 1. Update lead status
    lead_id = session['metadata']['lead_id']
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    
    lead.status = 'payment_completed'
    lead.payment_intent_id = session['id']
    lead.payment_amount = 1.00
    lead.payment_currency = 'CAD'
    lead.payment_status = 'succeeded'
    
    db.commit()
    
    # 2. Send 3 emails
    from app.services.email_service import email_service
    
    lead_data = {
        'contact_data': {
            'firstName': lead.first_name,
            'lastName': lead.last_name,
            'email': lead.email,
            'phone': lead.phone
        },
        'selected_quote': {
            'vendor_name': lead.vendor_name,
            'total_cost': lead.payment_amount
        }
    }
    
    email_results = email_service.send_final_booking_emails(
        lead_data, lead_id, session['id']
    )
    
    logger.info(f"Payment completed for lead {lead_id}, emails sent: {email_results}")
```

### **Phase 4: API Endpoints** (Week 2)

#### **4.1 Lead Management API**
```python
# backend/app/api/routes/leads.py
@router.post('/leads')
async def create_lead(lead_request: LeadRequest, db: Session = Depends(get_db)):
    """Create new lead in database"""
    
    # Create lead record
    lead = Lead(
        first_name=lead_request.contact_data['firstName'],
        last_name=lead_request.contact_data['lastName'],
        email=lead_request.contact_data['email'],
        phone=lead_request.contact_data['phone'],
        origin_address=lead_request.quote_data['origin_address'],
        destination_address=lead_request.quote_data['destination_address'],
        move_date=lead_request.quote_data['move_date'],
        move_time=lead_request.quote_data['move_time'],
        total_rooms=lead_request.quote_data['total_rooms'],
        selected_vendor_id=lead_request.selected_quote['vendor_slug'],
        vendor_name=lead_request.selected_quote['vendor_name'],
        status='pending_payment'
    )
    
    db.add(lead)
    db.commit()
    db.refresh(lead)
    
    return {
        'id': lead.id,
        'status': 'created',
        'message': 'Lead created successfully'
    }
```

## 🎯 **IMPLEMENTATION PRIORITY**

### **Week 1: Core Backend**
1. ✅ **Database Setup** - SQLite/PostgreSQL
2. ✅ **Lead Model** - Copy from V2.0
3. ✅ **Basic API** - CRUD operations

### **Week 2: Email & Payment**
1. ✅ **Email Service** - Copy from V2.0
2. ✅ **Payment Webhook** - Stripe integration
3. ✅ **3 Email System** - Customer, Vendor, Support

### **Week 3: Testing & Deployment**
1. ✅ **End-to-End Testing**
2. ✅ **Email Testing** - All 3 emails
3. ✅ **Production Deployment**

## 📧 **EMAIL CONFIGURATION**

### **Environment Variables**
```bash
# Email Configuration (from V2.0)
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=support@movedin.com
SMTP_PASSWORD=your_password_here
SUPPORT_EMAIL=support@movedin.com
```

### **Email Recipients**
1. **Customer Email** → `{customer_email}` (from form)
2. **Vendor Email** → `support@movedin.com` (for vendor management)
3. **Support Email** → `support@movedin.com` (for admin tracking)

## 🔄 **COMPLETE FLOW**

### **Current V3.0 Flow:**
1. User fills form → Payment → Stripe → Thank You ❌ (No data saved)

### **Target V3.0 Flow:**
1. User fills form → **Create Lead** → Payment → Stripe → **Webhook** → **Send 3 Emails** → Thank You ✅

## 📋 **NEXT STEPS**

1. **Copy V2.0 Backend** - Use existing working code
2. **Update V3.0 Frontend** - Point to new backend endpoints  
3. **Test Email System** - Verify all 3 emails work
4. **Deploy Backend** - Make it production-ready

---

**Status**: 🚧 **IMPLEMENTATION REQUIRED**  
**Timeline**: 2-3 weeks  
**Priority**: 🔴 **CRITICAL** - V3.0 cannot function without backend
