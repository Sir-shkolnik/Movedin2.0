import React, { useState, useEffect } from "react";
import { useForm } from "../../../contexts/FormContext";

const homeTypes = [
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
];

const roomOptions = [
  { value: 1, label: '1 room' },
  { value: 2, label: '2 rooms' },
  { value: 3, label: '3 rooms' },
  { value: 4, label: '4 rooms' },
  { value: 5, label: '5 rooms' },
  { value: 6, label: '6 rooms' },
  { value: 7, label: '7 rooms' },
  { value: 8, label: '8+ rooms' }
];

const sqftOptions = [
  { value: '<500', label: '< 500 sq ft' },
  { value: '500-1000', label: '500–1000 sq ft' },
  { value: '1000-1500', label: '1000–1500 sq ft' },
  { value: '1500-2000', label: '1500–2000 sq ft' },
  { value: '2000-3000', label: '2000–3000 sq ft' },
  { value: '3000+', label: '3000+ sq ft' },
];

const heavyItemList = [
  { key: 'piano', label: 'Piano', icon: '🎹' },
  { key: 'pool_table', label: 'Pool Table', icon: '🎱' },
  { key: 'safe', label: 'Safe', icon: '🔒' },
  { key: 'treadmill', label: 'Treadmill', icon: '🏃' },
  { key: 'trampoline', label: 'Trampoline', icon: '🤸' },
  { key: 'grandfather_clock', label: 'Grandfather Clock', icon: '🕰️' },
  { key: 'hot_tub', label: 'Hot Tub', icon: '🛁' },
  { key: 'appliances', label: 'Large Appliances', icon: '🔌' },
];

const additionalList = [
  { key: 'packing', label: 'Packing Service', icon: '📦' },
  { key: 'unpacking', label: 'Unpacking Service', icon: '📦' },
  { key: 'storage', label: 'Storage', icon: '🏢' },
  { key: 'assembly', label: 'Furniture Assembly', icon: '🔧' },
  { key: 'disassembly', label: 'Furniture Disassembly', icon: '🔧' },
  { key: 'cleaning', label: 'Cleaning Service', icon: '🧹' },
];

function FromDetailsStep() {
  const { data, setData } = useForm();
  
  const [homeType, setHomeType] = useState(data.fromDetails?.homeType || '');
  const [rooms, setRooms] = useState(data.fromDetails?.rooms || '');
  const [sqft, setSqft] = useState(data.fromDetails?.sqft || '');
  
  // House-specific
  const [floors, setFloors] = useState(data.fromDetails?.floors || '');
  const [stairs, setStairs] = useState(data.fromDetails?.stairs || '');
  
  // Condo/Apartment-specific
  const [floorNumber, setFloorNumber] = useState(data.fromDetails?.floorNumber || '');
  const [elevator, setElevator] = useState(data.fromDetails?.elevator || '');
  
  // Commercial-specific
  const [loadingDock, setLoadingDock] = useState(data.fromDetails?.loadingDock || '');
  
  // Heavy items
  const [heavyItems, setHeavyItems] = useState(data.fromDetails?.heavyItems || {});
  
  // Additional services
  const [additional, setAdditional] = useState(data.fromDetails?.additional || {});

  // Reset dependent fields when property type changes
  useEffect(() => {
    if (homeType) {
      setRooms('');
      setFloors('');
      setFloorNumber('');
      setElevator('');
      setSqft('');
      setLoadingDock('');
      setStairs('');
    }
  }, [homeType]);

  // Sync to global context
  useEffect(() => {
    setData(prev => ({
      ...prev,
      fromDetails: {
        homeType,
        rooms: homeType !== 'commercial' ? rooms : undefined,
        sqft: homeType === 'commercial' ? sqft : '',
        floors: homeType === 'house' ? floors : undefined,
        stairs: stairs,
        floorNumber: (homeType === 'condo' || homeType === 'apartment' || homeType === 'commercial') ? floorNumber : undefined,
        elevator: (homeType === 'condo' || homeType === 'apartment' || homeType === 'commercial') ? elevator : undefined,
        loadingDock: homeType === 'commercial' ? loadingDock : undefined,
        heavyItems,
        additional
      }
    }));
  }, [homeType, rooms, sqft, floors, stairs, floorNumber, elevator, loadingDock, heavyItems, additional, setData]);

  const toggleHeavyItem = (key) => {
    setHeavyItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAdditional = (key) => {
    setAdditional(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="qw-inner-content">
      <h2 className="qw-title">From Details</h2>
      <p style={{ 
        textAlign: 'center', 
        color: '#6B7280', 
        fontSize: '14px', 
        marginBottom: '24px',
        maxWidth: 600,
        margin: '0 auto 24px auto'
      }}>
        Tell us about your current location
      </p>
      
      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .form-grid > div {
            grid-column: span 12 !important;
          }
          
          .heavy-items-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
          }
          
          .service-items-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
          }
        }
        
        @media (max-width: 480px) {
          .heavy-items-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 4px !important;
          }
          
          .service-items-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 4px !important;
          }
        }
      `}</style>
      
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* 12-Column Grid Layout - Two dropdowns per row */}
        <div className="form-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Property Type + Rooms - 2 in a row */}
          <div className="qw-field" style={{ gridColumn: 'span 6' }}>
            <label className="qw-label">
              Property Type<span className="required">*</span>
            </label>
            <select 
              className="qw-input" 
              value={homeType} 
              onChange={(e) => setHomeType(e.target.value)}
              style={{ fontSize: '14px', padding: '10px 12px' }}
            >
              <option value="">Select property type</option>
              {homeTypes.map(ht => (
                <option key={ht.value} value={ht.value}>{ht.label}</option>
              ))}
            </select>
          </div>

          {/* Rooms (for House/Townhouse/Condo/Apartment) - 6 columns */}
          {homeType !== 'commercial' && (
            <div className="qw-field" style={{ gridColumn: 'span 6' }}>
              <label className="qw-label">
                Rooms<span className="required">*</span>
              </label>
              <select 
                className="qw-input" 
                value={rooms} 
                onChange={(e) => setRooms(Number(e.target.value))}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              >
                <option value="">Select rooms</option>
                {roomOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Square Footage (for Commercial) - 6 columns */}
          {homeType === 'commercial' && (
            <div className="qw-field" style={{ gridColumn: 'span 6' }}>
              <label className="qw-label">
                Sq Ft<span className="required">*</span>
              </label>
              <select 
                className="qw-input" 
                value={sqft} 
                onChange={(e) => setSqft(e.target.value)}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              >
                <option value="">Select sq ft</option>
                {sqftOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Floors (for House) - 6 columns */}
          {homeType === 'house' && (
            <div className="qw-field" style={{ gridColumn: 'span 6' }}>
              <label className="qw-label">Floors</label>
              <select 
                className="qw-input" 
                value={floors} 
                onChange={(e) => setFloors(Number(e.target.value))}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              >
                <option value="">Select floors</option>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n} floor{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          )}

          {/* Floor Number (for Condo/Apartment/Commercial) - 6 columns */}
          {(homeType === 'condo' || homeType === 'apartment' || homeType === 'commercial') && (
            <div className="qw-field" style={{ gridColumn: 'span 6' }}>
              <label className="qw-label">Floor</label>
              <select 
                className="qw-input" 
                value={floorNumber} 
                onChange={(e) => setFloorNumber(Number(e.target.value))}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              >
                <option value="">Select floor</option>
                {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>Floor {n}</option>
                ))}
              </select>
            </div>
          )}

          {/* Elevator (for Condo/Apartment/Commercial) - 6 columns */}
          {(homeType === 'condo' || homeType === 'apartment' || homeType === 'commercial') && (
            <div className="qw-field" style={{ gridColumn: 'span 6' }}>
              <label className="qw-label">Elevator?</label>
              <select 
                className="qw-input" 
                value={elevator ? 'yes' : 'no'} 
                onChange={(e) => setElevator(e.target.value === 'yes')}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          )}

          {/* Loading Dock (for Commercial) - 6 columns */}
          {homeType === 'commercial' && (
            <div className="qw-field" style={{ gridColumn: 'span 6' }}>
              <label className="qw-label">Loading Dock?</label>
              <select 
                className="qw-input" 
                value={loadingDock ? 'yes' : 'no'} 
                onChange={(e) => setLoadingDock(e.target.value === 'yes')}
                style={{ fontSize: '14px', padding: '10px 12px' }}
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          )}

          {/* Stairs (for all types) - 6 columns */}
          <div className="qw-field" style={{ gridColumn: 'span 6' }}>
            <label className="qw-label">Stairs</label>
            <select 
              className="qw-input" 
              value={stairs} 
              onChange={(e) => setStairs(Number(e.target.value))}
              style={{ fontSize: '14px', padding: '10px 12px' }}
            >
              <option value="">Select stairs</option>
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n} stair{n !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Heavy Items + Extra Services - 2 in a row */}
          <div className="qw-field" style={{ gridColumn: 'span 6' }}>
            <label className="qw-label">
              Heavy Items?<span className="required">*</span>
            </label>
            <select 
              className="qw-input" 
              value={Object.keys(heavyItems).filter(key => heavyItems[key]).length > 0 ? 'yes' : 'no'} 
              onChange={(e) => {
                if (e.target.value === 'yes') {
                  setHeavyItems({
                    piano: true,
                    poolTable: true,
                    safe: true,
                    treadmill: true
                  });
                } else {
                  setHeavyItems({});
                }
              }}
              style={{ fontSize: '14px', padding: '10px 12px' }}
            >
              <option value="no">No heavy items</option>
              <option value="yes">Yes, I have heavy items</option>
            </select>
          </div>

          <div className="qw-field" style={{ gridColumn: 'span 6' }}>
            <label className="qw-label">
              Extra Services?<span className="required">*</span>
            </label>
            <select 
              className="qw-input" 
              value={Object.keys(additional).filter(key => additional[key]).length > 0 ? 'yes' : 'no'} 
              onChange={(e) => {
                if (e.target.value === 'yes') {
                  setAdditional({
                    packing: true,
                    unpacking: true,
                    disassembly: true
                  });
                } else {
                  setAdditional({});
                }
              }}
              style={{ fontSize: '14px', padding: '10px 12px' }}
            >
              <option value="no">No additional services</option>
              <option value="yes">Yes, I need extra services</option>
            </select>
          </div>
        </div>

        {/* Detailed Selection Grids - Only show if "Yes" is selected */}
        {(Object.keys(heavyItems).filter(key => heavyItems[key]).length > 0 || 
          Object.keys(additional).filter(key => additional[key]).length > 0) && (
          <div style={{ marginTop: '20px' }}>
            {/* Heavy Items Detail Grid */}
            {Object.keys(heavyItems).filter(key => heavyItems[key]).length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6B7280', 
                  marginBottom: '12px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Which heavy items?
                </p>
                <div className="heavy-items-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
                  gap: '8px',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  {heavyItemList.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => toggleHeavyItem(item.key)}
                      style={{
                        padding: '10px 6px',
                        border: heavyItems[item.key] ? '2px solid #5340FF' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        background: heavyItems[item.key] ? '#F2F1FF' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#1F2937',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: heavyItems[item.key] ? '0 2px 8px rgba(83, 64, 255, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transform: heavyItems[item.key] ? 'translateY(-1px)' : 'translateY(0)',
                        minHeight: '60px',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{item.icon}</span>
                      <span style={{ fontSize: '10px', textAlign: 'center', lineHeight: '1.2' }}>{item.label}</span>
                      {heavyItems[item.key] && (
                        <div style={{ 
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: '#5340FF',
                          color: 'white',
                          borderRadius: '50%',
                          width: '14px',
                          height: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Services Detail Grid */}
            {Object.keys(additional).filter(key => additional[key]).length > 0 && (
              <div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6B7280', 
                  marginBottom: '12px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Which services?
                </p>
                <div className="service-items-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
                  gap: '8px',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  {additionalList.map((service) => (
                    <button
                      key={service.key}
                      onClick={() => toggleAdditional(service.key)}
                      style={{
                        padding: '10px 6px',
                        border: additional[service.key] ? '2px solid #5340FF' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        background: additional[service.key] ? '#F2F1FF' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#1F2937',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: additional[service.key] ? '0 2px 8px rgba(83, 64, 255, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                        transform: additional[service.key] ? 'translateY(-1px)' : 'translateY(0)',
                        minHeight: '60px',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{service.icon}</span>
                      <span style={{ fontSize: '10px', textAlign: 'center', lineHeight: '1.2' }}>{service.label}</span>
                      {additional[service.key] && (
                        <div style={{ 
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: '#5340FF',
                          color: 'white',
                          borderRadius: '50%',
                          width: '14px',
                          height: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Compact Summary */}
        {(Object.keys(heavyItems).filter(key => heavyItems[key]).length > 0 || 
          Object.keys(additional).filter(key => additional[key]).length > 0) && (
          <div style={{ 
            marginTop: '20px', 
            padding: '12px 16px', 
            background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)', 
            borderRadius: '12px',
            border: '1px solid #10B981',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
            maxWidth: '400px',
            margin: '20px auto 0 auto'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#065F46',
              fontWeight: 700,
              marginBottom: '8px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>✓</span>
              <span>Selected Items</span>
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#047857', 
              lineHeight: '1.4',
              textAlign: 'center'
            }}>
              {Object.keys(heavyItems).filter(key => heavyItems[key]).length > 0 && (
                <div style={{ marginBottom: '4px' }}>
                  <strong>Heavy Items:</strong> {Object.keys(heavyItems).filter(key => heavyItems[key]).length}
                </div>
              )}
              {Object.keys(additional).filter(key => additional[key]).length > 0 && (
                <div>
                  <strong>Services:</strong> {Object.keys(additional).filter(key => additional[key]).length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FromDetailsStep;


