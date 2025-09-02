import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>About MovedIn | Canada's Premier Moving Platform | Licensed & Insured Movers</title>
        <meta name="description" content="MovedIn connects Canadians with verified moving companies for instant quotes, transparent pricing, and professional service. Get moving quotes in minutes, not hours." />
        <meta name="keywords" content="moving company Canada, licensed movers Toronto, Vancouver moving services, Montreal movers, Calgary moving company, professional movers, insured moving services, moving quotes Canada, residential moving, commercial moving, long distance moving" />
        <link rel="canonical" href="https://movedin.com/about-us" />
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform" />
        <meta property="og:description" content="Connect with verified moving companies across Canada. Get instant quotes and professional service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MovedIn" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform" />
        <meta property="og:description" content="Connect with verified moving companies across Canada. Get instant quotes and professional service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-about.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About MovedIn | Canada's Premier Moving Platform" />
        <meta name="twitter:description" content="Connect with verified moving companies across Canada. Get instant quotes and professional service." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-about.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MovedIn",
            "url": "https://movedin.com",
            "description": "Canada's premier moving platform connecting customers with licensed, insured moving companies",
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
              "telephone": "+1-437-979-3830"
            },
            "sameAs": [
              "https://movedin.com/about-us",
              "https://movedin.com/how-it-works",
              "https://movedin.com/tips-guides"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Moving Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Residential Moving",
                    "description": "Professional residential moving services across Canada"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Commercial Moving",
                    "description": "Commercial and office relocation services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Long Distance Moving",
                    "description": "Cross-province and long-distance moving services"
                  }
                }
              ]
            },
            "areaServed": {
              "@type": "Country",
              "name": "Canada"
            },
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 43.6532,
                "longitude": -79.3832
              },
              "geoRadius": "5000000"
            }
          })}
        </script>
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="about-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="about-title">About MovedIn: Canada's Premier Moving Platform</h1>
              <p className="page-subtitle">Connecting Canadians with verified, licensed moving companies for stress-free relocations. Get instant quotes, transparent pricing, and professional service. <Link to="/how-it-works">See how it works</Link> or explore our <Link to="/tips-guides">moving tips & guides</Link>.</p>
            </header>

            {/* Company Overview Section */}
            <section className="company-overview">
              <h2>Who We Are</h2>
              <p className="section-intro">MovedIn is a Canadian technology company revolutionizing the moving industry by connecting customers with pre-vetted, licensed moving companies across the country.</p>
              
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="overview-icon">🏠</div>
                  <h3>Canadian Owned & Operated</h3>
                  <p>Based in Ontario, serving all of Canada with local expertise and understanding of Canadian moving regulations and requirements.</p>
                </div>
                
                <div className="overview-card">
                  <div className="overview-icon">🔒</div>
                  <h3>Licensed & Insured Partners</h3>
                  <p>We work exclusively with moving companies that are properly licensed, insured, and meet our strict quality standards.</p>
                </div>
                
                <div className="overview-card">
                  <div className="overview-icon">⚡</div>
                  <h3>Instant Quotes & Booking</h3>
                  <p>Get multiple quotes from verified movers in minutes, not hours. Book your move online with complete transparency.</p>
                </div>
                
                <div className="overview-card">
                  <div className="overview-icon">📱</div>
                  <h3>Modern Technology</h3>
                  <p>Our platform uses advanced technology to match you with the right moving company based on your specific needs and location.</p>
                </div>
              </div>
            </section>

            {/* Our Mission Section */}
            <section className="mission-section">
              <h2>Our Mission</h2>
              <div className="mission-content">
                <div className="mission-text">
                  <p className="mission-lead">
                    To simplify the moving experience for Canadians by providing access to reliable, professional moving services through innovative technology.
                  </p>
                  <p>
                    We believe moving should be straightforward, transparent, and stress-free. Our platform eliminates the hassle of calling multiple moving companies, getting inconsistent quotes, and dealing with hidden fees.
                  </p>
                  <p>
                    By connecting you directly with pre-vetted moving professionals, we ensure you get the best service at fair, transparent prices.
                  </p>
                </div>
                <div className="mission-image">
                  <img src="https://picsum.photos/400/300?random=about1" alt="MovedIn Mission" />
                </div>
              </div>
            </section>

            {/* How We Work Section */}
            <section className="how-we-work">
              <h2>How MovedIn Works</h2>
              <p className="section-intro">Our simple 7-step process makes moving easier than ever before.</p>
              
              <div className="process-grid">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <h3>Tell Us About Your Move</h3>
                  <p>Enter your move details including origin, destination, date, and time.</p>
                </div>
                
                <div className="process-step">
                  <div className="step-number">2</div>
                  <h3>Describe Your Home</h3>
                  <p>Tell us about your current and new home details, rooms, and special requirements.</p>
                </div>
                
                <div className="process-step">
                  <div className="step-number">3</div>
                  <h3>Choose Your Mover</h3>
                  <p>Compare quotes from multiple verified moving companies and select the best option.</p>
                </div>
                
                <div className="process-step">
                  <div className="step-number">4</div>
                  <h3>Book & Pay</h3>
                  <p>Secure your move with a small deposit and get instant confirmation.</p>
                </div>
                
                <div className="process-step">
                  <div className="step-number">5</div>
                  <h3>Move Day</h3>
                  <p>Your chosen moving company handles everything professionally and efficiently.</p>
                </div>
                
                <div className="process-step">
                  <div className="step-number">6</div>
                  <h3>Complete Payment</h3>
                  <p>Pay the remaining balance after your move is completed successfully.</p>
                </div>
              </div>
              
              <div className="cta-section">
                <Link to="/#/" className="cta-button">Start Your Move Now</Link>
                <p>Get instant quotes from verified moving companies</p>
              </div>
            </section>

            {/* Partner Companies Section */}
            <section className="partners-section">
              <h2>Our Moving Company Partners</h2>
              <p className="section-intro">We work with major moving companies across Canada, ensuring you have access to the best service providers in your area.</p>
              
              <div className="partners-grid">
                <div className="partner-card">
                  <h3>Let's Get Moving</h3>
                  <p>National moving company with coverage across 8 provinces, offering dynamic pricing and professional service.</p>
                  <span className="partner-coverage">National Coverage</span>
                </div>
                
                <div className="partner-card">
                  <h3>Easy2Go Moving</h3>
                  <p>GTA-based moving company specializing in residential and commercial moves with weight-based pricing.</p>
                  <span className="partner-coverage">GTA & Surrounding Areas</span>
                </div>
                
                <div className="partner-card">
                  <h3>Velocity Movers</h3>
                  <p>Premium moving services in GTA West and Southwestern Ontario, known for exceptional customer service.</p>
                  <span className="partner-coverage">GTA West & Southwestern Ontario</span>
                </div>
                
                <div className="partner-card">
                  <h3>Pierre & Sons</h3>
                  <p>Toronto core moving company offering hourly rates and distance-based services for local moves.</p>
                  <span className="partner-coverage">Toronto Core & Eastern Ontario</span>
                </div>
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us">
              <h2>Why Choose MovedIn?</h2>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <h3>Verified Moving Companies</h3>
                  <p>All our partners are licensed, insured, and meet strict quality standards.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <h3>Transparent Pricing</h3>
                  <p>No hidden fees or surprise charges. Get clear, upfront pricing from all movers.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <h3>Instant Quotes</h3>
                  <p>Get multiple quotes in minutes, not hours of phone calls.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🛡️</div>
                  <h3>Protected Moves</h3>
                  <p>All moves are covered by proper insurance and licensing requirements.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">📱</div>
                  <h3>Easy Online Booking</h3>
                  <p>Book your entire move online with our user-friendly platform.</p>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🇨🇦</div>
                  <h3>Canadian Focus</h3>
                  <p>Built for Canadians, understanding local regulations and moving needs.</p>
                </div>
              </div>
            </section>

            {/* Business Hours & Contact Section */}
            <section className="contact-section">
              <h2>Business Hours & Contact Information</h2>
              <div className="contact-grid">
                <div className="contact-info">
                  <h3>Business Hours</h3>
                  <div className="hours-list">
                    <div className="hour-item">
                      <span className="day">Monday - Friday:</span>
                      <span className="time">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="hour-item">
                      <span className="day">Saturday:</span>
                      <span className="time">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="hour-item">
                      <span className="day">Sunday:</span>
                      <span className="time">Closed</span>
                    </div>
                  </div>
                  <p className="hours-note">* Emergency support available outside business hours for urgent moving issues</p>
                </div>
                
                <div className="contact-details">
                  <h3>Get in Touch</h3>
                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <a href="mailto:support@movedin.com">support@movedin.com</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <a href="tel:+1-437-979-3830">+1 (437) 979-3830</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Service Area:</span>
                    <span>All of Canada</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Legal Pages Section */}
            <section className="legal-section">
              <h2>Legal Information & Policies</h2>
              <p className="section-intro">Transparency and trust are core to our business. Access all our legal documents and policies.</p>
              
              <div className="legal-grid">
                <Link to="/privacy-policy" className="legal-card">
                  <h3>Privacy Policy</h3>
                  <p>How we collect, use, and protect your personal information.</p>
                  <span className="legal-link">Read Policy →</span>
                </Link>
                
                <Link to="/terms-of-service" className="legal-card">
                  <h3>Terms of Service</h3>
                  <p>Our terms and conditions for using the MovedIn platform.</p>
                  <span className="legal-link">Read Terms →</span>
                </Link>
                
                <Link to="/cookie-policy" className="legal-card">
                  <h3>Cookie Policy</h3>
                  <p>Information about how we use cookies and tracking technologies.</p>
                  <span className="legal-link">Read Policy →</span>
                </Link>
                
                <Link to="/accessibility" className="legal-card">
                  <h3>Accessibility Statement</h3>
                  <p>Our commitment to making our platform accessible to all users.</p>
                  <span className="legal-link">Read Statement →</span>
                </Link>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="final-cta">
              <h2>Ready to Start Your Move?</h2>
              <p>Join thousands of Canadians who have already simplified their moving experience with MovedIn.</p>
              <div className="cta-buttons">
                <button className="cta-button primary" onClick={() => navigate('/#/')}>
                  Get Free Moving Quotes
                </button>
                <Link to="/how-it-works" className="cta-button secondary">
                  Learn How It Works
                </Link>
              </div>
              <p className="cta-subtitle">No hidden fees • Licensed movers • Instant quotes • Canadian owned</p>
            </section>
          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default AboutUs; 