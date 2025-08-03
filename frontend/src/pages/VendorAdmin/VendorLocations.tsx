import React from 'react';

const VendorLocations: React.FC = () => {
  return (
    <div className="vendor-locations-page">
      <div className="locations-header">
        <h1>Location Management</h1>
        <p>Manage your service locations and coverage areas</p>
      </div>
      
      <div className="locations-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">📍</div>
          <h2>Location Management Coming Soon</h2>
          <p>Location management features are being developed. You'll be able to:</p>
          <ul>
            <li>Add new service locations</li>
            <li>Edit location details and contact info</li>
            <li>Set service area boundaries</li>
            <li>Manage location-specific pricing</li>
            <li>Track location performance</li>
            <li>Enable/disable locations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorLocations; 