import React, { useState, useEffect } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

const homeTypes = [
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'commercial', label: 'Commercial' },
];

const roomOptions = Array.from({ length: 10 }, (_, i) => ({ 
    value: i + 1, 
    label: `${i + 1} room${i === 0 ? '' : 's'}` 
})).concat({ value: 11, label: '10+' });

const sqftOptions = [
    { value: '<500', label: '< 500 sq ft' },
    { value: '500-1000', label: '500–1000 sq ft' },
    { value: '1000-1500', label: '1000–1500 sq ft' },
    { value: '1500-2000', label: '1500–2000 sq ft' },
    { value: '2000+', label: '2000+ sq ft' },
];

const heavyItemList = [
    { key: 'piano', label: 'Piano' },
    { key: 'safe', label: 'Safe' },
    { key: 'treadmill', label: 'Treadmill' },
];

const additionalList = [
    { key: 'packing', label: 'Packing' },
    { key: 'storage', label: 'Storage' },
    { key: 'cleaning', label: 'Cleaning' },
    { key: 'junk', label: 'Junk Removal' },
];

const GroupedDropdowns: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="grouped-dropdowns">
        {children}
    </div>
);

interface Step2Props {
    onNext: () => void;
    onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ onNext, onBack }) => {
    const { data, setData } = useForm();
    
    const [homeType, setHomeType] = useState(data.fromDetails?.homeType || 'house');
    const [rooms, setRooms] = useState(() => {
        const initialRooms = data.fromDetails?.rooms;
        console.log('Step 2 - Initializing rooms state:', { 
            fromDetails: data.fromDetails, 
            initialRooms, 
            defaultRooms: 1 
        });
        return initialRooms || 1;
    });
    const [sqft, setSqft] = useState(data.fromDetails?.sqft || '');
    
    const [heavyItems, setHeavyItems] = useState<{[key: string]: boolean}>({
        piano: !!(data.fromDetails?.heavyItems?.piano),
        safe: !!(data.fromDetails?.heavyItems?.safe),
        treadmill: !!(data.fromDetails?.heavyItems?.treadmill),
    });
    const [additional, setAdditional] = useState<{[key: string]: boolean}>(data.fromDetails?.additionalServices || {});
    
    // House-specific
    const [floors, setFloors] = useState(data.fromDetails?.floors || 1);
    const [garage, setGarage] = useState(data.fromDetails?.garage || false);
    const [stairs, setStairs] = useState(data.fromDetails?.stairs || 0);
    
    // Condo/Apartment-specific
    const [floorNumber, setFloorNumber] = useState(data.fromDetails?.floorNumber || 1);
    const [elevator, setElevator] = useState(data.fromDetails?.elevator || false);
    const [loadingDock, setLoadingDock] = useState(data.fromDetails?.loadingDock || false);

    // Auto-save data when values change
    useEffect(() => {
        const newFromDetails = {
            homeType,
            rooms: homeType === 'commercial' ? 1 : rooms,
            sqft: homeType === 'commercial' ? sqft : '',
            heavyItems: {
                piano: heavyItems.piano ? 1 : 0,
                safe: heavyItems.safe ? 1 : 0,
                treadmill: heavyItems.treadmill ? 1 : 0,
            },
            additionalServices: additional,
            floors: homeType === 'house' ? floors : undefined,
            garage: homeType === 'house' ? garage : undefined,
            stairs: homeType === 'house' ? stairs : undefined,
            floorNumber: homeType === 'condo' || homeType === 'apartment' ? floorNumber : undefined,
            elevator: homeType === 'condo' || homeType === 'apartment' ? elevator : undefined,
            loadingDock: homeType === 'condo' || homeType === 'apartment' ? loadingDock : undefined,
        };
        
        console.log('Step 2 - Auto-saving data:', {
            homeType,
            selectedRooms: rooms,
            savedRooms: newFromDetails.rooms,
            homeTypeCondition: homeType === 'commercial',
            fullFromDetails: newFromDetails
        });
        
        setData(prev => ({
            ...prev,
            fromDetails: newFromDetails,
        }));
    }, [homeType, rooms, sqft, heavyItems, additional, floors, garage, stairs, floorNumber, elevator, loadingDock, setData]);

    const handleContinue = () => {
        const newFromDetails = {
            homeType,
            rooms: homeType === 'commercial' ? 1 : rooms, // always a number
            sqft: homeType === 'commercial' ? sqft : '',
            heavyItems: {
                piano: heavyItems.piano ? 1 : 0,
                safe: heavyItems.safe ? 1 : 0,
                treadmill: heavyItems.treadmill ? 1 : 0,
            },
            additionalServices: additional,
            // House
            floors: homeType === 'house' ? floors : undefined,
            garage: homeType === 'house' ? garage : undefined,
            stairs: homeType === 'house' ? stairs : undefined,
            // Condo/Apartment
            floorNumber: homeType === 'condo' || homeType === 'apartment' ? floorNumber : undefined,
            elevator: homeType === 'condo' || homeType === 'apartment' ? elevator : undefined,
            loadingDock: homeType === 'condo' || homeType === 'apartment' ? loadingDock : undefined,
        };
        
        console.log('Step 2 - Saving data:', {
            homeType,
            selectedRooms: rooms,
            savedRooms: newFromDetails.rooms,
            homeTypeCondition: homeType === 'commercial',
            fullFromDetails: newFromDetails
        });
        
        setData(prev => ({
            ...prev,
            fromDetails: newFromDetails,
        }));
        onNext();
    };

    console.log('Step 2 - Component rendered with rooms:', rooms);
    
    return (
        <div className="step-card">
            <h2 style={{ marginBottom: 24 }}>Origin Home</h2>
            
            <div className="form-group">
                <label>
                    Home Type<span className="required">*</span>
                </label>
                <select 
                    value={homeType} 
                    onChange={e => setHomeType(e.target.value as 'house' | 'condo' | 'apartment' | 'commercial')}
                    className="autocomplete-input"
                >
                    {homeTypes.map(ht => (
                        <option key={ht.value} value={ht.value}>
                            {ht.label}
                        </option>
                    ))}
                </select>
            </div>

            {homeType === 'house' && (
                <>
                    <div className="form-section-header">House Details</div>
                    <GroupedDropdowns>
                        <div className="form-group">
                            <label>Floors</label>
                            <select 
                                value={floors} 
                                onChange={e => setFloors(Number(e.target.value))}
                                className="autocomplete-input"
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3+</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Garage</label>
                            <select 
                                value={garage ? 'yes' : 'no'} 
                                onChange={e => setGarage(e.target.value === 'yes')}
                                className="autocomplete-input"
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Stairs at Pickup</label>
                            <select 
                                value={stairs} 
                                onChange={e => setStairs(Number(e.target.value))}
                                className="autocomplete-input"
                            >
                                {Array.from({ length: 11 }, (_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                    </GroupedDropdowns>
                </>
            )}

            {(homeType === 'condo' || homeType === 'apartment') && (
                <>
                    <div className="form-section-header">
                        {homeType === 'condo' ? 'Condo Details' : 'Apartment Details'}
                    </div>
                    <GroupedDropdowns>
                        <div className="form-group">
                            <label>Unit Number</label>
                            <select 
                                value={floorNumber} 
                                onChange={e => setFloorNumber(Number(e.target.value))}
                                className="autocomplete-input"
                            >
                                {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Elevator at Pickup</label>
                            <select 
                                value={elevator ? 'yes' : 'no'} 
                                onChange={e => setElevator(e.target.value === 'yes')}
                                className="autocomplete-input"
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Loading Dock</label>
                            <select 
                                value={loadingDock ? 'yes' : 'no'} 
                                onChange={e => setLoadingDock(e.target.value === 'yes')}
                                className="autocomplete-input"
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                    </GroupedDropdowns>
                </>
            )}

            {homeType !== 'commercial' && (
                <div className="form-group">
                    <label>
                        Total Rooms<span className="required">*</span>
                    </label>
                    <select 
                        value={rooms} 
                        onChange={e => {
                            const newRooms = Number(e.target.value);
                            console.log('Step 2 - Room selection changed:', { oldRooms: rooms, newRooms });
                            setRooms(newRooms);
                        }}
                        className="autocomplete-input"
                    >
                        {roomOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {homeType === 'commercial' && (
                <div className="form-group">
                    <label>
                        Square Footage<span className="required">*</span>
                    </label>
                    <select 
                        value={sqft} 
                        onChange={e => setSqft(e.target.value)}
                        className="autocomplete-input"
                    >
                        {sqftOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="form-group">
                <label>Heavy Items</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                            {heavyItemList.map(item => (
                        <label key={item.key} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            fontSize: '14px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: heavyItems[item.key] ? '#7b61ff' : '#fff',
                            color: heavyItems[item.key] ? '#fff' : '#333',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                                    <input
                                        type="checkbox"
                                        checked={!!heavyItems[item.key]}
                                        onChange={e => setHeavyItems({
                                            ...heavyItems,
                                            [item.key]: e.target.checked
                                        })}
                                style={{ margin: 0, opacity: 0, position: 'absolute' }}
                                    />
                                    {item.label}
                                </label>
                            ))}
                </div>
            </div>

            <div className="form-group">
                <label>Additional Services</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                            {additionalList.map(item => (
                        <label key={item.key} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            fontSize: '14px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: additional[item.key] ? '#7b61ff' : '#fff',
                            color: additional[item.key] ? '#fff' : '#333',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                                    <input
                                        type="checkbox"
                                        checked={!!additional[item.key]}
                                        onChange={e => setAdditional({
                                            ...additional,
                                            [item.key]: e.target.checked
                                        })}
                                style={{ margin: 0, opacity: 0, position: 'absolute' }}
                                    />
                                    {item.label}
                                </label>
                            ))}
                </div>
            </div>
        </div>
    );
};

export default Step2; 