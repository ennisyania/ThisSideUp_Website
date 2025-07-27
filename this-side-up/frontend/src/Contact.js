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
      const res = await fetch(`https://thissideup-website.onrender.com/api/contact`, {
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

    <div className="contact-container">
      <div className="contact-left">
        <h1><span>Let's get</span><br /><span>in touch</span></h1>
        <h2>Don't be afraid to<br />say hello to us!</h2>
        <div className="contact-info">
          <p>Phone<br /><strong>+65 9220 0054</strong></p>
          <p>Email<br /><strong>Hello@thissideup.com</strong></p>
        </div>
      </div>

      <div className="contact-right">
        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Contact</h2>

          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} />

          <label>Subject</label>
          <input type="text" name="subject" value={form.subject} onChange={handleChange} required />

          <label>Tell us about what you're interested in!</label>
          <textarea name="message" value={form.message} onChange={handleChange} required rows={5} />

          <button type="submit">Send to us</button>

        </form>
      </div>
    </div>
  );
}
