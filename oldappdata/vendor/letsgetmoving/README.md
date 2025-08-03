# Let's Get Moving Vendor

**System Status (2025-05-31):**
- Modular JSON dispatcher structure (per branch)
- Dynamic PHP calculation logic (letsgetmoving.php)
- Frontend and backend fully aligned (React/JS UI, REST API)
- Long-distance moves (>200km) show special message and lead form
- Official logo always used in UI
- All rates, surcharges, and crew size are dynamic and dispatcher-specific

**Description:**
Award-winning Toronto moving company. Residential, commercial, and long-distance moves.

**Rules:**
- Hourly Rate (2025):
  - 2 Movers: $150/hr
  - 3 Movers: $180/hr
  - 4 Movers: $220/hr
  - 5 Movers: $270/hr
- Travel Fee: $120 flat (GTA)
- Stairs Fee: $40 per flight
- Heavy Item Fees: Piano $250, Safe $300, Treadmill $100
- Packing Fee: $110/hr
- Insurance: $150 flat
- Long Distance: $2.2/km (over 200km, call for quote)

**Structure:**
- `letsgetmoving.php`: Main calculation logic.
- `letsgetmoving_vendor.csv`: Vendor data.
- `logo.png`: Vendor logo.
- `dispatchers/`: Each dispatcher/branch as a separate JSON file.

**How to add a dispatcher:**
1. Add a new JSON file in `dispatchers/` for the branch.
2. Update `letsgetmoving.php` if custom logic is needed. 