import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function ASettings() {
  const [active, setActive] = useState('General');

  return (
    <div className="admin-page settings-page">
      <h1 className="page-title">⚙️ Site Settings</h1>

      <nav className="settings-tabs">
        {['General', 'Branding', 'Homepage', 'Admins'].map(tab => (
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
        {active === 'General' && <GeneralForm />}
        {active === 'Branding' && <BrandingForm />}
        {active === 'Homepage' && <HomepageForm />}
        {active === 'Admins' && <AdminForm />}
      </div>
    </div>
  );
}

// --- Inner Forms ---

function GeneralForm() {
  const [siteName, setSiteName] = useState('This Side Up');
  const [tagline, setTagline] = useState('Ride the wave');
  const [currency, setCurrency] = useState('USD');

  return (
    <section className="settings-section">
      <label>Site Name
        <input value={siteName} onChange={e => setSiteName(e.target.value)} />
      </label>
      <label>Tagline
        <input value={tagline} onChange={e => setTagline(e.target.value)} />
      </label>
      <label>Currency
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option>USD</option><option>EUR</option><option>SGD</option>
        </select>
      </label>
      <button className="btn purple-btn" onClick={() => alert('General saved (frontend only)')}>
        Save General
      </button>
    </section>
  );
}

function BrandingForm() {
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  return (
    <section className="settings-section">
      <label>Logo Upload
        <input type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])} />
      </label>
      <label>Favicon Upload
        <input type="file" accept="image/*" onChange={e => setFavicon(e.target.files[0])} />
      </label>
      <button className="btn purple-btn" onClick={() => alert('Branding saved (frontend only)')}>
        Save Branding
      </button>
    </section>
  );
}

function HomepageForm() {
  const [banners, setBanners] = useState([{ id: 1, text: 'Summer Sale', link: '#' }]);
  const [announcement, setAnnouncement] = useState('Free shipping over $50!');
  const [showAnn, setShowAnn] = useState(true);

  const add = () => setBanners(bs => [...bs, { id: Date.now(), text: '', link: '' }]);
  const upd = (id, f, val) => setBanners(bs => bs.map(b => b.id === id ? { ...b, [f]: val } : b));
  const remove = id => setBanners(bs => bs.filter(b => b.id !== id));

  return (
    <section className="settings-section">
      <h3>Banner Carousel</h3>
      {banners.map(b => (
        <div key={b.id} className="banner-row">
          <input
            placeholder="Text" value={b.text}
            onChange={e => upd(b.id, 'text', e.target.value)}
          />
          <input
            placeholder="Link" value={b.link}
            onChange={e => upd(b.id, 'link', e.target.value)}
          />
          <button onClick={() => remove(b.id)}>Remove</button>
        </div>
      ))}
      <button className="btn purple-outline-btn" onClick={add}>Add Banner</button>

      <h3 className="mt-4">Announcement Bar</h3>
      <label className="inline-label">
        <input type="checkbox" checked={showAnn} onChange={e => setShowAnn(e.target.checked)} />
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
      <button className="btn purple-btn" onClick={() => alert('Homepage saved (frontend only)')}>
        Save Homepage
      </button>
    </section>
  );
}

function AdminForm() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token'); // adjust if you're using context
      const res = await axios.get('http://localhost:5000/api/user/admins', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };


  const addAdmin = async () => {
  if (!email) return alert('Email is required');

  try {
    const token = localStorage.getItem('token');
    await axios.put('http://localhost:5000/api/user/admins/promote', { email }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setEmail('');
    fetchAdmins();
  } catch (err) {
    alert(err.response?.data?.error || 'Failed to promote user');
  }
};



  const removeAdmin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAdmins();
    } catch (err) {
      alert('Failed to remove admin');
    }
  };


  return (
    <section className="settings-section">
      <h3>Add New Admin</h3>

      <label>Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button onClick={addAdmin}>Add Admin</button>

      <h3 className="mt-4">Current Admins</h3>
      <ul className="admin-list">
        {admins.map(admin => (
          <li key={admin._id}>
            <span>{admin.email}</span>
            <button onClick={() => removeAdmin(admin._id)} className="ml-2">Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
