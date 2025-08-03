# Velocity Movers Vendor

**System Status (2025-05-31):**
- Modular JSON dispatcher structure (per branch)
- Dynamic PHP calculation logic (velocity.php)
- Frontend and backend fully aligned (React/JS UI, REST API)
- Long-distance moves (>200km) show special message and lead form
- Official logo always used in UI
- All rates, surcharges, and crew size are dynamic and dispatcher-specific

**Description:**
GTA & Ontario residential/commercial moving, storage, disposal, white glove.

**Rules:**
- Two Movers: $150/hr
- Each Additional Mover: $40/hr
- Truck Fee: $120 flat
- Storage: $3.00/sqft, $60-$100 per skid/crate
- Disposal: $200 handling fee + disposal cost
- White Glove: $160/hr for 2 movers, $60/hr each additional
- 3 hour minimum

**Structure:**
- `velocity.php`: Main calculation logic.
- `velocity_vendor.csv`: Vendor data.
- `logo.jpg`: Vendor logo.
- `dispatchers/`: Each dispatcher/branch as a separate JSON file.

**How to add a dispatcher:**
1. Add a new JSON file in `dispatchers/` for the branch.
2. Update `velocity.php` if custom logic is needed. 