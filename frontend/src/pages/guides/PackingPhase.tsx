import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../Page.css';

const PackingPhase: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Packing Phase: 4-6 Weeks Before Your Move | MovedIn - Moving Guide</title>
        <meta name="description" content="Master the packing phase of your move with our comprehensive 4-6 week guide. Expert tips for packing supplies, labeling, organization, and smart packing techniques from MovedIn." />
        <meta name="keywords" content="moving packing, packing supplies, packing organization, moving labeling, packing techniques, moving inventory, MovedIn guide" />
        <link rel="canonical" href="https://movedin.com/guides/packing-phase" />
        <meta property="og:title" content="Packing Phase: 4-6 Weeks Before Your Move | MovedIn" />
        <meta property="og:description" content="Master the packing phase of your move with our comprehensive 4-6 week guide. Expert tips for packing supplies, labeling, organization, and smart packing techniques." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://movedin.com/guides/packing-phase" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <main className="page-container" aria-labelledby="packing-title">
        <div className="page-content">
          <article className="page-card">
            <header>
              <h1 id="packing-title">📦 Packing Phase: 4-6 Weeks Before Your Move</h1>
              <p className="page-subtitle">Smart packing can save you time, money, and stress. Follow these proven techniques used by professional movers.</p>
            </header>

            <section className="tips-section">
              <h2>Essential Packing Supplies</h2>
              <p>Don't skimp on packing materials. Quality boxes, tape, and protective materials will prevent damage and make unpacking easier.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📦 Quality Boxes</h3>
                  <p>Use new, sturdy boxes in standard sizes for easy stacking and transportation. Specialty boxes are available for fragile items.</p>
                  <ul className="tip-details">
                    <li>Small boxes (1.5 cu ft) for heavy items like books</li>
                    <li>Medium boxes (3 cu ft) for most household items</li>
                    <li>Large boxes (4.5 cu ft) for lightweight, bulky items</li>
                    <li>Specialty boxes for dishes, artwork, and electronics</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🛡️ Protective Materials</h3>
                  <p>Invest in quality protective materials to prevent damage to your valuable belongings during the move.</p>
                  <ul className="tip-details">
                    <li>Bubble wrap for fragile items</li>
                    <li>Packing paper for general protection</li>
                    <li>Furniture blankets for large items</li>
                    <li>Corner protectors for furniture</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🔧 Packing Tools</h3>
                  <p>Having the right tools will make your packing more efficient and professional-looking.</p>
                  <ul className="tip-details">
                    <li>High-quality packing tape and dispenser</li>
                    <li>Permanent markers for labeling</li>
                    <li>Scissors and box cutter</li>
                    <li>Measuring tape for furniture planning</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🏷️ Labeling System</h3>
                  <p>Create a consistent labeling system that works for you and your movers. This will make unpacking much easier.</p>
                  <ul className="tip-details">
                    <li>Color-coded labels for different rooms</li>
                    <li>Clear descriptions of box contents</li>
                    <li>Priority indicators for essential items</li>
                    <li>Fragile item warnings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Smart Packing Techniques</h2>
              <p>Follow these proven packing techniques to maximize space, protect your items, and make unpacking a breeze.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📱 Digital Inventory</h3>
                  <p>Document your belongings with photos and descriptions. This serves as both an organizational tool and insurance documentation.</p>
                  <ul className="tip-details">
                    <li>Take photos of valuable items before packing</li>
                    <li>Keep receipts for expensive purchases</li>
                    <li>Create a spreadsheet with item descriptions and values</li>
                    <li>Store inventory in cloud storage for accessibility</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🧴 Room-by-Room Approach</h3>
                  <p>Pack one room at a time to stay organized. Start with non-essential items and work your way to daily necessities.</p>
                  <ul className="tip-details">
                    <li>Pack heavy items in small boxes</li>
                    <li>Use towels and linens as padding</li>
                    <li>Keep similar items together</li>
                    <li>Pack items you'll need last, first</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📦 Box Organization</h3>
                  <p>Organize boxes by room and priority to make unpacking efficient and logical.</p>
                  <ul className="tip-details">
                    <li>Pack essential items in clearly marked boxes</li>
                    <li>Group items by room and function</li>
                    <li>Create an "open first" box for immediate needs</li>
                    <li>Keep important documents separate and accessible</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🔒 Security and Protection</h3>
                  <p>Ensure valuable and fragile items are properly protected and secured during the move.</p>
                  <ul className="tip-details">
                    <li>Double-box fragile items</li>
                    <li>Use furniture blankets for large pieces</li>
                    <li>Secure heavy items to prevent shifting</li>
                    <li>Keep valuables with you, not in moving truck</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Specialty Item Packing</h2>
              <p>Some items require special attention and packing techniques to ensure they arrive safely at your new home.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>🍽️ Kitchen and Dishes</h3>
                  <p>Kitchen items are often fragile and valuable. Take extra care when packing dishes, glassware, and appliances.</p>
                  <ul className="tip-details">
                    <li>Use specialty dish boxes with dividers</li>
                    <li>Wrap each dish individually in packing paper</li>
                    <li>Pack plates vertically, not flat</li>
                    <li>Secure small appliances in their original boxes</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>🖼️ Artwork and Mirrors</h3>
                  <p>Artwork and mirrors are extremely fragile and require special handling and packing materials.</p>
                  <ul className="tip-details">
                    <li>Use specialty art boxes with corner protection</li>
                    <li>Wrap in bubble wrap and packing paper</li>
                    <li>Mark boxes as "fragile" and "this side up"</li>
                    <li>Consider professional packing for valuable pieces</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>💻 Electronics and Technology</h3>
                  <p>Electronics are sensitive to temperature changes and rough handling. Pack them carefully to prevent damage.</p>
                  <ul className="tip-details">
                    <li>Use original packaging when possible</li>
                    <li>Remove batteries and secure loose parts</li>
                    <li>Pack in climate-controlled environment</li>
                    <li>Keep cords and accessories together</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>👕 Clothing and Textiles</h3>
                  <p>Clothing can be packed efficiently using various methods depending on the type and season.</p>
                  <ul className="tip-details">
                    <li>Use wardrobe boxes for hanging clothes</li>
                    <li>Pack seasonal items first</li>
                    <li>Use vacuum bags for bulky items</li>
                    <li>Keep essential clothing easily accessible</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="tips-section">
              <h2>Packing Timeline</h2>
              <p>Follow this timeline to ensure you're packed and ready when moving day arrives.</p>
              
              <div className="tips-grid">
                <div className="tip-card">
                  <h3>📅 Week 6: Start Early</h3>
                  <p>Begin with items you rarely use and seasonal belongings that won't be needed before the move.</p>
                  <ul className="tip-details">
                    <li>Pack seasonal decorations and clothing</li>
                    <li>Start with storage areas and guest rooms</li>
                    <li>Gather packing supplies and boxes</li>
                    <li>Create your labeling system</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📅 Week 5: Living Areas</h3>
                  <p>Pack living room, dining room, and other common areas. Keep essential items accessible.</p>
                  <ul className="tip-details">
                    <li>Pack books, DVDs, and decorative items</li>
                    <li>Pack non-essential furniture accessories</li>
                    <li>Keep daily use items out until last</li>
                    <li>Label boxes clearly by room and contents</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📅 Week 4: Bedrooms and Bathrooms</h3>
                  <p>Pack bedrooms and bathrooms, keeping essential items for daily use.</p>
                  <ul className="tip-details">
                    <li>Pack extra linens and towels</li>
                    <li>Pack non-essential clothing and accessories</li>
                    <li>Keep one set of essentials out</li>
                    <li>Pack toiletries last</li>
                  </ul>
                </div>
                
                <div className="tip-card">
                  <h3>📅 Week 3: Kitchen and Final Items</h3>
                  <p>Pack the kitchen last, keeping essential cooking and eating items until the final days.</p>
                  <ul className="tip-details">
                    <li>Pack non-essential kitchen items</li>
                    <li>Keep basic cooking supplies accessible</li>
                    <li>Pack appliances and specialty items</li>
                    <li>Create a "last night" essentials kit</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="cta-section">
              <h2>Ready to Start Packing Your Move?</h2>
              <p>Now that you understand the packing phase, let our professional movers help you execute the perfect move. Get instant quotes from verified moving companies in your area.</p>
              <button className="cta-button" onClick={() => navigate('/')}>
                Get Your Free Moving Quote
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <Link to="/guides/planning-phase">← Back to Planning Phase</Link> | <Link to="/guides/moving-day">Next: Moving Day →</Link>
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer onContinue={() => navigate('/')} showContinue={true} label="Get Quote" />
    </>
  );
};

export default PackingPhase;
