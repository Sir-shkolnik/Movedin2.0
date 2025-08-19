import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

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
      <main className="page-container" aria-labelledby="cookie-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="cookie-title">Cookie Policy</h1>
              <p className="page-subtitle">Last Updated: January 15, 2025 | GDPR & PIPEDA Compliant</p>
            </header>
            
            <div className="about-section">
              <h2>Introduction to Cookies</h2>
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

            <div className="about-section">
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit 
                a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              
              <h3>How Cookies Work</h3>
              <ul>
                <li><strong>Storage:</strong> Cookies are stored in your web browser and contain a unique identifier</li>
                <li><strong>Transmission:</strong> They are sent back to our servers with each request to our website</li>
                <li><strong>Functionality:</strong> They help us remember your preferences and improve your experience</li>
                <li><strong>Security:</strong> They help protect your account and maintain security</li>
              </ul>

              <h3>Types of Information Cookies Collect</h3>
              <ul>
                <li><strong>Preferences:</strong> Your language, region, and display preferences</li>
                <li><strong>Authentication:</strong> Login status and session information</li>
                <li><strong>Analytics:</strong> How you use our website and which pages you visit</li>
                <li><strong>Performance:</strong> Website loading times and error information</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Types of Cookies We Use</h2>
              
              <h3>Essential Cookies (Strictly Necessary)</h3>
              <p>These cookies are essential for the website to function properly and cannot be disabled:</p>
              <ul>
                <li><strong>Authentication Cookies:</strong> Keep you logged in during your session</li>
                <li><strong>Security Cookies:</strong> Protect against fraud and maintain security</li>
                <li><strong>Session Cookies:</strong> Remember your current session and preferences</li>
                <li><strong>Load Balancing Cookies:</strong> Ensure website stability and performance</li>
              </ul>

              <h3>Performance Cookies (Analytics)</h3>
              <p>These cookies help us understand how visitors interact with our website:</p>
              <ul>
                <li><strong>Google Analytics:</strong> Track website usage and performance metrics</li>
                <li><strong>Performance Monitoring:</strong> Monitor page load times and errors</li>
                <li><strong>User Behavior:</strong> Understand how users navigate our platform</li>
                <li><strong>Conversion Tracking:</strong> Measure the effectiveness of our services</li>
              </ul>

              <h3>Functional Cookies (Preferences)</h3>
              <p>These cookies remember your choices and provide enhanced functionality:</p>
              <ul>
                <li><strong>Language Preferences:</strong> Remember your preferred language</li>
                <li><strong>Display Settings:</strong> Remember your theme and layout preferences</li>
                <li><strong>Form Data:</strong> Remember information you've entered in forms</li>
                <li><strong>Personalization:</strong> Customize content based on your preferences</li>
              </ul>

              <h3>Marketing Cookies (Advertising)</h3>
              <p>These cookies are used for advertising and marketing purposes (only with your consent):</p>
              <ul>
                <li><strong>Social Media:</strong> Enable social media sharing and integration</li>
                <li><strong>Retargeting:</strong> Show relevant advertisements on other websites</li>
                <li><strong>Campaign Tracking:</strong> Measure the effectiveness of marketing campaigns</li>
                <li><strong>Personalized Content:</strong> Show content relevant to your interests</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Specific Cookies We Use</h2>
              
              <h3>First-Party Cookies (Our Website)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Cookie Name</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Purpose</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>movedin_session</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Maintains your session and login status</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Session</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>movedin_preferences</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Stores your display and language preferences</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>1 year</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>movedin_consent</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Remembers your cookie consent preferences</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>2 years</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>movedin_csrf</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Protects against cross-site request forgery</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Third-Party Cookies (External Services)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Service</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Purpose</th>
                      <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Google Analytics</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Website analytics and performance monitoring</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy</a></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Stripe</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Payment processing and security</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy</a></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Mapbox</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>Maps and location services</td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}><a href="https://www.mapbox.com/privacy/" target="_blank" rel="noopener noreferrer">Mapbox Privacy</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="about-section">
              <h2>How We Use Cookies</h2>
              
              <h3>Website Functionality</h3>
              <ul>
                <li><strong>User Authentication:</strong> Keep you logged in and secure your account</li>
                <li><strong>Session Management:</strong> Remember your preferences during your visit</li>
                <li><strong>Form Completion:</strong> Save your progress on multi-step forms</li>
                <li><strong>Security Features:</strong> Protect against fraud and unauthorized access</li>
              </ul>

              <h3>Performance & Analytics</h3>
              <ul>
                <li><strong>Website Performance:</strong> Monitor loading times and identify issues</li>
                <li><strong>User Experience:</strong> Understand how users interact with our platform</li>
                <li><strong>Feature Usage:</strong> Track which features are most popular</li>
                <li><strong>Error Monitoring:</strong> Identify and fix technical problems</li>
              </ul>

              <h3>Personalization & Marketing</h3>
              <ul>
                <li><strong>Content Customization:</strong> Show relevant information based on your preferences</li>
                <li><strong>Marketing Campaigns:</strong> Measure the effectiveness of our advertising</li>
                <li><strong>Social Media Integration:</strong> Enable sharing and social features</li>
                <li><strong>Retargeting:</strong> Show relevant ads on other websites (with consent)</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Cookie Consent & Management</h2>
              
              <h3>Your Cookie Choices</h3>
              <p>You have several options for managing cookies:</p>
              <ul>
                <li><strong>Accept All:</strong> Allow all cookies for full functionality</li>
                <li><strong>Essential Only:</strong> Accept only necessary cookies</li>
                <li><strong>Customize:</strong> Choose which types of cookies to accept</li>
                <li><strong>Reject All:</strong> Decline non-essential cookies</li>
              </ul>

              <h3>How to Manage Cookies</h3>
              <ul>
                <li><strong>Cookie Banner:</strong> Use our cookie consent banner when you first visit</li>
                <li><strong>Settings Page:</strong> Access our cookie preferences center</li>
                <li><strong>Browser Settings:</strong> Control cookies through your web browser</li>
                <li><strong>Third-Party Opt-Outs:</strong> Use opt-out tools for specific services</li>
              </ul>

              <h3>Browser Cookie Controls</h3>
              <p>Most web browsers allow you to control cookies through their settings:</p>
              <ul>
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Data Collection & Privacy</h2>
              
              <h3>Information Collected by Cookies</h3>
              <ul>
                <li><strong>Technical Data:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, actions taken</li>
                <li><strong>Preference Data:</strong> Language, region, display settings</li>
                <li><strong>Device Data:</strong> Device identifiers and screen resolution</li>
              </ul>

              <h3>How We Use This Information</h3>
              <ul>
                <li><strong>Service Improvement:</strong> Enhance website functionality and performance</li>
                <li><strong>User Experience:</strong> Personalize content and features</li>
                <li><strong>Security:</strong> Protect against fraud and abuse</li>
                <li><strong>Analytics:</strong> Understand user behavior and preferences</li>
              </ul>

              <h3>Data Sharing</h3>
              <ul>
                <li><strong>Internal Use:</strong> Information is used internally to improve our services</li>
                <li><strong>Service Providers:</strong> Shared with trusted third-party services</li>
                <li><strong>Legal Requirements:</strong> Disclosed when required by law</li>
                <li><strong>No Sale:</strong> We do not sell cookie data to third parties</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Cookie Retention & Expiration</h2>
              
              <h3>Cookie Lifespans</h3>
              <ul>
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Temporary Cookies:</strong> Expire after a few hours or days</li>
                <li><strong>Persistent Cookies:</strong> Remain until manually deleted or expired</li>
                <li><strong>Maximum Duration:</strong> No cookies are stored longer than 2 years</li>
              </ul>

              <h3>Data Retention Policies</h3>
              <ul>
                <li><strong>Analytics Data:</strong> Retained for up to 26 months for analysis</li>
                <li><strong>Preference Data:</strong> Retained until you change or delete it</li>
                <li><strong>Security Data:</strong> Retained for security and fraud prevention</li>
                <li><strong>Marketing Data:</strong> Retained until consent is withdrawn</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>International Data Transfers</h2>
              <p>
                Some of our third-party cookie providers may process data outside of Canada:
              </p>
              
              <h3>Data Processing Locations</h3>
              <ul>
                <li><strong>Google Analytics:</strong> United States (with adequate protection)</li>
                <li><strong>Stripe:</strong> United States and European Union</li>
                <li><strong>Mapbox:</strong> United States (with adequate protection)</li>
              </ul>

              <h3>Protection Measures</h3>
              <ul>
                <li><strong>Data Protection Agreements:</strong> Standard contractual clauses with all providers</li>
                <li><strong>Adequacy Decisions:</strong> Processing only in countries with adequate protection</li>
                <li><strong>Security Standards:</strong> Consistent security measures across all locations</li>
                <li><strong>Regular Audits:</strong> Ongoing monitoring of data protection compliance</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Your Rights & Choices</h2>
              
              <h3>Cookie Consent Rights</h3>
              <p>Under GDPR and PIPEDA, you have the following rights:</p>
              <ul>
                <li><strong>Right to Consent:</strong> Give or withdraw consent for non-essential cookies</li>
                <li><strong>Right to Access:</strong> Know what cookies are used and why</li>
                <li><strong>Right to Control:</strong> Manage your cookie preferences at any time</li>
                <li><strong>Right to Object:</strong> Object to certain types of cookie processing</li>
              </ul>

              <h3>How to Exercise Your Rights</h3>
              <ul>
                <li><strong>Cookie Settings:</strong> Use our cookie preference center</li>
                <li><strong>Contact Us:</strong> Email privacy@movedin.ca with requests</li>
                <li><strong>Browser Controls:</strong> Use your browser's cookie settings</li>
                <li><strong>Third-Party Opt-Outs:</strong> Use opt-out tools for specific services</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws:
              </p>
              <ul>
                <li><strong>Notification:</strong> We will notify you of significant changes</li>
                <li><strong>Review Period:</strong> Changes will be effective 30 days after notification</li>
                <li><strong>Continued Use:</strong> Continued use constitutes acceptance of changes</li>
                <li><strong>Version History:</strong> Previous versions available upon request</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Contact Information</h2>
              <p>If you have questions about our use of cookies or this policy:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Privacy Officer:</strong> privacy@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>General Inquiries:</strong> hello@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> 1-800-MOVEDIN (1-800-668-3346)
                </div>
                <div className="contact-item">
                  <strong>Address:</strong> MovedIn Privacy Office, Toronto, Ontario, Canada
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h2>Manage Your Cookie Preferences</h2>
              <p>Take control of your privacy by managing your cookie settings.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Return to Home
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/about-us">About Us</Link> | <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link>
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default CookiePolicy; 