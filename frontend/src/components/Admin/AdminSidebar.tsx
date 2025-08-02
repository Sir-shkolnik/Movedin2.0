import React from 'react';
import './AdminSidebar.css';

type AdminSection = 'dashboard' | 'vendors' | 'leads' | 'system' | 'analytics' | 'vendor-locations' | 'database';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview and quick actions'
    },
    {
      id: 'vendors' as AdminSection,
      label: 'Vendor Management',
      icon: '🚚',
      description: 'Manage vendors and pricing'
    },
    {
      id: 'vendor-locations' as AdminSection,
      label: 'Vendor Locations',
      icon: '🏢',
      description: 'All locations and contact details'
    },
    {
      id: 'leads' as AdminSection,
      label: 'Lead Management',
      icon: '👥',
      description: 'View and manage leads'
    },
    {
      id: 'system' as AdminSection,
      label: 'System Monitoring',
      icon: '⚙️',
      description: 'System health and status'
    },
    {
      id: 'analytics' as AdminSection,
      label: 'Analytics',
      icon: '📈',
      description: 'Reports and insights'
    },
    {
      id: 'database' as AdminSection,
      label: 'Database Management',
      icon: '🗄️',
      description: 'Database health and schemas'
    }
  ];

  return (
    <div className="admin-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <img src="/icons/movedin-logo.png" alt="MovedIn Logo" height={32} />
          </div>
          <div className="logo-text">
            <span className="logo-main">MOVED</span>
            <span className="logo-accent">IN.</span>
          </div>
        </div>
        <div className="admin-label">
          <span className="admin-badge">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Administration</h3>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
              {activeSection === item.id && <div className="nav-indicator" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="user-details">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
        <button className="logout-btn">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 