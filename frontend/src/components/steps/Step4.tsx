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
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔄</div>
                    <p>Getting quotes from moving companies...</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>This may take a few moments</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="step-card">
                <h2>Choose Your Moving Company</h2>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️</div>
                    <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>
                    <button 
                        onClick={handleRetry}
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
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="step-card">
            <h2>Choose Your Moving Company</h2>
            
            <div className="vendor-grid-modern">
                {vendors.map((vendor) => {
                    const theme = getVendorTheme(vendor.vendor_slug);
                    const isSelected = selected === vendor.vendor_slug;
                    const totalTime = vendor.travel_time_hours + vendor.estimated_hours;
                    
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
                                <div className="vendor-pricing-modern">
                                    <div className="hourly-rate-modern">
                                        <span className="rate-label">Hourly Rate:</span>
                                        <span className="rate-value">{formatCurrency(vendor.hourly_rate)}</span>
                                    </div>
                                    <div className="total-time-modern">
                                        <span className="time-label">Est. Time:</span>
                                        <span className="time-value">{totalTime.toFixed(1)} hours</span>
                                    </div>
                                </div>

                                <div className="vendor-stats-compact">
                                    <div className="move-size-item-modern">
                                        <span className="size-label">Move Size:</span>
                                        <span className="size-value">
                                            {vendor.move_size.rooms > 0 ? `${vendor.move_size.rooms} rooms` : 
                                             vendor.move_size.square_footage > 0 ? `${vendor.move_size.square_footage} sq ft` : 
                                             'Standard move'}
                                        </span>
                                    </div>
                                    <div className="crew-info-modern">
                                        <span className="crew-label">Crew:</span>
                                        <span className="crew-value">{vendor.crew_size} movers, {vendor.truck_count} truck{vendor.truck_count !== 1 ? 's' : ''}</span>
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