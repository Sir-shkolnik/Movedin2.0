import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate('/quote');
  };

  return (
    <>
      <Helmet>
        <title>MovedIn - Get Moving Quotes from Verified Canadian Movers | Free Instant Quotes</title>
        <meta name="description" content="Get instant moving quotes from verified, licensed Canadian moving companies. Compare prices, read reviews, and book with confidence. Serving all major Canadian cities." />
        <meta name="keywords" content="moving quotes, Canadian movers, moving companies, Toronto movers, Vancouver movers, Montreal movers, Calgary movers, moving services, instant quotes, verified movers" />
        <link rel="canonical" href="https://movedin.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="MovedIn - Get Moving Quotes from Verified Canadian Movers" />
        <meta property="og:description" content="Get instant moving quotes from verified, licensed Canadian moving companies. Compare prices and book with confidence." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-home.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MovedIn - Get Moving Quotes from Verified Canadian Movers" />
        <meta name="twitter:description" content="Get instant moving quotes from verified, licensed Canadian moving companies. Compare prices and book with confidence." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-home.jpg" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MovedIn" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MovedIn",
            "description": "Canada's premier moving platform connecting customers with verified, licensed moving companies",
            "url": "https://movedin.com",
            "logo": "https://movedin.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-MOVEDIN",
              "contactType": "customer service",
              "email": "support@movedin.com"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Canada"
            },
            "serviceType": "Moving Services",
            "offers": {
              "@type": "Offer",
              "description": "Instant moving quotes from verified Canadian moving companies",
              "price": "0",
              "priceCurrency": "CAD"
            }
          })}
        </script>
      </Helmet>

      <Header />
      <main className="page-container" aria-labelledby="homepage-title">
        <div className="page-content">
          
          {/* Main Content */}
          <article className="page-card">
            <header>
              <h1 id="homepage-title">Welcome to MovedIn</h1>
              <p className="page-subtitle">
                Canada's premier moving platform connecting customers with verified, licensed moving companies. 
                Get instant quotes, compare prices, and book with confidence. <Link to="/quote">Get a quote now</Link> or explore our <Link to="/tips-guides">moving tips & guides</Link>.
              </p>
            </header>

            <section className="intro-section">
              <h2>Why Choose MovedIn?</h2>
              <p>
                Moving can be stressful, but finding the right moving company shouldn't be. MovedIn simplifies the process by connecting you with verified, licensed moving companies across Canada. Our platform ensures you get the best service at competitive prices, with complete transparency and no hidden fees.
              </p>
              <div className="cta-section">
                <button 
                  className="cta-button primary" 
                  onClick={handleGetQuote}
                  aria-label="Get your free moving quote now"
                >
                  Get Free Quote Now
                </button>
                <p className="cta-subtitle">✓ Free quotes • ✓ No obligation • ✓ Licensed movers • ✓ Transparent pricing</p>
              </div>
            </section>
          </article>

          <article className="page-card">
            <section className="how-it-works-section">
              <h2>How MovedIn Works</h2>
              <p className="section-intro">Get your moving quote in 4 simple steps</p>
              
              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Tell Us About Your Move</h3>
                    <p>Share your moving details - where, when, and what you're moving. Takes just 2 minutes to complete our simple form.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Get Instant Quotes</h3>
                    <p>Receive quotes from verified, licensed moving companies in your area within minutes. No waiting for callbacks.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Compare & Choose</h3>
                    <p>Review detailed quotes, read reviews, and select the mover that's right for you. All pricing is transparent with no hidden fees.</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Book & Move</h3>
                    <p>Secure your booking with a small deposit and move with confidence. Your mover will handle everything from there.</p>
                  </div>
                </div>
              </div>
            </section>
          </article>

          <article className="page-card">
            <section className="why-choose-section">
              <h2>Why Choose MovedIn?</h2>
              <p className="section-intro">Canada's most trusted moving platform</p>
              
              <div className="benefits-grid">
                <div className="benefit-item">
                  <h3>🛡️ Verified & Licensed</h3>
                  <p>All moving companies are fully licensed, insured, and background-checked for your peace of mind.</p>
                </div>
                <div className="benefit-item">
                  <h3>⚡ Instant Quotes</h3>
                  <p>Get multiple quotes in minutes, not days. No waiting for callbacks or lengthy phone calls.</p>
                </div>
                <div className="benefit-item">
                  <h3>💰 Transparent Pricing</h3>
                  <p>No hidden fees or surprise charges. See exactly what you'll pay before you book.</p>
                </div>
                <div className="benefit-item">
                  <h3>🇨🇦 Canadian Owned</h3>
                  <p>Supporting local Canadian businesses. We understand Canadian moving needs and regulations.</p>
                </div>
                <div className="benefit-item">
                  <h3>⭐ Customer Reviews</h3>
                  <p>Read real reviews from real customers. Make informed decisions based on actual experiences.</p>
                </div>
                <div className="benefit-item">
                  <h3>📞 24/7 Support</h3>
                  <p>Our customer support team is here to help you every step of the way, whenever you need us.</p>
                </div>
              </div>
            </section>
          </article>

          <article className="page-card">
            <section className="service-areas-section">
              <h2>We Serve All Major Canadian Cities</h2>
              <p className="section-intro">From coast to coast, we connect you with the best local movers</p>
              
              <div className="cities-grid">
                <div className="city-group">
                  <h3>Ontario</h3>
                  <p>Toronto, Ottawa, Hamilton, Kitchener-Waterloo, London, Windsor, and all major Ontario cities.</p>
                </div>
                <div className="city-group">
                  <h3>British Columbia</h3>
                  <p>Vancouver, Victoria, Surrey, Burnaby, Richmond, Kelowna, and throughout BC.</p>
                </div>
                <div className="city-group">
                  <h3>Quebec</h3>
                  <p>Montreal, Quebec City, Laval, Gatineau, Longueuil, Sherbrooke, and across Quebec.</p>
                </div>
                <div className="city-group">
                  <h3>Alberta</h3>
                  <p>Calgary, Edmonton, Red Deer, Lethbridge, St. Albert, Medicine Hat, and all Alberta cities.</p>
                </div>
                <div className="city-group">
                  <h3>Other Provinces</h3>
                  <p>Winnipeg (MB), Halifax (NS), Saskatoon & Regina (SK), St. John's (NL), Charlottetown (PE), and more.</p>
                </div>
              </div>
            </section>
          </article>

          <article className="page-card">
            <section className="testimonials-section">
              <h2>What Our Customers Say</h2>
              <p className="section-intro">Real reviews from real customers across Canada</p>
              
              <div className="testimonials-grid">
                <div className="testimonial-item">
                  <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                  <blockquote>
                    "MovedIn made finding a mover so easy! Got 3 quotes in minutes and saved $500 compared to the first company I called. Highly recommend!"
                  </blockquote>
                  <cite>— Sarah M., Toronto, ON</cite>
                </div>
                <div className="testimonial-item">
                  <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                  <blockquote>
                    "The movers were professional, on time, and careful with our belongings. The booking process was seamless. Will definitely use again!"
                  </blockquote>
                  <cite>— Michael R., Vancouver, BC</cite>
                </div>
                <div className="testimonial-item">
                  <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                  <blockquote>
                    "No more calling multiple companies! MovedIn gave me all the quotes I needed in one place. The transparency in pricing was refreshing."
                  </blockquote>
                  <cite>— Jennifer L., Montreal, QC</cite>
                </div>
              </div>
            </section>
          </article>

          <article className="page-card">
            <section className="final-cta-section">
              <h2>Ready to Make Your Move?</h2>
              <p>Join thousands of Canadians who trust MovedIn for their moving needs. Get your free quote today and experience the difference of working with verified, professional movers.</p>
              
              <div className="cta-section">
                <button 
                  className="cta-button primary" 
                  onClick={handleGetQuote}
                  aria-label="Get your free moving quote now"
                >
                  Get Free Quote Now
                </button>
                <p className="cta-subtitle">✓ Free quotes • ✓ No obligation • ✓ Licensed movers • ✓ Transparent pricing</p>
              </div>
              
              <p>Want to learn more about our process? <Link to="/how-it-works">See how MovedIn works</Link> or explore our <Link to="/tips-guides">moving tips and guides</Link>.</p>
            </section>
          </article>

        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default HomePage;