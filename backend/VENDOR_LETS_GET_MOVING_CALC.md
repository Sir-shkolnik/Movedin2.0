# Let's Get Moving Calculator (lets-get-moving)

## Overview
This document details the calculation logic, formulas, and business rules for the "Let's Get Moving" vendor calculator in the MovedIn 2.0 backend.

---

## Calculation Pipeline
1. **Crew Size Determination**
   - Based on room count and heavy items:
     - 1-3 rooms: 2 crew
     - 4 rooms: 3 crew
     - 5-6 rooms: 4 crew
     - 7+ rooms: 5 crew
     - Any heavy items: minimum 3 crew
2. **Truck Count**
   - 1 truck for up to 4 crew
   - 2 trucks for 5+ crew
3. **Base Rate Selection**
   - Fetched from Google Sheets daily rates for the dispatcher location and move date.
4. **Geographic Pricing Adjustments**
   - City-based multiplier and fuel surcharge (see VENDOR_LETS_GET_MOVING.md for table)
   - Adjusted base rate = base rate × city multiplier
5. **Hourly Rate Calculation**
   - 2 crew: base rate
   - 3 crew: base rate + $60
   - 4 crew: base rate + $140
   - 2 trucks/4 crew: 2 × base rate + $20
   - 2 trucks/5 crew: 2 × base rate + $80
6. **Labor Hours Estimation**
   - Based on room count, reduced for larger crews:
     - 1: 3.5h, 2: 4.5h, 3: 5.5h, 4: 6.5h, 5: 7.5h, 6: 8.5h, 7+: 9.5h
     - 4 crew: -1h, 3 crew: -0.5h (min 2h)
7. **Travel Time Calculation**
   - 3-leg journey: Dispatcher → Origin → Destination → Dispatcher
   - Mapbox API used if available, fallback to 2.0h
   - Total travel time = one-way × 2.5
8. **Fuel Charge**
   - Based on travel time (see code fuel table)
   - Plus city fuel surcharge
9. **Heavy Items**
   - Piano: $250, Safe: $300, Treadmill: $100 (per item)
10. **Additional Services**
    - Packing: $110, Storage: $200, Cleaning: $396, Junk: $150 (per service)
11. **Stairs**
    - Included in labor cost (no extra charge)
12. **Total Cost**
    - Sum of labor, travel, fuel, heavy items, additional services

---

## Example Calculation
```
Input:
- 4 rooms, 1 piano, origin: Toronto, move date: 2025-08-01
- Dispatcher daily rate: $159
- City: Toronto (multiplier 1.0, fuel surcharge $0)

Steps:
- Crew: 3 (4 rooms)
- Truck: 1
- Adjusted base rate: $159 × 1.0 = $159
- Hourly rate: $159 + $60 = $219
- Labor hours: 6.5 - 0.5 = 6.0h
- Travel time: 2.0h (fallback)
- Fuel charge: $125 (from table)
- Heavy items: $250 (piano)
- Additional services: $0
- Total: (6.0 × $219) + (2.0 × $219) + $125 + $250 = $1,314 + $438 + $125 + $250 = $2,127
```

---

## Output Structure
```
{
  "vendor_name": "Let's Get Moving",
  "total_cost": 2127.0,
  "breakdown": {
    "labor": 1314.0,
    "travel": 438.0,
    "fuel": 125.0,
    "heavy_items": 250.0,
    "additional_services": 0.0
  },
  "crew_size": 3,
  "truck_count": 1,
  "estimated_hours": 6.0,
  "travel_time_hours": 2.0,
  "hourly_rate": 219.0,
  "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"],
  "rating": 4.8,
  "reviews": 1247,
  "special_notes": "Most popular choice"
}
```

---

## Notes
- All rates and logic are subject to dispatcher location and Google Sheets data.
- If no daily rate is found for the move date, the vendor is not available for that day/location.
- All calculations are performed live per quote request. 