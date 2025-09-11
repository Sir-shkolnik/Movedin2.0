import React, { useState } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

const homeTypes = [
    { value: 'house', label: 'House' },
    { value: 'townhouse', label: 'TownHouse' },
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

const GroupedDropdowns: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="grouped-dropdowns">
        {children}
    </div>
);

interface Step3Props {
    onNext: () => void;
    onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ onNext, onBack }) => {
    const { data, setData } = useForm();
    
    const [homeType, setHomeType] = useState<'house' | 'townhouse' | 'condo' | 'apartment' | 'commercial'>(
        (data.toDetails && data.toDetails.homeType) || 
        (data.fromDetails && data.fromDetails.homeType) || 
        'house'
    );
    const [rooms, setRooms] = useState(
        (data.toDetails && data.toDetails.rooms) || 
        (data.fromDetails && data.fromDetails.rooms) || 
        1
    );
    const [sqft, setSqft] = useState(
        (data.toDetails && data.toDetails.sqft) || 
        (data.fromDetails && data.fromDetails.sqft) || 
        ''
    );
    const [stairs, setStairs] = useState((data.toDetails && data.toDetails.stairs) || 0);
    const [floorNumber, setFloorNumber] = useState((data.toDetails && data.toDetails.floorNumber) || 1);
    const [elevator, setElevator] = useState((data.toDetails && data.toDetails.elevator) || false);
    const [loadingDock, setLoadingDock] = useState((data.toDetails && data.toDetails.loadingDock) || false);

    // Sync homeType to global context immediately
    React.useEffect(() => {
        setData(prev => ({
            ...prev,
            toDetails: {
                ...prev.toDetails,
                homeType,
            },
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [homeType]);

    const handleContinue = () => {
        setData(prev => ({
            ...prev,
            toDetails: {
                homeType,
                rooms: homeType === 'commercial' ? undefined : rooms,
                sqft: homeType === 'commercial' ? sqft : '',
                stairs: homeType === 'house' || homeType === 'townhouse' ? stairs : undefined,
                floorNumber: homeType !== 'house' && homeType !== 'townhouse' ? floorNumber : undefined,
                elevator: homeType !== 'house' && homeType !== 'townhouse' ? elevator : undefined,
                loadingDock: homeType !== 'house' && homeType !== 'townhouse' ? loadingDock : undefined,
            },
        }));
        onNext();
    };

    return (
        <div className="step-card">
            <h2 style={{ marginBottom: 24 }}>Destination</h2>
            
            <div className="form-group">
                <label>
                    Home Type<span className="required">*</span>
                </label>
                <select 
                    value={homeType} 
                    onChange={e => setHomeType(e.target.value as 'house' | 'townhouse' | 'condo' | 'apartment' | 'commercial')}
                    className="autocomplete-input"
                >
                    {homeTypes.map(ht => (
                        <option key={ht.value} value={ht.value}>
                            {ht.label}
                        </option>
                    ))}
                </select>
            </div>

            {(homeType === 'house' || homeType === 'townhouse') && (
                <GroupedDropdowns>
                    <div className="form-group">
                        <label>Stairs at Dropoff</label>
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
            )}

            {(homeType === 'condo' || homeType === 'apartment') && (
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
                        <label>Elevator at Dropoff</label>
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
            )}

            {homeType !== 'commercial' && (
                <div className="form-group">
                    <label>
                        Total Rooms <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <select 
                        value={rooms} 
                        onChange={e => setRooms(Number(e.target.value))}
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
                        Square Footage <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span>
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
        </div>
    );
};

export default Step3; 