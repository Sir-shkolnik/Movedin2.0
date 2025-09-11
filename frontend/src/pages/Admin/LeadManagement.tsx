import React, { useState, useEffect, useMemo } from 'react';
import './LeadManagement.css';

interface Lead {
  id: number;
  status: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  origin_address?: string;
  destination_address?: string;
  move_date?: string;
  move_time?: string;
  total_rooms?: number;
  square_footage?: number;
  estimated_weight?: number;
  heavy_items?: Record<string, any>;
  stairs_at_pickup?: number;
  stairs_at_dropoff?: number;
  elevator_at_pickup?: boolean;
  elevator_at_dropoff?: boolean;
  additional_services?: Record<string, any>;
  selected_vendor_id?: string;
  payment_intent_id?: string;
  source?: string;
  vendor_name?: string;
  quote_amount?: number;
  lead_score?: number;
  last_contact?: string;
  notes?: string;
}

interface Vendor {
  id: string;
  name: string;
  color: string;
  location_count: number;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  conversion_rate: number;
  avg_lead_score: number;
  total_value: number;
}

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'kanban'>('list');
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadLeads();
    loadVendors();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://movedin-backend.onrender.com/admin/leads');
      if (!response.ok) {
        throw new Error('Failed to load leads');
      }
      
      const data = await response.json();
      // Enhance leads with vendor information and lead scoring
      const enhancedLeads = data.map((lead: Lead) => ({
        ...lead,
        lead_score: calculateLeadScore(lead),
        vendor_name: getVendorName(lead.selected_vendor_id),
        last_contact: lead.last_contact || lead.created_at
      }));
      setLeads(enhancedLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const response = await fetch('https://movedin-backend.onrender.com/admin/vendors/locations');
      if (response.ok) {
        const data = await response.json();
        const vendorList = data.map((vendor: any) => ({
          id: vendor.vendor_id || vendor.id,
          name: vendor.vendor_name,
          color: getVendorColor(vendor.vendor_name),
          location_count: vendor.locations?.length || 0
        }));
        setVendors(vendorList);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  const getVendorColor = (vendorName: string): string => {
    const colors: Record<string, string> = {
      'lets-get-moving': '#2563eb',
      'easy2go': '#059669',
      'velocity-movers': '#d97706',
      'pierre-sons': '#dc2626'
    };
    return colors[vendorName?.toLowerCase()] || '#6b7280';
  };

  const getVendorName = (vendorId?: string): string => {
    if (!vendorId) return 'Unassigned';
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || 'Unknown Vendor';
  };

  const calculateLeadScore = (lead: Lead): number => {
    let score = 0;
    
    // Contact information completeness
    if (lead.email) score += 10;
    if (lead.phone) score += 10;
    if (lead.first_name && lead.last_name) score += 10;
    
    // Move details completeness
    if (lead.origin_address && lead.destination_address) score += 15;
    if (lead.move_date) score += 10;
    if (lead.total_rooms) score += 5;
    if (lead.square_footage) score += 5;
    
    // Additional details
    if (lead.estimated_weight) score += 5;
    if (lead.additional_services) score += 5;
    
    // Recency bonus
    const daysSinceCreation = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreation <= 1) score += 10;
    else if (daysSinceCreation <= 7) score += 5;
    
    return Math.min(score, 100);
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      setError('Failed to update lead status');
    }
  };

  const handleVendorAssignment = async (leadId: number, vendorId: string) => {
    try {
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId ? { 
            ...lead, 
            selected_vendor_id: vendorId,
            vendor_name: getVendorName(vendorId)
          } : lead
        )
      );
      
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? { 
          ...prev, 
          selected_vendor_id: vendorId,
          vendor_name: getVendorName(vendorId)
        } : null);
      }
    } catch (error) {
      console.error('Error assigning vendor:', error);
      setError('Failed to assign vendor');
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Origin', 'Destination', 'Move Date', 'Status', 'Vendor', 'Lead Score', 'Quote Amount', 'Created At'],
      ...filteredLeads.map(lead => [
        lead.id.toString(),
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        lead.email || '',
        lead.phone || '',
        lead.origin_address || '',
        lead.destination_address || '',
        lead.move_date || '',
        lead.status,
        lead.vendor_name || 'Unassigned',
        lead.lead_score?.toString() || '0',
        lead.quote_amount?.toString() || '',
        new Date(lead.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesFilter = filter === 'all' || lead.status === filter;
      const matchesVendor = vendorFilter === 'all' || lead.selected_vendor_id === vendorFilter;
      const matchesSearch = searchTerm === '' || 
        `${lead.first_name || ''} ${lead.last_name || ''} ${lead.email || ''} ${lead.phone || ''} ${lead.origin_address || ''} ${lead.destination_address || ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesFilter && matchesVendor && matchesSearch;
    });

    // Sort leads
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Lead];
      let bValue: any = b[sortBy as keyof Lead];
      
      if (sortBy === 'created_at' || sortBy === 'last_contact') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [leads, filter, vendorFilter, searchTerm, sortBy, sortOrder]);

  const leadStats = useMemo((): LeadStats => {
    const total = leads.length;
    const new_count = leads.filter(l => l.status === 'new').length;
    const contacted_count = leads.filter(l => l.status === 'contacted').length;
    const qualified_count = leads.filter(l => l.status === 'qualified').length;
    const converted_count = leads.filter(l => l.status === 'converted').length;
    const lost_count = leads.filter(l => l.status === 'lost').length;
    
    const conversion_rate = total > 0 ? (converted_count / total) * 100 : 0;
    const avg_lead_score = total > 0 ? leads.reduce((sum, lead) => sum + (lead.lead_score || 0), 0) / total : 0;
    const total_value = leads.reduce((sum, lead) => sum + (lead.quote_amount || 0), 0);

    return {
      total,
      new: new_count,
      contacted: contacted_count,
      qualified: qualified_count,
      converted: converted_count,
      lost: lost_count,
      conversion_rate,
      avg_lead_score,
      total_value
    };
  }, [leads]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#3b82f6';
      case 'contacted': return '#f59e0b';
      case 'qualified': return '#10b981';
      case 'converted': return '#059669';
      case 'lost': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="lead-management">
        <div className="loading">🔄 Loading leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lead-management">
        <div className="error">⚠️ {error}</div>
        <button onClick={loadLeads}>Retry</button>
      </div>
    );
  }

  return (
    <div className="lead-management">
      <div className="lead-container">
        <div className="lead-content">
          <div className="lead-management-main">
            {/* Header */}
            <div className="lead-header">
              <div className="header-content">
                <h1>Lead Management</h1>
                <p className="header-subtitle">Smart lead tracking and vendor management</p>
              </div>
              <div className="header-actions">
                <button className="analytics-btn" onClick={() => setShowAnalytics(!showAnalytics)}>
                  📊 {showAnalytics ? 'Hide' : 'Show'} Analytics
                </button>
                <button className="refresh-btn" onClick={loadLeads}>
                  🔄 Refresh
                </button>
                <button className="export-btn" onClick={exportLeads}>
                  📊 Export CSV
                </button>
              </div>
            </div>

            {/* Analytics Dashboard */}
            {showAnalytics && (
              <div className="analytics-dashboard">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                      <h3>{leadStats.total}</h3>
                      <p>Total Leads</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                      <h3>{leadStats.conversion_rate.toFixed(1)}%</h3>
                      <p>Conversion Rate</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <h3>{formatCurrency(leadStats.total_value)}</h3>
                      <p>Total Value</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <h3>{leadStats.avg_lead_score.toFixed(0)}</h3>
                      <p>Avg Lead Score</p>
                    </div>
                  </div>
                </div>
                
                <div className="status-breakdown">
                  <h3>Lead Status Breakdown</h3>
                  <div className="status-bars">
                    <div className="status-bar">
                      <span>New</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${(leadStats.new / leadStats.total) * 100}%`, backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <span>{leadStats.new}</span>
                    </div>
                    <div className="status-bar">
                      <span>Contacted</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${(leadStats.contacted / leadStats.total) * 100}%`, backgroundColor: '#f59e0b' }}></div>
                      </div>
                      <span>{leadStats.contacted}</span>
                    </div>
                    <div className="status-bar">
                      <span>Qualified</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${(leadStats.qualified / leadStats.total) * 100}%`, backgroundColor: '#10b981' }}></div>
                      </div>
                      <span>{leadStats.qualified}</span>
                    </div>
                    <div className="status-bar">
                      <span>Converted</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${(leadStats.converted / leadStats.total) * 100}%`, backgroundColor: '#059669' }}></div>
                      </div>
                      <span>{leadStats.converted}</span>
                    </div>
                    <div className="status-bar">
                      <span>Lost</span>
                      <div className="bar-container">
                        <div className="bar" style={{ width: `${(leadStats.lost / leadStats.total) * 100}%`, backgroundColor: '#ef4444' }}></div>
                      </div>
                      <span>{leadStats.lost}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="lead-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search leads by name, email, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-controls">
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status ({leads.length})</option>
                  <option value="new">New ({leads.filter(l => l.status === 'new').length})</option>
                  <option value="contacted">Contacted ({leads.filter(l => l.status === 'contacted').length})</option>
                  <option value="qualified">Qualified ({leads.filter(l => l.status === 'qualified').length})</option>
                  <option value="converted">Converted ({leads.filter(l => l.status === 'converted').length})</option>
                  <option value="lost">Lost ({leads.filter(l => l.status === 'lost').length})</option>
                </select>

                <select 
                  value={vendorFilter} 
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Vendors</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} ({leads.filter(l => l.selected_vendor_id === vendor.id).length})
                    </option>
                  ))}
                  <option value="unassigned">Unassigned ({leads.filter(l => !l.selected_vendor_id).length})</option>
                </select>

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="created_at">Sort by Date</option>
                  <option value="lead_score">Sort by Lead Score</option>
                  <option value="quote_amount">Sort by Quote Amount</option>
                  <option value="first_name">Sort by Name</option>
                </select>

                <button 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="sort-btn"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  📋 List
                </button>
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  🗂️ Grid
                </button>
                <button 
                  className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                >
                  📊 Kanban
                </button>
              </div>
            </div>

            {/* Lead Layout */}
            <div className="lead-layout">
              {/* Lead List */}
              <div className="lead-list">
                <div className="list-header">
                  <h2>Leads ({filteredLeads.length})</h2>
                  <div className="list-summary">
                    <span>Showing {filteredLeads.length} of {leads.length} leads</span>
                  </div>
                </div>
                
                {filteredLeads.length === 0 ? (
                  <div className="no-leads">
                    <p>No leads found matching your criteria.</p>
                    <button onClick={() => {
                      setFilter('all');
                      setVendorFilter('all');
                      setSearchTerm('');
                    }}>Clear Filters</button>
                  </div>
                ) : (
                  <div className={`leads-container ${viewMode}`}>
                    {filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className={`lead-card ${selectedLead && selectedLead.id === lead.id ? 'selected' : ''}`}
                        onClick={() => handleLeadClick(lead)}
                      >
                        <div className="lead-header">
                          <div className="lead-name">
                            <h3>{lead.first_name && lead.last_name ? `${lead.first_name} ${lead.last_name}` : 'Unknown Name'}</h3>
                            <span className="lead-id">#{lead.id}</span>
                          </div>
                          <div className="lead-badges">
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(lead.status) }}
                            >
                              {lead.status}
                            </span>
                            <span 
                              className="score-badge"
                              style={{ backgroundColor: getLeadScoreColor(lead.lead_score || 0) }}
                            >
                              {lead.lead_score || 0}
                            </span>
                          </div>
                        </div>
                        
                        <div className="lead-info">
                          <p className="lead-email">{lead.email || 'No email'}</p>
                          <p className="lead-phone">{lead.phone || 'No phone'}</p>
                          <p className="lead-route">
                            {lead.origin_address && lead.destination_address ? 
                              `${lead.origin_address.split(',')[0]} → ${lead.destination_address.split(',')[0]}` : 
                              'Route not specified'
                            }
                          </p>
                          <p className="lead-date">
                            {lead.move_date ? `Move: ${lead.move_date}` : 'No move date'}
                          </p>
                          {lead.quote_amount && (
                            <p className="lead-quote">
                              💰 {formatCurrency(lead.quote_amount)}
                            </p>
                          )}
                        </div>
                        
                        <div className="lead-meta">
                          <div className="meta-left">
                            <small>Created: {formatDate(lead.created_at)}</small>
                            <small>Source: {lead.source || 'website'}</small>
                          </div>
                          <div className="meta-right">
                            {lead.vendor_name && (
                              <span 
                                className="vendor-badge"
                                style={{ 
                                  backgroundColor: getVendorColor(lead.vendor_name),
                                  color: 'white'
                                }}
                              >
                                {lead.vendor_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lead Details */}
              {selectedLead && (
                <div className="lead-details">
                  <div className="details-header">
                    <h2>Lead Details</h2>
                    <button 
                      onClick={() => setSelectedLead(null)}
                      className="close-btn"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="details-content">
                    <div className="detail-section">
                      <h3>Contact Information</h3>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Name:</label>
                          <span>{selectedLead.first_name && selectedLead.last_name ? `${selectedLead.first_name} ${selectedLead.last_name}` : 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Email:</label>
                          <span>{selectedLead.email || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Phone:</label>
                          <span>{selectedLead.phone || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Lead Score:</label>
                          <span style={{ color: getLeadScoreColor(selectedLead.lead_score || 0) }}>
                            {selectedLead.lead_score || 0}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Move Details</h3>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Origin:</label>
                          <span>{selectedLead.origin_address || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Destination:</label>
                          <span>{selectedLead.destination_address || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Move Date:</label>
                          <span>{selectedLead.move_date || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Move Time:</label>
                          <span>{selectedLead.move_time || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Total Rooms:</label>
                          <span>{selectedLead.total_rooms || 'Not specified'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Square Footage:</label>
                          <span>{selectedLead.square_footage ? `${selectedLead.square_footage} sq ft` : 'Not specified'}</span>
                        </div>
                        {selectedLead.quote_amount && (
                          <div className="detail-item">
                            <label>Quote Amount:</label>
                            <span className="quote-amount">{formatCurrency(selectedLead.quote_amount)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Additional Information</h3>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <label>Estimated Weight:</label>
                          <span>{selectedLead.estimated_weight ? `${selectedLead.estimated_weight} lbs` : 'Not specified'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Stairs at Pickup:</label>
                          <span>{selectedLead.stairs_at_pickup || 0}</span>
                        </div>
                        <div className="detail-item">
                          <label>Stairs at Dropoff:</label>
                          <span>{selectedLead.stairs_at_dropoff || 0}</span>
                        </div>
                        <div className="detail-item">
                          <label>Elevator at Pickup:</label>
                          <span>{selectedLead.elevator_at_pickup ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Elevator at Dropoff:</label>
                          <span>{selectedLead.elevator_at_dropoff ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Lead Management</h3>
                      <div className="management-controls">
                        <div className="control-group">
                          <label>Update Status:</label>
                          <select 
                            value={selectedLead.status}
                            onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                        
                        <div className="control-group">
                          <label>Assign Vendor:</label>
                          <select 
                            value={selectedLead.selected_vendor_id || ''}
                            onChange={(e) => handleVendorAssignment(selectedLead.id, e.target.value)}
                            className="vendor-select"
                          >
                            <option value="">Unassigned</option>
                            {vendors.map(vendor => (
                              <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="lead-actions">
                        <button className="action-btn primary">📧 Send Email</button>
                        <button className="action-btn secondary">📞 Call Lead</button>
                        <button className="action-btn info">📝 Add Notes</button>
                        <button className="action-btn warning">⚠️ Mark as Lost</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadManagement; 