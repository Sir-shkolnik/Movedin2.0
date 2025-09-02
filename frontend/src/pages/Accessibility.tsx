import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

const Accessibility: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | MovedIn - Commitment to Digital Accessibility</title>
        <meta name="description" content="MovedIn is committed to making our platform accessible to all users. Learn about our accessibility features and how we ensure equal access for everyone." />
        <link rel="canonical" href="https://movedin.com/accessibility" />
        <meta property="og:title" content="Accessibility Statement | MovedIn" />
        <meta property="og:description" content="MovedIn's commitment to digital accessibility and equal access for all users." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/accessibility" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="accessibility-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="accessibility-title">Accessibility Statement</h1>
              <p className="page-subtitle">MovedIn's commitment to making our platform accessible to all users. <Link to="/about-us">Learn more about us</Link> or <Link to="/privacy-policy">view our privacy policy</Link>.</p>
            </header>

            <section className="policy-section">
              <h2>Our Commitment to Accessibility</h2>
              <p>MovedIn is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure our platform is accessible to all users.</p>
              <p>We believe that digital accessibility is not just a legal requirement but a fundamental aspect of providing excellent customer service and ensuring equal access to our moving platform for all Canadians.</p>
            </section>

            <section className="policy-section">
              <h2>Accessibility Standards</h2>
              <p>We strive to conform to the following accessibility standards:</p>
              
              <h3>Web Content Accessibility Guidelines (WCAG)</h3>
              <p>Our platform aims to meet WCAG 2.1 Level AA standards, which include:</p>
              <ul>
                <li><strong>Perceivable:</strong> Content is presented in ways that users can perceive</li>
                <li><strong>Operable:</strong> Interface components and navigation are operable</li>
                <li><strong>Understandable:</strong> Information and operation of the user interface are understandable</li>
                <li><strong>Robust:</strong> Content can be interpreted reliably by a wide variety of user agents</li>
              </ul>

              <h3>Canadian Accessibility Standards</h3>
              <p>We also comply with Canadian accessibility requirements:</p>
              <ul>
                <li><strong>Accessible Canada Act:</strong> Federal accessibility legislation</li>
                <li><strong>Provincial Standards:</strong> Ontario and other provincial accessibility laws</li>
                <li><strong>Human Rights Code:</strong> Protection against discrimination based on disability</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Accessibility Features</h2>
              <p>Our platform includes the following accessibility features:</p>
              
              <h3>Keyboard Navigation</h3>
              <ul>
                <li>All interactive elements can be accessed using keyboard navigation</li>
                <li>Logical tab order throughout the platform</li>
                <li>Keyboard shortcuts for common actions</li>
                <li>Skip navigation links for main content</li>
              </ul>

              <h3>Screen Reader Support</h3>
              <ul>
                <li>Proper heading structure and hierarchy</li>
                <li>Descriptive alt text for all images</li>
                <li>ARIA labels and landmarks for complex elements</li>
                <li>Semantic HTML markup throughout the platform</li>
              </ul>

              <h3>Visual Accessibility</h3>
              <ul>
                <li>High contrast color schemes available</li>
                <li>Resizable text without loss of functionality</li>
                <li>Clear typography and readable fonts</li>
                <li>Consistent visual design patterns</li>
              </ul>

              <h3>Form Accessibility</h3>
              <ul>
                <li>Clear labels and instructions for all form fields</li>
                <li>Error messages that are clearly identified</li>
                <li>Required field indicators</li>
                <li>Logical form flow and validation</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Assistive Technology Compatibility</h2>
              <p>Our platform is designed to work with various assistive technologies:</p>
              
              <h3>Screen Readers</h3>
              <ul>
                <li><strong>JAWS:</strong> Full compatibility with Windows screen reader</li>
                <li><strong>NVDA:</strong> Optimized for free Windows screen reader</li>
                <li><strong>VoiceOver:</strong> Full support for macOS and iOS users</li>
                <li><strong>TalkBack:</strong> Android screen reader compatibility</li>
              </ul>

              <h3>Other Assistive Technologies</h3>
              <ul>
                <li><strong>Voice Recognition:</strong> Compatible with speech-to-text software</li>
                <li><strong>Switch Devices:</strong> Support for alternative input methods</li>
                <li><strong>Magnification Software:</strong> Works with screen magnifiers</li>
                <li><strong>Braille Displays:</strong> Compatible with refreshable braille devices</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Mobile Accessibility</h2>
              <p>Our platform is fully accessible on mobile devices:</p>
              
              <h3>Touch Accessibility</h3>
              <ul>
                <li>Touch targets meet minimum size requirements (44x44 pixels)</li>
                <li>Gesture navigation alternatives available</li>
                <li>Voice control compatibility</li>
                <li>Responsive design for all screen sizes</li>
              </ul>

              <h3>Mobile Screen Readers</h3>
              <ul>
                <li>Full VoiceOver support on iOS devices</li>
                <li>Complete TalkBack compatibility on Android</li>
                <li>Optimized touch navigation for screen reader users</li>
                <li>Mobile-specific accessibility features</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Content Accessibility</h2>
              <p>We ensure all content is accessible to users with disabilities:</p>
              
              <h3>Text and Typography</h3>
              <ul>
                <li>Readable font sizes and line spacing</li>
                <li>High contrast text against backgrounds</li>
                <li>Clear, simple language and writing style</li>
                <li>Consistent text formatting throughout</li>
              </ul>

              <h3>Images and Media</h3>
              <ul>
                <li>Descriptive alt text for all images</li>
                <li>Captions and transcripts for video content</li>
                <li>Audio descriptions for visual content</li>
                <li>Meaningful icons with text labels</li>
              </ul>

              <h3>Links and Navigation</h3>
              <ul>
                <li>Descriptive link text that makes sense out of context</li>
                <li>Clear navigation structure and breadcrumbs</li>
                <li>Consistent navigation patterns</li>
                <li>Skip links for main content areas</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Ongoing Accessibility Improvements</h2>
              <p>We are committed to continuously improving accessibility:</p>
              
              <h3>Regular Audits</h3>
              <ul>
                <li>Automated accessibility testing on all new features</li>
                <li>Manual testing with assistive technologies</li>
                <li>User testing with people who have disabilities</li>
                <li>Regular accessibility reviews and updates</li>
              </ul>

              <h3>Training and Awareness</h3>
              <ul>
                <li>Staff training on accessibility best practices</li>
                <li>Accessibility guidelines for content creators</li>
                <li>Regular updates on accessibility standards</li>
                <li>Integration of accessibility into development processes</li>
              </ul>

              <h3>Feedback and Testing</h3>
              <ul>
                <li>User feedback collection on accessibility issues</li>
                <li>Testing with various assistive technologies</li>
                <li>Collaboration with accessibility experts</li>
                <li>Continuous monitoring and improvement</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Known Limitations</h2>
              <p>While we strive for full accessibility, we acknowledge some current limitations:</p>
              
              <h3>Third-Party Content</h3>
              <ul>
                <li>Some third-party integrations may have accessibility limitations</li>
                <li>External links may not meet our accessibility standards</li>
                <li>Partner websites may have different accessibility levels</li>
              </ul>

              <h3>Technical Constraints</h3>
              <ul>
                <li>Some advanced features may have accessibility challenges</li>
                <li>Legacy content may not fully meet current standards</li>
                <li>Certain interactive elements may require alternative access methods</li>
              </ul>

              <p>We are actively working to address these limitations and improve accessibility across all aspects of our platform.</p>
            </section>

            <section className="policy-section">
              <h2>Reporting Accessibility Issues</h2>
              <p>We welcome feedback on accessibility issues and suggestions for improvement:</p>
              
              <h3>How to Report Issues</h3>
              <ul>
                <li><strong>Email:</strong> accessibility@movedin.com</li>
                <li><strong>Phone:</strong> +1 (437) 979-3830</li>
                <li><strong>Online Form:</strong> Use our accessibility feedback form</li>
                <li><strong>Customer Support:</strong> Contact our general support team</li>
              </ul>

              <h3>Information to Include</h3>
              <ul>
                <li>Description of the accessibility issue</li>
                <li>Steps to reproduce the problem</li>
                <li>Assistive technology being used</li>
                <li>Browser and device information</li>
                <li>Your contact information for follow-up</li>
              </ul>

              <h3>Response Timeline</h3>
              <p>We commit to responding to accessibility reports within 48 hours and providing regular updates on resolution progress.</p>
            </section>

            <section className="policy-section">
              <h2>Alternative Access Methods</h2>
              <p>If you experience accessibility barriers, we offer alternative ways to access our services:</p>
              
              <h3>Phone Support</h3>
              <ul>
                <li>Complete quote process over the phone</li>
                <li>Direct booking assistance</li>
                <li>Payment processing support</li>
                <li>24/7 customer service availability</li>
              </ul>

              <h3>Email Support</h3>
              <ul>
                <li>Detailed quote requests via email</li>
                <li>Document submission and processing</li>
                <li>Booking confirmations and updates</li>
                <li>General inquiries and support</li>
              </ul>

              <h3>In-Person Assistance</h3>
              <ul>
                <li>Local office visits by appointment</li>
                <li>Face-to-face consultation services</li>
                <li>Document review and assistance</li>
                <li>Personalized moving planning support</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Accessibility Training and Resources</h2>
              <p>We provide resources to help users navigate our platform effectively:</p>
              
              <h3>User Guides</h3>
              <ul>
                <li>Step-by-step accessibility tutorials</li>
                <li>Assistive technology setup guides</li>
                <li>Keyboard navigation instructions</li>
                <li>Mobile accessibility tips</li>
              </ul>

              <h3>Video Tutorials</h3>
              <ul>
                <li>Accessible video content with captions</li>
                <li>Screen reader demonstration videos</li>
                <li>Mobile accessibility walkthroughs</li>
                <li>Feature-specific accessibility guides</li>
              </ul>

              <h3>Support Documentation</h3>
              <ul>
                <li>Frequently asked accessibility questions</li>
                <li>Troubleshooting guides</li>
                <li>Contact information for accessibility support</li>
                <li>Accessibility feature announcements</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Compliance and Certification</h2>
              <p>Our accessibility efforts are supported by:</p>
              
              <h3>Standards Compliance</h3>
              <ul>
                <li>WCAG 2.1 Level AA compliance</li>
                <li>Canadian accessibility law compliance</li>
                <li>International accessibility standards</li>
                <li>Industry best practices</li>
              </ul>

              <h3>Regular Audits</h3>
              <ul>
                <li>Annual accessibility assessments</li>
                <li>Third-party accessibility testing</li>
                <li>User experience evaluations</li>
                <li>Compliance monitoring and reporting</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>Contact Information</h2>
              <p>For accessibility-related questions, concerns, or feedback, please contact us:</p>
              
              <div className="contact-info">
                <p><strong>Accessibility Team:</strong> <a href="mailto:accessibility@movedin.com">accessibility@movedin.com</a></p>
                <p><strong>General Support:</strong> <a href="mailto:support@movedin.com">support@movedin.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+1-437-979-3830">+1 (437) 979-3830</a></p>
                <p><strong>Address:</strong> Ontario, Canada</p>
              </div>
              
              <p>We are committed to responding to all accessibility inquiries promptly and providing the support you need to access our services effectively.</p>
            </section>

            <section className="policy-section">
              <h2>Effective Date</h2>
              <p>This Accessibility Statement is effective as of September 1, 2025, and was last updated on that date.</p>
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
                
                <Link to="/cookie-policy" className="related-link">
                  <h3>Cookie Policy</h3>
                  <p>Information about how we use cookies and tracking technologies</p>
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

export default Accessibility; 