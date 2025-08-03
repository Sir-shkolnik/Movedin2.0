import React, { useState, useEffect } from 'react';
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
}

const LeadManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://movedin-backend.onrender.com/api/leads/');
      if (!response.ok) {
        throw new Error('Failed to load leads');
      }
      
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      // This would be a PUT request to update lead status
      // For now, we'll just update the local state
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

  const exportLeads = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Phone', 'Origin', 'Destination', 'Move Date', 'Status', 'Created At'],
      ...leads.map(lead => [
        lead.id.toString(),
        `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        lead.email || '',
        lead.phone || '',
        lead.origin_address || '',
        lead.destination_address || '',
        lead.move_date || '',
        lead.status,
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

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'all' || lead.status === filter;
    const matchesSearch = searchTerm === '' || 
      `${lead.first_name || ''} ${lead.last_name || ''} ${lead.email || ''} ${lead.phone || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <div className="lead-header">
              <div className="header-content">
                <h1>Lead Management</h1>
                <p className="header-subtitle">View and manage customer leads</p>
              </div>
              <div className="header-actions">
                <button className="refresh-btn" onClick={loadLeads}>
                  🔄 Refresh
                </button>
                <button className="export-btn" onClick={exportLeads}>
                  📊 Export CSV
                </button>
              </div>
            </div>

            <div className="lead-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search leads..."
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
                  <option value="all">All Leads ({leads.length})</option>
                  <option value="new">New ({leads.filter(l => l.status === 'new').length})</option>
                  <option value="contacted">Contacted ({leads.filter(l => l.status === 'contacted').length})</option>
                  <option value="qualified">Qualified ({leads.filter(l => l.status === 'qualified').length})</option>
                  <option value="converted">Converted ({leads.filter(l => l.status === 'converted').length})</option>
                  <option value="lost">Lost ({leads.filter(l => l.status === 'lost').length})</option>
                </select>
              </div>
            </div>

            <div className="lead-layout">
              {/* Lead List */}
              <div className="lead-list">
                <h2>Leads ({filteredLeads.length})</h2>
                {filteredLeads.length === 0 ? (
                  <div className="no-leads">
                    <p>No leads found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="leads-grid">
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
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(lead.status) }}
                          >
                            {lead.status}
                          </span>
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
                        </div>
                        
                        <div className="lead-meta">
                          <small>Created: {formatDate(lead.created_at)}</small>
                          <small>Source: {lead.source || 'website'}</small>
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
                      <div className="status-controls">
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
                      
                      <div className="lead-actions">
                        <button className="action-btn primary">📧 Send Email</button>
                        <button className="action-btn secondary">📞 Call Lead</button>
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