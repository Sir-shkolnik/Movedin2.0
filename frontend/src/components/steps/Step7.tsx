import React, { useState, useEffect } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

const Step7: React.FC = () => {
    const { data, setData } = useForm();
    const [showConfetti, setShowConfetti] = useState(false);
    const [leadId, setLeadId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'processing' | 'completed' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const handlePaymentCompletion = async () => {
            // Check if we have a session_id in the URL (returned from Stripe)
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            
            if (sessionId) {
                console.log('Step 7 - Payment link completed, session_id:', sessionId);
                
                try {
                    // Complete payment and save lead
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment-link-complete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            session_id: sessionId,
                            lead_data: {
                                quote_data: {
                                    originAddress: data.from,
                                    destinationAddress: data.to,
                                    moveDate: data.date,
                                    moveTime: data.time,
                                    totalRooms: (data.fromDetails && data.fromDetails.rooms),
                                    squareFootage: (data.fromDetails && data.fromDetails.sqft),
                                    estimatedWeight: 0, // Will be calculated by backend
                                    heavyItems: (data.fromDetails && data.fromDetails.heavyItems) || {},
                                    stairsAtPickup: (data.fromDetails && data.fromDetails.stairs) || 0,
                                    stairsAtDropoff: (data.toDetails && data.toDetails.stairs) || 0,
                                    elevatorAtPickup: (data.fromDetails && data.fromDetails.elevator) || false,
                                    elevatorAtDropoff: (data.toDetails && data.toDetails.elevator) || false,
                                    additionalServices: (data.fromDetails && data.fromDetails.additionalServices) || {},
                                },
                                selected_quote: {
                                    vendor_id: (data.selectedQuote && data.selectedQuote.vendor_slug) || null,
                                    vendor_name: (data.selectedQuote && data.selectedQuote.vendor_name) || 'Unknown',
                                    total_cost: (data.selectedQuote && data.selectedQuote.total_cost) || 0,
                                    session_id: sessionId,
                                    breakdown: (data.selectedQuote && data.selectedQuote.breakdown) || {},
                                },
                                contact_data: {
                                    firstName: data.contact?.firstName,
                                    lastName: data.contact?.lastName,
                                    email: data.contact?.email,
                                    phone: data.contact?.phone,
                                }
                            }
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to complete payment: ${await response.text()}`);
                    }

                    const result = await response.json();
                    console.log('Step 7 - Payment completed and lead saved:', result);
                    
                    // Update form data
                    setData(prev => ({
                        ...prev,
                        paymentCompleted: true,
                        leadId: result.lead_id,
                        sessionId: sessionId
                    }));
                    
                    setLeadId(result.lead_id);
                    setPaymentStatus('completed');
                    
                    // Show confetti
                    setShowConfetti(true);
                    
                    // Clean up URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    
                } catch (error) {
                    console.error('Step 7 - Payment completion error:', error);
                    setPaymentStatus('error');
                    setErrorMessage(error.message);
                }
            } else {
                // No session_id, assume payment was already completed or this is a direct visit
                console.log('Step 7 - No session_id found, assuming payment already completed');
                setPaymentStatus('completed');
                setLeadId(data.leadId || `L${Date.now().toString().slice(-6)}`);
                setShowConfetti(true);
            }
        };

        handlePaymentCompletion();
        
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, [data, setData]);

    // Show loading state while processing payment
    if (paymentStatus === 'processing') {
        return (
            <div className="step-card">
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '40px 20px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>
                        Processing Your Payment...
                    </h2>
                    <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                        Please wait while we complete your booking and save your information.
                    </p>
                </div>
            </div>
        );
    }

    // Show error state
    if (paymentStatus === 'error') {
        return (
            <div className="step-card">
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '40px 20px'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#e74c3c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <span style={{ fontSize: '30px', color: 'white' }}>✕</span>
                    </div>
                    <h2 style={{ color: '#e74c3c', marginBottom: '10px' }}>
                        Payment Error
                    </h2>
                    <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                        {errorMessage || 'There was an error processing your payment.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/#/step6'}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    return (
        <div className="step-card">
            {/* Confetti Animation */}
            {showConfetti && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}>
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][i % 5],
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            )}

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
                padding: '0 16px'
            }}>
                {/* Success Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#28a745',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        animation: 'pulse 2s infinite'
                    }}>
                        <span style={{ fontSize: '40px', color: 'white' }}>✓</span>
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        color: '#28a745',
                        marginBottom: '10px',
                        fontWeight: 'bold'
                    }}>
                        Thank You!
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#666',
                        marginBottom: '20px',
                        lineHeight: '1.6'
                    }}>
                        Your payment has been processed successfully and your move has been booked!
                    </p>
                    <div style={{
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        display: 'inline-block',
                        marginBottom: '30px'
                    }}>
                        <span style={{ color: '#155724', fontWeight: 'bold' }}>
                            ✅ Your $1.00 CAD deposit has been processed successfully
                        </span>
                    </div>
                </div>

                {/* Important Notice */}
                <div style={{
                    backgroundColor: '#fff5f5',
                    border: '2px solid #fed7d7',
                    borderRadius: '12px',
                    padding: '25px',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        color: '#c53030',
                        marginBottom: '15px',
                        fontSize: '1.4rem',
                        fontWeight: 'bold'
                    }}>
                        ⚠️ Important Notice
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#c53030',
                        marginBottom: '15px',
                        fontWeight: 'bold',
                        lineHeight: '1.5'
                    }}>
                        This is an ESTIMATE only. Your selected moving company will contact you to confirm the final price and details.
                    </p>
                    <p style={{
                        fontSize: '1rem',
                        color: '#744210',
                        lineHeight: '1.6'
                    }}>
                        The total cost shown above is based on your provided information. The actual final price may vary based on the moving company's assessment of your specific move requirements, including stairs, elevators, parking restrictions, and other factors that may affect the move.
                    </p>
                </div>

                {/* Booking Confirmation */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '30px',
                    marginBottom: '30px',
                    textAlign: 'left'
                }}>
                    <h2 style={{
                        color: '#495057',
                        marginBottom: '20px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        📋 Booking Confirmation
                    </h2>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        {/* Contact Information */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                👤 Contact Information
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>Name:</strong> {data.contact?.firstName} {data.contact?.lastName}</div>
                                <div><strong>Email:</strong> {data.contact?.email}</div>
                                <div><strong>Phone:</strong> {data.contact?.phone}</div>
                            </div>
                        </div>

                        {/* Move Details */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                🏠 Move Details
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>Date:</strong> {data.date} at {data.time}</div>
                                <div><strong>Rooms:</strong> {data.fromDetails?.rooms || 'N/A'}</div>
                                <div><strong>Square Footage:</strong> {data.fromDetails?.sqft || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                📍 Addresses
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>From:</strong> {data.from}</div>
                                <div><strong>To:</strong> {data.to}</div>
                            </div>
                        </div>

                        {/* Moving Company */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                🚛 Moving Company
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>Selected Vendor:</strong> {data.selectedQuote?.vendor_name || data.vendor?.vendor_name}</div>
                                <div><strong>Estimated Cost:</strong> {formatCurrency(data.selectedQuote?.total_cost || data.vendor?.total_cost || 0)}</div>
                                <div><strong>Booking Reference:</strong> {leadId || 'L' + Math.floor(Math.random() * 900000) + 100000}</div>
                            </div>
                            
                            {/* Final Pricing Notice */}
                            <div style={{
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: '6px',
                                padding: '10px',
                                marginTop: '10px'
                            }}>
                                <p style={{ color: '#856404', fontSize: '12px', margin: 0, lineHeight: '1.3' }}>
                                    <strong>⚠️ Final Price Notice:</strong> The actual cost may differ based on actual moving time and services required.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What Happens Next */}
                <div style={{
                    backgroundColor: '#e7f3ff',
                    border: '1px solid #b3d9ff',
                    borderRadius: '12px',
                    padding: '25px',
                    marginBottom: '30px'
                }}>
                    <h2 style={{
                        color: '#0056b3',
                        marginBottom: '20px',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        🎯 What Happens Next?
                    </h2>
                    <div style={{ display: 'grid', gap: '15px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>📧</span>
                            <span><strong>Email Confirmation</strong> - You'll receive a detailed confirmation email within 5 minutes</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>📞</span>
                            <span><strong>Vendor Contact</strong> - Your selected moving company will contact you within 24 hours to confirm the <strong>final price</strong> and details</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>📄</span>
                            <span><strong>Detailed invoice & payment instructions</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>✅</span>
                            <span><strong>Move date & time reserved</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>🗺️</span>
                            <span><strong>Route Map</strong></span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <p style={{
                        fontSize: '1rem',
                        color: '#6c757d',
                        marginBottom: '15px',
                        lineHeight: '1.6'
                    }}>
                        Thank you for choosing MovedIn for your moving needs!
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        🏠 Return to Home page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step7; 