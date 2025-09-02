import React from 'react';
import './Footer.css';

const StaticFooter: React.FC = () => {
  return (
    <footer className="static-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>MovedIn</h4>
          <p>Canada's premier moving platform connecting customers with verified, licensed moving companies.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/#/">Get a Quote</a></li>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/tips-guides">Tips & Guides</a></li>
            <li><a href="/about-us">About Us</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/cookie-policy">Cookie Policy</a></li>
            <li><a href="/accessibility">Accessibility</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@movedin.com</p>
          <p>Phone: +1 (437) 979-3830</p>
          <p>Service Area: All of Canada</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 MovedIn. All rights reserved. Canadian owned and operated.</p>
      </div>
    </footer>
  );
};

export default StaticFooter;
