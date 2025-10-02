import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './Page.css';

// Import real movers image
import realMoversImage from '../assets/imgs-png/img_real movers with cartons.png';

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
        <meta property="og:description" content="Connect with verified moving companies across Canada. Get instant quotes and professional service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MovedIn" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform" />
        <meta property="og:description" content="Connect with verified moving companies across Canada. Get instant quotes and professional service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:locale" content="en_CA" />
        <meta property="og:image" content="https://movedin.com/og-image-about.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About MovedIn | Canada's Premier Moving Platform" />
        <meta name="twitter:description" content="Connect with verified moving companies across Canada. Get instant quotes and professional service." />
        <meta name="twitter:image" content="https://movedin.com/twitter-image-about.jpg" />
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
              "email": "support@movedin.com",
              "telephone": "+1-437-979-3830"
            },
            "sameAs": [
              "https://movedin.com/about-us",
              "https://movedin.com/how-it-works",
              "https://movedin.com/tips-guides"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Moving Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Residential Moving",
                    "description": "Professional residential moving services across Canada"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Commercial Moving",
                    "description": "Commercial and office relocation services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Long Distance Moving",
                    "description": "Cross-province and long-distance moving services"
                  }
                }
              ]
            },
            "areaServed": {
              "@type": "Country",
              "name": "Canada"
            },
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": 43.6532,
                "longitude": -79.3832
              },
              "geoRadius": "5000000"
            }
          })}
        </script>
      </Helmet>
      <main className="page-container" aria-labelledby="about-title">
        <div className="page-content">
          <article className="page-card">
            <header className="about-header">
              <h1 id="about-title">About us</h1>
              <h2 className="about-main-title">We know how stressful moving can be, but also believe it shouldn't be.</h2>
              <p className="about-description">
                Moving to a new place should be one of the most exciting life events we have, but it often comes with so much stress. We get it! That's why we created MovedIn to help people like you (and like ourselves) take care of all the "not fun" logistics of all the stressful parts of a move, so you can start focusing on that next chapter of your life.
              </p>
            </header>

            {/* We are here to help Section */}
            <section className="help-section">
              <div className="help-content">
                <div className="help-image">
                  <img src={realMoversImage} alt="Professional movers helping customers" className="real-movers-image" />
                </div>
                <div className="help-text">
                  <h2>We are here to help</h2>
                  <p>
                    Whether you're about to move and looking for help, a service provider that is interested in partnering, or a professional in the real estate and looking to help elevate your clients' most meaningful life experiences, we are here to help.
                  </p>
                  <Link to="/#/" className="cta-button">
                    Start a quote
                  </Link>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default AboutUs; 