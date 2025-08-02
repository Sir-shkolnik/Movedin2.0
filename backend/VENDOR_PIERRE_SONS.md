# Pierre & Sons (pierre-sons)

## Service Area
- **Cities:** Toronto, Scarborough, North York, Etobicoke, York, East York
- **Regions:** Toronto Core
- **Max Distance:** 50 km

## Location-Based Pricing
| City           | Base Multiplier | Fuel Surcharge |
|----------------|-----------------|---------------|
| Toronto        | 1.00            | $0            |
| Scarborough    | 0.98            | $15           |
| North York     | 0.98            | $10           |
| Etobicoke      | 0.98            | $20           |
| York           | 0.98            | $5            |
| East York      | 0.98            | $12           |

## Quote Calculation Logic
- **Base rate:** Fetched from dispatcher location (Google Sheets)
- **Crew size:** Based on room count and heavy items
- **Truck count:** 1 truck for up to 4 crew, 2 trucks for 5+ crew
- **Hourly rate:**
    - 2 crew: $135
    - 3 crew: $165
    - 4 crew: $195
    - 5 crew: $225
- **Labor hours:** Based on room count
- **Travel time:** Estimated via Mapbox or fallback
- **Fuel surcharge:** $2/km over 50km
- **Heavy items:** Piano ($250), Safe ($300), Treadmill ($100)
- **Additional services:** Packing ($110), Storage ($200), Cleaning ($396), Junk ($150)
- **Stairs:** Included in labor cost

## Example Quote Breakdown
```
{
  "vendor_name": "Pierre & Sons",
  "total_cost": 769.5,
  "breakdown": {
    "labor": 607.5,
    "travel": 162.0,
    "fuel_surcharge": 0.0,
    "heavy_items": 0.0,
    "additional_services": 0.0
  },
  "crew_size": 2,
  "truck_count": 1,
  "estimated_hours": 4.5,
  "travel_time_hours": 1.2,
  "hourly_rate": 135.0,
  "available_slots": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
  "rating": 4.7,
  "reviews": 734,
  "special_notes": "Reliable service"
}
``` 