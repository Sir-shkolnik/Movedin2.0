import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>About MovedIn | Canada's Premier Moving Platform | 15,000+ Successful Moves</title>
        <meta name="description" content="Discover how MovedIn revolutionized moving in Canada. From our founding story to 15,000+ successful moves, learn why we're the trusted choice for instant quotes from 500+ verified movers." />
        <meta name="keywords" content="moving company Canada, licensed movers Toronto, Vancouver moving services, Montreal movers, Calgary moving company, professional movers, insured moving services, moving quotes Canada, residential moving, commercial moving, long distance moving, moving platform, instant moving quotes" />
        <link rel="canonical" href="https://movedin.com/about-us" />
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform | 15,000+ Successful Moves" />
        <meta property="og:description" content="Discover how MovedIn revolutionized moving in Canada. From our founding story to 15,000+ successful moves, learn why we're the trusted choice." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MovedIn" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MovedIn",
            "url": "https://movedin.com",
            "description": "Canada's premier moving platform connecting customers with licensed, insured moving companies for instant quotes and professional service",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA",
              "addressRegion": "Ontario"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@movedin.com",
              "telephone": "+1-800-MOVEDIN"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "15000"
            }
          })}
        </script>
      </Helmet>
      <Header />
      
      <main className="about-us-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🏆</span>
              <span>Canada's #1 Moving Platform</span>
            </div>
            <h1 className="hero-title">
              Revolutionizing Moving in Canada
              <span className="hero-subtitle">One Move at a Time</span>
            </h1>
            <p className="hero-description">
              We're not just another moving company – we're the platform that connects you with Canada's finest, 
              most reliable movers. From our founding vision to 15,000+ successful moves, discover why MovedIn 
              is the trusted choice for Canadians nationwide.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">15,000+</span>
                <span className="stat-label">Successful Moves</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Verified Movers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">75+</span>
                <span className="stat-label">Cities Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Customer Rating</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigate('/#/')}>
                Get Your Free Quote
              </button>
              <button className="cta-secondary" onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}>
                Our Story
              </button>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="story-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Story: From Frustration to Innovation</h2>
              <p className="section-subtitle">How a simple moving nightmare became Canada's most trusted moving platform</p>
            </div>
            
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker">2024</div>
                <div className="timeline-content">
                  <h3>The Breaking Point</h3>
                  <p>
                    Our founder, a busy professional moving across Toronto, spent weeks calling moving companies, 
                    getting inconsistent quotes, and worrying about hidden fees. The industry was broken – 
                    opaque pricing, unreliable movers, and endless phone calls.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker">2024</div>
                <div className="timeline-content">
                  <h3>The Vision</h3>
                  <p>
                    We envisioned a platform where Canadians could get instant, transparent quotes from 
                    pre-vetted, licensed movers in minutes – not weeks. A place where moving became 
                    simple, reliable, and stress-free.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker">2024</div>
                <div className="timeline-content">
                  <h3>MovedIn is Born</h3>
                  <p>
                    Built by moving industry veterans and technology experts, MovedIn launched with a 
                    simple mission: to make moving as easy as ordering takeout. Our first month saw 
                    50 successful moves, and we knew we were onto something special.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker">2025</div>
                <div className="timeline-content">
                  <h3>Today's Success</h3>
                  <p>
                    From 50 moves to 15,000+ successful relocations. From Toronto to Vancouver, 
                    from apartments to mansions, from local moves to cross-country relocations. 
                    We've become the platform Canadians trust for their most important moves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="mission-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Mission & Core Values</h2>
              <p className="section-subtitle">The principles that drive every decision we make</p>
            </div>
            
            <div className="mission-content">
              <div className="mission-statement">
                <h3>Our Mission</h3>
                <p>
                  To eliminate the stress and uncertainty from moving by providing Canadians with 
                  instant access to licensed, insured, and thoroughly vetted moving professionals. 
                  We believe everyone deserves a smooth, reliable, and transparent moving experience.
                </p>
              </div>
              
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🎯</div>
                  <h4>Customer-First Excellence</h4>
                  <p>
                    Every feature, every partnership, every decision is made with our customers in mind. 
                    We measure success by your satisfaction, not just our bottom line.
                  </p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🛡️</div>
                  <h4>Uncompromising Quality</h4>
                  <p>
                    We partner only with movers who meet our rigorous standards: licensed, insured, 
                    background-checked, and customer-approved. Quality is non-negotiable.
                  </p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🔍</div>
                  <h4>Transparency Always</h4>
                  <p>
                    No hidden fees, no surprise charges, no fine print. Every quote includes detailed 
                    breakdowns, and every service is clearly explained upfront.
                  </p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🚀</div>
                  <h4>Continuous Innovation</h4>
                  <p>
                    We're constantly improving our platform based on customer feedback, industry trends, 
                    and technological advances. Yesterday's solutions won't solve tomorrow's challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Experience the MovedIn Difference?</h2>
              <p>
                Join thousands of Canadians who have simplified their moving experience with our platform. 
                Get instant quotes, compare options, and book with confidence.
              </p>
              <div className="cta-buttons">
                <button className="cta-primary" onClick={() => navigate('/#/')}>
                  Get Your Free Quote
                </button>
                <button className="cta-secondary" onClick={() => navigate('/#/how-it-works')}>
                  How It Works
                </button>
              </div>
              <div className="cta-guarantees">
                <span>✅ No hidden fees</span>
                <span>✅ Instant quotes</span>
                <span>✅ Licensed movers</span>
                <span>✅ 24/7 support</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer onContinue={() => navigate('/#/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default AboutUs; 