import React, { useState, useEffect } from 'react';
import './VendorManagement.css';

interface VendorLocation {
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

interface DateAvailability {
  available: boolean;
  daily_rate: number | null;
  hourly_rate: number | null;
  crew_options: Record<string, any>;
}

interface LocationAvailability {
  location_name: string;
  dispatcher_name: string;
  date_availability: Record<string, DateAvailability>;
  total_available_dates: number;
  total_checked_dates: number;
  metadata: {
    ops_manager: string;
    address: string;
    email: string;
    terminal_id: string;
    intersection: string;
    truck_count: string;
    sales_phone: string;
    timezone: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  crew_rates: Record<string, any>;
  operational_rules: Record<string, any>;
  pricing_description: string;
  total_calendar_dates: number;
  data_source: string;
}

interface Vendor {
  vendor_name: string;
  vendor_slug: string;
  locations: VendorLocation[];
}

interface VendorLogic {
  vendor_slug: string;
  calculator_class: string;
  pricing_strategy: string;
  crew_sizing_logic: string;
  truck_sizing_logic: string;
  cost_components: string[];
  special_features: string[];
  service_area: Record<string, any>;
  location_based_rates: Record<string, any>;
  dispatcher_locations: Record<string, any>;
  real_calculation_engine: boolean;
  uses_google_sheets: boolean;
  uses_mapbox: boolean;
  uses_geographic_dispatching: boolean;
}

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [vendorLogic, setVendorLogic] = useState<VendorLogic | null>(null);
  const [locationAvailability, setLocationAvailability] = useState<LocationAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: '2025-08-01',
    end: '2025-08-31'
  });

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      loadVendorLogic(selectedVendor);
      loadLocationAvailability(selectedVendor);
    }
  }, [selectedVendor, selectedDateRange]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/admin/vendors/locations');
      if (!response.ok) {
        throw new Error('Failed to load vendors');
      }
      
      const data = await response.json();
      setVendors(data);
      
      if (data.length > 0) {
        setSelectedVendor(data[0].vendor_slug);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
      setError('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const loadVendorLogic = async (vendorSlug: string) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/vendors/${vendorSlug}/logic`);
      if (!response.ok) {
        throw new Error('Failed to load vendor logic');
      }
      
      const data = await response.json();
      setVendorLogic(data);
    } catch (error) {
      console.error('Error loading vendor logic:', error);
      setError('Failed to load vendor logic');
    }
  };

  const loadLocationAvailability = async (vendorSlug: string) => {
    try {
      setAvailabilityLoading(true);
      const response = await fetch(
        `http://localhost:8000/admin/vendors/availability/bulk?vendor_slug=${vendorSlug}&start_date=${selectedDateRange.start}&end_date=${selectedDateRange.end}`
      );
      if (!response.ok) {
        throw new Error('Failed to load location availability');
      }
      
      const data = await response.json();
      setLocationAvailability(data);
    } catch (error) {
      console.error('Error loading location availability:', error);
      setError('Failed to load location availability');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleVendorChange = async (vendorSlug: string) => {
    setSelectedVendor(vendorSlug);
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#3b82f6';
      case 'contacted': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderVendorOverview = () => {
    const vendor = vendors.find(v => v.vendor_slug === selectedVendor);
    if (!vendor) return null;

    return (
      <div className="vendor-overview">
        <div className="overview-header">
          <h2>{vendor.vendor_name}</h2>
          <div className="vendor-stats">
            <div className="stat">
              <span className="stat-label">Locations</span>
              <span className="stat-value">{vendor.locations.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Calendar Dates</span>
              <span className="stat-value">
                {vendor.locations.reduce((sum, loc) => sum + loc.calendar_dates_available, 0)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Data Source</span>
              <span className="stat-value">{vendor.locations[0]?.data_source || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLocationAvailability = () => {
    if (availabilityLoading) {
      return (
        <div className="loading-section">
          <div className="loading-spinner">🔄</div>
          <p>Loading location availability...</p>
        </div>
      );
    }

    return (
      <div className="location-availability">
        <div className="section-header">
          <h3>Location Availability & Pricing</h3>
          <div className="date-range-selector">
            <label>Date Range:</label>
            <input
              type="date"
              value={selectedDateRange.start}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span>to</span>
            <input
              type="date"
              value={selectedDateRange.end}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        <div className="locations-grid">
          {locationAvailability.map((location, index) => (
            <div key={index} className="location-card">
              <div className="location-header">
                <h4>{location.location_name}</h4>
                <div className="location-meta">
                  <span className="dispatcher">Dispatcher: {location.dispatcher_name}</span>
                  <span className="available-dates">
                    {location.total_available_dates}/{location.total_checked_dates} dates available
                  </span>
                </div>
              </div>

              <div className="location-details">
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">{location.metadata.address}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Manager:</span>
                  <span className="value">{location.metadata.ops_manager || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{location.metadata.sales_phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Trucks:</span>
                  <span className="value">{location.metadata.truck_count || 'N/A'}</span>
                </div>
              </div>

              <div className="pricing-overview">
                <h5>Pricing Overview</h5>
                <div className="pricing-stats">
                  {Object.entries(location.date_availability)
                    .slice(0, 7) // Show first 7 days
                    .map(([date, availability]) => (
                      <div key={date} className="day-pricing">
                        <div className="date">{formatDate(date)}</div>
                        <div className={`rate ${availability.available ? 'available' : 'unavailable'}`}>
                          {availability.available ? formatCurrency(availability.daily_rate) : 'Unavailable'}
                        </div>
                        <div className="availability-indicator">
                          {availability.available ? '✅' : '❌'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="crew-options">
                <h5>Crew Options</h5>
                <div className="crew-grid">
                  {Object.entries(location.crew_rates).map(([truckType, crewOptions]) => (
                    <div key={truckType} className="crew-type">
                      <h6>{truckType.replace('_', ' ').toUpperCase()}</h6>
                      <div className="crew-options-list">
                        {Object.entries(crewOptions as Record<string, any>).map(([crewSize, count]) => (
                          <div key={crewSize} className="crew-option">
                            <span>{crewSize.replace('_', ' ')}</span>
                            <span className="crew-count">{count} men</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVendorLogic = () => {
    if (!vendorLogic) return null;

    return (
      <div className="vendor-logic">
        <h3>Vendor Logic & Configuration</h3>
        <div className="logic-grid">
          <div className="logic-card">
            <h4>Calculator Class</h4>
            <p>{vendorLogic.calculator_class}</p>
          </div>
          
          <div className="logic-card">
            <h4>Pricing Strategy</h4>
            <p>{vendorLogic.pricing_strategy}</p>
          </div>
          
          <div className="logic-card">
            <h4>Crew Sizing Logic</h4>
            <p>{vendorLogic.crew_sizing_logic}</p>
          </div>
          
          <div className="logic-card">
            <h4>Truck Sizing Logic</h4>
            <p>{vendorLogic.truck_sizing_logic}</p>
          </div>
          
          <div className="logic-card">
            <h4>Cost Components</h4>
            <ul>
              {vendorLogic.cost_components.map((component, index) => (
                <li key={index}>{component}</li>
              ))}
            </ul>
          </div>
          
          <div className="logic-card">
            <h4>Special Features</h4>
            <ul>
              {vendorLogic.special_features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="logic-card">
            <h4>Technology Stack</h4>
            <div className="tech-stack">
              <span className={`tech ${vendorLogic.uses_google_sheets ? 'enabled' : 'disabled'}`}>
                📊 Google Sheets: {vendorLogic.uses_google_sheets ? 'Yes' : 'No'}
              </span>
              <span className={`tech ${vendorLogic.uses_mapbox ? 'enabled' : 'disabled'}`}>
                🗺️ Mapbox: {vendorLogic.uses_mapbox ? 'Yes' : 'No'}
              </span>
              <span className={`tech ${vendorLogic.uses_geographic_dispatching ? 'enabled' : 'disabled'}`}>
                📍 Geographic Dispatching: {vendorLogic.uses_geographic_dispatching ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="vendor-management">
        <div className="vendor-container">
          <div className="vendor-content">
            <div className="vendor-management-main">
              <div className="loading-section">
                <div className="loading-spinner">🔄</div>
                <p>Loading vendors...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vendor-management">
        <div className="vendor-container">
          <div className="vendor-content">
            <div className="vendor-management-main">
              <div className="error-section">
                <span>⚠️ {error}</span>
                <button onClick={loadVendors}>Retry</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-management">
      <div className="vendor-container">
        <div className="vendor-content">
          <div className="vendor-management-main">
            <div className="page-header">
              <h1>Vendor Management</h1>
              <p>Manage vendors, view pricing, and monitor location availability</p>
            </div>

            {/* Vendor Selection */}
            <div className="vendor-selection">
              <label htmlFor="vendor-select">Select Vendor:</label>
              <select
                id="vendor-select"
                value={selectedVendor}
                onChange={(e) => handleVendorChange(e.target.value)}
              >
                {vendors.map((vendor) => (
                  <option key={vendor.vendor_slug} value={vendor.vendor_slug}>
                    {vendor.vendor_name} ({vendor.locations.length} locations)
                  </option>
                ))}
              </select>
            </div>

            {selectedVendor && (
              <>
                {renderVendorOverview()}
                {renderLocationAvailability()}
                {renderVendorLogic()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement; 