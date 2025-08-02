import re
from app.services.google_sheets_service import google_sheets_service
from app.services.dispatcher_cache_service import dispatcher_cache_service
from app.services.vendor_engine import get_vendor_calculator
from app.schemas.quote import QuoteRequest

spreadsheet_id = '1_S92sCx4r9EkZl_zlM5mT120SfsVQqSBqeN1k_gIOrA'
with open('app/services/g.txt') as f:
    lines = f.readlines()
location_urls = [l.strip() for l in lines if 'gid=' in l]
gids = [re.search(r'gid=(\d+)', url).group(1) for url in location_urls if re.search(r'gid=(\d+)', url)]
all_data = google_sheets_service.batch_normalize_public_tabs(spreadsheet_id, gids)

# Simulate moves inside GTA
moves = [
    # Toronto core
    {'origin': '276 Carlaw Avenue, Toronto, ON', 'destination': '400 Industrial Avenue, Vancouver', 'rooms': 2, 'sqft': '800'},
    # Mississauga
    {'origin': '456 Hurontario St, Mississauga, ON', 'destination': '783 Colborne Street, Brantford', 'rooms': 3, 'sqft': '1200'},
    # Brampton
    {'origin': '789 Queen St E, Brampton, ON', 'destination': '750 Guelph Line, Burlington', 'rooms': 4, 'sqft': '1600'},
    # Markham
    {'origin': '321 Highway 7, Markham, ON', 'destination': '18 Gadsden Ct, Ajax', 'rooms': 5, 'sqft': '2000'},
    # Hamilton
    {'origin': '400 Industrial Avenue, Hamilton, ON', 'destination': '92 Caplan Ave, Barrie', 'rooms': 6, 'sqft': '2500'},
    # Vancouver (to test west coast)
    {'origin': '32615 South Fraser Way unit 1402 104, Abbotsford, BC', 'destination': '4402 West Shore pky, Victoria, BC', 'rooms': 3, 'sqft': '1100'},
    # Calgary
    {'origin': '1122 40 Ave NE unit 120, Calgary, AB', 'destination': '783 Colborne Street, Brantford', 'rooms': 2, 'sqft': '900'},
    # Halifax
    {'origin': '380 Bedford Highway, Halifax, NS', 'destination': '276 Carlaw Avenue, Toronto, ON', 'rooms': 4, 'sqft': '1500'},
    # Kitchener
    {'origin': '110 Manitou Dr, Kitchener, ON', 'destination': '789 Queen St E, Brampton, ON', 'rooms': 5, 'sqft': '1800'},
    # Edmonton
    {'origin': '9920 63 Ave. NW, Edmonton, AB', 'destination': '321 Highway 7, Markham, ON', 'rooms': 3, 'sqft': '1200'},
]

vendors = ['lets-get-moving', 'easy2go', 'velocity-movers', 'pierre-sons']

print("\n=== GID to Location Mapping and August 2025 Daily Rates ===")
for gid, data in all_data.items():
    location = data.get('location', 'UNKNOWN')
    print(f"GID: {gid} | Location: {location}")
    daily_rates = data.get('calendar_data', {}).get('daily_rates', {})
    aug_rates = {k: v for k, v in daily_rates.items() if k.startswith('2025-08-')}
    print(f"  August 2025 Rates: {aug_rates if aug_rates else 'NONE'}")

for move in moves:
    print(f"\nMove: {move['origin']} -> {move['destination']} | Rooms: {move['rooms']} | Sqft: {move['sqft']}")
    closest_gid = dispatcher_cache_service.find_closest_location(move['origin'], all_data)
    dispatcher_info = all_data[closest_gid]
    dispatcher_name = dispatcher_info.get('location', 'UNKNOWN')
    daily_rates = dispatcher_info.get('calendar_data', {}).get('daily_rates', {})
    has_rate = '2025-08-01' in daily_rates
    print(f"  Selected Dispatcher GID: {closest_gid} | Name: {dispatcher_name}")
    print(f"  Has daily rate for 2025-08-01: {has_rate}")
    calculator = get_vendor_calculator('lets-get-moving')
    quote_request = QuoteRequest(
        origin_address=move['origin'],
        destination_address=move['destination'],
        move_date='2025-08-01',
        move_time='09:00',
        total_rooms=move['rooms'],
        square_footage=move['sqft'],
        heavy_items={},
        stairs_at_pickup=0,
        stairs_at_dropoff=0,
        elevator_at_pickup=False,
        elevator_at_dropoff=False,
        additional_services={}
    )
    vendor_dispatcher_info = {
        'name': dispatcher_info.get('location'),
        'address': dispatcher_info.get('address'),
        'coordinates': dispatcher_info.get('coordinates'),
        'base_rate': dispatcher_info.get('base_rates', {}).get('lets-get-moving'),
        'calendar_data': dispatcher_info.get('calendar_data', {}),
        'total_distance_km': None
    }
    try:
        quote = calculator.calculate_quote(quote_request, vendor_dispatcher_info, db=None)
        print(f"  LGM Quote: {quote['total_cost']} | Crew: {quote['crew_size']} | Trucks: {quote['truck_count']}")
        print(f"    Breakdown: {quote['breakdown']}")
        print(f"    Geographic: {quote['geographic_adjustments']}")
        print(f"    Dispatcher: {quote['dispatcher_info']}")
    except Exception as e:
        print(f"  ERROR: {e}")
        print(f"    Dispatcher Info: {vendor_dispatcher_info}") 