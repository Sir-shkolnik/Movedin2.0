import React, { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("root element not found");

const root = createRoot(rootElement);
root.render(
  <Router>
    <div style={{ display: "block", width: "100%", maxWidth: "1440px", margin: "0 auto" }} data-ignore="used only for top most containter width">
      <Routes>
        <Route path="/" element={<Layout><MainPageContent /></Layout>} />
        <Route path="/blogs" element={<Layout><BlogsContent /></Layout>} />
        <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorksContent /></Layout>} />
        <Route path="/about" element={<Layout><AboutUsContent /></Layout>} />
        <Route path="/quote" element={<Layout><WizardContainer><DateAddressStep /></WizardContainer></Layout>} />
        <Route path="/quote/date" element={<Layout><WizardContainer><DateTimeStep /></WizardContainer></Layout>} />
        <Route path="/quote/date-address" element={<Layout><WizardContainer><DateAddressStep /></WizardContainer></Layout>} />
        <Route path="/quote/from-details" element={<Layout><WizardContainer><FromDetailsStep /></WizardContainer></Layout>} />
        <Route path="/quote/to-details" element={<Layout><WizardContainer><ToDetailsStep /></WizardContainer></Layout>} />
        <Route path="/quote/service" element={<Layout><WizardContainer><ServiceStep /></WizardContainer></Layout>} />
        <Route path="/quote/contact" element={<Layout><WizardContainer><ContactStep /></WizardContainer></Layout>} />
        <Route path="/quote/review" element={<Layout><WizardContainer><ReviewStep /></WizardContainer></Layout>} />
        <Route path="/quote/vendors" element={<Layout><WizardContainer><VendorsStep /></WizardContainer></Layout>} />
        <Route path="/quote/summary" element={<Layout><WizardContainer><SummaryStep /></WizardContainer></Layout>} />
        <Route path="/quote/payment" element={<Layout><WizardContainer><PaymentStep /></WizardContainer></Layout>} />
      </Routes>
    </div>
  </Router>
);
