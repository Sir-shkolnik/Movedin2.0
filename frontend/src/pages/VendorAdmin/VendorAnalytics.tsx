import React from 'react';

const VendorAnalytics: React.FC = () => {
  return (
    <div className="vendor-analytics-page">
      <div className="analytics-header">
        <h1>Analytics & Reports</h1>
        <p>Detailed performance metrics and business insights</p>
      </div>
      
      <div className="analytics-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">📊</div>
          <h2>Advanced Analytics Coming Soon</h2>
          <p>Comprehensive analytics features are being developed. You'll have access to:</p>
          <ul>
            <li>Revenue trends and projections</li>
            <li>Lead conversion analytics</li>
            <li>Geographic performance data</li>
            <li>Customer satisfaction metrics</li>
            <li>Competitive analysis</li>
            <li>Custom report generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics; 