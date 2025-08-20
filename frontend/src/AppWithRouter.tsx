import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import TipsAndGuides from './pages/TipsAndGuides';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Accessibility from './pages/Accessibility';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VendorManagement from './pages/Admin/VendorManagement';
import LeadManagement from './pages/Admin/LeadManagement';
import SystemMonitoring from './pages/Admin/SystemMonitoring';
import Analytics from './pages/Admin/Analytics';
import VendorLocations from './pages/Admin/VendorLocations';
import Step7 from './components/steps/Step7';
import VendorLogin from './pages/VendorAdmin/VendorLogin';
import VendorDashboard from './pages/VendorAdmin/VendorDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function AppWithRouter() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/vendors" element={<VendorManagement />} />
            <Route path="/admin/locations" element={<VendorLocations />} />
            <Route path="/admin/leads" element={<LeadManagement />} />
            <Route path="/admin/monitoring" element={<SystemMonitoring />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/tips-guides" element={<TipsAndGuides />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default AppWithRouter; // Frontend deployment trigger - Sun Aug  3 17:44:30 EDT 2025
// Frontend deployment trigger - Sun Aug  3 17:52:51 EDT 2025
