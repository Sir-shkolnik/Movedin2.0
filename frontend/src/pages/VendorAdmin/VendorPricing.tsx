import React from 'react';

const VendorPricing: React.FC = () => {
  return (
    <div className="vendor-pricing-page">
      <div className="pricing-header">
        <h1>Pricing Management</h1>
        <p>Update your rates and pricing rules</p>
      </div>
      
      <div className="pricing-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">💰</div>
          <h2>Pricing Management Coming Soon</h2>
          <p>Pricing management features are being developed. You'll be able to:</p>
          <ul>
            <li>Update hourly rates for different crew sizes</li>
            <li>Set truck fees and additional charges</li>
            <li>Configure location-specific pricing</li>
            <li>Manage seasonal rate adjustments</li>
            <li>Set up promotional pricing</li>
            <li>Track pricing performance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorPricing; 