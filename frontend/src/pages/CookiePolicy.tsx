import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
// Using AboutUs styling for consistency

const CookiePolicy: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Cookie Policy | MovedIn - Cookie Usage & Tracking Technologies</title>
        <meta name="description" content="Learn how MovedIn uses cookies and tracking technologies to improve your experience. Our Cookie Policy explains what cookies we use and how to manage them." />
        <meta name="keywords" content="cookie policy, cookies, tracking technologies, MovedIn cookies, privacy, data collection" />
        <link rel="canonical" href="https://movedin.com/cookie-policy" />
        <meta property="og:title" content="Cookie Policy | MovedIn - Cookie Usage" />
        <meta property="og:description" content="Learn how MovedIn uses cookies and tracking technologies to improve your experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/cookie-policy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="about-page" aria-labelledby="cookie-title">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 id="cookie-title" className="hero-title">
              Cookie Policy
            </h1>
            <p className="hero-subtitle">
              Last Updated: January 15, 2025 | GDPR & PIPEDA Compliant | Transparent Cookie Usage
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">GDPR</span>
                <span className="stat-label">Compliant</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">PIPEDA</span>
                <span className="stat-label">Ready</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Transparent</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Control</span>
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
                <h2>Introduction to Cookies</h2>
                <p className="story-lead">Understanding how we use cookies to enhance your experience</p>
                <p>
                  This Cookie Policy explains how MovedIn ("we," "our," or "us") uses cookies and similar tracking technologies 
                  when you visit our website and use our moving platform. This policy is designed to help you understand what 
                  cookies are, how we use them, and how you can control them.
                </p>
                <p>
                  This policy is compliant with the <strong>General Data Protection Regulation (GDPR)</strong> and the 
                  <strong>Personal Information Protection and Electronic Documents Act (PIPEDA)</strong>. By using our website, 
                  you consent to the use of cookies as described in this policy.
                </p>
                <p>
                  <strong>Effective Date:</strong> January 15, 2025<br />
                  <strong>Last Review:</strong> January 15, 2025<br />
                  <strong>Next Review:</strong> July 15, 2025
                </p>
              </div>
              <div className="story-visual">
                <div className="moving-illustration">
                  <div className="truck-icon">🍪</div>
                  <div className="route-line"></div>
                  <div className="house-icon">🔒</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <h2>What Are Cookies?</h2>
            <p className="section-lead">
              Cookies are small text files that help us provide you with a better experience
            </p>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">📝</div>
                <h3>Text Files</h3>
                <p>Small text files stored on your device when you visit our website.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔄</div>
                <h3>Session Management</h3>
                <p>Help maintain your preferences and settings across website visits.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">📊</div>
                <h3>Analytics</h3>
                <p>Provide insights into how our website is used to improve services.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="container">
            <h2>Types of Cookies We Use</h2>
            <p className="section-lead">
              Different cookies serve different purposes to enhance your experience
            </p>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Essential Cookies</h3>
                <p>Required for basic website functionality and security features.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Performance Cookies</h3>
                <p>Help us understand how visitors use our website and improve performance.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Functional Cookies</h3>
                <p>Remember your preferences and provide personalized features.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Marketing Cookies</h3>
                <p>Help deliver relevant content and advertisements (with your consent).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <div className="container">
            <h2>How We Use Cookies</h2>
            <p className="section-lead">
              Cookies help us provide you with a seamless and personalized experience
            </p>
            <div className="services-grid">
              <div className="service-card">
                <h3>Website Functionality</h3>
                <ul>
                  <li>Maintain your login session and preferences</li>
                  <li>Remember your language and region settings</li>
                  <li>Enable shopping cart and booking functionality</li>
                  <li>Provide secure authentication and security features</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Performance & Analytics</h3>
                <ul>
                  <li>Monitor website performance and loading speeds</li>
                  <li>Analyze user behavior and navigation patterns</li>
                  <li>Identify and fix technical issues</li>
                  <li>Optimize website design and user experience</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Personalization</h3>
                <ul>
                  <li>Remember your previous searches and preferences</li>
                  <li>Provide relevant content and recommendations</li>
                  <li>Customize your dashboard and interface</li>
                  <li>Improve customer service and support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="trust-section">
          <div className="container">
            <h2>Your Cookie Choices</h2>
            <p className="section-lead">
              You have full control over how cookies are used on our website
            </p>
            <div className="trust-grid">
              <div className="trust-item">
                <h3>Browser Settings</h3>
                <p>Control cookies through your browser's privacy and security settings.</p>
              </div>
              <div className="trust-item">
                <h3>Cookie Preferences</h3>
                <p>Use our cookie preference center to manage specific cookie types.</p>
              </div>
              <div className="trust-item">
                <h3>Opt-Out Tools</h3>
                <p>Third-party opt-out tools for advertising and analytics cookies.</p>
              </div>
              <div className="trust-item">
                <h3>Contact Us</h3>
                <p>Direct contact for any questions about cookie management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Section */}
        <section className="success-section">
          <div className="container">
            <h2>Cookie Management Tools</h2>
            <p className="section-lead">
              Easy-to-use tools to manage your cookie preferences
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Our cookie preference center gives you granular control over different cookie types.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Preference Center</strong>
                  <span>Granular control available</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Browser settings allow you to block or delete cookies entirely if preferred.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Browser Control</strong>
                  <span>Full browser-level control</span>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>Third-party opt-out tools for advertising and analytics services.</p>
                </div>
                <div className="testimonial-author">
                  <strong>Third-Party Tools</strong>
                  <span>Industry-standard opt-outs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="container">
            <h2>Questions About Cookies?</h2>
            <p>We're committed to transparency about our cookie usage and your privacy choices.</p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => navigate('/')}>
                Get Your Free Quote
              </button>
              <button className="cta-button secondary" onClick={() => navigate('/about-us')}>
                About Us
              </button>
            </div>
            <div className="trust-badges">
              <span className="badge">GDPR Compliant</span>
              <span className="badge">PIPEDA Ready</span>
              <span className="badge">100% Transparent</span>
              <span className="badge">User Control</span>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Need Help with Cookies?</h2>
            <p className="section-lead">
              Our privacy team is here to help with any cookie-related questions
            </p>
            <div className="contact-grid">
              <div className="contact-item">
                <h3>Privacy Officer</h3>
                <p>privacy@movedin.ca</p>
                <p>Cookie policy and privacy questions</p>
              </div>
              <div className="contact-item">
                <h3>Technical Support</h3>
                <p>1-800-MOVEDIN (1-800-668-3346)</p>
                <p>Cookie management and technical issues</p>
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

export default CookiePolicy; 