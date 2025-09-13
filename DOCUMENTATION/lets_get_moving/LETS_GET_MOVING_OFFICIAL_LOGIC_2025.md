# Let's Get Moving - Official Pricing Logic 2025

## 🎯 **OFFICIAL LGM PRICING MATRIX**

Based on the official Let's Get Moving pricing matrix and business rules.

### **Truck & Crew Matrix**

| Trucks | Crew Size | Local Rate | Long Distance Rate | Notes |
|--------|-----------|------------|-------------------|-------|
| **1 Truck** | 2 crew | $119/h | $119/h | Base rate |
| **1 Truck** | 3 crew | $179/h | $179/h | Standard rate |
| **1 Truck** | 4 crew | $259/h | $179/h | 4th person local only |
| **2 Trucks** | 4 crew | $238/h | $238/h | 2-truck rate |
| **2 Trucks** | 5 crew | $298/h | $298/h | 2-truck rate |
| **2 Trucks** | 6 crew | $358/h | $358/h | 2-truck rate |
| **3 Trucks** | 6+ crew | $358/h | $358/h | 3-truck rate |

### **Important Business Rules**

1. **Crew Limitations**:
   - Only 3-men crew for long-distance moves
   - 4th person can be offered for local moves only
   - For long-distance: 4th person helps with loading locally
   - Offloading must be done by 3 men (truck seating limit)

2. **Minimum Labor Time**:
   - **2 hours minimum** for all moves
   - Additional time based on room count and complexity

3. **Travel Time**:
   - **Full hourly rate** for travel time (not reduced rate)
   - Minimum 30 minutes travel time
   - Based on actual Mapbox travel time

## 💰 **PRICING CALCULATION LOGIC**

### **Step 1: Determine Crew Size & Trucks**
```python
# Based on room count
if total_rooms <= 2:
    crew_size = 2
    truck_count = 1
elif total_rooms <= 4:
    crew_size = 3
    truck_count = 1
elif total_rooms <= 6:
    crew_size = 4
    truck_count = 2
else:
    crew_size = 5
    truck_count = 2
```

### **Step 2: Get Hourly Rate from Matrix**
```python
# Check if long distance (travel time > 1h45m)
is_long_distance = travel_time_hours > 1.75

# Get rate from matrix
hourly_rate = get_hourly_rate_from_matrix(truck_count, crew_size, is_long_distance)
```

### **Step 3: Calculate Labor Cost**
```python
# Minimum 2 hours labor
labor_hours = max(2.0, estimated_hours) + stair_time
labor_cost = labor_hours * hourly_rate
```

### **Step 4: Calculate Travel Cost**
```python
# Full hourly rate for travel time
travel_hours = max(0.5, travel_time_hours)
travel_cost = travel_hours * hourly_rate
```

### **Step 5: Calculate Heavy Items**
```python
# Fixed price + small time addition
for each heavy_item:
    fixed_cost = item_price * quantity
    time_cost = time_addition * hourly_rate * quantity
    total_cost += fixed_cost + time_cost
```

### **Step 6: Calculate Gas Fees (Long Distance)**
```python
if is_long_distance:
    gas_fees = calculate_gas_fees(distance_km, truck_count)
```

## 📊 **HEAVY ITEMS PRICING**

| Item | Fixed Price | Time Addition | Total Cost Example |
|------|-------------|---------------|-------------------|
| **Piano** | $250 | 15 min | $250 + (0.25h × $179) = $294.75 |
| **Safe** | $300 | 30 min | $300 + (0.5h × $179) = $389.50 |
| **Pool Table** | $200 | 15 min | $200 + (0.25h × $179) = $244.75 |
| **Grand Piano** | $400 | 30 min | $400 + (0.5h × $179) = $489.50 |
| **Gun Safe** | $350 | 30 min | $350 + (0.5h × $179) = $439.50 |
| **Treadmill** | $100 | 15 min | $100 + (0.25h × $179) = $144.75 |
| **Antique Furniture** | $150 | 15 min | $150 + (0.25h × $179) = $194.75 |
| **Artwork** | $100 | 15 min | $100 + (0.25h × $179) = $144.75 |

## ⛽ **LONG DISTANCE GAS FEES**

### **Threshold**: Travel time > 1h45m (1.75 hours)

| Distance | Base Fee | Per KM | Example (100km) |
|----------|----------|--------|-----------------|
| 50-100km | $50 | $0.80 | $50 + (50×$0.80) = $90 |
| 100-200km | $100 | $0.70 | $100 + (100×$0.70) = $170 |
| 200-300km | $150 | $0.60 | $150 + (100×$0.60) = $210 |
| 300km+ | $200 | $0.50 | $200 + (100×$0.50) = $250 |

## 🧮 **EXAMPLE CALCULATIONS**

### **Example 1: 3-Room Local Move**
- **Crew**: 3 people, 1 truck
- **Hourly Rate**: $179/h
- **Labor**: 2.0h × $179 = $358
- **Travel**: 0.5h × $179 = $89.50
- **Heavy Items**: $0
- **Gas Fees**: $0 (local)
- **Total**: $447.50 + 20% markup = $537.00

### **Example 2: 3-Room Move with Piano**
- **Crew**: 3 people, 1 truck
- **Hourly Rate**: $179/h
- **Labor**: 2.0h × $179 = $358
- **Travel**: 0.5h × $179 = $89.50
- **Heavy Items**: $250 + (0.25h × $179) = $294.75
- **Gas Fees**: $0 (local)
- **Total**: $742.25 + 20% markup = $890.70

### **Example 3: 5-Room Long Distance Move**
- **Crew**: 4 people, 2 trucks (long distance = 3 people max)
- **Hourly Rate**: $238/h (2-truck rate)
- **Labor**: 2.0h × $238 = $476
- **Travel**: 2.0h × $238 = $476
- **Heavy Items**: $0
- **Gas Fees**: $90 (100km distance)
- **Total**: $1,042 + 20% markup = $1,250.40

## ✅ **KEY DIFFERENCES FROM OLD SYSTEM**

1. **Matrix-Based Rates**: Different rates for different truck/crew combinations
2. **2-Hour Minimum**: Always minimum 2 hours labor time
3. **Full Travel Rate**: Travel time uses full hourly rate, not reduced
4. **Crew Limitations**: 4th person only for local moves
5. **Fixed Heavy Items**: Fixed prices + small time additions
6. **Long Distance Rules**: Different crew limits for long distance

---

*Last Updated: January 20, 2025*
*Based on Official LGM Pricing Matrix*
*System Status: Production Ready*
