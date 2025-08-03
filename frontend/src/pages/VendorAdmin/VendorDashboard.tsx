import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorDashboard.css';
import VendorSidebar from '../../components/VendorAdmin/VendorSidebar';
import VendorProfile from './VendorProfile';
import VendorLeads from './VendorLeads';
import VendorAnalytics from './VendorAnalytics';
import VendorLocations from './VendorLocations';
import VendorPricing from './VendorPricing';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

type VendorSection = 'dashboard' | 'profile' | 'leads' | 'analytics' | 'locations' | 'pricing';

interface VendorInfo {
  vendor_id: string;
  vendor_name: string;
  permissions: string[];
}

interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  leadsThisWeek: number;
  conversionRate: number;
  averageQuote: number;
  totalRevenue: number;
  revenueThisMonth: number;
  topLocations: Array<{
    location: string;
    leads: number;
  }>;
  recentActivity: Array<{
    time: string;
    action: string;
    details: string;
  }>;
}

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<VendorSection>('dashboard');
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    leadsThisMonth: 0,
    leadsThisWeek: 0,
    conversionRate: 0,
    averageQuote: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    topLocations: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadDashboardStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('vendorToken');
    const vendorInfoStr = localStorage.getItem('vendorInfo');
    
    if (!token || !vendorInfoStr) {
      navigate('/vendor/login');
      return;
    }

    try {
      const info = JSON.parse(vendorInfoStr);
      setVendorInfo(info);
    } catch (err) {
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorInfo');
      navigate('/vendor/login');
    }
  };

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('vendorToken');
      if (!token) return;

      const response = await fetch('https://movedin-backend.onrender.com/vendor/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to load dashboard stats');
      }
    } catch (err) {
      setError('Network error loading dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorInfo');
    navigate('/vendor/login');
  };

  const renderDashboard = () => (
    <div className="vendor-dashboard-content">
      <div className="dashboard-header">
        <h1>Welcome back, {vendorInfo?.vendor_name}!</h1>
        <p>Here's what's happening with your business today</p>
      </div>

      {error && (
        <div className="dashboard-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Leads</h3>
            <p className="stat-number">{stats.totalLeads}</p>
            <p className="stat-change">+{stats.leadsThisMonth} this month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toLocaleString()}</p>
            <p className="stat-change">+${stats.revenueThisMonth.toLocaleString()} this month</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Conversion Rate</h3>
            <p className="stat-number">{(stats.conversionRate * 100).toFixed(1)}%</p>
            <p className="stat-change">Industry average: 12%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Average Quote</h3>
            <p className="stat-number">${stats.averageQuote.toLocaleString()}</p>
            <p className="stat-change">Per lead</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Top Locations</h3>
          <div className="locations-list">
            {stats.topLocations.map((location, index) => (
              <div key={index} className="location-item">
                <span className="location-name">{location.location}</span>
                <span className="location-leads">{location.leads} leads</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">{activity.time}</div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-details">{activity.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button 
            className="action-button"
            onClick={() => setActiveSection('leads')}
          >
            📋 View All Leads
          </button>
          <button 
            className="action-button"
            onClick={() => setActiveSection('analytics')}
          >
            📊 Detailed Analytics
          </button>
          <button 
            className="action-button"
            onClick={() => setActiveSection('locations')}
          >
            📍 Manage Locations
          </button>
          <button 
            className="action-button"
            onClick={() => setActiveSection('pricing')}
          >
            💰 Update Pricing
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return <VendorProfile />;
      case 'leads':
        return <VendorLeads />;
      case 'analytics':
        return <VendorAnalytics />;
      case 'locations':
        return <VendorLocations />;
      case 'pricing':
        return <VendorPricing />;
      default:
        return renderDashboard();
    }
  };

  if (!vendorInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vendor-dashboard-page">
      <Header />
      
      <div className="vendor-dashboard-container">
        <VendorSidebar 
          activeSection={activeSection}
          setActiveSection={(section: string) => setActiveSection(section as VendorSection)}
          vendorInfo={vendorInfo}
          onLogout={handleLogout}
        />
        
        <main className="vendor-dashboard-main">
          {loading && activeSection === 'dashboard' ? (
            <div className="loading-container">
              <div className="loading-spinner">🔄</div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      <Footer onContinue={() => {}} />
    </div>
  );
};

export default VendorDashboard; 