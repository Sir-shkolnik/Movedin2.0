import React, { useState } from 'react';
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
            return newState;
        });
    };
    const handleNavClick = () => setMenuOpen(false);

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
                    className={`hamburger${menuOpen ? ' open' : ''}`}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    onClick={handleMenuToggle}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            {menuOpen && (
                <div 
                    className="mobile-menu-overlay" 
                    onClick={handleMenuToggle}
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 9998
                    }}
                />
            )}
            <nav
                id="mobile-menu"
                className={`mobile-nav${menuOpen ? ' open' : ''}`}
                aria-hidden={!menuOpen}
            >
                {/* Close button */}
                <button
                    onClick={handleMenuToggle}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#6b7280',
                        cursor: 'pointer',
                        zIndex: 140,
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
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
        </header>
    );
};

export default Header; 