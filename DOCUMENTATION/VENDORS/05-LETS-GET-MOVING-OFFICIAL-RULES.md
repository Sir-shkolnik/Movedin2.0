# 🚛 **Let's Get Moving - VENDOR RULES & CALCULATIONS**

**Date:** August 3, 2025  
**Vendor:** Let's Get Moving  
**Source:** ❌ **NO OFFICIAL DOCUMENT AVAILABLE**  
**Status:** ⚠️ **NEEDS VENDOR VERIFICATION**

## 📋 **VENDOR OVERVIEW**

**Let's Get Moving** is a professional moving company with extensive coverage across multiple regions. They operate with a sophisticated Google Sheets-based system for real-time pricing and availability.

### **🏢 Company Information**
- **Service Areas:** Multiple regions across Canada with extensive dispatcher network
- **Specialization:** Residential and commercial moves with real-time availability
- **Technology:** Google Sheets integration for live pricing and scheduling

## ⚠️ **IMPORTANT NOTICE**

### **❌ No Official Source Document Available**

**Let's Get Moving** is the only vendor for which we do **NOT** have official pricing documentation from the source. The current implementation is based on:

1. **Historical data** from the old application
2. **Inferred pricing** from existing calculations
3. **Assumptions** based on industry standards

### **🔍 Verification Required**

**Action Required:** Contact Let's Get Moving directly to obtain official pricing rules and verify current implementation accuracy.

## 📊 **CURRENT IMPLEMENTATION (UNVERIFIED)**

### **💰 Hourly Rate Calculation**
```python
def _calculate_hourly_rate(self, base_rate: float, crew_size: int, truck_count: int) -> float:
    """Calculate hourly rate based on crew size and truck count"""
    if truck_count == 1:
        if crew_size == 2: return base_rate
        elif crew_size == 3: return base_rate + 60
        elif crew_size == 4: return base_rate + 140
        else: return base_rate + 140
    elif truck_count == 2:
        if crew_size == 4: return 2 * base_rate + 20
        elif crew_size == 5: return 2 * base_rate + 80
        elif crew_size == 6: return 2 * base_rate + 140
        else: return 2 * base_rate + 140
    return base_rate
```

### **👥 Crew Size Calculation**
```python
def _get_base_crew_size(self, room_count: int) -> int:
    """Get base crew size from room count"""
    if room_count <= 3:
        return 2
    elif room_count == 4:
        return 3
    elif room_count <= 6:
        return 4
    else:
        return 5
```

### **🚛 Truck Count Calculation**
```python
def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
    """Get truck count based on crew size"""
    if crew_size <= 4:
        return 1
    else:
        return 2
```

### **⏱️ Travel Time Calculation**
```python
def _calculate_travel_time(self, origin: str, destination: str) -> float:
    """Calculate travel time using Mapbox API with 3-leg journey and truck factor"""
    try:
        dispatcher_address = "Toronto, ON" # Central GTA location as fallback
        leg1 = mapbox_service.get_directions(dispatcher_address, origin)
        leg2 = mapbox_service.get_directions(origin, destination)
        leg3 = mapbox_service.get_directions(destination, dispatcher_address)
        
        total_duration = 0
        legs_with_data = 0
        for leg in [leg1, leg2, leg3]:
            if leg and 'duration' in leg:
                total_duration += leg['duration']
                legs_with_data += 1
        
        if legs_with_data > 0:
            car_travel_hours = total_duration / 3600
            TRUCK_FACTOR = 1.3
            truck_travel_hours = car_travel_hours * TRUCK_FACTOR
            return truck_travel_hours
        
        # Fallback calculation
        origin_to_dest = mapbox_service.get_directions(origin, destination)
        if origin_to_dest and 'duration' in origin_to_dest:
            one_way_hours = origin_to_dest['duration'] / 3600
            car_three_leg_hours = one_way_hours * 2.5
            TRUCK_FACTOR = 1.3
            truck_three_leg_hours = car_three_leg_hours * TRUCK_FACTOR
            return truck_three_leg_hours
        
        return 2.0 * 1.3
    except Exception as e:
        return 2.0 * 1.3
```

## 🧪 **CURRENT TESTING RESULTS**

### **Test Results (Unverified Accuracy)**

#### **2-Bedroom Move Test**
```bash
curl -X POST "https://movedin-backend.onrender.com/api/generate" -d '{
  "origin_address": "Toronto, ON",
  "destination_address": "Mississauga, ON",
  "total_rooms": 2
}'
```
**Result:**
```json
{
  "vendor_name": "Let's Get Moving",
  "crew_size": 2,
  "truck_count": 1,
  "hourly_rate": 150.0,        ⚠️ Unverified
  "total_cost": 1050.0         ⚠️ Unverified
}
```

#### **4-Bedroom Move Test**
```bash
curl -X POST "https://movedin-backend.onrender.com/api/generate" -d '{
  "origin_address": "Toronto, ON",
  "destination_address": "Mississauga, ON",
  "total_rooms": 4
}'
```
**Result:**
```json
{
  "vendor_name": "Let's Get Moving",
  "crew_size": 3,
  "truck_count": 1,
  "hourly_rate": 210.0,        ⚠️ Unverified
  "total_cost": 1365.0         ⚠️ Unverified
}
```

## 📁 **SOURCE DOCUMENTATION STATUS**

### **❌ Missing Official Documentation**
- **No PDF pricing document** found in source files
- **No email correspondence** with official rates
- **No text file** with pricing structure
- **No screenshot** of official pricing

### **📂 Available Files (Non-Pricing)**
- `oldappdata/vendor/letsgetmoving/` - Implementation files
- `oldappdata/vendor/letsgetmoving/dispatchers/` - Dispatcher data
- `oldappdata/vendor/letsgetmoving/letsgetmoving.php` - PHP implementation
- `oldappdata/vendor/letsgetmoving/README.md` - Technical documentation

## 🎯 **BUSINESS IMPLICATIONS**

### **⚠️ Current Risks**
- **Unverified Pricing:** Rates may not match official vendor pricing
- **Potential Disputes:** Customers may question quote accuracy
- **Vendor Relationship:** Risk of misrepresenting vendor pricing
- **Legal Compliance:** Potential issues with pricing accuracy

### **💰 Pricing Strategy (Assumed)**
- **Competitive Rates:** Appears to be market competitive
- **Scalable Model:** Rates increase with crew size and truck count
- **Geographic Coverage:** Extensive service area coverage

## 🔍 **IMPLEMENTATION NOTES**

### **⚠️ Current Status**
- **Implementation:** Based on assumptions and historical data
- **Testing:** Functional but unverified accuracy
- **Deployment:** Production ready but needs verification

### **📊 Calculation Accuracy**
- **Hourly Rates:** ⚠️ Unverified against official rates
- **Crew Sizing:** ⚠️ Unverified against official rules
- **Truck Assignment:** ⚠️ Unverified against official rules
- **Travel Time:** ⚠️ Unverified against official rules

## 🚀 **IMMEDIATE ACTION REQUIRED**

### **🔥 High Priority Tasks**
1. **Contact Let's Get Moving** for official pricing documentation
2. **Request official rate sheet** or pricing structure
3. **Verify current implementation** against official rules
4. **Update implementation** if discrepancies found

### **📞 Contact Information Needed**
- **Email:** support@movedin.com (for vendor communication)
- **Vendor Contact:** Let's Get Moving business contact
- **Request:** Official pricing rules and rate structure

## 📋 **VERIFICATION CHECKLIST**

### **Required Information**
- [ ] **Official hourly rates** for different crew sizes
- [ ] **Truck fee structure** and calculation method
- [ ] **Crew size determination** rules
- [ ] **Truck count assignment** rules
- [ ] **Travel time calculation** method
- [ ] **Distance-based pricing** rules
- [ ] **Additional service** pricing
- [ ] **Minimum booking** requirements

### **Documentation Format**
- [ ] **PDF rate sheet** (preferred)
- [ ] **Email with rates** (acceptable)
- [ ] **Text file with rules** (acceptable)
- [ ] **Screenshot of pricing** (acceptable)

## 🎉 **CONCLUSION**

### **⚠️ Critical Status**
- **Let's Get Moving** is the only vendor without official documentation
- **Current implementation** is functional but unverified
- **Immediate action required** to obtain official pricing rules

### **🚀 Next Steps**
1. **Contact vendor** for official pricing documentation
2. **Verify current rates** against official rules
3. **Update implementation** if needed
4. **Test and deploy** verified changes

### **📊 Impact Assessment**
- **Customer Experience:** May be affected by unverified pricing
- **Vendor Relationships:** Risk of misrepresentation
- **Business Credibility:** Potential accuracy issues
- **Legal Compliance:** Risk of pricing disputes

---

**Document Version:** 1.0  
**Last Updated:** August 3, 2025  
**Source:** ❌ **NO OFFICIAL DOCUMENT AVAILABLE**  
**Implementation Status:** ⚠️ **NEEDS VENDOR VERIFICATION**  
**Priority:** 🔥 **HIGH - IMMEDIATE ACTION REQUIRED** 