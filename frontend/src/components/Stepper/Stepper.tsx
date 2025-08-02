import React, { useState, useEffect } from 'react';
import './Stepper.css';

// Import icons as modules
import locationIcon from '../../assets/icons/location.svg';
import homeIcon from '../../assets/icons/home.svg';
import destinationIcon from '../../assets/icons/destination.svg';
import moversIcon from '../../assets/icons/movers.svg';
import contactIcon from '../../assets/icons/contact.svg';
import reviewIcon from '../../assets/icons/review.svg';
import thankyouIcon from '../../assets/icons/thankyou.svg';

interface Step {
  label: string;
  subtitle?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  goToStep?: (idx: number) => void;
}

const iconImports = [
  locationIcon,
  homeIcon,
  destinationIcon,
  moversIcon,
  contactIcon,
  reviewIcon,
  thankyouIcon
];

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, goToStep }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <aside className="stepper-sidebar">
      {steps.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <div
            key={step.label}
            className={`stepper-step${isActive ? ' active' : 'http://localhost:8000'}${isCompleted ? ' completed' : 'http://localhost:8000'}${isCompleted && goToStep ? ' clickable' : 'http://localhost:8000'}`}
            onClick={isCompleted && goToStep ? () => goToStep(idx) : undefined}
          >
            <div className="stepper-icon">
              <img
                src={iconImports[idx]}
                alt={step.label}
                height={24}
                width={24}
                onError={e => {
                  console.warn(`Failed to load icon for step ${idx + 1}: ${step.label}`);
                }}
              />
            </div>
            {!isMobile && (
              <div className="stepper-content">
                <div className="stepper-label">
                  <span className="stepper-number">{idx + 1}.</span> {step.label}
                </div>
                <div className="stepper-subtitle">{step.subtitle}</div>
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Stepper; 