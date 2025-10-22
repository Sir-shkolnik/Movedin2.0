import { Button } from "@mui/base";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigation from "../Navigation";
import Logo from "../Logo";
import "./style.css";

function SharedHeader() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleGetQuote = () => {
    navigate('/quote');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Logo />
        </div>
        <button className="hamburger" aria-label="Menu" onClick={() => setMobileOpen(!mobileOpen)}>
          <span />
          <span />
          <span />
        </button>
        <div className={`header-nav ${mobileOpen ? 'open' : ''}`}>
          <Navigation />
        </div>
        <div className="header-cta">
          <Button className="get-quote-btn" onClick={handleGetQuote}>Get a Quote</Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Logo />
            </div>
            <div className="mobile-menu-nav">
              <div className="mobile-nav-item" onClick={() => handleNavClick('/how-it-works')}>
                <p>How it works</p>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('/blogs')}>
                <p>Tips & Guides</p>
              </div>
              <div className="mobile-nav-item" onClick={() => handleNavClick('/about')}>
                <p>About Us</p>
              </div>
            </div>
            <div className="mobile-menu-cta">
              <Button className="mobile-get-quote-btn" onClick={handleGetQuote}>Get a moving quote</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default SharedHeader;
