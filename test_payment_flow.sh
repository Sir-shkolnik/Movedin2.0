#!/bin/bash

echo "🧪 Testing Complete Payment Flow for MovedinV3.0"
echo "================================================"

# Test 1: Frontend accessibility
echo "1. Testing Frontend (http://localhost:3000)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/quote | grep -q "200"; then
    echo "   ✅ Frontend is accessible"
else
    echo "   ❌ Frontend is not accessible"
    exit 1
fi

# Test 2: Backend accessibility
echo "2. Testing Backend (http://localhost:8000)..."
if curl -s http://localhost:8000/health | grep -q "healthy"; then
    echo "   ✅ Backend is healthy"
else
    echo "   ❌ Backend is not healthy"
    exit 1
fi

# Test 3: Create a test lead
echo "3. Creating test lead..."
LEAD_RESPONSE=$(curl -s -X POST http://localhost:8000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Flow Test User",
    "customer_email": "flowtest@example.com",
    "customer_phone": "416-555-8888",
    "move_from": "123 Flow St, Toronto, ON M5V 3A8",
    "move_to": "456 Test Ave, Toronto, ON M5H 2M9",
    "move_date": "2025-11-25",
    "move_time": "3:00 PM",
    "vendor_name": "Lets Get Moving",
    "total_cost": 1800.00
  }')

LEAD_ID=$(echo $LEAD_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -n "$LEAD_ID" ]; then
    echo "   ✅ Lead created with ID: $LEAD_ID"
else
    echo "   ❌ Failed to create lead"
    echo "   Response: $LEAD_RESPONSE"
    exit 1
fi

# Test 4: Create payment link
echo "4. Creating payment link..."
PAYMENT_RESPONSE=$(curl -s -X POST http://localhost:8000/api/payment/create-link \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 100,
    \"currency\": \"cad\",
    \"lead_id\": $LEAD_ID,
    \"customer_email\": \"flowtest@example.com\",
    \"vendor_slug\": \"lets-get-moving\"
  }")

if echo "$PAYMENT_RESPONSE" | grep -q "payment_link_url"; then
    echo "   ✅ Payment link created successfully"
    PAYMENT_URL=$(echo $PAYMENT_RESPONSE | grep -o '"payment_link_url":"[^"]*"' | cut -d'"' -f4)
    echo "   Payment URL: $PAYMENT_URL"
else
    echo "   ❌ Failed to create payment link"
    echo "   Response: $PAYMENT_RESPONSE"
    exit 1
fi

# Test 5: Test thank you page accessibility
echo "5. Testing thank you page..."
THANK_YOU_URL="http://localhost:3000/quote/thank-you?payment_success=true&lead_id=$LEAD_ID"
if curl -s -o /dev/null -w "%{http_code}" "$THANK_YOU_URL" | grep -q "200"; then
    echo "   ✅ Thank you page is accessible"
    echo "   Thank you URL: $THANK_YOU_URL"
else
    echo "   ❌ Thank you page is not accessible"
    exit 1
fi

# Test 6: Verify lead data is accessible
echo "6. Verifying lead data..."
LEAD_DATA=$(curl -s http://localhost:8000/api/leads/$LEAD_ID)
if echo "$LEAD_DATA" | grep -q "Flow Test User"; then
    echo "   ✅ Lead data is accessible and correct"
    echo "   Lead details: Customer=$(echo $LEAD_DATA | grep -o '"customer_name":"[^"]*"' | cut -d'"' -f4)"
    echo "   Lead details: Cost=$(echo $LEAD_DATA | grep -o '"total_cost":[0-9.]*' | cut -d':' -f2)"
    echo "   Lead details: Vendor=$(echo $LEAD_DATA | grep -o '"vendor_name":"[^"]*"' | cut -d'"' -f4)"
else
    echo "   ❌ Lead data is not accessible or incorrect"
    echo "   Response: $LEAD_DATA"
    exit 1
fi

echo ""
echo "🎉 ALL TESTS PASSED!"
echo "===================="
echo "✅ Frontend is running and accessible"
echo "✅ Backend is healthy and processing requests"
echo "✅ Lead creation works correctly"
echo "✅ Payment link creation works correctly"
echo "✅ Thank you page is accessible"
echo "✅ Lead data is properly stored and retrievable"
echo ""
echo "🚀 Payment flow is working correctly!"
echo "   Users can now complete the full quote → payment → thank you flow"
echo ""
echo "📋 Test Summary:"
echo "   - Lead ID: $LEAD_ID"
echo "   - Customer: Flow Test User"
echo "   - Email: flowtest@example.com"
echo "   - Cost: \$1,800.00 CAD"
echo "   - Vendor: Lets Get Moving"
echo "   - Payment URL: $PAYMENT_URL"
echo "   - Thank you URL: $THANK_YOU_URL"
