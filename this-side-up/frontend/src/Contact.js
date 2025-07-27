import React, { useState } from 'react';
import './Contact.css';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Message sent!');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        alert(data.error || 'Failed to send.');
      }
    } catch {
      alert('Network error.');
    }
  };

  return (
    <div className="contact-page-container">
      {/* LEFT SIDE */}
      <div
        className="contact-left-background"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/FAQside.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
        }}
      >
        <div className="contact-title-overlay">
          <h1>Let’s get in touch</h1>
          <p className="contact-subtitle">Don’t be afraid to say hello to us!</p>
          <div className="contact-info">
            <div className="contact-info-item">
              <span className="info-label">Phone</span>
              <a className="info-value" href="tel:+6592200054">+65 9220 0054</a>
            </div>
            <div className="contact-info-item">
              <span className="info-label">Email</span>
              <a className="info-value" href="mailto:Hello@thissideup.com">Hello@thissideup.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="contact-form-column">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Contact</h2>
          <label>
            Name*
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email*
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Subject*
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tell us about what you’re interested in!*
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="contact-submit">
            Send to us
          </button>
        </form>
      </div>
    </div>
  );
}
