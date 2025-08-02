import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import { Link } from 'react-router-dom';
import './Page.css';

const PrivacyPolicy: React.FC = () => (
  <>
    <Header />
    <ThemeToggle />
    <main className="page-container">
      <div className="page-content">
        <article className="page-card">
          <h1>Privacy Policy</h1>
          <p className="page-subtitle">Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
          <section>
            <h2>Information We Collect</h2>
            <ul>
              <li>Personal information you provide (name, email, address, etc.)</li>
              <li>Usage data (pages visited, actions taken, etc.)</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </section>
          <section>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To provide and improve our services</li>
              <li>To communicate with you about your move</li>
              <li>For analytics and security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>
          <section>
            <h2>Your Rights</h2>
            <ul>
              <li>Access, correct, or delete your data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
            <p>Contact us at <a href="mailto:legal@movedin.com">legal@movedin.com</a> for any privacy requests.</p>
          </section>
          <section>
            <h2>Cookies</h2>
            <p>We use cookies to enhance your experience. See our <Link to="/cookie-policy">Cookie Policy</Link> for details.</p>
          </section>
          <section>
            <h2>Changes to This Policy</h2>
            <p>We may update this policy. Changes will be posted on this page.</p>
          </section>
          <p><Link to="/about-us">Back to About Us</Link></p>
        </article>
      </div>
    </main>
    <Footer onContinue={() => {}} showContinue={false} />
  </>
);

export default PrivacyPolicy; 