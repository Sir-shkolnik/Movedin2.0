import React from "react";

function FromDetailsStep() {
  return (
    <>
        <h2 className="qw-title">From details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700, margin: '0 auto' }}>
          <div className="qw-field"><label className="qw-label">Unit</label><input className="qw-input" /></div>
          <div className="qw-field"><label className="qw-label">Floor</label><input className="qw-input" /></div>
          <div className="qw-field"><label className="qw-label">Elevator</label><select className="qw-input"><option>Yes</option><option>No</option></select></div>
          <div className="qw-field"><label className="qw-label">Stairs</label><input className="qw-input" /></div>
          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}><label className="qw-label">Parking notes</label><input className="qw-input" /></div>
          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}><label className="qw-label">Special items</label><input className="qw-input" placeholder="Piano, safe, etc." /></div>
        </div>
    </>
  );
}

export default FromDetailsStep;


