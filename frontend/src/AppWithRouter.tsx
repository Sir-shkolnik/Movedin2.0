import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import TipsAndGuides from './pages/TipsAndGuides';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VendorManagement from './pages/Admin/VendorManagement';
import LeadManagement from './pages/Admin/LeadManagement';
import SystemMonitoring from './pages/Admin/SystemMonitoring';
import Analytics from './pages/Admin/Analytics';
import VendorLocations from './pages/Admin/VendorLocations';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function AppWithRouter() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/tips-guides" element={<TipsAndGuides />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/vendors" element={<VendorManagement />} />
            <Route path="/admin/locations" element={<VendorLocations />} />
            <Route path="/admin/leads" element={<LeadManagement />} />
            <Route path="/admin/monitoring" element={<SystemMonitoring />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default AppWithRouter; 