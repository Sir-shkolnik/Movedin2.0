# Stripe Payment Integration Guide - MovedIn 3.0

## 🎯 Overview
This document outlines the complete Stripe payment integration for MovedIn 3.0, including the $1 CAD deposit system and validation flow.

## 💳 Payment Flow

### 1. **Vendor Selection Validation**
- **Location**: `/quote/vendors`
- **Requirement**: User MUST click on a vendor card to select it
- **Validation**: `data.canProceedFromVendors` flag must be `true`
- **UI Feedback**: Continue button disabled until selection, shows "Select a Mover First"

### 2. **Contact Information Validation**
- **Location**: `/quote/summary` 
- **Required Fields**:
  - First Name (required)
  - Last Name (required) 
  - Email (required, validated format)
  - Phone (required, minimum 10 digits)
- **Validation**: All fields must be completed and valid
- **UI Feedback**: Continue button shows "Complete Contact Info" if missing data

### 3. **Payment Processing**
- **Location**: `/quote/payment`
- **Amount**: $1.00 CAD (100 cents)
- **Integration**: Real Stripe checkout (no mock/demo)
- **Backend**: Creates lead first, then payment link

## 🔧 Technical Implementation

### Payment Step Code Structure
```javascript
// PaymentStep.jsx - Key Components

// 1. Validation
if (!data.contact?.firstName || !data.contact?.lastName || 
    !data.contact?.email || !data.contact?.phone) {
  throw new Error('Please complete all contact information');
}

if (!data.selectedQuote) {
  throw new Error('Please select a moving company first');
}

// 2. Lead Creation
const leadPayload = {
  quote_data: { /* move details */ },
  selected_quote: { /* vendor info */ },
  contact_data: data.contact
};

// 3. Stripe Payment Link
const paymentPayload = {
  amount: 100, // $1.00 CAD in cents
  currency: 'cad',
  lead_id: leadId,
  customer_email: data.contact.email,
  vendor_slug: data.selectedQuote.vendor_slug
};

// 4. Redirect to Stripe
window.location.href = result.payment_link_url;
```

### Validation Flow
```javascript
// WizardContainer.jsx - Step Validation

if (isVendorsStep) {
  canContinue = data.canProceedFromVendors === true;
  if (!canContinue) buttonText = 'Select a Mover First';
} else if (isSummaryStep) {
  const hasValidContact = data.contact?.firstName && 
                         data.contact?.lastName && 
                         data.contact?.email && 
                         validateEmail(data.contact.email) &&
                         data.contact?.phone &&
                         validatePhone(data.contact.phone);
  canContinue = hasValidContact;
  if (!canContinue) buttonText = 'Complete Contact Info';
}
```

## 🚀 API Endpoints

### 1. Create Lead
```
POST https://movedin-backend.onrender.com/api/leads
Content-Type: application/json

{
  "quote_data": {
    "origin_address": "string",
    "destination_address": "string", 
    "move_date": "YYYY-MM-DD",
    "move_time": "string",
    "total_rooms": number,
    "square_footage": number,
    "estimated_weight": number,
    "stairs_at_pickup": number,
    "stairs_at_dropoff": number,
    "elevator_at_pickup": boolean,
    "elevator_at_dropoff": boolean,
    "heavy_items": {},
    "additional_services": {}
  },
  "selected_quote": {
    "vendor_slug": "string",
    "vendor_name": "string", 
    "total_cost": number,
    "crew_size": number,
    "truck_count": number,
    "estimated_hours": number,
    "travel_time_hours": number,
    "breakdown": {}
  },
  "contact_data": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### 2. Create Payment Link
```
POST https://movedin-backend.onrender.com/api/payment-simple/create-payment-link
Content-Type: application/json

{
  "amount": 100,
  "currency": "cad", 
  "lead_id": "string",
  "customer_email": "string",
  "vendor_slug": "string"
}
```

## 🎨 UI/UX Features

### Payment Step Display
- **Deposit Amount**: $1.00 CAD (fixed)
- **Total Cost**: Shows selected quote total
- **Remaining Balance**: Total - $1.00
- **Error Handling**: Displays validation errors
- **Security Notice**: "Secure Payment - processed through Stripe"

### Button States
- **Vendors Step**: Disabled until vendor selected
- **Summary Step**: Disabled until contact info complete  
- **Payment Step**: Always enabled (validates on submit)

## 🔍 Console Warnings (Normal)

When testing Stripe checkout, you'll see these **normal** console messages:

```
<link rel=preload> uses an unsupported `as` value
Uncaught (in promise) Error: Cannot find module './en'
[Violation] Added non-passive event listener to a scroll-blocking event
```

**These are Stripe's internal warnings and do NOT affect functionality.**

## ✅ Success Indicators

### Working Payment Flow:
1. ✅ Vendor selection required before continuing
2. ✅ Contact information validation  
3. ✅ $1.00 CAD amount in Stripe checkout
4. ✅ "MovedIn 2.0 - $1 CAD Deposit" description
5. ✅ Email pre-filled in Stripe form
6. ✅ Redirect back to app after payment

### Stripe Checkout Page Should Show:
- **Amount**: CA$1.00
- **Description**: "MovedIn 2.0 - $1 CAD Deposit" 
- **Company**: 15274079 Canada Inc.
- **Email**: Pre-filled from contact form
- **Payment Methods**: Credit card + Stripe Link

## 🛠️ Troubleshooting

### Common Issues:

1. **"Select a Mover First" button**
   - **Cause**: No vendor selected
   - **Fix**: Click on a vendor card in VendorsStep

2. **"Complete Contact Info" button**  
   - **Cause**: Missing or invalid contact fields
   - **Fix**: Fill all required fields in SummaryStep

3. **Payment errors**
   - **Cause**: Backend API issues or invalid data
   - **Fix**: Check console for specific error messages

4. **Stripe redirect not working**
   - **Cause**: Invalid payment link URL
   - **Fix**: Verify backend API is responding correctly

## 📝 Development Notes

- **Deposit Amount**: Fixed at $1.00 CAD (100 cents)
- **Currency**: Always CAD
- **Validation**: Client-side + server-side
- **Error Handling**: User-friendly error messages
- **Security**: All payments processed through Stripe

## 🔄 Testing Checklist

- [ ] Vendor selection required
- [ ] Contact validation working
- [ ] $1.00 CAD amount correct
- [ ] Stripe redirect successful
- [ ] Email pre-filled in Stripe
- [ ] Error handling displays properly
- [ ] Console warnings are normal Stripe warnings

---

**Last Updated**: January 2025  
**Status**: ✅ Production Ready  
**Payment Amount**: $1.00 CAD  
**Integration**: Real Stripe (No Mock Data)
