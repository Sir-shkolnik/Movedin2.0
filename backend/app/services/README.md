# app/services/

This folder contains business logic, integrations, and service modules for the backend.

## Files
- `__init__.py` — Marks this as the services package. Comment: "Business logic services".
- `vendor_engine.py` — All vendor calculators, dispatching, and pricing logic.
- `google_sheets_service.py` — Fetches and normalizes Google Sheets data for dispatchers.
- `dispatcher_cache_service.py` — Caching and closest-location logic for dispatchers.
- `sheets_monitor_service.py` — Monitors Google Sheets data completeness and freshness.
- `mapbox_service.py` — Geocoding and directions via Mapbox API.
- `g.txt` — List of all Google Sheets GIDs (tabs) for dispatcher data.
- `batch_gsheets_output.txt`, `compare_quotes_output_final3.txt`, etc. — Output and debug files for batch operations and quote comparisons.
- `test_compare_quotes.py`, `test_monitor_run.py`, `test_closest_location.py`, `batch_test_gsheets.py` — Test scripts for service logic.
- `ajax_tab.csv` — Example CSV export from Google Sheets. 