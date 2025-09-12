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
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    color: '#1e293b',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}>
                    {/* Moving Truck Animation */}
                    <div className="truck-animation" style={{
                        width: '100px',
                        height: '80px',
                        margin: '0 auto 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Moving Truck Icon */}
                        <div style={{
                            fontSize: '48px',
                            animation: 'truckMove 3s ease-in-out infinite',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }}>
                            🚚
                        </div>
                    </div>

                    {/* Loading Title */}
                    <h3 style={{
                        fontSize: '24px',
                        marginBottom: '16px',
                        fontWeight: 'bold',
                        color: '#1e293b',
                        textShadow: 'none'
                    }}>
                        Finding Your Perfect Moving Company
                    </h3>

                    {/* Progress Steps */}
                    <div className="progress-steps" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '40px',
                        flexWrap: 'wrap',
                        padding: '0 16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '25px',
                            border: '2px solid #0ea5e9',
                            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)',
                            animation: 'stepPulse 2s ease-in-out infinite'
                        }}>
                            <span style={{ fontSize: '18px' }}>🔍</span>
                            <span style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600' }}>Searching</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '25px',
                            border: '2px solid #22c55e',
                            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
                            animation: 'stepPulse 2s ease-in-out infinite 0.7s'
                        }}>
                            <span style={{ fontSize: '18px' }}>📊</span>
                            <span style={{ fontSize: '14px', color: '#15803d', fontWeight: '600' }}>Calculating</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '25px',
                            border: '2px solid #f59e0b',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
                            animation: 'stepPulse 2s ease-in-out infinite 1.4s'
                        }}>
                            <span style={{ fontSize: '18px' }}>💰</span>
                            <span style={{ fontSize: '14px', color: '#d97706', fontWeight: '600' }}>Pricing</span>
                        </div>
                    </div>

                    {/* Loading Message */}
                    <p style={{
                        fontSize: '18px',
                        marginBottom: '16px',
                        fontWeight: '500',
                        color: '#374151',
                        textAlign: 'center',
                        padding: '0 16px'
                    }}>
                        We're connecting with top-rated moving companies in your area...
                    </p>
                    
                    <p style={{
                        fontSize: '14px',
                        opacity: '0.7',
                        marginBottom: '32px',
                        color: '#6b7280',
                        textAlign: 'center',
                        padding: '0 16px'
                    }}>
                        This ensures you get the best service and competitive pricing
                    </p>

                    {/* Simple Progress Indicator */}
                    <div style={{
                        width: '100%',
                        maxWidth: '200px',
                        margin: '24px auto 0',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '15px',
                        height: '8px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{
                            width: '70%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                            borderRadius: '15px',
                            animation: 'smoothProgress 4s ease-in-out infinite'
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
                    padding: '24px',
                    marginBottom: '32px',
                    marginTop: '16px'
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
                    @keyframes truckMove {
                        0%, 100% { 
                            transform: translateX(0px) scale(1); 
                        }
                        50% { 
                            transform: translateX(10px) scale(1.05); 
                        }
                    }
                    @keyframes stepPulse {
                        0%, 100% { 
                            opacity: 1; 
                            transform: scale(1); 
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
                        }
                        50% { 
                            opacity: 0.9; 
                            transform: scale(1.02); 
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
                        }
                    }
                    @keyframes smoothProgress {
                        0% { 
                            width: 0%; 
                            opacity: 0.8; 
                        }
                        50% { 
                            width: 70%; 
                            opacity: 1; 
                        }
                        100% { 
                            width: 100%; 
                            opacity: 0.8; 
                        }
                    }
                    @media (max-width: 768px) {
                        .loading-container {
                            padding: 40px 16px !important;
                        }
                        .truck-animation {
                            width: 80px !important;
                            height: 80px !important;
                            margin: 20px auto 40px auto !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            position: relative !important;
                        }
                        .truck-animation > div {
                            font-size: 36px !important;
                            position: absolute !important;
                            top: 50% !important;
                            left: 50% !important;
                            transform: translate(-50%, -50%) !important;
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
                                {/* Mobile-Style Layout - Vendor Name */}
                                <h3 className="vendor-name-modern" style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    margin: '0 0 8px 0',
                                    textAlign: 'center',
                                    color: '#1f2937'
                                }}>
                                    {vendor.vendor_name}
                                </h3>

                                {/* Mobile-Style Pricing Section */}
                                <div className="vendor-pricing-modern" style={{
                                    backgroundColor: theme.secondary,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    marginBottom: '12px',
                                    border: `1px solid ${theme.primary}20`
                                }}>
                                    <div className="hourly-rate-modern" style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        color: theme.primary,
                                        marginBottom: '4px'
                                    }}>
                                        {formatCurrency(vendor.hourly_rate)}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6c757d'
                                    }}>
                                        Est. Time: {totalTime.toFixed(1)} hours
                                    </div>
                                </div>

                                {/* Mobile-Style Move Details */}
                                <div className="move-size-details-modern" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}>
                                    <div className="move-size-item-modern" style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #e9ecef',
                                        fontSize: '13px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontWeight: '600', color: '#495057' }}>Move Size: </span>
                                        <span style={{ color: '#007bff' }}>
                                            {vendor.move_size.rooms > 0 ? `${vendor.move_size.rooms} rooms` : 
                                             vendor.move_size.square_footage > 0 ? `${vendor.move_size.square_footage} sq ft` : 
                                             'Standard'}
                                        </span>
                                    </div>
                                    <div className="move-size-item-modern" style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #e9ecef',
                                        fontSize: '13px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontWeight: '600', color: '#495057' }}>
                                            {vendor.crew_size} movers, {vendor.truck_count} truck{vendor.truck_count !== 1 ? 's' : ''}
                                        </span>
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