import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CalendarIcon, ServiceIcon, PhoneIcon } from "./StepIcon";

const STEPS = [
  { path: "/quote", title: "Date + addresses", desc: "Pick and confirm", icon: CalendarIcon },
  { path: "/quote/from-details", title: "From details", desc: "Building info", icon: ServiceIcon },
  { path: "/quote/to-details", title: "To details", desc: "Building info", icon: ServiceIcon },
  { path: "/quote/vendors", title: "Vendors", desc: "Choose a mover", icon: ServiceIcon },
  { path: "/quote/summary", title: "Full quote", desc: "Review & pay", icon: ServiceIcon },
  { path: "/quote/payment", title: "Payment", desc: "Complete", icon: PhoneIcon },
];

function StepSidebar({ isTransitioning }) {
  const location = useLocation();
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && isTransitioning) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [location.pathname, isTransitioning]);

  return (
    <aside className="qw-steps">
      {STEPS.map(({ path, title, desc, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <div 
            key={path} 
            ref={isActive ? activeRef : null}
            className={`qw-step-item ${isActive ? 'active' : ''}`}
          >
            <div>
              <Icon />
            </div>
            <div className="qw-step-title">{title}</div>
          </div>
        );
      })}
    </aside>
  );
}

export default StepSidebar;


