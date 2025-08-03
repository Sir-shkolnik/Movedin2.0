import React, { useState, useEffect } from 'react';
import './VendorAdmin.css';

interface VendorProfileData {
  id: number;
  user_id: number;
  vendor_name: string;
  vendor_id: string;
  company_name: string;
  business_address: string;
  phone_number: string;
  email: string;
  full_name: string;
  username: string;
  can_manage_locations: boolean;
  can_manage_pricing: boolean;
  can_view_leads: boolean;
  can_manage_profile: boolean;
  can_view_analytics: boolean;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  last_login: string | null;
}

interface ProfileUpdateForm {
  company_name: string;
  business_address: string;
  phone_number: string;
  email: string;
  full_name: string;
}

interface PasswordChangeForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const VendorProfile: React.FC = () => {
  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileUpdateForm>({
    company_name: '',
    business_address: '',
    phone_number: '',
    email: '',
    full_name: ''
  });
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'permissions'>('profile');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('vendorToken');
      if (!token) return;

      const response = await fetch('https://movedin-backend.onrender.com/vendor/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          company_name: data.company_name,
          business_address: data.business_address,
          phone_number: data.phone_number,
          email: data.email,
          full_name: data.full_name
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Network error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('vendorToken');
      if (!token) return;

      const response = await fetch('https://movedin-backend.onrender.com/vendor/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        await loadProfile(); // Reload profile data
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('vendorToken');
      if (!token) return;

      const response = await fetch('https://movedin-backend.onrender.com/vendor/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        }),
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error changing password');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  if (loading) {
    return (
      <div className="vendor-profile-page">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="vendor-profile-page">
        <div className="error-container">
          <span>⚠️</span>
          <p>Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-profile-page">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your vendor account information and preferences</p>
      </div>

      {error && (
        <div className="profile-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="profile-success">
          <span>✅</span>
          {success}
        </div>
      )}

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          📝 Profile Information
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          🔒 Change Password
        </button>
        <button
          className={`tab-button ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          🔐 Permissions
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company_name">Company Name</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={profileForm.company_name}
                    onChange={handleInputChange}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleInputChange}
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleInputChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={profileForm.phone_number}
                  onChange={handleInputChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="business_address">Business Address</label>
                <textarea
                  id="business_address"
                  name="business_address"
                  value={profileForm.business_address}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, business_address: e.target.value }))}
                  required
                  disabled={saving}
                  rows={3}
                />
              </div>

              <button type="submit" className="save-button" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="profile-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="current_password">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordInputChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new_password">New Password</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordInputChange}
                    required
                    disabled={saving}
                    minLength={8}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm_password">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordInputChange}
                    required
                    disabled={saving}
                    minLength={8}
                  />
                </div>
              </div>

              <button type="submit" className="save-button" disabled={saving}>
                {saving ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="profile-section">
            <h2>Account Permissions</h2>
            <div className="permissions-grid">
              <div className="permission-item">
                <div className="permission-icon">📍</div>
                <div className="permission-content">
                  <h3>Manage Locations</h3>
                  <p>Add, edit, and manage your service locations</p>
                  <span className={`permission-status ${profile.can_manage_locations ? 'enabled' : 'disabled'}`}>
                    {profile.can_manage_locations ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="permission-item">
                <div className="permission-icon">💰</div>
                <div className="permission-content">
                  <h3>Manage Pricing</h3>
                  <p>Update your rates and pricing rules</p>
                  <span className={`permission-status ${profile.can_manage_pricing ? 'enabled' : 'disabled'}`}>
                    {profile.can_manage_pricing ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="permission-item">
                <div className="permission-icon">📋</div>
                <div className="permission-content">
                  <h3>View Leads</h3>
                  <p>Access and manage customer leads</p>
                  <span className={`permission-status ${profile.can_view_leads ? 'enabled' : 'disabled'}`}>
                    {profile.can_view_leads ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="permission-item">
                <div className="permission-icon">📊</div>
                <div className="permission-content">
                  <h3>View Analytics</h3>
                  <p>Access performance metrics and reports</p>
                  <span className={`permission-status ${profile.can_view_analytics ? 'enabled' : 'disabled'}`}>
                    {profile.can_view_analytics ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="account-status">
              <h3>Account Status</h3>
              <div className="status-items">
                <div className="status-item">
                  <span className="status-label">Verification:</span>
                  <span className={`status-value ${profile.is_verified ? 'verified' : 'unverified'}`}>
                    {profile.is_verified ? '✅ Verified' : '❌ Unverified'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Status:</span>
                  <span className={`status-value ${profile.is_active ? 'active' : 'inactive'}`}>
                    {profile.is_active ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Member Since:</span>
                  <span className="status-value">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Login:</span>
                  <span className="status-value">
                    {profile.last_login ? new Date(profile.last_login).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile; 