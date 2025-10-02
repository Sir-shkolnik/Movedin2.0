import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

// Import icons and images
import locationIcon from '../assets/icons-svg/icon_location-purple.svg';
import calendarIcon from '../assets/icons-svg/icon_calendar-purple.svg';
import servicesIcon from '../assets/icons-svg/icon_home-services-black.svg';
import phoneIcon from '../assets/icons-svg/icon_phone-purple.svg';
import checkIcon from '../assets/icons-svg/icon_check-purple.svg';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>How It Works | MovedIn - Simple Moving Process Explained</title>
        <meta name="description" content="Discover how MovedIn simplifies your move: 7 easy steps from quote to booking. Get instant quotes from verified Canadian moving companies in minutes." />
        <meta name="keywords" content="how moving works, moving process, moving quotes, moving booking, Canadian moving companies, moving platform" />
        <link rel="canonical" href="https://movedin.com/how-it-works" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="How It Works | MovedIn - Simple Moving Process Explained" />
        <meta property="og:description" content="Discover how MovedIn simplifies your move: 7 easy steps from quote to booking. Get instant quotes from verified Canadian moving companies in minutes." />
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
        <meta name="twitter:description" content="Discover how MovedIn simplifies your move: 7 easy steps from quote to booking." />
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
      <main className="page-container how-it-works-page">
        {/* Hero Section - matches homepage style */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>How it works</h1>
              <p className="hero-description">
                Set up your move in seven simple steps. It's completely free and takes just a few minutes.
              </p>
              <button 
                className="hero-cta-button" 
                onClick={() => navigate('/')}
              >
                Get Your Free Quote Now
              </button>
            </div>
            <div className="hero-visual">
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">7</div>
                  <div className="stat-label">Simple Steps</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10</div>
                  <div className="stat-label">Minutes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Free</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="page-content">
          <article className="page-card">
            <div className="page-card-content">

              {/* Steps Section */}
              <section className="how-it-works-steps">
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={locationIcon} alt="Location" />
                      </div>
                      <h3>Move Details</h3>
                      <p>Tell us where and when you're moving - origin, destination, date, and time</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={servicesIcon} alt="Home" />
                      </div>
                      <h3>Origin Home</h3>
                      <p>Describe your current home - type, rooms, square footage, and special features</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={locationIcon} alt="Destination" />
                      </div>
                      <h3>Destination</h3>
                      <p>Tell us about your new home - property details and move-in requirements</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={calendarIcon} alt="Calendar" />
                      </div>
                      <h3>Choose Mover</h3>
                      <p>Compare real-time quotes from verified moving companies and select the best option</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={phoneIcon} alt="Phone" />
                      </div>
                      <h3>Contact Info</h3>
                      <p>Provide your contact information for booking confirmation and coordination</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">6</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={calendarIcon} alt="Review" />
                      </div>
                      <h3>Review & Pay</h3>
                      <p>Review your quote details and complete booking with a $100 deposit</p>
                    </div>
                  </div>

                  <div className="step-item">
                    <div className="step-number">7</div>
                    <div className="step-content">
                      <div className="step-icon">
                        <img src={checkIcon} alt="Check" />
                      </div>
                      <h3>Confirmation</h3>
                      <p>Your move is booked! Get confirmation and next steps from your chosen mover</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Benefits Section */}
              <section className="benefits-section">
                <h2>Why Choose MovedIn?</h2>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <div className="benefit-icon">⚡</div>
                    <h3>Instant Quotes</h3>
                    <p>Get real-time quotes from multiple verified movers in minutes</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🛡️</div>
                    <h3>Verified Movers</h3>
                    <p>All moving companies are licensed, insured, and background-checked</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">💰</div>
                    <h3>Best Prices</h3>
                    <p>Compare rates and find the most competitive pricing for your move</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">📱</div>
                    <h3>Easy Booking</h3>
                    <p>Complete your booking in just a few clicks with secure payment</p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HowItWorks;