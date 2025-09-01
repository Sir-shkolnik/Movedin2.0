import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../Page.css';

const PlanningPhase: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Planning Phase: 8-12 Weeks Before Your Move | MovedIn - Moving Guide</title>
        <meta name="description" content="Master the planning phase of your move with our comprehensive 8-12 week timeline. Expert tips for decluttering, budgeting, research, and organization from MovedIn." />
        <meta name="keywords" content="moving planning, move timeline, decluttering before move, moving budget, moving research, moving checklist, MovedIn guide" />
        <link rel="canonical" href="https://movedin.com/guides/planning-phase" />
        <meta property="og:title" content="Planning Phase: 8-12 Weeks Before Your Move | MovedIn" />
        <meta property="og:description" content="Master the planning phase of your move with our comprehensive 8-12 week timeline. Expert tips for decluttering, budgeting, research, and organization." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://movedin.com/guides/planning-phase" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="planning-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="planning-title">📋 Planning Phase: 8-12 Weeks Before Your Move</h1>
              <p className="page-subtitle">Proper planning is the foundation of a successful move. Start early to avoid last-minute stress and ensure everything goes smoothly.</p>
            </header>

            <section className="tips-section">
              <h2>Create a Moving Timeline</h2>
              <p>Develop a detailed timeline with specific tasks and deadlines. Include everything from decluttering to utility transfers. Use our <strong>free moving checklist</strong> to stay organized.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📅 Set Your Move Date</h3>
                  <p>Choose your move date and work backwards to create a realistic timeline. Consider factors like work schedules, school calendars, and weather conditions.</p>
                  <ul className="tip-details">
                    <li>Set your move date and work backwards</li>
                    <li>Research moving companies and get quotes</li>
                    <li>Plan for time off work</li>
                    <li>Consider seasonal factors and pricing</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏠 Research Your New Area</h3>
                  <p>Familiarize yourself with your new neighborhood before moving. This will help you feel more at home and avoid surprises.</p>
                  <ul className="tip-details">
                    <li>Find local amenities (grocery stores, hospitals, schools)</li>
                    <li>Research public transportation options</li>
                    <li>Check crime rates and safety statistics</li>
                    <li>Visit the area at different times of day</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>💰 Budget for Moving Expenses</h3>
                  <p>Moving costs can add up quickly. Create a comprehensive budget that includes all potential expenses to avoid financial stress.</p>
                  <ul className="tip-details">
                    <li>Moving company fees and insurance</li>
                    <li>Packing supplies and materials</li>
                    <li>Travel expenses and temporary accommodation</li>
                    <li>Utility deposits and new furniture</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📋 Declutter and Organize</h3>
                  <p>Moving is the perfect opportunity to declutter. Sort your belongings into keep, donate, sell, and discard categories.</p>
                  <ul className="tip-details">
                    <li>Start with one room at a time</li>
                    <li>Use the 6-month rule: if you haven't used it in 6 months, consider donating it</li>
                    <li>Take photos of items you're selling for online listings</li>
                    <li>Organize important documents and keep them accessible</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Essential Planning Tasks</h2>
              <p>These critical tasks should be completed during the planning phase to ensure a smooth transition.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📞 Service Transfers</h3>
                  <p>Contact all service providers to arrange transfers or cancellations. This includes utilities, internet, phone, and subscription services.</p>
                  <ul className="tip-details">
                    <li>Schedule utility disconnections and connections</li>
                    <li>Transfer internet and phone services</li>
                    <li>Update address with all service providers</li>
                    <li>Cancel or transfer gym memberships</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏥 Medical and Records</h3>
                  <p>Ensure all medical records and important documents are organized and accessible during your move.</p>
                  <ul className="tip-details">
                    <li>Request copies of medical records</li>
                    <li>Transfer prescriptions to new pharmacies</li>
                    <li>Update insurance policies</li>
                    <li>Organize important documents in a portable file</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🚗 Transportation Planning</h3>
                  <p>Plan how you'll get to your new home and arrange for any necessary vehicle transportation or rental cars.</p>
                  <ul className="tip-details">
                    <li>Plan your travel route to the new location</li>
                    <li>Arrange for vehicle shipping if needed</li>
                    <li>Book rental cars for moving day</li>
                    <li>Plan for parking and access at both locations</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📱 Technology Setup</h3>
                  <p>Ensure all your technology and online accounts are ready for the move and accessible from your new location.</p>
                  <ul className="tip-details">
                    <li>Back up all digital files and photos</li>
                    <li>Update online accounts with new address</li>
                    <li>Test remote access to important accounts</li>
                    <li>Plan for internet setup at new location</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Moving Company Selection</h2>
              <p>Choosing the right moving company is crucial for a successful move. Take your time to research and compare options.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>🔍 Research and Compare</h3>
                  <p>Get quotes from multiple moving companies and compare their services, pricing, and reputation.</p>
                  <ul className="tip-details">
                    <li>Get at least 3-5 quotes from different companies</li>
                    <li>Check online reviews and ratings</li>
                    <li>Verify licensing and insurance</li>
                    <li>Ask for references from recent customers</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📋 Service Options</h3>
                  <p>Understand the different service levels available and choose what's best for your needs and budget.</p>
                  <ul className="tip-details">
                    <li>Full-service moving (packing, loading, transport, unloading)</li>
                    <li>Self-service options (you pack, they transport)</li>
                    <li>Packing services only</li>
                    <li>Storage options if needed</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📅 Booking and Scheduling</h3>
                  <p>Book your moving company early, especially during peak moving season, to ensure availability.</p>
                  <ul className="tip-details">
                    <li>Book at least 4-6 weeks in advance</li>
                    <li>Confirm dates and times in writing</li>
                    <li>Get detailed written estimates</li>
                    <li>Understand cancellation policies</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🛡️ Insurance and Protection</h3>
                  <p>Ensure your belongings are properly protected during the move with appropriate insurance coverage.</p>
                  <ul className="tip-details">
                    <li>Understand the moving company's liability</li>
                    <li>Consider additional insurance for valuable items</li>
                    <li>Document valuable items with photos</li>
                    <li>Keep receipts for expensive purchases</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="cta-section">
              <h2>Ready to Start Planning Your Move?</h2>
              <p>Now that you understand the planning phase, let our professional movers help you execute the perfect move. Get instant quotes from verified moving companies in your area.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Moving Quote
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/tips-guides">← Back to Tips & Guides</Link> | <Link to="/guides/packing-phase">Next: Packing Phase →</Link>
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default PlanningPhase;
