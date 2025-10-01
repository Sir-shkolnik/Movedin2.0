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

// Import NEW images for homepage
import heroIllustration from '../assets/imgs-png/img_hero-illustration-new.jpg';
import truckImage from '../assets/imgs-png/img_people-carrying-box.png';
import manWithBoxes from '../assets/imgs-png/img_moving-scene-1.jpg';
import customerService from '../assets/imgs-png/img_moving-scene-2.jpg';
import profileAmelie from '../assets/imgs-png/img_profile-Amélie.png';
import blogMoving from '../assets/imgs-png/img_moving-scene-3.jpg';
import blogEssential from '../assets/imgs-png/img_moving-scene-4.png';
import blogToronto from '../assets/imgs-png/img_blog-toronto.jpg';

// Import animated elements for hero section
import realMoversImage from '../assets/imgs-png/img_moving-scene-1.jpg';
import competitiveImage from '../assets/imgs-png/img_moving-scene-2.jpg';
import contactImage from '../assets/imgs-png/img_moving-scene-3.jpg';

// Import videos
import introVideo from '../assets/videos/video_intro.mp4';
import peopleCarryingBoxVideo from '../assets/videos/video_people-carrying-box.mp4';

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
                <button 
                  className="hero-cta-button" 
                  onClick={handleGetQuote}
                  aria-label="Get your free moving quote now - Start your move in 3 simple steps"
                  title="Click to get instant quotes from verified Canadian movers"
                >
                  Get a moving quote
                </button>
              </div>
              <div className="hero-visual">
                <img src={truckImage} alt="Moving truck illustration - professional moving services" className="hero-image" loading="lazy" />
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section className="video-section">
            <div className="video-content">
              <h2>See How We Make Moving Easy</h2>
              <p>Watch our professional movers in action, making your move stress-free and efficient.</p>
              <div className="video-container">
                <video 
                  controls 
                  poster={heroIllustration}
                  className="main-video"
                  preload="metadata"
                >
                  <source src={introVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="video-grid">
                <div className="video-item">
                  <video 
                    controls 
                    poster={truckImage}
                    className="grid-video"
                    preload="metadata"
                  >
                    <source src={peopleCarryingBoxVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <h3>Professional Moving Team</h3>
                  <p>Our experienced movers handle your belongings with care and precision.</p>
                </div>
                <div className="video-item">
                  <img src={manWithBoxes} alt="Moving process" className="video-placeholder" />
                  <h3>Efficient Packing</h3>
                  <p>We use professional techniques to pack and protect your items.</p>
                </div>
                <div className="video-item">
                  <img src={customerService} alt="Customer service" className="video-placeholder" />
                  <h3>24/7 Support</h3>
                  <p>Our team is always available to help with your moving needs.</p>
                </div>
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
          <section className="blogs-section" aria-labelledby="blogs-heading">
            <h2 id="blogs-heading">Recent blogs</h2>
            <div className="blogs-grid" role="list" aria-label="Latest moving tips and guides">
              <article className="blog-item" role="listitem">
                <a href="/blog/moving-stress-relaxation-techniques" className="blog-link" aria-label="Read: Dealing with Moving Stress - Top Relaxation Techniques">
                  <img src={blogMoving} alt="Person relaxing with moving boxes - stress reduction techniques" className="blog-image" loading="lazy" />
                  <h3>Dealing with Moving Stress: Top Relaxation Techniques</h3>
                  <p>Essential tips for a smooth move from professional movers</p>
                  <div className="blog-meta">
                    <span className="blog-author">By MovedIn Team</span>
                    <span className="blog-date">Dec 15, 2023</span>
                  </div>
                </a>
              </article>
              <article className="blog-item" role="listitem">
                <a href="/blog/essential-moving-checklist-tenants" className="blog-link" aria-label="Read: The Essential Moving Checklist for Tenants and Renters">
                  <img src={blogEssential} alt="Moving checklist items on a table - tenant moving guide" className="blog-image" loading="lazy" />
                  <h3>The Essential Moving Checklist for Tenants/renters</h3>
                  <p>What you need to know before moving to your new home</p>
                  <div className="blog-meta">
                    <span className="blog-author">By MovedIn Team</span>
                    <span className="blog-date">Dec 10, 2023</span>
                  </div>
                </a>
              </article>
              <article className="blog-item" role="listitem">
                <a href="/blog/toronto-winter-moving-tips" className="blog-link" aria-label="Read: Moving in the Winter - Special Tips for Toronto Residents">
                  <img src={blogToronto} alt="Snowy Toronto street with moving truck - winter moving tips" className="blog-image" loading="lazy" />
                  <h3>Moving in the Winter: Special Tips for Toronto Residents</h3>
                  <p>Expert advice for winter moves in and around Toronto</p>
                  <div className="blog-meta">
                    <span className="blog-author">By MovedIn Team</span>
                    <span className="blog-date">Dec 5, 2023</span>
                  </div>
                </a>
              </article>
            </div>
            <div className="blogs-cta">
              <Link to="/tips-guides" className="blogs-button" aria-label="Read all moving tips and guides">Read all</Link>
            </div>
          </section>

        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HomePage;