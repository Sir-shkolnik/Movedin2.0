import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import { Link } from 'react-router-dom';
import './Page.css';

const TermsOfService: React.FC = () => (
  <>
    <Header />
    <ThemeToggle />
    <main className="page-container">
      <div className="page-content">
        <article className="page-card">
          <h1>Terms of Service</h1>
          <p className="page-subtitle">Please read these terms carefully before using MovedIn.</p>
          <section>
            <h2>Acceptance of Terms</h2>
            <p>By using our website and services, you agree to these terms and all applicable laws.</p>
          </section>
          <section>
            <h2>Use of Service</h2>
            <ul>
              <li>You must be at least 18 years old to use our services.</li>
              <li>You agree to provide accurate information.</li>
              <li>You are responsible for your account security.</li>
            </ul>
          </section>
          <section>
            <h2>Intellectual Property</h2>
            <p>All content on this site is owned by MovedIn or its licensors. Do not copy or redistribute without permission.</p>
          </section>
          <section>
            <h2>Limitation of Liability</h2>
            <p>MovedIn is not liable for indirect or consequential damages. Our liability is limited to the fullest extent permitted by law.</p>
          </section>
          <section>
            <h2>Changes to Terms</h2>
            <p>We may update these terms. Continued use of the site means you accept the new terms.</p>
          </section>
          <p><Link to="/about-us">Back to About Us</Link></p>
        </article>
      </div>
    </main>
    <Footer onContinue={() => {}} showContinue={false} />
  </>
);

export default TermsOfService; 