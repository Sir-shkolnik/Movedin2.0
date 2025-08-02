# Easy2Go Vendor

**Description:**
GTA & Ontario residential/commercial moving, storage, disposal, white glove.

**Rules:**
- 2 Movers: $150/hr
- 3 Movers: $200/hr
- 4 Movers: $250/hr
- 5 Movers: $300/hr
- Truck Fee: $150-$200 depending on size
- Returning Travel: Charged at hourly rate to depot

**Structure:**
- `easy2go.php`: Main calculation logic.
- `easy2go_vendor.csv`: Vendor data.
- `logo.png`: Vendor logo.
- `dispatchers/`: Each dispatcher/branch as a separate PHP and CSV file.

**How to add a dispatcher:**
1. Add a new PHP file in `dispatchers/` for custom logic (optional).
2. Add a new CSV row in `easy2go_vendor.csv` or a new CSV in `dispatchers/`.
3. Update `easy2go.php` to load the new dispatcher if needed. 