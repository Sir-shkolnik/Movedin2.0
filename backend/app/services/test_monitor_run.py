import re
import time
from app.services.sheets_monitor_service import sheets_monitor_service

spreadsheet_id = '1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA'
with open('../../app/services/g.txt') as f:
    lines = f.readlines()
location_urls = [l.strip() for l in lines if 'gid=' in l]
gids = [re.search(r'gid=(\d+)', url).group(1) for url in location_urls if re.search(r'gid=(\d+)', url)]

# Run the background job with a very short interval for demo
sheets_monitor_service.start_background_refresh_and_validation(spreadsheet_id, gids, interval_hours=0.001)
time.sleep(5) 