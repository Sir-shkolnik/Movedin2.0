import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Header/Header';
import StaticFooter from '../../components/Footer/StaticFooter';
import './BlogArticle.css';

// Import blog images
import blogHeroImage from '../../assets/imgs-png/img_blog-essential.jpg';
import blogContent1 from '../../assets/imgs-png/img_blog-essentials_content_1.png';
import blogContent2 from '../../assets/imgs-png/img_blog-essentials_content_2.jpg';
import profileNarender from '../../assets/imgs-png/img_profile-narender.png';

// Import icons
import checkIcon from '../../assets/icons-svg/icon_check-purple.svg';
import calendarIcon from '../../assets/icons-svg/icon_calendar-purple.svg';
import homeIcon from '../../assets/icons-svg/icon_home-services-black.svg';

const EssentialChecklist: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>The Essential Moving Checklist for Torontonians | MovedIn</title>
        <meta name="description" content="Complete moving checklist for Toronto residents. From 8 weeks before to moving day, ensure nothing is forgotten with our comprehensive guide." />
        <meta name="keywords" content="moving checklist, Toronto moving, moving tips, moving preparation, moving guide" />
        <link rel="canonical" href="https://movedin.com/articles/essential-checklist" />
        <meta property="og:title" content="The Essential Moving Checklist for Torontonians" />
        <meta property="og:description" content="Complete moving checklist for Toronto residents. From 8 weeks before to moving day, ensure nothing is forgotten with our comprehensive guide." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://movedin.com/articles/essential-checklist" />
        <meta property="og:image" content="https://movedin.com/assets/img_blog-essential.jpg" />
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
                <h1 className="blog-title">The Essential Moving Checklist for Torontonians</h1>
                <p className="blog-subtitle">Your Complete Guide to a Stress-Free Move in Toronto: From Planning to Unpacking</p>
                <div className="blog-author">
                  <img src={profileNarender} alt="Narender Surakandi" className="author-image" />
                  <div className="author-info">
                    <span className="author-name">Narender Surakandi</span>
                    <span className="publish-date">Published 18 Sep 2023</span>
                  </div>
                </div>
              </div>
              <div className="blog-hero-image">
                <img src={blogHeroImage} alt="Essential Moving Checklist" className="hero-image" />
              </div>
            </div>
          </section>

          {/* Article Content */}
          <article className="blog-article">
            <div className="article-layout">
              
              {/* Main Content */}
              <div className="article-main">
                
                {/* Introduction */}
                <section className="article-section">
                  <p className="article-intro">
                    Moving is one of the most stressful things most people experience in life. Not least of all because 
                    there are so many things to remember and organize. From changing your address to transferring utilities, 
                    from packing fragile items to coordinating with movers – the list seems endless.
                  </p>
                  <p className="article-intro">
                    But it doesn't have to be overwhelming! With proper planning and organization, you can turn your 
                    move into a smooth, stress-free experience. This comprehensive checklist is specifically designed 
                    for Toronto residents, taking into account the unique aspects of moving in Canada's largest city.
                  </p>
                </section>

                {/* Why a Checklist Matters */}
                <section className="article-section">
                  <h2 className="section-title">Why a Moving Checklist Matters</h2>
                  <p>
                    A well-structured moving checklist is your roadmap to a successful move. It helps you stay organized, 
                    reduces stress, and ensures you don't forget important tasks. In a city like Toronto, where timing 
                    and organization are crucial, having a clear plan can make the difference between a smooth transition 
                    and a chaotic nightmare.
                  </p>
                  
                  <div className="checklist-benefits">
                    <div className="benefit-item">
                      <img src={checkIcon} alt="Check" className="benefit-icon" />
                      <div className="benefit-text">
                        <h3>Reduces Stress</h3>
                        <p>Having a clear plan eliminates the anxiety of wondering what you might have forgotten.</p>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <img src={calendarIcon} alt="Calendar" className="benefit-icon" />
                      <div className="benefit-text">
                        <h3>Better Time Management</h3>
                        <p>Break down your move into manageable tasks with realistic timelines.</p>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <img src={homeIcon} alt="Home" className="benefit-icon" />
                      <div className="benefit-text">
                        <h3>Nothing Gets Forgotten</h3>
                        <p>Ensure every important detail is covered, from utilities to mail forwarding.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 8 Weeks Before */}
                <section className="article-section">
                  <h2 className="section-title">8 Weeks Before Moving Day</h2>
                  <p>
                    The earlier you start planning, the smoother your move will be. Eight weeks gives you plenty of 
                    time to research, compare, and make informed decisions without feeling rushed.
                  </p>
                  
                  <div className="timeline-section">
                    <div className="timeline-content">
                      <div className="timeline-text">
                        <h3>Research and Planning</h3>
                        <ul className="checklist-list">
                          <li>Research moving companies and get quotes</li>
                          <li>Decide on moving date and time</li>
                          <li>Create a moving budget</li>
                          <li>Research your new neighborhood</li>
                          <li>Check parking restrictions for moving day</li>
                        </ul>
                      </div>
                      <div className="timeline-visual">
                        <img src={blogContent1} alt="Planning and research illustration" className="timeline-image" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6 Weeks Before */}
                <section className="article-section">
                  <h2 className="section-title">6 Weeks Before Moving Day</h2>
                  <p>
                    Now it's time to start the practical preparations. This is when you'll begin the process of 
                    organizing your belongings and making necessary arrangements.
                  </p>
                  
                  <div className="checklist-grid">
                    <div className="checklist-category">
                      <h3>Home & Utilities</h3>
                      <ul className="checklist-list">
                        <li>Give notice to your current landlord</li>
                        <li>Contact utility companies for disconnection</li>
                        <li>Set up utilities at new address</li>
                        <li>Arrange for internet/cable installation</li>
                      </ul>
                    </div>
                    <div className="checklist-category">
                      <h3>Personal & Legal</h3>
                      <ul className="checklist-list">
                        <li>Update your driver's license address</li>
                        <li>Notify your bank of address change</li>
                        <li>Update insurance policies</li>
                        <li>Set up mail forwarding with Canada Post</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 4 Weeks Before */}
                <section className="article-section">
                  <h2 className="section-title">4 Weeks Before Moving Day</h2>
                  <p>
                    The countdown is getting serious! This is when you'll start the physical preparation for your move, 
                    including packing and organizing your belongings.
                  </p>
                  
                  <div className="packing-tips">
                    <div className="packing-visual">
                      <img src={blogContent2} alt="Packing supplies and organization" className="packing-image" />
                    </div>
                    <div className="packing-content">
                      <h3>Packing Preparation</h3>
                      <ul className="checklist-list">
                        <li>Gather packing supplies (boxes, tape, bubble wrap)</li>
                        <li>Start packing non-essential items</li>
                        <li>Create an inventory of valuable items</li>
                        <li>Take photos of valuable items for insurance</li>
                        <li>Label boxes clearly with contents and destination room</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 2 Weeks Before */}
                <section className="article-section">
                  <h2 className="section-title">2 Weeks Before Moving Day</h2>
                  <p>
                    You're in the final stretch! This is when everything starts coming together, and you'll be 
                    making the final arrangements for your move.
                  </p>
                  
                  <div className="final-preparations">
                    <div className="prep-category">
                      <h3>Moving Company</h3>
                      <ul className="checklist-list">
                        <li>Confirm moving date and time</li>
                        <li>Provide detailed directions to both addresses</li>
                        <li>Confirm parking arrangements</li>
                        <li>Review moving contract and insurance</li>
                      </ul>
                    </div>
                    <div className="prep-category">
                      <h3>Personal Items</h3>
                      <ul className="checklist-list">
                        <li>Pack essential items for first few days</li>
                        <li>Prepare "open first" box with necessities</li>
                        <li>Arrange for pet care on moving day</li>
                        <li>Plan meals for moving week</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Moving Day */}
                <section className="article-section">
                  <h2 className="section-title">Moving Day</h2>
                  <p>
                    The big day is here! With proper preparation, this should be a smooth and organized experience. 
                    Here's your moving day checklist to ensure everything goes according to plan.
                  </p>
                  
                  <div className="moving-day-checklist">
                    <div className="morning-tasks">
                      <h3>Morning Tasks</h3>
                      <ul className="checklist-list">
                        <li>Wake up early and have a good breakfast</li>
                        <li>Do a final walkthrough of your home</li>
                        <li>Take final photos of empty rooms</li>
                        <li>Ensure all utilities are turned off</li>
                        <li>Lock all windows and doors</li>
                      </ul>
                    </div>
                    <div className="during-move">
                      <h3>During the Move</h3>
                      <ul className="checklist-list">
                        <li>Supervise the moving process</li>
                        <li>Keep important documents with you</li>
                        <li>Take photos of loaded truck</li>
                        <li>Do a final check of all rooms</li>
                        <li>Hand over keys to landlord/agent</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Toronto-Specific Tips */}
                <section className="article-section">
                  <h2 className="section-title">Toronto-Specific Moving Tips</h2>
                  <p>
                    Moving in Toronto comes with its own unique challenges and considerations. Here are some 
                    city-specific tips to make your move smoother.
                  </p>
                  
                  <div className="toronto-tips">
                    <div className="tip-item">
                      <h3>Parking Permits</h3>
                      <p>Apply for moving day parking permits well in advance. Toronto requires permits for moving trucks, and they can take time to process.</p>
                    </div>
                    <div className="tip-item">
                      <h3>Elevator Reservations</h3>
                      <p>If you're moving to or from a condo, reserve the elevator in advance. Many buildings require advance notice for moving day.</p>
                    </div>
                    <div className="tip-item">
                      <h3>Traffic Considerations</h3>
                      <p>Plan your move around Toronto's traffic patterns. Avoid rush hours and consider weekend moves for easier navigation.</p>
                    </div>
                    <div className="tip-item">
                      <h3>Weather Preparation</h3>
                      <p>Toronto weather can be unpredictable. Have backup plans for rain or snow, especially during winter months.</p>
                    </div>
                  </div>
                </section>

                {/* Call to Action */}
                <section className="article-cta">
                  <h2 className="cta-title">Ready to Start Your Toronto Move?</h2>
                  <p className="cta-text">
                    Don't let the stress of moving overwhelm you. Get connected with verified, professional movers 
                    who understand Toronto's unique challenges and can help make your move seamless.
                  </p>
                  <div className="cta-buttons">
                    <Link to="/quote" className="cta-button primary">
                      Get Free Quote
                    </Link>
                    <Link to="/tips-guides" className="cta-button secondary">
                      More Moving Tips
                    </Link>
                  </div>
                </section>

              </div>

              {/* Sidebar */}
              <aside className="article-sidebar">
                <div className="table-of-contents">
                  <h3 className="toc-title">Table of Contents</h3>
                  <ul className="toc-list">
                    <li><a href="#introduction" className="toc-link">Introduction</a></li>
                    <li><a href="#why-checklist" className="toc-link">Why a Checklist Matters</a></li>
                    <li><a href="#8-weeks" className="toc-link">8 Weeks Before</a></li>
                    <li><a href="#6-weeks" className="toc-link">6 Weeks Before</a></li>
                    <li><a href="#4-weeks" className="toc-link">4 Weeks Before</a></li>
                    <li><a href="#2-weeks" className="toc-link">2 Weeks Before</a></li>
                    <li><a href="#moving-day" className="toc-link">Moving Day</a></li>
                    <li><a href="#toronto-tips" className="toc-link">Toronto-Specific Tips</a></li>
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
          </article>

        </div>
      </main>
      
      <StaticFooter />
    </>
  );
};

export default EssentialChecklist;
