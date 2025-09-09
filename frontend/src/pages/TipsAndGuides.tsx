import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import './TipsAndGuides.css';

const TipsAndGuides: React.FC = () => {
  const navigate = useNavigate();
  
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
      <Header />
      <main className="page-container" aria-labelledby="tips-guides-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="tips-guides-title">On The MovedIn: Your Ultimate Guide to a Seamless Relocation</h1>
              <p className="page-subtitle">Mastering the Art of Packing, Planning, and Settling into Your New Home. Expert advice from MovedIn's comprehensive moving guide and blog articles. <Link to="/how-it-works">See how it works</Link> or <Link to="/about-us">learn about us</Link>.</p>
            </header>

            {/* Blog Articles Section */}
            <section className="blog-section">
              <h2>Latest Moving Tips & Articles</h2>
              <p className="section-intro">Stay updated with the latest moving advice, tips, and guides from our expert team.</p>
              
              <div className="blog-grid">
                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=1" alt="Address Change Checklist" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">15 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>An Ultimate Checklist for Change of Address in Ontario</h3>
                    <p>One of the essential tasks is updating several agencies and services about your new address. Our comprehensive checklist covers everything you need to update when moving in Ontario.</p>
                    <Link to="/articles/address-change-checklist" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=2" alt="Toronto Neighborhood Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">14 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Toronto Neighborhood Guide: Choosing the Right Area for Your Move</h3>
                    <p>Toronto has it all: cultural diversity, natural beauty, great restaurants, and vibrant neighborhoods. Find the perfect area that matches your lifestyle and needs.</p>
                    <Link to="/articles/toronto-neighborhood-guide" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=3" alt="Pre-Move Decluttering" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">13 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Pre-Move Decluttering: How to Lighten Your Load Before a Big Move</h3>
                    <p>Decluttering saves you time on both ends because there's less to pack and unpack. Learn effective strategies to streamline your belongings before moving.</p>
                    <Link to="/articles/pre-move-decluttering" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=4" alt="Stress Free Move" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">12 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Incorporating Mindfulness into Your Move: A Stress Reduction Strategy</h3>
                    <p>You may have heard of mindfulness as a strategy to improve mental health. Discover how mindfulness techniques can make your move less stressful and more enjoyable.</p>
                    <Link to="/articles/stress-free-move" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=5" alt="Professional Packing Services Toronto" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">11 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Professional Packing Services in Toronto: Are They Worth It?</h3>
                    <p>Moving to a new home can be an exciting and adventurous experience. Learn about the benefits and costs of professional packing services in Toronto.</p>
                    <Link to="/articles/professional-packing-services" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=6" alt="Tips For Moving Home" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">9 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Navigating Toronto's Real Estate Market: Tips for Moving Home</h3>
                    <p>If you're planning a move to Toronto or within Toronto, we have some tips to help you navigate the competitive real estate market successfully.</p>
                    <Link to="/articles/tips-for-moving-home" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=7" alt="Moving With Pets In Toronto" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">7 Dec 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Moving with Pets in Toronto: A Comprehensive Guide</h3>
                    <p>Moving is stressful enough for humans, so imagine how anxious your pets might feel. Learn how to make the transition smooth for your furry family members.</p>
                    <Link to="/articles/moving-with-pets" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=8" alt="Moving Stress Free Toronto" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">15 Sep 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>How to Plan a Stress-Free Move in Toronto</h3>
                    <p>Moving is one of the most stressful things most people experience in life. Discover proven strategies to make your Toronto move as stress-free as possible.</p>
                    <Link to="/articles/moving-stress-free-toronto" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=9" alt="Winter Moving Tips" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">16 Sep 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>Moving in the Winter: Special Tips for Toronto Residents</h3>
                    <p>Winter moves are never fun. Okay, let's face it—moving is no picnic at any time of year. Get expert tips for handling winter moves in Toronto's challenging weather.</p>
                    <Link to="/articles/winter-moving-tips" className="read-more">Read More →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=10" alt="Essential Moving" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">17 Sep 2023</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>The Essential Moving Checklist for Torontonians</h3>
                    <p>Moving is never easy, but a well-planned move and a good checklist can help make the process much smoother. Get our comprehensive checklist designed specifically for Toronto moves.</p>
                    <Link to="/articles/essential-moving-checklist" className="read-more">Read More →</Link>
                  </div>
                </article>
              </div>
            </section>
            
            <nav className="table-of-contents" aria-label="Quick Navigation">
              <h2>Complete Moving Guide</h2>
              <ul>
                <li><Link to="/guides/planning-phase">📋 Planning Phase (8-12 weeks before)</Link></li>
                <li><Link to="/guides/packing-phase">📦 Packing Phase (4-6 weeks before)</Link></li>
                <li><Link to="/guides/moving-day">🚚 Moving Day</Link></li>
                <li><Link to="/guides/settling-in">🏠 Settling In (After the move)</Link></li>
                <li><Link to="/guides/special-situations">⚡ Special Situations</Link></li>
                <li><Link to="/guides/cost-saving-tips">💰 Cost-Saving Tips</Link></li>
              </ul>
            </nav>

            {/* Guide Articles Section - Converted from detailed sections to article cards */}
            <section className="blog-section">
              <h2>Complete Moving Guide Articles</h2>
              <p className="section-intro">Master every phase of your move with our comprehensive guides. Each article provides detailed, actionable advice to make your move successful.</p>
              <div className="blog-grid">
                
                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=20" alt="Planning Phase Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">Guide</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>📋 Planning Phase: 8-12 Weeks Before Your Move</h3>
                    <p>Proper planning is the foundation of a successful move. Start early to avoid last-minute stress and ensure everything goes smoothly.</p>
                    <Link to="/guides/planning-phase" className="read-more">Read Complete Guide →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=21" alt="Packing Phase Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">Guide</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>📦 Packing Phase: 4-6 Weeks Before Your Move</h3>
                    <p>Smart packing can save you time, money, and stress. Follow these proven techniques used by professional movers.</p>
                    <Link to="/guides/packing-phase" className="read-more">Read Complete Guide →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=22" alt="Moving Day Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">Guide</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>🚚 Moving Day: Your Complete Checklist</h3>
                    <p>Moving day can be overwhelming, but with proper preparation, it can run smoothly. Follow this comprehensive checklist.</p>
                    <Link to="/guides/moving-day" className="read-more">Read Complete Guide →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=23" alt="Settling In Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">Guide</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>🏠 Settling In: Making Your New Home Feel Like Home</h3>
                    <p>The move is complete, but the journey isn't over. Learn how to efficiently unpack, organize, and transform your new space.</p>
                    <Link to="/guides/settling-in" className="read-more">Read Complete Guide →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=24" alt="Special Situations Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">Guide</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>🌟 Special Moving Situations: Long Distance, International & More</h3>
                    <p>Every move is unique, and some situations require special consideration. Learn how to handle complex moving scenarios.</p>
                    <Link to="/guides/special-situations" className="read-more">Read Complete Guide →</Link>
                  </div>
                </article>

                <article className="blog-card">
                  <div className="blog-image">
                    <img src="https://picsum.photos/400/200?random=25" alt="Cost Saving Tips Guide" />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">Guide</span>
                      <span className="blog-author">MovedIn</span>
                    </div>
                    <h3>💰 Cost-Saving Moving Tips: Smart Ways to Reduce Moving Expenses</h3>
                    <p>Moving doesn't have to break the bank. Learn proven strategies to reduce costs while maintaining quality and efficiency.</p>
                    <Link to="/guides/cost-saving-tips" className="read-more">Read Complete Guide →</Link>
                  </div>
                </article>
              </div>
            </section>

            <section className="faq-section">
              <h2>❓ Frequently Asked Questions</h2>
              <div className="faq-grid">
                <div className="faq-item">
                  <h3>How far in advance should I book movers?</h3>
                  <p>For local moves, book 2-4 weeks in advance. For long-distance moves, book 6-8 weeks ahead, especially during peak season (May-September).</p>
                </div>
                
                <div className="faq-item">
                  <h3>What should I do with my plants when moving?</h3>
                  <p>Most moving companies won't transport plants. Consider giving them to friends, donating them, or transporting them yourself in your vehicle.</p>
                </div>
                
                <div className="faq-item">
                  <h3>How do I protect my furniture during the move?</h3>
                  <p>Use furniture blankets, corner protectors, and proper wrapping techniques. Professional movers will handle this, but you can add extra protection for valuable pieces.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What's the best way to pack books?</h3>
                  <p>Pack books in small boxes (they're heavy!) and alternate spine directions to prevent damage. Use packing paper between layers for extra protection.</p>
                </div>
              </div>
            </section>
            
            <div className="cta-section">
              <h2>Ready to Start Your Move?</h2>
              <p>Now that you're armed with expert moving tips, let our professional movers help you execute the perfect move. Get instant quotes from verified moving companies in your area.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Moving Quote
              </button>
            </div>
          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default TipsAndGuides; 