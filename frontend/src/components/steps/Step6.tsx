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

  // Function to provide detailed explanations for additional services
  const getServiceExplanation = (service: string): string => {
    const explanations: { [key: string]: string } = {
      'Packing Services': 'Depends on number of items, fragility, special materials needed, and time required',
      'Storage Services': 'Based on storage duration, unit size, climate control needs, and accessibility requirements',
      'Cleaning Services': 'Varies by property size, cleaning depth required, and specific areas to be cleaned',
      'Junk Removal': 'Determined by volume, weight, disposal requirements, and local dump fees'
    };
    return explanations[service] || 'Pricing varies based on specific requirements and scope of work';
  };

  // Function to format travel time in a user-friendly way
  const formatTravelTime = (hours: number | null | undefined): string => {
    if (!hours || hours <= 0) return 'N/A';
    
    const totalMinutes = Math.round(hours * 60);
    const displayHours = Math.floor(totalMinutes / 60);
    const displayMinutes = totalMinutes % 60;
    
    if (displayHours === 0) {
      return `${displayMinutes}m`;
    } else if (displayMinutes === 0) {
      return `${displayHours}h`;
    } else {
      return `${displayHours}h ${displayMinutes}m`;
    }
  };

  // Dynamic Stripe Payment Links are now created by the backend
  // with proper redirect URLs configured automatically

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
    console.log('🚀 Step 6 - handlePayment function called!');
    console.log('🔍 Step 6 - Current data:', data);
    console.log('🔍 Step 6 - Contact data:', data.contact);
    console.log('🔍 Step 6 - Selected quote:', data.selectedQuote);
    console.log('🔍 Step 6 - Vendor:', data.vendor);
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      console.log('Step 6 - Starting checkout session creation...');
      console.log('Step 6 - Data structure:', {
        selectedQuote: data.selectedQuote,
        vendor: data.vendor,
        fromDetails: data.fromDetails,
        contact: data.contact
      });

      // Validate required contact information
      if (!data.contact?.firstName || !data.contact?.lastName || !data.contact?.email || !data.contact?.phone) {
        throw new Error('Please complete all contact information in the previous step');
      }

      console.log('Step 6 - Contact validation passed, proceeding with payment...');

      // First, create a lead
      console.log('Step 6 - Creating lead...');
      const leadResponse = await fetch('https://movedin-backend.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote_data: {
            originAddress: data.from,
            destinationAddress: data.to,
            moveDate: data.date,
            moveTime: data.time,
            totalRooms: data.fromDetails?.rooms || 3,
            squareFootage: data.fromDetails?.sqft || 0,
            estimatedWeight: 0,
            stairsAtPickup: data.fromDetails?.stairs || 0,
            stairsAtDropoff: data.toDetails?.stairs || 0,
            elevatorAtPickup: data.fromDetails?.elevator || false,
            elevatorAtDropoff: data.toDetails?.elevator || false,
            heavyItems: data.fromDetails?.heavyItems || {},
            additionalServices: data.fromDetails?.additionalServices || {}
          },
          selected_quote: {
            vendor_slug: data.selectedQuote?.vendor_id || data.vendor?.vendor_slug || '',
            vendor_name: data.selectedQuote?.vendor_name || data.vendor?.vendor_name || '',
            total_cost: data.selectedQuote?.total_cost || 0,
            crew_size: data.selectedQuote?.crew_size || 2,
            truck_count: data.selectedQuote?.truck_count || 1,
            estimated_hours: data.selectedQuote?.estimated_hours || 4.0,
            travel_time_hours: data.selectedQuote?.travel_time_hours || 1.0,
            breakdown: data.selectedQuote?.breakdown || {}
          },
          contact_data: data.contact
        })
      });

      if (!leadResponse.ok) {
        const errorData = await leadResponse.json();
        throw new Error(`Failed to create lead: ${errorData.detail || 'Unknown error'}`);
      }

      const leadData = await leadResponse.json();
      const leadId = leadData.id;
      console.log('Step 6 - Lead created with ID:', leadId);

      // Now create payment link with the lead_id
      console.log('Step 6 - Creating payment link...');
      const response = await fetch('https://movedin-backend.onrender.com/api/payment-simple/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100, // $1.00 CAD in cents
          currency: 'cad',
          lead_id: leadId,
          customer_email: data.contact?.email || '',
          vendor_slug: data.selectedQuote?.vendor_id || data.vendor?.vendor_slug || ''
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Step 6 - Payment API error:', errorText);
        throw new Error(`Failed to create checkout session: ${errorText}`);
      }

      const result = await response.json();
      console.log('Step 6 - Payment link created:', result);

      if (!result.payment_link_url) {
        throw new Error('No payment link URL received from server');
      }

      // Redirect to Stripe Checkout
      console.log('Step 6 - Redirecting to Stripe Checkout...');
      window.location.href = result.payment_link_url;
      
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
          const totalTime = selectedQuote.estimated_hours || 0; // Use only estimated_hours as it already includes travel time

  return (
    <div className="step-card step6-modern">
      <h2>Review & Complete Booking</h2>
      
      <div className="step6-layout-grid" style={{ 
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
          <div className="step6-card-mobile" style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 className="step6-card-title" style={{ marginBottom: '16px', color: '#495057', fontSize: '16px' }}>📍 Move Details</h3>
            <div className="step6-card-content" style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div className="step6-detail-row"><strong>Date:</strong> {data.date} at {data.time}</div>
              <div className="step6-detail-row"><strong>From:</strong> <span style={{ fontSize: '13px', wordBreak: 'break-word' }}>{data.from}</span></div>
              <div className="step6-detail-row"><strong>To:</strong> <span style={{ fontSize: '13px', wordBreak: 'break-word' }}>{data.to}</span></div>
              <div className="step6-detail-row"><strong>Move Size:</strong> {data.fromDetails?.rooms || 'N/A'} rooms</div>
            </div>
          </div>

          {/* Vendor Card */}
          <div className="step6-card-mobile" style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 className="step6-card-title" style={{ marginBottom: '16px', color: '#495057', fontSize: '16px' }}>🚛 Moving Company</h3>
            <div className="step6-card-content" style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <div className="step6-detail-row"><strong>Vendor:</strong> {selectedQuote.vendor_name}</div>
              <div className="step6-detail-row"><strong>Estimated Cost:</strong> {formatCurrency(selectedQuote.total_cost || 0)}</div>
              <div className="step6-detail-row"><strong>Booking Reference:</strong> L{Math.floor(Math.random() * 900000) + 100000}</div>
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

        </div>

        {/* Right Column */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          {/* Service Details Card */}
          <div className="step6-card-mobile" style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 className="step6-card-title" style={{ marginBottom: '16px', color: '#495057', fontSize: '16px' }}>⚙️ Service Details</h3>
            <div className="step6-service-grid" style={{ 
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
                <div style={{ fontWeight: 'bold', color: '#0056b3' }}>🚗 {formatTravelTime(selectedQuote.travel_time_hours)}</div>
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

            {/* Additional Services Section */}
            {selectedQuote.additional_services_info && selectedQuote.additional_services_info.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ marginBottom: '12px', color: '#495057', fontSize: '16px' }}>🔧 Additional Services Requested</h4>
                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px' }}>💡</span>
                    <p style={{ color: '#856404', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                      Why These Services Require Personal Assessment
                    </p>
                  </div>
                  
                  <p style={{ color: '#856404', fontSize: '12px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    The following services require individual assessment because pricing depends on multiple factors that can only be determined through direct consultation:
                  </p>
                  
                  <ul style={{ margin: '0 0 12px 16px', color: '#856404', fontSize: '12px', lineHeight: '1.4' }}>
                    {selectedQuote.additional_services_info.map((service: string, index: number) => (
                      <li key={index} style={{ marginBottom: '6px' }}>
                        <strong>{service}</strong> - {getServiceExplanation(service)}
                      </li>
                    ))}
                  </ul>
                  
                  <div style={{
                    backgroundColor: '#ffeaa7',
                    borderRadius: '6px',
                    padding: '10px',
                    marginTop: '12px'
                  }}>
                    <p style={{ color: '#856404', fontSize: '11px', margin: 0, fontWeight: 'bold' }}>
                      🤝 We're Here to Help: Your moving company will provide detailed quotes for these services during their consultation call, ensuring you get fair, accurate pricing based on your specific needs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Route Map */}
          <div className="step6-card-mobile" style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 className="step6-card-title" style={{ marginBottom: '16px', color: '#495057', fontSize: '16px' }}>🗺️ Route Map</h3>
            <RouteMap from={data.from} to={data.to} />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="step6-card-mobile" style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 className="step6-card-title" style={{ marginBottom: '16px', color: '#495057', fontSize: '16px' }}>💳 Payment</h3>
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

        {/* Payment button for footer trigger */}
        <button
          ref={(el) => {
            if (el) {
              el.className = 'pay-button-modern';
              console.log('🔍 Step 6 - Button ref set, className:', el.className);
            }
          }}
          onClick={(e) => {
            console.log('🚀 Step 6 - Direct button click!', e);
            handlePayment();
          }}
          disabled={isProcessing}
          style={{ 
            display: 'block',
            width: '100%',
            padding: '14px 28px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.6 : 1,
            marginTop: '20px'
          }}
        >
          {isProcessing ? 'Processing...' : 'Pay $1.00 CAD Deposit'}
        </button>
      </div>

      {/* What Happens Next */}
      <div className="step6-card-mobile" style={{
        backgroundColor: '#e7f3ff',
        border: '1px solid #b3d9ff',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 className="step6-card-title" style={{ marginBottom: '16px', color: '#0056b3', fontSize: '16px' }}>🎯 What Happens Next?</h3>
        <div className="step6-next-steps" style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📧</span>
            <span><strong>Email Confirmation</strong> - You'll receive a detailed confirmation email within 5 minutes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📞</span>
            <span><strong>Vendor Contact</strong> - Your selected moving company will contact you within 24 hours to confirm the final price, details, and provide pricing for any additional services</span>
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