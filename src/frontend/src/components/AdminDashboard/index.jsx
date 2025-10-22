import React, { useState, useEffect } from "react";
import "./style.css";

function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Advanced filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Analytics
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    paidLeads: 0,
    totalValue: 0,
    avgValue: 0,
    conversionRate: 0,
    topVendor: '',
    recentActivity: 0
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, statusFilter, vendorFilter, dateRange]);

  const applyFilters = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.payment_status === statusFilter);
    }

    // Vendor filter
    if (vendorFilter !== 'all') {
      filtered = filtered.filter(lead => lead.vendor_name === vendorFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const daysAgo = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 0;
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(lead => new Date(lead.created_at) >= cutoffDate);
    }

    setFilteredLeads(filtered);
    calculateAnalytics(filtered);
  };

  const calculateAnalytics = (leadsData) => {
    const total = leadsData.length;
    const paid = leadsData.filter(l => l.payment_status === 'payment_completed' || l.payment_status === 'test_payment_completed').length;
    const totalValue = leadsData.reduce((sum, l) => sum + (l.total_cost || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;
    const conversionRate = total > 0 ? (paid / total) * 100 : 0;
    
    // Find top vendor
    const vendorCounts = {};
    leadsData.forEach(lead => {
      vendorCounts[lead.vendor_name] = (vendorCounts[lead.vendor_name] || 0) + 1;
    });
    const topVendor = Object.keys(vendorCounts).reduce((a, b) => vendorCounts[a] > vendorCounts[b] ? a : b, '');
    
    // Recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = leadsData.filter(l => new Date(l.created_at) >= yesterday).length;

    setAnalytics({
      totalLeads: total,
      paidLeads: paid,
      totalValue,
      avgValue,
      conversionRate,
      topVendor,
      recentActivity: recent
    });
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/leads?limit=1000`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();
      setLeads(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': '#FFA500',
      'test_payment_completed': '#10B981',
      'payment_completed': '#10B981',
      'confirmed': '#10B981',
      'cancelled': '#EF4444'
    };
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: `${statusColors[status] || '#6B7280'}20`,
        color: statusColors[status] || '#6B7280'
      }}>
        {status || 'pending'}
      </span>
    );
  };

  const sortLeads = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredLeads].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'created_at' || field === 'move_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredLeads(sorted);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'From', 'To', 'Move Date', 'Move Time', 'Vendor', 'Cost', 'Status', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.id,
        `"${lead.customer_name}"`,
        `"${lead.customer_email}"`,
        `"${lead.customer_phone}"`,
        `"${lead.move_from}"`,
        `"${lead.move_to}"`,
        lead.move_date,
        lead.move_time,
        `"${lead.vendor_name}"`,
        lead.total_cost,
        lead.payment_status,
        lead.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movedin-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setVendorFilter('all');
    setDateRange('all');
  };

  const getUniqueVendors = () => {
    return [...new Set(leads.map(lead => lead.vendor_name))];
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-state">
          <h2>⚠️ Error Loading Leads</h2>
          <p>{error}</p>
          <button onClick={fetchLeads} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <h1>📊 Admin Dashboard</h1>
          <p className="subtitle">All leads and quotes from MovedIn</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{analytics.totalLeads}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics.paidLeads}</div>
            <div className="stat-label">Paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatPrice(analytics.totalValue)}</div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics.conversionRate.toFixed(1)}%</div>
            <div className="stat-label">Conversion</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{analytics.recentActivity}</div>
            <div className="stat-label">Today</div>
          </div>
          <button onClick={fetchLeads} className="refresh-button">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-icon">💰</div>
            <div className="analytics-content">
              <div className="analytics-value">{formatPrice(analytics.avgValue)}</div>
              <div className="analytics-label">Average Quote</div>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">🏆</div>
            <div className="analytics-content">
              <div className="analytics-value">{analytics.topVendor}</div>
              <div className="analytics-label">Top Vendor</div>
            </div>
          </div>
          <div className="analytics-card">
            <div className="analytics-icon">📈</div>
            <div className="analytics-content">
              <div className="analytics-value">{analytics.conversionRate.toFixed(1)}%</div>
              <div className="analytics-label">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters and Search */}
      <div className="filters-section">
        <div className="filters-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search leads by name, email, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
            >
              🔧 Filters
            </button>
            <button onClick={exportToCSV} className="export-button">
              📊 Export CSV
            </button>
            <button onClick={clearFilters} className="clear-button">
              🧹 Clear
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="payment_completed">Paid</option>
                <option value="test_payment_completed">Test Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Vendor:</label>
              <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
                <option value="all">All Vendors</option>
                {getUniqueVendors().map(vendor => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Date Range:</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-info">
            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
          </div>
          <div className="bulk-buttons">
            <button className="bulk-button">📧 Send Email</button>
            <button className="bulk-button">📊 Export Selected</button>
            <button className="bulk-button">🏷️ Update Status</button>
            <button onClick={() => setSelectedLeads([])} className="bulk-button cancel">
              ✕ Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => sortLeads('id')} className="sortable">
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortLeads('customer_name')} className="sortable">
                Customer {sortField === 'customer_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>From → To</th>
              <th onClick={() => sortLeads('move_date')} className="sortable">
                Move Date {sortField === 'move_date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Vendor</th>
              <th onClick={() => sortLeads('total_cost')} className="sortable">
                Cost {sortField === 'total_cost' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th onClick={() => sortLeads('created_at')} className="sortable">
                Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-state">
                  <div className="empty-content">
                    <span className="empty-icon">📭</span>
                    <p>No leads yet</p>
                    <small>Leads will appear here as customers submit quotes</small>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className={`lead-row ${selectedLeads.includes(lead.id) ? 'selected' : ''}`}>
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                    />
                  </td>
                  <td className="lead-id">#{lead.id}</td>
                  <td className="lead-name">{lead.customer_name}</td>
                  <td className="lead-email">{lead.customer_email}</td>
                  <td className="lead-phone">{lead.customer_phone}</td>
                  <td className="lead-route">
                    <div className="route-info">
                      <div className="route-from">📍 {lead.move_from}</div>
                      <div className="route-arrow">→</div>
                      <div className="route-to">📍 {lead.move_to}</div>
                    </div>
                  </td>
                  <td className="lead-date">
                    <div className="date-info">
                      <div className="date-day">📅 {lead.move_date}</div>
                      <div className="date-time">🕐 {lead.move_time}</div>
                    </div>
                  </td>
                  <td className="lead-vendor">{lead.vendor_name}</td>
                  <td className="lead-cost">{formatPrice(lead.total_cost)}</td>
                  <td className="lead-status">{getStatusBadge(lead.payment_status)}</td>
                  <td className="lead-created">{formatDate(lead.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;



