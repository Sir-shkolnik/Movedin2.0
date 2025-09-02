import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Header/Header';
import StaticFooter from '../components/Footer/StaticFooter';
import '../Page.css';

const MovingDay: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Moving Day: Your Complete Checklist | MovedIn - Moving Guide</title>
        <meta name="description" content="Master moving day with our comprehensive checklist. Expert tips for morning preparation, essential items kit, working with movers, and final inspection from MovedIn." />
        <meta name="keywords" content="moving day, moving checklist, moving preparation, working with movers, moving day tips, MovedIn guide" />
        <link rel="canonical" href="https://movedin.com/guides/moving-day" />
        <meta property="og:title" content="Moving Day: Your Complete Checklist | MovedIn" />
        <meta property="og:description" content="Master moving day with our comprehensive checklist. Expert tips for morning preparation, essential items kit, working with movers, and final inspection." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://movedin.com/guides/moving-day" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="moving-day-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="moving-day-title">🚚 Moving Day: Your Complete Checklist</h1>
              <p className="page-subtitle">Moving day can be overwhelming, but with proper preparation, it can run smoothly. Follow this comprehensive checklist.</p>
            </header>

            <section className="tips-section">
              <h2>Morning Preparation</h2>
              <p>Start your moving day early and stay organized. Having a clear plan will reduce stress and ensure nothing is forgotten.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>🌅 Early Start</h3>
                  <p>Begin your day early to maximize daylight and reduce stress. A well-planned morning sets the tone for the entire day.</p>
                  <ul className="tip-details">
                    <li>Wake up early and have a good breakfast</li>
                    <li>Do a final walkthrough of your old home</li>
                    <li>Keep important documents and valuables with you</li>
                    <li>Ensure all utilities are still working</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📋 Final Checklist Review</h3>
                  <p>Go through your moving checklist one final time to ensure nothing important is missed.</p>
                  <ul className="tip-details">
                    <li>Verify all boxes are properly labeled</li>
                    <li>Check that essential items are accessible</li>
                    <li>Confirm moving company arrival time</li>
                    <li>Review parking and access arrangements</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏠 Home Preparation</h3>
                  <p>Prepare your home for the movers to ensure efficient loading and prevent damage.</p>
                  <ul className="tip-details">
                    <li>Clear pathways and remove obstacles</li>
                    <li>Protect floors and carpets if needed</li>
                    <li>Ensure adequate lighting in all areas</li>
                    <li>Have cleaning supplies ready for final cleanup</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📱 Communication Setup</h3>
                  <p>Ensure all communication channels are open and working for coordination throughout the day.</p>
                  <ul className="tip-details">
                    <li>Charge all phones and devices</li>
                    <li>Have backup chargers available</li>
                    <li>Confirm contact numbers for movers</li>
                    <li>Set up group chat for family coordination</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Essential Items Kit</h2>
              <p>Pack a "first night" box with everything you'll need immediately. This should travel with you, not in the moving truck.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>🧴 Personal Essentials</h3>
                  <p>Keep personal care items easily accessible for immediate use upon arrival at your new home.</p>
                  <ul className="tip-details">
                    <li>Toiletries and medications</li>
                    <li>Change of clothes and pajamas</li>
                    <li>Phone chargers and important documents</li>
                    <li>Basic first aid supplies</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🍽️ Food and Beverages</h3>
                  <p>Pack snacks and drinks to keep energy levels up during the physically demanding moving day.</p>
                  <ul className="tip-details">
                    <li>Water and energy drinks</li>
                    <li>Non-perishable snacks</li>
                    <li>Paper plates and disposable utensils</li>
                    <li>Basic coffee/tea setup</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🔧 Tools and Supplies</h3>
                  <p>Have basic tools and supplies ready for immediate use in your new home.</p>
                  <ul className="tip-details">
                    <li>Basic toolkit (screwdriver, hammer, pliers)</li>
                    <li>Scissors and utility knife</li>
                    <li>Flashlight and batteries</li>
                    <li>Cleaning supplies</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📱 Technology and Entertainment</h3>
                  <p>Keep technology items accessible for communication and entertainment during the move.</p>
                  <ul className="tip-details">
                    <li>Laptop or tablet with chargers</li>
                    <li>Portable speaker for music</li>
                    <li>Books or magazines for downtime</li>
                    <li>Camera for documenting the move</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Working with Movers</h2>
              <p>Clear communication with your moving team is essential. Be available to answer questions and provide direction.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>👥 Team Coordination</h3>
                  <p>Establish clear communication with your moving team to ensure efficient and safe handling of your belongings.</p>
                  <ul className="tip-details">
                    <li>Point out fragile items and special instructions</li>
                    <li>Provide parking information and access details</li>
                    <li>Have cash ready for tips</li>
                    <li>Stay available for questions throughout the day</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📦 Loading Supervision</h3>
                  <p>Supervise the loading process to ensure items are handled properly and loaded efficiently.</p>
                  <ul className="tip-details">
                    <li>Monitor heavy item placement</li>
                    <li>Ensure fragile items are properly secured</li>
                    <li>Verify all items are loaded</li>
                    <li>Keep track of box counts and labels</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🚚 Truck Organization</h3>
                  <p>Work with movers to organize the truck for efficient unloading at your destination.</p>
                  <ul className="tip-details">
                    <li>Load essential items last (unload first)</li>
                    <li>Group items by room for easier unloading</li>
                    <li>Ensure proper weight distribution</li>
                    <li>Secure items to prevent shifting during transport</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📋 Documentation</h3>
                  <p>Keep detailed records of the moving process for insurance and reference purposes.</p>
                  <ul className="tip-details">
                    <li>Take photos of loaded truck</li>
                    <li>Document any pre-existing damage</li>
                    <li>Keep copies of all paperwork</li>
                    <li>Note any special handling instructions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Final Inspection and Departure</h2>
              <p>Before leaving your old home, do a thorough final inspection to ensure nothing is left behind.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>🔍 Room-by-Room Check</h3>
                  <p>Systematically check every room, closet, and storage area to ensure nothing is forgotten.</p>
                  <ul className="tip-details">
                    <li>Check all rooms, closets, and storage areas</li>
                    <li>Look in cabinets, drawers, and under furniture</li>
                    <li>Don't forget outdoor areas and garages</li>
                    <li>Check attic and basement if applicable</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🔌 Utility and Appliance Check</h3>
                  <p>Ensure all utilities and appliances are properly shut off and secured before departure.</p>
                  <ul className="tip-details">
                    <li>Turn off all lights and appliances</li>
                    <li>Close and lock all windows and doors</li>
                    <li>Set thermostat to appropriate temperature</li>
                    <li>Ensure water is turned off</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🗑️ Final Cleanup</h3>
                  <p>Leave your old home in good condition for the next occupants or for final inspection.</p>
                  <ul className="tip-details">
                    <li>Remove all trash and debris</li>
                    <li>Sweep or vacuum floors</li>
                    <li>Clean kitchen and bathroom surfaces</li>
                    <li>Leave keys and access information if required</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📱 Departure Communication</h3>
                  <p>Notify relevant parties of your departure and provide forwarding information.</p>
                  <ul className="tip-details">
                    <li>Notify landlord or property manager</li>
                    <li>Update security system if applicable</li>
                    <li>Confirm new address with postal service</li>
                    <li>Leave forwarding information for mail</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="cta-section">
              <h2>Ready for Moving Day?</h2>
              <p>Now that you understand moving day preparation, let our professional movers help you execute the perfect move. Get instant quotes from verified moving companies in your area.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Moving Quote
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/guides/packing-phase">← Back to Packing Phase</Link> | <Link to="/guides/settling-in">Next: Settling In →</Link>
              </p>
            </div>
          </article>
        </div>
      </main>
      <StaticFooter />
    </>
  );
};

export default MovingDay;
