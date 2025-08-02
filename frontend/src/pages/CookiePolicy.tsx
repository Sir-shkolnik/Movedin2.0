import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import { Link } from 'react-router-dom';
import './Page.css';

const CookiePolicy: React.FC = () => (
  <>
    <Header />
    <ThemeToggle />
    <main className="page-container">
      <div className="page-content">
        <article className="page-card">
          <h1>Cookie Policy</h1>
          <p className="page-subtitle">This policy explains how we use cookies and similar technologies.</p>
          <section>
            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device to help websites function and collect information.</p>
          </section>
          <section>
            <h2>How We Use Cookies</h2>
            <ul>
              <li>To remember your preferences</li>
              <li>For analytics and site performance</li>
              <li>For security and fraud prevention</li>
            </ul>
          </section>
          <section>
            <h2>Your Choices</h2>
            <p>You can control cookies through your browser settings. Disabling cookies may affect site functionality.</p>
          </section>
          <section>
            <h2>Contact</h2>
            <p>Questions? Email <a href="mailto:legal@movedin.com">legal@movedin.com</a></p>
          </section>
          <p><Link to="/about-us">Back to About Us</Link></p>
        </article>
      </div>
    </main>
    <Footer onContinue={() => {}} showContinue={false} />
  </>
);

export default CookiePolicy; 