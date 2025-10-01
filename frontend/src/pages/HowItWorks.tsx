import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
// import './HowItWorks.css'; // Temporarily disabled to test

// Import icons and images
import locationIcon from '../assets/icons-svg/icon_location-purple.svg';
import calendarIcon from '../assets/icons-svg/icon_calendar-purple.svg';
import servicesIcon from '../assets/icons-svg/icon_home-services-black.svg';
import phoneIcon from '../assets/icons-svg/icon_phone-purple.svg';
import checkIcon from '../assets/icons-svg/icon_check-purple.svg';
import starIcon from '../assets/icons-svg/icon_star-yellow.svg';

// Import new images
import heroImage from '../assets/imgs-png/img_hero-illustration-new.jpg';
import movingScene1 from '../assets/imgs-png/img_moving-scene-1.jpg';
import movingScene2 from '../assets/imgs-png/img_moving-scene-2.jpg';
import movingScene3 from '../assets/imgs-png/img_moving-scene-3.jpg';
import peopleCarryingBox from '../assets/imgs-png/img_people-carrying-box.png';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>How It Works | MovedIn - Simple Moving Process Explained</title>
        <meta name="description" content="Discover how MovedIn simplifies your move: 4 easy steps from quote to booking. Get instant quotes from verified Canadian moving companies in minutes." />
        <meta name="keywords" content="how moving works, moving process, moving quotes, moving booking, Canadian moving companies, moving platform" />
        <link rel="canonical" href="https://movedin.com/how-it-works" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="How It Works | MovedIn - Simple Moving Process Explained" />
        <meta property="og:description" content="Discover how MovedIn simplifies your move: 4 easy steps from quote to booking. Get instant quotes from verified Canadian moving companies in minutes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/how-it-works" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-how-it-works.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How It Works | MovedIn" />
        <meta name="twitter:description" content="Discover how MovedIn simplifies your move: 4 easy steps from quote to booking." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-how-it-works.jpg" />
        
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
            "@type": "HowTo",
            "name": "How to Book a Move with MovedIn",
            "description": "Step-by-step guide to booking your move through MovedIn's platform",
            "url": "https://movedin.com/how-it-works",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Tell Us About Your Move",
                "text": "Enter your current and new addresses, move date, and time. We'll ask about your home type, number of rooms, and any special requirements.",
                "position": 1
              },
              {
                "@type": "HowToStep",
                "name": "Get Instant Quotes",
                "text": "Our system connects with trusted moving companies in your area to provide real-time quotes. Compare rates, crew sizes, and services.",
                "position": 2
              },
              {
                "@type": "HowToStep",
                "name": "Choose Your Mover",
                "text": "Review detailed quotes including hourly rates, estimated time, and cost breakdowns. Select the company that best fits your needs and budget.",
                "position": 3
              },
              {
                "@type": "HowToStep",
                "name": "Secure Your Booking",
                "text": "Pay a small deposit to secure your move date. We'll connect you with your chosen moving company to finalize the details.",
                "position": 4
              }
            ],
            "totalTime": "PT10M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "CAD",
              "value": "1"
            },
            "supply": [
              {
                "@type": "HowToSupply",
                "name": "Computer or Mobile Device"
              },
              {
                "@type": "HowToSupply",
                "name": "Internet Connection"
              }
            ],
            "tool": [
              {
                "@type": "HowToTool",
                "name": "MovedIn Platform"
              }
            ]
          })}
        </script>
      </Helmet>
      <Header />
      <main className="how-it-works-page" style={{ 
        backgroundColor: '#0F1115', 
        color: '#E5E7EB', 
        minHeight: '100vh',
        padding: '0'
      }}>
        {/* Hero Section */}
        <section className="hero-section" style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          padding: '8rem 2rem 6rem',
          color: '#E5E7EB'
        }}>
          <div className="hero-content">
            <div className="hero-text">
              <h1 style={{ 
                fontSize: '4rem', 
                fontWeight: '800', 
                color: '#FF0000',
                marginBottom: '1.5rem',
                backgroundColor: '#00FF00',
                padding: '20px',
                border: '5px solid #0000FF'
              }}>🚀 NEW AMAZING HOW IT WORKS PAGE 🚀</h1>
              <p className="hero-subtitle">Your move, simplified in 7 easy steps</p>
              <p className="hero-description">
                We've streamlined the entire moving process to make it as simple as possible. 
                From getting quotes to booking your move, everything happens in minutes, not hours.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5 min</span>
                  <span className="stat-label">Average Quote Time</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Free to Use</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img src={heroImage} alt="How MovedIn works - professional moving process" className="hero-image" />
            </div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="process-overview">
          <div className="container">
            <h2>Simple, Fast, Reliable</h2>
            <p>Our 7-step process ensures you get the best moving experience possible</p>
            <div className="process-timeline">
              <div className="timeline-item">
                <div className="timeline-icon">
                  <img src={locationIcon} alt="Location" />
                </div>
                <div className="timeline-content">
                  <h3>Tell Us Your Details</h3>
                  <p>Where, when, and what you're moving</p>
                </div>
              </div>
              <div className="timeline-arrow">→</div>
              <div className="timeline-item">
                <div className="timeline-icon">
                  <img src={calendarIcon} alt="Calendar" />
                </div>
                <div className="timeline-content">
                  <h3>Get Instant Quotes</h3>
                  <p>Compare prices from verified movers</p>
                </div>
              </div>
              <div className="timeline-arrow">→</div>
              <div className="timeline-item">
                <div className="timeline-icon">
                  <img src={checkIcon} alt="Check" />
                </div>
                <div className="timeline-content">
                  <h3>Book & Move</h3>
                  <p>Secure your move with a small deposit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="detailed-steps">
          <div className="container">
            <h2>The Complete Process</h2>
            <div className="steps-container">
              {/* Step 1 */}
              <div className="step-item">
                <div className="step-visual">
                  <img src={movingScene1} alt="Move details planning" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">01</div>
                  <h3>Move Details</h3>
                  <p>Tell us where and when you're moving - origin, destination, date, and time. We'll ask about your home type, number of rooms, and any special requirements.</p>
                  <div className="step-features">
                    <span className="feature-tag">📍 Location Details</span>
                    <span className="feature-tag">📅 Date & Time</span>
                    <span className="feature-tag">🏠 Home Type</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="step-item reverse">
                <div className="step-visual">
                  <img src={movingScene2} alt="Origin home details" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">02</div>
                  <h3>Origin Home</h3>
                  <p>Describe your current home - type, rooms, square footage, and special features. This helps us provide accurate quotes.</p>
                  <div className="step-features">
                    <span className="feature-tag">🏠 Home Type</span>
                    <span className="feature-tag">📏 Square Footage</span>
                    <span className="feature-tag">🚪 Room Count</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="step-item">
                <div className="step-visual">
                  <img src={movingScene3} alt="Destination details" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">03</div>
                  <h3>Destination</h3>
                  <p>Tell us about your new home - property details and move-in requirements. We'll factor in stairs, elevators, and access challenges.</p>
                  <div className="step-features">
                    <span className="feature-tag">🏢 Building Type</span>
                    <span className="feature-tag">🛗 Access Details</span>
                    <span className="feature-tag">📋 Special Requirements</span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="step-item reverse">
                <div className="step-visual">
                  <img src={peopleCarryingBox} alt="Choose your mover" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">04</div>
                  <h3>Choose Mover</h3>
                  <p>Compare real-time quotes from verified moving companies. See rates, crew sizes, reviews, and services to make the best choice.</p>
                  <div className="step-features">
                    <span className="feature-tag">💰 Compare Prices</span>
                    <span className="feature-tag">⭐ Read Reviews</span>
                    <span className="feature-tag">👥 Crew Details</span>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="step-item">
                <div className="step-visual">
                  <img src={movingScene1} alt="Contact information" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">05</div>
                  <h3>Contact Info</h3>
                  <p>Provide your contact information for booking confirmation and coordination. We'll keep you updated throughout the process.</p>
                  <div className="step-features">
                    <span className="feature-tag">📞 Phone Number</span>
                    <span className="feature-tag">📧 Email Address</span>
                    <span className="feature-tag">📱 SMS Updates</span>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="step-item reverse">
                <div className="step-visual">
                  <img src={movingScene2} alt="Review and payment" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">06</div>
                  <h3>Review & Pay</h3>
                  <p>Review your quote details and complete booking with a small deposit. The rest is paid directly to your mover on moving day.</p>
                  <div className="step-features">
                    <span className="feature-tag">💳 Secure Payment</span>
                    <span className="feature-tag">📋 Quote Review</span>
                    <span className="feature-tag">🔒 Booking Confirmation</span>
                  </div>
                </div>
              </div>

              {/* Step 7 */}
              <div className="step-item">
                <div className="step-visual">
                  <img src={movingScene3} alt="Move confirmation" className="step-image" />
                </div>
                <div className="step-content">
                  <div className="step-number">07</div>
                  <h3>Confirmation</h3>
                  <p>Your move is booked! Get confirmation and next steps from your chosen mover. We'll be here to help if you need anything.</p>
                  <div className="step-features">
                    <span className="feature-tag">✅ Booking Confirmed</span>
                    <span className="feature-tag">📱 Next Steps</span>
                    <span className="feature-tag">🎉 Ready to Move</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <h2>Why Choose MovedIn?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Get quotes in minutes, not hours. Our streamlined process saves you time.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🛡️</div>
                <h3>Verified Movers</h3>
                <p>All moving companies are licensed, insured, and background-checked.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3>Best Prices</h3>
                <p>Compare multiple quotes to find the best deal for your budget.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📱</div>
                <h3>Easy Tracking</h3>
                <p>Track your move progress and communicate with your mover easily.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Make Your Move?</h2>
              <p>Join thousands of Canadians who have simplified their moving experience with MovedIn.</p>
              <div className="cta-buttons">
                <button className="cta-button primary" onClick={() => navigate('/')}>
                  Get Your Free Quote Now
                </button>
                <button className="cta-button secondary" onClick={() => navigate('/tips-guides')}>
                  Read Moving Tips
                </button>
              </div>
              <div className="cta-trust">
                <img src={starIcon} alt="Star" className="trust-star" />
                <span>Trusted by 10,000+ Canadians</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <StaticFooter />
    </>
  );
};

export default HowItWorks; 