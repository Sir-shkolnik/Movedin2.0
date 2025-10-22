# Manual Test Checklist - Quote Wizard

## 🧪 Test Instructions

### **Step 1: Start the Application**
```bash
cd "/Users/udishkolnik/Downloads/Movedin2.0 3/MovedinV3.0/frontend"
npm run dev
```
✅ Server should start on http://localhost:5173

---

## 📋 Test Checklist

### **Test 1: Progress Indicator**
- [ ] Navigate to http://localhost:5173/quote
- [ ] Verify progress bar at top shows 0%
- [ ] Verify "Step 1 of 8" in top-right corner
- [ ] Click "Continue" to next step
- [ ] Verify progress bar increases
- [ ] Verify step number updates

**Expected**: Progress bar fills smoothly, step number updates

---

### **Test 2: Date & Address Step**
- [ ] Enter "From" address using Mapbox autocomplete
- [ ] Enter "To" address using Mapbox autocomplete
- [ ] Select a move date
- [ ] Select a move time
- [ ] Verify all fields have data
- [ ] Click "Continue"

**Expected**: All fields save data, navigation works

---

### **Test 3: From Details Step**
- [ ] Select home type (e.g., House)
- [ ] Select number of rooms (e.g., 4)
- [ ] Select square footage (e.g., 1500-2000)
- [ ] Select number of floors (if house)
- [ ] Select garage (if house)
- [ ] Select number of stairs
- [ ] Select heavy items (e.g., Piano)
- [ ] Select additional services (e.g., Packing)
- [ ] Click "Continue"

**Expected**: All fields save data, conditional fields appear

---

### **Test 4: To Details Step - "Same as From"**
- [ ] Verify "Same as From" checkbox is visible
- [ ] Check the "Same as From" checkbox
- [ ] Verify all fields auto-populate from "From" details
- [ ] Click "Continue"

**Expected**: All details copy from "From" step

---

### **Test 5: Service Step**
- [ ] Select "Packing Assistance"
- [ ] Select "Storage"
- [ ] Verify selected services show checkmark
- [ ] Verify confirmation message appears
- [ ] Click "Continue"

**Expected**: Services save to FormContext, visual feedback works

---

### **Test 6: Contact Step - Validation**
- [ ] Enter name: "John Doe"
- [ ] Enter email: "john@example.com"
- [ ] Verify green checkmark appears
- [ ] Enter invalid email: "john@"
- [ ] Verify error message appears
- [ ] Enter valid email: "john@example.com"
- [ ] Verify error disappears
- [ ] Enter phone: "4165551234"
- [ ] Verify green checkmark appears
- [ ] Enter invalid phone: "123"
- [ ] Verify error message appears
- [ ] Enter valid phone: "4165551234"
- [ ] Verify error disappears
- [ ] Select "Get updates via SMS"
- [ ] Select "Preferred contact method: Both"
- [ ] Click "Continue"

**Expected**: Validation works, visual feedback shows, data saves

---

### **Test 7: Vendors Step - Local Move**
- [ ] Verify loading spinner appears
- [ ] Verify "Finding the best movers for you..." message
- [ ] Wait for quotes to load
- [ ] Verify 4 vendor cards appear
- [ ] Verify all show hourly rate (not total cost)
- [ ] Verify all show crew size, trucks, estimated hours
- [ ] Click "Sort by Price" dropdown
- [ ] Select "Sort by Rating"
- [ ] Verify vendors re-sort
- [ ] Click "Sort by Hours"
- [ ] Verify vendors re-sort
- [ ] Click "Why this price?" on a vendor
- [ ] Verify breakdown expands
- [ ] Verify breakdown shows: Labor, Travel Fees, Fuel, Heavy Items
- [ ] Click a vendor card
- [ ] Verify card highlights with purple border
- [ ] Click "Continue"

**Expected**: All quotes load, sorting works, breakdown works, selection works

---

### **Test 8: Payment Step**
- [ ] Verify total cost is displayed
- [ ] Verify deposit is $100.00 CAD
- [ ] Verify remaining balance is calculated
- [ ] Verify "Pay $100.00 Deposit" button text
- [ ] Click "Continue"

**Expected**: $100 deposit shown, balance calculated correctly

---

### **Test 9: Review Step - Map & Print**
- [ ] Verify map loads with 3 markers:
  - Purple marker (Dispatcher)
  - Green marker (From)
  - Red marker (To)
- [ ] Verify map centers on "From" location
- [ ] Verify 3 trucks animate along route
- [ ] Verify trucks follow 3-legged journey
- [ ] Click "Print" button
- [ ] Verify print dialog opens
- [ ] Click "Download" button
- [ ] Verify text file downloads
- [ ] Click "Continue"

**Expected**: Map shows 3-legged journey, print works, download works

---

### **Test 10: Thank You Step**
- [ ] Verify success checkmark appears
- [ ] Verify "Thank You!" message
- [ ] Verify "What's Next?" timeline appears
- [ ] Verify 3 steps shown:
  - Confirmation Email
  - Vendor Contact
  - Move Date
- [ ] Verify total cost displayed
- [ ] Verify vendor name displayed
- [ ] Click "Return to Home"

**Expected**: All information displayed correctly

---

## 🚛 Test 11: Long-Distance Move Detection

### **Scenario A: Inter-Province Move**
- [ ] Navigate to http://localhost:5173/quote
- [ ] Enter "From": "Toronto, ON"
- [ ] Enter "To": "Vancouver, BC"
- [ ] Select date and time
- [ ] Complete From Details
- [ ] Complete To Details
- [ ] Complete Service Step
- [ ] Complete Contact Step
- [ ] Navigate to Vendors Step
- [ ] Wait for quotes to load
- [ ] Verify all 4 vendors show:
  - Amber-themed card (#FFFBEB background)
  - "📞 Needs Specialist" badge
  - Explanation about long-distance move
  - "📞 Request Callback from Specialist" button
- [ ] Click "Request Callback" on one vendor
- [ ] Verify success alert appears
- [ ] Verify callback request saved to form data

**Expected**: All vendors show callback request for long-distance moves

### **Scenario B: International Move**
- [ ] Navigate to http://localhost:5173/quote
- [ ] Enter "From": "Toronto, ON"
- [ ] Enter "To": "New York, NY, USA"
- [ ] Complete all steps
- [ ] Navigate to Vendors Step
- [ ] Verify all 4 vendors show callback request

**Expected**: All vendors show callback request for international moves

---

## 🎯 Test 12: Data Persistence

- [ ] Start quote wizard
- [ ] Fill in Step 1 (Date & Address)
- [ ] Navigate to Step 2
- [ ] Click "Back" button
- [ ] Verify Step 1 data is still there
- [ ] Fill in Step 2 (From Details)
- [ ] Navigate to Step 3
- [ ] Click "Back" button
- [ ] Verify Step 2 data is still there
- [ ] Continue through all steps
- [ ] Refresh the page
- [ ] Verify all data persists

**Expected**: All data persists across navigation and page refresh

---

## 📱 Test 13: Mobile Responsiveness

- [ ] Open browser DevTools
- [ ] Select "iPhone 14 Pro Max" (430x932)
- [ ] Navigate through all steps
- [ ] Verify:
  - Progress bar visible
  - Step number visible
  - All fields readable
  - Buttons accessible
  - Map responsive
  - No horizontal scrolling
- [ ] Test on different breakpoints:
  - Small phones (375px)
  - Large phones (414px)
  - Tablets (768px)
  - Desktops (1440px)

**Expected**: All breakpoints work correctly

---

## 🐛 Test 14: Error Handling

### **Scenario A: Invalid Email**
- [ ] Navigate to Contact Step
- [ ] Enter invalid email: "test@"
- [ ] Verify error message: "Please enter a valid email address"
- [ ] Verify error is red
- [ ] Fix email: "test@example.com"
- [ ] Verify error disappears
- [ ] Verify green checkmark appears

**Expected**: Validation works, errors clear when fixed

### **Scenario B: Missing Required Fields**
- [ ] Navigate to Vendors Step without filling previous steps
- [ ] Verify error message appears
- [ ] Go back and fill required fields
- [ ] Return to Vendors Step
- [ ] Verify quotes load

**Expected**: Error handling prevents invalid submissions

---

## 🎨 Test 15: Visual Design

- [ ] Verify all purple elements use #5340FF
- [ ] Verify all green elements use #10B981
- [ ] Verify all red elements use #EF4444
- [ ] Verify all amber elements use #F59E0B
- [ ] Verify all buttons have hover states
- [ ] Verify all transitions are smooth
- [ ] Verify all icons are clear
- [ ] Verify all text is readable

**Expected**: Consistent design throughout

---

## 📊 Test Results

### **Total Test Cases**: 15
### **Passed**: ___
### **Failed**: ___
### **Notes**: ___

---

## ✅ Sign-Off

**Tester Name**: ________________
**Date**: ________________
**Status**: ⬜ Pass ⬜ Fail ⬜ Partial
**Comments**: ________________

---

**Last Updated**: 2025-01-26
**Version**: 1.0

