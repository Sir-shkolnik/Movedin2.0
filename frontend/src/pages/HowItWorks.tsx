import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

// Import icons and images
import locationIcon from '../assets/icons-svg/icon_location-purple.svg';
import calendarIcon from '../assets/icons-svg/icon_calendar-purple.svg';
import servicesIcon from '../assets/icons-svg/icon_home-services-black.svg';
import phoneIcon from '../assets/icons-svg/icon_phone-purple.svg';
import formStep1 from '../assets/imgs-png/img_form1.png';
import formStep2 from '../assets/imgs-png/img_form2.png';
import formStep3 from '../assets/imgs-png/img_form3.png';
import formStep4 from '../assets/imgs-png/img_form4.png';

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
      <main className="page-container how-it-works-page" aria-labelledby="how-it-works-title">
        <div className="page-content">
          <article className="page-card">
            <header className="how-it-works-header">
              <h1 id="how-it-works-title">How it works</h1>
              <p className="how-it-works-subtitle">Set up your move in four simple steps. It's completely free.</p>
            </header>

            {/* Compact Steps Section */}
            <section className="how-it-works-steps">
              <div className="steps-container">
                <div className="step-item">
                  <div className="step-visual">
                    <img src={formStep1} alt="Step 1: Enter your address" className="step-image" />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <div className="step-icon">
                        <img src={locationIcon} alt="Location icon" />
                      </div>
                      <div className="step-number">1</div>
                    </div>
                    <h3>Enter your address</h3>
                    <p>Start by telling us where you are moving from and to</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-visual">
                    <img src={formStep2} alt="Step 2: Select your moving date" className="step-image" />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <div className="step-icon">
                        <img src={calendarIcon} alt="Calendar icon" />
                      </div>
                      <div className="step-number">2</div>
                    </div>
                    <h3>Select your moving date & time</h3>
                    <p>Choose your preferred moving schedule</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-visual">
                    <img src={formStep3} alt="Step 3: Tell us about your service needs" className="step-image" />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <div className="step-icon">
                        <img src={servicesIcon} alt="Services icon" />
                      </div>
                      <div className="step-number">3</div>
                    </div>
                    <h3>Tell us about your service needs</h3>
                    <p>Describe what services you require</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-visual">
                    <img src={formStep4} alt="Step 4: Provide contact info" className="step-image" />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <div className="step-icon">
                        <img src={phoneIcon} alt="Phone icon" />
                      </div>
                      <div className="step-number">4</div>
                    </div>
                    <h3>Finalized by provide contact info</h3>
                    <p>Complete your booking with contact details</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="how-it-works-cta">
              <div className="cta-content">
                <h2>Ready to get started?</h2>
                <p>Join thousands of Canadians who have simplified their moving experience with MovedIn.</p>
                <button className="cta-button primary" onClick={() => navigate('/')}>
                  Get Your Free Quote Now
                </button>
              </div>
            </section>
          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HowItWorks; 