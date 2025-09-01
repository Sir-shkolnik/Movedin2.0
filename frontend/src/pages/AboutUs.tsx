import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';
// Removed AboutUs.css import since it's now imported in index.css

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
        <meta property="og:description" content="Connect with 500+ verified moving companies across Canada. Get instant quotes and professional service." />
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
              "email": "support@movedin.com"
            }
          })}
        </script>
      </Helmet>
      <Header />
      <main className="about-page" aria-labelledby="about-title">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 id="about-title" className="hero-title">
              Canada's #1 Moving Platform
            </h1>
            <p className="hero-subtitle">
              Revolutionizing the moving industry with technology that connects you to 500+ verified, licensed movers in minutes
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
              <button className="cta-button primary" onClick={() => navigate('/#/')}>
                Get Your Free Quote Now
              </button>
              <p className="cta-subtitle">No hidden fees • Licensed movers • Instant quotes</p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-text">
                <h2>The MovedIn Story</h2>
                <p className="story-lead">
                  In 2024, we recognized that the moving industry was stuck in the past. Canadians were spending hours calling multiple moving companies, getting inconsistent quotes, and dealing with hidden fees and unreliable service.
                </p>
                <p>
                  We built MovedIn to solve these problems. Our platform connects you directly with pre-vetted, licensed moving companies that have proven track records of excellence. No more endless phone calls, no more surprise charges, no more stress about your move.
                </p>
                <p>
                  Today, we're proud to serve thousands of Canadians across the country, making moving simple, transparent, and stress-free.
                </p>
              </div>
              <div className="story-visual">
                <div className="moving-illustration">
                  <div className="truck-icon">🚛</div>
                  <div className="route-line"></div>
                  <div className="house-icon">🏠</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="mission-section">
          <div className="container">
            <h2>Our Mission & Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🎯</div>
                <h3>Transparency First</h3>
                <p>Every quote includes detailed breakdowns of labor costs, fuel surcharges, packing materials, and any additional services. No hidden fees, ever.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🛡️</div>
                <h3>Quality Assurance</h3>
                <p>We partner only with movers who meet our strict standards: licensed, insured, bonded, and with proven customer satisfaction records.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3>Speed & Efficiency</h3>
                <p>Get multiple competitive quotes in minutes, not days. Our smart matching algorithm connects you with the right movers for your specific needs.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🇨🇦</div>
                <h3>Canadian Expertise</h3>
                <p>Built for Canadians, by Canadians. We understand the unique challenges of moving across provinces, weather considerations, and local regulations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="process-section">
          <div className="container">
            <h2>How MovedIn Works</h2>
            <p className="section-lead">
              Our streamlined process eliminates the traditional moving company headaches
            </p>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Tell Us About Your Move</h3>
                <p>Enter your origin and destination addresses, move date, and home details. Our system calculates the complexity and requirements.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Get Instant Quotes</h3>
                <p>Our platform connects with verified movers in your area, providing detailed quotes with transparent pricing breakdowns.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Compare & Choose</h3>
                <p>Review detailed quotes, check mover credentials, read reviews, and select the best option for your budget and timeline.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Book & Move</h3>
                <p>Secure your move with a small deposit, and we'll coordinate everything with your chosen moving company.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <h2>Comprehensive Moving Solutions</h2>
            <p className="section-lead">
              From studio apartments to corporate relocations, we handle every type of move
            </p>
            <div className="services-grid">
              <div className="service-card">
                <h3>Residential Moves</h3>
                <ul>
                  <li>Apartment & condo relocations</li>
                  <li>House moves (local & long-distance)</li>
                  <li>Student housing transitions</li>
                  <li>Senior living relocations</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Commercial Moves</h3>
                <ul>
                  <li>Office relocations</li>
                  <li>Retail store moves</li>
                  <li>Warehouse relocations</li>
                  <li>Equipment & machinery transport</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Specialty Items</h3>
                <ul>
                  <li>Piano & musical instrument moving</li>
                  <li>Art & antique transport</li>
                  <li>Pool table disassembly & moving</li>
                  <li>Safe & heavy equipment</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Additional Services</h3>
                <ul>
                  <li>Professional packing & unpacking</li>
                  <li>Furniture disassembly & assembly</li>
                  <li>Storage solutions</li>
                  <li>Cleaning services</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="trust-section">
          <div className="container">
            <h2>Your Trust & Security</h2>
            <div className="trust-grid">
              <div className="trust-item">
                <h3>Licensed & Insured Partners</h3>
                <p>Every moving company on our platform is fully licensed, insured, and bonded. We verify credentials before allowing them to serve our customers.</p>
              </div>
              <div className="trust-item">
                <h3>Customer Protection</h3>
                <p>We provide additional insurance coverage and dispute resolution services. If something goes wrong, we're here to help make it right.</p>
              </div>
              <div className="trust-item">
                <h3>Data Security</h3>
                <p>Your personal information is encrypted and protected. We never share your data with third parties without your explicit consent.</p>
              </div>
              <div className="trust-item">
                <h3>24/7 Support</h3>
                <p>Our customer support team is available around the clock to assist with any questions or concerns about your move.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Success Section */}
        <section className="success-section">
          <div className="container">
            <h2>Customer Success Stories</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"MovedIn made our cross-country move from Toronto to Vancouver incredibly smooth. We got 5 quotes in 10 minutes and saved over $2,000!"</p>
                  <div className="testimonial-author">
                    <strong>Sarah & Mike Chen</strong>
                    <span>Toronto → Vancouver</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"The transparency was amazing. Every cost was clearly explained, and our movers were professional and careful with our antique furniture."</p>
                  <div className="testimonial-author">
                    <strong>Margaret Thompson</strong>
                    <span>Montreal → Ottawa</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"Moving a 3-bedroom house in 3 hours? MovedIn connected us with a crew that made it happen. Incredible service!"</p>
                  <div className="testimonial-author">
                    <strong>David Rodriguez</strong>
                    <span>Calgary → Edmonton</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="final-cta-section">
          <div className="container">
            <h2>Ready to Experience the MovedIn Difference?</h2>
            <p>
              Join thousands of Canadians who have simplified their moving experience. 
              Get instant quotes, compare options, and book with confidence.
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => navigate('/#/')}>
                Get Your Free Quote
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/#/how-it-works')}>
                See How It Works
              </button>
            </div>
            <div className="trust-badges">
              <span className="badge">✓ Licensed Movers</span>
              <span className="badge">✓ Insured Service</span>
              <span className="badge">✓ 24/7 Support</span>
              <span className="badge">✓ No Hidden Fees</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Get in Touch</h2>
            <p>Have questions about your move? Our team is here to help.</p>
            <div className="contact-grid">
              <div className="contact-item">
                <h3>Customer Support</h3>
                <p><strong>Email:</strong> support@movedin.com</p>
                <p><strong>Response Time:</strong> Within 2 hours</p>
              </div>
              <div className="contact-item">
                <h3>Business Inquiries</h3>
                <p><strong>Email:</strong> partnerships@movedin.com</p>
                <p><strong>For moving companies</strong> interested in joining our platform</p>
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