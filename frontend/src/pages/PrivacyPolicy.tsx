import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// Using AboutUs styling for consistency

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MovedIn - Canadian Data Protection & Privacy</title>
        <meta name="description" content="MovedIn's comprehensive Privacy Policy compliant with PIPEDA and Canadian privacy laws. Learn how we protect your personal information and data rights." />
        <meta name="keywords" content="privacy policy Canada, PIPEDA compliance, data protection, personal information, Canadian privacy laws, MovedIn privacy" />
        <link rel="canonical" href="https://movedin.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | MovedIn - Canadian Data Protection" />
        <meta property="og:description" content="Comprehensive privacy policy compliant with PIPEDA and Canadian privacy laws. Learn how we protect your data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/privacy-policy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="about-page" aria-labelledby="privacy-title">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 id="privacy-title" className="hero-title">
              Privacy Policy
            </h1>
            <p className="hero-subtitle">
              Last Updated: January 15, 2025 | PIPEDA Compliant | Canadian Privacy Law Compliant
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">PIPEDA</span>
                <span className="stat-label">Compliant</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">GDPR</span>
                <span className="stat-label">Ready</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Secure</span>
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
                <h2>Introduction & Scope</h2>
                <p className="story-lead">Your privacy is our priority</p>
                <p>
                  MovedIn ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our moving platform 
                  and services.
                </p>
                <p>
                  This policy is compliant with the <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong> and 
                  applicable Canadian privacy laws. By using our services, you consent to the collection and use of your information as 
                  described in this policy.
                </p>
                <p>
                  <strong>Effective Date:</strong> January 15, 2025<br />
                  <strong>Last Review:</strong> January 15, 2025<br />
                  <strong>Next Review:</strong> July 15, 2025
                </p>
              </div>
              <div className="story-visual">
                <div className="moving-illustration">
                  <div className="truck-icon">🔒</div>
                  <div className="route-line"></div>
                  <div className="house-icon">🏠</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <h2>Information We Collect</h2>
            <p className="section-lead">
              We collect only the information necessary to provide you with exceptional moving services
            </p>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">👤</div>
                <h3>Personal Information</h3>
                <p>Contact details, move information, property details, and payment information processed securely via Stripe.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">📊</div>
                <h3>Usage Data</h3>
                <p>Pages visited, time spent on site, features used, and device information for service improvement.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Third-Party Data</h3>
                <p>Service confirmations, feedback, ratings, and verification information from trusted partners.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="container">
            <h2>How We Use Your Information</h2>
            <p className="section-lead">
              Your data is used exclusively to provide and improve our moving services
            </p>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Service Delivery</h3>
                <p>Providing moving quotes, processing payments, coordinating with movers, and customer support.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Platform Improvement</h3>
                <p>Analyzing usage patterns, developing new features, and conducting quality assurance.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Communication</h3>
                <p>Service updates, notifications, customer support, and marketing (with consent).</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Legal Compliance</h3>
                <p>Complying with laws, protecting rights, preventing fraud, and maintaining security.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <h2>Data Security & Protection</h2>
            <p className="section-lead">
              Enterprise-grade security measures to protect your information
            </p>
            <div className="services-grid">
              <div className="service-card">
                <h3>Encryption & Security</h3>
                <ul>
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Secure data centers with 24/7 monitoring</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication for account access</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Access Control</h3>
                <ul>
                  <li>Role-based access controls for all employees</li>
                  <li>Regular access reviews and permission audits</li>
                  <li>Secure disposal of data when no longer needed</li>
                  <li>Encrypted backups with limited access</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Compliance & Monitoring</h3>
                <ul>
                  <li>Continuous security monitoring and threat detection</li>
                  <li>Regular compliance assessments and updates</li>
                  <li>Incident response procedures and protocols</li>
                  <li>Employee security training and awareness</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="container">
            <h2>Your Privacy Rights (PIPEDA Compliance)</h2>
            <p className="section-lead">
              Under Canadian privacy law, you have comprehensive rights over your data
            </p>
            <div className="trust-grid">
              <div className="trust-item">
                <h3>Access & Correction</h3>
                <p>Request a copy of your data, correct inaccuracies, and verify what information we have about you.</p>
              </div>
              <div className="trust-item">
                <h3>Control & Consent</h3>
                <p>Withdraw consent, request data deletion, and limit how we use your information.</p>
              </div>
              <div className="trust-item">
                <h3>Data Portability</h3>
                <p>Request your data in a portable, machine-readable format for easy transfer.</p>
              </div>
              <div className="trust-item">
                <h3>Complaint Rights</h3>
                <p>File complaints with us or directly with the Privacy Commissioner of Canada.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Section */}
        <section className="success-section">
          <div className="container">
            <h2>Contact Information & Complaints</h2>
            <p className="section-lead">
              We're here to help with all your privacy questions and concerns
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>For privacy-related questions, concerns, or complaints, contact our dedicated privacy team.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Privacy Officer</strong>
                  <span>privacy@movedin.ca</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>General inquiries and support available 24/7 through our customer service team.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Customer Support</strong>
                  <span>1-800-MOVEDIN (1-800-668-3346)</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Regulatory complaints can be filed directly with the Privacy Commissioner of Canada.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Regulatory Contact</strong>
                  <span>www.priv.gc.ca</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <h2>Questions About Your Privacy?</h2>
            <p>We're committed to transparency and protecting your privacy rights. Contact us with any questions or concerns.</p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => navigate('/')}>
                Get Your Free Quote
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/about-us')}>
                About Us
              </button>
            </div>
            <div className="trust-badges">
              <span className="badge">PIPEDA Compliant</span>
              <span className="badge">Canadian Privacy Law</span>
              <span className="badge">GDPR Ready</span>
              <span className="badge">100% Secure</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Need Help?</h2>
            <p className="section-lead">
              Our privacy team is here to assist you with any questions or concerns
            </p>
            <div className="contact-grid">
              <div className="contact-item">
                <h3>Privacy Officer</h3>
                <p>privacy@movedin.ca</p>
                <p>Dedicated privacy support and compliance</p>
              </div>
              <div className="contact-item">
                <h3>Customer Support</h3>
                <p>1-800-MOVEDIN (1-800-668-3346)</p>
                <p>24/7 assistance and general inquiries</p>
              </div>
              <div className="contact-item">
                <h3>Office Address</h3>
                <p>MovedIn Privacy Office</p>
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

export default PrivacyPolicy; 