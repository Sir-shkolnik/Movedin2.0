import React from "react";
import { CalendarIcon, LocationIcon, ServiceIcon, PhoneIcon } from "../StepIcon";

function ContactStep() {
  return (
    <div className="qw-inner qw-layout">
      <aside className="qw-steps">
        <div className="qw-step-item"><LocationIcon />
          <div><div className="qw-step-title">Location</div><div className="qw-step-desc">From and To</div></div>
        </div>
        <div className="qw-step-item"><CalendarIcon />
          <div><div className="qw-step-title">Date</div><div className="qw-step-desc">Moving date & time</div></div>
        </div>
        <div className="qw-step-item"><ServiceIcon />
          <div><div className="qw-step-title">Service</div><div className="qw-step-desc">Help with your move</div></div>
        </div>
        <div className="qw-step-item active"><PhoneIcon />
          <div><div className="qw-step-title">Contact info</div><div className="qw-step-desc">Finalize</div></div>
        </div>
      </aside>
      <section className="qw-content">
        <h2 className="qw-title">Contact info</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700, margin: '0 auto' }}>
          <div className="qw-field">
            <label className="qw-label">Full name</label>
            <input className="qw-input" placeholder="Enter your name" />
          </div>
          <div className="qw-field">
            <label className="qw-label">Phone</label>
            <input className="qw-input" placeholder="Enter your phone" />
          </div>
          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">Email</label>
            <input className="qw-input" placeholder="Enter your email" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactStep;


