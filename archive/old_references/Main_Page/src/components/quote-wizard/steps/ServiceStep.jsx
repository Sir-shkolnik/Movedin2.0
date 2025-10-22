import React from "react";
import { CalendarIcon, LocationIcon, ServiceIcon, PhoneIcon } from "../StepIcon";

function ServiceStep() {
  return (
    <div className="qw-inner qw-layout">
      <aside className="qw-steps">
        <div className="qw-step-item"><LocationIcon />
          <div><div className="qw-step-title">Location</div><div className="qw-step-desc">From and To</div></div>
        </div>
        <div className="qw-step-item"><CalendarIcon />
          <div><div className="qw-step-title">Date</div><div className="qw-step-desc">Moving date & time</div></div>
        </div>
        <div className="qw-step-item active"><ServiceIcon />
          <div><div className="qw-step-title">Service</div><div className="qw-step-desc">Help with your move</div></div>
        </div>
        <div className="qw-step-item"><PhoneIcon />
          <div><div className="qw-step-title">Contact info</div><div className="qw-step-desc">Finalize</div></div>
        </div>
      </aside>
      <section className="qw-content">
        <h2 className="qw-title">Select your service</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 700, margin: '0 auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="checkbox" /> Packing assistance
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="checkbox" /> Storage
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="checkbox" /> Furniture assembly
          </label>
        </div>
      </section>
    </div>
  );
}

export default ServiceStep;


