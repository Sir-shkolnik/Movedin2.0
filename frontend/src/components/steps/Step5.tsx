import React, { useState, useEffect } from 'react';
import './Step.css';
import { useForm } from '../../contexts/FormContext';

interface Step5Props {
    onNext: () => void;
    onBack: () => void;
}

interface ContactInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

const Step5: React.FC<Step5Props> = ({ onNext, onBack }) => {
    const { data, setData } = useForm();
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        firstName: data.contact?.firstName || '',
        lastName: data.contact?.lastName || '',
        email: data.contact?.email || '',
        phone: data.contact?.phone || ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Save contact info to context whenever it changes
    useEffect(() => {
        setData(prev => ({
            ...prev,
            contact: contactInfo
        }));
    }, [contactInfo, setData]);

    const handleContactChange = (field: keyof ContactInfo, value: string) => {
        setContactInfo(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!contactInfo.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!contactInfo.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!contactInfo.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactInfo.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }
        if (!contactInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (contactInfo.phone.length < 10) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Payment functionality moved to Step 6

    const handleContinue = () => {
        if (validateForm()) {
            // Update contact info in context
            setData(prev => ({
                ...prev,
                contact: contactInfo
            }));
            onNext();
        }
    };

    return (
        <div className="step-card">
            <h2 style={{ marginBottom: 24 }}>Contact Information</h2>
            
            <div className="form-group">
                <p style={{ marginBottom: 24, color: '#666', fontSize: '16px' }}>
                    Please provide your contact information so we can send you a detailed quote and confirm your booking.
                </p>
                
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
                        <strong style={{ color: '#856404' }}>Important: Estimate Notice</strong>
                    </div>
                    <p style={{ color: '#856404', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>
                        The prices shown are <strong>estimates only</strong>. Final pricing will be determined based on actual moving time, 
                        any additional services required, and final vendor assessment on the day of your move.
                    </p>
                </div>
            </div>

            <div className="form-group">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <label htmlFor="firstName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={contactInfo.firstName}
                            onChange={(e) => handleContactChange('firstName', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                border: errors.firstName ? '2px solid #dc3545' : '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s'
                            }}
                            placeholder="Enter your first name"
                            required
                        />
                        {errors.firstName && (
                            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                                {errors.firstName}
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={contactInfo.lastName}
                            onChange={(e) => handleContactChange('lastName', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                border: errors.lastName ? '2px solid #dc3545' : '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.3s'
                            }}
                            placeholder="Enter your last name"
                            required
                        />
                        {errors.lastName && (
                            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                                {errors.lastName}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={contactInfo.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px',
                            border: errors.email ? '2px solid #dc3545' : '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s'
                        }}
                        placeholder="Enter your email address"
                        required
                    />
                    {errors.email && (
                        <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                            {errors.email}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={contactInfo.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px',
                            border: errors.phone ? '2px solid #dc3545' : '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '16px',
                            transition: 'border-color 0.3s'
                        }}
                        placeholder="Enter your phone number"
                        required
                    />
                    {errors.phone && (
                        <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                            {errors.phone}
                        </div>
                    )}
                </div>

                {/* Payment section removed - now handled in Step 6 */}
            </div>
        </div>
    );
};

export default Step5; 