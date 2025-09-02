import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    // Navigate to the quote form (App component)
    navigate('/quote');
  };

  return (
    <div className="homepage">
      <Header />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Get Moving Quotes in Minutes
            </h1>
            <p className="hero-subtitle">
              Compare prices from Toronto's top moving companies. 
              Save time, save money, and move with confidence.
            </p>
            <button 
              className="cta-button"
              onClick={handleGetQuote}
            >
              Get Free Quote Now
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose MovedIn?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Top Moving Companies</h3>
                <p>Vetted, licensed, and insured movers in the Greater Toronto Area</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Instant Quotes</h3>
                <p>Get multiple quotes in minutes, not days</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Best Prices</h3>
                <p>Compare rates and save up to 40% on your move</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3>Secure & Safe</h3>
                <p>Your information is protected with bank-level security</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Tell Us About Your Move</h3>
                <p>Enter your move details - from where, to where, and when</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Get Instant Quotes</h3>
                <p>Receive competitive quotes from top Toronto movers</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Choose & Book</h3>
                <p>Select your preferred mover and book your move</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Start Your Move?</h2>
            <p>Join thousands of satisfied customers who've moved with MovedIn</p>
            <button 
              className="cta-button-large"
              onClick={handleGetQuote}
            >
              Get Your Free Quote
            </button>
          </div>
        </section>
      </main>

      <footer className="simple-footer">
        <div className="container">
          <p>&copy; 2025 MovedIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
