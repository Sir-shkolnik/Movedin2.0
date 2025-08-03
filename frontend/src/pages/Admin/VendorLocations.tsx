import React, { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './VendorLocations.css';

interface Location {
  name: string;
  address: string;
  owner: string;
  phone: string;
  email: string;
  sales_phone: string;
  truck_count: string;
  terminal_id: string;
  intersection: string;
  timezone: string;
  calendar_dates_available: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  crew_rates: Record<string, any>;
  operational_rules: Record<string, any>;
  pricing_description: string;
  data_source: string;
  dispatcher_name: string;
}

interface Vendor {
  vendor_name: string;
  vendor_slug: string;
  locations: Location[];
}

interface MapLocation {
  id: string;
  vendor_name: string;
  vendor_slug: string;
  location_name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dispatcher_name: string;
  truck_count: string;
  phone: string;
  color: string;
  available_dates?: number;
  crew_rates?: Record<string, any>;
}

const VendorLocations: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [mapView, setMapView] = useState<'map' | 'list'>('map');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showVendorAreas, setShowVendorAreas] = useState(true);
  const [mapZoom, setMapZoom] = useState(3);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const popup = useRef<any>(null);

  // Enhanced cache for vendor locations (2 weeks)
  const CACHE_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
  const CACHE_KEY = 'vendor_locations_enhanced_cache';
  const COORDINATES_CACHE_KEY = 'vendor_coordinates_cache';

  // Enhanced vendor colors for map markers with better visibility
  const vendorColors = {
    'lets-get-moving': '#2563eb', // Bright Blue
    'easy2go': '#059669', // Bright Green
    'velocity-movers': '#d97706', // Bright Orange
    'pierre-sons': '#dc2626' // Bright Red
  };

  // Enhanced vendor area circles with better visibility
  const vendorAreas = {
    'lets-get-moving': {
      center: [-79.3832, 43.6532], // Toronto
      radius: 150, // km (increased)
      color: '#2563eb',
      opacity: 0.15 // Increased opacity
    },
    'easy2go': {
      center: [-79.3832, 43.6532], // Toronto
      radius: 80, // km (increased)
      color: '#059669',
      opacity: 0.15 // Increased opacity
    },
    'velocity-movers': {
      center: [-79.3832, 43.6532], // Toronto
      radius: 120, // km (increased)
      color: '#d97706',
      opacity: 0.15 // Increased opacity
    },
    'pierre-sons': {
      center: [-79.3832, 43.6532], // Toronto
      radius: 100, // km (increased)
      color: '#dc2626',
      opacity: 0.15 // Increased opacity
    }
  };

  // Enhanced cache functions
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('Using cached vendor locations data');
          return data;
        }
      }
    } catch (error) {
      console.warn('Error reading cache:', error);
    }
    return null;
  };

  const setCachedData = (data: any) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('Cached vendor locations data');
    } catch (error) {
      console.warn('Error writing cache:', error);
    }
  };

  // Cache coordinates separately to avoid Mapbox API calls
  const getCachedCoordinates = (address: string) => {
    try {
      const cached = localStorage.getItem(COORDINATES_CACHE_KEY);
      if (cached) {
        const coordinates = JSON.parse(cached);
        return coordinates[address];
      }
    } catch (error) {
      console.warn('Error reading coordinates cache:', error);
    }
    return null;
  };

  const setCachedCoordinates = (address: string, coordinates: { lat: number; lng: number }) => {
    try {
      const cached = localStorage.getItem(COORDINATES_CACHE_KEY);
      const coordinatesCache = cached ? JSON.parse(cached) : {};
      coordinatesCache[address] = coordinates;
      localStorage.setItem(COORDINATES_CACHE_KEY, JSON.stringify(coordinatesCache));
    } catch (error) {
      console.warn('Error writing coordinates cache:', error);
    }
  };

  const loadVendorLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setVendors(cachedData);
        prepareMapLocations(cachedData);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      const response = await fetch('https://movedin-backend.onrender.com/admin/vendors/locations');
      if (!response.ok) {
        throw new Error('Failed to load vendor locations');
      }

      const data = await response.json();
      setVendors(data);
      prepareMapLocations(data);
      
      // Cache the data
      setCachedData(data);

    } catch (error) {
      console.error('Error loading vendor locations:', error);
      setError('Failed to load vendor locations');
    } finally {
      setLoading(false);
    }
  };

  const prepareMapLocations = (vendorsData: Vendor[]) => {
    const locations: MapLocation[] = [];
    
    vendorsData.forEach(vendor => {
      vendor.locations.forEach(location => {
        // Use cached coordinates if available, otherwise use provided coordinates
        let coordinates = location.coordinates;
        if (!coordinates || (!coordinates.lat && !coordinates.lng)) {
          const cachedCoords = getCachedCoordinates(location.address);
          if (cachedCoords) {
            coordinates = cachedCoords;
          } else {
            // Skip locations without coordinates
            return;
          }
        }

        locations.push({
          id: `${vendor.vendor_slug}-${location.name}`,
          vendor_name: vendor.vendor_name,
          vendor_slug: vendor.vendor_slug,
          location_name: location.name,
          address: location.address,
          coordinates,
          dispatcher_name: location.dispatcher_name || location.owner,
          truck_count: location.truck_count,
          phone: location.sales_phone || location.phone,
          color: vendorColors[vendor.vendor_slug as keyof typeof vendorColors] || '#6b7280',
          available_dates: location.calendar_dates_available,
          crew_rates: location.crew_rates
        });
      });
    });

    console.log('Prepared map locations:', locations.length);
    setMapLocations(locations);
    setFilteredLocations(locations);
  };

  // Filter locations based on search term and selected vendor
  useEffect(() => {
    let filtered = mapLocations;

    // Filter by vendor
    if (selectedVendor !== 'all') {
      filtered = filtered.filter(location => location.vendor_slug === selectedVendor);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(location =>
        location.location_name.toLowerCase().includes(searchLower) ||
        location.address.toLowerCase().includes(searchLower) ||
        location.dispatcher_name.toLowerCase().includes(searchLower) ||
        location.vendor_name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLocations(filtered);
  }, [mapLocations, selectedVendor, searchTerm]);

  const initializeMap = async () => {
    if (!mapContainer.current || mapLoaded) return;

    try {
      // Load Mapbox GL JS dynamically
      const mapboxgl = await import('mapbox-gl');
      
      // Fetch Mapbox access token from backend
      let accessToken = null;
      try {
        const tokenResponse = await fetch('https://movedin-backend.onrender.com/admin/mapbox-token');
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          accessToken = tokenData.access_token;
        }
      } catch (error) {
        console.warn('Failed to fetch Mapbox token from backend:', error);
      }
      
      // Check if we have a valid access token
      if (!accessToken) {
        console.warn('Mapbox access token not available. Using fallback view.');
        showFallbackView();
        return;
      }
      
      // Initialize map centered on Canada
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-96, 56], // Center of Canada
        zoom: 3,
        minZoom: 2,
        maxZoom: 15,
        accessToken: accessToken
      });

      // Create popup for location details
      popup.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      });

      map.current.on('load', () => {
        addMapMarkers();
        if (showVendorAreas) {
          addVendorAreas();
        }
        
        // Set up click handler for location markers
        map.current.on('click', 'locations', (e: any) => {
          const features = e.features;
          if (features.length > 0) {
            const locationId = features[0].properties?.id;
            const location = filteredLocations.find(loc => loc.id === locationId);
            if (location) {
              showLocationPopup(location, e.lngLat);
            }
          }
        });

        // Set up hover effects
        map.current.on('mouseenter', 'locations', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('mouseleave', 'locations', () => {
          map.current.getCanvas().style.cursor = '';
        });

        // Track zoom level
        map.current.on('zoom', () => {
          setMapZoom(map.current.getZoom());
        });
        
        setMapLoaded(true);
      });

    } catch (error) {
      console.error('Error loading map:', error);
      showFallbackView();
    }
  };

  const showFallbackView = () => {
    if (mapContainer.current) {
      mapContainer.current.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f8fafc; border-radius: 12px; padding: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🗺️</div>
          <h3 style="margin: 0 0 0.5rem 0; color: #1f2937;">Interactive Map View</h3>
          <p style="margin: 0 0 1rem 0; color: #6b7280; text-align: center;">
            Mapbox integration not available. Using enhanced list view with location details.
          </p>
          <div style="background: white; border-radius: 8px; padding: 1rem; border: 1px solid #e5e7eb; max-width: 400px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937;">Vendor Locations Summary</h4>
            <div style="font-size: 0.875rem; color: #374151;">
              <p><strong>Total Locations:</strong> ${mapLocations.length}</p>
              <p><strong>Vendors:</strong> ${vendors.length}</p>
              <p><strong>Coverage:</strong> Canada-wide</p>
            </div>
          </div>
          <button 
            onclick="document.querySelector('.view-toggle button[data-view=\"list\"]').click()" 
            style="margin-top: 1rem; background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem;"
          >
            Switch to Enhanced List View
          </button>
        </div>
      `;
    }
    setMapLoaded(true);
  };

  const showLocationPopup = (location: MapLocation, lngLat: any) => {
    if (!popup.current) return;

    const popupContent = `
      <div style="padding: 0.5rem;">
        <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1rem;">${location.location_name}</h4>
        <div style="font-size: 0.875rem; color: #374151;">
          <p style="margin: 0.25rem 0;"><strong>Vendor:</strong> ${location.vendor_name}</p>
          <p style="margin: 0.25rem 0;"><strong>Address:</strong> ${location.address}</p>
          <p style="margin: 0.25rem 0;"><strong>Dispatcher:</strong> ${location.dispatcher_name}</p>
          <p style="margin: 0.25rem 0;"><strong>Phone:</strong> ${location.phone}</p>
          <p style="margin: 0.25rem 0;"><strong>Trucks:</strong> ${location.truck_count}</p>
          ${location.available_dates ? `<p style="margin: 0.25rem 0;"><strong>Available Dates:</strong> ${location.available_dates}</p>` : ''}
        </div>
        <button 
          onclick="window.dispatchEvent(new CustomEvent('selectLocation', {detail: '${location.id}'}))"
          style="margin-top: 0.5rem; background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; width: 100%;"
        >
          View Details
        </button>
      </div>
    `;

    popup.current
      .setLngLat(lngLat)
      .setHTML(popupContent)
      .addTo(map.current);
  };

  const addMapMarkers = () => {
    if (!map.current || !mapLoaded) return;

    console.log('Adding map markers for', filteredLocations.length, 'filtered locations');

    try {
      // Safely remove existing layers and source
      const layersToRemove = ['locations-glow', 'locations'];
      const sourcesToRemove = ['locations'];

      // Remove layers first
      layersToRemove.forEach(layerId => {
        if (map.current.getLayer(layerId)) {
          map.current.removeLayer(layerId);
          console.log(`Removed layer: ${layerId}`);
        }
      });

      // Remove sources after layers
      sourcesToRemove.forEach(sourceId => {
        if (map.current.getSource(sourceId)) {
          map.current.removeSource(sourceId);
          console.log(`Removed source: ${sourceId}`);
        }
      });

      // Wait a bit for cleanup
      setTimeout(() => {
        if (!map.current) return;

        // Create GeoJSON data for the filtered locations
        const geojsonData = {
          type: 'FeatureCollection',
          features: filteredLocations.map(location => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.coordinates.lng, location.coordinates.lat]
            },
            properties: {
              id: location.id,
              vendor_name: location.vendor_name,
              vendor_slug: location.vendor_slug,
              location_name: location.location_name,
              address: location.address,
              color: location.color,
              dispatcher_name: location.dispatcher_name,
              truck_count: location.truck_count,
              phone: location.phone
            }
          }))
        };

        console.log('GeoJSON data:', geojsonData);
        console.log('First location coordinates:', filteredLocations[0]?.coordinates);

        // Add source
        map.current.addSource('locations', {
          type: 'geojson',
          data: geojsonData
        });
        console.log('Added source: locations');

        // Add main markers layer
        map.current.addLayer({
          id: 'locations',
          type: 'circle',
          source: 'locations',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              2, 12,   // zoom level 2, radius 12
              8, 20,   // zoom level 8, radius 20
              15, 30   // zoom level 15, radius 30
            ],
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 4,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 1.0
          }
        });
        console.log('Added layer: locations');

        // Add glow effect layer
        map.current.addLayer({
          id: 'locations-glow',
          type: 'circle',
          source: 'locations',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              2, 18,   // zoom level 2, radius 18
              8, 28,   // zoom level 8, radius 28
              15, 38   // zoom level 15, radius 38
            ],
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 0,
            'circle-opacity': 0.4
          }
        });
        console.log('Added layer: locations-glow');

        // Force repaint
        map.current.triggerRepaint();

        // Verify features are loaded
        setTimeout(() => {
          if (map.current) {
            const features = map.current.querySourceFeatures('locations');
            console.log('Map features count:', features.length);
            console.log('Map features:', features.slice(0, 3));
            
            // Auto-center map
            if (filteredLocations.length > 0) {
              let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
              
              filteredLocations.forEach(location => {
                minLng = Math.min(minLng, location.coordinates.lng);
                maxLng = Math.max(maxLng, location.coordinates.lng);
                minLat = Math.min(minLat, location.coordinates.lat);
                maxLat = Math.max(maxLat, location.coordinates.lat);
              });
              
              const centerLng = (minLng + maxLng) / 2;
              const centerLat = (minLat + maxLat) / 2;
              
              map.current.flyTo({
                center: [centerLng, centerLat],
                zoom: 7,
                duration: 2000
              });
              
              console.log('Flew to center:', [centerLng, centerLat]);
            }
          }
        }, 100);

      }, 50);

    } catch (error) {
      console.error('Error adding map markers:', error);
    }
  };

  const addVendorAreas = () => {
    if (!map.current || !mapLoaded || !showVendorAreas) return;

    // Remove existing area layers
    Object.keys(vendorAreas).forEach(vendorSlug => {
      if (map.current.getSource(`area-${vendorSlug}`)) {
        map.current.removeLayer(`area-border-${vendorSlug}`);
        map.current.removeLayer(`area-${vendorSlug}`);
        map.current.removeSource(`area-${vendorSlug}`);
      }
    });

    Object.entries(vendorAreas).forEach(([vendorSlug, area]) => {
      const center = area.center;
      const radius = area.radius;
      
      // Create circle coordinates
      const circleCoords = [];
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const lat = center[1] + (radius / 111.32) * Math.cos(angle);
        const lng = center[0] + (radius / (111.32 * Math.cos(center[1] * Math.PI / 180))) * Math.sin(angle);
        circleCoords.push([lng, lat]);
      }

      map.current.addSource(`area-${vendorSlug}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [circleCoords]
          },
          properties: {
            vendor_slug: vendorSlug,
            color: area.color,
            opacity: area.opacity
          }
        }
      });

      map.current.addLayer({
        id: `area-${vendorSlug}`,
        type: 'fill',
        source: `area-${vendorSlug}`,
        paint: {
          'fill-color': area.color,
          'fill-opacity': area.opacity
        }
      });

      map.current.addLayer({
        id: `area-border-${vendorSlug}`,
        type: 'line',
        source: `area-${vendorSlug}`,
        paint: {
          'line-color': area.color,
          'line-width': 2,
          'line-opacity': 0.5
        }
      });
    });
  };

  // Update map when filtered locations change
  useEffect(() => {
    if (mapLoaded && map.current) {
      addMapMarkers();
    }
  }, [filteredLocations, mapLoaded]);

  // Update vendor areas when toggle changes
  useEffect(() => {
    if (mapLoaded && map.current) {
      if (showVendorAreas) {
        addVendorAreas();
      } else {
        // Remove vendor areas
        Object.keys(vendorAreas).forEach(vendorSlug => {
          if (map.current.getSource(`area-${vendorSlug}`)) {
            map.current.removeLayer(`area-border-${vendorSlug}`);
            map.current.removeLayer(`area-${vendorSlug}`);
            map.current.removeSource(`area-${vendorSlug}`);
          }
        });
      }
    }
  }, [showVendorAreas, mapLoaded]);

  const getVendorIcon = (vendorSlug: string) => {
    const icons = {
      'lets-get-moving': '🚚',
      'easy2go': '📦',
      'velocity-movers': '⚡',
      'pierre-sons': '🏠'
    };
    return icons[vendorSlug as keyof typeof icons] || '📍';
  };

  const handleLocationSelect = (location: MapLocation) => {
    setSelectedLocation(location);
    if (map.current && location.coordinates) {
      map.current.flyTo({
        center: [location.coordinates.lng, location.coordinates.lat],
        zoom: 10,
        duration: 2000
      });
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(COORDINATES_CACHE_KEY);
    alert('Cache cleared! Reloading data...');
    loadVendorLocations();
  };

  const refreshMap = () => {
    if (mapLoaded && map.current) {
      console.log('Force refreshing map markers');
      
      // Use the same safe approach as addMapMarkers
      addMapMarkers();
      
      // Re-add vendor areas if enabled
      if (showVendorAreas) {
        addVendorAreas();
      }
    }
  };

  const renderMapView = () => (
    <div className="map-container">
      <div className="map-controls">
        <div className="map-control-group">
          <label className="control-label">
            <input
              type="checkbox"
              checked={showVendorAreas}
              onChange={(e) => setShowVendorAreas(e.target.checked)}
            />
            Show Service Areas
          </label>
        </div>
        <div className="map-control-group">
          <span className="zoom-info">Zoom: {mapZoom.toFixed(1)}x</span>
        </div>
      </div>
      <div ref={mapContainer} className="map" />
      {selectedLocation && (
        <div className="location-popup">
          <div className="popup-header">
            <h4>{selectedLocation.location_name}</h4>
            <button onClick={() => setSelectedLocation(null)} className="close-popup">×</button>
          </div>
          <div className="popup-content">
            <p><strong>Vendor:</strong> {selectedLocation.vendor_name}</p>
            <p><strong>Address:</strong> {selectedLocation.address}</p>
            <p><strong>Dispatcher:</strong> {selectedLocation.dispatcher_name}</p>
            <p><strong>Phone:</strong> {selectedLocation.phone}</p>
            <p><strong>Trucks:</strong> {selectedLocation.truck_count}</p>
            {selectedLocation.available_dates && (
              <p><strong>Available Dates:</strong> {selectedLocation.available_dates}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="locations-list">
      <div className="list-header">
        <h3>All Vendor Locations ({filteredLocations.length})</h3>
        <div className="list-controls">
          <button 
            className="refresh-cache-btn"
            onClick={clearCache}
            title="Clear cache and reload data"
          >
            🔄 Clear Cache
          </button>
        </div>
      </div>
      <div className="locations-grid">
        {filteredLocations.map((location) => (
          <div 
            key={location.id} 
            className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
            onClick={() => handleLocationSelect(location)}
          >
            <div className="location-header">
              <div className="location-icon">
                <span className="vendor-icon">{getVendorIcon(location.vendor_slug)}</span>
              </div>
              <div className="location-info">
                <h4>{location.location_name}</h4>
                <p className="vendor-name">{location.vendor_name}</p>
                <p className="location-address">{location.address}</p>
              </div>
              <div className="location-status">
                <span className="status-indicator" style={{ backgroundColor: location.color }}></span>
              </div>
            </div>
            <div className="location-details">
              <div className="detail-row">
                <span className="label">Dispatcher:</span>
                <span className="value">{location.dispatcher_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{location.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Trucks:</span>
                <span className="value">{location.truck_count}</span>
              </div>
              {location.available_dates && (
                <div className="detail-row">
                  <span className="label">Available Dates:</span>
                  <span className="value">{location.available_dates}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="label">Coordinates:</span>
                <span className="value">
                  {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                </span>
              </div>
            </div>
            <div className="location-actions">
              <button 
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (map.current && location.coordinates) {
                    map.current.flyTo({
                      center: [location.coordinates.lng, location.coordinates.lat],
                      zoom: 12,
                      duration: 2000
                    });
                    setMapView('map');
                  }
                }}
              >
                🗺️ Show on Map
              </button>
              <button 
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(location.address);
                  alert('Address copied to clipboard!');
                }}
              >
                📋 Copy Address
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Initialize map when component mounts and map view is selected
  useEffect(() => {
    if (mapView === 'map' && mapLocations.length > 0 && !mapLoaded) {
      initializeMap();
    }
  }, [mapView, mapLocations, mapLoaded]);

  // Load data on component mount
  useEffect(() => {
    loadVendorLocations();
  }, []);

  // Listen for location selection events from popup
  useEffect(() => {
    const handleLocationSelectEvent = (event: CustomEvent) => {
      const locationId = event.detail;
      const location = filteredLocations.find(loc => loc.id === locationId);
      if (location) {
        handleLocationSelect(location);
      }
    };

    window.addEventListener('selectLocation', handleLocationSelectEvent as EventListener);
    return () => {
      window.removeEventListener('selectLocation', handleLocationSelectEvent as EventListener);
    };
  }, [filteredLocations]);

  // Refresh markers when filtered locations change
  useEffect(() => {
    if (mapLoaded && map.current && filteredLocations.length > 0) {
      console.log('Refreshing map markers for', filteredLocations.length, 'locations');
      
      // Ensure map is fully loaded before adding markers
      if (map.current.isStyleLoaded()) {
        addMapMarkers();
        if (showVendorAreas) {
          addVendorAreas();
        }
      } else {
        // Wait for style to load
        map.current.once('styledata', () => {
          addMapMarkers();
          if (showVendorAreas) {
            addVendorAreas();
          }
        });
      }
    }
  }, [filteredLocations, mapLoaded, showVendorAreas]);

  if (loading) {
    return (
      <div className="vendor-locations">
        <div className="vendor-container">
          <div className="vendor-content">
            <div className="vendor-locations-main">
              <div className="loading-section">
                <div className="loading-spinner">🔄</div>
                <p>Loading vendor locations...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vendor-locations">
        <div className="vendor-container">
          <div className="vendor-content">
            <div className="vendor-locations-main">
              <div className="error-section">
                <span>⚠️ {error}</span>
                <button onClick={loadVendorLocations}>Retry</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-locations">
      <div className="vendor-container">
        <div className="vendor-content">
          <div className="vendor-locations-main">
            <div className="page-header">
              <div className="header-content">
                <h1>Vendor Locations</h1>
                <p className="header-subtitle">Interactive map and list of all vendor locations across Canada</p>
              </div>
              <div className="header-actions">
                        <button className="refresh-btn" onClick={refreshMap}>
          🔄 Refresh Map
        </button>
                <button 
                  className="cache-btn"
                  onClick={clearCache}
                  title="Clear cache and reload fresh data"
                >
                  🗑️ Clear Cache
                </button>
              </div>
            </div>

            {/* Controls Section */}
            <div className="controls-section">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search locations, addresses, or dispatchers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="vendor-filter">
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="vendor-select"
                >
                  <option value="all">All Vendors ({vendors.length})</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.vendor_slug} value={vendor.vendor_slug}>
                      {vendor.vendor_name} ({vendor.locations.length})
                    </option>
                  ))}
                </select>
              </div>

              <div className="view-toggle">
                <button
                  className={`toggle-btn ${mapView === 'map' ? 'active' : ''}`}
                  onClick={() => setMapView('map')}
                  data-view="map"
                >
                  🗺️ Map View
                </button>
                <button
                  className={`toggle-btn ${mapView === 'list' ? 'active' : ''}`}
                  onClick={() => setMapView('list')}
                  data-view="list"
                >
                  📋 List View
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-content">
                  <h3>{filteredLocations.length}</h3>
                  <p>Locations Found</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚚</div>
                <div className="stat-content">
                  <h3>{vendors.length}</h3>
                  <p>Vendors</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🗺️</div>
                <div className="stat-content">
                  <h3>Canada</h3>
                  <p>Coverage Area</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💾</div>
                <div className="stat-content">
                  <h3>2 Weeks</h3>
                  <p>Cache Duration</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            {mapView === 'map' ? renderMapView() : renderListView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLocations; 