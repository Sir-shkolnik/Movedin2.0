import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const StaticFooter: React.FC = () => {
  return (
    <footer className="static-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MovedIn</h3>
          <p>Canada's premier moving platform connecting customers with verified, licensed moving companies.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Get a Quote</Link></li>
            <li><Link to="/#/how-it-works">How It Works</Link></li>
            <li><Link to="/#/tips-guides">Tips & Guides</Link></li>
            <li><Link to="/#/about-us">About Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/#/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/#/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/#/cookie-policy">Cookie Policy</Link></li>
            <li><Link to="/#/accessibility">Accessibility</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Email: support@movedin.com</li>
            <li>Phone: +1 (437) 979-3830</li>
            <li>Service Area: All of Canada</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 MovedIn. All rights reserved. Canadian owned and operated.</p>
      </div>
    </footer>
  );
};

export default StaticFooter;
