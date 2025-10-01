import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './HomePage.css';

// Import brand assets
import truckIcon from '../assets/icons-svg/icon_truck-white.svg';
import checkIcon from '../assets/icons-svg/icon_check-purple.svg';
import starIcon from '../assets/icons-svg/icon_star-yellow.svg';

// Import real company logos
import logoCargoCabbie from '../assets/logos-png/logo_cargo-cabbie.png';
import logoNewEra from '../assets/logos-png/logo_new-era.png';
import logoLetsGetMoving from '../assets/logos-png/logo_letsgetmoving.jpg';
import logoHighLevelMovers from '../assets/logos-png/logo_highlevelmovers.jpg';
import logoBronzeStar from '../assets/logos-png/logo_bronzestar.png';

// Import How it works icons
import locationIcon from '../assets/icons-svg/icon_location-purple.svg';
import calendarIcon from '../assets/icons-svg/icon_calendar-purple.svg';
import homeServicesIcon from '../assets/icons-svg/icon_home-services-black.svg';
import phoneIcon from '../assets/icons-svg/icon_phone-purple.svg';
import plusIcon from '../assets/icons-svg/icon_plus-purple.svg';
import minusIcon from '../assets/icons-svg/icon_minus-gray.svg';
import formLocationStep from '../assets/imgs-png/img_form1.png';

// Import essential images only
import heroIllustration from '../assets/imgs-png/img_hero-illustration-new.jpg';
import profileAmelie from '../assets/imgs-png/img_profile-Amélie.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate('/quote');
  };

  return (
    <>
      <Helmet>
        <title>MovedIn - Get Moving Quotes from Verified Canadian Movers | Free Instant Quotes</title>
        <meta name="description" content="Get instant moving quotes from verified, licensed Canadian moving companies. Compare prices, read reviews, and book with confidence. Serving all major Canadian cities." />
        <meta name="keywords" content="moving quotes, Canadian movers, moving companies, Toronto movers, Vancouver movers, Montreal movers, Calgary movers, moving services, instant quotes, verified movers" />
        <link rel="canonical" href="https://movedin.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="MovedIn - Get Moving Quotes from Verified Canadian Movers" />
        <meta property="og:description" content="Get instant moving quotes from verified, licensed Canadian moving companies. Compare prices and book with confidence." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-home.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MovedIn - Get Moving Quotes from Verified Canadian Movers" />
        <meta name="twitter:description" content="Get instant moving quotes from verified, licensed Canadian moving companies. Compare prices and book with confidence." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-home.jpg" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MovedIn" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MovedIn",
            "description": "Canada's premier moving platform connecting customers with verified, licensed moving companies",
            "url": "https://movedin.com",
            "logo": "https://movedin.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-MOVEDIN",
              "contactType": "customer service",
              "email": "support@movedin.com"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Canada"
            },
            "serviceType": "Moving Services",
            "offers": {
              "@type": "Offer",
              "description": "Instant moving quotes from verified Canadian moving companies",
              "price": "0",
              "priceCurrency": "CAD"
            }
          })}
        </script>
      </Helmet>

      <Header />
      <main className="page-container homepage-container" aria-labelledby="homepage-title">
        <div className="page-content">
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-background-elements">
              <div className="floating-truck truck-1">
                <img src={truckImage} alt="Moving truck" className="floating-image" />
              </div>
              <div className="floating-box box-1">
                <img src={realMoversImage} alt="Moving boxes" className="floating-image" />
              </div>
              <div className="floating-box box-2">
                <img src={competitiveImage} alt="Competitive pricing" className="floating-image" />
              </div>
              <div className="floating-box box-3">
                <img src={contactImage} alt="Customer service" className="floating-image" />
              </div>
              <div className="floating-house house-1">
                <img src={heroIllustration} alt="Moving services" className="floating-image" />
              </div>
            </div>
            <div className="hero-content">
              <div className="hero-text">
                <h1 id="homepage-title">Everything about moving is <span className="underlined">hard!</span></h1>
                <h2 className="hero-subtitle">That's about to change.</h2>
                <p className="hero-description">
                  We are here to guide you through your upcoming move, so you can focus on enjoying the new home, instead of worrying about the hassle of moving.
                </p>
                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">Happy Customers</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">5 min</div>
                    <div className="stat-label">Average Quote Time</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Free to Use</div>
                  </div>
                </div>
                <button 
                  className="hero-cta-button button--primary" 
                  onClick={handleGetQuote}
                  aria-label="Get your free moving quote now - Start your move in 3 simple steps"
                  title="Click to get instant quotes from verified Canadian movers"
                >
                  Get a moving quote
                </button>
              </div>
            </div>
          </section>


          {/* Trusted By Section */}
          <section className="trusted-section" aria-labelledby="trusted-heading">
            <div className="trusted-content">
              <h3 id="trusted-heading">Trusted by</h3>
              <div className="trusted-logos" role="img" aria-label="Partner moving companies logos">
                <img src={logoCargoCabbie} alt="Cargo Cabbie - Licensed Moving Company" className="trusted-logo" loading="lazy" />
                <img src={logoNewEra} alt="New Era Moving Services - Professional Movers" className="trusted-logo" loading="lazy" />
                <img src={logoLetsGetMoving} alt="Let's Get Moving - GTA Moving Specialists" className="trusted-logo" loading="lazy" />
                <img src={logoHighLevelMovers} alt="High Level Movers - Premium Moving Services" className="trusted-logo" loading="lazy" />
                <img src={logoBronzeStar} alt="Bronze Star Moving - Reliable Moving Solutions" className="trusted-logo" loading="lazy" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section" aria-labelledby="features-heading">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🏠</div>
                <h3>One Stop Shop</h3>
                <p>From packing to unpacking, we connect you with the right professionals for every aspect of your move.</p>
                <button className="feature-button button--secondary" onClick={handleGetQuote}>Get a quote</button>
              </div>

              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Competitive Pricing</h3>
                <p>We ensure you get the best rates by comparing quotes from multiple verified movers in your area.</p>
                <button className="feature-button button--secondary" onClick={handleGetQuote}>Get a quote</button>
              </div>

              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h3>Trusted Movers</h3>
                <p>All our moving partners are licensed, insured, and thoroughly vetted for quality and reliability.</p>
                <button className="feature-button button--secondary" onClick={handleGetQuote}>Find a mover</button>
              </div>
            </div>
          </section>





        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HomePage;