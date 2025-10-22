import React, { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import "./index.css";
import Layout from "./components/Layout";
import MainPageContent from "./components/MainPageContent";
import BlogsContent from "./components/BlogsContent";
import BlogPost from "./components/BlogPost";
import HowItWorksContent from "./components/HowItWorksContent";
import AboutUsContent from "./components/AboutUsContent";
import WizardContainer from "./components/quote-wizard/WizardContainer";
import LocationStep from "./components/quote-wizard/steps/LocationStep";
import DateTimeStep from "./components/quote-wizard/steps/DateTimeStep";
import DateAddressStep from "./components/quote-wizard/steps/DateAddressStep";
import FromDetailsStep from "./components/quote-wizard/steps/FromDetailsStep";
import ToDetailsStep from "./components/quote-wizard/steps/ToDetailsStep";
import ServiceStep from "./components/quote-wizard/steps/ServiceStep";
import ContactStep from "./components/quote-wizard/steps/ContactStep";
import ReviewStep from "./components/quote-wizard/steps/ReviewStep";
import VendorsStep from "./components/quote-wizard/steps/VendorsStep";
import SummaryStep from "./components/quote-wizard/steps/SummaryStep";
import PaymentStep from "./components/quote-wizard/steps/PaymentStep";
import ThankYouStep from "./components/quote-wizard/steps/ThankYouStep";
import { FormProvider } from "./contexts/FormContext";

// New Blog Articles
import BlogArticle_BestNeighbourhoodsGTA from "./components/BlogArticle_BestNeighbourhoodsGTA";

// Admin Dashboard
import AdminDashboard from "./components/AdminDashboard";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("root element not found");

const root = createRoot(rootElement);
root.render(
  <HelmetProvider>
    <Router>
      <div style={{ display: "block", width: "100%", maxWidth: "1440px", margin: "0 auto" }} data-ignore="used only for top most containter width">
        <Routes>
          <Route path="/" element={<Layout><MainPageContent /></Layout>} />
          <Route path="/blogs" element={<Layout><BlogsContent /></Layout>} />
          <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />
          
          {/* New Blog Articles with Full SEO */}
          <Route path="/blog/best-neighbourhoods-families-gta" element={<Layout><BlogArticle_BestNeighbourhoodsGTA /></Layout>} />
          
          <Route path="/how-it-works" element={<Layout><HowItWorksContent /></Layout>} />
          <Route path="/about" element={<Layout><AboutUsContent /></Layout>} />
        <Route path="/quote" element={<Layout><FormProvider><WizardContainer><DateAddressStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/date" element={<Layout><FormProvider><WizardContainer><DateTimeStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/date-address" element={<Layout><FormProvider><WizardContainer><DateAddressStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/from-details" element={<Layout><FormProvider><WizardContainer><FromDetailsStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/to-details" element={<Layout><FormProvider><WizardContainer><ToDetailsStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/service" element={<Layout><FormProvider><WizardContainer><ServiceStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/contact" element={<Layout><FormProvider><WizardContainer><ContactStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/vendors" element={<Layout><FormProvider><WizardContainer><VendorsStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/summary" element={<Layout><FormProvider><WizardContainer><SummaryStep /></WizardContainer></FormProvider></Layout>} />
          <Route path="/quote/payment" element={<Layout><FormProvider><WizardContainer><PaymentStep /></WizardContainer></FormProvider></Layout>} />
        <Route path="/quote/thank-you" element={<Layout><FormProvider><ThankYouStep /></FormProvider></Layout>} />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard-2025" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  </HelmetProvider>
);
