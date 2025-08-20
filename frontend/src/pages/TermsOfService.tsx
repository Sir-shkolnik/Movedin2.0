import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Terms of Service | MovedIn - Service Agreement & Legal Terms</title>
        <meta name="description" content="MovedIn's Terms of Service governing the use of our moving platform. Read our service agreement, user obligations, and legal terms." />
        <meta name="keywords" content="terms of service, service agreement, user agreement, legal terms, MovedIn terms, moving platform terms" />
        <link rel="canonical" href="https://movedin.com/terms-of-service" />
        <meta property="og:title" content="Terms of Service | MovedIn - Service Agreement" />
        <meta property="og:description" content="Terms of Service governing the use of MovedIn's moving platform and services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/terms-of-service" />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <Header />
      <main className="page-container" aria-labelledby="terms-title">
      <div className="page-content">
        <article className="page-card">
            <header>
              <h1 id="terms-title">Terms of Service</h1>
              <p className="page-subtitle">Last Updated: January 15, 2025 | Effective Date: January 15, 2025</p>
            </header>
            
            <div className="about-section">
              <h2>Agreement to Terms</h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Customer," or "you") 
                and MovedIn ("Company," "we," "us," or "our") regarding your use of our moving platform, website, and services 
                (collectively, the "Service").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these 
                Terms, you may not access or use our Service. These Terms apply to all users, visitors, and others who access or 
                use the Service.
              </p>
              <p>
                <strong>Important:</strong> Please read these Terms carefully before using our Service. These Terms contain important 
                information about your rights and obligations, including limitations of liability and dispute resolution procedures.
              </p>
            </div>

            <div className="about-section">
              <h2>Service Description</h2>
              <p>
                MovedIn is a technology platform that connects customers with licensed, insured moving companies. Our Service 
                includes but is not limited to:
              </p>
              <ul>
                <li>Providing instant moving quotes from verified moving companies</li>
                <li>Facilitating connections between customers and moving service providers</li>
                <li>Processing payments and managing bookings</li>
                <li>Providing customer support and dispute resolution</li>
                <li>Offering moving tips, guides, and educational content</li>
              </ul>
              
              <h3>What We Are Not</h3>
              <p>
                MovedIn is <strong>not a moving company</strong>. We do not provide moving services directly. We are a platform 
                that facilitates connections between customers and moving service providers. All actual moving services are provided 
                by independent, licensed moving companies.
              </p>
            </div>

            <div className="about-section">
              <h2>Eligibility & Account Requirements</h2>
              
              <h3>Age Requirements</h3>
              <ul>
                <li>You must be at least 18 years old to use our Service</li>
                <li>If you are under 18, you may only use our Service with parental or guardian consent</li>
                <li>By using our Service, you represent that you meet these age requirements</li>
              </ul>

              <h3>Account Registration</h3>
              <ul>
                <li>You may be required to create an account to access certain features</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3>Accuracy of Information</h3>
              <ul>
                <li>You must provide accurate, current, and complete information when using our Service</li>
                <li>You must update your information promptly if it changes</li>
                <li>Providing false or misleading information may result in account termination</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Acceptable Use & Prohibited Activities</h2>
              
              <h3>Acceptable Use</h3>
              <p>You may use our Service only for lawful purposes and in accordance with these Terms:</p>
              <ul>
                <li>Obtaining moving quotes and booking moving services</li>
                <li>Accessing educational content and moving resources</li>
                <li>Communicating with our customer support team</li>
                <li>Providing feedback and reviews about services received</li>
              </ul>

              <h3>Prohibited Activities</h3>
              <p>You agree not to use our Service to:</p>
              <ul>
                <li>Violate any applicable laws, regulations, or legal obligations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use automated systems to access our Service without permission</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to reverse engineer or compromise our platform security</li>
                <li>Use our Service for fraudulent or deceptive purposes</li>
                <li>Harass, abuse, or harm other users or our employees</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Service Availability & Modifications</h2>
              
              <h3>Service Availability</h3>
              <ul>
                <li>We strive to maintain 24/7 availability but cannot guarantee uninterrupted service</li>
                <li>Service may be temporarily unavailable due to maintenance, updates, or technical issues</li>
                <li>We are not liable for any damages resulting from service interruptions</li>
                <li>We will provide reasonable notice for scheduled maintenance when possible</li>
              </ul>

              <h3>Service Modifications</h3>
              <ul>
                <li>We reserve the right to modify, suspend, or discontinue any part of our Service</li>
                <li>We may add new features or remove existing features at our discretion</li>
                <li>We will provide reasonable notice for significant changes when possible</li>
                <li>Continued use of our Service after changes constitutes acceptance of modifications</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Payment Terms & Refund Policy</h2>
              
              <h3>Payment Processing</h3>
              <ul>
                <li>All payments are processed securely through Stripe, our payment processor</li>
                <li>We charge a $1 CAD deposit to secure your booking</li>
                <li>Full payment for moving services is made directly to the moving company</li>
                <li>All prices are quoted in Canadian Dollars (CAD) unless otherwise specified</li>
              </ul>

              <h3>Refund Policy</h3>
              <ul>
                <li><strong>Platform Fee ($1 CAD):</strong> Non-refundable once service is confirmed</li>
                <li><strong>Moving Services:</strong> Refund policies are determined by individual moving companies</li>
                <li><strong>Cancellation:</strong> Cancellation policies vary by moving company and are disclosed during booking</li>
                <li><strong>Disputes:</strong> We will assist in resolving payment disputes with moving companies</li>
              </ul>

              <h3>Price Changes</h3>
              <ul>
                <li>Moving company quotes are valid for the time period specified</li>
                <li>Prices may change due to fuel costs, seasonal demand, or other factors</li>
                <li>Final pricing is confirmed at the time of booking</li>
                <li>We are not responsible for price changes by moving companies</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>User Obligations & Responsibilities</h2>
              
              <h3>Accurate Information</h3>
              <ul>
                <li>Provide accurate and complete information about your move requirements</li>
                <li>Disclose any special circumstances or requirements that may affect pricing</li>
                <li>Ensure all information provided is current and truthful</li>
                <li>Notify us promptly of any changes to your move details</li>
              </ul>

              <h3>Compliance with Laws</h3>
              <ul>
                <li>Comply with all applicable laws and regulations</li>
                <li>Ensure you have the legal right to move from and to the specified locations</li>
                <li>Comply with any restrictions on moving certain items (e.g., hazardous materials)</li>
                <li>Obtain necessary permits or permissions for your move</li>
              </ul>

              <h3>Cooperation with Service Providers</h3>
              <ul>
                <li>Provide reasonable access to your property for moving companies</li>
                <li>Prepare your belongings according to moving company instructions</li>
                <li>Be present or available during scheduled move times</li>
                <li>Provide accurate contact information for coordination</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Limitation of Liability & Disclaimers</h2>
              
              <h3>Service Limitations</h3>
              <p>
                Our Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee:
              </p>
              <ul>
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy of quotes or pricing information</li>
                <li>Availability of moving companies in all areas</li>
                <li>Specific outcomes or results from using our Service</li>
              </ul>

              <h3>Liability Limitations</h3>
              <ul>
                <li>Our total liability to you shall not exceed the amount you paid for our Service</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>We are not liable for damages caused by moving companies or third parties</li>
                <li>We are not liable for damages resulting from force majeure events</li>
              </ul>

              <h3>Third-Party Services</h3>
              <ul>
                <li>We are not responsible for the quality of services provided by moving companies</li>
                <li>We do not guarantee the reliability or safety of third-party service providers</li>
                <li>Disputes with moving companies should be resolved directly with the service provider</li>
                <li>We will assist in dispute resolution but are not liable for third-party actions</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Intellectual Property Rights</h2>
              
              <h3>Our Intellectual Property</h3>
              <ul>
                <li>All content, features, and functionality of our Service are owned by MovedIn</li>
                <li>Our trademarks, logos, and brand elements are protected intellectual property</li>
                <li>You may not use our intellectual property without written permission</li>
                <li>Unauthorized use may result in legal action</li>
              </ul>

              <h3>User Content</h3>
              <ul>
                <li>You retain ownership of content you submit to our Service</li>
                <li>By submitting content, you grant us a license to use it for service provision</li>
                <li>You represent that you have the right to grant this license</li>
                <li>We may remove content that violates these Terms or is inappropriate</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Privacy & Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed 
                by our <Link to="/privacy-policy">Privacy Policy</Link>, which is incorporated into these Terms by reference.
              </p>
              <p>
                By using our Service, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
            </div>

            <div className="about-section">
              <h2>Termination & Account Suspension</h2>
              
              <h3>Termination by You</h3>
              <ul>
                <li>You may stop using our Service at any time</li>
                <li>You may request account deletion by contacting our support team</li>
                <li>Account deletion will remove your personal information from our systems</li>
                <li>Some information may be retained for legal or regulatory compliance</li>
              </ul>

              <h3>Termination by Us</h3>
              <ul>
                <li>We may suspend or terminate your access to our Service for violations of these Terms</li>
                <li>We may terminate accounts that are inactive for extended periods</li>
                <li>We will provide reasonable notice before terminating accounts when possible</li>
                <li>Termination does not affect your obligations under these Terms</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Dispute Resolution & Governing Law</h2>
              
              <h3>Governing Law</h3>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Province of Ontario, Canada, 
                without regard to conflict of law principles.
              </p>

              <h3>Dispute Resolution</h3>
              <ul>
                <li>We encourage resolving disputes through direct communication</li>
                <li>If direct resolution fails, disputes may be resolved through mediation</li>
                <li>Legal proceedings must be brought in courts of competent jurisdiction in Ontario</li>
                <li>You agree to submit to the personal jurisdiction of such courts</li>
            </ul>

              <h3>Class Action Waiver</h3>
              <p>
                You agree to resolve disputes individually and waive any right to participate in class action lawsuits 
                or class-wide arbitration.
              </p>
            </div>

            <div className="about-section">
            <h2>Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. When we make changes:
              </p>
              <ul>
                <li>We will post the updated Terms on our website</li>
                <li>We will update the "Last Updated" date at the top of these Terms</li>
                <li>We will notify you of significant changes via email or platform notice</li>
                <li>Continued use of our Service after changes constitutes acceptance of new Terms</li>
                <li>If you disagree with changes, you must stop using our Service</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Contact Information</h2>
              <p>If you have questions about these Terms of Service, please contact us:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Legal Department:</strong> legal@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>General Inquiries:</strong> hello@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> 1-800-MOVEDIN (1-800-668-3346)
                </div>
                <div className="contact-item">
                  <strong>Address:</strong> MovedIn Legal Department, Toronto, Ontario, Canada
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h2>Questions About These Terms?</h2>
              <p>We're here to help clarify any questions about our Terms of Service.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Return to Home
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/about-us">About Us</Link> | <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/cookie-policy">Cookie Policy</Link>
              </p>
            </div>
        </article>
      </div>
    </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
  </>
);
};

export default TermsOfService; 