# GoDaddy 365 Email Setup Guide for MovedIn 2.0

## 🎯 Overview
This guide will help you configure MovedIn 2.0 to send real emails using your GoDaddy 365 email account.

## 📧 Current Email Configuration

**SMTP Settings:**
- **Server:** `smtp.office365.com`
- **Port:** `587`
- **Security:** TLS/STARTTLS
- **Username:** `support@movedin.com` (your GoDaddy 365 email)
- **Password:** Your GoDaddy 365 email password

## 🔧 Setup Steps

### Step 1: Get Your GoDaddy 365 Email Credentials

1. **Login to your GoDaddy account**
2. **Go to Email & Office Dashboard**
3. **Find your email account:** `support@movedin.com`
4. **Note down your email password** (you'll need this for SMTP)

### Step 2: Configure Environment Variables

You need to set the following environment variables in your deployment:

```bash
# GoDaddy 365 Email Configuration
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=support@movedin.com
SMTP_PASSWORD=your_actual_email_password_here
```

### Step 3: For Render.com Deployment

1. **Go to your Render dashboard**
2. **Select your backend service**
3. **Go to Environment tab**
4. **Add these environment variables:**
   - `SMTP_SERVER` = `smtp.office365.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USERNAME` = `support@movedin.com`
   - `SMTP_PASSWORD` = `your_actual_password`

### Step 4: Test Email Configuration

After setting up the environment variables, test the email system:

```bash
# Test email configuration
curl -X GET https://movedin-backend.onrender.com/api/email-test/config

# Test simple email sending
curl -X POST https://movedin-backend.onrender.com/api/email-test/test-simple

# Test full email notifications
curl -X POST https://movedin-backend.onrender.com/api/email-test/test-email
```

## 📬 Email Types Sent by MovedIn 2.0

### 1. **Vendor Notifications**
- **When:** When a customer completes payment
- **To:** Vendor email addresses
- **Content:** Lead details, customer info, move details

### 2. **Support Notifications**
- **When:** When a lead is created or payment is completed
- **To:** `support@movedin.com`
- **Content:** Lead summary, payment status

### 3. **Payment Confirmations**
- **When:** When payment is successfully processed
- **To:** Support team
- **Content:** Payment details, lead information

## 🔍 Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Check your email password
   - Ensure you're using the correct GoDaddy 365 email address
   - Verify the email account is active

2. **Connection Refused**
   - Check if `smtp.office365.com` is accessible
   - Verify port 587 is not blocked
   - Check firewall settings

3. **Emails Not Received**
   - Check spam/junk folders
   - Verify recipient email addresses are correct
   - Check GoDaddy email limits

### Debug Commands:

```bash
# Check current email configuration
curl -X GET https://movedin-backend.onrender.com/api/email-test/config

# View backend logs for email errors
# Check Render logs for SMTP connection issues
```

## 📊 Email Templates

The system uses these email templates:

### Vendor Notification Template:
```
🚛 New Moving Lead Received - MovedIn Platform

Lead ID: {lead_id}
Payment Status: Completed
Payment ID: {payment_intent_id}

Customer Details:
- Name: {first_name} {last_name}
- Email: {email}
- Phone: {phone}

Move Details:
- From: {origin_address}
- To: {destination_address}
- Date: {move_date}
- Time: {move_time}
- Rooms: {total_rooms}
- Square Footage: {square_footage}

This lead came from the MovedIn platform. Please contact the customer within 24 hours to confirm final pricing and details.

Best regards,
MovedIn Team
```

## 🚀 Deployment

After configuring the environment variables:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Configure GoDaddy 365 email settings"
   git push origin main
   ```

2. **Wait for deployment** (usually 2-3 minutes)

3. **Test the email system:**
   ```bash
   curl -X POST https://movedin-backend.onrender.com/api/email-test/test-simple
   ```

## ✅ Verification

To verify emails are working:

1. **Check your `support@movedin.com` inbox**
2. **Look for test emails from the system**
3. **Check spam folder if emails don't appear**
4. **Monitor backend logs for any errors**

## 🔒 Security Notes

- **Never commit email passwords to git**
- **Use environment variables for sensitive data**
- **Consider using app-specific passwords if available**
- **Regularly rotate email passwords**

## 📞 Support

If you encounter issues:

1. **Check the backend logs in Render**
2. **Verify environment variables are set correctly**
3. **Test with a simple email first**
4. **Contact GoDaddy support if SMTP issues persist**

---

**Last Updated:** January 2025
**Version:** MovedIn 2.0
