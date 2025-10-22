# Backend Implementation Plan - Movedin 3.0

## 🎯 Executive Summary

This document outlines the complete implementation plan for the Movedin 3.0 backend system, including Stripe payment integration, Zoho CRM integration, email notifications, and local SQLite database.

---

## 📋 Implementation Overview

### **Technology Stack**
- **Backend**: Python 3.11+ with FastAPI
- **Database**: SQLite (local file-based, simple and portable)
- **Payment**: Stripe API
- **CRM**: Zoho CRM API
- **Email**: SendGrid or Mailgun
- **Authentication**: API keys and webhook signatures

### **Project Structure**
```
MovedinV3.0/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application
│   │   ├── database.py             # SQLite database connection
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── lead.py            # Lead model
│   │   │   ├── quote.py           # Quote model
│   │   │   └── payment.py         # Payment model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── lead.py            # Lead schemas (Pydantic)
│   │   │   ├── quote.py           # Quote schemas
│   │   │   └── payment.py         # Payment schemas
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── leads.py       # Lead endpoints
│   │   │   │   ├── payment.py     # Payment endpoints
│   │   │   │   └── zoho.py        # Zoho CRM endpoints
│   │   │   └── dependencies.py    # Shared dependencies
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── stripe_service.py  # Stripe integration
│   │   │   ├── zoho_service.py    # Zoho CRM integration
│   │   │   └── email_service.py   # Email notifications
│   │   └── core/
│   │       ├── __init__.py
│   │       ├── config.py          # Configuration
│   │       └── security.py        # Security utilities
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_leads.py
│   │   ├── test_payment.py
│   │   ├── test_zoho.py
│   │   └── test_email.py
│   ├── .env.example               # Example environment variables
│   ├── .env                       # Actual environment variables (gitignored)
│   ├── requirements.txt           # Python dependencies
│   ├── README.md                  # Backend documentation
│   └── database.db                # SQLite database file (gitignored)
```

---

## 🗄️ Database Schema (SQLite)

### **leads Table**
```sql
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    origin_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    move_date DATE NOT NULL,
    move_time VARCHAR(50),
    home_type VARCHAR(50),
    total_rooms INTEGER,
    square_footage INTEGER,
    heavy_items TEXT,  -- JSON string
    additional_services TEXT,  -- JSON string
    stairs_at_pickup INTEGER DEFAULT 0,
    stairs_at_dropoff INTEGER DEFAULT 0,
    elevator_at_pickup BOOLEAN DEFAULT 0,
    elevator_at_dropoff BOOLEAN DEFAULT 0,
    selected_vendor_id INTEGER,
    selected_vendor_name VARCHAR(255),
    total_cost DECIMAL(10,2),
    hourly_rate DECIMAL(10,2),
    estimated_hours DECIMAL(10,2),
    crew_size INTEGER,
    truck_count INTEGER,
    status VARCHAR(50) DEFAULT 'new',  -- new, payment_pending, payment_completed, confirmed, cancelled
    payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50),
    zoho_lead_id VARCHAR(255),
    source VARCHAR(50) DEFAULT 'website',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
```

### **payments Table**
```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,  -- Amount in cents
    currency VARCHAR(3) DEFAULT 'CAD',
    status VARCHAR(50) NOT NULL,  -- pending, succeeded, failed, cancelled
    stripe_customer_id VARCHAR(255),
    stripe_payment_method VARCHAR(255),
    receipt_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);

CREATE INDEX idx_payments_lead_id ON payments(lead_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### **email_logs Table**
```sql
CREATE TABLE email_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    email_type VARCHAR(50) NOT NULL,  -- confirmation, vendor_notification, support_alert
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    status VARCHAR(50) NOT NULL,  -- sent, failed, pending
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);

CREATE INDEX idx_email_logs_lead_id ON email_logs(lead_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
```

---

## 🔌 API Endpoints

### **Lead Management**

#### **POST /api/leads**
Create a new lead from quote selection.

**Request:**
```json
{
  "quote_data": {
    "origin_address": "16 Island Green Lane, Markham, ON",
    "destination_address": "21 Four Seasons Place, Etobicoke, ON",
    "move_date": "2025-10-30",
    "move_time": "Evening",
    "home_type": "house",
    "total_rooms": 4,
    "square_footage": null,
    "heavy_items": {},
    "additional_services": {},
    "stairs_at_pickup": 0,
    "stairs_at_dropoff": 0,
    "elevator_at_pickup": false,
    "elevator_at_dropoff": false
  },
  "selected_quote": {
    "vendor_name": "Let's Get Moving",
    "vendor_slug": "lets-get-moving",
    "total_cost": 3467.42,
    "hourly_rate": 229.00,
    "estimated_hours": 15.13,
    "crew_size": 3,
    "truck_count": 1
  },
  "contact_data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  }
}
```

**Response:**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "status": "new",
  "total_cost": 3467.42,
  "created_at": "2025-10-20T12:00:00Z"
}
```

#### **GET /api/leads/{lead_id}**
Get lead by ID.

**Response:**
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "origin_address": "16 Island Green Lane, Markham, ON",
  "destination_address": "21 Four Seasons Place, Etobicoke, ON",
  "move_date": "2025-10-30",
  "move_time": "Evening",
  "total_rooms": 4,
  "selected_vendor_name": "Let's Get Moving",
  "total_cost": 3467.42,
  "hourly_rate": 229.00,
  "estimated_hours": 15.13,
  "crew_size": 3,
  "truck_count": 1,
  "status": "new",
  "created_at": "2025-10-20T12:00:00Z"
}
```

#### **GET /api/leads**
List all leads with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `status`: Filter by status

**Response:**
```json
{
  "leads": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "status": "new",
      "total_cost": 3467.42,
      "created_at": "2025-10-20T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

#### **PUT /api/leads/{lead_id}**
Update lead status.

**Request:**
```json
{
  "status": "payment_completed"
}
```

### **Payment Processing**

#### **POST /api/payment/create-link**
Create Stripe payment link for deposit.

**Request:**
```json
{
  "lead_id": 1,
  "amount": 10000,  // $100 CAD in cents
  "currency": "cad"
}
```

**Response:**
```json
{
  "payment_link_url": "https://buy.stripe.com/pay/...",
  "payment_intent_id": "pi_3S2Ni3E963QK6A6z0u5FXVrP"
}
```

#### **POST /api/payment/webhook**
Stripe webhook endpoint for payment events.

**Headers:**
- `stripe-signature`: Webhook signature

**Payload:** (Stripe event object)

**Response:**
```json
{
  "status": "success",
  "message": "Payment processed successfully"
}
```

#### **POST /api/payment/verify**
Verify payment status.

**Request:**
```json
{
  "payment_intent_id": "pi_3S2Ni3E963QK6A6z0u5FXVrP"
}
```

**Response:**
```json
{
  "status": "succeeded",
  "amount": 10000,
  "currency": "cad",
  "receipt_url": "https://pay.stripe.com/receipts/..."
}
```

### **Zoho CRM Integration**

#### **POST /api/zoho/create-lead**
Create lead in Zoho CRM.

**Request:**
```json
{
  "lead_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "zoho_lead_id": "123456789",
  "message": "Lead created in Zoho CRM"
}
```

---

## 🔧 Environment Configuration

### **.env File**
```bash
# Database
DATABASE_URL=sqlite:///./database.db

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Zoho CRM
ZOHO_CLIENT_ID=1000.XXX...
ZOHO_CLIENT_SECRET=XXX...
ZOHO_REFRESH_TOKEN=1000.XXX...
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v2

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.XXX...
FROM_EMAIL=support@movedin.ca
VENDOR_EMAIL=vendors@movedin.ca
SUPPORT_EMAIL=support@movedin.ca

# Application
APP_NAME=MovedIn 3.0
API_V1_STR=/api
DEBUG=True
CORS_ORIGINS=http://localhost:5176,http://localhost:3000
```

---

## 📦 Dependencies (requirements.txt)

```txt
# Web Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.23
aiosqlite==0.19.0

# Payment
stripe==7.8.0

# HTTP Client
httpx==0.25.2
requests==2.31.0

# Email
sendgrid==6.11.0

# Validation
pydantic==2.5.0
pydantic-settings==2.1.0

# Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Utilities
python-dotenv==1.0.0
python-dateutil==2.8.2

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

---

## 🚀 Implementation Steps

### **Phase 1: Backend Setup (Week 1)**

#### **Step 1: Project Structure**
```bash
cd MovedinV3.0
mkdir -p backend/app/{models,schemas,api/routes,services,core}
mkdir -p backend/tests
touch backend/app/__init__.py
touch backend/app/models/__init__.py
touch backend/app/schemas/__init__.py
touch backend/app/api/__init__.py
touch backend/app/api/routes/__init__.py
touch backend/app/services/__init__.py
touch backend/app/core/__init__.py
touch backend/tests/__init__.py
```

#### **Step 2: Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

#### **Step 3: Environment Setup**
```bash
cp .env.example .env
# Edit .env with actual API keys
```

#### **Step 4: Database Setup**
```python
# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db():
    """Initialize database and create tables"""
    from app.models import lead, payment, email_log
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **Phase 2: Models & Schemas (Week 1)**

#### **Step 5: Lead Model**
```python
# backend/app/models/lead.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    origin_address = Column(Text, nullable=False)
    destination_address = Column(Text, nullable=False)
    move_date = Column(String(50), nullable=False)
    move_time = Column(String(50))
    home_type = Column(String(50))
    total_rooms = Column(Integer)
    square_footage = Column(Integer)
    heavy_items = Column(Text)  # JSON string
    additional_services = Column(Text)  # JSON string
    stairs_at_pickup = Column(Integer, default=0)
    stairs_at_dropoff = Column(Integer, default=0)
    elevator_at_pickup = Column(Boolean, default=False)
    elevator_at_dropoff = Column(Boolean, default=False)
    selected_vendor_id = Column(Integer)
    selected_vendor_name = Column(String(255))
    total_cost = Column(Float)
    hourly_rate = Column(Float)
    estimated_hours = Column(Float)
    crew_size = Column(Integer)
    truck_count = Column(Integer)
    status = Column(String(50), default="new")
    payment_intent_id = Column(String(255))
    payment_status = Column(String(50))
    zoho_lead_id = Column(String(255))
    source = Column(String(50), default="website")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### **Step 6: Payment Model**
```python
# backend/app/models/payment.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    payment_intent_id = Column(String(255), unique=True, nullable=False)
    amount = Column(Integer, nullable=False)  # Amount in cents
    currency = Column(String(3), default="CAD")
    status = Column(String(50), nullable=False)
    stripe_customer_id = Column(String(255))
    stripe_payment_method = Column(String(255))
    receipt_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### **Phase 3: API Endpoints (Week 2)**

#### **Step 7: Lead Endpoints**
```python
# backend/app/api/routes/leads.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadResponse

router = APIRouter()

@router.post("/leads", response_model=LeadResponse, status_code=201)
async def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    """Create a new lead from quote selection"""
    try:
        # Create lead object
        lead = Lead(**lead_data.dict())
        
        # Save to database
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        return lead
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create lead: {str(e)}")

@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get lead by ID"""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.get("/leads", response_model=List[LeadResponse])
async def list_leads(
    page: int = 1,
    limit: int = 50,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all leads with pagination"""
    query = db.query(Lead)
    
    if status:
        query = query.filter(Lead.status == status)
    
    leads = query.offset((page - 1) * limit).limit(limit).all()
    return leads
```

### **Phase 4: Stripe Integration (Week 2-3)**

#### **Step 8: Stripe Service**
```python
# backend/app/services/stripe_service.py
import stripe
import os
from typing import Dict, Any

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StripeService:
    @staticmethod
    def create_payment_link(lead_id: int, amount: int, currency: str = "cad") -> Dict[str, Any]:
        """Create a Stripe payment link"""
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                metadata={
                    "lead_id": lead_id,
                    "description": "Moving deposit"
                }
            )
            
            # Create payment link
            payment_link = stripe.PaymentLink.create(
                line_items=[{
                    "price_data": {
                        "currency": currency,
                        "product_data": {
                            "name": "Moving Deposit",
                            "description": "Deposit to secure your move"
                        },
                        "unit_amount": amount
                    },
                    "quantity": 1
                }],
                metadata={
                    "lead_id": lead_id
                },
                after_completion={
                    "type": "redirect",
                    "redirect": {
                        "url": f"{os.getenv('FRONTEND_URL')}/thank-you"
                    }
                }
            )
            
            return {
                "payment_link_url": payment_link.url,
                "payment_intent_id": payment_intent.id
            }
            
        except Exception as e:
            raise Exception(f"Failed to create payment link: {str(e)}")
    
    @staticmethod
    def verify_payment(payment_intent_id: str) -> Dict[str, Any]:
        """Verify payment status"""
        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return {
                "status": payment_intent.status,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "receipt_url": payment_intent.charges.data[0].receipt_url if payment_intent.charges.data else None
            }
        except Exception as e:
            raise Exception(f"Failed to verify payment: {str(e)}")
```

#### **Step 9: Stripe Webhook Handler**
```python
# backend/app/api/routes/payment.py
from fastapi import APIRouter, Request, Depends, HTTPException
import stripe
import os
from app.database import get_db
from app.models.lead import Lead
from app.models.payment import Payment

router = APIRouter()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/payment/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            lead_id = payment_intent["metadata"]["lead_id"]
            
            # Update lead status
            lead = db.query(Lead).filter(Lead.id == lead_id).first()
            if lead:
                lead.status = "payment_completed"
                lead.payment_intent_id = payment_intent["id"]
                lead.payment_status = "succeeded"
                db.commit()
                
                # Create payment record
                payment = Payment(
                    lead_id=lead_id,
                    payment_intent_id=payment_intent["id"],
                    amount=payment_intent["amount"],
                    currency=payment_intent["currency"],
                    status="succeeded"
                )
                db.add(payment)
                db.commit()
                
                # TODO: Send confirmation email
                # TODO: Notify vendor
                # TODO: Create Zoho lead
        
        return {"status": "success"}
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
```

### **Phase 5: Zoho CRM Integration (Week 3)**

#### **Step 10: Zoho Service**
```python
# backend/app/services/zoho_service.py
import requests
import os
from typing import Dict, Any

class ZohoCRMService:
    def __init__(self):
        self.client_id = os.getenv("ZOHO_CLIENT_ID")
        self.client_secret = os.getenv("ZOHO_CLIENT_SECRET")
        self.refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")
        self.crm_api_url = os.getenv("ZOHO_CRM_API_URL")
        self.access_token = self._get_access_token()
    
    def _get_access_token(self) -> str:
        """Get access token using refresh token"""
        url = "https://accounts.zoho.com/oauth/v2/token"
        params = {
            "refresh_token": self.refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "refresh_token"
        }
        
        response = requests.post(url, params=params)
        response.raise_for_status()
        return response.json()["access_token"]
    
    def create_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create lead in Zoho CRM"""
        url = f"{self.crm_api_url}/Leads"
        
        payload = {
            "data": [{
                "First_Name": lead_data["first_name"],
                "Last_Name": lead_data["last_name"],
                "Email": lead_data["email"],
                "Phone": lead_data["phone"],
                "Lead_Source": "Website",
                "Lead_Status": "New",
                "Company": "Moving Quote",
                "Description": f"Move from {lead_data['origin_address']} to {lead_data['destination_address']}",
                "Move_Date": lead_data["move_date"],
                "Total_Cost": lead_data["total_cost"],
                "Vendor": lead_data["selected_vendor_name"]
            }]
        }
        
        headers = {
            "Authorization": f"Zoho-oauthtoken {self.access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
```

### **Phase 6: Email Notifications (Week 3-4)**

#### **Step 11: Email Service**
```python
# backend/app/services/email_service.py
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from typing import Dict, Any

class EmailService:
    def __init__(self):
        self.sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        self.from_email = os.getenv("FROM_EMAIL")
        self.vendor_email = os.getenv("VENDOR_EMAIL")
        self.support_email = os.getenv("SUPPORT_EMAIL")
    
    def send_confirmation_email(self, lead_data: Dict[str, Any]) -> bool:
        """Send confirmation email to customer"""
        message = Mail(
            from_email=self.from_email,
            to_emails=lead_data["email"],
            subject="Your Moving Quote Confirmation",
            html_content=f"""
            <h2>Thank You for Choosing MovedIn!</h2>
            <p>Hi {lead_data['first_name']},</p>
            <p>Your quote has been confirmed.</p>
            <h3>Move Details:</h3>
            <ul>
                <li><strong>From:</strong> {lead_data['origin_address']}</li>
                <li><strong>To:</strong> {lead_data['destination_address']}</li>
                <li><strong>Date:</strong> {lead_data['move_date']}</li>
                <li><strong>Time:</strong> {lead_data['move_time']}</li>
                <li><strong>Vendor:</strong> {lead_data['selected_vendor_name']}</li>
                <li><strong>Total Cost:</strong> ${lead_data['total_cost']}</li>
            </ul>
            <p>Best regards,<br>The MovedIn Team</p>
            """
        )
        
        try:
            self.sg.send(message)
            return True
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False
    
    def send_vendor_notification(self, lead_data: Dict[str, Any]) -> bool:
        """Send notification to vendor"""
        message = Mail(
            from_email=self.from_email,
            to_emails=self.vendor_email,
            subject=f"New Lead: {lead_data['first_name']} {lead_data['last_name']}",
            html_content=f"""
            <h2>New Lead Received</h2>
            <h3>Customer Information:</h3>
            <ul>
                <li><strong>Name:</strong> {lead_data['first_name']} {lead_data['last_name']}</li>
                <li><strong>Email:</strong> {lead_data['email']}</li>
                <li><strong>Phone:</strong> {lead_data['phone']}</li>
                <li><strong>Move Date:</strong> {lead_data['move_date']}</li>
                <li><strong>Total Cost:</strong> ${lead_data['total_cost']}</li>
            </ul>
            """
        )
        
        try:
            self.sg.send(message)
            return True
        except Exception as e:
            print(f"Failed to send vendor notification: {str(e)}")
            return False
```

### **Phase 7: Frontend Integration (Week 4)**

#### **Step 12: Update Frontend PaymentStep**
```javascript
// frontend/src/components/quote-wizard/steps/PaymentStep.jsx
const handlePayment = async () => {
  setIsProcessing(true);
  setPaymentError(null);
  
  try {
    // 1. Create lead in database
    const leadResponse = await fetch('http://localhost:8000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quote_data: data,
        selected_quote: data.selectedQuote,
        contact_data: data.contact
      })
    });
    
    if (!leadResponse.ok) {
      throw new Error('Failed to create lead');
    }
    
    const lead = await leadResponse.json();
    
    // 2. Create Stripe payment link
    const paymentResponse = await fetch('http://localhost:8000/api/payment/create-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: lead.id,
        amount: 10000, // $100 CAD in cents
        currency: 'cad'
      })
    });
    
    if (!paymentResponse.ok) {
      throw new Error('Failed to create payment link');
    }
    
    const { payment_link_url } = await paymentResponse.json();
    
    // 3. Redirect to Stripe payment page
    window.location.href = payment_link_url;
    
  } catch (error) {
    console.error('Payment error:', error);
    setPaymentError(error.message);
    setIsProcessing(false);
  }
};
```

### **Phase 8: Testing (Week 4-5)**

#### **Step 13: Test Lead Creation**
```python
# backend/tests/test_leads.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_lead():
    response = client.post("/api/leads", json={
        "quote_data": {
            "origin_address": "16 Island Green Lane, Markham, ON",
            "destination_address": "21 Four Seasons Place, Etobicoke, ON",
            "move_date": "2025-10-30",
            "move_time": "Evening",
            "home_type": "house",
            "total_rooms": 4
        },
        "selected_quote": {
            "vendor_name": "Let's Get Moving",
            "vendor_slug": "lets-get-moving",
            "total_cost": 3467.42,
            "hourly_rate": 229.00
        },
        "contact_data": {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "phone": "555-1234"
        }
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "John"
    assert data["status"] == "new"
```

#### **Step 14: Test Payment Flow**
```python
# backend/tests/test_payment.py
def test_create_payment_link():
    # First create a lead
    lead_response = client.post("/api/leads", json={...})
    lead_id = lead_response.json()["id"]
    
    # Create payment link
    response = client.post("/api/payment/create-link", json={
        "lead_id": lead_id,
        "amount": 10000,
        "currency": "cad"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "payment_link_url" in data
    assert "payment_intent_id" in data
```

---

## 📊 Testing Checklist

### **Backend Testing**
- [ ] Test lead creation
- [ ] Test lead retrieval
- [ ] Test lead listing with pagination
- [ ] Test lead status update
- [ ] Test payment link creation
- [ ] Test Stripe webhook handling
- [ ] Test payment verification
- [ ] Test Zoho CRM lead creation
- [ ] Test email sending (confirmation, vendor, support)
- [ ] Test error handling

### **Integration Testing**
- [ ] Test complete payment flow (create lead → payment link → webhook → confirm)
- [ ] Test Zoho CRM sync after payment
- [ ] Test email notifications after payment
- [ ] Test database transactions
- [ ] Test API error responses

### **Frontend Testing**
- [ ] Test frontend → backend API calls
- [ ] Test payment redirect
- [ ] Test error handling
- [ ] Test loading states

---

## 🚀 Deployment

### **Local Development**
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### **Production Deployment**
```bash
# Use gunicorn for production
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 📝 Summary

### **What We're Building**
1. ✅ **Backend API** - FastAPI with SQLite database
2. ✅ **Stripe Integration** - Payment processing
3. ✅ **Zoho CRM Integration** - Lead management
4. ✅ **Email Notifications** - Customer and vendor communications
5. ✅ **Complete Testing** - Unit and integration tests

### **Timeline**
- **Week 1**: Backend setup + Database + Models
- **Week 2**: API endpoints + Stripe integration
- **Week 3**: Zoho CRM + Email notifications
- **Week 4**: Frontend integration + Testing
- **Week 5**: Final testing + Deployment

### **Total Time**: 4-5 weeks

---

**Status**: 📋 **Ready to Implement**  
**Priority**: 🔴 **Critical**  
**Last Updated**: October 20, 2025

