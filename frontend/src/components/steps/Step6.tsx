import React, { useState, useEffect } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

const Step6: React.FC = () => {
  const { data, setData } = useForm();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Real Stripe Payment Link URL
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/bJe14n2kFc4zenr3ST1wY00';

  useEffect(() => {
    console.log('Step 6 - Data structure:', {
      selectedQuote: data.selectedQuote,
      vendor: data.vendor,
      fromDetails: data.fromDetails,
      contact: data.contact
    });
  }, [data]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      console.log('Step 6 - Starting real payment process...');
      
      // Create payment intent first to save lead data
      console.log('Step 6 - Creating payment intent...');
      console.log('Step 6 - Data structure:', {
        selectedQuote: data.selectedQuote,
        vendor: data.vendor,
        fromDetails: data.fromDetails,
        contact: data.contact
      });

      const intentResponse = await fetch('https://movedin-backend.onrender.com/api/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // $1.00 CAD in cents
          currency: 'cad',
          selectedQuote: data.selectedQuote,
          vendor: data.vendor,
          fromDetails: data.fromDetails,
          contact: data.contact
        }),
      });

      if (!intentResponse.ok) {
        throw new Error(`Failed to create payment intent: ${await intentResponse.text()}`);
      }

      const intentData = await intentResponse.json();
      console.log('Step 6 - Payment intent created:', intentData);

      // Redirect to real Stripe Payment Link
      console.log('Step 6 - Redirecting to Stripe Payment Link...');
      window.location.href = STRIPE_PAYMENT_LINK;
      
    } catch (error) {
      console.error('Step 6 - Payment error:', error);
      setPaymentError(error instanceof Error ? error.message : 'Payment failed');
      setIsProcessing(false);
    }
  };

  const selectedQuote = data.selectedQuote;
  const vendor = data.vendor;
  const fromDetails = data.fromDetails;
  const contact = data.contact;

  if (!selectedQuote || !vendor || !fromDetails || !contact) {
    return (
      <div className="step-container">
        <div className="step-content">
          <h2>Review & Payment</h2>
          <p>Please complete all previous steps before proceeding to payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container step6-modern">
      <div className="step-content">
        <h2>Review & Payment</h2>
        
        <div className="review-section">
          <h3>Move Details</h3>
                     <div className="review-grid">
             <div className="review-item">
               <strong>From:</strong> {data.from}
             </div>
             <div className="review-item">
               <strong>To:</strong> {data.to}
             </div>
             <div className="review-item">
               <strong>Date:</strong> {data.date}
             </div>
             <div className="review-item">
               <strong>Time:</strong> {data.time}
             </div>
             <div className="review-item">
               <strong>Rooms:</strong> {fromDetails.rooms}
             </div>
             <div className="review-item">
               <strong>Home Type:</strong> {fromDetails.homeType}
             </div>
           </div>
        </div>

        <div className="review-section">
          <h3>Contact Information</h3>
                     <div className="review-grid">
             <div className="review-item">
               <strong>Name:</strong> {contact.firstName} {contact.lastName}
             </div>
             <div className="review-item">
               <strong>Email:</strong> {contact.email}
             </div>
             <div className="review-item">
               <strong>Phone:</strong> {contact.phone}
             </div>
           </div>
        </div>

        <div className="review-section">
          <h3>Selected Quote</h3>
          <div className="quote-summary">
            <div className="vendor-info">
              <h4>{vendor.vendor_name}</h4>
              <p className="vendor-description">
                Professional moving services with {vendor.crew_size} crew members
              </p>
            </div>
            <div className="quote-details">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Hourly Rate:</span>
                  <span>${vendor.hourly_rate}/hour</span>
                </div>
                <div className="price-item">
                  <span>Estimated Hours:</span>
                  <span>{vendor.estimated_hours} hours</span>
                </div>
                <div className="price-item total">
                  <span>Total Cost:</span>
                  <span>${vendor.total_cost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <div className="payment-notice">
            <h3>Payment Required</h3>
            <p>
              <strong>Important:</strong> This is an estimate based on the information provided. 
              The final price will be determined by the actual moving time and any additional services required.
            </p>
            <p>
              A $1.00 CAD deposit is required to secure your booking and confirm your move details.
            </p>
          </div>

          {paymentError && (
            <div className="error-message">
              <p>Payment Error: {paymentError}</p>
              <button onClick={() => setPaymentError(null)}>Try Again</button>
            </div>
          )}

          {paymentSuccess && (
            <div className="success-message">
              <p>Payment processed successfully! Redirecting...</p>
            </div>
          )}

          {/* Hidden button for footer to trigger */}
          <button 
            className="pay-button-modern" 
            onClick={handlePayment}
            disabled={isProcessing}
            style={{ display: 'none' }}
          >
            {isProcessing ? 'Processing...' : 'Pay $1.00 CAD Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6; 