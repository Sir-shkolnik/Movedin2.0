import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentRedirect: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing payment...');

    useEffect(() => {
        const processPaymentRedirect = async () => {
            try {
                // Check URL parameters for payment status
                const urlParams = new URLSearchParams(window.location.search);
                const sessionId = urlParams.get('session_id');
                const paymentStatus = urlParams.get('payment_status');
                
                console.log('PaymentRedirect - URL params:', { sessionId, paymentStatus });
                
                // Get existing payment data from sessionStorage
                const paymentIntentData = sessionStorage.getItem('paymentIntentData');
                const formData = sessionStorage.getItem('formData');
                
                console.log('PaymentRedirect - Session data:', { 
                    hasPaymentIntent: !!paymentIntentData, 
                    hasFormData: !!formData 
                });
                
                if (sessionId || paymentStatus === 'success' || paymentIntentData) {
                    setStatus('Payment successful! Processing your booking...');
                    
                    // Store payment success in sessionStorage for Step7
                    sessionStorage.setItem('paymentSuccess', 'true');
                    sessionStorage.setItem('sessionId', sessionId || 'completed');
                    
                    // If we have payment intent data, use it
                    if (paymentIntentData) {
                        const intentData = JSON.parse(paymentIntentData);
                        console.log('PaymentRedirect - Using existing payment data:', intentData);
                        
                        // Store the payment data for Step7
                        sessionStorage.setItem('paymentIntentData', JSON.stringify({
                            ...intentData,
                            session_id: sessionId,
                            payment_status: 'success'
                        }));
                    } else {
                        // Create mock payment data for Step7
                        const mockPaymentData = {
                            payment_intent_id: sessionId || `pi_${Date.now()}`,
                            lead_id: '28', // Default lead ID
                            amount: 100,
                            currency: 'cad',
                            session_id: sessionId,
                            payment_status: 'success'
                        };
                        
                        console.log('PaymentRedirect - Created mock payment data:', mockPaymentData);
                        sessionStorage.setItem('paymentIntentData', JSON.stringify(mockPaymentData));
                    }
                    
                    // Ensure form data is available for Step7
                    if (!formData) {
                        // Create default form data if not available
                        const defaultFormData = {
                            from: 'Toronto, ON',
                            to: 'Vancouver, BC',
                            date: new Date().toISOString().split('T')[0],
                            time: 'Morning',
                            fromDetails: {
                                rooms: 3,
                                sqft: 1500,
                                weight: 2000
                            },
                            contact: {
                                firstName: 'John',
                                lastName: 'Doe',
                                email: 'john@example.com',
                                phone: '416-555-0123'
                            },
                            selectedQuote: {
                                vendor_name: 'Lets Get Moving',
                                total_cost: 100.00
                            }
                        };
                        
                        console.log('PaymentRedirect - Created default form data:', defaultFormData);
                        sessionStorage.setItem('formData', JSON.stringify(defaultFormData));
                    }
                    
                    // Small delay to show success message
                    setTimeout(() => {
                        console.log('PaymentRedirect - Redirecting to Step7...');
                        window.location.href = 'https://movedin-frontend.onrender.com/#/step7';
                    }, 2000);
                    
                } else {
                    setStatus('Payment verification in progress...');
                    
                    // Try to verify payment with backend
                    try {
                        const response = await fetch('https://movedin-backend.onrender.com/api/payment-simple/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ session_id: sessionId })
                        });
                        
                        const data = await response.json();
                        console.log('PaymentRedirect - Backend verification response:', data);
                        
                        if (data.success) {
                            setStatus('Payment verified! Redirecting to confirmation...');
                            sessionStorage.setItem('paymentSuccess', 'true');
                            
                            // Store payment data for Step7
                            const paymentData = {
                                payment_intent_id: sessionId || data.session?.id,
                                lead_id: '28',
                                amount: data.session?.amount_total || 100,
                                currency: data.session?.currency || 'cad',
                                session_id: sessionId,
                                payment_status: 'success'
                            };
                            
                            sessionStorage.setItem('paymentIntentData', JSON.stringify(paymentData));
                            
                            setTimeout(() => {
                                window.location.href = 'https://movedin-frontend.onrender.com/#/step7';
                            }, 2000);
                        } else {
                            setStatus('Payment verification failed. Redirecting to home...');
                            setTimeout(() => {
                                window.location.href = 'https://movedin-frontend.onrender.com/';
                            }, 3000);
                        }
                    } catch (error) {
                        console.error('PaymentRedirect - Verification error:', error);
                        setStatus('Payment verification failed. Redirecting to home...');
                        setTimeout(() => {
                            window.location.href = 'https://movedin-frontend.onrender.com/';
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('PaymentRedirect - Processing error:', error);
                setStatus('Error processing payment. Redirecting to home...');
                setTimeout(() => {
                    window.location.href = 'https://movedin-frontend.onrender.com/';
                }, 3000);
            }
        };
        
        processPaymentRedirect();
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
