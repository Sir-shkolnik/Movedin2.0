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

function ToDetailsStep() {
  const { data, setData } = useForm();
  
  const [sameAsFrom, setSameAsFrom] = useState(false);
  const [homeType, setHomeType] = useState(data.toDetails?.homeType || 'house');
  const [rooms, setRooms] = useState(data.toDetails?.rooms || 1);
  const [sqft, setSqft] = useState(data.toDetails?.sqft || '');
  
  // House-specific
  const [floors, setFloors] = useState(data.toDetails?.floors || 1);
  const [stairs, setStairs] = useState(data.toDetails?.stairs || 0);
  
  // Condo/Apartment-specific
  const [floorNumber, setFloorNumber] = useState(data.toDetails?.floorNumber || 1);
  const [elevator, setElevator] = useState(data.toDetails?.elevator || false);
  
  // Commercial-specific
  const [loadingDock, setLoadingDock] = useState(data.toDetails?.loadingDock || false);

  // Copy from "From Details" when checkbox is checked
  useEffect(() => {
    if (sameAsFrom && data.fromDetails) {
      setHomeType(data.fromDetails.homeType);
      setRooms(data.fromDetails.rooms || 1);
      setSqft(data.fromDetails.sqft || '');
      setFloors(data.fromDetails.floors || 1);
      setStairs(data.fromDetails.stairs || 0);
      setFloorNumber(data.fromDetails.floorNumber || 1);
      setElevator(data.fromDetails.elevator || false);
      setLoadingDock(data.fromDetails.loadingDock || false);
    }
  }, [sameAsFrom, data.fromDetails]);

  // Sync to global context
  useEffect(() => {
    setData(prev => ({
      ...prev,
      toDetails: {
        homeType,
        rooms: homeType !== 'commercial' ? rooms : undefined,
        sqft: homeType === 'commercial' ? sqft : '',
        floors: homeType === 'house' ? floors : undefined,
        stairs: stairs,
        floorNumber: (homeType === 'condo' || homeType === 'apartment' || homeType === 'commercial') ? floorNumber : undefined,
        elevator: (homeType === 'condo' || homeType === 'apartment' || homeType === 'commercial') ? elevator : undefined,
        loadingDock: homeType === 'commercial' ? loadingDock : undefined
      }
    }));
  }, [homeType, rooms, sqft, floors, stairs, floorNumber, elevator, loadingDock, setData]);

  return (
    <div className="qw-inner-content">
      <h2 className="qw-title">To Details</h2>
      <p style={{ 
        textAlign: 'center', 
        color: '#6B7280', 
        fontSize: '14px', 
        marginBottom: '24px',
        maxWidth: 600,
        margin: '0 auto 24px auto'
      }}>
        Tell us about your new location
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
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n} stair{n !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Same as From Checkbox - At the end of the card */}
        <div style={{ 
          marginTop: '20px',
          padding: '16px',
          background: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #D0D5DD'
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer'
          }}>
            <input 
              type="checkbox" 
              checked={sameAsFrom}
              onChange={(e) => setSameAsFrom(e.target.checked)}
              style={{ cursor: 'pointer', width: '18px', height: '18px' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>
                ✓ Same as "From" address
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                Copy all details from your current address
              </div>
            </div>
          </label>
        </div>

        {/* Summary */}
        {sameAsFrom && (
          <div style={{ 
            marginTop: '16px', 
            padding: '16px', 
            background: '#F0FDF4', 
            borderRadius: '8px',
            border: '1px solid #10B981'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#065F46',
              fontWeight: 600
            }}>
              ✓ All details copied from "From" address
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDetailsStep;


