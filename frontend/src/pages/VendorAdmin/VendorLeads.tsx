import React from 'react';

const VendorLeads: React.FC = () => {
  return (
    <div className="vendor-leads-page">
      <div className="leads-header">
        <h1>Lead Management</h1>
        <p>View and manage customer leads assigned to your business</p>
      </div>
      
      <div className="leads-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h2>Coming Soon</h2>
          <p>Lead management features are being developed. You'll be able to:</p>
          <ul>
            <li>View all leads assigned to your business</li>
            <li>Update lead status and add notes</li>
            <li>Contact customers directly</li>
            <li>Track conversion rates</li>
            <li>Export lead data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorLeads; 