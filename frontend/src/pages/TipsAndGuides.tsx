import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './TipsAndGuides.css';

// Import blog images
import blogMovingStress from '../assets/imgs-png/img_blog-dealing.jpg';
import blogEssentialChecklist from '../assets/imgs-png/img_blog-essential.jpg';
import blogWinterTips from '../assets/imgs-png/img_blog-toronto.jpg';
import blogStressFree from '../assets/imgs-png/img_blog-moving.jpg';

// Import profile images
import profileNarender from '../assets/imgs-png/img_profile-narender.png';

// Import icons
import arrowIcon from '../assets/icons-svg/icon_arrow-purple.svg';
import sendIcon from '../assets/icons-svg/icon_send-gray.svg';

const TipsAndGuides: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Moving Tips & Guides | MovedIn - Expert Advice for a Smooth Move</title>
        <meta name="description" content="Expert moving tips and guides from MovedIn. Learn how to plan, pack, save money, and settle in with our comprehensive moving guide." />
        <link rel="canonical" href="https://movedin.com/tips-guides" />
        <meta property="og:title" content="Moving Tips & Guides | MovedIn" />
        <meta property="og:description" content="Expert moving tips and guides from MovedIn. Learn how to plan, pack, save money, and settle in with our comprehensive moving guide." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://movedin.com/tips-guides" />
        <meta property="og:site_name" content="MovedIn" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <main className="page-container tips-guides-container" aria-labelledby="tips-guides-title">
        <div className="page-content">
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <p className="hero-breadcrumb">Read our Blogs</p>
                <h1 id="tips-guides-title" className="hero-title">
                  On The <span className="highlight">MovedIn</span>: Your Ultimate Guide to a Seamless Relocation
                </h1>
                <p className="hero-subtitle">
                  Mastering the Art of Packing, Planning, and Settling into Your New Home
                </p>
              </div>
              <div className="hero-actions">
                <Link to="/#/" className="hero-cta-button">
                  Get Your Free Quote
                </Link>
                <Link to="#blog-grid" className="hero-secondary-button">
                  Browse Articles
                </Link>
              </div>
            </div>
          </section>
            
          {/* Blog Grid Section */}
          <section className="blog-grid-section">
            <div className="blog-grid-content">
              
              {/* Blog Grid */}
              <div className="blog-grid">
                
                {/* Blog Card 1 */}
                <Link to="/articles/moving-stress" className="blog-card-link">
                  <article className="blog-card">
                    <img 
                      src={blogMovingStress} 
                      alt="Dealing with Moving Stress" 
                      className="blog-card-image"
                    />
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">Dealing with Moving Stress: Top Relaxation Techniques</h3>
                      <p className="blog-card-excerpt">
                        Moving to a new home can be one of the most stressful times. You are uprooting your entire life...
                      </p>
                      <div className="blog-card-meta">
                        <img 
                          src={profileNarender} 
                          alt="Narender Surakandi" 
                          className="blog-card-author-image"
                        />
                        <div className="blog-card-author-info">
                          <span className="blog-card-author-name">Narender Surakandi</span>
                          <span className="blog-card-date">18 Sep 2023</span>
                        </div>
                      </div>
                      <img src={arrowIcon} alt="Read more" className="blog-card-arrow" />
                    </div>
                  </article>
                </Link>

                {/* Blog Card 2 */}
                <Link to="/articles/essential-checklist" className="blog-card-link">
                  <article className="blog-card">
                    <img 
                      src={blogEssentialChecklist} 
                      alt="Essential Moving Checklist" 
                      className="blog-card-image"
                    />
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">The Essential Moving Checklist for Torontonians</h3>
                      <p className="blog-card-excerpt">
                        Moving is one of the most stressful things most people experience in life. Not least of all...
                      </p>
                      <div className="blog-card-meta">
                        <img 
                          src={profileNarender} 
                          alt="Narender Surakandi" 
                          className="blog-card-author-image"
                        />
                        <div className="blog-card-author-info">
                          <span className="blog-card-author-name">Narender Surakandi</span>
                          <span className="blog-card-date">18 Sep 2023</span>
                        </div>
                      </div>
                      <img src={arrowIcon} alt="Read more" className="blog-card-arrow" />
                    </div>
                  </article>
                </Link>

                {/* Blog Card 3 */}
                <Link to="/articles/winter-moving-tips" className="blog-card-link">
                  <article className="blog-card">
                    <img 
                      src={blogWinterTips} 
                      alt="Winter Moving Tips" 
                      className="blog-card-image"
                    />
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">Moving in the Winter: Special Tips for Toronto Residents</h3>
                      <p className="blog-card-excerpt">
                        Moving to a new home can be one of the most stressful times. You are uprooting your entire life...
                      </p>
                      <div className="blog-card-meta">
                        <img 
                          src={profileNarender} 
                          alt="Narender Surakandi" 
                          className="blog-card-author-image"
                        />
                        <div className="blog-card-author-info">
                          <span className="blog-card-author-name">Narender Surakandi</span>
                          <span className="blog-card-date">18 Sep 2023</span>
                        </div>
                      </div>
                      <img src={arrowIcon} alt="Read more" className="blog-card-arrow" />
                    </div>
                  </article>
                </Link>

                {/* Blog Card 4 */}
                <Link to="/articles/moving-checklist" className="blog-card-link">
                  <article className="blog-card">
                    <img 
                      src={blogEssentialChecklist} 
                      alt="Ultimate Moving Checklist" 
                      className="blog-card-image"
                    />
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">Ultimate Moving Checklist: 8 Weeks to Moving Day</h3>
                      <p className="blog-card-excerpt">
                        Complete moving checklist with timeline from 8 weeks before to moving day. Never forget anything important...
                      </p>
                      <div className="blog-card-meta">
                        <img 
                          src={profileNarender} 
                          alt="MovedIn Team" 
                          className="blog-card-author-image"
                        />
                        <div className="blog-card-author-info">
                          <span className="blog-card-author-name">MovedIn Team</span>
                          <span className="blog-card-date">Dec 20, 2023</span>
                        </div>
                      </div>
                      <img src={arrowIcon} alt="Read more" className="blog-card-arrow" />
                    </div>
                  </article>
                </Link>

                {/* Featured Blog Card */}
                <article className="blog-card featured">
                  <img 
                    src={blogStressFree} 
                    alt="Stress-Free Move in Toronto" 
                    className="blog-card-image"
                  />
                  <div className="blog-card-content">
                    <h3 className="blog-card-title">How to Plan a Stress-Free Move in Toronto</h3>
                    <p className="blog-card-excerpt">
                      Moving to a new home can be one of the most stressful times. You are uprooting your entire life and starting fresh in a new place...
                    </p>
                    <div className="blog-card-meta">
                      <img 
                        src={profileNarender} 
                        alt="Narender Surakandi" 
                        className="blog-card-author-image"
                      />
                      <div className="blog-card-author-info">
                        <span className="blog-card-author-name">Narender Surakandi</span>
                        <span className="blog-card-date">18 Sep 2023</span>
                  </div>
                    </div>
                    <img src={arrowIcon} alt="Read more" className="blog-card-arrow" />
                  </div>
                </article>

                </div>
                
              {/* Newsletter Section */}
              <aside className="newsletter-section">
                <img src={sendIcon} alt="Newsletter" className="newsletter-icon" />
                <h3 className="newsletter-title">Weekly newsletter</h3>
                <p className="newsletter-description">
                  No spam. Just the latest releases and tips, interesting articles, and exclusive interviews in your inbox every week.
                </p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="newsletter-input"
                    required
                  />
                  <p className="newsletter-privacy">
                    Read about our <a href="/privacy">privacy policy</a>.
                  </p>
                  <button type="submit" className="newsletter-button">
                    Subscribe
                  </button>
                </form>
              </aside>

              </div>
            </section>
            
        </div>
      </main>
      
      <StaticFooter />
    </>
  );
};

export default TipsAndGuides; 