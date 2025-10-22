import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import StepSidebar from "./StepSidebar";

const WizardContainer = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    "/quote", 
    "/quote/from-details",
    "/quote/to-details",
    "/quote/vendors",
    "/quote/summary",
    "/quote/payment"
  ];
  const idx = steps.indexOf(location.pathname);
  const isFirst = idx <= 0;
  const isLast = idx === steps.length - 1;

  const handleBack = () => {
    if (!isFirst) {
      setIsTransitioning(true);
      navigate(steps[idx - 1]);
    }
  };
  
  const handleNext = () => {
    if (!isLast) {
      setIsTransitioning(true);
      navigate(steps[idx + 1]);
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className="quote-wizard-container">
      <div className="qw-inner qw-layout">
        <StepSidebar isTransitioning={isTransitioning} />
        <section className={`qw-content ${isTransitioning ? 'fade-transition' : ''}`}>
          {children}
        </section>
      </div>
      <div className="qw-bottom-bar">
        <div className={`qw-bottom-inner ${isFirst ? 'only-continue' : ''}`}>
          {!isFirst && <button className="qw-btn back-btn" onClick={handleBack}>Back</button>}
          <button className="qw-btn primary qw-bottom-cta" onClick={handleNext}>{isLast ? 'Submit' : 'Continue'}</button>
        </div>
      </div>
    </div>
  );
};

export default WizardContainer;


