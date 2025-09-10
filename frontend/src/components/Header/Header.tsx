import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Import logo as module
import movedinLogo from '../../assets/icons-svg/movedin-logo_svg.svg';

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const handleMenuToggle = () => {
        setMenuOpen((open) => {
            const newState = !open;
            console.log('Menu toggle:', newState);
            console.log('Menu state changed to:', newState ? 'OPEN' : 'CLOSED');
            
            // Prevent body scroll when menu is open
            if (newState) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            
            return newState;
        });
    };
    const handleNavClick = () => {
        setMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    // Cleanup effect to restore body scroll
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <header className="main-header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">
                        <img
                            src={movedinLogo}
                            alt="MovedIn Logo"
                            className="header-logo"
                            style={{
                                height: 'auto',
                                maxHeight: '55px',
                                width: 'auto',
                                maxWidth: '180px',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link
                        to="/quote"
                        className={`nav-link ${isActive('/quote') ? 'active' : ''}`}
                    >
                        Get a quote
                    </Link>
                    <Link
                        to="/how-it-works"
                        className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
                    >
                        How it works
                    </Link>
                    <Link
                        to="/tips-guides"
                        className={`nav-link ${isActive('/tips-guides') ? 'active' : ''}`}
                    >
                        Tips & Guides
                    </Link>
                    <Link
                        to="/about-us"
                        className={`nav-link ${isActive('/about-us') ? 'active' : ''}`}
                    >
                        About us
                    </Link>
                    {/* <Link
                        to="/admin"
                        className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                    >
                        Admin
                    </Link> */}
                </nav>
                <button
                    className="mobile-menu-toggle"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    onClick={handleMenuToggle}
                >
                    <div className="hamburger-icon">
                        <span className={`line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`line ${menuOpen ? 'open' : ''}`}></span>
                    </div>
                </button>
            </div>
            {menuOpen && (
                <div 
                    className="mobile-menu-overlay" 
                    onClick={handleMenuToggle}
                />
            )}
            {menuOpen && (
                <nav
                    id="mobile-menu"
                    className="mobile-nav open"
                >
                {/* Close button */}
                <button
                    className="mobile-menu-close"
                    onClick={handleMenuToggle}
                    aria-label="Close menu"
                >
                    ×
                </button>
                <Link
                    to="/quote"
                    className={`nav-link ${isActive('/quote') ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    Get a quote
                </Link>
                <Link
                    to="/how-it-works"
                    className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    How it works
                </Link>
                <Link
                    to="/tips-guides"
                    className={`nav-link ${isActive('/tips-guides') ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    Tips & Guides
                </Link>
                <Link
                    to="/about-us"
                    className={`nav-link ${isActive('/about-us') ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    About us
                </Link>
                <Link
                    to="/admin"
                    className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                    onClick={handleNavClick}
                >
                    Admin
                </Link>
                </nav>
            )}
        </header>
    );
};

export default Header; 