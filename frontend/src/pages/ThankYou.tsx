import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ThankYou.css';

interface MoveData {
  from: string;
  to: string;
  date: string;
  time: string;
  vendor: string;
  cost: string;
}

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [moveData, setMoveData] = useState<MoveData>({
    from: 'Toronto, ON',
    to: 'Mississauga, ON',
    date: new Date().toLocaleDateString(),
    time: 'Morning',
    vendor: 'Let\'s Get Moving',
    cost: '$1.00 CAD'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMoveData = async () => {
      try {
        const leadId = searchParams.get('lead_id');
        const vendor = searchParams.get('vendor') || 'lets-get-moving';
        const amount = searchParams.get('amount') || '100';
        const currency = searchParams.get('currency') || 'cad';
        const email = searchParams.get('email') || '';

        // If we have a lead_id, fetch the actual move data from backend
        if (leadId) {
          const response = await fetch(`https://movedin-backend.onrender.com/api/leads/${leadId}`);
          if (response.ok) {
            const leadData = await response.json();
            
            // Extract move details from lead data
            const quoteData = leadData.quote_data || {};
            const selectedQuote = leadData.selected_quote || {};
            
            setMoveData({
              from: quoteData.origin_address || 'Toronto, ON',
              to: quoteData.destination_address || 'Mississauga, ON',
              date: quoteData.move_date || new Date().toLocaleDateString(),
              time: quoteData.move_time || 'Morning',
              vendor: selectedQuote.vendor_name || 'Let\'s Get Moving',
              cost: `$${selectedQuote.total_cost || (parseInt(amount)/100).toFixed(2)} CAD`
            });
          } else {
            // Use URL parameters if fetch fails
            setMoveData({
              from: 'Toronto, ON',
              to: 'Mississauga, ON',
              date: new Date().toLocaleDateString(),
              time: 'Morning',
              vendor: 'Let\'s Get Moving',
              cost: `$${(parseInt(amount)/100).toFixed(2)} ${currency.toUpperCase()}`
            });
          }
        } else {
          // Use URL parameters if no lead_id
          setMoveData({
            from: 'Toronto, ON',
            to: 'Mississauga, ON',
            date: new Date().toLocaleDateString(),
            time: 'Morning',
            vendor: 'Let\'s Get Moving',
            cost: `$${(parseInt(amount)/100).toFixed(2)} ${currency.toUpperCase()}`
          });
        }
      } catch (error) {
        console.log('Error loading move data:', error);
        // Use defaults on error
        setMoveData({
          from: 'Toronto, ON',
          to: 'Mississauga, ON',
          date: new Date().toLocaleDateString(),
          time: 'Morning',
          vendor: 'Let\'s Get Moving',
          cost: '$1.00 CAD'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMoveData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="thank-you-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your move details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="thank-you-container">
      <div className="container">
        <div className="logo">MOVEDIN.</div>
        <div className="success-icon">🎉</div>
        <h1 className="title">Your Move is Booked!</h1>
        <p className="subtitle">Thank you for choosing MovedIn. Your moving company will contact you shortly.</p>
        
        <div className="move-details">
          <h3>Move Details</h3>
          <div className="detail-row">
            <span className="detail-label">From:</span>
            <span className="detail-value">{moveData.from}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">To:</span>
            <span className="detail-value">{moveData.to}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{moveData.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{moveData.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Moving Company:</span>
            <span className="detail-value">{moveData.vendor}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Cost:</span>
            <span className="detail-value">{moveData.cost}</span>
          </div>
        </div>
        
        <div className="payment-info">
          <h3>Payment Confirmation</h3>
          <p className="payment-status">✅ Payment Completed Successfully</p>
          <p>Your $1 CAD deposit has been processed and your move is confirmed.</p>
        </div>
        
        <div className="next-steps">
          <h3>What Happens Next?</h3>
          <ul>
            <li>Your moving company will contact you within 24 hours</li>
            <li>They'll confirm your move details and schedule</li>
            <li>You'll receive a detailed moving plan</li>
            <li>On move day, they'll arrive at your scheduled time</li>
          </ul>
        </div>
        
        <div className="contact-info">
          <h3>Need Help?</h3>
          <p>Contact our support team at <strong>support@movedin.com</strong></p>
          <p>We're here to help make your move smooth and stress-free!</p>
        </div>
        
        <div className="actions">
          <a href="/" className="btn">Get Another Quote</a>
          <a href="/how-it-works" className="btn btn-secondary">How It Works</a>
        </div>
        
        <div className="footer">
          <p>Thank you for choosing MovedIn - Your trusted moving partner!</p>
          <p>© 2025 MovedIn. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
