# 🚚 Let's Get Moving Pricing Model Update - August 2025

## 📋 **Executive Summary**

**Date:** August 22, 2025  
**Status:** 🔄 **IMPLEMENTATION REQUIRED**  
**Priority:** 🚨 **HIGH - BUSINESS CRITICAL**  
**Vendor:** Let's Get Moving  
**Impact:** All 49 locations across 8 Canadian provinces  

---

## 📧 **Email Communication Summary**

### **From:** Tiam <tiam@letsgetmovinggroup.com>  
**Subject:** Re: Important Update – New Pricing Model Effective Wednesday, August 20, 2025  
**Date:** August 22, 2025 at 5:36:57 PM EDT  

### **Key Changes Announced:**

1. **❌ NO MORE Dock-to-Dock Billing**
   - Old: Charged from office departure to office return
   - New: Hourly rates only during actual job time (origin to destination)

2. **🆕 New Truck Fee Structure (Travel Time Based):**
   - **0-59 minutes**: 1 hour flat rate
   - **1:00-1:44**: 1.5 hours flat rate  
   - **Over 1:44**: $4.50 per mile per truck

3. **⏰ Travel Time Calculation:**
   - Office → Origin (one way)
   - Destination → Office (return)
   - **NOT** Origin → Destination (this stays as hourly billing)

---

## 🔍 **Current System Analysis**

### **📍 What We Currently Do (WRONG - Dock-to-Dock):**

```python
# Current system: 3-leg journey (Dock-to-Dock)
def _calculate_travel_time(self, origin: str, destination: str) -> float:
    # Leg 1: Dispatcher -> Origin
    leg1 = mapbox_service.get_directions(dispatcher_address, origin)
    # Leg 2: Origin -> Destination  
    leg2 = mapbox_service.get_directions(origin, destination)
    # Leg 3: Destination -> Dispatcher
    leg3 = mapbox_service.get_directions(destination, dispatcher_address)
    
    # ALL legs are included in hourly billing (WRONG!)
    total_billable_hours = labor_hours + travel_hours
```

### **💰 Current Pricing Formula:**
```
Total Cost = (Base Rate × Crew Multiplier × Total Billable Hours) + 
             Fuel Charge + Heavy Items + Additional Services

Where:
- Base Rate = Live Google Sheets rate for selected date and location
- Crew Multiplier = Based on crew size and truck count
- Total Billable Hours = Labor hours + ALL travel time (3-leg journey) ❌ WRONG
- Fuel Charge = Distance-based table lookup
- Heavy Items = Fixed rates per item type
```

### **🌍 Current Coverage:**
- **Locations:** 49 active location tabs
- **Provinces:** 8 Canadian provinces
- **Data Source:** Google Sheets (ID: 1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA)
- **Update Frequency:** 4-hour cache TTL

---

## 🎯 **New System Requirements**

### **✅ What We Need to Implement:**

```python
# New system: Separate travel fees + job time
def calculate_quote(self, quote_request: QuoteRequest, dispatcher_info: Dict[str, Any], db: Session = None) -> Dict[str, Any]:
    # 1. Calculate job time (origin to destination only)
    job_hours = labor_hours + origin_to_destination_travel
    
    # 2. Calculate travel fees (office to origin + destination to office)
    travel_fees = self._calculate_travel_fees(origin, destination)
    
    # 3. Total = Job time × hourly rate + Travel fees
    total_cost = (job_hours × hourly_rate) + travel_fees
```

### **🚛 New Truck Fee Structure:**
```python
def _calculate_travel_fees(self, origin: str, destination: str) -> float:
    # Calculate total travel time: Office → Origin + Destination → Office
    office_to_origin = self._get_travel_time(dispatcher_address, origin)
    dest_to_office = self._get_travel_time(destination, dispatcher_address)
    total_travel_time = office_to_origin + dest_to_office
    
    # Apply new tiered pricing
    if total_travel_time <= 0.983:  # 59 minutes
        return hourly_rate * 1.0  # 1 hour flat
    elif total_travel_time <= 1.733:  # 1 hour 44 minutes
        return hourly_rate * 1.5  # 1.5 hours flat
    else:
        # Long distance: $4.50 per mile per truck
        total_miles = self._calculate_total_miles(origin, destination)
        return total_miles * 4.50 * truck_count
```

### **⏰ Time Increments (15-minute rounding):**
```python
TIME_ROUNDING = {
    "0-14 min": 0.25,    # 15 minutes
    "15-29 min": 0.5,    # 30 minutes
    "30-44 min": 0.75,   # 45 minutes
    "45-59 min": 1.0,    # 1 hour
    "1:00-1:14": 1.25,   # 1 hour 15 minutes
    "1:15-1:29": 1.5,    # 1 hour 30 minutes
    "1:30-1:44": 1.75    # 1 hour 45 minutes
}
```

---

## 📊 **Example Calculations**

### **Example 1: Local Move (Short Distance)**
**Scenario:** 30 minutes drive from office to origin, 2 hours loading, 30 minutes drive to destination, 2 hours unloading, and 15 minutes drive back to office.

**Old Model (Dock to Dock):**
```
Total = 5.25 hours × $149 = $782.25
```

**New Model (Travel Time + Job Time):**
```
Travel Time: 30 min office→origin + 15 min destination→office = 45 min
Falls under "up to 59 minutes" = 1 Truck Fee = $149

Job Time: 2 hours loading + 0.5 hours drive + 2 hours unloading = 4.5 hours × $149 = $670.50

Grand Total = $819.50
```

### **Example 2: Long Distance Move**
**Scenario:** Office → Origin: 10 miles (≈ 15 min), Loading: 2.0 hrs, Origin → Destination: 120 miles (≈ 2 hrs), Unloading: 2.0 hrs, Destination → Office: 115 miles (≈ 2 hrs)

**Old Model (Dock to Dock):**
```
Count everything: office departure → office return
Time = 15 min + 120 min + 120 min + 120 min + 120 min = 8.0 hrs
8.0 hrs × $149 = $1,192.00 + Fuel Fee $260 = $1452.00
```

**New Model (Travel Time + Job Time):**
```
Travel Distance (long distance):
Office → Origin = 10 miles
Destination → Office = 115 miles
Total travel miles = 125
125 × $4.50 = $562.50

Job Time:
Loading + Drive Origin → Destination + Unloading
2.0 hrs + 2.0 hrs + 2.0 hrs = 6.0 hrs
6.0 × $149 = $894.00

Grand Total = $562.50 + $894.00 = $1,456.50
```

---

## 🚀 **Implementation Plan**

### **Phase 1: Core Calculation Logic Updates** ⏱️ **Day 1**
- [ ] Update `LetsGetMovingCalculator.calculate_quote()` method
- [ ] Add `_calculate_travel_fees()` method
- [ ] Add `_calculate_origin_to_destination_travel()` method
- [ ] Update total cost calculation

### **Phase 2: Fuel Charge Updates** ⏱️ **Day 1**
- [ ] Modify `_calculate_fuel_charge()` method
- [ ] Apply fuel charges only to long distance moves
- [ ] Update fuel charge thresholds

### **Phase 3: Response Structure Updates** ⏱️ **Day 1**
- [ ] Update quote response breakdown
- [ ] Add new fields for travel fees
- [ ] Add pricing model indicator

### **Phase 4: Configuration & Validation** ⏱️ **Day 2**
- [ ] Add new constants and thresholds
- [ ] Add validation methods
- [ ] Update error handling

### **Phase 5: Testing & Deployment** ⏱️ **Day 2-3**
- [ ] Test with real data from various locations
- [ ] Validate against email examples
- [ ] Deploy to production
- [ ] Monitor and validate

---

## 🔧 **Technical Implementation Details**

### **Files to Modify:**

1. **`backend/app/services/vendor_engine.py`** (lines 910-1200)
   - Main calculator class: `LetsGetMovingCalculator`
   - Crew sizing logic, hourly rate calculations, fuel charges

2. **`backend/app/services/letsgetmoving/smart_calendar_parser.py`**
   - Calendar data extraction from CSV
   - Date pattern recognition
   - Rate parsing logic

3. **`backend/app/services/google_sheets_service.py`**
   - Google Sheets integration
   - Data fetching and caching
   - CSV processing

4. **`backend/app/services/dispatcher_cache_service.py`**
   - Data caching and management
   - Cache invalidation logic

### **New Methods to Add:**

```python
def _calculate_travel_fees(self, origin: str, destination: str, hourly_rate: float, truck_count: int) -> float
def _calculate_origin_to_destination_travel(self, origin: str, destination: str) -> float
def _get_travel_time_hours(self, origin: str, destination: str) -> float
def _calculate_total_miles(self, origin: str, destination: str) -> float
def _validate_travel_fee_calculation(self, origin: str, destination: str, travel_fees: float) -> bool
```

---

## 🧪 **Testing Strategy**

### **Test Case 1: Local Move (Under 59 minutes)**
```python
# Input: 30 min office→origin + 15 min dest→office = 45 min total
# Expected: 1 hour flat rate × hourly rate × truck count
# No fuel charges
```

### **Test Case 2: Extended Local (1:00-1:44)**
```python
# Input: 45 min office→origin + 30 min dest→office = 1:15 total
# Expected: 1.5 hours flat rate × hourly rate × truck count
# No fuel charges
```

### **Test Case 3: Long Distance (Over 1:44)**
```python
# Input: 2 hours office→origin + 1.5 hours dest→office = 3:30 total
# Expected: $4.50 × total miles × truck count
# Plus fuel charges based on existing table
```

---

## 📈 **Business Impact**

### **✅ Benefits:**
- **Greater Accuracy**: Fair pricing based on actual travel distance
- **Transparency**: Clear separation between job time and travel fees
- **Flexibility**: Better booking process for locations
- **Competitiveness**: More accurate pricing for customers

### **⚠️ Risks:**
- **Pricing Changes**: Some moves may be more expensive
- **Customer Education**: Need to explain new pricing model
- **System Complexity**: More complex calculation logic

### **🎯 Success Metrics:**
- **Booking Percentage**: Return to optimal levels
- **Customer Satisfaction**: Maintain or improve ratings
- **Revenue Accuracy**: Better alignment with actual costs
- **System Performance**: Maintain <2 second response times

---

## 📋 **Deployment Checklist**

### **Pre-Deployment:**
- [ ] All code changes implemented
- [ ] Comprehensive testing completed
- [ ] Validation against email examples
- [ ] Performance testing passed
- [ ] Backup of current system

### **Deployment:**
- [ ] Deploy to staging environment
- [ ] Final validation
- [ ] Deploy to production
- [ ] Monitor system health

### **Post-Deployment:**
- [ ] Monitor quote accuracy
- [ ] Track customer feedback
- [ ] Validate against actual invoices
- [ ] Performance monitoring
- [ ] Error rate monitoring

---

## 🔄 **Rollback Plan**

### **If Issues Arise:**
1. **Immediate Rollback**: Revert to previous version
2. **Investigation**: Identify root cause
3. **Fix**: Implement corrections
4. **Re-deploy**: Test and deploy again

### **Rollback Triggers:**
- System errors > 5%
- Response time > 5 seconds
- Incorrect pricing calculations
- Customer complaints > 10%

---

## 📞 **Stakeholder Communication**

### **Internal Team:**
- **Development Team**: Implementation updates
- **QA Team**: Testing coordination
- **Operations Team**: Deployment support
- **Support Team**: Customer communication preparation

### **External Stakeholders:**
- **Let's Get Moving**: Implementation status updates
- **Franchisees**: New pricing model explanation
- **Sales Team**: Training on new system

---

## 📅 **Timeline**

| Phase | Duration | Status | Target Date |
|-------|----------|---------|-------------|
| **Phase 1** | 1 day | 🔄 **IN PROGRESS** | August 23, 2025 |
| **Phase 2** | 1 day | ⏳ **PENDING** | August 23, 2025 |
| **Phase 3** | 1 day | ⏳ **PENDING** | August 23, 2025 |
| **Phase 4** | 1 day | ⏳ **PENDING** | August 24, 2025 |
| **Phase 5** | 1-2 days | ⏳ **PENDING** | August 25-26, 2025 |

**Total Implementation Time:** 4-5 days  
**Target Completion:** August 26, 2025  

---

## 🎯 **Next Steps**

1. **Immediate**: Begin Phase 1 implementation
2. **Today**: Complete core calculation logic updates
3. **Tomorrow**: Complete configuration and validation
4. **Day 3**: Testing and deployment
5. **Ongoing**: Monitor and validate system performance

---

**Document Version:** 1.0  
**Last Updated:** August 22, 2025  
**Author:** Development Team  
**Status:** 🔄 **IMPLEMENTATION IN PROGRESS**
