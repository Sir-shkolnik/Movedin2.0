import React from 'react';
import './VendorSidebar.css';

interface VendorInfo {
  vendor_id: string;
  vendor_name: string;
  permissions: string[];
}

interface VendorSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  vendorInfo: VendorInfo;
  onLogout: () => void;
}

const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activeSection,
  setActiveSection,
  vendorInfo,
  onLogout
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      permission: null
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: '📋',
      permission: 'view_leads'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      permission: 'view_analytics'
    },
    {
      id: 'locations',
      label: 'Locations',
      icon: '📍',
      permission: 'manage_locations'
    },
    {
      id: 'pricing',
      label: 'Pricing',
      icon: '💰',
      permission: 'manage_pricing'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      permission: 'manage_profile'
    }
  ];

  const hasPermission = (permission: string | null) => {
    if (!permission) return true;
    return vendorInfo.permissions.includes(permission);
  };

  return (
    <aside className="vendor-sidebar">
      <div className="vendor-sidebar-header">
        <div className="vendor-logo">
          <img src="/src/assets/icons/movedin-logo.png" alt="MovedIn Logo" />
        </div>
        <div className="vendor-info">
          <h3>{vendorInfo.vendor_name}</h3>
          <p>Vendor Portal</p>
        </div>
      </div>

      <nav className="vendor-sidebar-nav">
        <ul className="vendor-nav-list">
          {menuItems.map((item) => {
            if (!hasPermission(item.permission)) return null;
            
            return (
              <li key={item.id}>
                <button
                  className={`vendor-nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="vendor-sidebar-footer">
        <div className="vendor-status">
          <div className="status-indicator online"></div>
          <span>Online</span>
        </div>
        
        <button className="vendor-logout-button" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar; 