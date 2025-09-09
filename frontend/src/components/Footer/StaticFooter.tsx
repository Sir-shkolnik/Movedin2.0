import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import movedinLogo from '../../assets/logos-png/movedin-logo_png.png';
import facebookIcon from '../../assets/icons-svg/footer_icon-facebook.svg';
import instagramIcon from '../../assets/icons-svg/footer_icon-instagram.svg';
import linkedinIcon from '../../assets/icons-svg/footer_icon-linkedin.svg';

const StaticFooter: React.FC = () => {
  return (
    <footer className="static-footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={movedinLogo} alt="MovedIn Logo" className="logo-image" />
            <span className="logo-text">MOVEDIN.</span>
          </div>
          <p className="footer-tagline">Moving should be easy</p>
          <div className="social-icons">
            <a href="https://facebook.com/movedin" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://instagram.com/movedin" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://linkedin.com/company/movedin" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* CTA Section */}
        <div className="footer-cta">
          <Link to="/quote" className="footer-quote-button">Get a quote</Link>
          <Link to="/partners" className="footer-partners-link">Partners</Link>
        </div>

        {/* Company Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">Company</h4>
          <ul className="footer-links">
            <li><Link to="/about-us">About us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li>
              <Link to="/tips-guides" className="footer-link-with-tag">
                Tips & Guides
                <span className="new-tag">New</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">Legal</h4>
          <ul className="footer-links">
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2023 MovedIn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default StaticFooter;
