import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
// Guide pages
import PlanningPhase from './pages/guides/PlanningPhase';
import PackingPhase from './pages/guides/PackingPhase';
import MovingDay from './pages/guides/MovingDay';
import SettlingIn from './pages/guides/SettlingIn';
import SpecialSituations from './pages/guides/SpecialSituations';
import CostSavingTips from './pages/guides/CostSavingTips';
// Article pages
import AddressChangeChecklist from './pages/articles/AddressChangeChecklist';
import TorontoNeighborhoodGuide from './pages/articles/TorontoNeighborhoodGuide';
import PreMoveDecluttering from './pages/articles/PreMoveDecluttering';
import StressFreeMove from './pages/articles/StressFreeMove';
import ProfessionalPackingServices from './pages/articles/ProfessionalPackingServices';
import TipsForMovingHome from './pages/articles/TipsForMovingHome';
import MovingWithPets from './pages/articles/MovingWithPets';
import MovingStressFreeToronto from './pages/articles/MovingStressFreeToronto';
import WinterMovingTips from './pages/articles/WinterMovingTips';
import EssentialMovingChecklist from './pages/articles/EssentialMovingChecklist';
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
            {/* Guide pages */}
            <Route path="/guides/planning-phase" element={<PlanningPhase />} />
            <Route path="/guides/packing-phase" element={<PackingPhase />} />
            <Route path="/guides/moving-day" element={<MovingDay />} />
            <Route path="/guides/settling-in" element={<SettlingIn />} />
            <Route path="/guides/special-situations" element={<SpecialSituations />} />
            <Route path="/guides/cost-saving-tips" element={<CostSavingTips />} />
            {/* Article pages */}
            <Route path="/articles/address-change-checklist" element={<AddressChangeChecklist />} />
            <Route path="/articles/toronto-neighborhood-guide" element={<TorontoNeighborhoodGuide />} />
            <Route path="/articles/pre-move-decluttering" element={<PreMoveDecluttering />} />
            <Route path="/articles/stress-free-move" element={<StressFreeMove />} />
            <Route path="/articles/professional-packing-services" element={<ProfessionalPackingServices />} />
            <Route path="/articles/tips-for-moving-home" element={<TipsForMovingHome />} />
            <Route path="/articles/moving-with-pets" element={<MovingWithPets />} />
            <Route path="/articles/moving-stress-free-toronto" element={<MovingStressFreeToronto />} />
            <Route path="/articles/winter-moving-tips" element={<WinterMovingTips />} />
            <Route path="/articles/essential-moving-checklist" element={<EssentialMovingChecklist />} />
            {/* Root route - must be last so specific routes can match first */}
            <Route path="/" element={<App />} />
            {/* Catch-all for any unmatched routes - must be last */}
            <Route path="*" element={<App />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default AppWithRouter; // Frontend deployment trigger - Sun Aug  3 17:44:30 EDT 2025
// Frontend deployment trigger - Sun Aug  3 17:52:51 EDT 2025
