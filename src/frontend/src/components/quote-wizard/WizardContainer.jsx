import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import StepSidebar from "./StepSidebar";
import { useForm } from "../../contexts/FormContext";

const WizardContainer = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useForm();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    "/quote", 
    "/quote/from-details",
    "/quote/to-details",
    "/quote/vendors",
    "/quote/summary",
    "/quote/payment",
    "/quote/thank-you"
  ];
  const idx = steps.indexOf(location.pathname);
  const isFirst = idx <= 0;
  const isLast = idx === steps.length - 1;
  const isThankYou = location.pathname === "/quote/thank-you";
  const isVendorsStep = location.pathname === "/quote/vendors";
  const isSummaryStep = location.pathname === "/quote/summary";
  const isPaymentStep = location.pathname === "/quote/payment";
  
  // Calculate progress
  const progress = ((idx + 1) / steps.length) * 100;
  
  // Validation helpers
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePhone = (phone) => {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };
  
  // Check if Continue button should be disabled
  let canContinue = true;
  let buttonText = isLast ? 'Submit' : 'Continue';
  
  if (isVendorsStep) {
    canContinue = data.canProceedFromVendors === true;
    if (!canContinue) buttonText = 'Select a Mover First';
  } else if (isSummaryStep) {
    // Validate contact information before allowing payment
    const hasValidContact = data.contact?.firstName && 
                           data.contact?.lastName && 
                           data.contact?.email && 
                           validateEmail(data.contact.email) &&
                           data.contact?.phone &&
                           validatePhone(data.contact.phone);
    canContinue = hasValidContact;
    if (!canContinue) buttonText = 'Complete Contact Info';
  }

  const handleBack = () => {
    if (!isFirst) {
      setIsTransitioning(true);
      navigate(steps[idx - 1]);
    }
  };
  
  const handleNext = () => {
    if (!isLast) {
      setIsTransitioning(true);
      // If on review step, go to thank you
      if (location.pathname === "/quote/review") {
        navigate("/quote/thank-you");
      } else {
        navigate(steps[idx + 1]);
      }
    }
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Don't render sidebar and bottom bar on thank you page or payment step
  if (isThankYou || isPaymentStep) {
    return (
      <div className="quote-wizard-container">
        <div className="qw-inner">
          <section className={`qw-content ${isTransitioning ? 'fade-transition' : ''}`}>
            {children}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-wizard-container">
      {/* Progress Indicator */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '4px', 
        background: '#E5E7EB',
        zIndex: 1000
      }}>
        <div style={{ 
          height: '100%', 
          width: `${progress}%`, 
          background: '#5340FF',
          transition: 'width 0.3s ease',
          borderRadius: '0 4px 4px 0'
        }} />
      </div>
      
      {/* Progress Text */}
      <div style={{
        position: 'fixed',
        top: '12px',
        right: '24px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#5340FF',
        zIndex: 1001,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        Step {idx + 1} of {steps.length}
      </div>

      <div className="qw-inner qw-layout">
        <StepSidebar isTransitioning={isTransitioning} />
        <section className={`qw-content ${isTransitioning ? 'fade-transition' : ''}`}>
          {children}
        </section>
      </div>
      <div className="qw-bottom-bar">
        <div className={`qw-bottom-inner ${isFirst ? 'only-continue' : ''}`}>
          {!isFirst && <button className="qw-btn back-btn" onClick={handleBack}>Back</button>}
          <button 
            className="qw-btn primary qw-bottom-cta" 
            onClick={handleNext}
            disabled={!canContinue}
            style={{
              opacity: canContinue ? 1 : 0.5,
              cursor: canContinue ? 'pointer' : 'not-allowed'
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WizardContainer;


