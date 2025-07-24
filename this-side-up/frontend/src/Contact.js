// src/Contact.js
import React from 'react';
import './Contact.css';

export default function Contact() {
  const faqSideImageUrl = `${process.env.PUBLIC_URL}/images/FAQside.png`;
  
  return (
    <div className="contact-page-container">
      {/* LEFT PANEL */}
      <div
        className="contact-left-background"
        style={{
          backgroundImage: `url(${faqSideImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Skew overlay stays in CSS */}
      </div>

      {/* TITLE & INFO */}
      <div className="contact-title-overlay">
        <h1>Let’s get in touch</h1>
        <p className="contact-subtitle">
          Don’t be afraid to say hello to us!
        </p>
        <div className="contact-info">
          <div className="contact-info-item">
            <span className="info-label">Phone</span>
            <a href="tel:+6592200054" className="info-value">
              +65 9220 0054
            </a>
          </div>
          <div className="contact-info-item">
            <span className="info-label">Email</span>
            <a href="mailto:hello@thissideup.com" className="info-value">
              hello@thissideup.com
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div className="contact-form-column">
        <form className="contact-form">
          <label>
            Name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Phone
            <input type="tel" placeholder="+65 1234 5678" />
          </label>
          <label>
            Subject
            <input type="text" placeholder="Subject" />
          </label>
          <label>
            Tell us what you’re interested in!
            <textarea placeholder="Your message…" />
          </label>
          <button type="submit" className="contact-submit">
            Send to us
          </button>
        </form>
      </div>
    </div>
  );
}
