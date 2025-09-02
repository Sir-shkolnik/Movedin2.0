import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

const CookiePolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | MovedIn - How We Use Cookies and Tracking</title>
        <meta name="description" content="Learn how MovedIn uses cookies and tracking technologies to improve your experience. Our cookie policy explains what cookies we use and how to control them." />
        <link rel="canonical" href="https://movedin.com/cookie-policy" />
        <meta property="og:title" content="Cookie Policy | MovedIn" />
        <meta property="og:description" content="Learn how MovedIn uses cookies and tracking technologies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/cookie-policy" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="cookie-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="cookie-title">Cookie Policy</h1>
              <p className="page-subtitle">How MovedIn uses cookies and tracking technologies to enhance your experience. <Link to="/privacy-policy">View our privacy policy</Link> or <Link to="/terms-of-service">read our terms of service</Link>.</p>
            </header>

            <section className="policy-section">
              <h2>What Are Cookies?</h2>
              <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit our website. They help us provide you with a better experience by:</p>
              <ul>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing how you use our website</li>
                <li>Providing personalized content and advertisements</li>
                <li>Ensuring the security of our platform</li>
                <li>Improving website performance and functionality</li>
              </ul>
              <p>Cookies do not contain personal information that can identify you individually, but they may contain information about your browsing behavior and preferences.</p>
            </section>

            <section className="policy-section">
              <h2>Types of Cookies We Use</h2>
              
              <h3>Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly and cannot be disabled. They include:</p>
              <ul>
                <li><strong>Authentication Cookies:</strong> Keep you logged in during your session</li>
                <li><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                <li><strong>Session Cookies:</strong> Maintain your progress through the quote process</li>
                <li><strong>Load Balancing Cookies:</strong> Ensure optimal website performance</li>
              </ul>

              <h3>Analytics Cookies</h3>
              <p>These cookies help us understand how visitors use our website and improve our services:</p>
              <ul>
                <li><strong>Google Analytics:</strong> Track page views, user behavior, and website performance</li>
                <li><strong>Performance Monitoring:</strong> Identify and fix technical issues</li>
                <li><strong>User Experience Analysis:</strong> Understand how users navigate our platform</li>
                <li><strong>Conversion Tracking:</strong> Measure the effectiveness of our services</li>
              </ul>

              <h3>Functional Cookies</h3>
              <p>These cookies enhance your experience by remembering your preferences:</p>
              <ul>
                <li><strong>Language Preferences:</strong> Remember your preferred language</li>
                <li><strong>Form Data:</strong> Save your progress in multi-step forms</li>
                <li><strong>Search History:</strong> Remember your recent searches</li>
                <li><strong>Personalization:</strong> Customize content based on your preferences</li>
              </ul>

              <h3>Marketing Cookies</h3>
              <p>These cookies help us deliver relevant content and advertisements:</p>
              <ul>
                <li><strong>Retargeting:</strong> Show relevant ads based on your interests</li>
                <li><strong>Social Media Integration:</strong> Enable sharing and social features</li>
                <li><strong>Campaign Tracking:</strong> Measure the effectiveness of marketing campaigns</li>
                <li><strong>Audience Segmentation:</strong> Deliver personalized content</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Third-Party Cookies</h2>
              <p>We work with trusted third-party service providers who may also place cookies on your device:</p>
              
              <h3>Payment Processing</h3>
              <ul>
                <li><strong>Stripe:</strong> Secure payment processing and fraud prevention</li>
                <li><strong>Payment Security:</strong> Additional security measures for transactions</li>
              </ul>

              <h3>Analytics and Marketing</h3>
              <ul>
                <li><strong>Google Services:</strong> Analytics, advertising, and search functionality</li>
                <li><strong>Social Media Platforms:</strong> Facebook, Twitter, LinkedIn integration</li>
                <li><strong>Email Marketing:</strong> Campaign tracking and personalization</li>
              </ul>

              <h3>Customer Support</h3>
              <ul>
                <li><strong>Live Chat Services:</strong> Customer support and communication tools</li>
                <li><strong>Help Desk Systems:</strong> Ticket tracking and support management</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>How Long Do Cookies Last?</h2>
              <p>Cookies have different lifespans depending on their purpose:</p>
              
              <h3>Session Cookies</h3>
              <p>These cookies are temporary and are deleted when you close your browser. They are used to:</p>
              <ul>
                <li>Maintain your login session</li>
                <li>Remember your progress through forms</li>
                <li>Store temporary preferences during your visit</li>
              </ul>

              <h3>Persistent Cookies</h3>
              <p>These cookies remain on your device for a longer period, typically:</p>
              <ul>
                <li><strong>30 days:</strong> Analytics and performance cookies</li>
                <li><strong>90 days:</strong> Functional and preference cookies</li>
                <li><strong>1 year:</strong> Marketing and advertising cookies</li>
                <li><strong>2 years:</strong> Security and authentication cookies</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Managing Your Cookie Preferences</h2>
              <p>You have several options for managing cookies on our website:</p>
              
              <h3>Browser Settings</h3>
              <p>Most web browsers allow you to control cookies through their settings:</p>
              <ul>
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>

              <h3>Cookie Consent Management</h3>
              <p>When you first visit our website, you'll see a cookie consent banner that allows you to:</p>
              <ul>
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
                <li>Learn more about our cookie policy</li>
              </ul>

              <h3>Third-Party Opt-Outs</h3>
              <p>You can opt out of certain third-party cookies:</p>
              <ul>
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                <li><strong>Advertising:</strong> <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
                <li><strong>Social Media:</strong> Manage preferences in your social media account settings</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Impact of Disabling Cookies</h2>
              <p>While you can disable cookies, doing so may affect your experience on our website:</p>
              
              <h3>Essential Functionality</h3>
              <ul>
                <li>You may not be able to complete the quote process</li>
                <li>Payment processing may be affected</li>
                <li>Security features may not work properly</li>
                <li>Some website features may be unavailable</li>
              </ul>

              <h3>User Experience</h3>
              <ul>
                <li>You'll need to re-enter information on each visit</li>
                <li>Personalized content won't be available</li>
                <li>Website performance may be slower</li>
                <li>Some features may not remember your preferences</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Cookie Policy Updates</h2>
              <p>We may update this Cookie Policy from time to time to reflect:</p>
              <ul>
                <li>Changes in our cookie usage practices</li>
                <li>New third-party services we integrate</li>
                <li>Updates to privacy regulations</li>
                <li>Improvements in our website functionality</li>
              </ul>
              <p>When we make significant changes, we will:</p>
              <ul>
                <li>Update the "Last Updated" date at the bottom of this policy</li>
                <li>Display a prominent notice on our website</li>
                <li>Send email notifications to registered users</li>
                <li>Require renewed consent for significant changes</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Legal Basis for Cookie Usage</h2>
              <p>Our use of cookies is based on the following legal grounds:</p>
              
              <h3>Legitimate Interest</h3>
              <p>We use cookies for:</p>
              <ul>
                <li>Website functionality and security</li>
                <li>Performance monitoring and improvement</li>
                <li>Fraud prevention and security</li>
                <li>Service optimization and personalization</li>
              </ul>

              <h3>Consent</h3>
              <p>We obtain your consent for:</p>
              <ul>
                <li>Analytics and performance cookies</li>
                <li>Marketing and advertising cookies</li>
                <li>Non-essential functional cookies</li>
                <li>Third-party tracking cookies</li>
              </ul>

              <h3>Contract Performance</h3>
              <p>Some cookies are necessary to:</p>
              <ul>
                <li>Provide our services as agreed</li>
                <li>Process payments and transactions</li>
                <li>Maintain account security</li>
                <li>Fulfill our contractual obligations</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>International Cookie Transfers</h2>
              <p>Some of our third-party service providers may be located outside of Canada:</p>
              <ul>
                <li><strong>United States:</strong> Google, Stripe, and other technology providers</li>
                <li><strong>European Union:</strong> Some analytics and marketing services</li>
                <li><strong>Other Countries:</strong> Cloud hosting and infrastructure services</li>
              </ul>
              <p>We ensure that any international transfers comply with applicable privacy laws and provide adequate protection for your information.</p>
            </section>

            <section className="policy-section">
              <h2>Contact Us About Cookies</h2>
              <p>If you have questions about our use of cookies or would like to exercise your cookie preferences, please contact us:</p>
              
              <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:support@movedin.com">support@movedin.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+1-437-979-3830">+1 (437) 979-3830</a></p>
                <p><strong>Subject Line:</strong> "Cookie Policy Inquiry"</p>
              </div>
              
              <p>We will respond to your inquiry within 30 days and help you manage your cookie preferences.</p>
            </section>

            <section className="policy-section">
              <h2>Additional Resources</h2>
              <p>For more information about cookies and online privacy, you may find these resources helpful:</p>
              <ul>
                <li><a href="https://www.priv.gc.ca/" target="_blank" rel="noopener noreferrer">Office of the Privacy Commissioner of Canada</a></li>
                <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
                <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
                <li><a href="https://www.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Effective Date</h2>
              <p>This Cookie Policy is effective as of September 1, 2025, and was last updated on that date.</p>
            </section>

            <section className="related-links">
              <h2>Related Information</h2>
              <div className="links-grid">
                <Link to="/privacy-policy" className="related-link">
                  <h3>Privacy Policy</h3>
                  <p>How we collect, use, and protect your personal information</p>
                </Link>
                
                <Link to="/terms-of-service" className="related-link">
                  <h3>Terms of Service</h3>
                  <p>Our terms and conditions for using the MovedIn platform</p>
                </Link>
                
                <Link to="/accessibility" className="related-link">
                  <h3>Accessibility Statement</h3>
                  <p>Our commitment to making our platform accessible to all users</p>
                </Link>
                
                <Link to="/about-us" className="related-link">
                  <h3>About MovedIn</h3>
                  <p>Learn more about our company and mission</p>
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default CookiePolicy; 