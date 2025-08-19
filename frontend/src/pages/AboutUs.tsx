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
        <title>About MovedIn | Canada's Trusted Moving Platform | Licensed & Insured Movers</title>
        <meta name="description" content="MovedIn is Canada's premier moving platform connecting you with licensed, insured moving companies. Get instant quotes, transparent pricing, and professional service. Serving Toronto, Vancouver, Montreal, Calgary, and 50+ cities across Canada since 2024." />
        <meta name="keywords" content="moving company Canada, licensed movers Toronto, Vancouver moving services, Montreal movers, Calgary moving company, professional movers, insured moving services, moving quotes Canada, residential moving, commercial moving, long distance moving" />
        <link rel="canonical" href="https://movedin.com/about-us" />
        <meta property="og:title" content="About MovedIn | Canada's Premier Moving Platform | Licensed & Insured Movers" />
        <meta property="og:description" content="Connect with verified, licensed moving companies across Canada. Get instant quotes, transparent pricing, and professional service. Serving 50+ cities with 500+ verified movers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movedin.com/about-us" />
        <meta property="og:site_name" content="MovedIn" />
        <meta property="og:image" content="https://movedin.com/og-image-about.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About MovedIn | Canada's Moving Platform" />
        <meta name="twitter:description" content="Connect with 500+ verified moving companies across Canada. Get instant quotes and professional service." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MovedIn" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="CA" />
        <meta name="geo.placename" content="Canada" />
        <meta name="geo.position" content="45.4215;-75.6972" />
        <meta name="ICBM" content="45.4215, -75.6972" />
        <link rel="alternate" href="https://movedin.com/fr/about-us" hrefLang="fr" />
        <link rel="alternate" href="https://movedin.com/about-us" hrefLang="en" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MovedIn",
            "url": "https://movedin.com",
            "logo": "https://movedin.com/logo.png",
            "description": "Canada's premier moving platform connecting customers with licensed, insured moving companies",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "CA",
              "addressRegion": "Ontario"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-MOVEDIN",
              "contactType": "customer service",
              "email": "hello@movedin.ca",
              "availableLanguage": ["English", "French"]
            },
            "sameAs": [
              "https://www.facebook.com/movedin",
              "https://www.linkedin.com/company/movedin",
              "https://twitter.com/movedin"
            ]
          })}
        </script>
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="about-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="about-title">About MovedIn: Canada's Premier Moving Platform</h1>
              <p className="page-subtitle">Connecting Canadians with trusted, licensed moving companies since 2024. <Link to="/how-it-works">See how it works</Link> | <Link to="/tips-guides">Get moving tips</Link></p>
            </header>
            
            <div className="about-section">
              <h2>Our Mission & Vision</h2>
              <p className="mission-text">
                At MovedIn, we're revolutionizing the Canadian moving industry by creating a transparent, 
                efficient, and customer-first platform that connects Canadians with verified, licensed, 
                and insured moving companies. Our mission is to eliminate the stress, uncertainty, and 
                hidden costs that have traditionally plagued the moving experience.
              </p>
              <p>
                We envision a future where moving is simple, transparent, and enjoyable - where every 
                Canadian can access professional moving services with confidence, knowing they're working 
                with trusted partners who prioritize their belongings and satisfaction.
              </p>
            </div>
            
            <div className="about-section">
              <h2>Our Story: From Frustration to Innovation</h2>
              <p>
                MovedIn was born in 2024 from a simple yet powerful frustration: the traditional moving 
                industry was complex, opaque, and often frustrating for customers. Canadians were spending 
                countless hours calling multiple moving companies, waiting for callbacks, dealing with 
                inconsistent pricing, and worrying about the reliability of their chosen movers.
              </p>
              <p>
                Our founders, having experienced these challenges firsthand, decided to change the game. 
                They assembled a team of moving industry experts, technology professionals, and customer 
                service specialists to create a platform that would put customers first, every time.
              </p>
              <p>
                Today, we're proud to serve thousands of Canadians across the country, from major urban 
                centers like Toronto, Vancouver, and Montreal to smaller communities throughout Canada. 
                Our platform has facilitated successful moves for families, businesses, and individuals, 
                helping them find reliable movers at fair prices with complete transparency.
              </p>
            </div>
            
            <div className="values-section">
              <h2>Our Core Values & Principles</h2>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon">🤝</div>
                  <h3>Trust & Transparency</h3>
                  <p>We believe in complete transparency in everything we do. Every quote includes detailed breakdowns showing exactly what you're paying for. All our moving partners are thoroughly vetted, licensed, and insured. We never hide fees or surprise customers with additional costs.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">⚡</div>
                  <h3>Simplicity & Efficiency</h3>
                  <p>Moving is complicated enough without adding unnecessary complexity. We've streamlined the entire process from quote to booking, making it possible to secure professional moving services in minutes, not days. Our platform is designed to be intuitive and user-friendly.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">💎</div>
                  <h3>Quality & Excellence</h3>
                  <p>We partner only with moving companies that meet our rigorous standards for quality, reliability, and customer service. Every mover on our platform is licensed, insured, and has a proven track record of excellence. We continuously monitor performance and customer satisfaction.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🇨🇦</div>
                  <h3>Canadian Focus & Community</h3>
                  <p>We're built for Canadians, by Canadians. We understand the unique challenges of moving in our vast country - from urban apartments to rural properties, from coast to coast. We're committed to supporting local moving businesses and strengthening Canadian communities.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🛡️</div>
                  <h3>Safety & Security</h3>
                  <p>Your belongings and safety are our top priorities. We work exclusively with insured, bonded, and safety-certified moving companies. Our platform includes comprehensive insurance options and real-time tracking to ensure your move is secure from start to finish.</p>
                </div>
                
                <div className="value-card">
                  <div className="value-icon">🌱</div>
                  <h3>Sustainability & Responsibility</h3>
                  <p>We're committed to environmental responsibility and sustainable business practices. We partner with moving companies that use eco-friendly packing materials, fuel-efficient vehicles, and sustainable business practices. We're working to reduce the environmental impact of moving.</p>
                </div>
              </div>
            </div>
            
            <div className="stats-section">
              <h2>MovedIn by the Numbers: Our Impact & Growth</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">15,000+</div>
                  <div className="stat-label">Successful Moves Completed</div>
                  <div className="stat-description">Families, businesses, and individuals who trust us</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Verified Moving Partners</div>
                  <div className="stat-description">Licensed, insured, and customer-approved</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">75+</div>
                  <div className="stat-label">Cities & Communities Served</div>
                  <div className="stat-description">From major urban centers to rural areas</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">4.9★</div>
                  <div className="stat-label">Customer Satisfaction Rating</div>
                  <div className="stat-description">Based on verified customer reviews</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">98.7%</div>
                  <div className="stat-label">On-Time Delivery Rate</div>
                  <div className="stat-description">Professional service you can count on</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Customer Support</div>
                  <div className="stat-description">Always here when you need us</div>
                </div>
              </div>
            </div>
            
            <div className="about-section">
              <h2>Our Comprehensive Service Coverage</h2>
              <p>
                MovedIn serves the entire Canadian moving market with comprehensive coverage across all 
                provinces and territories. Our platform connects customers with moving companies that 
                specialize in various types of moves and services.
              </p>
              
              <h3>Types of Moves We Support:</h3>
              <ul>
                <li><strong>Residential Moves:</strong> Apartments, condos, houses, and townhomes</li>
                <li><strong>Commercial Moves:</strong> Office relocations, retail spaces, and industrial facilities</li>
                <li><strong>Long-Distance Moves:</strong> Cross-province and cross-country relocations</li>
                <li><strong>Local Moves:</strong> Same-city and same-region relocations</li>
                <li><strong>International Moves:</strong> Moving to and from Canada</li>
                <li><strong>Specialty Moves:</strong> Piano moving, art transport, and fragile items</li>
              </ul>
              
              <h3>Geographic Coverage:</h3>
              <p>
                We serve major Canadian cities including Toronto, Vancouver, Montreal, Calgary, Edmonton, 
                Ottawa, Winnipeg, Quebec City, Hamilton, Kitchener, London, Windsor, Victoria, Saskatoon, 
                Regina, Halifax, St. John's, and many more. Our network extends to rural communities 
                and remote areas across all provinces and territories.
              </p>
            </div>
            
            <div className="team-section">
              <h2>Our Expert Team & Leadership</h2>
              <p>
                MovedIn is powered by a diverse team of professionals who bring decades of combined 
                experience in the moving industry, technology, customer service, and business operations. 
                Our leadership team combines deep industry knowledge with innovative thinking to deliver 
                exceptional value to our customers and partners.
              </p>
              
              <h3>Leadership Team:</h3>
              <ul>
                <li><strong>CEO & Founder:</strong> Industry veteran with 15+ years in moving services</li>
                <li><strong>CTO:</strong> Technology expert specializing in platform development and AI</li>
                <li><strong>Head of Operations:</strong> Moving industry professional with logistics expertise</li>
                <li><strong>Head of Customer Success:</strong> Customer service leader focused on satisfaction</li>
                <li><strong>Head of Partnerships:</strong> Business development expert in moving industry</li>
              </ul>
              
              <p>
                Our team is constantly innovating and improving our platform based on customer feedback, 
                industry best practices, and emerging technologies. We're committed to staying at the 
                forefront of the moving industry and providing our customers with the best possible experience.
              </p>
            </div>
            
            <div className="about-section">
              <h2>Our Technology & Innovation</h2>
              <p>
                MovedIn leverages cutting-edge technology to deliver a seamless, efficient, and 
                user-friendly moving experience. Our platform combines advanced algorithms, real-time 
                data processing, and intuitive design to revolutionize how Canadians find and book 
                moving services.
              </p>
              
              <h3>Key Technological Features:</h3>
              <ul>
                <li><strong>AI-Powered Matching:</strong> Intelligent algorithms that match customers with the best moving companies</li>
                <li><strong>Real-Time Pricing:</strong> Instant, accurate quotes based on current market conditions</li>
                <li><strong>Advanced Analytics:</strong> Data-driven insights to improve service quality and efficiency</li>
                <li><strong>Mobile-First Design:</strong> Responsive platform optimized for all devices</li>
                <li><strong>Secure Payment Processing:</strong> Enterprise-grade security for all transactions</li>
                <li><strong>Real-Time Tracking:</strong> Live updates on move progress and status</li>
              </ul>
            </div>
            
            <div className="contact-section">
              <h2>Get in Touch & Connect With Us</h2>
              <p>
                We're here to help with any questions, feedback, or support you need. Our customer 
                service team is available 24/7 to ensure you always have access to the help you need, 
                when you need it.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <strong>Customer Service Email:</strong> hello@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Business Inquiries:</strong> business@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Partnership Opportunities:</strong> partnerships@movedin.ca
                </div>
                <div className="contact-item">
                  <strong>Customer Support Phone:</strong> 1-800-MOVEDIN (1-800-668-3346)
                </div>
                <div className="contact-item">
                  <strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
                </div>
                <div className="contact-item">
                  <strong>Emergency Support:</strong> Available 24/7 for urgent moving issues
                </div>
                <div className="contact-item">
                  <strong>Social Media:</strong> Follow us on Facebook, Twitter, LinkedIn, and Instagram
                </div>
              </div>
            </div>
            
            <div className="about-section">
              <h2>Legal & Privacy Information</h2>
              <p>
                At MovedIn, we're committed to protecting your privacy and ensuring transparency in 
                all our operations. We operate in full compliance with Canadian privacy laws and 
                industry regulations.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><a href="/privacy-policy">Privacy Policy</a> - How we protect and use your information</li>
                <li><a href="/terms-of-service">Terms of Service</a> - Our service agreement and policies</li>
                <li><a href="/cookie-policy">Cookie Policy</a> - How we use cookies and tracking technologies</li>
                <li><a href="/accessibility">Accessibility Statement</a> - Our commitment to accessibility</li>
                <li><a href="/data-protection">Data Protection</a> - How we secure your personal information</li>
              </ul>
            </div>
            
            <div className="about-section">
              <h2>Your Rights & Data Protection</h2>
              <p>
                As a MovedIn customer, you have important rights regarding your personal information 
                and how we handle your data. We're committed to transparency and giving you full 
                control over your information.
              </p>
              <ul>
                <li>Access, correct, or delete your personal data at any time</li>
                <li>Request a complete copy of your data in a portable format</li>
                <li>Opt out of marketing communications and data sharing</li>
                <li>Request detailed information about our data practices and policies</li>
                <li>File complaints or concerns about data handling</li>
                <li>Request data portability to other service providers</li>
              </ul>
              <p>
                For any legal or privacy requests, contact our dedicated legal team: 
                <a href="mailto:legal@movedin.ca">legal@movedin.ca</a>
              </p>
            </div>
            
            <div className="cta-section">
              <h2>Ready to Experience the MovedIn Difference?</h2>
              <p>
                Join thousands of Canadians who have already simplified their moving experience with 
                our innovative platform. Get instant quotes from verified moving companies, enjoy 
                transparent pricing, and experience professional service that puts you first.
              </p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Moving Quote Now
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