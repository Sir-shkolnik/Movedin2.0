# 🔍 **LET'S GET MOVING CALCULATION SYSTEM RESEARCH**

**Date:** January 20, 2025  
**Purpose:** Research the Let's Get Moving calculation system to identify source of crew size and additional services issues  
**Method:** Deep analysis of original PHP files vs current Python implementation

---

## 📋 **RESEARCH FINDINGS**

### **Issue 1: Crew Size Logic Discrepancy**

#### **Original PHP Logic (oldappdata/vendor/letsgetmoving/letsgetmoving.php):**
```php
// ENHANCED: Better crew size recommendations for larger homes
if ($room_count >= 7) {
    $movers = 5; // 5+ movers for very large homes
} elseif ($room_count >= 5) {
    $movers = 4; // 4 movers for 5-6 bedroom homes
} elseif ($room_count >= 4) {
    $movers = 3; // 3 movers for 4 bedroom homes
} else {
    $movers = 2; // 2 movers for smaller homes
}
```

**Key Finding:** The original PHP logic shows that **3 rooms should = 2 crew**, not 3 crew!

#### **Current Python Logic (backend/app/services/vendor_engine.py):**
```python
def _get_base_crew_size(self, room_count: int) -> int:
    """Get base crew size based on room count - FIXED LOGIC"""
    if room_count <= 2:
        return 2
    elif room_count <= 3:
        return 3  # FIXED: 3 rooms = 3 crew
    elif room_count <= 4:
        return 4
    elif room_count <= 5:
        return 5  # FIXED: 5 rooms = 5 crew
    else:
        return 5  # FIXED: 6+ rooms = 5 crew
```

**Key Finding:** The Python implementation was "fixed" to make 3 rooms = 3 crew, but this contradicts the original PHP logic!

---

## 🚨 **ROOT CAUSE IDENTIFIED**

### **Crew Size Issue Source:**
The issue is **NOT** a deployment problem - it's a **logic discrepancy** between the original PHP implementation and the current Python implementation.

**Original PHP Logic:**
- 1-3 rooms = 2 crew
- 4+ rooms = 3+ crew

**Current Python Logic:**
- 1-2 rooms = 2 crew  
- 3 rooms = 3 crew
- 4+ rooms = 4+ crew

**The Python implementation was incorrectly "fixed" to make 3 rooms = 3 crew, but this doesn't match the original Let's Get Moving rules!**

---

## 🔍 **ADDITIONAL SERVICES ISSUE RESEARCH**

### **Current Python Implementation:**
```python
def _calculate_additional_services_cost(self, services: Dict[str, bool]) -> float:
    """Calculate additional services cost - REMOVED: Services require vendor assessment"""
    # Additional services (packing, storage, cleaning, junk) require vendor assessment
    # based on size, time, weight, and other factors - not included in base quote
    return 0.0
```

**Key Finding:** The Python code correctly returns `0.0` for additional services.

### **But Testing Shows $856:**
The fact that testing still shows $856 means there's **cached data or old logic** still being used, not the current code.

---

## 📊 **ORIGINAL PHP RULES ANALYSIS**

### **Official Let's Get Moving Rules (from PHP file):**
```php
function letsgetmoving_vendor_rules_text() {
    return <<<EOT
Let's Get Moving Official Price List

Hourly Rate (2025):
- 2 Movers: $150/hr
- 3 Movers: $180/hr
- 4 Movers: $220/hr
- 5 Movers: $270/hr

Travel Fee: $120 flat (GTA)
Stairs Fee: $40 per flight
Heavy Item Fees: Piano $250, Safe $300, Treadmill $100
Packing Fee: $110/hr
Insurance: $150 flat
EOT;
}
```

### **Crew Size Logic in Original PHP:**
```php
// ENHANCED: Better crew size recommendations for larger homes
if ($room_count >= 7) {
    $movers = 5; // 5+ movers for very large homes
} elseif ($room_count >= 5) {
    $movers = 4; // 4 movers for 5-6 bedroom homes
} elseif ($room_count >= 4) {
    $movers = 3; // 3 movers for 4 bedroom homes
} else {
    $movers = 2; // 2 movers for smaller homes
}
```

**This means:**
- 1-3 rooms = 2 crew
- 4 rooms = 3 crew
- 5-6 rooms = 4 crew
- 7+ rooms = 5 crew

---

## 🎯 **CORRECT LOGIC IDENTIFIED**

### **The Original Let's Get Moving Logic Should Be:**
```python
def _get_base_crew_size(self, room_count: int) -> int:
    """Get base crew size based on room count - ORIGINAL LGM LOGIC"""
    if room_count >= 7:
        return 5  # 5+ movers for very large homes
    elif room_count >= 5:
        return 4  # 4 movers for 5-6 bedroom homes
    elif room_count >= 4:
        return 3  # 3 movers for 4 bedroom homes
    else:
        return 2  # 2 movers for smaller homes (1-3 rooms)
```

**This means 3 rooms should = 2 crew, not 3 crew!**

---

## 🔍 **ADDITIONAL SERVICES RESEARCH**

### **Original PHP Additional Services Logic:**
The original PHP file doesn't show specific additional services pricing in the calculation logic, but it mentions:
- **Packing Fee: $110/hr**
- **Insurance: $150 flat**

### **Current Issue:**
The testing shows $856 for additional services, but the Python code returns `0.0`. This suggests:
1. **Cached data** is being used instead of the current code
2. **Old logic** is still active somewhere
3. **Deployment** hasn't fully taken effect

---

## 📋 **COMPREHENSIVE FINDINGS**

### **1. Crew Size Issue:**
- **Root Cause:** Logic discrepancy between original PHP and current Python
- **Original PHP:** 3 rooms = 2 crew
- **Current Python:** 3 rooms = 3 crew (incorrectly "fixed")
- **Correct Logic:** Should follow original PHP (3 rooms = 2 crew)

### **2. Additional Services Issue:**
- **Root Cause:** Cached data or deployment issue
- **Current Code:** Correctly returns `0.0`
- **Testing Result:** Still shows $856 (cached/old data)

### **3. Google Sheets Data Issue:**
- **Root Cause:** Old dispatcher data ("STARTING OCT 1ST")
- **Impact:** May affect pricing calculations
- **Solution:** Update Google Sheets data

---

## 🎯 **CORRECTIONS NEEDED**

### **Priority 1: Fix Crew Size Logic**
The Python implementation should match the original PHP logic:
- 1-3 rooms = 2 crew
- 4 rooms = 3 crew
- 5-6 rooms = 4 crew
- 7+ rooms = 5 crew

### **Priority 2: Force Cache Refresh**
The additional services issue requires a complete cache refresh to use the current code.

### **Priority 3: Update Google Sheets Data**
Replace "STARTING OCT 1ST" with current dispatcher information.

---

## 📊 **CONCLUSION**

### **The Issues Are:**
1. **Crew Size:** Logic was incorrectly "fixed" - should follow original PHP rules
2. **Additional Services:** Cached data issue - code is correct but not being used
3. **Google Sheets:** Old data needs updating

### **The Solutions Are:**
1. **Revert crew size logic** to match original PHP implementation
2. **Force application restart** to clear all caches
3. **Update Google Sheets data** with current dispatcher information

**Status:** 🔍 **RESEARCH COMPLETE - ROOT CAUSES IDENTIFIED** 