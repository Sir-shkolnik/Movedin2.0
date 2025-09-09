import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

// Import brand assets
import truckIcon from '../assets/icons-svg/icon_truck-white.svg';
import checkIcon from '../assets/icons-svg/icon_check-purple.svg';
import starIcon from '../assets/icons-svg/icon_star-yellow.svg';
import locationIcon from '../assets/icons-svg/icon_location-white.svg';
import heroIllustration from '../assets/imgs-png/img_one-stop-illustration.png';

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
      <main className="page-container" aria-labelledby="homepage-title">
        <div className="page-content">
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <h1 id="homepage-title">Moving Made Simple</h1>
                <p className="hero-description">
                  Connect with verified moving companies across Canada. Get instant quotes, compare prices, and book with confidence.
                </p>
                <button 
                  className="hero-cta-button" 
                  onClick={handleGetQuote}
                  aria-label="Get your free moving quote now"
                >
                  Get Free Quote
                </button>
                <p className="hero-trust">
                  <img src={starIcon} alt="Star" className="trust-star" />
                  Trusted by 10,000+ Canadians
                </p>
              </div>
              <div className="hero-visual">
                <img 
                  src={heroIllustration} 
                  alt="Moving illustration" 
                  className="hero-illustration"
                />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="process-section">
            <h2>How It Works</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-icon">
                  <img src={locationIcon} alt="Location" />
                </div>
                <div className="step-number">1</div>
                <h3>Share Your Details</h3>
                <p>Tell us about your move in 2 minutes</p>
              </div>
              <div className="process-step">
                <div className="step-icon">
                  <img src={truckIcon} alt="Truck" />
                </div>
                <div className="step-number">2</div>
                <h3>Get Instant Quotes</h3>
                <p>Receive quotes from verified movers</p>
              </div>
              <div className="process-step">
                <div className="step-icon">
                  <img src={checkIcon} alt="Check" />
                </div>
                <div className="step-number">3</div>
                <h3>Compare & Book</h3>
                <p>Choose the best option for you</p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="benefits-section">
            <h2>Why Choose MovedIn</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <h3>Verified Movers</h3>
                <p>All companies are licensed and insured</p>
              </div>
              <div className="benefit-item">
                <h3>Transparent Pricing</h3>
                <p>No hidden fees or surprises</p>
              </div>
              <div className="benefit-item">
                <h3>Instant Quotes</h3>
                <p>Get multiple quotes in minutes</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2>Ready to Move?</h2>
            <p>Join thousands of satisfied customers across Canada</p>
            <button 
              className="cta-button" 
              onClick={handleGetQuote}
              aria-label="Get your free moving quote now"
            >
              Start Your Quote
            </button>
          </section>

        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HomePage;