import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// Using AboutUs styling for consistency

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Terms of Service | MovedIn - Moving Platform Terms & Conditions</title>
        <meta name="description" content="MovedIn's Terms of Service outline the rules, rights, and responsibilities for using our moving platform. Read our comprehensive terms and conditions." />
        <meta name="keywords" content="terms of service, terms and conditions, moving platform terms, MovedIn terms, legal agreement" />
        <link rel="canonical" href="https://movedin.com/terms-of-service" />
        <meta property="og:title" content="Terms of Service | MovedIn - Platform Terms" />
        <meta property="og:description" content="Comprehensive terms and conditions for using the MovedIn moving platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/terms-of-service" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="about-page" aria-labelledby="terms-title">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 id="terms-title" className="hero-title">
              Terms of Service
            </h1>
            <p className="hero-subtitle">
              Last Updated: January 15, 2025 | Comprehensive Platform Terms & Conditions
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Transparent</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Legal</span>
                <span className="stat-label">Compliant</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Secure</span>
                <span className="stat-label">Platform</span>
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
                <h2>Agreement to Terms</h2>
                <p className="story-lead">Clear terms for a smooth moving experience</p>
                <p>
                  These Terms of Service ("Terms") govern your use of the MovedIn platform and services. By accessing or using our platform, 
                  you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.
                </p>
                <p>
                  MovedIn ("we," "our," or "us") provides a technology platform that connects customers with licensed moving companies. 
                  We facilitate the booking process but are not a moving company ourselves.
                </p>
                <p>
                  <strong>Effective Date:</strong> January 15, 2025<br />
                  <strong>Last Review:</strong> January 15, 2025<br />
                  <strong>Next Review:</strong> July 15, 2025
                </p>
              </div>
              <div className="story-visual">
                <div className="moving-illustration">
                  <div className="truck-icon">📋</div>
                  <div className="route-line"></div>
                  <div className="house-icon">⚖️</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <h2>Platform Services & Description</h2>
            <p className="section-lead">
              Understanding what MovedIn provides and how our platform works
            </p>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🔍</div>
                <h3>Quote Generation</h3>
                <p>Instant moving quotes based on your specific requirements and location.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Vendor Matching</h3>
                <p>Connecting you with verified, licensed moving companies in your area.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💳</div>
                <h3>Payment Processing</h3>
                <p>Secure payment processing for deposits and full payments via Stripe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="container">
            <h2>User Responsibilities & Conduct</h2>
            <p className="section-lead">
              Your role in ensuring a successful moving experience
            </p>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Accurate Information</h3>
                <p>Provide truthful and complete information about your move requirements.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Timely Communication</h3>
                <p>Respond promptly to mover inquiries and maintain open communication.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Payment Obligations</h3>
                <p>Pay agreed-upon amounts on time and in accordance with payment terms.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Respectful Behavior</h3>
                <p>Treat moving crews and platform staff with respect and professionalism.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <h2>Payment Terms & Conditions</h2>
            <p className="section-lead">
              Clear understanding of payment obligations and refund policies
            </p>
            <div className="services-grid">
              <div className="service-card">
                <h3>Deposit Requirements</h3>
                <ul>
                  <li>Initial deposit required to secure your move date</li>
                  <li>Deposit amounts vary based on move complexity</li>
                  <li>Deposits are non-refundable after 24 hours</li>
                  <li>Full payment due before or on move day</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Payment Methods</h3>
                <ul>
                  <li>Credit and debit cards accepted</li>
                  <li>Secure payment processing via Stripe</li>
                  <li>Electronic invoices and receipts provided</li>
                  <li>Payment plans available for large moves</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Refund Policies</h3>
                <ul>
                  <li>24-hour grace period for deposit refunds</li>
                  <li>Weather-related cancellations fully refundable</li>
                  <li>Mover no-shows result in full refunds</li>
                  <li>Service quality issues handled case-by-case</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="container">
            <h2>Limitation of Liability</h2>
            <p className="section-lead">
              Understanding our liability and your protection
            </p>
            <div className="trust-grid">
              <div className="trust-item">
                <h3>Platform Liability</h3>
                <p>MovedIn is not liable for damages caused by moving companies or third-party services.</p>
              </div>
              <div className="trust-item">
                <h3>Service Quality</h3>
                <p>We facilitate connections but don't guarantee specific service outcomes or quality levels.</p>
              </div>
              <div className="trust-item">
                <h3>Maximum Liability</h3>
                <p>Our maximum liability is limited to the amount of fees paid for our platform services.</p>
              </div>
              <div className="trust-item">
                <h3>Force Majeure</h3>
                <p>We're not liable for delays or cancellations due to circumstances beyond our control.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Section */}
        <section className="success-section">
          <div className="container">
            <h2>Dispute Resolution</h2>
            <p className="section-lead">
              Fair and efficient ways to resolve any issues or concerns
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Direct communication with our customer service team for most issues and concerns.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Customer Service</strong>
                  <span>24/7 support available</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Mediation services available for complex disputes that can't be resolved directly.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Mediation</strong>
                  <span>Third-party neutral mediator</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Legal action as a last resort, with proper jurisdiction and venue requirements.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Legal Action</strong>
                  <span>Toronto, Ontario jurisdiction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <h2>Ready to Start Your Move?</h2>
            <p>Understanding our terms helps ensure a smooth and successful moving experience.</p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => navigate('/')}>
                Get Your Free Quote
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/about-us')}>
                About Us
              </button>
            </div>
            <div className="trust-badges">
              <span className="badge">Transparent Terms</span>
              <span className="badge">24/7 Support</span>
              <span className="badge">Legal Compliant</span>
              <span className="badge">Secure Platform</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Questions About Our Terms?</h2>
            <p className="section-lead">
              Our legal team is here to clarify any terms or conditions
            </p>
            <div className="contact-grid">
              <div className="contact-item">
                <h3>Legal Department</h3>
                <p>legal@movedin.ca</p>
                <p>Terms and legal compliance questions</p>
              </div>
              <div className="contact-item">
                <h3>Customer Support</h3>
                <p>1-800-MOVEDIN (1-800-668-3346)</p>
                <p>General questions and assistance</p>
              </div>
              <div className="contact-item">
                <h3>Office Address</h3>
                <p>MovedIn Legal Department</p>
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

export default TermsOfService; 