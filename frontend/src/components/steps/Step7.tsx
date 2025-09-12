import React, { useState, useEffect } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

const Step7: React.FC = () => {
    const { data, setData } = useForm();
    const [showConfetti, setShowConfetti] = useState(false);
    const [leadId, setLeadId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayData, setDisplayData] = useState<any>(null);

    console.log('🎉 Step7 Component RENDERED - URL:', window.location.href);
    console.log('🎉 Step7 Component RENDERED - Timestamp:', new Date().toISOString());

    const debugInfo = {
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        hasSelectedQuote: !!data?.selectedQuote,
        hasVendor: !!data?.vendor,
        hasContact: !!data?.contact,
        sessionStorageFormData: sessionStorage.getItem('formData'),
        sessionStoragePaymentSuccess: sessionStorage.getItem('paymentSuccess'),
        sessionStoragePaymentIntent: sessionStorage.getItem('paymentIntentData'),
        url: window.location.href,
        hash: window.location.hash,
        search: window.location.search,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };

    console.log('🔍 Step7 Component Rendered - Debug Info:', debugInfo);
    console.log('🔍 Step7 - Data object details:', {
        data: data,
        selectedQuote: data?.selectedQuote,
        vendor: data?.vendor,
        contact: data?.contact,
        fromDetails: data?.fromDetails,
        toDetails: data?.toDetails
    });

    // Log Step7 component render
    const logDebugStep = async (step: string, data: any) => {
        try {
            await fetch('https://movedin-backend.onrender.com/api/debug-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step,
                    data: {
                        ...data,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    }
                })
            });
        } catch (error) {
            console.error('Failed to log debug step:', error);
        }
    };

    logDebugStep('STEP7_COMPONENT_RENDERED', debugInfo);

    useEffect(() => {
        console.log('🔍 Step7 useEffect triggered');
        // Show confetti animation after component mounts
        setShowConfetti(true);
        
        // Load data from URL parameters (new checkout session flow)
        loadDataFromURL();
        
        // Hide confetti after 3 seconds
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const loadDataFromURL = async () => {
        try {
            console.log('🔄 Step7 - Starting data loading from URL...');
            console.log('🔍 Step7 - Full URL:', window.location.href);
            console.log('🔍 Step7 - Hash:', window.location.hash);
            console.log('🔍 Step7 - Search:', window.location.search);
            console.log('🔍 Step7 - Pathname:', window.location.pathname);
            console.log('🔍 Step7 - Origin:', window.location.origin);
            console.log('🔍 Step7 - Timestamp:', new Date().toISOString());
            
            // Get URL parameters from both search and hash
            let sessionId = null;
            let leadId = null;
            let vendor = null;
            let amount = null;
            let currency = null;
            let email = null;
            
            console.log('🔍 Step7 - Parsing URL parameters...');
            
            // Try hash fragment first (for HashRouter)
            if (window.location.hash.includes('?')) {
                console.log('🔍 Step7 - Found hash parameters, parsing...');
                const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
                sessionId = hashParams.get('session_id');
                leadId = hashParams.get('lead_id');
                vendor = hashParams.get('vendor');
                amount = hashParams.get('amount');
                currency = hashParams.get('currency');
                email = hashParams.get('email');
                console.log('🔍 Step7 - Hash parameters:', { sessionId, leadId, vendor, amount, currency, email });
            }
            
            // If not found in hash, try search params
            if (!sessionId || !leadId) {
                console.log('🔍 Step7 - Checking search parameters...');
                const searchParams = new URLSearchParams(window.location.search);
                sessionId = sessionId || searchParams.get('session_id');
                leadId = leadId || searchParams.get('lead_id');
                vendor = vendor || searchParams.get('vendor');
                amount = amount || searchParams.get('amount');
                currency = currency || searchParams.get('currency');
                email = email || searchParams.get('email');
                console.log('🔍 Step7 - Search parameters:', { sessionId, leadId, vendor, amount, currency, email });
            }
            
            console.log('📊 Step7 - Final URL parameters:', { sessionId, leadId, vendor, amount, currency, email });
            
            // Log URL parameter extraction
            logDebugStep('STEP7_URL_PARAMETER_EXTRACTION', {
                sessionId,
                leadId,
                url: window.location.href,
                hash: window.location.hash,
                search: window.location.search,
                parametersFound: !!(sessionId && leadId)
            });
            
            if (sessionId && leadId) {
                console.log('✅ Step7 - Found both sessionId and leadId, proceeding with payment verification...');
                console.log('🔍 Step7 - Session ID:', sessionId);
                console.log('🔍 Step7 - Lead ID:', leadId);
                console.log('🔍 Step7 - Vendor:', vendor);
                console.log('🔍 Step7 - Amount:', amount);
                console.log('🔍 Step7 - Currency:', currency);
                console.log('🔍 Step7 - Email:', email);
                
                // Verify payment with backend
                console.log('🌐 Step7 - Making API call to verify payment...');
                const verificationPayload = {
                    session_id: sessionId,
                    lead_id: leadId
                };
                console.log('📤 Step7 - Verification payload:', verificationPayload);
                
                const response = await fetch('https://movedin-backend.onrender.com/api/verify-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(verificationPayload),
                });

                console.log('📡 Step7 - Verification response status:', response.status);
                console.log('📡 Step7 - Verification response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Step7 - Payment verification failed:', errorText);
                    console.error('❌ Step7 - Response status:', response.status);
                    throw new Error(`Payment verification failed: ${errorText}`);
                }

                const result = await response.json();
                console.log('✅ Step7 - Payment verification successful!');
                console.log('📊 Step7 - Verification result:', result);
                console.log('🔍 Step7 - Success status:', result.success);
                console.log('🔍 Step7 - Form data received:', result.form_data);
                console.log('🔍 Step7 - Lead ID from result:', result.lead_id);

                if (result.success) {
                    console.log('✅ Step7 - Payment verified successfully, loading form data...');
                    console.log('📊 Step7 - Setting display data:', result.form_data);
                    setDisplayData(result.form_data);
                    setLeadId(result.lead_id);
                    setIsProcessing(false);
                    console.log('✅ Step7 - Data loading complete!');
                } else {
                    console.error('❌ Step7 - Payment verification failed - success=false');
                    throw new Error('Payment verification failed');
                }
            } else {
                console.log('⚠️ Step7 - Missing URL parameters, trying sessionStorage fallback...');
                console.log('🔍 Step7 - SessionId present:', !!sessionId);
                console.log('🔍 Step7 - LeadId present:', !!leadId);
                // Fallback to sessionStorage for backward compatibility
                loadDataFromSessionStorage();
            }
        } catch (error) {
            console.error('❌ Step7 - Error loading data from URL!');
            console.error('❌ Step7 - Error type:', typeof error);
            console.error('❌ Step7 - Error message:', error instanceof Error ? error.message : 'Unknown error');
            console.error('❌ Step7 - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            console.error('❌ Step7 - Full error object:', error);
            console.error('❌ Step7 - Error timestamp:', new Date().toISOString());
            setError('Error loading payment data. Please try again.');
            setIsProcessing(false);
            
            // Try sessionStorage as fallback
            console.log('🔄 Step7 - Trying sessionStorage fallback...');
            loadDataFromSessionStorage();
        }
    };

    const loadDataFromSessionStorage = () => {
        try {
            console.log('🔄 Step7 - Loading data from sessionStorage fallback...');
            console.log('🔍 Step7 - SessionStorage keys:', Object.keys(sessionStorage));
            
            // Check if we have form data in sessionStorage (from payment redirect)
            const formData = sessionStorage.getItem('formData');
            const paymentSuccess = sessionStorage.getItem('paymentSuccess');
            const paymentIntentData = sessionStorage.getItem('paymentIntentData');
            
            console.log('🔍 Step7 - SessionStorage data check:', { 
                hasFormData: !!formData, 
                hasPaymentSuccess: !!paymentSuccess,
                hasPaymentIntentData: !!paymentIntentData,
                formDataLength: formData ? formData.length : 0,
                paymentSuccessValue: paymentSuccess,
                paymentIntentDataLength: paymentIntentData ? paymentIntentData.length : 0
            });
            
            if (formData && paymentSuccess) {
                console.log('✅ Step7 - Found sessionStorage data, parsing...');
                const parsedFormData = JSON.parse(formData);
                console.log('📊 Step7 - Parsed form data from sessionStorage:', parsedFormData);
                console.log('🔍 Step7 - Form data keys:', Object.keys(parsedFormData));
                
                // Update the form context with the data from sessionStorage
                console.log('🔄 Step7 - Updating form context with sessionStorage data...');
                setData(prev => ({
                    ...prev,
                    ...parsedFormData
                }));
                
                // Set display data for rendering
                console.log('🔄 Step7 - Setting display data...');
                setDisplayData(parsedFormData);
                
                // Store payment intent data separately for handlePaymentConfirmation
                if (parsedFormData.paymentIntentData) {
                    console.log('🔄 Step7 - Storing payment intent data...');
                    sessionStorage.setItem('paymentIntentData', JSON.stringify(parsedFormData.paymentIntentData));
                }
                
                // Clear the sessionStorage data after loading
                console.log('🧹 Step7 - Clearing sessionStorage data...');
                sessionStorage.removeItem('formData');
                sessionStorage.removeItem('paymentSuccess');
                console.log('✅ Step7 - SessionStorage data loaded and cleared!');
            } else if (data && Object.keys(data).length > 0) {
                // Use data from form context (normal flow)
                console.log('✅ Step7 - Using data from form context (normal flow)');
                console.log('📊 Step7 - Form context data:', data);
                setDisplayData(data);
            } else {
                // No data available - show error state
                console.error('❌ Step7 - No data available from sessionStorage or form context');
                console.error('❌ Step7 - Form data available:', !!formData);
                console.error('❌ Step7 - Payment success available:', !!paymentSuccess);
                console.error('❌ Step7 - Context data available:', !!(data && Object.keys(data).length > 0));
                setError('No booking data available. Please complete the booking process.');
                setDisplayData({});
            }
        } catch (error) {
            console.error('❌ Step7 - Error loading data from sessionStorage!');
            console.error('❌ Step7 - Error type:', typeof error);
            console.error('❌ Step7 - Error message:', error instanceof Error ? error.message : 'Unknown error');
            console.error('❌ Step7 - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            console.error('❌ Step7 - Full error object:', error);
            setError('Error loading booking data. Please try again.');
            setDisplayData({});
        }
    };

    const handlePaymentConfirmation = async () => {
        try {
            // Get payment intent data from sessionStorage
            const paymentIntentData = sessionStorage.getItem('paymentIntentData');
            if (!paymentIntentData) {
                console.log('No payment intent data found, generating lead ID only');
                setLeadId(`L${Date.now().toString().slice(-6)}`);
                setIsProcessing(false);
                return;
            }

            const intentData = JSON.parse(paymentIntentData);
            console.log('Step 7 - Processing payment confirmation:', intentData);

            // Prepare lead data for confirmation
            const leadData = {
                quote_data: data.fromDetails || {},
                selected_quote: data.selectedQuote || {},
                contact_data: data.contact || {},
                lead_id: intentData.lead_id || null  // Include lead_id if available
            };

            // Call the confirm-payment endpoint
            const response = await fetch('https://movedin-backend.onrender.com/api/confirm-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_intent_id: intentData.payment_intent_id,
                    lead_data: leadData
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Payment confirmation failed:', errorText);
                // Don't show error to user, just generate lead ID
                setLeadId(`L${Date.now().toString().slice(-6)}`);
                setIsProcessing(false);
                return;
            }

            const result = await response.json();
            console.log('Step 7 - Payment confirmed and lead saved:', result);
            
            // Set the actual lead ID from the database
            setLeadId(result.lead_id ? `L${result.lead_id}` : `L${Date.now().toString().slice(-6)}`);
            
            // Clear payment intent data from sessionStorage
            sessionStorage.removeItem('paymentIntentData');
            
        } catch (error) {
            console.error('Step 7 - Error processing payment confirmation:', error);
            // Don't show error to user, just generate lead ID
            setLeadId(`L${Date.now().toString().slice(-6)}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

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
                                <div><strong>Name:</strong> {displayData?.contact?.firstName} {displayData?.contact?.lastName}</div>
                                <div><strong>Email:</strong> {displayData?.contact?.email}</div>
                                <div><strong>Phone:</strong> {displayData?.contact?.phone}</div>
                            </div>
                        </div>

                        {/* Move Details */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                🏠 Move Details
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>Date:</strong> {displayData?.date} at {displayData?.time}</div>
                                <div><strong>Rooms:</strong> {displayData?.fromDetails?.rooms || 'N/A'}</div>
                                <div><strong>Square Footage:</strong> {displayData?.fromDetails?.sqft || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                📍 Addresses
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>From:</strong> {displayData?.from}</div>
                                <div><strong>To:</strong> {displayData?.to}</div>
                            </div>
                        </div>

                        {/* Moving Company */}
                        <div>
                            <h3 style={{ color: '#495057', marginBottom: '10px', fontSize: '1.1rem' }}>
                                🚛 Moving Company
                            </h3>
                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                <div><strong>Selected Vendor:</strong> {displayData?.selectedQuote?.vendor_name || displayData?.vendor?.vendor_name}</div>
                                <div><strong>Estimated Cost:</strong> {formatCurrency(displayData?.selectedQuote?.total_cost || displayData?.vendor?.total_cost || 0)}</div>
                                <div><strong>Booking Reference:</strong> {leadId || 'L' + Math.floor(Math.random() * 900000) + 100000}</div>
                            </div>
                            
                            {/* Additional Services Section */}
                            {displayData?.selectedQuote?.additional_services_info && displayData.selectedQuote.additional_services_info.length > 0 && (
                                <div style={{
                                    backgroundColor: '#e8f4f8',
                                    border: '1px solid #bee5eb',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginTop: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '16px' }}>🔧</span>
                                        <p style={{ color: '#0c5460', fontSize: '13px', margin: 0, fontWeight: 'bold' }}>
                                            Additional Services Requested
                                        </p>
                                    </div>
                                    
                                    <p style={{ color: '#0c5460', fontSize: '11px', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                                        Your vendor will contact you with pricing for these services:
                                    </p>
                                    
                                    <ul style={{ margin: '0 0 8px 12px', color: '#0c5460', fontSize: '11px', lineHeight: '1.3' }}>
                                        {displayData.selectedQuote.additional_services_info.map((service: string, index: number) => (
                                            <li key={index} style={{ marginBottom: '4px' }}>
                                                <strong>{service}</strong> - {getServiceExplanation(service)}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <div style={{
                                        backgroundColor: '#bee5eb',
                                        borderRadius: '4px',
                                        padding: '6px',
                                        marginTop: '8px'
                                    }}>
                                        <p style={{ color: '#0c5460', fontSize: '10px', margin: 0, fontWeight: 'bold' }}>
                                            💡 Personal assessment ensures fair, accurate pricing for your specific needs
                                        </p>
                                    </div>
                                </div>
                            )}
                            
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

export default Step7; 