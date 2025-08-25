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

// Add new interfaces for calculator control
interface CalculatorSettings {
  heavy_items_rates: Record<string, number>;
  additional_services_rates: Record<string, number>;
  fuel_charges: Record<string, number>;
  crew_sizing_rules: Record<string, any>;
  truck_sizing_rules: Record<string, any>;
}

interface QuotePreview {
  original_quote: any;
  modified_quote: any;
  differences: any;
  loading: boolean;
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

  // New state for calculator control
  const [calculatorSettings, setCalculatorSettings] = useState<CalculatorSettings>({
    heavy_items_rates: { piano: 250, safe: 300, treadmill: 100 },
    additional_services_rates: { packing: 110, storage: 200, cleaning: 396, junk: 150 },
    fuel_charges: {},
    crew_sizing_rules: {},
    truck_sizing_rules: {}
  });
  const [quotePreview, setQuotePreview] = useState<QuotePreview>({
    original_quote: null,
    modified_quote: null,
    differences: null,
    loading: false
  });
  const [showCalculatorPanel, setShowCalculatorPanel] = useState(false);
  const [testQuoteRequest, setTestQuoteRequest] = useState({
    origin_address: 'Toronto, ON',
    destination_address: 'Mississauga, ON',
    move_date: '2025-04-07',
    move_time: '09:00',
    total_rooms: 3,
    square_footage: '1500',
    estimated_weight: 3000,
    heavy_items: { piano: 0, safe: 0, treadmill: 0 },
    stairs_at_pickup: 0,
    stairs_at_dropoff: 0,
    elevator_at_pickup: false,
    elevator_at_dropoff: false,
    additional_services: { packing: false, storage: false, cleaning: false, junk: false }
  });

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    visible: boolean;
  }>({
    type: 'info',
    message: '',
    visible: false
  });

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
      
      // Transform the API response to match our expected format
      const transformedVendors: Vendor[] = Object.entries(data.vendors).map(([slug, vendorData]: [string, any]) => ({
        vendor_name: vendorData.name,
        vendor_slug: slug,
        locations: [] // We'll load locations separately
      }));
      
      setVendors(transformedVendors);
      
      // Auto-select first vendor if none selected
      if (transformedVendors.length > 0 && !selectedVendor) {
        setSelectedVendor(transformedVendors[0].vendor_slug);
        await handleVendorChange(transformedVendors[0].vendor_slug);
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
      
      const response = await fetch(`https://movedin-backend.onrender.com/admin/vendors/availability/bulk?vendor_slug=${vendorSlug}&start_date=${selectedDateRange.start}&end_date=${selectedDateRange.end}`);
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

  // Calculator Control Functions
  const modifyVendorRates = async (vendorSlug: string, modifications: any) => {
    try {
      const response = await fetch(`https://movedin-backend.onrender.com/admin/vendors/${vendorSlug}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modifications, description: 'Modified via admin panel' })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Vendor rates modified:', result);
        // Update local settings
        setCalculatorSettings(prev => ({
          ...prev,
          ...modifications
        }));
        showNotification('success', `Vendor ${vendorSlug} rates modified successfully!`);
        return result;
      } else {
        throw new Error('Failed to modify vendor rates');
      }
    } catch (error) {
      console.error('Error modifying vendor rates:', error);
      showNotification('error', `Failed to modify vendor rates: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const generateQuotePreview = async () => {
    if (!selectedVendor) return;
    
    setQuotePreview(prev => ({ ...prev, loading: true }));
    
    try {
      // Generate quote with current settings
      const response = await fetch('https://movedin-backend.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testQuoteRequest)
      });
      
      if (response.ok) {
        const quotes = await response.json();
        const vendorQuote = quotes.find((q: any) => q.vendor_slug === selectedVendor);
        
        if (vendorQuote) {
          setQuotePreview(prev => ({
            ...prev,
            original_quote: vendorQuote,
            loading: false
          }));
        }
      }
    } catch (error) {
      console.error('Error generating quote preview:', error);
      setQuotePreview(prev => ({ ...prev, loading: false }));
    }
  };

  const resetVendorLogic = async (vendorSlug: string) => {
    try {
      const response = await fetch(`https://movedin-backend.onrender.com/admin/vendors/${vendorSlug}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Vendor logic reset:', result);
        // Reset local settings to defaults
        setCalculatorSettings({
          heavy_items_rates: { piano: 250, safe: 300, treadmill: 100 },
          additional_services_rates: { packing: 110, storage: 200, cleaning: 396, junk: 150 },
          fuel_charges: {},
          crew_sizing_rules: {},
          truck_sizing_rules: {}
        });
        showNotification('success', `Vendor ${vendorSlug} logic reset to defaults!`);
        return result;
      } else {
        throw new Error('Failed to reset vendor logic');
      }
    } catch (error) {
      console.error('Error resetting vendor logic:', error);
      showNotification('error', `Failed to reset vendor logic: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const compareVendorQuotes = async () => {
    try {
      const response = await fetch('https://movedin-backend.onrender.com/admin/vendors/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Admin Panel Comparison',
          test_request: testQuoteRequest
        })
      });
      
      if (response.ok) {
        const comparison = await response.json();
        setQuotePreview(prev => ({
          ...prev,
          original_quote: comparison.original_results[selectedVendor],
          modified_quote: comparison.modified_results[selectedVendor],
          differences: comparison.differences[selectedVendor]
        }));
        return comparison;
      } else {
        throw new Error('Failed to compare vendor quotes');
      }
    } catch (error) {
      console.error('Error comparing vendor quotes:', error);
      throw error;
    }
  };

  // Notification functions
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
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

    const totalLocations = locationAvailability.length;
    const availableLocations = locationAvailability.filter(loc => loc.total_available_dates > 0).length;
    const totalCalendarDates = locationAvailability.reduce((sum, loc) => sum + loc.total_calendar_dates, 0);
    const availabilityRate = totalLocations > 0 ? ((availableLocations / totalLocations) * 100) : 0;

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
              <div className="stat-number">{availabilityRate.toFixed(1)}%</div>
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

        {/* Calculator Control Panel */}
        <div className="calculator-control-panel">
          <div className="panel-header">
            <h4>🧮 Calculator Control Panel</h4>
            <button 
              className="toggle-btn"
              onClick={() => setShowCalculatorPanel(!showCalculatorPanel)}
            >
              {showCalculatorPanel ? 'Hide' : 'Show'} Calculator Controls
            </button>
          </div>
          
          {showCalculatorPanel && (
            <div className="calculator-controls">
              {/* Rate Editing Interface */}
              <div className="rate-editing-section">
                <h5>💰 Rate Editing</h5>
                <div className="rate-grid">
                  <div className="rate-category">
                    <h6>Heavy Items Rates</h6>
                    {Object.entries(calculatorSettings.heavy_items_rates).map(([item, rate]) => (
                      <div key={item} className="rate-input-group">
                        <label>{item.charAt(0).toUpperCase() + item.slice(1)}:</label>
                        <input
                          type="number"
                          value={rate}
                          onChange={(e) => setCalculatorSettings(prev => ({
                            ...prev,
                            heavy_items_rates: {
                              ...prev.heavy_items_rates,
                              [item]: parseFloat(e.target.value) || 0
                            }
                          }))}
                          min="0"
                          step="10"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="rate-category">
                    <h6>Additional Services Rates</h6>
                    {Object.entries(calculatorSettings.additional_services_rates).map(([service, rate]) => (
                      <div key={service} className="rate-input-group">
                        <label>{service.charAt(0).toUpperCase() + service.slice(1)}:</label>
                        <input
                          type="number"
                          value={rate}
                          onChange={(e) => setCalculatorSettings(prev => ({
                            ...prev,
                            additional_services_rates: {
                              ...prev.additional_services_rates,
                              [service]: parseFloat(e.target.value) || 0
                            }
                          }))}
                          min="0"
                          step="10"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rate-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => modifyVendorRates(selectedVendor, {
                      heavy_items_rates: calculatorSettings.heavy_items_rates,
                      additional_services_rates: calculatorSettings.additional_services_rates
                    })}
                  >
                    💾 Apply Rate Changes
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => resetVendorLogic(selectedVendor)}
                  >
                    🔄 Reset to Defaults
                  </button>
                </div>
              </div>

              {/* Real-time Quote Preview */}
              <div className="quote-preview-section">
                <h5>📊 Real-time Quote Preview</h5>
                <div className="test-quote-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Origin:</label>
                      <input
                        type="text"
                        value={testQuoteRequest.origin_address}
                        onChange={(e) => setTestQuoteRequest(prev => ({
                          ...prev,
                          origin_address: e.target.value
                        }))}
                        placeholder="Toronto, ON"
                      />
                    </div>
                    <div className="form-group">
                      <label>Destination:</label>
                      <input
                        type="text"
                        value={testQuoteRequest.destination_address}
                        onChange={(e) => setTestQuoteRequest(prev => ({
                          ...prev,
                          destination_address: e.target.value
                        }))}
                        placeholder="Mississauga, ON"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Rooms:</label>
                      <input
                        type="number"
                        value={testQuoteRequest.total_rooms}
                        onChange={(e) => setTestQuoteRequest(prev => ({
                          ...prev,
                          total_rooms: parseInt(e.target.value) || 1
                        }))}
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Weight (lbs):</label>
                      <input
                        type="number"
                        value={testQuoteRequest.estimated_weight}
                        onChange={(e) => setTestQuoteRequest(prev => ({
                          ...prev,
                          estimated_weight: parseInt(e.target.value) || 1000
                        }))}
                        min="500"
                        step="500"
                      />
                    </div>
                  </div>

                  <div className="quote-preview-actions">
                    <button 
                      className="action-btn primary"
                      onClick={generateQuotePreview}
                      disabled={quotePreview.loading}
                    >
                      {quotePreview.loading ? '🔄 Generating...' : '📊 Generate Quote Preview'}
                    </button>
                    <button 
                      className="action-btn secondary"
                      onClick={compareVendorQuotes}
                    >
                      ⚖️ Compare Quotes
                    </button>
                  </div>
                </div>

                {/* Quote Preview Results */}
                {quotePreview.original_quote && (
                  <div className="quote-preview-results">
                    <h6>Quote Results</h6>
                    <div className="quote-comparison">
                      <div className="quote-card">
                        <h7>Original Quote</h7>
                        <div className="quote-details">
                          <p><strong>Total Cost:</strong> ${quotePreview.original_quote.total_cost?.toFixed(2) || 'N/A'}</p>
                          <p><strong>Crew Size:</strong> {quotePreview.original_quote.crew_size || 'N/A'}</p>
                          <p><strong>Truck Count:</strong> {quotePreview.original_quote.truck_count || 'N/A'}</p>
                          <p><strong>Estimated Hours:</strong> {quotePreview.original_quote.estimated_hours || 'N/A'}</p>
                        </div>
                      </div>
                      
                      {quotePreview.modified_quote && (
                        <div className="quote-card">
                          <h7>Modified Quote</h7>
                          <div className="quote-details">
                            <p><strong>Total Cost:</strong> ${quotePreview.modified_quote.total_cost?.toFixed(2) || 'N/A'}</p>
                            <p><strong>Crew Size:</strong> {quotePreview.modified_quote.crew_size || 'N/A'}</p>
                            <p><strong>Truck Count:</strong> {quotePreview.modified_quote.truck_count || 'N/A'}</p>
                            <p><strong>Estimated Hours:</strong> {quotePreview.modified_quote.estimated_hours || 'N/A'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {quotePreview.differences && (
                      <div className="quote-differences">
                        <h7>Changes</h7>
                        <div className="differences-grid">
                          <div className="difference-item">
                            <span>Cost Difference:</span>
                            <span className={quotePreview.differences.cost_difference > 0 ? 'positive' : 'negative'}>
                              ${quotePreview.differences.cost_difference?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="difference-item">
                            <span>Percentage Change:</span>
                            <span className={quotePreview.differences.percentage_change > 0 ? 'positive' : 'negative'}>
                              {quotePreview.differences.percentage_change?.toFixed(2) || '0.00'}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Calculator Settings Panel */}
              <div className="calculator-settings-section">
                <h5>⚙️ Calculator Settings</h5>
                <div className="settings-grid">
                  <div className="setting-group">
                    <h6>Service Area Configuration</h6>
                    <div className="service-area-info">
                      <p><strong>Max Distance:</strong> {vendorLogic.service_area.max_distance_km || 'N/A'} km</p>
                      <p><strong>Cities Covered:</strong> {vendorLogic.service_area.cities?.length || 'N/A'}</p>
                      <p><strong>Regions Covered:</strong> {vendorLogic.service_area.regions?.length || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="setting-group">
                    <h6>Calculation Parameters</h6>
                    <div className="calculation-info">
                      <p><strong>Real Calculation Engine:</strong> {vendorLogic.real_calculation_engine ? '✅ Yes' : '❌ No'}</p>
                      <p><strong>Uses Google Sheets:</strong> {vendorLogic.uses_google_sheets ? '✅ Yes' : '❌ No'}</p>
                      <p><strong>Uses Mapbox:</strong> {vendorLogic.uses_mapbox ? '✅ Yes' : '❌ No'}</p>
                      <p><strong>Geographic Dispatching:</strong> {vendorLogic.uses_geographic_dispatching ? '✅ Yes' : '❌ No'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="settings-actions">
                  <button 
                    className="action-btn info"
                    onClick={() => window.open(`/admin/vendors/${selectedVendor}/logic`, '_blank')}
                  >
                    📋 View Full Logic
                  </button>
                  <button 
                    className="action-btn warning"
                    onClick={() => compareVendorQuotes()}
                  >
                    🔍 Test Calculator
                  </button>
                </div>
              </div>
            </div>
          )}
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
      {/* Notification Component */}
      {notification.visible && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
          <button className="notification-close" onClick={hideNotification}>
            ×
          </button>
        </div>
      )}

      <div className="vendor-management-header">
        <div className="header-content">
          <h2>Vendor Management</h2>
          <p>Manage vendors, locations, and pricing logic</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-btn primary"
            onClick={() => setShowCalculatorPanel(!showCalculatorPanel)}
          >
            🧮 {showCalculatorPanel ? 'Hide' : 'Show'} Calculator Controls
          </button>
          <button 
            className="action-btn secondary"
            onClick={handleRefresh}
            disabled={availabilityLoading}
          >
            🔄 Refresh
          </button>
        </div>
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
              {vendor.vendor_name} ({vendor.vendor_slug === selectedVendor ? locationAvailability.length : '...'} locations)
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