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
import heroIllustration from '../assets/imgs-png/img_one-stop-illustration.png';
import truckImage from '../assets/imgs-png/img_truck.png';
import manWithBoxes from '../assets/imgs-png/img_blog-dealing_content_2.svg';
import customerService from '../assets/imgs-png/img_blog-dealing_content_4.svg';
import profileAmelie from '../assets/imgs-png/img_profile-Amélie.png';
import blogMoving from '../assets/imgs-png/img_blog-moving.jpg';
import blogEssential from '../assets/imgs-png/img_blog-essential.jpg';
import blogToronto from '../assets/imgs-png/img_blog-toronto.jpg';

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
            <div className="hero-content">
              <div className="hero-text">
                <h1 id="homepage-title">Moving Made Simple</h1>
                <p className="hero-description">
                  Connect with verified moving companies across Canada. Get instant quotes, compare prices, and book with confidence.
                </p>
                <button 
                  className="hero-cta-button" 
                  onClick={handleGetQuote}
                  aria-label="Get your free moving quote now - Start your move in 3 simple steps"
                  title="Click to get instant quotes from verified Canadian movers"
                >
                  Get Free Quote
                </button>
                <p className="hero-trust">
                  <img src={starIcon} alt="Star" className="trust-star" />
                  Trusted by 10,000+ Canadians
                </p>
              </div>
              {/* Hero visual removed - no picture needed in top section */}
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

          {/* Feature Sections */}
          <section className="features-section" aria-labelledby="features-heading">
            <div className="feature-item">
              <div className="feature-content">
                <h2>One stop shop for all your moving needs</h2>
                <p>From packing to unpacking, we connect you with the right professionals for every aspect of your move.</p>
                <button className="feature-button" onClick={handleGetQuote} aria-label="Get quote for comprehensive moving services">Get a quote</button>
              </div>
              <div className="feature-visual">
                <img src={heroIllustration} alt="One stop shop illustration showing comprehensive moving services" className="feature-image" loading="lazy" />
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-content">
                <h2>Competitive price guarantee</h2>
                <p>We ensure you get the best rates by comparing quotes from multiple verified movers in your area.</p>
                <button className="feature-button" onClick={handleGetQuote} aria-label="Get competitive moving quotes">Get a quote</button>
              </div>
              <div className="feature-visual">
                <img src={manWithBoxes} alt="Competitive pricing illustration showing cost comparison" className="feature-image" loading="lazy" />
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-content">
                <h2>Trusted movers you can rely on</h2>
                <p>All our moving partners are licensed, insured, and thoroughly vetted for quality and reliability.</p>
                <button className="feature-button" onClick={handleGetQuote} aria-label="Find trusted licensed movers">Find a mover</button>
              </div>
              <div className="feature-visual">
                <img src={customerService} alt="Customer service illustration showing professional movers" className="feature-image" loading="lazy" />
              </div>
            </div>
          </section>



          {/* Expert Section */}
          <section className="expert-section">
            <div className="expert-content">
              <div className="expert-text">
                <h2>An expert at your fingertips</h2>
                <p>Once you've shared your relocation requirements with us, a booking agent will be assigned to you automatically, always free of charge!</p>
              </div>
              <div className="expert-profile">
                <div className="profile-image">
                  <img src={profileAmelie} alt="Amelie Laurent" className="profile-img" />
                </div>
                <div className="profile-info">
                  <h3>Amelie Laurent</h3>
                  <p>Booking Agent</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Blogs Section */}
          <section className="blogs-section">
            <h2>Recent blogs</h2>
            <div className="blogs-grid">
              <div className="blog-item">
                <img src={blogMoving} alt="Moving blog" className="blog-image" />
                <h3>Dealing with Moving Stress: Top Relaxation Techniques</h3>
                <p>Essential tips for a smooth move</p>
                <div className="blog-meta">
                  <span className="blog-author">By MovedIn Team</span>
                  <span className="blog-date">Dec 15, 2023</span>
                </div>
              </div>
              <div className="blog-item">
                <img src={blogEssential} alt="Essential blog" className="blog-image" />
                <h3>The Essential Moving Checklist for Tenants/renters</h3>
                <p>What you need to know before moving</p>
                <div className="blog-meta">
                  <span className="blog-author">By MovedIn Team</span>
                  <span className="blog-date">Dec 10, 2023</span>
                </div>
              </div>
              <div className="blog-item">
                <img src={blogToronto} alt="Toronto blog" className="blog-image" />
                <h3>Moving in the Winter: Special Tips for Toronto Residents</h3>
                <p>Moving in and around Toronto</p>
                <div className="blog-meta">
                  <span className="blog-author">By MovedIn Team</span>
                  <span className="blog-date">Dec 5, 2023</span>
                </div>
              </div>
            </div>
            <div className="blogs-cta">
              <button className="blogs-button">Read all</button>
            </div>
          </section>

        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HomePage;