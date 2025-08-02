import React, { useState, useEffect } from 'react';
import './Stepper.css';

interface Step {
  label: string;
  subtitle?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  goToStep?: (idx: number) => void;
}

const iconNames = [
  'location.svg',
  'home.svg',
  'destination.svg',
  'movers.svg',
  'contact.svg',
  'review.svg',
  'thankyou.svg'
];

const fallbackIcon = '/icons/location.svg';

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
            className={`stepper-step${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}${isCompleted && goToStep ? ' clickable' : ''}`}
            onClick={isCompleted && goToStep ? () => goToStep(idx) : undefined}
          >
            <div className="stepper-icon">
              <img
                src={`/icons/${iconNames[idx]}`}
                alt={step.label}
                height={24}
                width={24}
                onError={e => {
                  (e.target as HTMLImageElement).src = fallbackIcon;
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