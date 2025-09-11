import React, { useState, useEffect, useMemo } from 'react';
import './ComprehensiveTracking.css';

interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  origin_address: string;
  destination_address: string;
  move_date: string;
  move_time: string;
  status: string;
  payment_status?: string;
  payment_amount?: number;
  payment_currency?: string;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
  total_rooms?: number;
  square_footage?: number;
  estimated_weight?: number;
}

interface Payment {
  id: number;
  lead_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_intent_id: string;
  created_at: string;
  vendor_name?: string;
}

interface EmailLog {
  id: number;
  lead_id: number;
  email_type: string;
  recipient: string;
  subject: string;
  status: string;
  sent_at: string;
  error_message?: string;
}

interface Vendor {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  status: string;
  coverage_areas: string[];
}

interface TrackingStats {
  totalLeads: number;
  totalPayments: number;
  totalEmails: number;
  totalVendors: number;
  conversionRate: number;
  totalRevenue: number;
  avgLeadValue: number;
  emailDeliveryRate: number;
}

const ComprehensiveTracking: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'payments' | 'emails' | 'vendors'>('overview');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [leadsRes, paymentsRes, emailLogsRes, vendorsRes] = await Promise.all([
        fetch('https://movedin-backend.onrender.com/api/leads'),
        fetch('https://movedin-backend.onrender.com/api/payments'),
        fetch('https://movedin-backend.onrender.com/api/email-logs'),
        fetch('https://movedin-backend.onrender.com/api/vendors')
      ]);

      if (!leadsRes.ok) throw new Error('Failed to load leads');
      if (!paymentsRes.ok) throw new Error('Failed to load payments');
      if (!emailLogsRes.ok) throw new Error('Failed to load email logs');
      if (!vendorsRes.ok) throw new Error('Failed to load vendors');

      const [leadsData, paymentsData, emailLogsData, vendorsData] = await Promise.all([
        leadsRes.json(),
        paymentsRes.json(),
        emailLogsRes.json(),
        vendorsRes.json()
      ]);

      setLeads(leadsData);
      setPayments(paymentsData);
      setEmailLogs(emailLogsData);
      setVendors(vendorsData);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo((): TrackingStats => {
    const totalLeads = leads.length;
    const totalPayments = payments.length;
    const totalEmails = emailLogs.length;
    const totalVendors = vendors.length;
    
    const conversionRate = totalLeads > 0 ? (payments.length / totalLeads) * 100 : 0;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const avgLeadValue = totalLeads > 0 ? totalRevenue / totalLeads : 0;
    const emailDeliveryRate = totalEmails > 0 ? (emailLogs.filter(e => e.status === 'sent').length / totalEmails) * 100 : 0;

    return {
      totalLeads,
      totalPayments,
      totalEmails,
      totalVendors,
      conversionRate,
      totalRevenue,
      avgLeadValue,
      emailDeliveryRate
    };
  }, [leads, payments, emailLogs, vendors]);

  const filteredData = useMemo(() => {
    let data: any[] = [];
    
    switch (activeTab) {
      case 'leads':
        data = leads;
        break;
      case 'payments':
        data = payments;
        break;
      case 'emails':
        data = emailLogs;
        break;
      case 'vendors':
        data = vendors;
        break;
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(item => {
        const searchableFields = Object.values(item).join(' ').toLowerCase();
        return searchableFields.includes(searchTerm.toLowerCase());
      });
    }

    // Apply status filter
    if (filter !== 'all') {
      data = data.filter(item => {
        if (activeTab === 'leads') return item.status === filter;
        if (activeTab === 'payments') return item.status === filter;
        if (activeTab === 'emails') return item.status === filter;
        if (activeTab === 'vendors') return item.status === filter;
        return true;
      });
    }

    // Apply sorting
    data.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return data;
  }, [leads, payments, emailLogs, vendors, activeTab, filter, searchTerm, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#3b82f6';
      case 'contacted': return '#f59e0b';
      case 'qualified': return '#10b981';
      case 'converted': return '#059669';
      case 'lost': return '#ef4444';
      case 'pending_payment': return '#f59e0b';
      case 'payment_completed': return '#10b981';
      case 'succeeded': return '#10b981';
        case 'failed': return '#ef4444';
        case 'sent': return '#10b981';
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="comprehensive-tracking">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading comprehensive tracking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comprehensive-tracking">
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={loadAllData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="comprehensive-tracking">
      <div className="tracking-header">
        <h1>📊 Comprehensive Tracking Dashboard</h1>
        <p>Complete overview of leads, jobs, payments, and email communications</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalLeads}</h3>
            <p>Total Leads</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <h3>{stats.totalPayments}</h3>
            <p>Total Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{stats.totalEmails}</h3>
            <p>Emails Sent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{stats.totalVendors}</h3>
            <p>Active Vendors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.conversionRate.toFixed(1)}%</h3>
            <p>Conversion Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tracking-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          👥 Leads ({leads.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          💳 Payments ({payments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'emails' ? 'active' : ''}`}
          onClick={() => setActiveTab('emails')}
        >
          📧 Emails ({emailLogs.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendors')}
        >
          🚚 Vendors ({vendors.length})
        </button>
      </div>

      {/* Filters */}
      <div className="tracking-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            {activeTab === 'leads' && (
              <>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="payment_completed">Payment Completed</option>
              </>
            )}
            {activeTab === 'payments' && (
              <>
                <option value="succeeded">Succeeded</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </>
            )}
            {activeTab === 'emails' && (
              <>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </>
            )}
            {activeTab === 'vendors' && (
              <>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </>
            )}
          </select>
        </div>
        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="created_at">Sort by Date</option>
            <option value="id">Sort by ID</option>
            {activeTab === 'leads' && (
              <>
                <option value="first_name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="status">Sort by Status</option>
              </>
            )}
            {activeTab === 'payments' && (
              <>
                <option value="amount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
              </>
            )}
            {activeTab === 'emails' && (
              <>
                <option value="recipient">Sort by Recipient</option>
                <option value="email_type">Sort by Type</option>
              </>
            )}
            {activeTab === 'vendors' && (
              <>
                <option value="name">Sort by Name</option>
                <option value="status">Sort by Status</option>
              </>
            )}
          </select>
        </div>
        <div className="filter-group">
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="overview-dashboard">
          <div className="overview-grid">
            <div className="overview-card">
              <h3>📈 Recent Activity</h3>
              <div className="activity-list">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="activity-item">
                    <div className="activity-icon">👤</div>
                    <div className="activity-content">
                      <div className="activity-title">{lead.first_name} {lead.last_name}</div>
                      <div className="activity-details">
                        {lead.origin_address} → {lead.destination_address}
                      </div>
                      <div className="activity-time">{formatDate(lead.created_at)}</div>
                    </div>
                    <div className="activity-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(lead.status) }}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="overview-card">
              <h3>💰 Payment Summary</h3>
              <div className="payment-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Revenue:</span>
                  <span className="summary-value">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Conversion Rate:</span>
                  <span className="summary-value">{stats.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Avg Lead Value:</span>
                  <span className="summary-value">{formatCurrency(stats.avgLeadValue)}</span>
                </div>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>📧 Email Status</h3>
              <div className="email-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Emails:</span>
                  <span className="summary-value">{stats.totalEmails}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Delivery Rate:</span>
                  <span className="summary-value">{stats.emailDeliveryRate.toFixed(1)}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pending:</span>
                  <span className="summary-value">{emailLogs.filter(e => e.status === 'pending').length}</span>
                </div>
              </div>
            </div>
            
            <div className="overview-card">
              <h3>🚚 Vendor Status</h3>
              <div className="vendor-summary">
                <div className="summary-item">
                  <span className="summary-label">Active Vendors:</span>
                  <span className="summary-value">{stats.activeVendors}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Vendors:</span>
                  <span className="summary-value">{stats.totalVendors}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Coverage:</span>
                  <span className="summary-value">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      {activeTab !== 'overview' && (
        <>
          <div className="tracking-table-container">
            <table className="tracking-table">
              <thead>
                <tr>
                  {activeTab === 'leads' && (
                    <>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Move Date</th>
                      <th>Status</th>
                      <th>Payment Status</th>
                      <th>Created</th>
                    </>
                  )}
                  {activeTab === 'payments' && (
                    <>
                      <th>ID</th>
                      <th>Lead ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment ID</th>
                      <th>Created</th>
                    </>
                  )}
                  {activeTab === 'emails' && (
                    <>
                      <th>ID</th>
                      <th>Lead ID</th>
                      <th>Type</th>
                      <th>Recipient</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Sent At</th>
                    </>
                  )}
                  {activeTab === 'vendors' && (
                    <>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Coverage Areas</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id || index}>
                    {activeTab === 'leads' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.first_name} {item.last_name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.move_date}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(item.payment_status || 'pending') }}
                          >
                            {item.payment_status || 'pending'}
                          </span>
                        </td>
                        <td>{formatDate(item.created_at)}</td>
                      </>
                    )}
                    {activeTab === 'payments' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.lead_id}</td>
                        <td>{formatCurrency(item.amount)}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>{item.payment_intent_id}</td>
                        <td>{formatDate(item.created_at)}</td>
                      </>
                    )}
                    {activeTab === 'emails' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.lead_id}</td>
                        <td>{item.email_type}</td>
                        <td>{item.recipient}</td>
                        <td>{item.subject}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>{formatDate(item.sent_at)}</td>
                      </>
                    )}
                    {activeTab === 'vendors' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>{item.coverage_areas?.join(', ') || 'N/A'}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="tracking-summary">
            <p>Showing {filteredData.length} {activeTab}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ComprehensiveTracking;
