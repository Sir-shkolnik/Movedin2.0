import React, { useState, useEffect } from "react";
import { useForm } from "../../../contexts/FormContext";

function SummaryStep() {
  const { data, setData } = useForm();
  const [contactInfo, setContactInfo] = useState({
    firstName: data.contact?.firstName || '',
    lastName: data.contact?.lastName || '',
    email: data.contact?.email || '',
    phone: data.contact?.phone || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setData(prev => ({
      ...prev,
      contact: contactInfo
    }));
  }, [contactInfo, setData]);

  const handleChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!contactInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!contactInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!contactInfo.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s\-\(\)]+$/.test(contactInfo.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="qw-inner-content">
      <h2 className="qw-title">Contact Information</h2>
      
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="form-grid">
          <div className="qw-field">
            <label className="qw-label">
              First Name<span className="required">*</span>
            </label>
            <input 
              className="qw-input" 
              type="text"
              value={contactInfo.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="John"
            />
            {errors.firstName && (
              <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="qw-field">
            <label className="qw-label">
              Last Name<span className="required">*</span>
            </label>
            <input 
              className="qw-input" 
              type="text"
              value={contactInfo.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
            />
            {errors.lastName && (
              <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.lastName}
              </span>
            )}
          </div>

          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">
              Email<span className="required">*</span>
            </label>
            <input 
              className="qw-input" 
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
            />
            {errors.email && (
              <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">
              Phone<span className="required">*</span>
            </label>
            <input 
              className="qw-input" 
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="416-555-1234"
            />
            {errors.phone && (
              <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryStep;


