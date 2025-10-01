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
          
          {/* Top Blue Bar */}
          <div className="top-blue-bar"></div>

          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-background-elements">
              <div className="floating-hexagon hex-1"></div>
              <div className="floating-hexagon hex-2"></div>
              <div className="floating-triangle tri-1"></div>
              <div className="floating-triangle tri-2"></div>
              <div className="floating-wave wave-1"></div>
              <div className="floating-wave wave-2"></div>
              <div className="floating-dot dot-1"></div>
              <div className="floating-dot dot-2"></div>
              <div className="floating-dot dot-3"></div>
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
                <img src={heroIllustration} alt="Moving truck illustration - professional moving services" className="hero-image" loading="lazy" />
              </div>
            </div>
          </section>

          {/* Trusted By Section */}
          <section className="trusted-section" aria-labelledby="trusted-heading">
            <div className="trusted-background-elements">
              <div className="floating-heart heart-1"></div>
              <div className="floating-heart heart-2"></div>
              <div className="floating-square square-1"></div>
              <div className="floating-square square-2"></div>
            </div>
            <div className="trusted-content">
              <h3 id="trusted-heading">Trusted by</h3>
              <div className="trusted-logos" role="img" aria-label="Partner moving companies logos">
                <a href="https://cargocabbie.com" target="_blank" rel="noopener noreferrer" className="trusted-logo-link">
                  <img src={logoCargoCabbie} alt="Cargo Cabbie - Licensed Moving Company" className="trusted-logo" loading="lazy" />
                </a>
                <a href="https://neweramoving.com" target="_blank" rel="noopener noreferrer" className="trusted-logo-link">
                  <img src={logoNewEra} alt="New Era Moving Services - Professional Movers" className="trusted-logo" loading="lazy" />
                </a>
                <a href="https://letsgetmoving.ca" target="_blank" rel="noopener noreferrer" className="trusted-logo-link">
                  <img src={logoLetsGetMoving} alt="Let's Get Moving - GTA Moving Specialists" className="trusted-logo" loading="lazy" />
                </a>
                <a href="https://highlevelmovers.com" target="_blank" rel="noopener noreferrer" className="trusted-logo-link">
                  <img src={logoHighLevelMovers} alt="High Level Movers - Premium Moving Services" className="trusted-logo" loading="lazy" />
                </a>
                <a href="https://bronzestarmoving.com" target="_blank" rel="noopener noreferrer" className="trusted-logo-link">
                  <img src={logoBronzeStar} alt="Bronze Star Moving - Reliable Moving Solutions" className="trusted-logo" loading="lazy" />
                </a>
              </div>
            </div>
          </section>

          {/* Feature Sections */}
          <section className="features-section" aria-labelledby="features-heading">
            <div className="features-background-elements">
              <div className="floating-pentagon pent-1"></div>
              <div className="floating-pentagon pent-2"></div>
              <div className="floating-oval oval-1"></div>
              <div className="floating-oval oval-2"></div>
              <div className="floating-arrow arrow-1"></div>
            </div>
            <div className="feature-item">
              <div className="feature-visual">
                <img src={heroIllustration} alt="One stop shop illustration showing comprehensive moving services" className="feature-image" loading="lazy" />
              </div>
              <div className="feature-content">
                <h2>One stop shop for all your moving needs</h2>
                <p>Find the right mover in your area to help you with your move, from simple truck pick-up and drop-off, to full 'white glove' service.</p>
                <button className="feature-button" onClick={handleGetQuote} aria-label="Get quote for comprehensive moving services">Get Started</button>
              </div>
            </div>

            <div className="feature-item reverse">
              <div className="feature-content">
                <h2>Competitive price guarantee</h2>
                <p>Your money is hard earned, we get it. That's why we vet the prices of all services so you don't have to.</p>
                <button className="feature-button" onClick={handleGetQuote} aria-label="Get competitive moving quotes">Get a quote</button>
              </div>
              <div className="feature-visual">
                <img src={manWithBoxes} alt="Competitive pricing illustration showing cost comparison" className="feature-image" loading="lazy" />
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-visual">
                <img src={customerService} alt="Customer service illustration showing professional movers" className="feature-image" loading="lazy" />
              </div>
              <div className="feature-content">
                <h2>Trusted movers you can rely on</h2>
                <p>We pride ourselves in working with the most reliable and trusted movers, who are always fully insured and certified, so you can rest easy.</p>
                <button className="feature-button" onClick={handleGetQuote} aria-label="Find trusted licensed movers">Find a mover</button>
              </div>
            </div>
          </section>



          {/* Explore Services Section */}
          <section className="explore-services-section">
            <div className="explore-content">
              <div className="explore-text">
                <h2>Explore the best services available at your address!</h2>
                <p>Explore Top-Tier Local Solutions: A Close Look At Premier Services Available In Your Area</p>
                <button className="explore-button" onClick={() => navigate('/tips-guides')} aria-label="View address change guides">View Address Change Guides</button>
              </div>
              <div className="explore-visual">
                <img src={blogMoving} alt="Family playing with dollhouse - exploring local services" className="explore-image" loading="lazy" />
              </div>
            </div>
          </section>

          {/* Expert Section */}
          <section className="expert-section">
            <div className="expert-content">
              <div className="expert-text">
                <h2>An expert at your fingertips</h2>
                <p>Once you've shared your relocation requirements with us, an expert booking agent will be assigned to you automatically, always free of charge!</p>
              </div>
              <div className="expert-profile">
                <div className="profile-image">
                  <img src={profileAmelie} alt="Amélie Laurent" className="profile-img" />
                </div>
                <div className="profile-info">
                  <h3>Amélie Laurent</h3>
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
                  <img src={blogMoving} alt="Person holding head in hands - stress reduction techniques" className="blog-image" loading="lazy" />
                  <h3>Dealing with Moving Stress: Top Relaxation Techniques</h3>
                  <div className="blog-meta">
                    <div className="blog-author-info">
                      <img src={profileAmelie} alt="Movedin Specialist" className="blog-author-avatar" />
                      <span className="blog-author">Movedin Specialist</span>
                    </div>
                    <span className="blog-date">18 Nov 2023</span>
                  </div>
                </a>
              </article>
              <article className="blog-item" role="listitem">
                <a href="/blog/essential-moving-checklist-tenants" className="blog-link" aria-label="Read: The Essential Moving Checklist for Torontonians">
                  <img src={blogEssential} alt="Household items on shelf - moving checklist" className="blog-image" loading="lazy" />
                  <h3>The Essential Moving Checklist for Torontonians</h3>
                  <div className="blog-meta">
                    <div className="blog-author-info">
                      <img src={profileAmelie} alt="Movedin Specialist" className="blog-author-avatar" />
                      <span className="blog-author">Movedin Specialist</span>
                    </div>
                    <span className="blog-date">18 Nov 2023</span>
                  </div>
                </a>
              </article>
              <article className="blog-item" role="listitem">
                <a href="/blog/toronto-winter-moving-tips" className="blog-link" aria-label="Read: Moving in the Winter - Special Tips for Toronto Residents">
                  <img src={blogToronto} alt="People by car trunk in snowy environment - winter moving tips" className="blog-image" loading="lazy" />
                  <h3>Moving in the Winter: Special Tips for Toronto Residents</h3>
                  <div className="blog-meta">
                    <div className="blog-author-info">
                      <img src={profileAmelie} alt="Movedin Specialist" className="blog-author-avatar" />
                      <span className="blog-author">Movedin Specialist</span>
                    </div>
                    <span className="blog-date">18 Nov 2023</span>
                  </div>
                </a>
              </article>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section" aria-labelledby="faq-heading">
            <h2 id="faq-heading">Frequently asked questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <div className="faq-question">
                  <span>What is Movedin exactly?</span>
                  <span className="faq-plus">+</span>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <span>What can a Movedin moving specialist do for me?</span>
                  <span className="faq-plus">+</span>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <span>How is this service free?</span>
                  <span className="faq-plus">+</span>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <span>How can I get started?</span>
                  <span className="faq-plus">+</span>
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-question">
                  <span>I am still shopping for a mover, how can my booking agent help?</span>
                  <span className="faq-plus">+</span>
                </div>
              </div>
            </div>
            <div className="faq-contact">
              <p>Still have questions?</p>
              <p>Can't find the answer you're looking for? Please chat to our friendly team</p>
              <button className="faq-contact-button" onClick={() => navigate('/about-us')} aria-label="Get in touch with our team">Get in touch</button>
            </div>
          </section>

        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HomePage;