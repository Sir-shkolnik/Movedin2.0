import React from 'react';
import './Footer.css';

interface FooterProps {
  onContinue: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showContinue?: boolean;
  disabled?: boolean;
  label?: string;
}

const Footer: React.FC<FooterProps> = ({ onContinue, onBack, showBack = false, showContinue = true, disabled, label = 'Continue' }) => {
  const handleContinueClick = () => {
    console.log('🚀 Footer - Continue button clicked!');
    console.log('🔍 Footer - onContinue function:', onContinue);
    console.log('🔍 Footer - disabled:', disabled);
    console.log('🔍 Footer - label:', label);
    if (onContinue) {
      onContinue();
    } else {
      console.log('❌ Footer - onContinue is null/undefined');
    }
  };

  return (
    <footer className="main-footer">
      {showBack && onBack && (
        <button className="footer-back-btn" onClick={onBack}>Back</button>
      )}
      {showContinue && (
        <button className="footer-continue-btn" onClick={handleContinueClick} disabled={disabled}>{label}</button>
      )}
    </footer>
  );
};

export default Footer; 