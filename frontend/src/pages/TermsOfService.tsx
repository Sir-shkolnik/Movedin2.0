import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

const TermsOfService: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | MovedIn - Platform Terms and Conditions</title>
        <meta name="description" content="Read MovedIn's terms of service. Our platform terms and conditions govern the use of our moving services and ensure a fair experience for all users." />
        <meta name="keywords" content="terms of service, moving platform terms, MovedIn terms, legal agreement, moving services Canada" />
        <link rel="canonical" href="https://movedin.com/terms-of-service" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Terms of Service | MovedIn - Platform Terms and Conditions" />
        <meta property="og:description" content="Read MovedIn's terms of service. Our platform terms and conditions govern the use of our moving services and ensure a fair experience for all users." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/terms-of-service" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-terms.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service | MovedIn" />
        <meta name="twitter:description" content="Read MovedIn's terms of service and platform terms." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-terms.jpg" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MovedIn" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "description": "MovedIn's terms of service and platform terms and conditions",
            "url": "https://movedin.com/terms-of-service",
            "mainEntity": {
              "@type": "Service",
              "name": "MovedIn Moving Platform",
              "provider": {
                "@type": "Organization",
                "name": "MovedIn",
                "url": "https://movedin.com",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "CA",
                  "addressRegion": "Ontario"
                }
              },
              "areaServed": {
                "@type": "Country",
                "name": "Canada"
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "MovedIn",
              "url": "https://movedin.com"
            },
            "dateModified": "2025-09-01"
          })}
        </script>
      </Helmet>
    <Header />
      <main className="page-container" aria-labelledby="terms-title">
      <div className="page-content">
        <article className="page-card">
            <header>
              <h1 id="terms-title">Terms of Service</h1>
              <p className="page-subtitle">Our platform terms and conditions that govern the use of MovedIn services. <Link to="/about-us">Learn more about us</Link> or <Link to="/privacy-policy">view our privacy policy</Link>.</p>
            </header>
            
            <section className="policy-section">
              <h2>Acceptance of Terms</h2>
              <p>By accessing and using the MovedIn platform and services, you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.</p>
              <p>These Terms constitute a legally binding agreement between you and MovedIn ("we," "our," or "us") regarding your use of our moving platform.</p>
            </section>

            <section className="policy-section">
              <h2>Service Description</h2>
              <p>MovedIn is a technology platform that connects customers with verified, licensed moving companies across Canada. Our services include:</p>
              <ul>
                <li><strong>Quote Generation:</strong> Providing instant moving quotes from multiple verified moving companies</li>
                <li><strong>Booking Management:</strong> Facilitating the booking and payment process for moving services</li>
                <li><strong>Customer Support:</strong> Providing assistance throughout the moving process</li>
                <li><strong>Platform Access:</strong> Access to our website, mobile applications, and related services</li>
              </ul>
              <p>We do not provide moving services directly but act as an intermediary between customers and moving companies.</p>
            </section>

            <section className="policy-section">
              <h2>User Eligibility</h2>
              <p>To use our services, you must:</p>
              <ul>
                <li>Be at least 18 years old and have the legal capacity to enter into contracts</li>
                <li>Provide accurate, current, and complete information when using our platform</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use our services for any illegal or unauthorized purpose</li>
                <li>Not interfere with or disrupt the operation of our platform</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Account Registration and Security</h2>
              <p>When you create an account with MovedIn, you are responsible for:</p>
              <ul>
                <li><strong>Account Security:</strong> Maintaining the confidentiality of your account credentials</li>
                <li><strong>Accurate Information:</strong> Providing and updating accurate, current information</li>
                <li><strong>Account Activity:</strong> All activities that occur under your account</li>
                <li><strong>Notification:</strong> Immediately notifying us of any unauthorized use of your account</li>
              </ul>
              <p>We reserve the right to terminate or suspend accounts that violate these Terms or engage in fraudulent activities.</p>
            </section>

            <section className="policy-section">
              <h2>Service Booking and Payment</h2>
              <h3>Booking Process</h3>
              <p>When you book a moving service through our platform:</p>
              <ul>
                <li>You agree to the terms and pricing provided by the selected moving company</li>
                <li>We facilitate the payment process through secure payment processors</li>
                <li>A deposit is required to confirm your booking</li>
                <li>The remaining balance is due upon completion of the move</li>
              </ul>

              <h3>Payment Terms</h3>
              <p>All payments are processed securely through Stripe, our payment processor:</p>
              <ul>
                <li>Deposits are non-refundable unless the moving company cancels the service</li>
                <li>Payment amounts are clearly displayed before confirmation</li>
                <li>Additional charges may apply for extra services or changes to the original quote</li>
                <li>All prices are in Canadian Dollars (CAD) unless otherwise specified</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Moving Company Relationships</h2>
              <p>MovedIn partners with independent moving companies that are:</p>
              <ul>
                <li><strong>Licensed and Insured:</strong> All partners must maintain proper licensing and insurance</li>
                <li><strong>Verified:</strong> We conduct background checks and verify credentials</li>
                <li><strong>Quality Standards:</strong> Partners must meet our service quality standards</li>
                <li><strong>Independent Contractors:</strong> Moving companies are not our employees or agents</li>
              </ul>
              <p>While we strive to partner with reliable companies, we are not responsible for the actions, omissions, or quality of service provided by moving companies.</p>
            </section>

            <section className="policy-section">
              <h2>User Responsibilities</h2>
              <p>As a user of our platform, you agree to:</p>
              <ul>
                <li><strong>Accurate Information:</strong> Provide truthful and accurate information about your move</li>
                <li><strong>Cooperation:</strong> Cooperate with moving companies and our support team</li>
                <li><strong>Property Preparation:</strong> Prepare your property and belongings for the move</li>
                <li><strong>Payment:</strong> Pay for services as agreed upon</li>
                <li><strong>Communication:</strong> Maintain open communication throughout the moving process</li>
                <li><strong>Compliance:</strong> Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Provide false, misleading, or fraudulent information</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the operation of our platform</li>
                <li>Use our services to harass, abuse, or harm others</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to reverse engineer or copy our platform</li>
                <li>Use automated systems to access our services without permission</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Intellectual Property</h2>
              <p>All content, features, and functionality on our platform are owned by MovedIn and are protected by Canadian and international copyright, trademark, and other intellectual property laws.</p>
              <p>You may not:</p>
              <ul>
                <li>Copy, reproduce, distribute, or create derivative works from our content</li>
                <li>Use our trademarks or service marks without written permission</li>
                <li>Remove or alter any copyright, trademark, or other proprietary notices</li>
                <li>Use our content for commercial purposes without authorization</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Privacy and Data Protection</h2>
              <p>Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <Link to="/privacy-policy">Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>
              <p>By using our services, you consent to the collection and use of your information as described in our Privacy Policy.</p>
            </section>

            <section className="policy-section">
              <h2>Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, MovedIn shall not be liable for:</p>
              <ul>
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from the use of our platform or services</li>
                <li>Actions or omissions of moving companies or third-party service providers</li>
                <li>Events beyond our reasonable control</li>
              </ul>
              <p>Our total liability to you for any claims arising from these Terms or our services shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>
            </section>

            <section className="policy-section">
              <h2>Disclaimers</h2>
              <p>Our services are provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to:</p>
              <ul>
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that our services will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy or reliability of information provided</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p>We do not guarantee the quality, safety, or reliability of moving services provided by our partners.</p>
            </section>

            <section className="policy-section">
              <h2>Indemnification</h2>
              <p>You agree to indemnify and hold harmless MovedIn, its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from:</p>
              <ul>
                <li>Your use of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Your interaction with moving companies or other users</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Termination</h2>
              <p>We may terminate or suspend your access to our services at any time, with or without cause, including but not limited to:</p>
              <ul>
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activities</li>
                <li>Non-payment of fees</li>
                <li>Discontinuation of our services</li>
              </ul>
              <p>Upon termination, your right to use our services will cease immediately, and we may delete your account and related information.</p>
            </section>

            <section className="policy-section">
              <h2>Dispute Resolution</h2>
              <p>Any disputes arising from these Terms or our services shall be resolved through the following process:</p>
              <ol>
                <li><strong>Direct Communication:</strong> First, contact our customer support team to attempt resolution</li>
                <li><strong>Mediation:</strong> If direct communication fails, we may suggest mediation services</li>
                <li><strong>Legal Action:</strong> As a last resort, legal action may be pursued in the courts of Ontario, Canada</li>
              </ol>
              <p>These Terms are governed by the laws of Ontario, Canada, and any legal proceedings shall be brought in the courts of Ontario.</p>
            </section>

            <section className="policy-section">
            <h2>Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our platform. We will notify you of material changes by:</p>
              <ul>
                <li>Posting a notice on our website</li>
                <li>Sending you an email notification</li>
                <li>Displaying a prominent notice when you log in</li>
              </ul>
              <p>Your continued use of our services after any changes indicates your acceptance of the modified Terms.</p>
            </section>

            <section className="policy-section">
              <h2>Contact Information</h2>
              <p>If you have questions about these Terms of Service, please contact us:</p>
              
              <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:support@movedin.com">support@movedin.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+1-437-979-3830">+1 (437) 979-3830</a></p>
                <p><strong>Address:</strong> Ontario, Canada</p>
              </div>
            </section>

            <section className="policy-section">
              <h2>Effective Date</h2>
              <p>These Terms of Service are effective as of September 1, 2025, and were last updated on that date.</p>
            </section>

            <section className="related-links">
              <h2>Related Information</h2>
              <div className="links-grid">
                <Link to="/privacy-policy" className="related-link">
                  <h3>Privacy Policy</h3>
                  <p>How we collect, use, and protect your personal information</p>
                </Link>
                
                <Link to="/cookie-policy" className="related-link">
                  <h3>Cookie Policy</h3>
                  <p>Information about how we use cookies and tracking technologies</p>
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

export default TermsOfService; 