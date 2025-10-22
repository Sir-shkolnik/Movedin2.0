import React from "react";

function LocationStep() {
  return (
    <>
        <h2 className="qw-title">Your Location</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, maxWidth: 700, margin: '0 auto' }}>
          <div className="qw-field">
            <label className="qw-label">From</label>
            <input className="qw-input" type="text" placeholder="Enter pickup address" />
            <span className="qw-helper-link">+ Fill in address manually</span>
          </div>
          <div className="qw-field">
            <label className="qw-label">To</label>
            <input className="qw-input" type="text" placeholder="Enter new home address" />
            <span className="qw-helper-link">+ Fill in address manually</span>
          </div>
        </div>
        {/* Navigation handled by WizardContainer bottom bar */}
    </>
  );
}

export default LocationStep;


