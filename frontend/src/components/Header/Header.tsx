import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// Import logo as module
import movedinLogo from '../../assets/icons/movedin_logo.png';

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const handleMenuToggle = () => setMenuOpen((open) => !open);
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
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : 'http://localhost:8000'}`}
                    >
                        Get a quote
                    </Link>
                    <Link
                        to="/how-it-works"
                        className={`nav-link ${isActive('/how-it-works') ? 'active' : 'http://localhost:8000'}`}
                    >
                        How it works
                    </Link>
                    <Link
                        to="/tips-guides"
                        className={`nav-link ${isActive('/tips-guides') ? 'active' : 'http://localhost:8000'}`}
                    >
                        Tips & Guides
                    </Link>
                    <Link
                        to="/about-us"
                        className={`nav-link ${isActive('/about-us') ? 'active' : 'http://localhost:8000'}`}
                    >
                        About us
                    </Link>
                    {/* <Link
                        to="/admin"
                        className={`nav-link ${isActive('/admin') ? 'active' : 'http://localhost:8000'}`}
                    >
                        Admin
                    </Link> */}
                </nav>
                <button
                    className={`hamburger${menuOpen ? ' open' : 'http://localhost:8000'}`}
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
                <div className="mobile-menu-overlay" onClick={handleMenuToggle} />
            )}
            <nav
                id="mobile-menu"
                className={`mobile-nav${menuOpen ? ' open' : 'http://localhost:8000'}`}
                aria-hidden={!menuOpen}
            >
                <Link
                    to="/"
                    className={`nav-link ${isActive('/') ? 'active' : 'http://localhost:8000'}`}
                    onClick={handleNavClick}
                >
                    Get a quote
                </Link>
                <Link
                    to="/how-it-works"
                    className={`nav-link ${isActive('/how-it-works') ? 'active' : 'http://localhost:8000'}`}
                    onClick={handleNavClick}
                >
                    How it works
                </Link>
                <Link
                    to="/tips-guides"
                    className={`nav-link ${isActive('/tips-guides') ? 'active' : 'http://localhost:8000'}`}
                    onClick={handleNavClick}
                >
                    Tips & Guides
                </Link>
                <Link
                    to="/about-us"
                    className={`nav-link ${isActive('/about-us') ? 'active' : 'http://localhost:8000'}`}
                    onClick={handleNavClick}
                >
                    About us
                </Link>
                <Link
                    to="/admin"
                    className={`nav-link ${isActive('/admin') ? 'active' : 'http://localhost:8000'}`}
                    onClick={handleNavClick}
                >
                    Admin
                </Link>
            </nav>
        </header>
    );
};

export default Header; 