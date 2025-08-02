# Pierre & Son's Vendor

**System Status (2025-05-31):**
- Modular JSON dispatcher structure (per branch)
- Dynamic PHP calculation logic (pierre_sons.php)
- Frontend and backend fully aligned (React/JS UI, REST API)
- Long-distance moves (>200km) show special message and lead form
- Official logo always used in UI
- All rates, surcharges, and crew size are dynamic and dispatcher-specific

**Description:**
Etobicoke & GTA moving, delivery, and storage. When we say we care... we mean it!

**Rules:**
- Hourly Rate (3-hour minimum):
  - $65/hr for 1 guy
  - $135/hr for 2 guys
  - $165/hr for 3 guys
  - $195/hr for 4 guys
  - $225/hr for 5 guys
  - $255/hr for 6 guys
- Truck Fee: $100-$180 depending on size and distance
- Travel Time: 1 hour included, extra if >1 hour away
- Commission: 15% of total receipt for each confirmed job

**Structure:**
- `pierre_sons.php`: Main calculation logic.
- `pierre_sons_vendor.csv`: Vendor data.
- `logo.png`: Vendor logo.
- `dispatchers/`: Each dispatcher/branch as a separate JSON file.

**How to add a dispatcher:**
1. Add a new JSON file in `dispatchers/` for the branch.
2. Update `pierre_sons.php` if custom logic is needed. 