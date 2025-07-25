import React, { useState } from 'react';

export default function ContactForm() {
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
        alert('Email sent successfully!');
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        alert(data.error || 'Failed to send email.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: '2rem auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: 6,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Contact Us</h2>

      <label>
        Name*:<br />
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.7rem' }}
        />
      </label>

      <label>
        Email*:<br />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.7rem' }}
        />
      </label>

      <label>
        Phone:<br />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.7rem' }}
        />
      </label>

      <label>
        Subject*:<br />
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.7rem' }}
        />
      </label>

      <label>
        Message*:<br />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </label>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.7rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Send Message
      </button>
    </form>
  );
}
