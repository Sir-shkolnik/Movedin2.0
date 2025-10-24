import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CalendarIcon, HomeIcon, MapPinIcon, ServiceIcon, PhoneIcon, CreditCardIcon } from "./StepIcon";

const STEPS = [
  { path: "/quote", title: "Date + addresses", desc: "Pick and confirm", icon: CalendarIcon },
  { path: "/quote/from-details", title: "From details", desc: "Building info", icon: HomeIcon },
  { path: "/quote/to-details", title: "To details", desc: "Building info", icon: MapPinIcon },
  { path: "/quote/vendors", title: "Vendors", desc: "Choose a mover", icon: ServiceIcon },
  { path: "/quote/summary", title: "Contact info", desc: "Your details", icon: PhoneIcon },
  { path: "/quote/payment", title: "Deposit", desc: "Pay deposit", icon: CreditCardIcon },
  // Thank You page is not shown in sidebar - it's the final step
];

function StepSidebar({ isTransitioning }) {
  const location = useLocation();
  const activeRef = useRef(null);
  
  // Find current step index
  const currentIndex = STEPS.findIndex(step => step.path === location.pathname);
  
  // Calculate which 4 steps to show on mobile (sliding window)
  const MOBILE_VISIBLE_COUNT = 4;
  let startIndex = 0;
  
  if (currentIndex >= 0) {
    // Center the active step in the visible window
    startIndex = Math.max(0, Math.min(
      currentIndex - Math.floor(MOBILE_VISIBLE_COUNT / 2),
      STEPS.length - MOBILE_VISIBLE_COUNT
    ));
  }
  
  // Get the visible steps (for mobile)
  const visibleSteps = STEPS.slice(startIndex, startIndex + MOBILE_VISIBLE_COUNT);

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
    <aside className="qw-steps" data-mobile-view="true">
      {/* Desktop: show all steps, Mobile: show only 4 */}
      {STEPS.map(({ path, title, desc, icon: Icon }) => {
        const isActive = location.pathname === path;
        const isVisibleOnMobile = visibleSteps.some(s => s.path === path);
        
        return (
          <div 
            key={path} 
            ref={isActive ? activeRef : null}
            className={`qw-step-item ${isActive ? 'active' : ''} ${!isVisibleOnMobile ? 'mobile-hidden' : ''}`}
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


