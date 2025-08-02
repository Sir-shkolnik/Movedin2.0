import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './Page.css';

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
              <h1 id="tips-guides-title">Complete Moving Guide: Tips & Expert Advice for a Stress-Free Move</h1>
              <p className="page-subtitle">Master the art of moving with our comprehensive guide. From planning to unpacking, we've got you covered with proven strategies used by professional movers across Canada. <Link to="/how-it-works">See how it works</Link> or <Link to="/about-us">learn about us</Link>.</p>
            </header>
            
            <nav className="table-of-contents" aria-label="Quick Navigation">
              <h2>Quick Navigation</h2>
              <ul>
                <li><a href="#planning-phase">📋 Planning Phase (8-12 weeks before)</a></li>
                <li><a href="#packing-phase">📦 Packing Phase (4-6 weeks before)</a></li>
                <li><a href="#moving-day">🚚 Moving Day</a></li>
                <li><a href="#settling-in">🏠 Settling In (After the move)</a></li>
                <li><a href="#special-situations">⚡ Special Situations</a></li>
                <li><a href="#cost-saving-tips">💰 Cost-Saving Tips</a></li>
              </ul>
            </nav>

            <section id="planning-phase" className="tips-section">
              <h2>📋 Planning Phase: 8-12 Weeks Before Your Move</h2>
              <p className="section-intro">Proper planning is the foundation of a successful move. Start early to avoid last-minute stress and ensure everything goes smoothly.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📅 Create a Moving Timeline</h3>
                  <p>Develop a detailed timeline with specific tasks and deadlines. Include everything from decluttering to utility transfers. Use our <strong>free moving checklist</strong> to stay organized.</p>
                  <ul className="tip-details">
                    <li>Set your move date and work backwards</li>
                    <li>Research moving companies and get quotes</li>
                    <li>Plan for time off work</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏠 Research Your New Area</h3>
                  <p>Familiarize yourself with your new neighborhood before moving. This will help you feel more at home and avoid surprises.</p>
                  <ul className="tip-details">
                    <li>Find local amenities (grocery stores, hospitals, schools)</li>
                    <li>Research public transportation options</li>
                    <li>Check crime rates and safety statistics</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>💰 Budget for Moving Expenses</h3>
                  <p>Moving costs can add up quickly. Create a comprehensive budget that includes all potential expenses to avoid financial stress.</p>
                  <ul className="tip-details">
                    <li>Moving company fees and insurance</li>
                    <li>Packing supplies and materials</li>
                    <li>Travel expenses and temporary accommodation</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📋 Declutter and Organize</h3>
                  <p>Moving is the perfect opportunity to declutter. Sort your belongings into keep, donate, sell, and discard categories.</p>
                  <ul className="tip-details">
                    <li>Start with one room at a time</li>
                    <li>Use the 6-month rule: if you haven't used it in 6 months, consider donating it</li>
                    <li>Take photos of items you're selling for online listings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="packing-phase" className="tips-section">
              <h2>📦 Packing Phase: 4-6 Weeks Before Your Move</h2>
              <p className="section-intro">Smart packing can save you time, money, and stress. Follow these proven techniques used by professional movers.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📦 Invest in Quality Packing Supplies</h3>
                  <p>Don't skimp on packing materials. Quality boxes, tape, and protective materials will prevent damage and make unpacking easier.</p>
                  <ul className="tip-details">
                    <li>Use new, sturdy boxes in standard sizes</li>
                    <li>Invest in bubble wrap and packing paper</li>
                    <li>Get specialty boxes for dishes, artwork, and electronics</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏷️ Master the Art of Labeling</h3>
                  <p>Proper labeling is crucial for efficient unpacking. Use a consistent system that works for you and your movers.</p>
                  <ul className="tip-details">
                    <li>Label each box with room name and contents</li>
                    <li>Use color-coded labels for different rooms</li>
                    <li>Mark boxes as "fragile" or "this side up" when needed</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📱 Create a Digital Inventory</h3>
                  <p>Document your belongings with photos and descriptions. This serves as both an organizational tool and insurance documentation.</p>
                  <ul className="tip-details">
                    <li>Take photos of valuable items</li>
                    <li>Keep receipts for expensive purchases</li>
                    <li>Create a spreadsheet with item descriptions and values</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🧴 Pack Smart: Room by Room</h3>
                  <p>Pack one room at a time to stay organized. Start with non-essential items and work your way to daily necessities.</p>
                  <ul className="tip-details">
                    <li>Pack heavy items in small boxes</li>
                    <li>Use towels and linens as padding</li>
                    <li>Keep similar items together</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="moving-day" className="tips-section">
              <h2>🚚 Moving Day: Your Complete Checklist</h2>
              <p className="section-intro">Moving day can be overwhelming, but with proper preparation, it can run smoothly. Follow this comprehensive checklist.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>🌅 Morning Preparation</h3>
                  <p>Start your moving day early and stay organized. Having a clear plan will reduce stress and ensure nothing is forgotten.</p>
                  <ul className="tip-details">
                    <li>Wake up early and have a good breakfast</li>
                    <li>Do a final walkthrough of your old home</li>
                    <li>Keep important documents and valuables with you</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📦 Essential Items Kit</h3>
                  <p>Pack a "first night" box with everything you'll need immediately. This should travel with you, not in the moving truck.</p>
                  <ul className="tip-details">
                    <li>Toiletries and medications</li>
                    <li>Change of clothes and pajamas</li>
                    <li>Phone chargers and important documents</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>👥 Working with Movers</h3>
                  <p>Clear communication with your moving team is essential. Be available to answer questions and provide direction.</p>
                  <ul className="tip-details">
                    <li>Point out fragile items and special instructions</li>
                    <li>Provide parking information and access details</li>
                    <li>Have cash ready for tips</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🔍 Final Inspection</h3>
                  <p>Before leaving your old home, do a thorough final inspection to ensure nothing is left behind.</p>
                  <ul className="tip-details">
                    <li>Check all rooms, closets, and storage areas</li>
                    <li>Look in cabinets, drawers, and under furniture</li>
                    <li>Don't forget outdoor areas and garages</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="settling-in" className="tips-section">
              <h2>🏠 Settling In: Making Your New House Feel Like Home</h2>
              <p className="section-intro">The work doesn't end when the movers leave. These tips will help you settle in quickly and comfortably.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📦 Strategic Unpacking</h3>
                  <p>Don't try to unpack everything at once. Focus on essential areas first and take your time organizing each room.</p>
                  <ul className="tip-details">
                    <li>Start with the kitchen and bathroom</li>
                    <li>Set up bedrooms for comfortable sleeping</li>
                    <li>Unpack one room completely before moving to the next</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📮 Address Updates</h3>
                  <p>Update your address with all important organizations and services. This ensures you don't miss important mail or services.</p>
                  <ul className="tip-details">
                    <li>Government agencies (CRA, Service Canada)</li>
                    <li>Banks, credit cards, and insurance companies</li>
                    <li>Subscription services and online accounts</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🔧 Home Setup</h3>
                  <p>Test all systems and appliances in your new home. Address any issues immediately to avoid problems later.</p>
                  <ul className="tip-details">
                    <li>Test all electrical outlets and switches</li>
                    <li>Check plumbing and water pressure</li>
                    <li>Verify heating and cooling systems work properly</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🗺️ Neighborhood Exploration</h3>
                  <p>Take time to explore your new neighborhood. This will help you feel more at home and discover local amenities.</p>
                  <ul className="tip-details">
                    <li>Find grocery stores, pharmacies, and restaurants</li>
                    <li>Locate hospitals, police stations, and fire departments</li>
                    <li>Discover parks, libraries, and community centers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="special-situations" className="tips-section">
              <h2>⚡ Special Situations: Moving with Kids, Pets, and Seniors</h2>
              <p className="section-intro">Every move is unique. These specialized tips address common challenges and special circumstances.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>👶 Moving with Children</h3>
                  <p>Moving can be especially challenging for children. Help them adjust by involving them in the process and maintaining routines.</p>
                  <ul className="tip-details">
                    <li>Explain the move in age-appropriate terms</li>
                    <li>Let children pack their own special items</li>
                    <li>Maintain familiar routines during the transition</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🐕 Moving with Pets</h3>
                  <p>Pets need special consideration during moves. Plan ahead to ensure their safety and comfort throughout the process.</p>
                  <ul className="tip-details">
                    <li>Update pet microchips and tags with new address</li>
                    <li>Keep pets in a quiet, secure area during moving day</li>
                    <li>Research pet-friendly accommodations if needed</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>👴 Moving with Seniors</h3>
                  <p>Moving seniors requires extra planning and sensitivity. Focus on safety, accessibility, and maintaining independence.</p>
                  <ul className="tip-details">
                    <li>Ensure new home meets accessibility needs</li>
                    <li>Arrange for medical records transfer</li>
                    <li>Plan for familiar furniture placement</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏢 Long-Distance Moves</h3>
                  <p>Long-distance moves require additional planning and coordination. These tips will help ensure a smooth transition.</p>
                  <ul className="tip-details">
                    <li>Research moving companies with long-distance experience</li>
                    <li>Plan for multiple days of travel</li>
                    <li>Consider temporary storage options</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="cost-saving-tips" className="tips-section">
              <h2>💰 Cost-Saving Tips: Moving on a Budget</h2>
              <p className="section-intro">Moving doesn't have to break the bank. These strategies will help you save money while ensuring a quality move.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📦 DIY vs. Professional Movers</h3>
                  <p>Consider your options carefully. While DIY moves can save money, professional movers often provide better value for the stress and time saved.</p>
                  <ul className="tip-details">
                    <li>Compare quotes from multiple moving companies</li>
                    <li>Consider hybrid options (pack yourself, hire movers)</li>
                    <li>Factor in your time and stress levels</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🛒 Smart Packing Supply Shopping</h3>
                  <p>Don't overspend on packing materials. Many items can be found for free or at a discount.</p>
                  <ul className="tip-details">
                    <li>Ask local stores for free boxes</li>
                    <li>Use towels and linens as padding</li>
                    <li>Buy supplies in bulk for better prices</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📅 Timing Your Move</h3>
                  <p>When you move can significantly impact costs. Consider timing to save money on both moving services and housing.</p>
                  <ul className="tip-details">
                    <li>Avoid peak moving season (May-September)</li>
                    <li>Move mid-month for better rates</li>
                    <li>Consider weekday moves for lower costs</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>💳 Tax Deductions and Insurance</h3>
                  <p>Don't miss out on potential tax benefits and ensure you have proper insurance coverage.</p>
                  <ul className="tip-details">
                    <li>Keep all moving-related receipts</li>
                    <li>Check if your move qualifies for tax deductions</li>
                    <li>Verify insurance coverage for valuable items</li>
                  </ul>
                </div>
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
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default TipsAndGuides; 