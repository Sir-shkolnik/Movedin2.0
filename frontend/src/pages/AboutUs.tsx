import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>About MovedIn | Canada's Premier Moving Platform | 15,000+ Successful Moves</title>
        <meta name="description" content="Discover how MovedIn revolutionized moving in Canada. From our founding story to 15,000+ successful moves, learn why we're the trusted choice for instant quotes from 500+ verified movers." />
        <meta name="keywords" content="moving company Canada, licensed movers Toronto, Vancouver moving services, Montreal movers, Calgary moving company, professional movers, insured moving services, moving quotes Canada, residential moving, commercial moving, long distance moving, moving platform, instant moving quotes" />
        <link rel="canonical" href="https://movedin.com/about-us" />
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform | 15,000+ Successful Moves" />
        <meta property="og:description" content="Discover how MovedIn revolutionized moving in Canada. From our founding story to 15,000+ successful moves, learn why we're the trusted choice." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MovedIn" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MovedIn",
            "url": "https://movedin.com",
            "description": "Canada's premier moving platform connecting customers with licensed, insured moving companies for instant quotes and professional service",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA",
              "addressRegion": "Ontario"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@movedin.com",
              "telephone": "+1-800-MOVEDIN"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "15000"
            }
          })}
        </script>
      </Helmet>
      <Header />
      
      <main className="about-us-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🏆</span>
              <span>Canada's #1 Moving Platform</span>
            </div>
            <h1 className="hero-title">
              Revolutionizing Moving in Canada
              <span className="hero-subtitle">One Move at a Time</span>
            </h1>
            <p className="hero-description">
              We're not just another moving company – we're the platform that connects you with Canada's finest, 
              most reliable movers. From our founding vision to 15,000+ successful moves, discover why MovedIn 
              is the trusted choice for Canadians nationwide.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">15,000+</span>
                <span className="stat-label">Successful Moves</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Verified Movers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">75+</span>
                <span className="stat-label">Cities Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Customer Rating</span>
              </div>
            </div>
            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigate('/#/')}>
                Get Your Free Quote
              </button>
              <button className="cta-secondary" onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}>
                Our Story
              </button>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="story-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Story: From Frustration to Innovation</h2>
              <p className="section-subtitle">How a simple moving nightmare became Canada's most trusted moving platform</p>
            </div>
            
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-marker">2024</div>
                <div className="timeline-content">
                  <h3>The Breaking Point</h3>
                  <p>
                    Our founder, a busy professional moving across Toronto, spent weeks calling moving companies, 
                    getting inconsistent quotes, and worrying about hidden fees. The industry was broken – 
                    opaque pricing, unreliable movers, and endless phone calls.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker">2024</div>
                <div className="timeline-content">
                  <h3>The Vision</h3>
                  <p>
                    We envisioned a platform where Canadians could get instant, transparent quotes from 
                    pre-vetted, licensed movers in minutes – not weeks. A place where moving became 
                    simple, reliable, and stress-free.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker">2024</div>
                <div className="timeline-content">
                  <h3>MovedIn is Born</h3>
                  <p>
                    Built by moving industry veterans and technology experts, MovedIn launched with a 
                    simple mission: to make moving as easy as ordering takeout. Our first month saw 
                    50 successful moves, and we knew we were onto something special.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker">2025</div>
                <div className="timeline-content">
                  <h3>Today's Success</h3>
                  <p>
                    From 50 moves to 15,000+ successful relocations. From Toronto to Vancouver, 
                    from apartments to mansions, from local moves to cross-country relocations. 
                    We've become the platform Canadians trust for their most important moves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="mission-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Mission & Core Values</h2>
              <p className="section-subtitle">The principles that drive every decision we make</p>
            </div>
            
            <div className="mission-content">
              <div className="mission-statement">
                <h3>Our Mission</h3>
                <p>
                  To eliminate the stress and uncertainty from moving by providing Canadians with 
                  instant access to licensed, insured, and thoroughly vetted moving professionals. 
                  We believe everyone deserves a smooth, reliable, and transparent moving experience.
                </p>
              </div>
              
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🎯</div>
                  <h4>Customer-First Excellence</h4>
                  <p>
                    Every feature, every partnership, every decision is made with our customers in mind. 
                    We measure success by your satisfaction, not just our bottom line.
                  </p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🛡️</div>
                  <h4>Uncompromising Quality</h4>
                  <p>
                    We partner only with movers who meet our rigorous standards: licensed, insured, 
                    background-checked, and customer-approved. Quality is non-negotiable.
                  </p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🔍</div>
                  <h4>Transparency Always</h4>
                  <p>
                    No hidden fees, no surprise charges, no fine print. Every quote includes detailed 
                    breakdowns, and every service is clearly explained upfront.
                  </p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🚀</div>
                  <h4>Continuous Innovation</h4>
                  <p>
                    We're constantly improving our platform based on customer feedback, industry trends, 
                    and technological advances. Yesterday's solutions won't solve tomorrow's challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="process-section">
          <div className="container">
            <div className="section-header">
              <h2>How We Ensure Your Move is Perfect</h2>
              <p className="section-subtitle">Our comprehensive approach to moving excellence</p>
            </div>
            
            <div className="process-grid">
              <div className="process-step">
                <div className="step-number">01</div>
                <h4>Rigorous Vendor Vetting</h4>
                <p>
                  Every moving company undergoes a 12-point verification process including license checks, 
                  insurance verification, background screening, and customer satisfaction reviews.
                </p>
                <ul>
                  <li>Business license verification</li>
                  <li>Insurance coverage validation</li>
                  <li>Criminal background checks</li>
                  <li>Customer satisfaction scores</li>
                </ul>
              </div>
              
              <div className="process-step">
                <div className="step-number">02</div>
                <h4>Smart Matching Technology</h4>
                <p>
                  Our AI-powered platform analyzes your specific move requirements and matches you with 
                  the movers best suited for your needs, location, and timeline.
                </p>
                <ul>
                  <li>Geographic optimization</li>
                  <li>Service specialization matching</li>
                  <li>Availability coordination</li>
                  <li>Pricing optimization</li>
                </ul>
              </div>
              
              <div className="process-step">
                <div className="step-number">03</div>
                <h4>Quality Assurance</h4>
                <p>
                  From quote to completion, we monitor every aspect of your move, ensuring quality 
                  standards are met and addressing any issues immediately.
                </p>
                <ul>
                  <li>Real-time move tracking</li>
                  <li>Quality checkpoints</li>
                  <li>Customer feedback loops</li>
                  <li>Issue resolution protocols</li>
                </ul>
              </div>
              
              <div className="process-step">
                <div className="step-number">04</div>
                <h4>Ongoing Support</h4>
                <p>
                  Our support team is available throughout your entire moving journey, providing 
                  assistance, answering questions, and ensuring your satisfaction.
                </p>
                <ul>
                  <li>24/7 customer support</li>
                  <li>Move day coordination</li>
                  <li>Post-move follow-up</li>
                  <li>Feedback collection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="social-proof-section">
          <div className="container">
            <div className="section-header">
              <h2>Trusted by Thousands of Canadians</h2>
              <p className="section-subtitle">Real stories from real customers who chose MovedIn</p>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "MovedIn made our cross-country move from Toronto to Vancouver absolutely seamless. 
                    We got 5 quotes in 10 minutes, and the movers were professional, careful, and on time. 
                    Couldn't recommend them more!"
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Sarah Chen</strong>
                    <span>Toronto → Vancouver</span>
                  </div>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "As a busy executive, I don't have time to call 20 moving companies. MovedIn gave me 
                    instant quotes, transparent pricing, and the movers showed up exactly when promised. 
                    Game changer!"
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Michael Rodriguez</strong>
                    <span>Montreal → Calgary</span>
                  </div>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "Moving with kids is stressful enough. MovedIn took care of everything - from finding 
                    the right movers to coordinating the timing. The team was incredibly professional and 
                    made our move stress-free."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Jennifer Thompson</strong>
                    <span>Ottawa → Edmonton</span>
                  </div>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
            
            <div className="trust-indicators">
              <div className="trust-item">
                <span className="trust-icon">🏆</span>
                <span>15,000+ Successful Moves</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>100% Licensed & Insured</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⭐</span>
                <span>4.9/5 Customer Rating</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">📞</span>
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Excellence Section */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2>Comprehensive Moving Solutions</h2>
              <p className="section-subtitle">From local moves to international relocations, we've got you covered</p>
            </div>
            
            <div className="services-grid">
              <div className="service-category">
                <h3>Residential Moving</h3>
                <p>Complete moving solutions for homes of all sizes</p>
                <ul>
                  <li>Apartment & condo moves</li>
                  <li>House & townhouse relocations</li>
                  <li>Student housing moves</li>
                  <li>Senior living transitions</li>
                </ul>
              </div>
              
              <div className="service-category">
                <h3>Commercial Moving</h3>
                <p>Professional business relocation services</p>
                <ul>
                  <li>Office relocations</li>
                  <li>Retail store moves</li>
                  <li>Warehouse transfers</li>
                  <li>Equipment & machinery</li>
                </ul>
              </div>
              
              <div className="service-category">
                <h3>Specialty Items</h3>
                <p>Expert handling of valuable & fragile items</p>
                <ul>
                  <li>Piano & musical instruments</li>
                  <li>Art & antiques</li>
                  <li>Wine collections</li>
                  <li>Electronics & appliances</li>
                </ul>
              </div>
              
              <div className="service-category">
                <h3>Long-Distance</h3>
                <p>Cross-province & cross-country relocations</p>
                <ul>
                  <li>Province-to-province moves</li>
                  <li>Coast-to-coast relocations</li>
                  <li>International moving support</li>
                  <li>Storage solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2>Meet the Team Behind MovedIn</h2>
              <p className="section-subtitle">Industry experts, technology innovators, and customer advocates</p>
            </div>
            
            <div className="team-intro">
              <p>
                MovedIn is powered by a diverse team of moving industry veterans, technology professionals, 
                and customer service specialists who are passionate about revolutionizing the moving experience. 
                Our collective expertise spans decades in logistics, customer service, and digital innovation.
              </p>
            </div>
            
            <div className="team-highlights">
              <div className="highlight-item">
                <span className="highlight-number">25+</span>
                <span className="highlight-label">Years Combined Industry Experience</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">15+</span>
                <span className="highlight-label">Technology & Innovation Experts</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">24/7</span>
                <span className="highlight-label">Customer Support Team</span>
              </div>
            </div>
            
            <div className="team-values">
              <h3>What Drives Our Team</h3>
              <div className="values-list">
                <div className="value-item">
                  <span className="value-bullet">•</span>
                  <span>Customer satisfaction above all else</span>
                </div>
                <div className="value-item">
                  <span className="value-bullet">•</span>
                  <span>Continuous learning and improvement</span>
                </div>
                <div className="value-item">
                  <span className="value-bullet">•</span>
                  <span>Innovation in everything we do</span>
                </div>
                <div className="value-item">
                  <span className="value-bullet">•</span>
                  <span>Transparency and honest communication</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Experience the MovedIn Difference?</h2>
              <p>
                Join thousands of Canadians who have simplified their moving experience with our platform. 
                Get instant quotes, compare options, and book with confidence.
              </p>
              <div className="cta-buttons">
                <button className="cta-primary" onClick={() => navigate('/#/')}>
                  Get Your Free Quote
                </button>
                <button className="cta-secondary" onClick={() => navigate('/#/how-it-works')}>
                  How It Works
                </button>
              </div>
              <div className="cta-guarantees">
                <span>✅ No hidden fees</span>
                <span>✅ Instant quotes</span>
                <span>✅ Licensed movers</span>
                <span>✅ 24/7 support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Support Section */}
        <section className="contact-section">
          <div className="container">
            <div className="section-header">
              <h2>Get in Touch</h2>
              <p className="section-subtitle">We're here to help with any questions or concerns</p>
            </div>
            
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Customer Support</h3>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div>
                    <strong>Email:</strong>
                    <a href="mailto:support@movedin.com">support@movedin.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>Phone:</strong>
                    <a href="tel:1-800-MOVEDIN">1-800-MOVEDIN</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <div>
                    <strong>Hours:</strong>
                    <span>Monday - Friday, 9 AM - 6 PM EST</span>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💬</span>
                  <div>
                    <strong>Live Chat:</strong>
                    <span>Available 24/7 on our platform</span>
                  </div>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Send us a Message</h3>
                <p>Have a question or feedback? We'd love to hear from you!</p>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" className="form-textarea" rows={4}></textarea>
                </div>
                <button className="form-submit">Send Message</button>
              </div>
            </div>
          </div>
        </section>

        {/* Legal & Policies Section */}
        <section className="legal-section">
          <div className="container">
            <div className="section-header">
              <h2>Legal & Policies</h2>
              <p className="section-subtitle">Transparency and trust in everything we do</p>
            </div>
            
            <div className="legal-grid">
              <div className="legal-category">
                <h3>Privacy & Data</h3>
                <ul>
                  <li><Link to="/#/privacy-policy">Privacy Policy</Link> - How we protect your information</li>
                  <li><Link to="/#/cookie-policy">Cookie Policy</Link> - How we use cookies</li>
                  <li><Link to="/#/data-retention">Data Retention</Link> - How long we keep your data</li>
                  <li><Link to="/#/data-export">Data Export</Link> - Request your data</li>
                </ul>
              </div>
              
              <div className="legal-category">
                <h3>Service Terms</h3>
                <ul>
                  <li><Link to="/#/terms-of-service">Terms of Service</Link> - Our service agreement</li>
                  <li><Link to="/#/service-guarantee">Service Guarantee</Link> - What we promise</li>
                  <li><Link to="/#/cancellation-policy">Cancellation Policy</Link> - Booking changes</li>
                  <li><Link to="/#/refund-policy">Refund Policy</Link> - Money-back guarantee</li>
                </ul>
              </div>
              
              <div className="legal-category">
                <h3>Accessibility & Rights</h3>
                <ul>
                  <li><Link to="/#/accessibility">Accessibility Statement</Link> - Our commitment</li>
                  <li><Link to="/#/user-rights">Your Rights</Link> - What you're entitled to</li>
                  <li><Link to="/#/dispute-resolution">Dispute Resolution</Link> - How we handle issues</li>
                  <li><Link to="/#/legal-requests">Legal Requests</Link> - Contact legal@movedin.com</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer onContinue={() => navigate('/#/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default AboutUs; 