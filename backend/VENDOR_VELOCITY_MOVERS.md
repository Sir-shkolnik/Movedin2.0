# Velocity Movers (velocity-movers)

## Service Area
- **Cities:** Toronto, Mississauga, Oakville, Burlington, Hamilton
- **Regions:** GTA West, Golden Horseshoe West
- **Max Distance:** 120 km

## Location-Based Pricing
| City           | Base Multiplier | Fuel Surcharge |
|----------------|-----------------|---------------|
| Toronto        | 1.00            | $0            |
| Mississauga    | 0.97            | $30           |
| Oakville       | 0.92            | $50           |
| Burlington     | 0.88            | $65           |
| Hamilton       | 0.85            | $80           |

## Quote Calculation Logic
- **Base rate:** Fetched from dispatcher location (Google Sheets)
- **Crew size:** Based on room count and heavy items
- **Truck count:** 1 truck for up to 4 crew, 2 trucks for 5+ crew
- **Hourly rate:**
    - 2 crew: base rate
    - 3 crew: base rate + $60
    - 4 crew: base rate + $140
    - 2 trucks/4 crew: 2 × base rate + $20
    - 2 trucks/5 crew: 2 × base rate + $80
- **Labor hours:** Based on room count, reduced for larger crews
- **Travel time:** Estimated via Mapbox or fallback
- **Fuel charge:** Based on travel time
- **Heavy items:** Piano ($250), Safe ($300), Treadmill ($100)
- **Additional services:** Packing ($110), Storage ($200), Cleaning ($396), Junk ($150)
- **Stairs:** Included in labor cost

## Example Quote Breakdown
```
{
  "vendor_name": "Velocity Movers",
  "total_cost": 2748.0,
  "breakdown": {
    "labor": 2100.0,
    "travel": 540.0,
    "fuel": 108.0,
    "heavy_items": 0.0,
    "additional_services": 0.0
  },
  "crew_size": 5,
  "truck_count": 2,
  "estimated_hours": 7.0,
  "travel_time_hours": 1.8,
  "hourly_rate": 300.0,
  "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM"],
  "rating": 4.9,
  "reviews": 567,
  "special_notes": "Premium service"
}
``` 