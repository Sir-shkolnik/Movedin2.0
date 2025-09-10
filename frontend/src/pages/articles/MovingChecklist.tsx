import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Header/Header';
import StaticFooter from '../../components/Footer/StaticFooter';
import './BlogArticle.css';

// Import blog images
import blogHeroImage from '../../assets/imgs-png/img_blog-checklist.jpg';
import blogContent1 from '../../assets/imgs-png/img_blog-essentials_content_1.png';
import blogContent2 from '../../assets/imgs-png/img_blog-essentials_content_2.jpg';

// Import icons
import checkIcon from '../../assets/icons-svg/icon_check-purple.svg';
import arrowIcon from '../../assets/icons-svg/icon_arrow-purple.svg';

const MovingChecklist: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ultimate Moving Checklist: 8 Weeks to Moving Day | MovedIn</title>
        <meta name="description" content="Complete moving checklist with timeline from 8 weeks before to moving day. Never forget anything important during your move with this comprehensive guide." />
        <meta name="keywords" content="moving checklist, moving timeline, moving preparation, moving day checklist, moving guide" />
        <link rel="canonical" href="https://movedin.com/articles/moving-checklist" />
        <meta property="og:title" content="Ultimate Moving Checklist: 8 Weeks to Moving Day" />
        <meta property="og:description" content="Complete moving checklist with timeline from 8 weeks before to moving day. Never forget anything important during your move." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://movedin.com/articles/moving-checklist" />
        <meta property="og:image" content="https://movedin.com/assets/img_blog-checklist.jpg" />
      </Helmet>
      
      <Header />
      <main className="blog-article-container">
        <div className="blog-article-content">
          
          {/* Hero Section */}
          <section className="blog-hero">
            <div className="blog-hero-content">
              <div className="blog-hero-text">
                <div className="blog-meta">
                  <span className="read-time">12 min read</span>
                </div>
                <h1 className="blog-title">Ultimate Moving Checklist: 8 Weeks to Moving Day</h1>
                <p className="blog-subtitle">Your Complete Timeline for a Stress-Free Move - Never Miss a Step Again</p>
                <div className="blog-author">
                  <img src={blogContent1} alt="MovedIn Team" className="author-avatar" />
                  <div className="author-info">
                    <span className="author-name">MovedIn Team</span>
                    <span className="publish-date">December 20, 2023</span>
                  </div>
                </div>
              </div>
              <div className="blog-hero-image">
                <img src={blogHeroImage} alt="Moving checklist" className="hero-img" />
              </div>
            </div>
          </section>

          {/* Article Content */}
          <div className="article-layout">
            <article className="article-main">
              
              {/* Introduction */}
              <section id="introduction" className="article-section">
                <h2>Introduction</h2>
                <p>Moving can be overwhelming, but with the right checklist, you can transform chaos into a smooth, organized process. This comprehensive 8-week moving checklist will guide you through every step, ensuring nothing falls through the cracks.</p>
                <p>Whether you're moving across town or across the country, this timeline will help you stay on track and reduce stress as your moving day approaches.</p>
              </section>

              {/* 8 Weeks Before */}
              <section id="8-weeks-before" className="article-section">
                <h2>8 Weeks Before Moving Day</h2>
                <div className="checklist-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker">8</div>
                    <div className="timeline-content">
                      <h3>Research and Plan</h3>
                      <ul className="checklist">
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Research moving companies and get quotes</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Set your moving budget</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Create a moving binder or digital folder</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Start decluttering your home</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Research your new neighborhood</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6 Weeks Before */}
              <section id="6-weeks-before" className="article-section">
                <h2>6 Weeks Before Moving Day</h2>
                <div className="checklist-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker">6</div>
                    <div className="timeline-content">
                      <h3>Book Services and Notify</h3>
                      <ul className="checklist">
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Book your moving company</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Notify your landlord (if renting)</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Schedule utility transfers</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Start packing non-essential items</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Update your address with important services</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4 Weeks Before */}
              <section id="4-weeks-before" className="article-section">
                <h2>4 Weeks Before Moving Day</h2>
                <div className="checklist-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker">4</div>
                    <div className="timeline-content">
                      <h3>Organize and Pack</h3>
                      <ul className="checklist">
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Pack seasonal items and decorations</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Organize important documents</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Schedule time off work</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Arrange for childcare/pet care</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Start using up perishable food</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2 Weeks Before */}
              <section id="2-weeks-before" className="article-section">
                <h2>2 Weeks Before Moving Day</h2>
                <div className="checklist-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker">2</div>
                    <div className="timeline-content">
                      <h3>Final Preparations</h3>
                      <ul className="checklist">
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Confirm moving day details</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Pack most of your belongings</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Clean and prepare your new home</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Arrange for parking permits</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Plan your moving day meals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Moving Day */}
              <section id="moving-day" className="article-section">
                <h2>Moving Day Checklist</h2>
                <div className="checklist-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker">📦</div>
                    <div className="timeline-content">
                      <h3>Final Steps</h3>
                      <ul className="checklist">
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Pack your essentials box</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Do a final walkthrough</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Take meter readings</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Hand over keys</li>
                        <li><img src={checkIcon} alt="Check" className="check-icon" /> Celebrate your successful move!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Final Thoughts */}
              <section id="final-thoughts" className="article-section">
                <h2>Final Thoughts</h2>
                <p>Moving doesn't have to be stressful when you have a clear plan. This checklist ensures you stay organized and don't miss any important steps. Remember to take breaks, ask for help when needed, and celebrate each milestone along the way.</p>
                <p>Ready to start your move? <Link to="/">Get your free moving quotes</Link> and let MovedIn help you find the perfect moving company for your needs.</p>
              </section>

            </article>

            {/* Sidebar */}
            <aside className="article-sidebar">
              <div className="table-of-contents">
                <h3 className="toc-title">Table of Contents</h3>
                <ul className="toc-list">
                  <li><a href="#introduction" className="toc-link">Introduction</a></li>
                  <li><a href="#8-weeks-before" className="toc-link">8 Weeks Before</a></li>
                  <li><a href="#6-weeks-before" className="toc-link">6 Weeks Before</a></li>
                  <li><a href="#4-weeks-before" className="toc-link">4 Weeks Before</a></li>
                  <li><a href="#2-weeks-before" className="toc-link">2 Weeks Before</a></li>
                  <li><a href="#moving-day" className="toc-link">Moving Day</a></li>
                  <li><a href="#final-thoughts" className="toc-link">Final Thoughts</a></li>
                </ul>
              </div>
              
              <div className="social-share">
                <h3 className="share-title">Share this article</h3>
                <div className="share-buttons">
                  <a href="#" className="share-button twitter">Twitter</a>
                  <a href="#" className="share-button facebook">Facebook</a>
                  <a href="#" className="share-button linkedin">LinkedIn</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default MovingChecklist;
