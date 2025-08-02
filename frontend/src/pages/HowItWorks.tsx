import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>How It Works | MovedIn - Get Moving Quotes in Minutes</title>
        <meta name="description" content="See how MovedIn makes moving easy: get instant quotes, compare movers, and book online in minutes. Transparent, trusted, and Canadian." />
        <link rel="canonical" href="https://movedin.com/how-it-works" />
        <meta property="og:title" content="How It Works | MovedIn" />
        <meta property="og:description" content="See how MovedIn makes moving easy: get instant quotes, compare movers, and book online in minutes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/how-it-works" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="how-it-works-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="how-it-works-title">How It Works</h1>
              <p className="page-subtitle">Get your moving quote in minutes, not hours. <Link to="/">Get a quote now</Link> or <Link to="/tips-guides">read our moving tips</Link>.</p>
            </header>
            <nav aria-label="Quick navigation">
              <ul style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', margin: '1rem 0', padding: 0, listStyle: 'none' }}>
                <li><a href="#step-1">Step 1</a></li>
                <li><a href="#step-2">Step 2</a></li>
                <li><a href="#step-3">Step 3</a></li>
                <li><a href="#step-4">Step 4</a></li>
              </ul>
            </nav>
            <section className="steps-container">
              <div className="step-item" id="step-1">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h2>Tell Us About Your Move</h2>
                  <p>Enter your current and new addresses, move date, and time. We'll ask about your home type, number of rooms, and any special requirements.</p>
                </div>
              </div>
              <div className="step-item" id="step-2">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h2>Get Instant Quotes</h2>
                  <p>Our system connects with trusted moving companies in your area to provide real-time quotes. Compare rates, crew sizes, and services.</p>
                </div>
              </div>
              <div className="step-item" id="step-3">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h2>Choose Your Mover</h2>
                  <p>Review detailed quotes including hourly rates, estimated time, and cost breakdowns. Select the company that best fits your needs and budget.</p>
                </div>
              </div>
              <div className="step-item" id="step-4">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h2>Secure Your Booking</h2>
                  <p>Pay a small $1 CAD deposit to secure your move date. We'll connect you with your chosen moving company to finalize the details.</p>
                </div>
              </div>
            </section>
            <section className="features-section">
              <h2>Why Choose MovedIn?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Instant Quotes</h3>
                  <p>Get multiple quotes from verified moving companies in seconds, not days.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💰</div>
                  <h3>Transparent Pricing</h3>
                  <p>See exactly what you're paying for with detailed cost breakdowns.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🛡️</div>
                  <h3>Verified Companies</h3>
                  <p>All moving companies are licensed, insured, and thoroughly vetted.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3>Easy Booking</h3>
                  <p>Book your move entirely online with our simple, mobile-friendly process.</p>
                </div>
              </div>
            </section>
            <section className="cta-section">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of Canadians who have simplified their moving experience with MovedIn. <Link to="/about-us">Learn more about us</Link>.</p>
              <button className="cta-button" onClick={() => navigate('/')}>Get Your Free Quote</button>
            </section>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default HowItWorks; 