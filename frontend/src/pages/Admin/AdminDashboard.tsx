import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import VendorManagement from './VendorManagement';
import LeadManagement from './LeadManagement';
import SystemMonitoring from './SystemMonitoring';
import Analytics from './Analytics';
import VendorLocations from './VendorLocations';
import DatabaseManagement from './DatabaseManagement';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

type AdminSection = 'dashboard' | 'vendors' | 'leads' | 'system' | 'analytics' | 'vendor-locations' | 'database';

interface DashboardStats {
  totalLeads: number;
  activeVendors: number;
  todayQuotes: number;
  totalRevenue: number;
  systemHealth: string;
  recentActivity: Array<{
    time: string;
    text: string;
    type: 'lead' | 'payment' | 'vendor' | 'system';
  }>;
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeVendors: 0,
    todayQuotes: 0,
    totalRevenue: 0,
    systemHealth: 'loading',
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load leads count
      const leadsResponse = await fetch('https://movedin-backend.onrender.com/api/leads/');
      const leads = await leadsResponse.json();
      
      // Load system health
      const healthResponse = await fetch('https://movedin-backend.onrender.com/health');
      let systemHealth = 'loading';
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        systemHealth = healthData.status === 'healthy' ? 'healthy' : 'warning';
      }

      // Load vendor status
      const vendorResponse = await fetch('https://movedin-backend.onrender.com/admin/vendors/live-status');
      let activeVendors = 0;
      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json();
        activeVendors = Object.keys(vendorData.vendors || {}).length;
      }

      // Load vendor locations for total count
      const locationsResponse = await fetch('https://movedin-backend.onrender.com/admin/vendors/locations');
      let totalLocations = 0;
      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json();
        totalLocations = locationsData.reduce((total: number, vendor: any) => total + vendor.locations.length, 0);
      }

      // Generate recent activity based on real data
      const recentActivity = [];
      
      // Add lead activity if we have leads
      if (leads.length > 0) {
        const latestLead = leads[leads.length - 1];
        recentActivity.push({
          time: '1 hour ago',
          text: `New lead #${latestLead.id} created`,
          type: 'lead' as const
        });
      }

      // Add system activity
      recentActivity.push({
        time: '2 hours ago',
        text: `System health check: ${systemHealth}`,
        type: 'system' as const
      });

      // Add vendor activity
      recentActivity.push({
        time: '4 hours ago',
        text: `${activeVendors} active vendors monitored`,
        type: 'vendor' as const
      });

      // Add location activity
      if (totalLocations > 0) {
        recentActivity.push({
          time: '6 hours ago',
          text: `${totalLocations} total locations available`,
          type: 'vendor' as const
        });
      }

      setStats({
        totalLeads: leads.length,
        activeVendors: activeVendors,
        todayQuotes: 0, // No backend endpoint for this yet
        totalRevenue: 0, // No backend endpoint for this yet
        systemHealth: systemHealth,
        recentActivity: recentActivity
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return '👥';
      case 'payment': return '💰';
      case 'vendor': return '🚚';
      case 'system': return '⚙️';
      default: return '📝';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard-main">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>MovedIn 2.0 Admin Dashboard</h1>
          <p className="header-subtitle">System Overview & Quick Actions</p>
        </div>
        <button 
          onClick={loadDashboardStats} 
          className="refresh-btn"
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={loadDashboardStats}>Retry</button>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="stats-section">
        <h2 className="section-title">Key Metrics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalLeads}</h3>
              <p>Total Leads</p>
              <small>From website</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🚚</div>
            <div className="stat-content">
              <h3>{stats.activeVendors}</h3>
              <p>Active Vendors</p>
              <small>Available for quotes</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.todayQuotes}</h3>
              <p>Today's Quotes</p>
              <small>Generated today</small>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>${stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
              <small>Estimated value</small>
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Quick Actions Row */}
      <div className="dashboard-row">
        {/* System Health */}
        <div className="system-health">
          <h2 className="section-title">System Health</h2>
          <div className="health-indicator">
            <div 
              className="health-dot" 
              style={{ backgroundColor: getHealthColor(stats.systemHealth) }}
            ></div>
            <span className="health-text">
              {stats.systemHealth === 'healthy' ? 'All systems operational' : 
               stats.systemHealth === 'warning' ? 'Minor issues detected' : 
               stats.systemHealth === 'error' ? 'System errors detected' : 
               'Loading system status...'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => setActiveSection('leads')} className="action-btn">
              👥 View All Leads
            </button>
            <button onClick={() => setActiveSection('vendors')} className="action-btn">
              🚚 Manage Vendors
            </button>
            <button onClick={() => setActiveSection('system')} className="action-btn">
              ⚙️ System Status
            </button>
            <button onClick={() => setActiveSection('analytics')} className="action-btn">
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="activity-icon">{getActivityIcon(activity.type)}</span>
              <div className="activity-content">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-text">{activity.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'vendors':
        return <VendorManagement />;
      case 'leads':
        return <LeadManagement />;
      case 'system':
        return <SystemMonitoring />;
      case 'analytics':
        return <Analytics />;
      case 'vendor-locations':
        return <VendorLocations />;
      case 'database':
        return <DatabaseManagement />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <div className="admin-container">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
      <Footer onContinue={() => {}} />
    </div>
  );
};

export default AdminDashboard; 