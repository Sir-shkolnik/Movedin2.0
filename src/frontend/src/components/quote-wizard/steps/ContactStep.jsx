import React, { useState, useEffect } from "react";
import { useForm } from "../../../contexts/FormContext";

function ContactStep() {
  const { data, setData } = useForm();
  
  const [firstName, setFirstName] = useState(data.contact?.firstName || '');
  const [lastName, setLastName] = useState(data.contact?.lastName || '');
  const [phone, setPhone] = useState(data.contact?.phone || '');
  const [email, setEmail] = useState(data.contact?.email || '');
  const [smsUpdates, setSmsUpdates] = useState(data.contact?.smsUpdates || false);
  const [contactMethod, setContactMethod] = useState(data.contact?.contactMethod || 'email');
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setData(prev => ({
      ...prev,
      contact: { 
        firstName, 
        lastName, 
        name: `${firstName} ${lastName}`.trim(), // Keep combined name for compatibility
        phone, 
        email, 
        smsUpdates, 
        contactMethod 
      }
    }));
  }, [firstName, lastName, phone, email, smsUpdates, contactMethod, setData]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    if (value && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number (at least 10 digits)' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const isValid = firstName && lastName && email && validateEmail(email) && phone && validatePhone(phone);

  return (
    <div className="qw-inner-content">
      <h2 className="qw-title">Contact Information</h2>
      <p style={{ 
        textAlign: 'center', 
        color: '#6B7280', 
        fontSize: '14px', 
        marginBottom: '24px',
        maxWidth: 600,
        margin: '0 auto 24px auto'
      }}>
        We'll use this to send you updates and confirm your booking
      </p>
      
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="form-grid">
          <div className="qw-field">
            <label className="qw-label">
              First Name<span className="required">*</span>
              {firstName && <span style={{ color: '#10B981', marginLeft: '8px' }}>✓</span>}
            </label>
            <input 
              className="qw-input" 
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>
          
          <div className="qw-field">
            <label className="qw-label">
              Last Name<span className="required">*</span>
              {lastName && <span style={{ color: '#10B981', marginLeft: '8px' }}>✓</span>}
            </label>
            <input 
              className="qw-input" 
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>

          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">
              Phone Number<span className="required">*</span>
              {phone && validatePhone(phone) && <span style={{ color: '#10B981', marginLeft: '8px' }}>✓</span>}
            </label>
            <input 
              className="qw-input" 
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(416) 555-1234"
            />
            {errors.phone && (
              <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>

          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">
              Email Address<span className="required">*</span>
              {email && validateEmail(email) && <span style={{ color: '#10B981', marginLeft: '8px' }}>✓</span>}
            </label>
            <input 
              className="qw-input" 
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label className="qw-label">Preferred Contact Method</label>
            <select 
              className="qw-input"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="qw-field" style={{ gridColumn: '1 / span 2' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              padding: '12px',
              background: '#F9FAFB',
              borderRadius: '8px',
              border: '1px solid #D0D5DD'
            }}>
              <input 
                type="checkbox" 
                checked={smsUpdates}
                onChange={(e) => setSmsUpdates(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>
                  📱 Get updates via SMS
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  Receive real-time updates about your move
                </div>
              </div>
            </label>
          </div>
        </div>

        {isValid && (
          <div style={{ 
            marginTop: '24px', 
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
              ✓ All required fields completed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactStep;


