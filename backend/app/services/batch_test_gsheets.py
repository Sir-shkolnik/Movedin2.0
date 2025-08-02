import re
import requests
import os
import csv

spreadsheet_id = '1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA'
with open('app/services/g.txt') as f:
    lines = f.readlines()
location_urls = [l.strip() for l in lines if 'gid=' in l]
gids = [re.search(r'gid=(\d+)', url).group(1) for url in location_urls if re.search(r'gid=(\d+)', url)]

os.makedirs('csv_exports', exist_ok=True)

for gid in gids:
    url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
    response = requests.get(url)
    if response.status_code == 200:
        with open(f'csv_exports/{gid}.csv', 'w', encoding='utf-8') as out:
            out.write(response.text)
        print(f"Downloaded CSV for GID {gid}")
    else:
        print(f"Failed to download CSV for GID {gid}: {response.status_code}")

# Validation: parse each CSV and check for August 2025 daily rates
def extract_august_2025_rates(csv_path):
    month_names = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    rates = {}
    with open(csv_path, encoding='utf-8') as f:
        rows = list(csv.reader(f))
    # Find all AUG blocks
    for row_idx, row in enumerate(rows):
        for col_idx, cell in enumerate(row):
            if cell and "AUG" in cell:
                # Find the day name row
                dayname_row_idx = None
                for i in range(row_idx+1, min(row_idx+5, len(rows))):
                    if len(rows[i]) > col_idx and rows[i][col_idx].strip().upper() in ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]:
                        dayname_row_idx = i
                        break
                if dayname_row_idx is None:
                    continue
                j = dayname_row_idx + 1
                while j < len(rows):
                    day_row = rows[j]
                    days = []
                    for k in range(col_idx, col_idx+7):
                        if len(day_row) > k and day_row[k] and day_row[k].strip().isdigit():
                            days.append(int(day_row[k].strip()))
                        else:
                            days.append(None)
                    rate_row = rows[j+1] if j+1 < len(rows) else None
                    rates_row = []
                    if rate_row:
                        for k in range(col_idx, col_idx+7):
                            cell = rate_row[k] if len(rate_row) > k else ""
                            if cell:
                                parts = [p for p in re.split(r"[^0-9.]", cell) if p.strip()]
                                found = False
                                for part in parts:
                                    try:
                                        val = float(part)
                                        rates_row.append(val)
                                        found = True
                                        break
                                    except ValueError:
                                        continue
                                if not found:
                                    rates_row.append(None)
                            else:
                                rates_row.append(None)
                    for d, r in zip(days, rates_row):
                        if d and r is not None:
                            date_key = f"2025-08-{str(d).zfill(2)}"
                            rates[date_key] = r
                    if not rate_row or not any(x is not None for x in days):
                        break
                    j += 2
    return rates

print("\nValidation: Checking August 2025 daily rates for each GID...")
for gid in gids:
    csv_path = f'csv_exports/{gid}.csv'
    rates = extract_august_2025_rates(csv_path)
    missing = [f"2025-08-{str(day).zfill(2)}" for day in range(1, 32) if f"2025-08-{str(day).zfill(2)}" not in rates]
    if missing:
        print(f"GID {gid}: MISSING {len(missing)} days in August 2025: {missing}")
    else:
        print(f"GID {gid}: All August 2025 days present.") 