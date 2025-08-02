import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import { Link } from 'react-router-dom';
import './Page.css';

const Accessibility: React.FC = () => (
  <>
    <Header />
    <ThemeToggle />
    <main className="page-container">
      <div className="page-content">
        <article className="page-card">
          <h1>Accessibility Statement</h1>
          <p className="page-subtitle">MovedIn is committed to digital accessibility for all users.</p>
          <section>
            <h2>Our Commitment</h2>
            <p>We strive to ensure our website is accessible to people with disabilities and follows WCAG 2.1 guidelines.</p>
          </section>
          <section>
            <h2>Ongoing Efforts</h2>
            <ul>
              <li>Regular accessibility audits</li>
              <li>Continuous improvements based on user feedback</li>
              <li>Accessible design and navigation</li>
            </ul>
          </section>
          <section>
            <h2>Contact Us</h2>
            <p>If you encounter accessibility barriers, please email <a href="mailto:accessibility@movedin.com">accessibility@movedin.com</a> and we will address your concerns promptly.</p>
          </section>
          <p><Link to="/about-us">Back to About Us</Link></p>
        </article>
      </div>
    </main>
    <Footer onContinue={() => {}} showContinue={false} />
  </>
);

export default Accessibility; 