import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>About Us | MovedIn - Trusted Canadian Moving Platform</title>
        <meta name="description" content="Learn about MovedIn, our mission, values, and commitment to making moving easy for Canadians. Meet our team and see our legal policies." />
        <link rel="canonical" href="https://movedin.com/about-us" />
        <meta property="og:title" content="About Us | MovedIn" />
        <meta property="og:description" content="Learn about MovedIn, our mission, values, and commitment to making moving easy for Canadians. Meet our team and see our legal policies." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="about-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="about-title">About MovedIn</h1>
              <p className="page-subtitle">Simplifying moving for Canadians since 2024. <Link to="/how-it-works">How it works</Link> | <Link to="/tips-guides">Tips & Guides</Link></p>
            </header>
            
            <div className="about-section">
              <h2>Our Mission</h2>
              <p className="mission-text">
                At MovedIn, we believe moving should be simple, transparent, and stress-free. 
                We're revolutionizing the moving industry by connecting Canadians with trusted, 
                verified moving companies through our innovative platform.
              </p>
            </div>
            
            <div className="about-section">
              <h2>Our Story</h2>
              <p>
                Founded in 2024, MovedIn was born from a simple frustration: the traditional 
                moving industry was complex, opaque, and time-consuming. We set out to change 
                that by creating a platform that puts customers first.
              </p>
              <p>
                Today, we're proud to serve thousands of Canadians across the country, 
                helping them find reliable movers at fair prices with complete transparency.
              </p>
            </div>
            
            <div className="values-section">
              <h2>Our Values</h2>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🤝</div>
                  <h3>Trust & Transparency</h3>
                  <p>We believe in complete transparency. Every quote includes detailed breakdowns, and all our moving partners are thoroughly vetted.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">⚡</div>
                  <h3>Simplicity</h3>
                  <p>Moving is complicated enough. We make the booking process as simple as possible with our streamlined platform.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">💎</div>
                  <h3>Quality</h3>
                  <p>We partner only with licensed, insured, and experienced moving companies that meet our high standards.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🇨🇦</div>
                  <h3>Canadian Focus</h3>
                  <p>We're built for Canadians, by Canadians. We understand the unique challenges of moving in our country.</p>
                </div>
              </div>
            </div>
            
            <div className="stats-section">
              <h2>MovedIn by the Numbers</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Verified Movers</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Cities Served</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">4.8★</div>
                  <div className="stat-label">Customer Rating</div>
                </div>
              </div>
            </div>
            
            <div className="team-section">
              <h2>Our Team</h2>
              <p>
                MovedIn is powered by a team of moving industry experts, technology professionals, 
                and customer service specialists who are passionate about making moving easier for everyone.
              </p>
              <p>
                We're constantly innovating and improving our platform based on customer feedback 
                and industry best practices.
              </p>
            </div>
            
            <div className="contact-section">
              <h2>Get in Touch</h2>
              <p>Have questions or feedback? We'd love to hear from you!</p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Email:</strong> hello@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> 1-800-MOVEDIN
                </div>
                <div className="contact-item">
                  <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
                </div>
              </div>
            </div>
            
            <div className="cta-section">
              <h2>Ready to Experience the MovedIn Difference?</h2>
              <p>Join thousands of Canadians who have simplified their moving experience with our platform.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Quote
              </button>
            </div>
            <div className="about-section">
              <h2>Legal & Policies</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/terms-of-service">Terms of Service</a></li>
                <li><a href="/cookie-policy">Cookie Policy</a></li>
                <li><a href="/accessibility">Accessibility Statement</a></li>
              </ul>
            </div>
            <div className="about-section">
              <h2>Your Rights</h2>
              <ul>
                <li>Access, correct, or delete your personal data</li>
                <li>Request a copy of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Request information about our data practices</li>
              </ul>
              <p>Contact us for any legal or privacy requests: <a href="mailto:legal@movedin.com">legal@movedin.com</a></p>
            </div>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default AboutUs; 