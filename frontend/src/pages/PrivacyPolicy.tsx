import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | MovedIn - How We Protect Your Data</title>
        <meta name="description" content="Learn how MovedIn collects, uses, and protects your personal information. Our privacy policy ensures your data security and compliance with Canadian privacy laws." />
        <meta name="keywords" content="privacy policy, data protection, PIPEDA compliance, Canadian privacy laws, MovedIn privacy, personal information" />
        <link rel="canonical" href="https://movedin.com/privacy-policy" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Privacy Policy | MovedIn - How We Protect Your Data" />
        <meta property="og:description" content="Learn how MovedIn collects, uses, and protects your personal information. Our privacy policy ensures your data security and compliance with Canadian privacy laws." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/privacy-policy" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-privacy.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | MovedIn" />
        <meta name="twitter:description" content="Learn how MovedIn collects, uses, and protects your personal information." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-privacy.jpg" />
        
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
            "name": "Privacy Policy",
            "description": "MovedIn's privacy policy explaining how we collect, use, and protect your personal information",
            "url": "https://movedin.com/privacy-policy",
            "mainEntity": {
              "@type": "Organization",
              "name": "MovedIn",
              "url": "https://movedin.com",
              "description": "Canada's premier moving platform connecting customers with verified, licensed moving companies",
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
      <main className="page-container" aria-labelledby="privacy-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="privacy-title">Privacy Policy</h1>
              <p className="page-subtitle">How MovedIn collects, uses, and protects your personal information. <Link to="/about-us">Learn more about us</Link> or <Link to="/terms-of-service">view our terms of service</Link>.</p>
            </header>
            
            <section className="policy-section">
              <h2>Introduction</h2>
              <p>MovedIn ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our moving platform and services.</p>
              <p>This policy complies with Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation.</p>
            </section>

            <section className="policy-section">
              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                <li><strong>Move Details:</strong> Origin and destination addresses, move dates, and home specifications</li>
                <li><strong>Account Information:</strong> Username, password, and profile preferences</li>
                <li><strong>Payment Information:</strong> Credit card details and billing information (processed securely through Stripe)</li>
                <li><strong>Communication Records:</strong> Emails, chat messages, and support tickets</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we automatically collect:</p>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and navigation patterns</li>
                <li><strong>Cookies and Similar Technologies:</strong> Small data files stored on your device to enhance your experience</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li><strong>Provide Services:</strong> Process your move requests, connect you with moving companies, and facilitate payments</li>
                <li><strong>Communication:</strong> Send you updates about your move, respond to inquiries, and provide customer support</li>
                <li><strong>Improve Services:</strong> Analyze usage patterns to enhance our platform and user experience</li>
                <li><strong>Security:</strong> Protect against fraud, unauthorized access, and other security threats</li>
                <li><strong>Legal Compliance:</strong> Meet our legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Information Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              
              <h3>Service Providers</h3>
              <p>We share information with trusted third-party service providers who assist us in operating our platform:</p>
              <ul>
                <li><strong>Moving Companies:</strong> Your move details are shared with selected moving companies to provide quotes and services</li>
                <li><strong>Payment Processors:</strong> Stripe processes your payments securely</li>
                <li><strong>Email Services:</strong> We use email services to send notifications and updates</li>
                <li><strong>Analytics Providers:</strong> We use analytics tools to understand website usage and improve our services</li>
              </ul>

              <h3>Legal Requirements</h3>
              <p>We may disclose your information when required by law, court order, or government request, or to protect our rights, property, or safety.</p>
            </section>

            <section className="policy-section">
              <h2>Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
              <ul>
                <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using SSL/TLS</li>
                <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                <li><strong>Regular Security Audits:</strong> We conduct regular security assessments and updates</li>
                <li><strong>Secure Payment Processing:</strong> Payment information is processed securely through Stripe's PCI DSS compliant systems</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Data Retention</h2>
              <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy:</p>
              <ul>
                <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after deactivation</li>
                <li><strong>Move Records:</strong> Kept for legal and business purposes, typically for 7 years</li>
                <li><strong>Payment Information:</strong> Retained as required by financial regulations and for customer service purposes</li>
                <li><strong>Communication Records:</strong> Kept for customer service and legal compliance purposes</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Your Rights and Choices</h2>
              <p>Under Canadian privacy laws, you have the following rights regarding your personal information:</p>
              
              <h3>Access and Correction</h3>
              <p>You can request access to your personal information and ask us to correct any inaccuracies.</p>
              
              <h3>Withdrawal of Consent</h3>
              <p>You can withdraw your consent for certain uses of your information at any time.</p>
              
              <h3>Data Portability</h3>
              <p>You can request a copy of your personal information in a portable format.</p>
              
              <h3>Deletion</h3>
              <p>You can request deletion of your personal information, subject to legal and business requirements.</p>
              
              <h3>Marketing Preferences</h3>
              <p>You can opt out of marketing communications while still receiving essential service updates.</p>
            </section>

            <section className="policy-section">
              <h2>Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your experience on our platform:</p>
              
              <h3>Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly and cannot be disabled.</p>
              
              <h3>Analytics Cookies</h3>
              <p>We use analytics cookies to understand how visitors use our website and improve our services.</p>
              
              <h3>Marketing Cookies</h3>
              <p>These cookies help us deliver relevant content and advertisements.</p>
              
              <p>You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our website.</p>
            </section>

            <section className="policy-section">
              <h2>Third-Party Links</h2>
              <p>Our website may contain links to third-party websites, including moving company websites and payment processors. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies before providing any personal information.</p>
            </section>

            <section className="policy-section">
              <h2>Children's Privacy</h2>
              <p>Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.</p>
            </section>

            <section className="policy-section">
              <h2>International Data Transfers</h2>
              <p>Your personal information is primarily processed and stored in Canada. However, some of our service providers may be located in other countries. We ensure that any international transfers comply with applicable privacy laws and provide adequate protection for your information.</p>
            </section>

            <section className="policy-section">
              <h2>Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:</p>
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending you an email notification</li>
                <li>Displaying a prominent notice on our platform</li>
              </ul>
              <p>Your continued use of our services after any changes indicates your acceptance of the updated policy.</p>
            </section>

            <section className="policy-section">
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
              
              <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:support@movedin.com">support@movedin.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+1-437-979-3830">+1 (437) 979-3830</a></p>
                <p><strong>Address:</strong> Ontario, Canada</p>
              </div>

              <p>We will respond to your inquiry within 30 days and address any concerns you may have about your privacy.</p>
            </section>

            <section className="policy-section">
              <h2>Complaints and Dispute Resolution</h2>
              <p>If you believe we have not handled your personal information in accordance with this policy or applicable privacy laws, you may file a complaint with us. We will investigate and respond to your complaint promptly.</p>
              
              <p>You also have the right to file a complaint with the Office of the Privacy Commissioner of Canada or your provincial privacy commissioner if you are not satisfied with our response.</p>
            </section>

            <section className="policy-section">
              <h2>Effective Date</h2>
              <p>This Privacy Policy is effective as of September 1, 2025, and was last updated on that date.</p>
            </section>

            <section className="related-links">
              <h2>Related Information</h2>
              <div className="links-grid">
                <Link to="/terms-of-service" className="related-link">
                  <h3>Terms of Service</h3>
                  <p>Our terms and conditions for using the MovedIn platform</p>
                </Link>
                
                <Link to="/cookie-policy" className="related-link">
                  <h3>Cookie Policy</h3>
                  <p>Detailed information about how we use cookies and tracking technologies</p>
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

export default PrivacyPolicy; 