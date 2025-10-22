import React, { useState, useEffect } from "react";
import { useForm } from "../../../contexts/FormContext";

function ThankYouStep() {
  // Try to get form data, but handle case when no context is available (direct URL access)
  let data = {};
  try {
    const formContext = useForm();
    data = formContext?.data || {};
  } catch (error) {
    // No form context available (direct URL access after payment)
    console.log('No form context available, using default data');
    data = {};
  }

  // Get URL parameters for direct access (after payment redirect)
  const [urlParams, setUrlParams] = useState({});
  const [leadData, setLeadData] = useState(null);

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const paramObj = {};
    for (const [key, value] of params.entries()) {
      paramObj[key] = value;
    }
    setUrlParams(paramObj);

    // If we have a lead_id, try to fetch lead data
    if (paramObj.lead_id) {
      fetchLeadData(paramObj.lead_id);
    }
  }, []);

  const fetchLeadData = async (leadId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/leads/${leadId}`);
      if (response.ok) {
        const lead = await response.json();
        setLeadData(lead);
      }
    } catch (error) {
      console.log('Could not fetch lead data:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  };

  return (
    <div className="qw-inner-content">
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
        {/* Success Icon with Animation */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 style={{ 
          fontSize: '36px', 
          fontWeight: 700, 
          color: '#1F2937', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Thank You! 🎉
        </h2>
        
        <p style={{ 
          fontSize: '18px', 
          color: '#6B7280', 
          marginBottom: '40px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          Your moving quote has been successfully submitted. We're excited to help you with your move!
        </p>

        {/* Quote Summary Card */}
        {(data.selectedQuote || leadData) && (
          <div style={{
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #5340FF 0%, #4230dd 100%)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(83, 64, 255, 0.2)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total Cost</div>
                <div style={{ fontSize: '36px', fontWeight: 700 }}>{formatPrice((data.selectedQuote || leadData)?.total_cost || 0)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Moving Company</div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>{(data.selectedQuote || leadData)?.vendor_name || 'Your Selected Mover'}</div>
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              padding: '12px', 
              borderRadius: '8px',
              display: 'flex',
              gap: '16px',
              fontSize: '14px'
            }}>
              <div>📅 {(data.date || leadData?.move_date) || 'Your selected date'}</div>
              <div>🕐 {(data.time || leadData?.move_time) || 'Your selected time'}</div>
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div style={{
          background: '#F9FAFB',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          marginBottom: '32px'
        }}>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: 700, 
            color: '#1F2937', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '28px' }}>📋</span>
            What's Next?
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1 */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'start',
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5340FF 0%, #4230dd 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(83, 64, 255, 0.3)'
              }}>1</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '16px',
                  color: '#1F2937', 
                  marginBottom: '6px' 
                }}>
                  📧 Confirmation Email
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                  We've sent a confirmation email to <strong style={{ color: '#5340FF' }}>{(data.contact?.email || leadData?.customer_email) || 'your email'}</strong> with all the details of your quote.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'start',
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5340FF 0%, #4230dd 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(83, 64, 255, 0.3)'
              }}>2</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '16px',
                  color: '#1F2937', 
                  marginBottom: '6px' 
                }}>
                  📞 Vendor Contact
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                  <strong style={{ color: '#5340FF' }}>{(data.selectedQuote || leadData)?.vendor_name || 'Your selected mover'}</strong> will contact you within 24 hours to confirm your move and answer any questions.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'start',
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5340FF 0%, #4230dd 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(83, 64, 255, 0.3)'
              }}>3</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 700, 
                  fontSize: '16px',
                  color: '#1F2937', 
                  marginBottom: '6px' 
                }}>
                  🚚 Moving Day
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>
                  Your move is scheduled for <strong style={{ color: '#5340FF' }}>{(data.date || leadData?.move_date) || 'your selected date'}</strong> at <strong style={{ color: '#5340FF' }}>{(data.time || leadData?.move_time) || 'your selected time'}</strong>. We'll be in touch before then!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div style={{
          background: '#F0FDF4',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #10B981',
          marginBottom: '32px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'start', 
            gap: '12px' 
          }}>
            <span style={{ fontSize: '24px' }}>💬</span>
            <div>
              <div style={{ 
                fontWeight: 600, 
                fontSize: '16px',
                color: '#065F46', 
                marginBottom: '4px' 
              }}>
                Need Help?
              </div>
              <div style={{ fontSize: '14px', color: '#047857', lineHeight: '1.5' }}>
                If you have any questions or need to make changes, our support team is here to help. Contact us at <strong>support@movedin.ca</strong> or call <strong>1-800-MOVEDIN</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Return to Home Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #5340FF 0%, #4230dd 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(83, 64, 255, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(83, 64, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(83, 64, 255, 0.3)';
            }}
          >
            🏠 Return to Home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default ThankYouStep;


