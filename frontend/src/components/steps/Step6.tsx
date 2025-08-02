import React, { useState, useMemo } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

interface Step6Props {
    onNext: () => void;
    onBack: () => void;
}

interface RouteMapProps {
    from: string;
    to: string;
}

const Step6: React.FC<Step6Props> = ({ onNext, onBack }) => {
    const { data, setData } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debug the data structure
    console.log('Step 6 - Data structure:', {
        selectedQuote: data.selectedQuote,
        vendor: data.vendor,
        fromDetails: data.fromDetails,
        contact: data.contact
    });

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
        setLoading(true);
        setError(null);

        console.log('Step 6 - Starting payment process...');

        try {
            // Here you would integrate with your payment system
            // For now, we'll simulate a successful payment
            console.log('Step 6 - Simulating payment processing...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            console.log('Step 6 - Payment simulation completed');

            // Save lead to backend after successful payment
            const leadData = {
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
                    payment_intent_id: `simulated_payment_${Date.now()}`, // Simulated payment ID
                    breakdown: (data.selectedQuote && data.selectedQuote.breakdown) || {},
                },
                contact_data: {
                    firstName: data.contact?.firstName,
                    lastName: data.contact?.lastName,
                    email: data.contact?.email,
                    phone: data.contact?.phone,
                }
            };

            console.log('Step 6 - Lead data to save:', leadData);

            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            console.log('Step 6 - Sending lead data to:', `${API_BASE_URL}/api/leads`);

            const response = await fetch(`${API_BASE_URL}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            });

            console.log('Step 6 - Lead API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Step 6 - Lead API error:', errorText);
                throw new Error(`Failed to save lead to database: ${response.status} ${errorText}`);
            }

            const leadResult = await response.json();
            console.log('Step 6 - Lead saved successfully:', leadResult);

            // Update form data to mark payment as successful
            setData(prev => ({
                ...prev,
                paymentCompleted: true,
                leadId: leadResult.id
            }));

            console.log('Step 6 - Payment and lead save completed, proceeding to next step');
            onNext();

        } catch (err) {
            console.error('Step 6 - Payment error:', err);
            setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
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
                    <button 
                        onClick={onBack}
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const selectedQuote = data.selectedQuote;
    const totalTime = (selectedQuote.travel_time_hours || 0) + (selectedQuote.estimated_hours || 0);

    return (
        <div className="step-card">
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
                            <div><strong>Total Cost:</strong> {formatCurrency(selectedQuote.total_cost || 0)}</div>
                            <div><strong>Booking Reference:</strong> L{Math.floor(Math.random() * 900000) + 100000}</div>
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

                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '6px',
                        padding: '12px',
                        marginBottom: '16px',
                        color: '#721c24'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    {loading ? 'Processing Payment...' : 'Pay $1.00 CAD Deposit'}
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