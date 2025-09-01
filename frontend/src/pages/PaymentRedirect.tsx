import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentRedirect: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing payment...');

    useEffect(() => {
        // Check if we have payment intent data in sessionStorage
        const paymentIntentData = sessionStorage.getItem('paymentIntentData');
        
        if (paymentIntentData) {
            setStatus('Payment successful! Redirecting to confirmation...');
            
            // Small delay to show success message
            setTimeout(() => {
                // Redirect to Step7 with hash routing
                window.location.href = 'https://movedin-frontend.onrender.com/#/step7';
            }, 2000);
        } else {
            setStatus('No payment data found. Redirecting to home...');
            
            // Redirect to home if no payment data
            setTimeout(() => {
                window.location.href = 'https://movedin-frontend.onrender.com/';
            }, 3000);
        }
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '90%'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '20px'
                }}>
                    🎉
                </div>
                
                <h1 style={{
                    color: '#2563eb',
                    marginBottom: '20px',
                    fontSize: '24px'
                }}>
                    Payment Processing
                </h1>
                
                <p style={{
                    color: '#6b7280',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '30px'
                }}>
                    {status}
                </p>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #e5e7eb',
                        borderTop: '2px solid #2563eb',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        Please wait...
                    </span>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PaymentRedirect;
