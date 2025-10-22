import React, { useState, useEffect } from "react";
import "./style.css";

function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchLeads();
  }, []);

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

    const sorted = [...leads].sort((a, b) => {
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

    setLeads(sorted);
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
            <div className="stat-value">{leads.length}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {leads.filter(l => l.payment_status === 'payment_completed' || l.payment_status === 'test_payment_completed').length}
            </div>
            <div className="stat-label">Paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {formatPrice(leads.reduce((sum, l) => sum + (l.total_cost || 0), 0))}
            </div>
            <div className="stat-label">Total Value</div>
          </div>
          <button onClick={fetchLeads} className="refresh-button">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
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
            {leads.length === 0 ? (
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
              leads.map((lead) => (
                <tr key={lead.id} className="lead-row">
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

