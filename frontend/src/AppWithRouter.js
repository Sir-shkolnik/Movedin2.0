import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import AboutUs from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import TipsAndGuides from './pages/TipsAndGuides';
import PaymentRedirect from './pages/PaymentRedirect';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VendorManagement from './pages/Admin/VendorManagement';
import LeadManagement from './pages/Admin/LeadManagement';
import SystemMonitoring from './pages/Admin/SystemMonitoring';
import Analytics from './pages/Admin/Analytics';
import VendorLocations from './pages/Admin/VendorLocations';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header/Header';
import './App.css';

function AppWithRouter() {
    return (_jsx(HelmetProvider, {
        children: _jsx(ThemeProvider, {
            children: _jsx(Router, {
                children: _jsxs("div", {
                    className: "app-with-router",
                    children: [
                        _jsx(Header, {}),
                        _jsxs(Routes, {
                            children: [
                                _jsx(Route, { path: "/", element: _jsx(App, {}) }),
                                _jsx(Route, { path: "/about-us", element: _jsx(AboutUs, {}) }),
                                _jsx(Route, { path: "/how-it-works", element: _jsx(HowItWorks, {}) }),
                                _jsx(Route, { path: "/tips-guides", element: _jsx(TipsAndGuides, {}) }),
                                _jsx(Route, { path: "/payment-redirect", element: _jsx(PaymentRedirect, {}) }),
                                _jsx(Route, { path: "/admin", element: _jsx(AdminDashboard, {}) }),
                                _jsx(Route, { path: "/admin/vendors", element: _jsx(VendorManagement, {}) }),
                                _jsx(Route, { path: "/admin/locations", element: _jsx(VendorLocations, {}) }),
                                _jsx(Route, { path: "/admin/leads", element: _jsx(LeadManagement, {}) }),
                                _jsx(Route, { path: "/admin/monitoring", element: _jsx(SystemMonitoring, {}) }),
                                _jsx(Route, { path: "/admin/analytics", element: _jsx(Analytics, {}) })
                            ]
                        })
                    ]
                })
            })
        })
    }));
}

export default AppWithRouter;