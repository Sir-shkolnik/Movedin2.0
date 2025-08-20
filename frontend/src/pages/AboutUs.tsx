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
        <title>About MovedIn | Canada's Premier Moving Platform | Licensed & Insured Movers</title>
        <meta name="description" content="MovedIn connects Canadians with verified moving companies for instant quotes, transparent pricing, and professional service. Get moving quotes in minutes, not hours." />
        <meta name="keywords" content="moving company Canada, licensed movers Toronto, Vancouver moving services, Montreal movers, Calgary moving company, professional movers, insured moving services, moving quotes Canada, residential moving, commercial moving, long distance moving" />
        <link rel="canonical" href="https://movedin.com/about-us" />
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform" />
        <meta property="og:description" content="Connect with 500+ verified moving companies across Canada. Get instant quotes and professional service." />
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
            "description": "Canada's premier moving platform connecting customers with licensed, insured moving companies",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA",
              "addressRegion": "Ontario"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "support@movedin.com"
            }
          })}
        </script>
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="about-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="about-title">About MovedIn: Your Moving Partner</h1>
              <p className="page-subtitle">Connecting Canadians with trusted moving companies since 2024. <Link to="/how-it-works">See how it works</Link> | <Link to="/tips-guides">Get moving tips</Link></p>
            </header>
            
            <div className="about-section">
              <h2>Our Mission</h2>
              <p className="mission-text">
                We're revolutionizing moving by connecting you with <strong>licensed, insured moving companies</strong> for 
                <strong>instant quotes</strong> and <strong>transparent pricing</strong>. No more endless phone calls or hidden fees.
              </p>
            </div>
            
            <div className="about-section">
              <h2>Why Choose MovedIn?</h2>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">⚡</div>
                  <h3>Instant Quotes</h3>
                  <p>Get multiple quotes in minutes, not days. Compare rates and services instantly.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🛡️</div>
                  <h3>Verified Movers</h3>
                  <p>All moving companies are licensed, insured, and customer-approved. <Link to="/how-it-works">Learn more</Link></p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">💰</div>
                  <h3>Transparent Pricing</h3>
                  <p>See exactly what you're paying for with detailed cost breakdowns. <Link to="/tips-guides">Get cost-saving tips</Link></p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🇨🇦</div>
                  <h3>Canadian Focus</h3>
                  <p>Built for Canadians, serving 75+ cities from coast to coast.</p>
                </div>
              </div>
            </div>
            
            <div className="stats-section">
              <h2>Trusted by Thousands of Canadians</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">15,000+</div>
                  <div className="stat-label">Successful Moves</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Verified Movers</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">75+</div>
                  <div className="stat-label">Cities Served</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">4.9★</div>
                  <div className="stat-label">Customer Rating</div>
                </div>
              </div>
            </div>
            
            <div className="about-section">
              <h2>How We Help You</h2>
              <p>
                Moving is stressful enough. We eliminate the hassle by providing you with the best moving options 
                tailored to your needs. Whether you're moving across town or across the country, we've got you covered.
              </p>
              
              <h3>Our Services</h3>
              <ul>
                <li><strong>Residential Moves:</strong> Apartments, houses, condos - any size, any distance</li>
                <li><strong>Commercial Moves:</strong> Office relocations and business moves</li>
                <li><strong>Specialty Items:</strong> Piano moving, art transport, fragile items</li>
                <li><strong>Long-Distance:</strong> Cross-province and cross-country relocations</li>
              </ul>
              
              <p>
                Ready to get started? <Link to="/">Get your free quote now</Link> or 
                <Link to="/tips-guides"> browse our moving guides</Link> for expert advice.
              </p>
            </div>
            
            <div className="about-section">
              <h2>Customer Support</h2>
              <p>
                We're here to help you every step of the way. Our support team is available to answer questions, 
                resolve issues, and ensure you have the best moving experience possible.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Support Email:</strong> support@movedin.com
                </div>
                <div className="contact-item">
                  <strong>Response Time:</strong> Within 24 hours
                </div>
              </div>
            </div>
            
            <div className="about-section">
              <h2>Legal & Policies</h2>
              <p>Your trust and privacy are important to us:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><Link to="/privacy-policy">Privacy Policy</Link> - How we protect your information</li>
                <li><Link to="/terms-of-service">Terms of Service</Link> - Our service agreement</li>
                <li><Link to="/cookie-policy">Cookie Policy</Link> - How we use cookies</li>
                <li><Link to="/accessibility">Accessibility Statement</Link> - Our accessibility commitment</li>
              </ul>
            </div>
            
            <div className="cta-section">
              <h2>Ready to Simplify Your Move?</h2>
              <p>
                Join thousands of Canadians who trust MovedIn for their moving needs. 
                Get instant quotes, compare options, and book with confidence.
              </p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Quote
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                No hidden fees • No obligation • Instant quotes • Licensed movers
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default AboutUs; 