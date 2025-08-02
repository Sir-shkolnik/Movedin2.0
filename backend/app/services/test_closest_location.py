import re
from app.services.google_sheets_service import google_sheets_service
from app.services.dispatcher_cache_service import dispatcher_cache_service

spreadsheet_id = '1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA'
with open('../../app/services/g.txt') as f:
    lines = f.readlines()
location_urls = [l.strip() for l in lines if 'gid=' in l]
gids = [re.search(r'gid=(\d+)', url).group(1) for url in location_urls if re.search(r'gid=(\d+)', url)]
all_data = google_sheets_service.batch_normalize_public_tabs(spreadsheet_id, gids)

addresses = [
    '18 Gadsden Ct, Ajax',
    '92 Caplan Ave, Barrie',
    '750 Guelph Line, Burlington',
    '783 Colborne Street, Brantford',
    '400 Industrial Avenue, Vancouver',
]

for address in addresses:
    closest_gid = dispatcher_cache_service.find_closest_location(address, all_data)
    loc_details = all_data[closest_gid]['location_details'] if closest_gid else {}
    print(f"Address: {address}\n  Closest GID: {closest_gid}\n  Location Details: {loc_details}\n") 