import React, { useState, useEffect } from 'react';
import './Step.css';
import './Step1.mobile.css';
import { useForm } from '../../contexts/FormContext';
import AddressAutocomplete from '../AddressAutocomplete/AddressAutocomplete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import en from 'react-datepicker/locale/en-US';
registerLocale('en', en);

interface Step1Props {
    onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
    const { data, setData } = useForm();
    const [from, setFrom] = useState(data.from);
    const [to, setTo] = useState(data.to);
    const [date, setDate] = useState(data.date ? new Date(data.date) : null);
    const [time, setTime] = useState(data.time);

    // Sync local state to global form context on change
    useEffect(() => {
        setData(prev => ({
            ...prev,
            from,
            to,
            date: date ? date.toISOString().split('T')[0] : '',
            time
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [from, to, date, time]);

    const handleContinue = () => {
        onNext();
    };

    return (
        <div className="step-card">
            <h2>Move Details</h2>
            
            <div className="form-group">
                <label>
                    From<span className="required">*</span>
                </label>
                <AddressAutocomplete 
                    value={from} 
                    onChange={setFrom} 
                    placeholder="Enter address or ZIP code" 
                />
            </div>

            <div className="form-group">
                <label>
                    To<span className="required">*</span>
                </label>
                <AddressAutocomplete 
                    value={to} 
                    onChange={setTo} 
                    placeholder="Enter new home address" 
                />
            </div>

            <div className="form-group-inline">
                <div style={{ flex: 1 }}>
                    <label>
                        Date<span className="required">*</span>
                    </label>
                        <DatePicker
                            selected={date}
                            onChange={setDate}
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            placeholderText="Select move date"
                            className="date-picker-input"
                            wrapperClassName="date-picker-wrapper"
                            locale="en"
                        />
                </div>

                <div style={{ flex: 1 }}>
                    <label>
                        Time<span className="required">*</span>
                    </label>
                    <select
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        className="date-picker-input"
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '16px',
                            background: '#fafbfc',
                            outline: 'none',
                            color: '#222',
                            height: '42px',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="">Select time</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Step1; 