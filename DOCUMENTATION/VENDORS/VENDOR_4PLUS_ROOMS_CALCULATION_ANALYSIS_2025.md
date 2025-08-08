# 🏠 **MovedIn 2.0 - VENDOR 4+ ROOMS CALCULATION ANALYSIS**

**Date:** August 3, 2025  
**System:** MovedIn 2.0 Backend Vendor Rules Analysis  
**Focus:** 4+ Room Houses - Crew Size, Truck Count, and Hourly Rate Calculations

## 📋 **EXECUTIVE SUMMARY**

Comprehensive testing of vendor rules for 4+ room houses reveals distinct calculation methodologies across all 4 vendors. Each vendor uses different approaches for crew size determination, truck allocation, and hourly rate calculations, resulting in significant pricing variations for larger moves.

### **🎯 Key Findings**
- **Let's Get Moving:** Room-based crew sizing with complex hourly rate calculations
- **Easy2Go:** Weight-based crew sizing with simple hourly rates
- **Velocity Movers:** Weight-based crew sizing with moderate hourly rates
- **Pierre & Sons:** Room-based crew sizing with fixed hourly rates

## 🔍 **VENDOR RULES ANALYSIS**

### **🚛 Let's Get Moving**

#### **Crew Size Rules (Room-Based)**
```python
def _get_base_crew_size(self, room_count: int) -> int:
    if room_count <= 3:
        return 2
    elif room_count == 4:
        return 3
    elif room_count <= 6:
        return 4
    else:
        return 5
```

#### **Truck Count Rules**
```python
def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
    if crew_size <= 4:
        return 1
    else:
        return 2
```

#### **Hourly Rate Calculation (Complex)**
```python
def _calculate_hourly_rate(self, base_rate: float, crew_size: int, truck_count: int) -> float:
    if truck_count == 1:
        if crew_size == 2:
            return base_rate  # e.g., $139
        elif crew_size == 3:
            return base_rate + 60  # e.g., $139 + $60 = $199
        elif crew_size == 4:
            return base_rate + 140  # e.g., $139 + $140 = $279
        else:
            return base_rate + 140  # Fallback
    
    elif truck_count == 2:
        if crew_size == 4:
            return 2 * base_rate + 20
        elif crew_size == 5:
            return 2 * base_rate + 80  # e.g., 2×$139 + $80 = $358
        elif crew_size == 6:
            return 2 * base_rate + 140
        else:
            return 2 * base_rate + 140  # Fallback
```

#### **Heavy Items Impact**
- **Minimum 3 crew** if any heavy items present
- **Overrides room-based** crew sizing

### **🚚 Easy2Go**

#### **Crew Size Rules (Weight-Based)**
```python
def _get_crew_size_from_weight(self, weight: float) -> int:
    weight_table = [
        [500, 1000, 2], [1000, 2000, 2], [2000, 3000, 2], [3000, 4000, 3],
        [4000, 5000, 3], [5000, 6000, 3], [6000, 7000, 3], [7000, 8000, 3],
        [8000, 9000, 3], [9000, 10000, 3], [10000, 11000, 4], [11000, 12000, 4],
        [12000, 13000, 5], [13000, 14000, 5], [14000, 15000, 5]
    ]
```

#### **Truck Count Rules (Weight-Based)**
```python
def _get_truck_count_from_weight(self, weight: float) -> int:
    weight_table = [
        [500, 1000, 1], [1000, 2000, 1], [2000, 3000, 1], [3000, 4000, 1],
        [4000, 5000, 1], [5000, 6000, 1], [6000, 7000, 1], [7000, 8000, 1],
        [8000, 9000, 1], [9000, 10000, 1], [10000, 11000, 2], [11000, 12000, 2],
        [12000, 13000, 2], [13000, 14000, 2], [14000, 15000, 2]
    ]
```

#### **Hourly Rate Calculation (Simple)**
```python
def _get_hourly_rate(self, crew_size: int) -> float:
    rates = {
        2: 150,  # 2 movers = $150/hr
        3: 200,  # 3 movers = $200/hr
        4: 250,  # 4 movers = $250/hr
        5: 300   # 5 movers = $300/hr
    }
    return rates.get(crew_size, 150)
```

### **🏃 Velocity Movers**

#### **Crew Size Rules (Weight-Based)**
```python
def _get_crew_size_from_weight(self, weight: float) -> int:
    weight_table = [
        [500, 1000, 2], [1000, 2000, 2], [2000, 3000, 2], [3000, 4000, 3],
        [4000, 5000, 3], [5000, 6000, 3], [6000, 7000, 3], [7000, 8000, 3],
        [8000, 9000, 3], [9000, 10000, 3], [10000, 11000, 4], [11000, 12000, 4],
        [12000, 13000, 5], [13000, 14000, 5], [14000, 15000, 5]
    ]
```

#### **Truck Count Rules (Weight-Based)**
```python
def _get_truck_count_from_weight(self, weight: float) -> int:
    weight_table = [
        [500, 1000, 1], [1000, 2000, 1], [2000, 3000, 1], [3000, 4000, 1],
        [4000, 5000, 1], [5000, 6000, 1], [6000, 7000, 1], [7000, 8000, 1],
        [8000, 9000, 1], [9000, 10000, 1], [10000, 11000, 2], [11000, 12000, 2],
        [12000, 13000, 2], [13000, 14000, 2], [14000, 15000, 2]
    ]
```

#### **Hourly Rate Calculation (Moderate)**
```python
def _get_hourly_rate(self, crew_size: int) -> float:
    rates = {
        2: 150,  # Two Movers: $150.00/hr
        3: 190,  # 3 movers: $190/hr
        4: 230,  # 4 movers: $230/hr
        5: 270   # 5 movers: $270/hr
    }
    return rates.get(crew_size, 150)
```

### **👨‍👦 Pierre & Sons**

#### **Crew Size Rules (Room-Based)**
```python
def get_crew_size(self, quote_request: QuoteRequest) -> int:
    rooms = quote_request.total_rooms
    crew = 2  # Default
    if rooms >= 6 or size == '5+ Bedrooms':
        crew = 5
    elif rooms >= 4 or size == '4 Bedrooms':
        crew = 4
    elif rooms >= 3 or size == '3 Bedrooms':
        crew = 3
    elif rooms >= 2 or size == '2 Bedrooms':
        crew = 2
    elif rooms == 1 or size == '1 Bedroom' or size == 'Studio':
        crew = 1
    
    # Minimum 2 for most moves
    if crew < 2:
        crew = 2
    return crew
```

#### **Truck Count Rules (Room-Based)**
```python
def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
    rooms = quote_request.total_rooms
    if rooms >= 4 or size == '4 Bedrooms' or size == '5+ Bedrooms':
        return 2  # Larger truck for bigger moves
    else:
        return 1  # Standard truck for smaller moves
```

#### **Hourly Rate Calculation (Fixed)**
```python
def _get_hourly_rate(self, crew_size: int) -> float:
    rates = {
        1: 65,   # $65/hr for 1 guy
        2: 135,  # $135/hr for 2 guys
        3: 165,  # $165/hr for 3 guys
        4: 195,  # $195/hr for 4 guys
        5: 225,  # $225/hr for 5 guys
        6: 255   # $255/hr for 6 guys
    }
    return rates.get(crew_size, 135)
```

## 📊 **TEST RESULTS COMPARISON**

### **🛣️ Route: Toronto → Mississauga (Local Move)**

#### **4 Rooms Test Results**
| Vendor | Crew Size | Truck Count | Hourly Rate | Total Cost |
|--------|-----------|-------------|-------------|------------|
| **Let's Get Moving** | 3 | 1 | $199.00 | $1,900.75 |
| **Easy2Go** | 3 | 1 | $200.00 | $1,984.63 |
| **Velocity Movers** | 3 | 1 | $190.00 | $2,045.56 |
| **Pierre & Sons** | 4 | 2 | $195.00 | $1,825.76 |

#### **5 Rooms Test Results**
| Vendor | Crew Size | Truck Count | Hourly Rate | Total Cost |
|--------|-----------|-------------|-------------|------------|
| **Let's Get Moving** | 4 | 1 | $279.00 | $2,699.84 |
| **Easy2Go** | 3 | 1 | $200.00 | $2,184.63 |
| **Velocity Movers** | 3 | 1 | $190.00 | $2,235.56 |
| **Pierre & Sons** | 4 | 2 | $195.00 | $2,020.76 |

#### **6 Rooms Test Results**
| Vendor | Crew Size | Truck Count | Hourly Rate | Total Cost |
|--------|-----------|-------------|-------------|------------|
| **Let's Get Moving** | 4 | 1 | $279.00 | $2,978.84 |
| **Easy2Go** | 3 | 1 | $200.00 | $2,184.63 |
| **Velocity Movers** | 3 | 1 | $190.00 | $2,235.56 |
| **Pierre & Sons** | 5 | 2 | $225.00 | $2,310.11 |

#### **7+ Rooms Test Results**
| Vendor | Crew Size | Truck Count | Hourly Rate | Total Cost |
|--------|-----------|-------------|-------------|------------|
| **Let's Get Moving** | 5 | 2 | $358.00 | $4,106.69 |
| **Easy2Go** | 3 | 1 | $200.00 | $2,184.63 |
| **Velocity Movers** | 3 | 1 | $190.00 | $2,235.56 |
| **Pierre & Sons** | 5 | 2 | $225.00 | $2,310.11 |

### **🏋️ Heavy Items Test (3 Rooms + Piano + Safe)**
| Vendor | Crew Size | Truck Count | Hourly Rate | Total Cost |
|--------|-----------|-------------|-------------|------------|
| **Let's Get Moving** | 3 | 1 | $199.00 | $2,251.75 |
| **Easy2Go** | 2 | 1 | $150.00 | $1,957.22 |
| **Velocity Movers** | 2 | 1 | $150.00 | $2,088.60 |
| **Pierre & Sons** | 3 | 1 | $165.00 | $1,911.41 |

### **🚛 Heavy Move Test (6 Rooms + 12,000 lbs)**
| Vendor | Crew Size | Truck Count | Hourly Rate | Total Cost |
|--------|-----------|-------------|-------------|------------|
| **Let's Get Moving** | 4 | 1 | $279.00 | $3,778.84 |
| **Easy2Go** | 4 | 2 | $250.00 | $3,512.04 |
| **Velocity Movers** | 4 | 2 | $230.00 | $3,482.52 |
| **Pierre & Sons** | 5 | 2 | $225.00 | $3,110.11 |

## 🎯 **ANALYSIS INSIGHTS**

### **📈 Crew Size Patterns**

#### **Room-Based Vendors**
- **Let's Get Moving:** 2→3→4→5 crew progression
- **Pierre & Sons:** 2→3→4→5 crew progression
- **Both scale aggressively** with room count

#### **Weight-Based Vendors**
- **Easy2Go:** 2→3→4→5 crew progression
- **Velocity Movers:** 2→3→4→5 crew progression
- **More conservative scaling** based on actual weight

### **🚛 Truck Allocation Patterns**

#### **Room-Based Truck Rules**
- **Let's Get Moving:** 1 truck until 5+ crew (then 2 trucks)
- **Pierre & Sons:** 2 trucks for 4+ rooms (aggressive)

#### **Weight-Based Truck Rules**
- **Easy2Go:** 2 trucks at 10,000+ lbs
- **Velocity Movers:** 2 trucks at 10,000+ lbs
- **More conservative** truck allocation

### **💰 Hourly Rate Patterns**

#### **Complex Calculation (Let's Get Moving)**
- **Base rate + crew multiplier** system
- **2 trucks = 2× base rate + additional**
- **Highest rates** for large crews

#### **Simple Calculation (Others)**
- **Fixed rates** per crew size
- **Linear progression** with crew size
- **More predictable** pricing

## 🔍 **KEY DIFFERENCES**

### **🎯 4-Room House Analysis**

#### **Crew Size Variations**
- **Let's Get Moving:** 3 crew (room-based)
- **Easy2Go:** 3 crew (weight-based, ~4,000 lbs)
- **Velocity Movers:** 3 crew (weight-based, ~4,000 lbs)
- **Pierre & Sons:** 4 crew (room-based, aggressive)

#### **Truck Count Variations**
- **Let's Get Moving:** 1 truck (crew ≤ 4)
- **Easy2Go:** 1 truck (weight < 10,000 lbs)
- **Velocity Movers:** 1 truck (weight < 10,000 lbs)
- **Pierre & Sons:** 2 trucks (4+ rooms, aggressive)

#### **Hourly Rate Variations**
- **Let's Get Moving:** $199/hr (base + $60)
- **Easy2Go:** $200/hr (fixed rate)
- **Velocity Movers:** $190/hr (fixed rate)
- **Pierre & Sons:** $195/hr (fixed rate)

### **🎯 7+ Room House Analysis**

#### **Crew Size Variations**
- **Let's Get Moving:** 5 crew (room-based)
- **Easy2Go:** 3 crew (weight-based, still ~6,000 lbs)
- **Velocity Movers:** 3 crew (weight-based, still ~6,000 lbs)
- **Pierre & Sons:** 5 crew (room-based)

#### **Truck Count Variations**
- **Let's Get Moving:** 2 trucks (5+ crew)
- **Easy2Go:** 1 truck (weight < 10,000 lbs)
- **Velocity Movers:** 1 truck (weight < 10,000 lbs)
- **Pierre & Sons:** 2 trucks (4+ rooms)

#### **Hourly Rate Variations**
- **Let's Get Moving:** $358/hr (2× base + $80)
- **Easy2Go:** $200/hr (fixed rate, no increase)
- **Velocity Movers:** $190/hr (fixed rate, no increase)
- **Pierre & Sons:** $225/hr (fixed rate)

## 💡 **BUSINESS IMPLICATIONS**

### **💰 Pricing Strategy Analysis**

#### **Let's Get Moving**
- **Most expensive** for large moves
- **Complex pricing** may confuse customers
- **High margins** on large moves
- **Premium positioning**

#### **Easy2Go & Velocity Movers**
- **Most affordable** for large moves
- **Simple pricing** structure
- **Competitive positioning**
- **Weight-based** efficiency

#### **Pierre & Sons**
- **Moderate pricing** for large moves
- **Aggressive truck allocation**
- **Room-based** simplicity
- **Balanced positioning**

### **🎯 Customer Experience Impact**

#### **Pricing Transparency**
- **Easy2Go & Velocity Movers:** Most transparent
- **Let's Get Moving:** Complex but justified
- **Pierre & Sons:** Moderate transparency

#### **Value Proposition**
- **Large moves:** Easy2Go & Velocity Movers best value
- **Medium moves:** Pierre & Sons competitive
- **Premium moves:** Let's Get Moving justified

## 🚀 **RECOMMENDATIONS**

### **📊 For System Optimization**

#### **1. Standardize Crew Sizing**
```python
# Consider hybrid approach
def get_crew_size(self, quote_request: QuoteRequest) -> int:
    # Room-based minimum
    room_crew = self._get_room_based_crew(quote_request.total_rooms)
    
    # Weight-based adjustment
    weight_crew = self._get_weight_based_crew(quote_request.estimated_weight)
    
    # Return maximum for safety
    return max(room_crew, weight_crew)
```

#### **2. Optimize Truck Allocation**
```python
# Consider efficiency-based allocation
def get_truck_count(self, quote_request: QuoteRequest, crew_size: int) -> int:
    # Base on crew efficiency
    if crew_size <= 3:
        return 1
    elif crew_size <= 5:
        return 1  # More efficient crews
    else:
        return 2  # Only for very large crews
```

#### **3. Simplify Hourly Rates**
```python
# Consider transparent pricing
def get_hourly_rate(self, crew_size: int) -> float:
    base_rate = 150  # Base rate per person
    return base_rate * crew_size  # Simple multiplication
```

### **🎯 For Business Strategy**

#### **1. Market Positioning**
- **Let's Get Moving:** Premium large moves
- **Easy2Go & Velocity Movers:** Value large moves
- **Pierre & Sons:** Balanced approach

#### **2. Customer Communication**
- **Explain crew sizing** logic to customers
- **Justify truck allocation** decisions
- **Transparent pricing** breakdowns

#### **3. Competitive Analysis**
- **Monitor competitor** pricing
- **Adjust rates** based on market
- **Optimize efficiency** for margins

## 🎉 **CONCLUSION**

### **✅ Key Findings**
- **Significant variations** in vendor approaches for 4+ room houses
- **Room-based vs weight-based** crew sizing creates different outcomes
- **Complex vs simple** hourly rate calculations affect pricing
- **Truck allocation** strategies vary significantly

### **💰 Business Impact**
- **Let's Get Moving:** Premium pricing for large moves
- **Easy2Go & Velocity Movers:** Competitive pricing for large moves
- **Pierre & Sons:** Balanced approach with aggressive truck allocation

### **🚀 Next Steps**
1. **Monitor customer feedback** on pricing differences
2. **Consider standardizing** crew sizing approaches
3. **Optimize truck allocation** for efficiency
4. **Simplify pricing** for transparency

**The vendor rules analysis reveals distinct strategies that create significant pricing variations for 4+ room houses, providing opportunities for optimization and market positioning!** 🏠 