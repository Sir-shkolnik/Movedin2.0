import React from "react";

function DateTimeStep() {
  return (
    <>
        <h2 className="qw-title">Date & Time</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700, margin: '0 auto' }}>
          <div className="qw-field">
            <label className="qw-label">Date</label>
            <input className="qw-input" type="date" />
          </div>
          <div className="qw-field">
            <label className="qw-label">Time of day</label>
            <select className="qw-input">
              <option>Morning</option>
              <option>Afternoon</option>
            </select>
          </div>
        </div>
    </>
  );
}

export default DateTimeStep;


