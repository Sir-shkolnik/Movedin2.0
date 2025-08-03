import React, { useState, useEffect } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';
import { apiUrl } from '../../utils/api';

interface VendorQuote {
    vendor_slug: string;
    vendor_name: string;
    total_cost: number;
    hourly_rate: number;
    estimated_hours: number;
    travel_time_hours: number;
    crew_size: number;
    truck_count: number;
    rating: number;
    reviews: number;
    special_notes: string;
    available_slots: any[];
    logo_url: string | null;
    breakdown: any;
    dispatcher_info: any;
    move_size: {
        rooms: number;
        square_footage: number;
    };
}

interface Step4Props {
    onNext: () => void;
    onBack: () => void;
}

const Step4: React.FC<Step4Props> = ({ onNext, onBack }) => {
    const { data, setData } = useForm();
    const [vendors, setVendors] = useState<VendorQuote[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getVendorLogo = (vendorSlug: string) => {
        const logos: { [key: string]: string } = {
            'lets-get-moving': '/logos/letsgetmoving_icon.png',
            'easy2go': '/logos/easy2go.png',
            'velocity-movers': '/logos/velocity_movers_logo.jpg',
            'pierre-sons': '/logos/pierre_sons_logo.png'
        };
        return logos[vendorSlug] || null;
    };

    const getVendorTheme = (vendorSlug: string) => {
        const themes: { [key: string]: { primary: string; secondary: string; accent: string } } = {
            'lets-get-moving': { primary: '#2563eb', secondary: '#dbeafe', accent: '#1e40af' },
            'easy2go': { primary: '#ea580c', secondary: '#fed7aa', accent: '#c2410c' },
            'velocity-movers': { primary: '#7c3aed', secondary: '#e9d5ff', accent: '#5b21b6' },
            'pierre-sons': { primary: '#dc2626', secondary: '#fecaca', accent: '#991b1b' }
        };
        return themes[vendorSlug] || { primary: '#2563eb', secondary: '#dbeafe', accent: '#1e40af' };
    };

    useEffect(() => {
        const fetchVendorQuotes = async() => {
            setLoading(true);
            setError(null);

            try {
                const quoteRequest = {
                    origin_address: data.from,
                    destination_address: data.to,
                    move_date: data.date,
                    move_time: data.time,
                    total_rooms: (data.fromDetails && data.fromDetails.rooms) || 3,
                    square_footage: (data.fromDetails && data.fromDetails.sqft) || null,
                    estimated_weight: 0,
                    heavy_items: (data.fromDetails && data.fromDetails.heavyItems) || {},
                    stairs_at_pickup: (data.fromDetails && data.fromDetails.stairs) || 0,
                    stairs_at_dropoff: (data.toDetails && data.toDetails.stairs) || 0,
                    elevator_at_pickup: (data.fromDetails && data.fromDetails.elevator) || false,
                    elevator_at_dropoff: (data.toDetails && data.toDetails.elevator) || false,
                    additional_services: (data.fromDetails && data.fromDetails.additionalServices) || {}
                };

                console.log('🔍 DEBUG: Quote Request Data:', {
                    total_rooms: quoteRequest.total_rooms,
                    fromDetails: data.fromDetails,
                    rooms: data.fromDetails?.rooms,
                    homeType: data.fromDetails?.homeType,
                    fullData: data
                });

                const quoteRes = await fetch(apiUrl('/api/generate'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(quoteRequest)
                });

                if (!quoteRes.ok) {
                    throw new Error(`Failed to get quotes: ${quoteRes.status} ${quoteRes.statusText}`);
                }

                const quoteData = await quoteRes.json();
                console.log('All quotes response:', quoteData);
                
                // Debug Let's Get Moving specifically
                const lgmQuote = quoteData.quotes?.find((q: any) => q.vendor_slug === 'lets-get-moving');
                if (lgmQuote) {
                    console.log('🔍 DEBUG: Let\'s Get Moving Quote:', {
                        crew_size: lgmQuote.crew_size,
                        truck_count: lgmQuote.truck_count,
                        hourly_rate: lgmQuote.hourly_rate,
                        total_cost: lgmQuote.total_cost,
                        estimated_hours: lgmQuote.estimated_hours
                    });
                }

                if (!quoteData.quotes || quoteData.quotes.length === 0) {
                    setError('No moving companies are currently available for this route. Our team is working to add vendors in your area. Please try again later or contact our support team for assistance.');
                    setLoading(false);
                    return;
                }

                const processedQuotes = quoteData.quotes.map((vendorQuote: any) => {
                    return {
                        vendor_slug: vendorQuote.vendor_slug,
                        vendor_name: vendorQuote.vendor_name,
                        total_cost: vendorQuote.total_cost || 0,
                        hourly_rate: vendorQuote.hourly_rate || 0,
                        estimated_hours: vendorQuote.estimated_hours || 0,
                        travel_time_hours: vendorQuote.travel_time_hours || 0,
                        crew_size: vendorQuote.crew_size || 0,
                        truck_count: vendorQuote.truck_count || 0,
                        rating: vendorQuote.rating || 4.5,
                        reviews: vendorQuote.reviews || 100,
                        special_notes: vendorQuote.special_notes || '',
                        available_slots: vendorQuote.available_slots || [],
                        logo_url: getVendorLogo(vendorQuote.vendor_slug),
                        breakdown: vendorQuote.breakdown || {},
                        dispatcher_info: vendorQuote.dispatcher_info || {},
                        move_size: {
                            rooms: data.fromDetails && data.fromDetails.rooms || 0,
                            square_footage: data.fromDetails && data.fromDetails.sqft || 0
                        }
                    };
                });

                console.log('Processed vendor quotes:', processedQuotes);
                setVendors(processedQuotes);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching vendor quotes:', err);
                setError(err instanceof Error ? err.message : 'An error occurred while fetching quotes');
                setLoading(false);
            }
        };

        if (data.from && data.to && data.date && data.time) {
            fetchVendorQuotes();
        }
    }, [data.from, data.to, data.date, data.time, data.fromDetails, data.toDetails]);

    const handleSelect = (vendor_slug: string) => {
        setSelected(vendor_slug);
        const selectedVendor = vendors.find(v => v.vendor_slug === vendor_slug);
        if (selectedVendor) {
            console.log('Step 4 - Saving selected vendor:', selectedVendor);
            setData(prev => ({
                ...prev,
                vendor: selectedVendor,
                selectedQuote: selectedVendor  // Also save as selectedQuote for Step 6
            }));
        }
    };

    const handleContinue = () => {
        if (selected) {
            onNext();
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
        }).format(amount);
    };

    const handleRetry = () => {
        setError(null);
        setVendors([]);
        setSelected(null);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} style={{ color: '#fbbf24' }}>★</span>);
        }
        if (hasHalfStar) {
            stars.push(<span key="half" style={{ color: '#fbbf24' }}>☆</span>);
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} style={{ color: '#d1d5db' }}>☆</span>);
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="step-card">
                <h2>Choose Your Moving Company</h2>
                
                {/* Professional Loading Experience */}
                <div className="loading-container" style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    color: 'white'
                }}>
                    {/* Professional Loading Animation */}
                    <div className="loading-animation" style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto 32px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Outer Ring */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            border: '3px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            borderTop: '3px solid rgba(255,255,255,0.8)',
                            animation: 'smoothSpin 2s linear infinite'
                        }}></div>
                        
                        {/* Middle Ring */}
                        <div style={{
                            position: 'absolute',
                            width: '80%',
                            height: '80%',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderRadius: '50%',
                            borderRight: '2px solid rgba(255,255,255,0.9)',
                            animation: 'smoothSpin 1.5s linear infinite reverse'
                        }}></div>
                        
                        {/* Inner Ring */}
                        <div style={{
                            position: 'absolute',
                            width: '60%',
                            height: '60%',
                            border: '2px solid rgba(255,255,255,0.4)',
                            borderRadius: '50%',
                            borderBottom: '2px solid white',
                            animation: 'smoothSpin 1s linear infinite'
                        }}></div>
                        
                        {/* Center Logo */}
                        <div style={{
                            position: 'relative',
                            animation: 'gentlePulse 2s ease-in-out infinite',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}>
                            <img 
                                src="/logos/movedin_ne.png" 
                                alt="MovedIn Logo"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '4px'
                                }}
                                onError={(e) => {
                                    // Fallback to emoji if logo doesn't load
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'block';
                                }}
                            />
                            <div style={{
                                display: 'none',
                                fontSize: '32px',
                                color: 'white'
                            }}>
                                📋
                            </div>
                        </div>
                    </div>

                    {/* Loading Title */}
                    <h3 style={{
                        fontSize: '24px',
                        marginBottom: '16px',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Finding Your Perfect Moving Company
                    </h3>

                    {/* Progress Steps */}
                    <div className="progress-steps" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginBottom: '32px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            <span style={{ fontSize: '16px' }}>🔍</span>
                            <span style={{ fontSize: '14px' }}>Searching</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            animation: 'pulse 2s ease-in-out infinite 0.5s'
                        }}>
                            <span style={{ fontSize: '16px' }}>📊</span>
                            <span style={{ fontSize: '14px' }}>Calculating</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            animation: 'pulse 2s ease-in-out infinite 1s'
                        }}>
                            <span style={{ fontSize: '16px' }}>💰</span>
                            <span style={{ fontSize: '14px' }}>Pricing</span>
                        </div>
                    </div>

                    {/* Loading Message */}
                    <p style={{
                        fontSize: '18px',
                        marginBottom: '12px',
                        fontWeight: '500'
                    }}>
                        We're connecting with top-rated moving companies in your area...
                    </p>
                    
                    <p style={{
                        fontSize: '14px',
                        opacity: '0.8',
                        marginBottom: '24px'
                    }}>
                        This ensures you get the best service and competitive pricing
                    </p>

                    {/* Animated Dots */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    animation: `bounce 1.4s ease-in-out infinite ${i * 0.16}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        width: '100%',
                        maxWidth: '300px',
                        margin: '24px auto 0',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '10px',
                        height: '6px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '60%',
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            animation: 'progress 3s ease-in-out infinite'
                        }}></div>
                    </div>

                    {/* Estimated Time */}
                    <p style={{
                        fontSize: '12px',
                        opacity: '0.7',
                        marginTop: '12px'
                    }}>
                        Estimated time: 10-15 seconds
                    </p>
                </div>

                {/* Loading Tips */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h4 style={{
                        color: '#495057',
                        marginBottom: '12px',
                        fontSize: '16px',
                        fontWeight: '600'
                    }}>
                        💡 While we're working...
                    </h4>
                    <div style={{
                        display: 'grid',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#6c757d'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✅</span>
                            <span>We're checking availability for your move date</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✅</span>
                            <span>Calculating accurate pricing based on your details</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✅</span>
                            <span>Finding the best crew size for your move</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✅</span>
                            <span>Verifying current rates and availability</span>
                        </div>
                    </div>
                </div>

                {/* CSS Animations */}
                <style>{`
                    @keyframes smoothSpin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes gentlePulse {
                        0%, 100% { 
                            opacity: 1; 
                            transform: scale(1); 
                        }
                        50% { 
                            opacity: 0.8; 
                            transform: scale(1.1); 
                        }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.7; transform: scale(1.05); }
                    }
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }
                    @keyframes progress {
                        0% { width: 0%; }
                        50% { width: 60%; }
                        100% { width: 100%; }
                    }
                    @media (max-width: 768px) {
                        .loading-container {
                            padding: 40px 16px !important;
                        }
                        .loading-animation {
                            width: 80px !important;
                            height: 80px !important;
                        }
                        .loading-animation img {
                            width: 28px !important;
                            height: 28px !important;
                        }
                        .progress-steps {
                            flex-direction: column !important;
                            gap: 12px !important;
                        }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="step-card">
                <h2>Choose Your Moving Company</h2>
                
                {/* Enhanced Error State */}
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    backgroundColor: '#fef2f2',
                    border: '2px solid #fecaca',
                    borderRadius: '16px',
                    marginBottom: '24px'
                }}>
                    {/* Error Icon */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 24px',
                        backgroundColor: '#dc2626',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        color: 'white',
                        animation: 'shake 0.5s ease-in-out'
                    }}>
                        ⚠️
                    </div>

                    {/* Error Title */}
                    <h3 style={{
                        color: '#dc2626',
                        fontSize: '20px',
                        marginBottom: '16px',
                        fontWeight: 'bold'
                    }}>
                        Oops! Something went wrong
                    </h3>

                    {/* Error Message */}
                    <p style={{ 
                        color: '#dc2626', 
                        marginBottom: '24px',
                        fontSize: '16px',
                        lineHeight: '1.5'
                    }}>
                        {error}
                    </p>

                    {/* Helpful Information */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            marginBottom: '12px'
                        }}>
                            <strong>Don't worry!</strong> This usually happens when:
                        </p>
                        <ul style={{
                            textAlign: 'left',
                            color: '#6b7280',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            margin: 0,
                            paddingLeft: '20px'
                        }}>
                            <li>Our servers are temporarily busy</li>
                            <li>There's a brief network connection issue</li>
                            <li>We're updating our pricing data</li>
                        </ul>
                    </div>

                    {/* Retry Button */}
                    <button 
                        onClick={handleRetry}
                        style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.25)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            margin: '0 auto'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 99, 235, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.25)';
                        }}
                    >
                        <span>🔄</span>
                        Try Again
                    </button>
                </div>

                {/* CSS Animations */}
                <style>{`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="step-card">
            <h2>Choose Your Moving Company</h2>
            
            {/* Estimate Notice */}
            <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>⚠️</span>
                    <strong style={{ color: '#856404' }}>Important: All Prices Are Estimates</strong>
                </div>
                <p style={{ color: '#856404', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>
                    The prices shown are estimates based on your provided information. Final pricing will be determined by the moving company 
                    based on actual moving time, additional services, and final assessment of your belongings.
                </p>
            </div>
            
            <div className="vendor-grid-modern">
                {vendors.map((vendor) => {
                    const theme = getVendorTheme(vendor.vendor_slug);
                    const isSelected = selected === vendor.vendor_slug;
                    const totalTime = vendor.estimated_hours; // Use only estimated_hours as it already includes travel time
                    
                    return (
                        <div
                            key={vendor.vendor_slug}
                            className={`vendor-card-modern ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelect(vendor.vendor_slug)}
                            style={{
                                borderColor: isSelected ? theme.primary : '#e5e7eb',
                                backgroundColor: isSelected ? theme.secondary : 'white'
                            }}
                        >
                            <div className="vendor-card-header-modern">
                                <div className="vendor-logo-section-modern">
                                    {vendor.logo_url && (
                                        <img 
                                            src={vendor.logo_url} 
                                            alt={`${vendor.vendor_name} logo`}
                                            className="vendor-logo-modern"
                                        />
                                    )}
                                </div>
                                <div className="vendor-rating-modern">
                                    <div className="stars-modern">
                                        {renderStars(vendor.rating)}
                                    </div>
                                    <span className="reviews-modern">({vendor.reviews} reviews)</span>
                                </div>
                            </div>

                            <div className="vendor-card-body-modern">
                                {/* Clean Pricing Section */}
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: theme.primary,
                                        marginBottom: '4px'
                                    }}>
                                        {formatCurrency(vendor.hourly_rate)}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#6c757d'
                                    }}>
                                        Est. Time: {totalTime.toFixed(1)} hours
                                    </div>
                                </div>

                                {/* Move Details - Super Important */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#495057',
                                            marginBottom: '4px'
                                        }}>
                                            {vendor.move_size.rooms > 0 ? `${vendor.move_size.rooms} rooms` : 
                                             vendor.move_size.square_footage > 0 ? `${vendor.move_size.square_footage} sq ft` : 
                                             'Standard'}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#6c757d'
                                        }}>
                                            Move Size
                                        </div>
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#495057',
                                            marginBottom: '4px'
                                        }}>
                                            {vendor.crew_size} movers
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#6c757d'
                                        }}>
                                            {vendor.truck_count} truck{vendor.truck_count !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>

                                {/* Dispatcher Information */}
                                {vendor.dispatcher_info && (
                                    <div className="dispatcher-info-modern" style={{
                                        marginTop: '12px',
                                        padding: '8px 12px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '12px'
                                        }}>
                                            <div>
                                                <span style={{ fontWeight: '600', color: '#495057' }}>📍 Location: </span>
                                                <span style={{ color: '#6c757d' }}>
                                                    {vendor.dispatcher_info.location_name || vendor.dispatcher_info.city || 'Local Branch'}
                                                </span>
                                            </div>
                                            {vendor.dispatcher_info.gmb_url && (
                                                <a 
                                                    href={vendor.dispatcher_info.gmb_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        color: '#007bff',
                                                        textDecoration: 'none',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        padding: '2px 6px',
                                                        backgroundColor: '#e7f3ff',
                                                        borderRadius: '4px',
                                                        border: '1px solid #b3d9ff'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1ecf1'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e7f3ff'}
                                                >
                                                    📍 View on Google
                                                </a>
                                            )}
                                        </div>
                                        {vendor.dispatcher_info.owner && (
                                            <div style={{ marginTop: '4px', fontSize: '11px', color: '#6c757d' }}>
                                                <span style={{ fontWeight: '500' }}>👤 Dispatcher: </span>
                                                <span>{vendor.dispatcher_info.owner}</span>
                                            </div>
                                        )}
                                        {vendor.dispatcher_info.phone && (
                                            <div style={{ marginTop: '2px', fontSize: '11px', color: '#6c757d' }}>
                                                <span style={{ fontWeight: '500' }}>📞 Phone: </span>
                                                <span>{vendor.dispatcher_info.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selected && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#059669', fontSize: '14px' }}>
                        ✓ {vendors.find(v => v.vendor_slug === selected)?.vendor_name} selected
                    </p>
                </div>
            )}
        </div>
    );
};

export default Step4; 