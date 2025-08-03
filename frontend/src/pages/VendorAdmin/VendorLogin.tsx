import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorLogin.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface LoginForm {
  username: string;
  password: string;
}

const VendorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://movedin-backend.onrender.com/vendor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store vendor token and info
        localStorage.setItem('vendorToken', data.access_token);
        localStorage.setItem('vendorInfo', JSON.stringify({
          vendor_id: data.vendor_id,
          vendor_name: data.vendor_name,
          permissions: data.permissions
        }));
        
        // Redirect to vendor dashboard
        navigate('/vendor/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-login-page">
      <Header />
      
      <main className="vendor-login-main">
        <div className="vendor-login-container">
          <div className="vendor-login-card">
            <div className="vendor-login-header">
              <div className="vendor-login-logo">
                <img src="/src/assets/icons/movedin-logo.png" alt="MovedIn Logo" />
              </div>
              <h1>Vendor Portal</h1>
              <p>Access your moving business dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="vendor-login-form">
              {error && (
                <div className="vendor-login-error">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="vendor-login-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">🔄</span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="vendor-login-footer">
              <p>Need help? Contact support at support@movedin.ca</p>
              <p>© 2025 MovedIn. All rights reserved.</p>
            </div>
          </div>

          <div className="vendor-login-info">
            <div className="info-card">
              <h2>🚚 Vendor Portal Features</h2>
              <ul>
                <li>📊 View your leads and analytics</li>
                <li>📍 Manage your locations and coverage</li>
                <li>💰 Update pricing and rates</li>
                <li>👥 Manage your team and dispatchers</li>
                <li>📈 Track performance metrics</li>
                <li>🔔 Real-time notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorLogin; 