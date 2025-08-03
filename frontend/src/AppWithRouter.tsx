import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import TipsAndGuides from './pages/TipsAndGuides';
import Login from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VendorManagement from './pages/Admin/VendorManagement';
import LeadManagement from './pages/Admin/LeadManagement';
import SystemMonitoring from './pages/Admin/SystemMonitoring';
import Analytics from './pages/Admin/Analytics';
import VendorLocations from './pages/Admin/VendorLocations';
import Step7 from './components/steps/Step7';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppWithRouter() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/tips-guides" element={<TipsAndGuides />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/vendors" element={
                <ProtectedRoute>
                  <VendorManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/locations" element={
                <ProtectedRoute>
                  <VendorLocations />
                </ProtectedRoute>
              } />
              <Route path="/admin/leads" element={
                <ProtectedRoute>
                  <LeadManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/monitoring" element={
                <ProtectedRoute>
                  <SystemMonitoring />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              
              {/* Public App Routes */}
              <Route path="/*" element={<App />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default AppWithRouter; 