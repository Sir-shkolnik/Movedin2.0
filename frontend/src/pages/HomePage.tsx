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
import truckImage from '../assets/imgs-png/img_truck.png';
import manWithBoxes from '../assets/imgs-png/img_blog-dealing_content_2.svg';
import customerService from '../assets/imgs-png/img_blog-dealing_content_4.svg';
import familyPlaying from '../assets/imgs-png/img_blog-dealing_content_3.jpg';
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

          {/* Trusted By Section */}
          <section className="trusted-section">
            <div className="trusted-content">
              <h3>Trusted by</h3>
              <div className="trusted-logos">
                <div className="logo-item">CARGO CABBIE</div>
                <div className="logo-item">T-Mobile</div>
                <div className="logo-item">SUPER MOVING</div>
                <div className="logo-item">MOVERS WAREHOUSE</div>
                <div className="logo-item">🐤</div>
              </div>
            </div>
          </section>

          {/* Feature Sections */}
          <section className="features-section">
            <div className="feature-item">
              <div className="feature-content">
                <h2>One stop shop for all your moving needs</h2>
                <p>From packing to unpacking, we connect you with the right professionals for every aspect of your move.</p>
              </div>
              <div className="feature-visual">
                <img src={heroIllustration} alt="One stop shop illustration" className="feature-image" />
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-content">
                <h2>Competitive price guarantee</h2>
                <p>We ensure you get the best rates by comparing quotes from multiple verified movers in your area.</p>
              </div>
              <div className="feature-visual">
                <img src={manWithBoxes} alt="Competitive pricing illustration" className="feature-image" />
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-content">
                <h2>Trusted movers you can rely on</h2>
                <p>All our moving partners are licensed, insured, and thoroughly vetted for quality and reliability.</p>
              </div>
              <div className="feature-visual">
                <img src={customerService} alt="Customer service illustration" className="feature-image" />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works-section">
            <div className="how-it-works-content">
              <div className="how-it-works-text">
                <h2>How it works</h2>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Share Your Details</h3>
                      <p>Tell us about your move in 2 minutes</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Get Instant Quotes</h3>
                      <p>Receive quotes from verified movers</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Compare & Book</h3>
                      <p>Choose the best option for you</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="how-it-works-visual">
                <div className="interface-mockup">
                  <div className="mockup-content">
                    <div className="mockup-header">Moving Quote Form</div>
                    <div className="mockup-form">
                      <div className="form-field">From Address</div>
                      <div className="form-field">To Address</div>
                      <div className="form-field">Move Date</div>
                      <div className="form-field">Property Size</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Explore Services Section */}
          <section className="explore-section">
            <div className="explore-content">
              <h2>Explore the best services available at your address!</h2>
              <div className="explore-visual">
                <img src={familyPlaying} alt="Family playing with dollhouse" className="explore-image" />
              </div>
            </div>
          </section>

          {/* Expert Section */}
          <section className="expert-section">
            <div className="expert-content">
              <div className="expert-text">
                <h2>An expert at your fingertips</h2>
                <p>Get personalized moving advice from our team of experts who understand the Canadian moving landscape.</p>
              </div>
              <div className="expert-profile">
                <div className="profile-image">
                  <img src={profileAmelie} alt="Amelia Laurent" className="profile-img" />
                </div>
                <div className="profile-info">
                  <h3>Amelia Laurent</h3>
                  <p>Moving Specialist</p>
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
                <h3>Moving Tips</h3>
                <p>Essential tips for a smooth move</p>
              </div>
              <div className="blog-item">
                <img src={blogEssential} alt="Essential blog" className="blog-image" />
                <h3>Moving Essentials</h3>
                <p>What you need to know before moving</p>
              </div>
              <div className="blog-item">
                <img src={blogToronto} alt="Toronto blog" className="blog-image" />
                <h3>Toronto Moving</h3>
                <p>Moving in and around Toronto</p>
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