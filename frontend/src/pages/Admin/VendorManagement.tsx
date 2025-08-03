import React, { useState, useEffect, useMemo } from 'react';
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
  
  // New state for enhanced features
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'availability' | 'rate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    loadVendors();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      if (selectedVendor) {
        loadLocationAvailability(selectedVendor);
      }
    }, 5 * 60 * 1000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://movedin-backend.onrender.com/admin/vendors/live-status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setVendors(data);
      
      // Auto-select first vendor if none selected
      if (data.length > 0 && !selectedVendor) {
        setSelectedVendor(data[0].vendor_slug);
        await handleVendorChange(data[0].vendor_slug);
      }
      
    } catch (err) {
      console.error('Error loading vendors:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const loadVendorLogic = async (vendorSlug: string) => {
    try {
      const response = await fetch(`https://movedin-backend.onrender.com/admin/vendors/${vendorSlug}/logic`);
      if (response.ok) {
        const data = await response.json();
        setVendorLogic(data);
      }
    } catch (err) {
      console.error('Error loading vendor logic:', err);
    }
  };

  const loadLocationAvailability = async (vendorSlug: string) => {
    try {
      setAvailabilityLoading(true);
      setError(null);
      
      const response = await fetch(`https://movedin-backend.onrender.com/admin/vendors/${vendorSlug}/availability?start_date=${selectedDateRange.start}&end_date=${selectedDateRange.end}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLocationAvailability(data);
      
    } catch (err) {
      console.error('Error loading location availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to load location availability');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleVendorChange = async (vendorSlug: string) => {
    setSelectedVendor(vendorSlug);
    await Promise.all([
      loadVendorLogic(vendorSlug),
      loadLocationAvailability(vendorSlug)
    ]);
  };

  const handleRefresh = async () => {
    if (selectedVendor) {
      await loadLocationAvailability(selectedVendor);
    }
  };

  const handleBulkAction = async (action: 'refresh' | 'export' | 'analyze') => {
    switch (action) {
      case 'refresh':
        await handleRefresh();
        break;
      case 'export':
        exportLocationData();
        break;
      case 'analyze':
        analyzeLocationData();
        break;
    }
  };

  const exportLocationData = () => {
    const data = {
      vendor: selectedVendor,
      dateRange: selectedDateRange,
      locations: locationAvailability,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-locations-${selectedVendor}-${selectedDateRange.start}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const analyzeLocationData = () => {
    const analysis = {
      totalLocations: locationAvailability.length,
      availableLocations: locationAvailability.filter(loc => loc.total_available_dates > 0).length,
      unavailableLocations: locationAvailability.filter(loc => loc.total_available_dates === 0).length,
      averageAvailability: locationAvailability.reduce((sum, loc) => sum + (loc.total_available_dates / loc.total_checked_dates), 0) / locationAvailability.length,
      rateRange: {
        min: Math.min(...locationAvailability.flatMap(loc => Object.values(loc.date_availability).map(d => d.daily_rate).filter(rate => rate !== null))),
        max: Math.max(...locationAvailability.flatMap(loc => Object.values(loc.date_availability).map(d => d.daily_rate).filter(rate => rate !== null)))
      }
    };
    
    console.log('Location Analysis:', analysis);
    alert(`Analysis Complete!\nTotal: ${analysis.totalLocations}\nAvailable: ${analysis.availableLocations}\nUnavailable: ${analysis.unavailableLocations}\nAvg Availability: ${(analysis.averageAvailability * 100).toFixed(1)}%`);
  };

  // Enhanced filtering and sorting
  const filteredAndSortedLocations = useMemo(() => {
    let filtered = locationAvailability;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(loc => 
        loc.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.metadata.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.metadata.ops_manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(loc => {
        const isAvailable = loc.total_available_dates > 0;
        return filterStatus === 'available' ? isAvailable : !isAvailable;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.location_name.localeCompare(b.location_name);
          break;
        case 'availability':
          comparison = (a.total_available_dates / a.total_checked_dates) - (b.total_available_dates / b.total_checked_dates);
          break;
        case 'rate':
          const aAvgRate = Object.values(a.date_availability).reduce((sum, d) => sum + (d.daily_rate || 0), 0) / Object.keys(a.date_availability).length;
          const bAvgRate = Object.values(b.date_availability).reduce((sum, d) => sum + (d.daily_rate || 0), 0) / Object.keys(b.date_availability).length;
          comparison = aAvgRate - bAvgRate;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [locationAvailability, searchTerm, filterStatus, sortBy, sortOrder]);

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
    switch (status.toLowerCase()) {
      case 'available':
      case 'active':
        return '#10b981';
      case 'unavailable':
      case 'inactive':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getAvailabilityPercentage = (location: LocationAvailability) => {
    if (location.total_checked_dates === 0) return 0;
    return (location.total_available_dates / location.total_checked_dates) * 100;
  };

  const renderVendorOverview = () => {
    const selectedVendorData = vendors.find(v => v.vendor_slug === selectedVendor);
    if (!selectedVendorData) return null;

    const totalLocations = selectedVendorData.locations.length;
    const availableLocations = locationAvailability.filter(loc => loc.total_available_dates > 0).length;
    const totalCalendarDates = locationAvailability.reduce((sum, loc) => sum + loc.total_calendar_dates, 0);

    return (
      <div className="vendor-overview">
        <div className="overview-header">
          <h2>{selectedVendorData.vendor_name}</h2>
          <div className="overview-stats">
            <div className="stat-card">
              <div className="stat-number">{totalLocations}</div>
              <div className="stat-label">Total Locations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{availableLocations}</div>
              <div className="stat-label">Available Locations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalCalendarDates.toLocaleString()}</div>
              <div className="stat-label">Calendar Dates</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{((availableLocations / totalLocations) * 100).toFixed(1)}%</div>
              <div className="stat-label">Availability Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLocationCard = (location: LocationAvailability) => {
    const availabilityPercentage = getAvailabilityPercentage(location);
    const isSelected = selectedLocations.includes(location.location_name);
    
    return (
      <div 
        key={location.location_name}
        className={`location-card ${isSelected ? 'selected' : ''} ${availabilityPercentage === 0 ? 'unavailable' : ''}`}
        onClick={() => {
          if (isSelected) {
            setSelectedLocations(selectedLocations.filter(name => name !== location.location_name));
          } else {
            setSelectedLocations([...selectedLocations, location.location_name]);
          }
        }}
      >
        <div className="card-header">
          <h3 className="location-name">{location.location_name}</h3>
          <div className="availability-badge">
            {availabilityPercentage > 0 ? '✅' : '❌'} {location.total_available_dates}/{location.total_checked_dates}
          </div>
        </div>
        
        <div className="card-content">
          <div className="location-details">
            <div className="detail-item">
              <strong>Dispatcher:</strong> {location.dispatcher_name}
            </div>
            <div className="detail-item">
              <strong>Address:</strong> {location.metadata.address || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Manager:</strong> {location.metadata.ops_manager || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Phone:</strong> {location.metadata.sales_phone || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Trucks:</strong> {location.metadata.truck_count || 'N/A'}
            </div>
          </div>
          
          <div className="pricing-overview">
            <h4>Pricing Overview</h4>
            <div className="date-range">
              {selectedDateRange.start} to {selectedDateRange.end}
            </div>
            <div className="pricing-grid">
              {Object.entries(location.date_availability).slice(0, 7).map(([date, availability]) => (
                <div key={date} className="pricing-item">
                  <div className="date">{formatDate(date)}</div>
                  <div className={`rate ${availability.available ? 'available' : 'unavailable'}`}>
                    {availability.available ? formatCurrency(availability.daily_rate) : 'Unavailable'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              // Add action for viewing details
            }}
          >
            View Details
          </button>
          <button 
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              // Add action for editing
            }}
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  const renderLocationTable = () => {
    return (
      <div className="location-table">
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Availability</th>
              <th>Manager</th>
              <th>Phone</th>
              <th>Trucks</th>
              <th>Avg Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLocations.map(location => {
              const availabilityPercentage = getAvailabilityPercentage(location);
              const avgRate = Object.values(location.date_availability)
                .filter(d => d.available)
                .reduce((sum, d) => sum + (d.daily_rate || 0), 0) / 
                Object.values(location.date_availability).filter(d => d.available).length;
              
              return (
                <tr key={location.location_name}>
                  <td>
                    <div className="location-cell">
                      <strong>{location.location_name}</strong>
                      <small>{location.metadata.address}</small>
                    </div>
                  </td>
                  <td>
                    <div className="availability-cell">
                      <div className="availability-bar">
                        <div 
                          className="availability-fill" 
                          style={{ width: `${availabilityPercentage}%` }}
                        ></div>
                      </div>
                      <span>{location.total_available_dates}/{location.total_checked_dates}</span>
                    </div>
                  </td>
                  <td>{location.metadata.ops_manager || 'N/A'}</td>
                  <td>{location.metadata.sales_phone || 'N/A'}</td>
                  <td>{location.metadata.truck_count || 'N/A'}</td>
                  <td>{formatCurrency(avgRate)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-small">View</button>
                      <button className="btn-small">Edit</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLocationAvailability = () => {
    if (availabilityLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading location availability...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="location-availability">
        <div className="controls-section">
          <div className="view-controls">
            <div className="view-mode-buttons">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Table View
              </button>
            </div>
            
            <div className="filter-controls">
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">All Locations</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="availability">Sort by Availability</option>
                <option value="rate">Sort by Rate</option>
              </select>
              
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="sort-order-btn"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          <div className="bulk-actions">
            <button 
              onClick={() => handleBulkAction('refresh')}
              className="bulk-btn"
            >
              🔄 Refresh
            </button>
            <button 
              onClick={() => handleBulkAction('export')}
              className="bulk-btn"
            >
              📊 Export
            </button>
            <button 
              onClick={() => handleBulkAction('analyze')}
              className="bulk-btn"
            >
              📈 Analyze
            </button>
          </div>
        </div>
        
        <div className="results-summary">
          <p>
            Showing {filteredAndSortedLocations.length} of {locationAvailability.length} locations
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
        
        <div className={`locations-container ${viewMode}`}>
          {viewMode === 'table' ? (
            renderLocationTable()
          ) : (
            filteredAndSortedLocations.map(renderLocationCard)
          )}
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
        </div>
        
        <div className="features-section">
          <h4>Special Features</h4>
          <div className="features-grid">
            {vendorLogic.special_features.map((feature, index) => (
              <div key={index} className="feature-item">
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        <div className="technology-stack">
          <h4>Technology Stack</h4>
          <div className="tech-grid">
            <div className={`tech-item ${vendorLogic.uses_google_sheets ? 'active' : ''}`}>
              📊 Google Sheets: {vendorLogic.uses_google_sheets ? 'Yes' : 'No'}
            </div>
            <div className={`tech-item ${vendorLogic.uses_mapbox ? 'active' : ''}`}>
              🗺️ Mapbox: {vendorLogic.uses_mapbox ? 'Yes' : 'No'}
            </div>
            <div className={`tech-item ${vendorLogic.uses_geographic_dispatching ? 'active' : ''}`}>
              📍 Geographic Dispatching: {vendorLogic.uses_geographic_dispatching ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading vendor management...</p>
      </div>
    );
  }

  return (
    <div className="vendor-management">
      <div className="page-header">
        <h1>Vendor Management</h1>
        <p>Manage vendors, view pricing, and monitor location availability</p>
      </div>

      <div className="vendor-selection">
        <label htmlFor="vendor-select">Select Vendor:</label>
        <select
          id="vendor-select"
          value={selectedVendor}
          onChange={(e) => handleVendorChange(e.target.value)}
          className="vendor-select"
        >
          {vendors.map(vendor => (
            <option key={vendor.vendor_slug} value={vendor.vendor_slug}>
              {vendor.vendor_name} ({vendor.locations.length} locations)
            </option>
          ))}
        </select>
      </div>

      {selectedVendor && (
        <>
          {renderVendorOverview()}
          
          <div className="date-range-section">
            <label>Date Range:</label>
            <input
              type="date"
              value={selectedDateRange.start}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={selectedDateRange.end}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="date-input"
            />
            <button onClick={handleRefresh} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>

          {renderLocationAvailability()}
          {renderVendorLogic()}
        </>
      )}
    </div>
  );
};

export default VendorManagement; 