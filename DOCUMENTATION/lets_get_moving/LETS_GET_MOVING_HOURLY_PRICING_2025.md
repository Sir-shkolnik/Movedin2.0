# Let's Get Moving - Hourly-Based Pricing System 2025

## 🎯 **SYSTEM OVERVIEW**

Let's Get Moving now uses a **comprehensive hourly-based pricing model** that accurately reflects the actual time and effort required for moving services. This system ensures competitive pricing while maintaining profitability.

## 💰 **PRICING STRUCTURE**

### **Core Components:**
1. **Labor Time** - Time to load/unload items
2. **Travel Time** - Time from house to house
3. **Heavy Items** - Additional time for special items
4. **Long Distance** - Gas fees for moves > 1h45m

### **Hourly Rates:**
- **Base Labor Rate**: $139/hour per person
- **Travel Rate**: $83.40/hour per person (60% of labor rate)
- **Heavy Items Rate**: $200/hour per person

## 🧮 **CALCULATION LOGIC**

### **Local Move (Toronto → Mississauga):**
```
Labor Cost: 1.5h × $139/h × 3 crew = $625.50
Travel Cost: 0.5h × $83.40/h × 3 crew = $125.10
Total: $750.60 (+ 20% markup = $900.72)
```

### **Medium Distance (Toronto → Hamilton):**
```
Labor Cost: 1.5h × $139/h × 3 crew = $625.50
Travel Cost: 1.3h × $83.40/h × 3 crew = $320.92
Total: $946.42 (+ 20% markup = $1,135.70)
```

### **Heavy Items Pricing:**
```
Piano: 0.5h × $200/h = $100.00
Safe: 0.75h × $200/h = $150.00
Pool Table: 0.25h × $200/h = $50.00
```

## ⛽ **LONG DISTANCE GAS FEES**

### **Threshold:** Travel time > 1h45m (1.75 hours)

### **Gas Fee Table:**
| Distance | Base Fee | Per KM | Example (100km) |
|----------|----------|--------|-----------------|
| 50-100km | $50 | $0.80 | $50 + (50×$0.80) = $90 |
| 100-200km | $100 | $0.70 | $100 + (100×$0.70) = $170 |
| 200-300km | $150 | $0.60 | $150 + (100×$0.60) = $210 |
| 300km+ | $200 | $0.50 | $200 + (100×$0.50) = $250 |

## 🎯 **SERVICE AREA**

- **Radius**: 50km from dispatcher locations
- **Coverage**: GTA and surrounding areas
- **Locations**: Ajax, Mississauga, Oakville, Oshawa, Toronto (North York), Vaughan

## 📊 **COMPETITIVE POSITIONING**

| Vendor | 3-Room Move | Heavy Items | Long Distance |
|--------|-------------|-------------|---------------|
| **Let's Get Moving** | $900.72 | $1,200.72 | $1,135.70 |
| **Easy2Go** | $1,991.20 | $2,771.20 | $2,094.32 |
| **Velocity Movers** | $1,950.17 | $2,670.17 | $1,624.20 |
| **Pierre & Sons** | $1,503.00 | $2,163.00 | $1,503.00 |

## ✅ **ADVANTAGES**

1. **Accurate Pricing** - Based on actual time required
2. **Transparent Costs** - Clear breakdown of labor, travel, and fees
3. **Competitive Rates** - Positioned between mid and premium tiers
4. **Scalable** - Easy to adjust rates based on market conditions
5. **Professional** - Reflects industry-standard hourly billing

## 🔧 **TECHNICAL IMPLEMENTATION**

- **Calendar Integration** - Q4 2025 pricing from Google Sheets
- **Distance Calculation** - Mapbox API for accurate travel times
- **Service Area Validation** - 50km radius enforcement
- **Real-time Pricing** - Dynamic rates based on date and location

## 📈 **BUSINESS IMPACT**

- **Increased Profitability** - More accurate cost recovery
- **Better Customer Understanding** - Clear pricing breakdown
- **Competitive Advantage** - Professional hourly-based system
- **Scalable Growth** - Easy to expand to new locations

---

*Last Updated: January 20, 2025*
*System Status: Production Ready*
