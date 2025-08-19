import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

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
      <main className="page-container" aria-labelledby="privacy-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="privacy-title">Privacy Policy</h1>
              <p className="page-subtitle">Last Updated: January 15, 2025 | PIPEDA Compliant | Canadian Privacy Law Compliant</p>
            </header>
            
            <div className="about-section">
              <h2>Introduction & Scope</h2>
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

            <div className="about-section">
              <h2>Information We Collect</h2>
              
              <h3>Personal Information You Provide</h3>
              <ul>
                <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                <li><strong>Move Details:</strong> Origin and destination addresses, move dates, property information</li>
                <li><strong>Property Information:</strong> Number of rooms, square footage, property type, special requirements</li>
                <li><strong>Payment Information:</strong> Payment method details, billing information (processed securely via Stripe)</li>
                <li><strong>Communication Preferences:</strong> Marketing preferences, notification settings</li>
              </ul>

              <h3>Information We Collect Automatically</h3>
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, time spent on site, features used</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Location Data:</strong> General location information for service area verification</li>
                <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, preference cookies</li>
              </ul>

              <h3>Information from Third Parties</h3>
              <ul>
                <li><strong>Moving Companies:</strong> Service completion confirmations, feedback, ratings</li>
                <li><strong>Payment Processors:</strong> Payment confirmation and transaction details</li>
                <li><strong>Public Records:</strong> Business registration and licensing information for verification</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>How We Use Your Information</h2>
              <p>We use your personal information for the following purposes:</p>
              
              <h3>Primary Service Delivery</h3>
              <ul>
                <li>Providing moving quotes and connecting you with moving companies</li>
                <li>Processing payments and managing your account</li>
                <li>Coordinating with moving companies for service delivery</li>
                <li>Providing customer support and resolving issues</li>
              </ul>

              <h3>Platform Improvement</h3>
              <ul>
                <li>Analyzing usage patterns to improve our services</li>
                <li>Developing new features and functionality</li>
                <li>Conducting research and analytics</li>
                <li>Quality assurance and service monitoring</li>
              </ul>

              <h3>Communication & Marketing</h3>
              <ul>
                <li>Sending service updates and important notifications</li>
                <li>Providing customer support and assistance</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Responding to inquiries and feedback</li>
              </ul>

              <h3>Legal & Compliance</h3>
              <ul>
                <li>Complying with applicable laws and regulations</li>
                <li>Protecting our rights and preventing fraud</li>
                <li>Responding to legal requests and investigations</li>
                <li>Maintaining security and preventing abuse</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Information Sharing & Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>
              
              <h3>Service Providers & Partners</h3>
              <ul>
                <li><strong>Moving Companies:</strong> Essential move details to facilitate your service</li>
                <li><strong>Payment Processors:</strong> Payment information for transaction processing</li>
                <li><strong>Technology Partners:</strong> Analytics and platform improvement services</li>
                <li><strong>Customer Support:</strong> Third-party support services (with confidentiality agreements)</li>
              </ul>

              <h3>Legal Requirements</h3>
              <ul>
                <li>Compliance with Canadian laws and regulations</li>
                <li>Response to valid legal requests and court orders</li>
                <li>Protection of rights, property, and safety</li>
                <li>Investigation of potential violations or fraud</li>
              </ul>

              <h3>Business Transfers</h3>
              <ul>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>During bankruptcy proceedings or business restructuring</li>
                <li>With your explicit consent for specific purposes</li>
              </ul>

              <p><strong>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</strong></p>
            </div>

            <div className="about-section">
              <h2>Data Security & Protection</h2>
              <p>We implement comprehensive security measures to protect your personal information:</p>
              
              <h3>Technical Security Measures</h3>
              <ul>
                <li><strong>Encryption:</strong> All data transmitted and stored using industry-standard encryption (AES-256)</li>
                <li><strong>Secure Connections:</strong> HTTPS/TLS encryption for all web communications</li>
                <li><strong>Access Controls:</strong> Multi-factor authentication and role-based access management</li>
                <li><strong>Regular Security Audits:</strong> Third-party security assessments and penetration testing</li>
              </ul>

              <h3>Operational Security</h3>
              <ul>
                <li><strong>Employee Training:</strong> Regular privacy and security training for all staff</li>
                <li><strong>Data Access Logs:</strong> Comprehensive logging of all data access and modifications</li>
                <li><strong>Incident Response:</strong> Established procedures for security incident handling</li>
                <li><strong>Physical Security:</strong> Secure data centers with environmental controls</li>
              </ul>

              <h3>Data Retention & Disposal</h3>
              <ul>
                <li><strong>Retention Periods:</strong> Data retained only as long as necessary for business purposes</li>
                <li><strong>Secure Disposal:</strong> Proper deletion and destruction of data when no longer needed</li>
                <li><strong>Backup Security:</strong> Encrypted backups with limited access</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Your Privacy Rights (PIPEDA Compliance)</h2>
              <p>Under Canadian privacy law (PIPEDA), you have the following rights:</p>
              
              <h3>Access & Correction Rights</h3>
              <ul>
                <li><strong>Access Your Data:</strong> Request a copy of your personal information</li>
                <li><strong>Data Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Data Portability:</strong> Request your data in a portable, machine-readable format</li>
                <li><strong>Verification:</strong> Confirm what information we have about you</li>
              </ul>

              <h3>Control & Consent Rights</h3>
              <ul>
                <li><strong>Withdraw Consent:</strong> Opt out of marketing communications and data processing</li>
                <li><strong>Data Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Processing Restrictions:</strong> Limit how we use your information</li>
                <li><strong>Object to Processing:</strong> Object to certain types of data processing</li>
              </ul>

              <h3>How to Exercise Your Rights</h3>
              <p>To exercise any of these rights, contact us:</p>
              <ul>
                <li><strong>Email:</strong> privacy@movedin.ca</li>
                <li><strong>Phone:</strong> 1-800-MOVEDIN (1-800-668-3346)</li>
                <li><strong>Online Form:</strong> <a href="/privacy-request">Privacy Request Form</a></li>
                <li><strong>Response Time:</strong> We will respond within 30 days of receiving your request</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Cookies & Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your experience:</p>
              
              <h3>Types of Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li><strong>Performance Cookies:</strong> Analytics and performance monitoring</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Personalized content and advertising (with consent)</li>
              </ul>

              <h3>Cookie Management</h3>
              <ul>
                <li><strong>Browser Settings:</strong> Control cookies through your browser preferences</li>
                <li><strong>Opt-Out Tools:</strong> Use our cookie preference center</li>
                <li><strong>Third-Party Opt-Outs:</strong> Opt out of third-party tracking services</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>International Data Transfers</h2>
              <p>Your information may be processed in countries other than Canada:</p>
              
              <h3>Data Processing Locations</h3>
              <ul>
                <li><strong>Primary Location:</strong> Canada (Toronto, Ontario)</li>
                <li><strong>Cloud Services:</strong> United States (with adequate protection measures)</li>
                <li><strong>Support Services:</strong> Various locations with data protection agreements</li>
              </ul>

              <h3>Protection Measures</h3>
              <ul>
                <li><strong>Data Protection Agreements:</strong> Standard contractual clauses with all processors</li>
                <li><strong>Adequacy Decisions:</strong> Processing only in countries with adequate protection</li>
                <li><strong>Security Standards:</strong> Consistent security measures across all locations</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Children's Privacy</h2>
              <p>Our services are not intended for children under 13 years of age:</p>
              <ul>
                <li>We do not knowingly collect personal information from children under 13</li>
                <li>If we become aware of such information, we will delete it immediately</li>
                <li>Parents or guardians should contact us if they believe we have collected such information</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time:</p>
              <ul>
                <li><strong>Notification:</strong> We will notify you of significant changes via email or platform notice</li>
                <li><strong>Review Period:</strong> Changes will be effective 30 days after notification</li>
                <li><strong>Continued Use:</strong> Continued use of our services constitutes acceptance of changes</li>
                <li><strong>Version History:</strong> Previous versions available upon request</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Contact Information & Complaints</h2>
              <p>For privacy-related questions, concerns, or complaints:</p>
              
              <h3>Primary Contact</h3>
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

              <h3>Regulatory Complaints</h3>
              <p>If you have concerns about our privacy practices, you may also contact:</p>
              <ul>
                <li><strong>Office of the Privacy Commissioner of Canada:</strong> <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a></li>
                <li><strong>Provincial Privacy Commissioners:</strong> For province-specific privacy laws</li>
              </ul>
            </div>

            <div className="cta-section">
              <h2>Questions About Your Privacy?</h2>
              <p>We're committed to transparency and protecting your privacy rights. Contact us with any questions or concerns.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Return to Home
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/about-us">About Us</Link> | <Link to="/terms-of-service">Terms of Service</Link> | <Link to="/cookie-policy">Cookie Policy</Link>
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default PrivacyPolicy; 