// src/admin/ASettings.js
import React, { useState } from 'react';
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
            className={active === tab ? 'tab-active' : ''}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="settings-content">
        {active === 'General'  && <GeneralForm />}
        {active === 'Branding' && <BrandingForm />}
        {active === 'Homepage' && <HomepageForm />}
        {active === 'Emails'   && <EmailTemplatesForm />}
      </div>
    </div>
  );
}

// -- Sub‐forms --

function GeneralForm() {
  const [siteName, setSiteName] = useState('This Side Up');
  const [tagline,  setTagline]  = useState('Ride the wave');
  const [currency, setCurrency] = useState('USD');

  return (
    <section className="settings-section">
      <label>Site Name
        <input value={siteName} onChange={e=>setSiteName(e.target.value)} />
      </label>
      <label>Tagline
        <input value={tagline} onChange={e=>setTagline(e.target.value)} />
      </label>
      <label>Currency
        <select value={currency} onChange={e=>setCurrency(e.target.value)}>
          <option>USD</option><option>EUR</option><option>SGD</option>
        </select>
      </label>
      <button className="btn purple-btn" onClick={()=>alert('General saved')}>
        Save General
      </button>
    </section>
  );
}

function BrandingForm() {
  const [logo, setLogo]       = useState(null);
  const [favicon, setFavicon] = useState(null);

  return (
    <section className="settings-section">
      <label>Logo Upload
        <input type="file" accept="image/*" onChange={e=>setLogo(e.target.files[0])} />
      </label>
      <label>Favicon Upload
        <input type="file" accept="image/*" onChange={e=>setFavicon(e.target.files[0])} />
      </label>
      <button className="btn purple-btn" onClick={()=>alert('Branding saved')}>
        Save Branding
      </button>
    </section>
  );
}

function HomepageForm() {
  const [banners, setBanners]           = useState([{ id:1, text:'Summer Sale', link:'#' }]);
  const [announcement, setAnnouncement] = useState('Free shipping over $50!');
  const [showAnn, setShowAnn]          = useState(true);

  const add    = ()=> setBanners(bs=>[...bs,{id:Date.now(),text:'',link:''}]);
  const upd    = (id,f,val)=> setBanners(bs=>bs.map(b=>b.id===id?{...b,[f]:val}:b));
  const remove = id=> setBanners(bs=>bs.filter(b=>b.id!==id));

  return (
    <section className="settings-section">
      <h3>Banner Carousel</h3>
      {banners.map(b=>(
        <div key={b.id} className="banner-row">
          <input
            placeholder="Text" value={b.text}
            onChange={e=>upd(b.id,'text',e.target.value)}
          />
          <input
            placeholder="Link" value={b.link}
            onChange={e=>upd(b.id,'link',e.target.value)}
          />
          <button onClick={()=>remove(b.id)}>Remove</button>
        </div>
      ))}
      <button className="btn purple-outline-btn" onClick={add}>Add Banner</button>

      <h3 className="mt-4">Announcement Bar</h3>
      <label className="inline-label">
        <input type="checkbox" checked={showAnn} onChange={e=>setShowAnn(e.target.checked)} />
        Enable Announcement
      </label>
      {showAnn && (
        <textarea
          rows={2}
          value={announcement}
          onChange={e=>setAnnouncement(e.target.value)}
          className="full-width"
        />
      )}
      <button className="btn purple-btn" onClick={()=>alert('Homepage saved')}>
        Save Homepage
      </button>
    </section>
  );
}

function EmailTemplatesForm() {
  const [tpls, setTpls]   = useState({
    confirmation: 'Thanks for your order {{orderId}}!',
    shipped:      'Your order {{orderId}} has shipped.',
  });
  const [testTo, setTestTo]= useState('');

  const upd = (k,v)=> setTpls(ts=>({ ...ts, [k]: v }));

  return (
    <section className="settings-section">
      <h3>Order Confirmation</h3>
      <textarea
        rows={3}
        value={tpls.confirmation}
        onChange={e=>upd('confirmation',e.target.value)}
      />

      <h3>Shipping Update</h3>
      <textarea
        rows={3}
        value={tpls.shipped}
        onChange={e=>upd('shipped',e.target.value)}
      />

      <label className="mt-3">
        Test Email To:
        <input
          type="email"
          value={testTo}
          onChange={e=>setTestTo(e.target.value)}
        />
      </label>
      <button className="btn purple-outline-btn" onClick={()=>alert(`Test sent to ${testTo}`)}>
        Send Test
      </button>
      <button className="btn purple-btn ml-2" onClick={()=>alert('Emails saved')}>
        Save Emails
      </button>
    </section>
  );
}
