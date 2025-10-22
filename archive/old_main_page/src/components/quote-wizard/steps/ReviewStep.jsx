import React from "react";
import { CalendarIcon, LocationIcon, ServiceIcon, PhoneIcon } from "../StepIcon";

function ReviewStep() {
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
        <h2 className="qw-title">Review & Submit</h2>
        <div style={{ maxWidth: 700, margin: '0 auto', font: '400 14px Lexend, sans-serif', color: '#344054' }}>
          <p>We will show a full summary here (addresses, date/time, services, contact) before submission.</p>
        </div>
      </section>
    </div>
  );
}

export default ReviewStep;



