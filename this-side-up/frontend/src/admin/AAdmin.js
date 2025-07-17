// src/admin/ASettings.js
import React, { useState, useEffect } from 'react';
import './AAdmin.css';

export default function ASettings() {
  const [active, setActive] = useState('General');

  return (
    <div className="admin-page settings-page">
      <h1 className="page-title">⚙️ Site Settings</h1>

      <nav className="settings-tabs">
        {['General','Branding','Homepage','Emails'].map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={active===tab ? 'tab-active' : ''}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="settings-content">
        {active==='General'  && <GeneralForm />}
        {active==='Branding' && <BrandingForm />}
        {active==='Homepage' && <HomepageForm />}
        {active==='Emails'   && <EmailTemplatesForm />}
      </div>
    </div>
  );
}

// --- GeneralForm ---
function GeneralForm() {
  const [siteName, setSiteName] = useState('');
  const [tagline,  setTagline]  = useState('');
  const [currency, setCurrency] = useState('USD');

  // load saved
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('settings.general')) || {};
    setSiteName(saved.siteName || 'This Side Up');
    setTagline(saved.tagline || 'Ride the wave');
    setCurrency(saved.currency || 'USD');
  }, []);

  // save handler
  function handleSave() {
    localStorage.setItem('settings.general',
      JSON.stringify({ siteName, tagline, currency })
    );
    alert('General settings saved');
  }

  return (
    <section className="settings-section">
      <label>Site Name
        <input
          value={siteName}
          onChange={e => setSiteName(e.target.value)}
        />
      </label>
      <label>Tagline
        <input
          value={tagline}
          onChange={e => setTagline(e.target.value)}
        />
      </label>
      <label>Currency
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        >
          <option>USD</option>
          <option>EUR</option>
          <option>SGD</option>
        </select>
      </label>
      <button
        className="btn purple-btn"
        onClick={handleSave}
      >
        Save General
      </button>
    </section>
  );
}

// --- BrandingForm ---
function BrandingForm() {
  const [logoPreview, setLogoPreview]       = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  // load saved
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('settings.branding')) || {};
    if (saved.logo)    setLogoPreview(saved.logo);
    if (saved.favicon) setFaviconPreview(saved.favicon);
  }, []);

  // when user picks a file, read as base64
  function handleFileChange(e, setter) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result);
    reader.readAsDataURL(file);
  }

  // save handler
  function handleSave() {
    localStorage.setItem('settings.branding',
      JSON.stringify({ logo: logoPreview, favicon: faviconPreview })
    );
    alert('Branding settings saved');
  }

  return (
    <section className="settings-section">
      <label>Logo Upload
        <input
          type="file"
          accept="image/*"
          onChange={e => handleFileChange(e, setLogoPreview)}
        />
      </label>
      {logoPreview && (
        <img
          src={logoPreview}
          alt="Logo Preview"
          style={{ maxHeight: '80px', margin: '0.5rem 0' }}
        />
      )}

      <label>Favicon Upload
        <input
          type="file"
          accept="image/*"
          onChange={e => handleFileChange(e, setFaviconPreview)}
        />
      </label>
      {faviconPreview && (
        <img
          src={faviconPreview}
          alt="Favicon Preview"
          style={{ maxHeight: '40px', margin: '0.5rem 0' }}
        />
      )}

      <button
        className="btn purple-btn"
        onClick={handleSave}
      >
        Save Branding
      </button>
    </section>
  );
}

// --- HomepageForm ---
function HomepageForm() {
  const [banners, setBanners]           = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [showAnn, setShowAnn]          = useState(true);

  // load saved
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('settings.homepage')) || {};
    setBanners(saved.banners || [{ id: Date.now(), text:'', link:'' }]);
    setAnnouncement(saved.announcement || '');
    setShowAnn(saved.showAnn ?? true);
  }, []);

  function addBanner() {
    setBanners(bs => [...bs, { id: Date.now(), text:'', link:'' }]);
  }
  function updateBanner(id, field, val) {
    setBanners(bs => bs.map(b => b.id===id ? { ...b, [field]: val } : b));
  }
  function removeBanner(id) {
    setBanners(bs => bs.filter(b => b.id!==id));
  }

  function handleSave() {
    localStorage.setItem('settings.homepage',
      JSON.stringify({ banners, announcement, showAnn })
    );
    alert('Homepage settings saved');
  }

  return (
    <section className="settings-section">
      <h3>Banner Carousel</h3>
      {banners.map(b => (
        <div key={b.id} className="banner-row">
          <input
            placeholder="Text"
            value={b.text}
            onChange={e => updateBanner(b.id, 'text', e.target.value)}
          />
          <input
            placeholder="Link"
            value={b.link}
            onChange={e => updateBanner(b.id, 'link', e.target.value)}
          />
          <button onClick={() => removeBanner(b.id)}>Remove</button>
        </div>
      ))}
      <button
        className="btn purple-outline-btn"
        onClick={addBanner}
      >
        Add Banner
      </button>

      <h3 className="mt-4">Announcement Bar</h3>
      <label className="inline-label">
        <input
          type="checkbox"
          checked={showAnn}
          onChange={e => setShowAnn(e.target.checked)}
        />
        Enable Announcement
      </label>
      {showAnn && (
        <textarea
          rows={2}
          value={announcement}
          onChange={e => setAnnouncement(e.target.value)}
          className="full-width"
        />
      )}

      <button
        className="btn purple-btn"
        onClick={handleSave}
      >
        Save Homepage
      </button>
    </section>
  );
}

// --- EmailTemplatesForm ---
function EmailTemplatesForm() {
  const [templates, setTemplates] = useState({
    confirmation: '',
    shipped: ''
  });
  const [testTo, setTestTo] = useState('');

  // load saved
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('settings.emails')) || {};
    setTemplates(saved.templates || {
      confirmation: 'Thanks for your order {{orderId}}!',
      shipped:      'Your order {{orderId}} has shipped.'
    });
  }, []);

  function updateTemplate(key, val) {
    setTemplates(ts => ({ ...ts, [key]: val }));
  }

  function handleSave() {
    localStorage.setItem('settings.emails',
      JSON.stringify({ templates })
    );
    alert('Email templates saved');
  }

  return (
    <section className="settings-section">
      <h3>Order Confirmation</h3>
      <textarea
        rows={3}
        value={templates.confirmation}
        onChange={e => updateTemplate('confirmation', e.target.value)}
      />

      <h3>Shipping Update</h3>
      <textarea
        rows={3}
        value={templates.shipped}
        onChange={e => updateTemplate('shipped', e.target.value)}
      />

      <label className="mt-3">
        Test Email To:
        <input
          type="email"
          value={testTo}
          onChange={e => setTestTo(e.target.value)}
        />
      </label>
      <button
        className="btn purple-outline-btn"
        onClick={() => alert(`Test sent to ${testTo}`)}
      >
        Send Test
      </button>
      <button
        className="btn purple-btn ml-2"
        onClick={handleSave}
      >
        Save Emails
      </button>
    </section>
  );
}
