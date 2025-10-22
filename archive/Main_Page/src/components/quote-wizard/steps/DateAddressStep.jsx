import React from "react";

function DateAddressStep() {
  return (
    <>
        <h2 className="qw-title">Date + Time + From + To</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700, margin: '0 auto' }}>
          <div className="qw-field">
            <label className="qw-label">Date</label>
            <input className="qw-input" type="date" />
          </div>
          <div className="qw-field">
            <label className="qw-label">Time of day</label>
            <select className="qw-input"><option>Morning</option><option>Afternoon</option></select>
          </div>
          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">From address</label>
            <input className="qw-input" placeholder="Enter pickup address" />
          </div>
          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">To address</label>
            <input className="qw-input" placeholder="Enter new home address" />
          </div>
        </div>
    </>
  );
}

export default DateAddressStep;


