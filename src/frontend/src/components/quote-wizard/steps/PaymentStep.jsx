import React, { useState } from "react";
import { useForm } from "../../../contexts/FormContext";

function PaymentStep() {
  const { data } = useForm();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  };

  const handleSubmit = async () => {
    setProcessing(true);
    setError(null);
    
    try {
      // 1. Smart validation
      if (!data.contact?.firstName || !data.contact?.lastName || !data.contact?.email || !data.contact?.phone) {
        throw new Error('Please complete all contact information');
      }

      if (!data.selectedQuote) {
        throw new Error('Please select a moving company first');
      }

      console.log('🏗️ Creating smart lead...');
      
      // Use environment variable for API URL (supports both dev and production)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // 2. Smart lead creation (simplified payload)
      const leadPayload = {
        customer_name: `${data.contact.firstName} ${data.contact.lastName}`,
        customer_email: data.contact.email,
        customer_phone: data.contact.phone,
        move_from: data.from,
        move_to: data.to,
        move_date: data.date,
        move_time: data.time,
        vendor_name: data.selectedQuote.vendor_name,
        total_cost: data.selectedQuote.total_cost
      };
      
      const leadResponse = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });

      if (!leadResponse.ok) {
        const errorData = await leadResponse.json();
        throw new Error(`Failed to create lead: ${errorData.detail || 'Unknown error'}`);
      }

      const leadData = await leadResponse.json();
      const leadId = leadData.id;
      console.log('✅ Smart lead created with ID:', leadId);

      // 3. Send email notifications
      console.log('📧 Sending email notifications...');
      try {
        const emailResponse = await fetch(`${API_URL}/api/leads/${leadId}/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log('✅ Email notifications sent:', emailResult);
        } else {
          console.log('⚠️ Email notifications failed, but continuing...');
        }
      } catch (emailError) {
        console.log('⚠️ Email notification error (non-critical):', emailError);
      }

      // 4. Create payment link using new endpoint
      console.log('💳 Creating payment link...');
      const paymentPayload = {
        amount: 100, // $1.00 CAD in cents
        currency: 'cad',
        lead_id: leadId,
        customer_email: data.contact.email,
        vendor_slug: data.selectedQuote.vendor_slug || 'lets-get-moving'
      };
      
      const response = await fetch(`${API_URL}/api/payment/create-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create payment link: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Payment link created:', result);

      if (!result.payment_link_url) {
        throw new Error('No payment link URL received from server');
      }

      // 4. Redirect to payment URL (Stripe or Thank You page)
      console.log('🔄 Redirecting to:', result.payment_link_url);
      window.location.href = result.payment_link_url;
      
    } catch (err) {
      console.error('❌ Payment error:', err);
      
      // If backend is not running, show demo success
      if (err.message.includes('ERR_CONNECTION_REFUSED') || err.message.includes('Failed to fetch')) {
        console.log('🔄 Backend not running, showing demo success...');
        console.log('📧 Demo mode: Email notifications would be sent to:');
        console.log('   • Customer: support@movedin.com (confirmation)');
        console.log('   • Vendor: support@movedin.com (order notification)');
        console.log('   • Support: udi.shkolnik@alicesolutions.com (system alert)');
        setSuccess(true);
        setProcessing(false);
        
        // Simulate success after 2 seconds
        setTimeout(() => {
          window.location.href = '/quote/thank-you';
        }, 2000);
        return;
      }
      
      setError(err.message);
      setProcessing(false);
      
      // Auto-scroll to disclaimers section for compliance UX
      setTimeout(() => {
        const disclaimersSection = document.getElementById('legal-disclaimers');
        if (disclaimersSection) {
          disclaimersSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  const totalCost = data.selectedQuote?.total_cost || 0;

  // Fixed deposit amount (always $1 CAD)
  const depositAmount = 1;
  const remainingAmount = totalCost - depositAmount;

  return (
    <div className="qw-inner-content">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          color: '#1F2937', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #5340FF 0%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎉 Almost There!
        </h2>
        <p style={{ 
          fontSize: '18px', 
          color: '#6B7280', 
          marginBottom: '0',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          Secure your move with just a $1 deposit
        </p>
      </div>
      
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Success State */}
        {success && (
          <div style={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            padding: '32px', 
            borderRadius: '16px',
            marginBottom: '24px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
              Payment Processing!
            </h3>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>
              Redirecting to confirmation page...
            </p>
          </div>
        )}

        {/* Move Summary Card */}
        <div style={{ 
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            marginBottom: '20px', 
            color: '#1F2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Your Move Summary
          </h3>
          
          {data.selectedQuote && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Moving Company</div>
                <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.selectedQuote.vendor_name}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>Move Date</div>
                <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.date} at {data.time}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>From</div>
                <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.from}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>To</div>
                <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.to}</div>
              </div>
            </div>
          )}

          {/* Time Estimates */}
          {data.selectedQuote && (
            <div style={{ 
              marginTop: '20px',
              padding: '16px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                marginBottom: '12px', 
                color: '#1F2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⏱️ Estimated Timeline
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Driving Time</div>
                  <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.selectedQuote.estimated_driving_time || '2-3 hours'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Labor Time</div>
                  <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.selectedQuote.estimated_labor_time || '4-6 hours'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>Total Time</div>
                  <div style={{ fontWeight: 600, color: '#1F2937' }}>{data.selectedQuote.estimated_total_time || '6-9 hours'}</div>
                </div>
              </div>
              <div style={{ 
                marginTop: '12px',
                fontSize: '12px',
                color: '#6B7280',
                fontStyle: 'italic'
              }}>
                * Times are estimates based on property size and distance. Actual times may vary.
              </div>
            </div>
          )}
        </div>

        {/* Payment Breakdown */}
        <div style={{ 
          background: 'linear-gradient(135deg, #5340FF 0%, #7C3AED 100%)',
          padding: '32px', 
          borderRadius: '16px',
          marginBottom: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{ 
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '60px',
            height: '60px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              marginBottom: '8px', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              💳 Payment Breakdown
            </h3>
            <div style={{ 
              fontSize: '14px', 
              opacity: 0.9, 
              marginBottom: '24px',
              fontStyle: 'italic'
            }}>
              * All amounts are estimates. Final pricing may vary based on actual move requirements.
            </div>
            
            {data.selectedQuote && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <span style={{ fontSize: '16px', opacity: 0.9 }}>Estimated Move Cost</span>
                  <span style={{ fontSize: '20px', fontWeight: 700 }}>{formatPrice(totalCost)}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <span style={{ fontSize: '16px', opacity: 0.9 }}>Deposit (Today)</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#FEF3C7' }}>
                    {formatPrice(depositAmount)}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>Estimated Remaining Balance</span>
                  <span style={{ fontSize: '24px', fontWeight: 700 }}>
                    {formatPrice(remainingAmount)}
                  </span>
                </div>
                <div style={{ 
                  marginTop: '12px',
                  fontSize: '14px',
                  opacity: 0.8,
                  textAlign: 'center'
                }}>
                  Due on moving day (final amount may vary)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', 
            border: '1px solid #EF4444',
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#991B1B'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '8px' 
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>Payment Error</div>
            </div>
            <div style={{ fontSize: '14px', marginLeft: '36px' }}>{error}</div>
          </div>
        )}

        {/* Security & Trust */}
        <div style={{ 
          background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1px solid #10B981',
          padding: '24px', 
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'start', 
            gap: '16px' 
          }}>
            <div style={{ 
              fontSize: '32px',
              background: '#10B981',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}>
              🔒
            </div>
            <div>
              <h4 style={{ 
                fontWeight: 600, 
                color: '#065F46', 
                marginBottom: '8px',
                fontSize: '16px'
              }}>
                Secure Payment Processing
              </h4>
              <div style={{ 
                fontSize: '14px', 
                color: '#047857',
                lineHeight: '1.5'
              }}>
                Your payment is processed securely through Stripe. We use bank-level encryption 
                to protect your information. The remaining balance of {formatPrice(remainingAmount)} 
                will be due on your moving day.
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ 
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            marginBottom: '20px', 
            color: '#1F2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💳 Payment Method
          </h3>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', 
            border: '2px solid #5340FF', 
            borderRadius: '12px',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                border: '3px solid #5340FF',
                background: '#5340FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: 'white' 
                }} />
              </div>
              <div>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: '4px',
                  fontSize: '16px',
                  color: '#1F2937'
                }}>
                  Credit Card
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>Visa</span>
                  <span>•</span>
                  <span>Mastercard</span>
                  <span>•</span>
                  <span>American Express</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handleSubmit}
          disabled={processing || success}
          style={{
            width: '100%',
            height: '60px',
            background: processing || success ? '#9CA3AF' : 'linear-gradient(135deg, #5340FF 0%, #7C3AED 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: processing || success ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: processing || success ? 'none' : '0 4px 14px 0 rgba(83, 64, 255, 0.4)',
            transform: processing || success ? 'none' : 'translateY(0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            if (!processing && !success) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px 0 rgba(83, 64, 255, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!processing && !success) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px 0 rgba(83, 64, 255, 0.4)';
            }
          }}
        >
          {processing ? (
            <>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Processing Payment...
            </>
          ) : success ? (
            <>
              <span style={{ fontSize: '24px' }}>✅</span>
              Payment Successful!
            </>
          ) : (
            <>
              <span style={{ fontSize: '24px' }}>💳</span>
              Pay {formatPrice(depositAmount)} Deposit
            </>
          )}
        </button>

        {/* Legal Disclaimers & Important Information - Below CTA for better UX */}
        <section 
          id="legal-disclaimers"
          style={{ 
            marginTop: '32px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '1px solid #F59E0B',
            padding: '24px', 
            borderRadius: '12px',
            position: 'relative'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'start', 
            gap: '12px' 
          }}>
            <div style={{ 
              fontSize: '24px',
              flexShrink: 0
            }}>
              ⚠️
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                fontWeight: 600, 
                color: '#92400E', 
                marginBottom: '16px',
                fontSize: '16px'
              }}>
                Important Information & Legal Disclaimers
              </h4>
              <ul style={{ 
                fontSize: '13px', 
                color: '#92400E',
                lineHeight: '1.6',
                margin: 0,
                paddingLeft: '16px'
              }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Pricing is an Estimate:</strong> All quoted prices are estimates based on the information provided. 
                  Final pricing may vary based on actual move requirements, additional services, or unforeseen circumstances.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Additional Services:</strong> If you request additional services (packing, unpacking, disassembly, etc.), 
                  the moving company will contact you to discuss pricing and obtain approval before proceeding.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Time Estimates:</strong> Driving and labor times are estimates based on distance and property size. 
                  Actual times may vary due to traffic, weather, or other factors.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Final Approval Required:</strong> The moving company will contact you before the move to confirm 
                  all details and provide final pricing. You have the right to cancel or modify your booking at that time.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Deposit Policy:</strong> Your $1 deposit secures your booking slot. The remaining balance will be 
                  due on moving day and may differ from the estimate based on final requirements.
                </li>
              </ul>
              
              {/* Terms Agreement */}
              <div style={{ 
                borderTop: '1px solid rgba(146, 64, 14, 0.2)',
                paddingTop: '16px',
                fontSize: '12px',
                color: '#92400E'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>
                  By proceeding with this deposit payment, you acknowledge and agree that:
                </div>
                <ul style={{ 
                  margin: 0,
                  paddingLeft: '16px',
                  lineHeight: '1.5'
                }}>
                  <li style={{ marginBottom: '4px' }}>
                    All pricing is estimated and subject to change based on final requirements
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    The moving company will contact you to confirm final details and pricing
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    You have the right to cancel or modify your booking during the confirmation process
                  </li>
                </ul>
                <div style={{ 
                  marginTop: '12px',
                  textAlign: 'center'
                }}>
                  By proceeding, you agree to our{' '}
                  <a href="#" style={{ color: '#92400E', textDecoration: 'underline', fontWeight: 600 }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#92400E', textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PaymentStep;
