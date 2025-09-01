import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// Using AboutUs styling for consistency

const Accessibility: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | MovedIn - Commitment to Digital Accessibility</title>
        <meta name="description" content="MovedIn's commitment to digital accessibility and compliance with AODA standards. Learn about our accessibility features and how to request accommodations." />
        <meta name="keywords" content="accessibility statement, AODA compliance, digital accessibility, inclusive design, MovedIn accessibility, disability access" />
        <link rel="canonical" href="https://movedin.com/accessibility" />
        <meta property="og:title" content="Accessibility Statement | MovedIn - Digital Accessibility" />
        <meta property="og:description" content="MovedIn's commitment to digital accessibility and AODA compliance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/accessibility" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="about-page" aria-labelledby="accessibility-title">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 id="accessibility-title" className="hero-title">
              Accessibility Statement
            </h1>
            <p className="hero-subtitle">
              Last Updated: January 15, 2025 | AODA Compliant | WCAG 2.1 AA Standards
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">WCAG</span>
                <span className="stat-label">2.1 AA</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">AODA</span>
                <span className="stat-label">Compliant</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Inclusive</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="cta-button primary" onClick={() => navigate('/')}>
                Get Your Free Quote Now
              </button>
              <p className="cta-subtitle">No hidden fees • Licensed movers • Instant quotes</p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-text">
                <h2>Our Commitment to Accessibility</h2>
                <p className="story-lead">Making our platform accessible to everyone</p>
                <p>
                  MovedIn is committed to ensuring digital accessibility for people with disabilities. We are continually improving 
                  the user experience for everyone and applying the relevant accessibility standards to ensure our platform is 
                  accessible to all users, regardless of their abilities or disabilities.
                </p>
                <p>
                  This accessibility statement outlines our commitment to accessibility, the standards we follow, the features 
                  we provide, and how you can contact us if you encounter accessibility barriers or need accommodations.
                </p>
                <p>
                  <strong>Effective Date:</strong> January 15, 2025<br />
                  <strong>Last Review:</strong> January 15, 2025<br />
                  <strong>Next Review:</strong> July 15, 2025
                </p>
              </div>
              <div className="story-visual">
                <div className="moving-illustration">
                  <div className="truck-icon">♿</div>
                  <div className="route-line"></div>
                  <div className="house-icon">🌐</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <h2>Accessibility Standards & Compliance</h2>
            <p className="section-lead">
              We follow international and Canadian accessibility standards
            </p>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌍</div>
                <h3>WCAG 2.1 AA</h3>
                <p>Web Content Accessibility Guidelines 2.1 Level AA compliance for international standards.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🍁</div>
                <h3>AODA Compliance</h3>
                <p>Accessibility for Ontarians with Disabilities Act compliance for Canadian standards.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">📱</div>
                <h3>Mobile Accessibility</h3>
                <p>Full accessibility support across all devices and screen sizes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="container">
            <h2>Accessibility Features & Capabilities</h2>
            <p className="section-lead">
              Comprehensive accessibility features for all users
            </p>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Keyboard Navigation</h3>
                <p>Full keyboard access with logical tab order and clear focus indicators.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Screen Reader Support</h3>
                <p>Semantic HTML, ARIA labels, and descriptive alternative text for images.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Visual Accessibility</h3>
                <p>WCAG AA compliant color ratios and support for text scaling up to 200%.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Content Accessibility</h3>
                <p>Clear language, proper heading structure, and multiple ways to convey information.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <h2>Specific Accessibility Features</h2>
            <p className="section-lead">
              Detailed breakdown of our accessibility implementations
            </p>
            <div className="services-grid">
              <div className="service-card">
                <h3>Navigation & Structure</h3>
                <ul>
                  <li>Logical heading hierarchy and landmark regions</li>
                  <li>Skip navigation links for keyboard users</li>
                  <li>Breadcrumb navigation for orientation</li>
                  <li>Consistent navigation patterns</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Forms & Inputs</h3>
                <ul>
                  <li>Clear form labels and field descriptions</li>
                  <li>Error messages and validation feedback</li>
                  <li>Required field indicators</li>
                  <li>Logical tab order and grouping</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Media & Content</h3>
                <ul>
                  <li>Descriptive alternative text for images</li>
                  <li>Captions and transcripts for videos</li>
                  <li>High contrast mode options</li>
                  <li>Resizable text and scalable layouts</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="container">
            <h2>Testing & Compliance</h2>
            <p className="section-lead">
              Regular testing and ongoing improvement of accessibility features
            </p>
            <div className="trust-grid">
              <div className="trust-item">
                <h3>Automated Testing</h3>
                <p>Regular automated accessibility testing using industry-standard tools.</p>
              </div>
              <div className="trust-item">
                <h3>Manual Testing</h3>
                <p>Manual testing with screen readers and keyboard navigation.</p>
              </div>
              <div className="trust-item">
                <h3>User Feedback</h3>
                <p>Continuous improvement based on user feedback and accessibility reports.</p>
              </div>
              <div className="trust-item">
                <h3>Regular Audits</h3>
                <p>Quarterly accessibility audits and compliance reviews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Section */}
        <section className="success-section">
          <div className="container">
            <h2>Requesting Accommodations</h2>
            <p className="section-lead">
              We're here to help with any accessibility needs or accommodations
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Contact our accessibility team for any specific accommodations or assistance needs.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Accessibility Team</strong>
                  <span>accessibility@movedin.ca</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Report accessibility barriers or issues you encounter while using our platform.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Barrier Reporting</strong>
                  <span>24/7 support available</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Request alternative formats or communication methods for any content.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Alternative Formats</strong>
                  <span>Multiple options available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <h2>Ready to Start Your Move?</h2>
            <p>Our platform is designed to be accessible to everyone, regardless of abilities or disabilities.</p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => navigate('/')}>
                Get Your Free Quote
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/about-us')}>
                About Us
              </button>
            </div>
            <div className="trust-badges">
              <span className="badge">WCAG 2.1 AA</span>
              <span className="badge">AODA Compliant</span>
              <span className="badge">100% Inclusive</span>
              <span className="badge">24/7 Support</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Accessibility Support</h2>
            <p className="section-lead">
              Our dedicated accessibility team is here to help
            </p>
            <div className="contact-grid">
              <div className="contact-item">
                <h3>Accessibility Team</h3>
                <p>accessibility@movedin.ca</p>
                <p>Accessibility questions and accommodations</p>
              </div>
              <div className="contact-item">
                <h3>Customer Support</h3>
                <p>1-800-MOVEDIN (1-800-668-3346)</p>
                <p>General assistance and barrier reporting</p>
              </div>
              <div className="contact-item">
                <h3>Office Address</h3>
                <p>MovedIn Accessibility Office</p>
                <p>Toronto, Ontario, Canada</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default Accessibility; 