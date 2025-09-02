import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

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
      <main className="page-container" aria-labelledby="how-it-works-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="how-it-works-title">How MovedIn Works</h1>
              <p className="page-subtitle">Your complete guide to stress-free moving in 4 simple steps. Get instant quotes from verified Canadian moving companies and book your move in minutes. <Link to="/">Get a quote now</Link> or explore our <Link to="/tips-guides">moving tips & guides</Link>.</p>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h2>Moving Made Simple</h2>
                <p>From getting quotes to booking your move, MovedIn handles everything. No more phone calls, no more waiting, no more stress.</p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">4</span>
                    <span className="stat-label">Simple Steps</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">2-5</span>
                    <span className="stat-label">Minutes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Online</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Process Overview */}
            <section className="process-overview">
              <h2>The MovedIn Process</h2>
              <p className="section-intro">Our streamlined process eliminates the traditional moving company hassles. Here's exactly how it works:</p>
              
              <div className="process-timeline">
                <div className="timeline-item" id="step-1">
                  <div className="timeline-marker">1</div>
                  <div className="timeline-content">
                    <h3>Tell Us About Your Move</h3>
                    <p>Start by providing basic information about your move. We'll ask for:</p>
                    <ul>
                      <li><strong>Current & New Addresses:</strong> We'll calculate distance and travel time</li>
                      <li><strong>Move Date & Time:</strong> Choose your preferred moving schedule</li>
                      <li><strong>Home Details:</strong> Number of rooms, home type, special items</li>
                      <li><strong>Contact Information:</strong> So we can send you quotes and updates</li>
                    </ul>
                    <div className="step-tip">
                      <span className="tip-icon">💡</span>
                      <span className="tip-text">The more details you provide, the more accurate your quotes will be!</span>
                    </div>
                  </div>
                </div>

                <div className="timeline-item" id="step-2">
                  <div className="timeline-marker">2</div>
                  <div className="timeline-content">
                    <h3>Get Instant Quotes</h3>
                    <p>Our intelligent system connects with verified moving companies in your area:</p>
                    <ul>
                      <li><strong>Real-Time Pricing:</strong> Get quotes based on current rates and availability</li>
                      <li><strong>Multiple Options:</strong> Compare 3-5 different moving companies</li>
                      <li><strong>Detailed Breakdowns:</strong> See exactly what's included in each quote</li>
                      <li><strong>Company Profiles:</strong> Learn about each mover's experience and specialties</li>
                    </ul>
                    <div className="step-tip">
                      <span className="tip-icon">⚡</span>
                      <span className="tip-text">Quotes are generated in seconds, not hours or days!</span>
                    </div>
                  </div>
                </div>

                <div className="timeline-item" id="step-3">
                  <div className="timeline-marker">3</div>
                  <div className="timeline-content">
                    <h3>Choose Your Mover</h3>
                    <p>Review and compare your quotes to make the best choice:</p>
                    <ul>
                      <li><strong>Price Comparison:</strong> See total costs, hourly rates, and any additional fees</li>
                      <li><strong>Service Details:</strong> Crew size, equipment, packing options, and insurance</li>
                      <li><strong>Company Reviews:</strong> Read feedback from previous customers</li>
                      <li><strong>Availability Confirmation:</strong> Ensure your chosen date works for the company</li>
                    </ul>
                    <div className="step-tip">
                      <span className="tip-icon">🔍</span>
                      <span className="tip-text">Take your time comparing - all quotes are valid for 24 hours!</span>
                    </div>
                  </div>
                </div>

                <div className="timeline-item" id="step-4">
                  <div className="timeline-marker">4</div>
                  <div className="timeline-content">
                    <h3>Secure Your Booking</h3>
                    <p>Complete your booking with our secure payment system:</p>
                    <ul>
                      <li><strong>Secure Payment:</strong> Pay a small deposit to confirm your booking</li>
                      <li><strong>Instant Confirmation:</strong> Receive immediate booking confirmation</li>
                      <li><strong>Company Connection:</strong> We'll introduce you to your chosen mover</li>
                      <li><strong>Move Coordination:</strong> Work directly with the company to finalize details</li>
                    </ul>
                    <div className="step-tip">
                      <span className="tip-icon">✅</span>
                      <span className="tip-text">Your move is now secured and confirmed!</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose MovedIn */}
            <section className="why-choose-section">
              <h2>Why Choose MovedIn?</h2>
              <p className="section-intro">We've revolutionized the moving industry by making it simple, transparent, and trustworthy.</p>
              
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">⚡</div>
                  <h3>Lightning Fast</h3>
                  <p>Get multiple quotes in under 5 minutes. No more waiting for callbacks or email responses.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">💰</div>
                  <h3>Transparent Pricing</h3>
                  <p>See exactly what you're paying for with detailed cost breakdowns. No hidden fees or surprises.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">🛡️</div>
                  <h3>Verified & Trusted</h3>
                  <p>All moving companies are licensed, insured, and thoroughly vetted. Your safety is our priority.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">📱</div>
                  <h3>100% Online</h3>
                  <p>Complete your entire booking online. No phone calls, no paperwork, no hassle.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">🇨🇦</div>
                  <h3>Canadian Owned</h3>
                  <p>Built by Canadians, for Canadians. We understand local moving challenges and regulations.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">🎯</div>
                  <h3>Personalized Service</h3>
                  <p>Get quotes tailored to your specific move. No one-size-fits-all pricing here.</p>
                </div>
              </div>
            </section>

            {/* What's Included */}
            <section className="whats-included-section">
              <h2>What's Included in Your Quote</h2>
              <p className="section-intro">Every MovedIn quote includes comprehensive moving services and protection.</p>
              
              <div className="included-grid">
                <div className="included-item">
                  <h3>🚛 Moving Services</h3>
                  <ul>
                    <li>Professional moving crew</li>
                    <li>Moving truck and equipment</li>
                    <li>Loading and unloading</li>
                    <li>Furniture protection</li>
                  </ul>
                </div>
                
                <div className="included-item">
                  <h3>🛡️ Protection & Insurance</h3>
                  <ul>
                    <li>Basic moving insurance</li>
                    <li>Furniture blankets and padding</li>
                    <li>Professional packing materials</li>
                    <li>Damage protection</li>
                  </ul>
                </div>
                
                <div className="included-item">
                  <h3>📋 Support & Coordination</h3>
                  <ul>
                    <li>Move day coordination</li>
                    <li>Customer support throughout</li>
                    <li>Emergency contact numbers</li>
                    <li>Move tracking and updates</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <p className="section-intro">Get answers to common questions about how MovedIn works.</p>
              
              <div className="faq-grid">
                <div className="faq-item">
                  <h3>How accurate are the quotes?</h3>
                  <p>Our quotes are based on real-time data from moving companies and include all standard services. The final price may vary slightly based on actual move time and any additional services you request.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What if I need to change my move date?</h3>
                  <p>Contact your chosen moving company directly to reschedule. Most companies are flexible and will work with you to find a new date that works for both parties.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Do I need to be home during the quote process?</h3>
                  <p>No! You can get quotes and book your move from anywhere. The moving company will contact you to schedule a pre-move inspection if needed.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What happens after I book?</h3>
                  <p>We'll connect you with your chosen moving company within 24 hours. They'll contact you to confirm details and coordinate your move day logistics.</p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <div className="cta-content">
                <h2>Ready to Simplify Your Move?</h2>
                <p>Join thousands of Canadians who have transformed their moving experience with MovedIn. Get started in minutes, not hours.</p>
                <div className="cta-buttons">
                  <button className="cta-button primary" onClick={() => navigate('/')}>
                    Get Your Free Quote Now
                  </button>
                  <Link to="/tips-guides" className="cta-button secondary">
                    Read Moving Tips
                  </Link>
                </div>
                <p className="cta-note">No commitment required • Instant quotes • Verified companies</p>
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