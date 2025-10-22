/**
 * Vendor Calculation Constants
 * Shared constants used across all vendor calculators
 */

// Mapbox Configuration
export const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VwcG9ydG1vdmVkaW4iLCJhIjoiY21kZmdxdHh6MGQ2aDJqcHE2YTIwbTFrMiJ9.I1xkq82JXLMlgB02xT8LMw';

// General Pricing Rules
export const MINIMUM_LABOR_HOURS = 2.0;
export const STAIR_TIME_PER_FLIGHT = 0.25; // 15 minutes per flight
export const ELEVATOR_TIME = 0.25; // 15 minutes per elevator
export const TRUCK_FACTOR = 1.3; // Commercial trucks travel 30% slower than cars
export const MARKUP_PERCENTAGE = 0.20; // 20% markup for all vendors

// Heavy Items Pricing (shared across vendors) - Updated from V2.0 system
export const HEAVY_ITEM_RATES = {
  piano: { base: 250, labor: 0.25 },
  safe: { base: 300, labor: 0.5 },
  treadmill: { base: 100, labor: 0.25 },
  pool_table: { base: 200, labor: 0.25 },
  grand_piano: { base: 400, labor: 0.5 },
  gun_safe: { base: 350, labor: 0.5 },
  antique_furniture: { base: 150, labor: 0.25 },
  artwork: { base: 100, labor: 0.25 }
};

// Pierre & Sons Heavy Item Rates (from V2.0 system)
export const PIERRE_SONS_HEAVY_ITEMS = {
  piano: { base: 250, labor: 0.25 },
  safe: { base: 300, labor: 0.5 },
  treadmill: { base: 100, labor: 0.25 },
  pool_table: { base: 200, labor: 0.25 },
  grand_piano: { base: 400, labor: 0.5 },
  gun_safe: { base: 350, labor: 0.5 },
  antique_furniture: { base: 150, labor: 0.25 },
  artwork: { base: 100, labor: 0.25 }
};

// Velocity Movers Heavy Item Rates (from V2.0 system)
export const VELOCITY_MOVERS_HEAVY_ITEMS = {
  piano: { base: 275, labor: 0.25 },
  safe: { base: 325, labor: 0.5 },
  treadmill: { base: 110, labor: 0.25 },
  pool_table: { base: 200, labor: 0.25 },
  grand_piano: { base: 400, labor: 0.5 },
  gun_safe: { base: 350, labor: 0.5 },
  antique_furniture: { base: 150, labor: 0.25 },
  artwork: { base: 100, labor: 0.25 }
};

// Easy2Go Heavy Item Rates (from V2.0 system)
export const EASY2GO_HEAVY_ITEMS = {
  piano: { base: 200, labor: 0.25 },
  safe: { base: 250, labor: 0.5 },
  treadmill: { base: 80, labor: 0.25 },
  pool_table: { base: 200, labor: 0.25 },
  grand_piano: { base: 400, labor: 0.5 },
  gun_safe: { base: 350, labor: 0.5 },
  antique_furniture: { base: 150, labor: 0.25 },
  artwork: { base: 100, labor: 0.25 }
};

// Let's Get Moving Heavy Item Rates (from V2.0 system)
export const LETS_GET_MOVING_HEAVY_ITEMS = {
  piano: { base: 250, labor: 0.25 },
  safe: { base: 300, labor: 0.5 },
  treadmill: { base: 100, labor: 0.25 },
  pool_table: { base: 200, labor: 0.25 },
  grand_piano: { base: 400, labor: 0.5 },
  gun_safe: { base: 350, labor: 0.5 },
  antique_furniture: { base: 150, labor: 0.25 },
  artwork: { base: 100, labor: 0.25 }
};

// Additional Services (from V2.0 system - Let's Get Moving rates)
export const ADDITIONAL_SERVICES = {
  packing: { name: 'Packing Services', cost: 110 },
  storage: { name: 'Storage Services', cost: 200 },
  cleaning: { name: 'Cleaning Services', cost: 396 },
  junk: { name: 'Junk Removal', cost: 150 }
};

// Additional Services for other vendors (require vendor assessment)
export const ADDITIONAL_SERVICES_VENDOR_ASSESSMENT = {
  packing: { name: 'Packing Services', cost: 0, note: 'Requires vendor assessment' },
  storage: { name: 'Storage Services', cost: 0, note: 'Requires vendor assessment' },
  cleaning: { name: 'Cleaning Services', cost: 0, note: 'Requires vendor assessment' },
  junk: { name: 'Junk Removal', cost: 0, note: 'Requires vendor assessment' }
};

// Service Area Validation
export const VENDOR_SERVICE_AREAS = {
  'lets-get-moving': {
    cities: [
      'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York',
      'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill',
      'Oakville', 'Burlington', 'Hamilton', 'Oshawa', 'Whitby', 'Ajax', 'Pickering',
      'Barrie', 'Aurora', 'Brantford', 'Kitchener', 'Waterloo', 'Windsor', 'Peterborough',
      'Vancouver', 'Burnaby', 'Richmond', 'Victoria', 'Abbotsford', 'Port Moody',
      'Calgary', 'Edmonton',
      'Winnipeg',
      'Regina',
      'Montreal',
      'Halifax',
      'Fredericton'
    ],
    maxDistanceKm: 50
  },
  'pierre-sons': {
    cities: [
      'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York',
      'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill',
      'Oakville', 'Burlington', 'Hamilton', 'Oshawa', 'Whitby', 'Ajax', 'Pickering',
      'Barrie', 'Aurora', 'Brantford', 'Kitchener', 'Waterloo', 'Windsor', 'Peterborough'
    ],
    maxDistanceKm: 50
  },
  'velocity-movers': {
    cities: [
      'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York',
      'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill',
      'Oakville', 'Burlington', 'Hamilton', 'Oshawa', 'Whitby', 'Ajax', 'Pickering',
      'Barrie', 'Aurora', 'Brantford', 'Kitchener', 'Waterloo', 'Windsor', 'Peterborough'
    ],
    maxDistanceKm: 50
  },
  'easy2go': {
    cities: [
      'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York',
      'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Richmond Hill',
      'Oakville', 'Burlington', 'Hamilton', 'Oshawa', 'Whitby', 'Ajax', 'Pickering',
      'Barrie', 'Aurora', 'Brantford', 'Kitchener', 'Waterloo', 'Windsor', 'Peterborough'
    ],
    maxDistanceKm: 50
  }
};

// Let's Get Moving - Travel Fee Thresholds (NEW August 2025 Model)
export const LGM_TRAVEL_FEE_THRESHOLDS = {
  '15_min': 0.25,
  '30_min': 0.5,
  '45_min': 0.75,
  '1_hour': 1.0,
  '1_15': 1.25,
  '1_30': 1.5,
  '1_45': 1.75,
  'long_distance_min': 1.733, // 1 hour 44 minutes
  'long_distance_rate': 5.99 // $5.99 per mile per truck
};

// Let's Get Moving - Google Sheets GID to Location Mapping
export const LGM_GID_LOCATION_MAP = {
  '586231927': 'Abbotsford',
  '759134820': 'Ajax',
  '2023718082': 'Aurora',
  '205064403': 'Barrie',
  '1902434505': 'Brantford',
  '685880450': 'Burlington',
  '1985906253': 'Burnaby',
  '1384980803': 'Calgary',
  '2061150538': 'Coquitlam',
  '1324028052': 'Downtown Toronto',
  '1846632241': 'Edmonton',
  '627208617': 'Fredericton',
  '1843371269': 'Halifax',
  '858770585': 'Hamilton',
  '551728640': 'Kelowna',
  '478561055': 'Kingston',
  '1613243722': 'Lethbridge',
  '1311971885': 'London',
  '853107228': 'Markham',
  '120281503': 'Milton',
  '429580526': 'Mississauga',
  '159313789': 'Moncton',
  '1591534972': 'Montreal',
  '851484086': 'Oakville',
  '225755820': 'Montreal North',
  '805965695': 'Oshawa',
  '268519783': 'Ottawa',
  '1005327863': 'Peterborough',
  '1911372332': 'Regina',
  '2065291362': 'Saint John',
  '232402855': 'Saskatoon',
  '2119220503': 'Scarborough',
  '1460907060': 'St Catherines',
  '1342606267': 'Richmond BC',
  '992379054': 'Surrey',
  '1802285746': 'Vaughan',
  '885243828': 'Winnipeg'
};

// Vendor Metadata (for display)
export const VENDOR_METADATA = {
  'lets-get-moving': {
    name: "Let's Get Moving",
    slug: 'lets-get-moving',
    logo: '/logos/logo_letsgetmoving.jpg',
    rating: 4.8,
    reviews: 1247,
    availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']
  },
  'pierre-sons': {
    name: 'Pierre & Sons',
    slug: 'pierre-sons',
    logo: '/logos/pierresons.png',
    rating: 4.7,
    reviews: 734,
    availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM']
  },
  'velocity-movers': {
    name: 'Velocity Movers',
    slug: 'velocity-movers',
    logo: '/logos/velocitymovers.jpg',
    rating: 4.6,
    reviews: 892,
    availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM']
  },
  'easy2go': {
    name: 'Easy2Go',
    slug: 'easy2go',
    logo: '/logos/easy2go.png',
    rating: 4.5,
    reviews: 567,
    availableSlots: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
  }
};

// Dispatcher Locations (for Let's Get Moving)
export const LGM_DISPATCHER_LOCATIONS = {
  'Downtown Toronto': {
    name: 'Downtown Toronto',
    address: '276 Carlaw Avenue, Toronto, Ontario M4M 3L1, Canada',
    gid: '1324028052',
    coordinates: [-79.3470, 43.6650]
  },
  'Mississauga': {
    name: 'Mississauga',
    address: 'Mississauga, ON',
    gid: '429580526',
    coordinates: [-79.6583, 43.5890]
  },
  'Markham': {
    name: 'Markham',
    address: 'Markham, ON',
    gid: '853107228',
    coordinates: [-79.2633, 43.8563]
  },
  'Calgary': {
    name: 'Calgary',
    address: 'Calgary, AB',
    gid: '1384980803',
    coordinates: [-114.0719, 51.0447]
  },
  'Edmonton': {
    name: 'Edmonton',
    address: 'Edmonton, AB',
    gid: '1846632241',
    coordinates: [-113.4909, 53.5461]
  },
  'Vancouver': {
    name: 'Vancouver',
    address: 'Vancouver, BC',
    gid: '1985906253',
    coordinates: [-123.1216, 49.2827]
  },
  'Burnaby': {
    name: 'Burnaby',
    address: 'Burnaby, BC',
    gid: '1985906253',
    coordinates: [-122.9742, 49.2488]
  },
  'Montreal': {
    name: 'Montreal',
    address: 'Montreal, QC',
    gid: '1591534972',
    coordinates: [-73.5673, 45.5017]
  },
  'Montreal North': {
    name: 'Montreal North',
    address: 'Montreal North, QC',
    gid: '225755820',
    coordinates: [-73.6500, 45.6000]
  },
  'Ottawa': {
    name: 'Ottawa',
    address: 'Ottawa, ON',
    gid: '268519783',
    coordinates: [-75.6972, 45.4215]
  },
  'Hamilton': {
    name: 'Hamilton',
    address: 'Hamilton, ON',
    gid: '858770585',
    coordinates: [-79.8711, 43.2557]
  },
  'London': {
    name: 'London',
    address: 'London, ON',
    gid: '1311971885',
    coordinates: [-81.2434, 42.9849]
  },
  'Windsor': {
    name: 'Windsor',
    address: 'Windsor, ON',
    gid: '1802285746',
    coordinates: [-83.0370, 42.3149]
  },
  'Winnipeg': {
    name: 'Winnipeg',
    address: 'Winnipeg, MB',
    gid: '885243828',
    coordinates: [-97.1432, 49.8951]
  },
  'Halifax': {
    name: 'Halifax',
    address: 'Halifax, NS',
    gid: '1843371269',
    coordinates: [-63.5752, 44.6488]
  },
  'Fredericton': {
    name: 'Fredericton',
    address: 'Fredericton, NB',
    gid: '627208617',
    coordinates: [-66.6431, 45.9636]
  },
  'Regina': {
    name: 'Regina',
    address: 'Regina, SK',
    gid: '1911372332',
    coordinates: [-104.6178, 50.4452]
  }
};

// Maximum travel time (all legs combined) - long distance threshold
export const MAX_TRAVEL_TIME_HOURS = 10.0;



