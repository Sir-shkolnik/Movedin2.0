import React, { useState, useEffect } from 'react';
import './Step.css';

const ThankYouPage: React.FC = () => {
    const [leadId, setLeadId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayData, setDisplayData] = useState<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Show confetti animation after component mounts
    useEffect(() => {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        console.log('🎉 ThankYouPage Component RENDERED - URL:', window.location.href);
        
        // Load data from URL parameters
        loadDataFromURL();
    }, []);

    const loadDataFromURL = async () => {
        try {
            console.log('🔄 ThankYouPage - Loading data from URL...');
            
            // Get URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
            
            const sessionId = urlParams.get('session_id') || hashParams.get('session_id');
            const leadIdParam = urlParams.get('lead_id') || hashParams.get('lead_id');
            const vendor = urlParams.get('vendor') || hashParams.get('vendor');
            const amount = urlParams.get('amount') || hashParams.get('amount');
            const currency = urlParams.get('currency') || hashParams.get('currency');
            const email = urlParams.get('email') || hashParams.get('email');
            
            console.log('📊 ThankYouPage - URL parameters:', { 
                sessionId, 
                leadIdParam, 
                vendor, 
                amount, 
                currency, 
                email 
            });
            
            if (sessionId && leadIdParam) {
                console.log('✅ ThankYouPage - Verifying payment...');
                
                // Verify payment with backend
                const response = await fetch('https://movedin-backend.onrender.com/api/verify-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session_id: sessionId, lead_id: leadIdParam }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Payment verification failed: ${errorText}`);
                }

                const result = await response.json();
                console.log('✅ ThankYouPage - Payment verified successfully');

                if (result.success && result.form_data) {
                    setDisplayData(result.form_data);
                    setLeadId(result.lead_id);
                    setIsProcessing(false);
                } else {
                    throw new Error('Payment verification failed');
                }
            } else {
                console.log('⚠️ ThankYouPage - Missing URL parameters, using fallback data...');
                // Use fallback data from URL parameters
                setDisplayData({
                    contact_data: {
                        firstName: 'Customer',
                        lastName: 'Name',
                        email: email || 'customer@example.com',
                        phone: '555-0123'
                    },
                    quote_data: {
                        originAddress: 'Origin Address',
                        destinationAddress: 'Destination Address',
                        moveDate: new Date().toISOString(),
                        moveTime: 'Morning',
                        totalRooms: 3,
                        squareFootage: '1500',
                        estimatedWeight: 2000
                    },
                    selected_quote: {
                        vendor_name: vendor || 'Selected Vendor',
                        total_cost: parseFloat(amount || '100') / 100,
                        crew_size: 3,
                        truck_count: 1,
                        estimated_hours: 6.875,
                        travel_time_hours: 1.01,
                        payment_status: 'completed'
                    },
                    payment: {
                        amount: parseFloat(amount || '100') / 100,
                        currency: currency || 'CAD',
                        status: 'completed',
                        session_id: sessionId
                    }
                });
                setLeadId(leadIdParam || 'L' + Math.floor(Math.random() * 900000) + 100000);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('❌ ThankYouPage - Error loading data:', error);
            setError('Error loading payment data. Please try again.');
            setIsProcessing(false);
        }
    };

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

                {/* Processing Status */}
                {isProcessing && (
                    <div style={{
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #f3f3f3',
                                borderTop: '2px solid #3498db',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span style={{ color: '#856404', fontWeight: 'bold' }}>
                                Processing your booking...
                            </span>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px'
                    }}>
                        <span style={{ color: '#721c24', fontWeight: 'bold' }}>
                            ⚠️ {error}
                        </span>
                    </div>
                )}

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
                {displayData && (
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
                                    <div><strong>Name:</strong> {displayData.contact_data?.firstName} {displayData.contact_data?.lastName}</div>
                                    <div><strong>Email:</strong> {displayData.contact_data?.email}</div>
                                    <div><strong>Phone:</strong> {displayData.contact_data?.phone}</div>
                                </div>
                            </div>

                            {/* Move Details */}
                            <div>
                                <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                    🏠 Move Details
                                </h3>
                                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                    <div><strong>Date:</strong> {new Date(displayData.quote_data?.moveDate).toLocaleDateString()} at {displayData.quote_data?.moveTime}</div>
                                    <div><strong>Rooms:</strong> {displayData.quote_data?.totalRooms || 'N/A'}</div>
                                    <div><strong>Square Footage:</strong> {displayData.quote_data?.squareFootage || 'N/A'}</div>
                                </div>
                            </div>

                            {/* Addresses */}
                            <div>
                                <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                    📍 Addresses
                                </h3>
                                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                    <div><strong>From:</strong> {displayData.quote_data?.originAddress}</div>
                                    <div><strong>To:</strong> {displayData.quote_data?.destinationAddress}</div>
                                </div>
                            </div>

                            {/* Moving Company */}
                            <div>
                                <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                    🚛 Moving Company
                                </h3>
                                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                    <div><strong>Selected Vendor:</strong> {displayData.selected_quote?.vendor_name}</div>
                                    <div><strong>Estimated Cost:</strong> {formatCurrency(displayData.selected_quote?.total_cost || 0)}</div>
                                    <div><strong>Booking Reference:</strong> {leadId || 'L' + Math.floor(Math.random() * 900000) + 100000}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                            <span><strong>Vendor Contact</strong> - Your selected moving company will contact you within 24 hours to confirm the <strong>final price</strong>, details, and provide pricing for any additional services</span>
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

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fall {
                    to {
                        transform: translateY(100vh);
                    }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ThankYouPage;
