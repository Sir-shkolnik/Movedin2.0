import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

const Accessibility: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | MovedIn - Commitment to Digital Accessibility</title>
        <meta name="description" content="MovedIn's commitment to digital accessibility and compliance with AODA standards. Learn about our accessibility features and how to request accommodations." />
        <meta name="keywords" content="accessibility statement, AODA compliance, digital accessibility, inclusive design, MovedIn accessibility, disability access" />
        <link rel="canonical" href="https://movedin.com/accessibility" />
        <meta property="og:title" content="Accessibility Statement | MovedIn - Digital Accessibility" />
        <meta property="og:description" content="MovedIn's commitment to digital accessibility and AODA compliance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/accessibility" />
        <meta name="robots" content="index, follow" />
      </Helmet>
    <Header />
      <main className="page-container" aria-labelledby="accessibility-title">
      <div className="page-content">
        <article className="page-card">
            <header>
              <h1 id="accessibility-title">Accessibility Statement</h1>
              <p className="page-subtitle">Last Updated: January 15, 2025 | AODA Compliant | WCAG 2.1 AA Standards</p>
            </header>
            
            <div className="about-section">
              <h2>Our Commitment to Accessibility</h2>
              <p>
                MovedIn is committed to ensuring digital accessibility for people with disabilities. We are continually improving 
                the user experience for everyone and applying the relevant accessibility standards to ensure our platform is 
                accessible to all users, regardless of their abilities or disabilities.
              </p>
              <p>
                This accessibility statement outlines our commitment to accessibility, the standards we follow, the features 
                we provide, and how you can contact us if you encounter accessibility barriers or need accommodations.
              </p>
              <p>
                <strong>Effective Date:</strong> January 15, 2025<br />
                <strong>Last Review:</strong> January 15, 2025<br />
                <strong>Next Review:</strong> July 15, 2025
              </p>
            </div>

            <div className="about-section">
              <h2>Accessibility Standards & Compliance</h2>
              
              <h3>Primary Standards</h3>
              <ul>
                <li><strong>WCAG 2.1 AA:</strong> Web Content Accessibility Guidelines 2.1 Level AA compliance</li>
                <li><strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act compliance</li>
                <li><strong>Canadian Standards:</strong> Compliance with Canadian accessibility requirements</li>
                <li><strong>International Standards:</strong> Following global accessibility best practices</li>
              </ul>

              <h3>Compliance Levels</h3>
              <ul>
                <li><strong>Level A:</strong> Basic accessibility requirements (fully compliant)</li>
                <li><strong>Level AA:</strong> Enhanced accessibility features (fully compliant)</li>
                <li><strong>Level AAA:</strong> Advanced accessibility features (partially compliant)</li>
                <li><strong>Ongoing Improvement:</strong> Continuous enhancement of accessibility features</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Accessibility Features & Capabilities</h2>
              
              <h3>Keyboard Navigation</h3>
              <ul>
                <li><strong>Full Keyboard Access:</strong> All functionality accessible via keyboard</li>
                <li><strong>Logical Tab Order:</strong> Intuitive navigation flow</li>
                <li><strong>Keyboard Shortcuts:</strong> Efficient navigation options</li>
                <li><strong>Focus Indicators:</strong> Clear visual focus indicators</li>
              </ul>

              <h3>Screen Reader Support</h3>
              <ul>
                <li><strong>Semantic HTML:</strong> Proper heading structure and landmarks</li>
                <li><strong>Alt Text:</strong> Descriptive alternative text for images</li>
                <li><strong>ARIA Labels:</strong> Enhanced screen reader descriptions</li>
                <li><strong>Form Labels:</strong> Clear form field identification</li>
              </ul>

              <h3>Visual Accessibility</h3>
              <ul>
                <li><strong>Color Contrast:</strong> WCAG AA compliant color ratios</li>
                <li><strong>Text Scaling:</strong> Support for browser text scaling up to 200%</li>
                <li><strong>Font Options:</strong> Readable, sans-serif fonts</li>
                <li><strong>Visual Indicators:</strong> Multiple ways to convey information</li>
              </ul>

              <h3>Content Accessibility</h3>
              <ul>
                <li><strong>Clear Language:</strong> Simple, understandable content</li>
                <li><strong>Logical Structure:</strong> Well-organized information hierarchy</li>
                <li><strong>Multiple Formats:</strong> Information available in various formats</li>
                <li><strong>Error Prevention:</strong> Clear error messages and validation</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Specific Accessibility Features</h2>
              
              <h3>Navigation & Structure</h3>
              <ul>
                <li><strong>Skip Links:</strong> Skip to main content and navigation</li>
                <li><strong>Breadcrumbs:</strong> Clear navigation path indicators</li>
                <li><strong>Search Functionality:</strong> Accessible search with clear results</li>
                <li><strong>Site Map:</strong> Comprehensive site structure overview</li>
              </ul>

              <h3>Forms & Interactive Elements</h3>
              <ul>
                <li><strong>Form Validation:</strong> Clear error messages and success indicators</li>
                <li><strong>Required Fields:</strong> Clearly marked required form fields</li>
                <li><strong>Error Handling:</strong> Helpful error messages and suggestions</li>
                <li><strong>Auto-complete:</strong> Smart form completion assistance</li>
              </ul>

              <h3>Multimedia & Media</h3>
              <ul>
                <li><strong>Image Descriptions:</strong> Comprehensive alt text for all images</li>
                <li><strong>Video Captions:</strong> Closed captions for video content</li>
                <li><strong>Audio Descriptions:</strong> Audio descriptions for visual content</li>
                <li><strong>Transcripts:</strong> Text transcripts for audio content</li>
              </ul>

              <h3>Mobile Accessibility</h3>
              <ul>
                <li><strong>Responsive Design:</strong> Accessible on all device sizes</li>
                <li><strong>Touch Targets:</strong> Adequate size for touch interaction</li>
                <li><strong>Gesture Support:</strong> Alternative to complex gestures</li>
                <li><strong>Orientation Support:</strong> Works in all device orientations</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Browser & Technology Support</h2>
              
              <h3>Supported Browsers</h3>
              <ul>
                <li><strong>Chrome:</strong> Latest versions with accessibility features</li>
                <li><strong>Firefox:</strong> Full accessibility support and customization</li>
                <li><strong>Safari:</strong> Native accessibility features support</li>
                <li><strong>Edge:</strong> Modern accessibility standards compliance</li>
              </ul>

              <h3>Assistive Technologies</h3>
              <ul>
                <li><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver, TalkBack</li>
                <li><strong>Magnification Software:</strong> ZoomText, Windows Magnifier</li>
                <li><strong>Voice Recognition:</strong> Dragon NaturallySpeaking, built-in OS tools</li>
                <li><strong>Switch Devices:</strong> Support for alternative input methods</li>
              </ul>

              <h3>Mobile Accessibility</h3>
              <ul>
                <li><strong>iOS Accessibility:</strong> VoiceOver, Zoom, Dynamic Type</li>
                <li><strong>Android Accessibility:</strong> TalkBack, Magnification, Switch Access</li>
                <li><strong>Responsive Design:</strong> Adapts to accessibility settings</li>
                <li><strong>Touch Accommodations:</strong> Support for touch accessibility features</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Accessibility Testing & Evaluation</h2>
              
              <h3>Testing Methods</h3>
              <ul>
                <li><strong>Automated Testing:</strong> Regular automated accessibility scans</li>
                <li><strong>Manual Testing:</strong> Human evaluation of accessibility features</li>
                <li><strong>User Testing:</strong> Testing with users with disabilities</li>
                <li><strong>Expert Review:</strong> Accessibility expert consultation</li>
              </ul>

              <h3>Testing Tools</h3>
              <ul>
                <li><strong>WAVE:</strong> Web Accessibility Evaluation Tool</li>
                <li><strong>axe DevTools:</strong> Automated accessibility testing</li>
                <li><strong>Lighthouse:</strong> Google's accessibility auditing tool</li>
                <li><strong>Screen Readers:</strong> Testing with actual assistive technology</li>
              </ul>

              <h3>Continuous Monitoring</h3>
              <ul>
                <li><strong>Regular Audits:</strong> Quarterly accessibility assessments</li>
                <li><strong>User Feedback:</strong> Monitoring accessibility-related feedback</li>
                <li><strong>Compliance Updates:</strong> Staying current with accessibility standards</li>
                <li><strong>Performance Metrics:</strong> Tracking accessibility improvements</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Known Limitations & Areas for Improvement</h2>
              
              <h3>Current Limitations</h3>
              <p>While we strive for full accessibility, we acknowledge some areas for improvement:</p>
              <ul>
                <li><strong>Complex Forms:</strong> Some advanced form interactions may be challenging</li>
                <li><strong>Third-Party Content:</strong> External content may not meet our standards</li>
                <li><strong>Legacy Content:</strong> Some older content may need updates</li>
                <li><strong>Advanced Features:</strong> Some cutting-edge features need accessibility refinement</li>
              </ul>

              <h3>Improvement Plans</h3>
              <ul>
                <li><strong>Regular Updates:</strong> Continuous accessibility enhancements</li>
                <li><strong>User Feedback Integration:</strong> Incorporating accessibility suggestions</li>
                <li><strong>Technology Advancement:</strong> Adopting new accessibility technologies</li>
                <li><strong>Training & Awareness:</strong> Ongoing staff accessibility education</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Requesting Accommodations & Support</h2>
              
              <h3>How to Request Accommodations</h3>
              <p>If you need accessibility accommodations or encounter barriers:</p>
              <ul>
                <li><strong>Email:</strong> accessibility@movedin.ca</li>
                <li><strong>Phone:</strong> 1-800-MOVEDIN (1-800-668-3346)</li>
                <li><strong>Online Form:</strong> <a href="/accessibility-request">Accessibility Request Form</a></li>
                <li><strong>Response Time:</strong> We will respond within 48 hours</li>
              </ul>

              <h3>Types of Accommodations</h3>
              <ul>
                <li><strong>Content Format:</strong> Alternative formats for information</li>
                <li><strong>Communication Methods:</strong> Alternative communication channels</li>
                <li><strong>Service Modifications:</strong> Customized service delivery</li>
                <li><strong>Technical Support:</strong> Accessibility troubleshooting assistance</li>
              </ul>

              <h3>Feedback & Suggestions</h3>
              <ul>
                <li><strong>Accessibility Issues:</strong> Report barriers you encounter</li>
                <li><strong>Improvement Ideas:</strong> Suggest accessibility enhancements</li>
                <li><strong>Feature Requests:</strong> Request new accessibility features</li>
                <li><strong>General Feedback:</strong> Share your accessibility experience</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Training & Staff Awareness</h2>
              
              <h3>Staff Training</h3>
              <ul>
                <li><strong>Accessibility Fundamentals:</strong> Basic accessibility principles</li>
                <li><strong>WCAG Guidelines:</strong> Understanding accessibility standards</li>
                <li><strong>Assistive Technology:</strong> Working with accessibility tools</li>
                <li><strong>Customer Service:</strong> Serving customers with disabilities</li>
              </ul>

              <h3>Ongoing Education</h3>
              <ul>
                <li><strong>Regular Updates:</strong> Staying current with accessibility standards</li>
                <li><strong>Best Practices:</strong> Learning from accessibility experts</li>
                <li><strong>User Experience:</strong> Understanding accessibility from user perspective</li>
                <li><strong>Technology Changes:</strong> Adapting to new accessibility technologies</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Compliance & Legal Framework</h2>
              
              <h3>Canadian Accessibility Laws</h3>
              <ul>
                <li><strong>AODA:</strong> Accessibility for Ontarians with Disabilities Act</li>
                <li><strong>Provincial Standards:</strong> Compliance with provincial accessibility requirements</li>
                <li><strong>Federal Guidelines:</strong> Following federal accessibility recommendations</li>
                <li><strong>Industry Standards:</strong> Meeting industry accessibility best practices</li>
              </ul>

              <h3>International Standards</h3>
              <ul>
                <li><strong>WCAG 2.1:</strong> Web Content Accessibility Guidelines</li>
                <li><strong>ISO Standards:</strong> International accessibility standards</li>
                <li><strong>UN Convention:</strong> Rights of Persons with Disabilities</li>
                <li><strong>Global Best Practices:</strong> International accessibility frameworks</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Contact Information & Support</h2>
              <p>For accessibility-related questions, concerns, or support:</p>
              
              <h3>Primary Accessibility Contact</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Accessibility Officer:</strong> accessibility@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>General Inquiries:</strong> hello@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> 1-800-MOVEDIN (1-800-668-3346)
                </div>
                <div className="contact-item">
                  <strong>TTY/TDD:</strong> Available upon request
                </div>
                <div className="contact-item">
                  <strong>Address:</strong> MovedIn Accessibility Office, Toronto, Ontario, Canada
                </div>
              </div>

              <h3>Response Times</h3>
              <ul>
                <li><strong>General Inquiries:</strong> Within 24 hours</li>
                <li><strong>Accessibility Issues:</strong> Within 48 hours</li>
                <li><strong>Accommodation Requests:</strong> Within 72 hours</li>
                <li><strong>Complex Requests:</strong> Within 1 week with progress updates</li>
              </ul>
            </div>

            <div className="about-section">
              <h2>Updates to This Statement</h2>
              <p>
                We may update this Accessibility Statement to reflect improvements, changes in standards, or feedback from users:
              </p>
              <ul>
                <li><strong>Regular Reviews:</strong> Bi-annual accessibility statement reviews</li>
                <li><strong>User Feedback:</strong> Incorporating accessibility suggestions</li>
                <li><strong>Standard Updates:</strong> Reflecting new accessibility requirements</li>
                <li><strong>Feature Additions:</strong> Documenting new accessibility features</li>
            </ul>
            </div>

            <div className="cta-section">
              <h2>Help Us Improve Accessibility</h2>
              <p>Your feedback helps us make our platform more accessible for everyone. Contact us with your suggestions and experiences.</p>
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

export default Accessibility; 