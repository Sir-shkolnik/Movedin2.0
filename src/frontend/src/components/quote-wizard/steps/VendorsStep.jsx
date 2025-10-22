import React, { useState, useEffect } from "react";
import { useForm } from "../../../contexts/FormContext";
import quoteService from "../../../services/quoteService";

// Vendor logos mapping
const vendorLogos = {
  'lets-get-moving': '/logos/logo_letsgetmoving.jpg',
  'pierre-sons': '/logos/pierresons.png',
  'velocity-movers': '/logos/velocitymovers.jpg',
  'easy2go': '/logos/easy2go.png'
};

function VendorsStep() {
  const { data, setData } = useForm();
  const [selected, setSelected] = useState(data.selectedQuote?.vendor_slug || null);
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    // Generate real quotes from all vendors
    const generateQuotes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Validate required data
        if (!data.from || !data.to || !data.date || !data.time) {
          setError('Please complete the previous steps before viewing quotes.');
          setLoading(false);
          return;
        }
        
        // Prepare quote request from form data - NO FALLBACKS!
        const quoteRequest = {
          origin_address: data.from,
          destination_address: data.to,
          move_date: data.date,
          move_time: data.time,
          total_rooms: data.fromDetails?.rooms || 0,
          square_footage: data.fromDetails?.sqft || '',
          estimated_weight: data.fromDetails?.estimatedWeight || 0,
          heavy_items: data.fromDetails?.heavyItems || {},
          stairs_at_pickup: data.fromDetails?.stairs || 0,
          stairs_at_dropoff: data.toDetails?.stairs || 0,
          elevator_at_pickup: data.fromDetails?.elevator || false,
          elevator_at_dropoff: data.toDetails?.elevator || false,
          additional_services: data.fromDetails?.additional || {},
          home_type: data.fromDetails?.homeType || '',
          floors: data.fromDetails?.floors || 0,
          garage: data.fromDetails?.garage || false,
          floor_number: data.fromDetails?.floorNumber || 0,
          loading_dock: data.fromDetails?.loadingDock || false
        };
        
        console.log('📊 Generating quotes with request:', quoteRequest);
        
        // Generate quotes from all vendors
        const quotes = await quoteService.generateQuotes(quoteRequest);
        
        console.log('✅ Received quotes:', quotes);
        
        setVendors(quotes);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error generating quotes:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    generateQuotes();
  }, [data.from, data.to, data.date, data.time, data.fromDetails, data.toDetails]);

  const handleSelectVendor = (vendor) => {
    setSelected(vendor.vendor_slug);
    setData(prev => ({
      ...prev,
      selectedQuote: vendor,
      vendor: {
        slug: vendor.vendor_slug,
        name: vendor.vendor_name
      },
      canProceedFromVendors: true // Validation flag for next step
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price);
  };

  // Sort vendors based on selected criteria
  const sortedVendors = [...vendors].sort((a, b) => {
    if (sortBy === 'price') return a.hourly_rate - b.hourly_rate;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'hours') return a.estimated_hours - b.estimated_hours;
    return 0;
  });

  return (
    <div className="qw-inner-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 className="qw-title" style={{ margin: 0 }}>Select a Mover</h2>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D0D5DD',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
          <option value="hours">Sort by Hours</option>
        </select>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            display: 'inline-block',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              border: '4px solid #F3F4F6',
              borderTop: '4px solid #5340FF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>
            Finding the best movers for you...
          </h3>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            Analyzing your move details and comparing prices
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#EF4444', fontSize: '16px' }}>Error: {error}</p>
        </div>
      ) : (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {sortedVendors.map((vendor) => {
            console.log('🔍 Rendering vendor:', vendor.vendor_name, 'cost:', vendor.total_cost, 'is_long_distance:', vendor.is_long_distance);
            
            // Handle long-distance moves with callback request
            if (vendor.is_long_distance || vendor.total_cost === 0) {
              return (
                <div
                  key={vendor.vendor_slug}
                  style={{
                    border: '2px solid #F59E0B',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '16px',
                    background: '#FFFBEB'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600, color: '#1F2937' }}>
                        {vendor.vendor_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ color: '#F59E0B', fontSize: '18px' }}>★</span>
                        <span style={{ fontWeight: 600, color: '#1F2937' }}>{vendor.rating}</span>
                        <span style={{ color: '#6B7280', fontSize: '14px' }}>({vendor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#F59E0B', background: 'white', padding: '6px 12px', borderRadius: '20px' }}>
                        📞 Needs Specialist
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: '16px', 
                    background: 'white', 
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #FDE68A'
                  }}>
                    <div style={{ fontSize: '14px', color: '#92400E', marginBottom: '12px' }}>
                      {vendor.rejection_reason || vendor.special_notes}
                    </div>
                    
                    <div style={{ fontSize: '13px', color: '#78350F', marginBottom: '16px' }}>
                      <strong>Why?</strong> Long-distance moves (inter-province or international) require specialized logistics and pricing. Our moving specialist will work with you to create a custom quote that fits your needs.
                    </div>

                    <button
                      onClick={() => {
                        // Save callback request to form data
                        setData(prev => ({
                          ...prev,
                          callbackRequest: {
                            vendor: vendor.vendor_name,
                            reason: vendor.rejection_reason || vendor.special_notes,
                            timestamp: new Date().toISOString()
                          }
                        }));
                        alert('✅ Callback request saved! Our specialist will contact you within 24 hours.');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: '#5340FF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#4230dd'}
                      onMouseOut={(e) => e.target.style.background = '#5340FF'}
                    >
                      📞 Request Callback from Specialist
                    </button>
                  </div>
                </div>
              );
            }
            
            return (
            <div
              key={vendor.vendor_slug}
              onClick={() => handleSelectVendor(vendor)}
              style={{
                border: selected === vendor.vendor_slug ? '2px solid #5340FF' : '1px solid #D0D5DD',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '20px',
                cursor: 'pointer',
                background: selected === vendor.vendor_slug ? '#F2F1FF' : '#FFFFFF',
                transition: 'all 0.3s ease',
                boxShadow: selected === vendor.vendor_slug ? '0 4px 16px rgba(83, 64, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              {/* Header with Logo and Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Company Logo */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img 
                      src={vendorLogos[vendor.vendor_slug] || '/logos/logo_letsgetmoving.jpg'} 
                      alt={vendor.vendor_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="font-size: 24px;">🚚</div>';
                      }}
                    />
                  </div>
                  
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 700, color: '#1F2937' }}>
                      {vendor.vendor_name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#F59E0B', fontSize: '16px' }}>★</span>
                      <span style={{ fontWeight: 600, color: '#1F2937', fontSize: '14px' }}>{vendor.rating}</span>
                      <span style={{ color: '#6B7280', fontSize: '13px' }}>({vendor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                {/* Hourly Rate */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#5340FF', lineHeight: '1' }}>
                    {formatPrice(vendor.hourly_rate)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>/hour</div>
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '12px',
                marginBottom: '16px',
                padding: '16px',
                background: '#F9FAFB',
                borderRadius: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Est. Hours</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>{vendor.estimated_hours.toFixed(1)}h</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Crew Size</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>{vendor.crew_size} 👥</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Trucks</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>{vendor.truck_count} 🚛</div>
                </div>
              </div>

              {/* Special Notes */}
              <div style={{ 
                padding: '12px 16px', 
                background: '#F0FDF4', 
                borderRadius: '8px',
                fontSize: '13px',
                color: '#047857',
                marginBottom: '12px',
                border: '1px solid #10B981'
              }}>
                <strong>ℹ️</strong> {vendor.special_notes}
              </div>

              {/* Why This Price? Breakdown */}
              {vendor.breakdown && (
                <div style={{ marginTop: '12px' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(expanded === vendor.vendor_slug ? null : vendor.vendor_slug);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: expanded === vendor.vendor_slug ? '#5340FF' : '#F9FAFB',
                      border: expanded === vendor.vendor_slug ? 'none' : '1px solid #D0D5DD',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: expanded === vendor.vendor_slug ? 'white' : '#1F2937',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {expanded === vendor.vendor_slug ? '▼' : '▶'} Why this hourly rate?
                  </button>
                  {expanded === vendor.vendor_slug && (
                    <div style={{ marginTop: '12px', padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                      {/* Hourly Rate Explanation */}
                      <div style={{ 
                        padding: '12px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        marginBottom: '12px',
                        border: '1px solid #E5E7EB'
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>
                          💡 Hourly Rate Breakdown
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>
                          The hourly rate of <strong>{formatPrice(vendor.hourly_rate)}/hr</strong> is based on:
                        </div>
                        <ul style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px', paddingLeft: '20px', lineHeight: '1.6' }}>
                          <li>Crew size: <strong>{vendor.crew_size} movers</strong></li>
                          <li>Truck count: <strong>{vendor.truck_count} truck{vendor.truck_count > 1 ? 's' : ''}</strong></li>
                          <li>Base rate for your location</li>
                          <li>Complexity of your move</li>
                        </ul>
                      </div>

                      {/* Hourly Rate Calculation */}
                      <div style={{ 
                        padding: '12px', 
                        background: 'white', 
                        borderRadius: '8px', 
                        marginTop: '8px',
                        border: '1px solid #E5E7EB'
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', marginBottom: '8px' }}>
                          💰 How the hourly rate is calculated
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.6' }}>
                          The hourly rate includes:
                        </div>
                        <ul style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px', paddingLeft: '20px', lineHeight: '1.6' }}>
                          <li>Base rate for your location: <strong>{formatPrice(vendor.base_rate || vendor.hourly_rate)}/hr</strong></li>
                          <li>+ {vendor.crew_size} movers × hourly rate</li>
                          <li>+ {vendor.truck_count} truck{vendor.truck_count > 1 ? 's' : ''} × rate</li>
                          <li>+ Complexity adjustments</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}

export default VendorsStep;


