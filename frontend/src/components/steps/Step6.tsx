import React, { useState, useEffect, useMemo } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

interface RouteMapProps {
    from: string;
    to: string;
}

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

  // Memoize the map component to prevent re-rendering
  const RouteMap = useMemo(() => {
    const MapComponent: React.FC<RouteMapProps> = ({ from, to }) => {
      const encodedFrom = encodeURIComponent(from);
      const encodedTo = encodeURIComponent(to);
      const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodedFrom}&destination=${encodedTo}&mode=driving`;
      
      return (
        <div className="route-map-container">
          <iframe
            title="Route Map"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: '12px' }}
            src={mapUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      );
    };
    return MapComponent;
  }, []);

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  if (!data.selectedQuote) {
    return (
      <div className="step-card">
        <h2>Review & Complete Booking</h2>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: '#dc2626', marginBottom: '16px' }}>
            No quote selected. Please go back and select a moving company.
          </p>
        </div>
      </div>
    );
  }

  const selectedQuote = data.selectedQuote;
  const totalTime = (selectedQuote.travel_time_hours || 0) + (selectedQuote.estimated_hours || 0);

  return (
    <div className="step-card step6-modern">
      <h2>Review & Complete Booking</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '24px',
        marginBottom: '30px'
      }}>
        {/* Left Column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          {/* Move Details Card */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>📍 Move Details</h3>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div><strong>Date:</strong> {data.date} at {data.time}</div>
              <div><strong>From:</strong> {data.from}</div>
              <div><strong>To:</strong> {data.to}</div>
              <div><strong>Move Size:</strong> {data.fromDetails?.rooms || 'N/A'} rooms</div>
            </div>
          </div>

          {/* Vendor Card */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>🚛 Moving Company</h3>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div><strong>Vendor:</strong> {selectedQuote.vendor_name}</div>
              <div><strong>Estimated Cost:</strong> {formatCurrency(selectedQuote.total_cost || 0)}</div>
              <div><strong>Booking Reference:</strong> L{Math.floor(Math.random() * 900000) + 100000}</div>
            </div>
            
            {/* Estimate Disclaimer */}
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '8px 12px',
              marginTop: '12px'
            }}>
              <p style={{ color: '#856404', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>
                <strong>⚠️ Estimate Only:</strong> Final price may vary based on actual moving time and services required.
              </p>
            </div>
          </div>

          {/* Contact Information Card */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>👤 Contact Information</h3>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div><strong>Name:</strong> {data.contact?.firstName} {data.contact?.lastName}</div>
              <div><strong>Email:</strong> {data.contact?.email}</div>
              <div><strong>Phone:</strong> {data.contact?.phone}</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          {/* Service Details Card */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>⚙️ Service Details</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              fontSize: '14px'
            }}>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '8px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid #b3d9ff'
              }}>
                <div style={{ fontWeight: 'bold', color: '#0056b3' }}>👥 {selectedQuote.crew_size || 'N/A'}</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Crew</div>
              </div>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '8px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid #b3d9ff'
              }}>
                <div style={{ fontWeight: 'bold', color: '#0056b3' }}>🚛 {selectedQuote.truck_count || 'N/A'}</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Trucks</div>
              </div>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '8px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid #b3d9ff'
              }}>
                <div style={{ fontWeight: 'bold', color: '#0056b3' }}>⏱️ {selectedQuote.estimated_hours || 'N/A'}h</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Labor Time</div>
              </div>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '8px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid #b3d9ff'
              }}>
                <div style={{ fontWeight: 'bold', color: '#0056b3' }}>🚗 {selectedQuote.travel_time_hours || 'N/A'}h</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Travel Time</div>
              </div>
              <div style={{
                backgroundColor: '#e7f3ff',
                padding: '8px 12px',
                borderRadius: '6px',
                textAlign: 'center',
                border: '1px solid #b3d9ff',
                gridColumn: 'span 2'
              }}>
                <div style={{ fontWeight: 'bold', color: '#0056b3' }}>💰 {formatCurrency(selectedQuote.hourly_rate || 0)} /hour</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Hourly Rate</div>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>🗺️ Route Map</h3>
            <RouteMap from={data.from} to={data.to} />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#495057' }}>💳 Payment</h3>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
            $1.00 CAD Deposit Amount
          </div>
          <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '8px' }}>
            This deposit reserves your move date and time. The remaining balance will be due on the day of your move.
          </p>
        </div>
        
        {/* Final Pricing Notice */}
        <div style={{
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', marginRight: '8px' }}>ℹ️</span>
            <strong style={{ color: '#0c5460' }}>Final Pricing Information</strong>
          </div>
          <div style={{ color: '#0c5460', fontSize: '14px', lineHeight: '1.4' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Estimated Total:</strong> {formatCurrency(selectedQuote.total_cost || 0)}
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Final Price Factors:</strong>
            </p>
            <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>
              <li>Actual moving time (may differ from estimate)</li>
              <li>Additional services requested on move day</li>
              <li>Final vendor assessment of your belongings</li>
              <li>Any unforeseen circumstances or delays</li>
            </ul>
            <p style={{ margin: 0, fontStyle: 'italic' }}>
              You will receive the final invoice after your move is completed.
            </p>
          </div>
        </div>

        {paymentError && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#721c24'
          }}>
            {paymentError}
          </div>
        )}

        {isProcessing && (
          <div style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#155724',
            textAlign: 'center'
          }}>
            Processing payment... Please wait.
          </div>
        )}

        {/* Hidden payment button for footer trigger */}
        <button
          ref={(el) => {
            if (el) {
              el.className = 'pay-button-modern';
            }
          }}
          onClick={handlePayment}
          disabled={isProcessing}
          style={{ display: 'none' }}
        >
          Pay $1.00 CAD Deposit
        </button>
      </div>

      {/* What Happens Next */}
      <div style={{
        backgroundColor: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ marginBottom: '16px', color: '#0056b3' }}>🎯 What Happens Next?</h3>
        <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📧</span>
            <span><strong>Email Confirmation</strong> - You'll receive a detailed confirmation email within 5 minutes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📞</span>
            <span><strong>Vendor Contact</strong> - Your selected moving company will contact you within 24 hours to confirm the final price and details</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📄</span>
            <span><strong>Detailed invoice & payment instructions</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <span><strong>Move date & time reserved</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step6; 