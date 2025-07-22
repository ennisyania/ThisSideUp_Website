
import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function ASettings() {
  const [active, setActive] = useState('Homepage');

  return (
    <div className="admin-page settings-page">
      <h1 className="page-title">⚙️ Site Settings</h1>

      <nav className="settings-tabs">

        {['Homepage', 'Admins', 'Discounts'].map(tab => (

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

        {active === 'Homepage' && <HomepageForm />}
        {active === 'Admins' && <AdminForm />}
        {active === 'Discounts' && <DiscountsForm />}

      </div>
    </div>
  );
}





// --- Inner Forms ---






function HomepageForm() {
  const [heroImages, setHeroImages] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [showAnn, setShowAnn] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null); // Track which image is uploading

  useEffect(() => {
    // Load existing homepage settings on mount
    async function fetchSettings() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.heroImages) setHeroImages(data.heroImages);
        if (data.announcement) setAnnouncement(data.announcement);
      } catch (err) {
        console.error('Failed to fetch homepage settings', err);
      }
    }
    fetchSettings();
  }, []);

  const addHeroImage = () => {
    setHeroImages(hs => [...hs, { id: Date.now(), imageUrl: '' }]);
  };

  const updateHeroImage = (id, val) => {
    setHeroImages(hs => hs.map(h => (h.id === id ? { ...h, imageUrl: val } : h)));
  };

  const removeHeroImage = (id) => {
    setHeroImages(hs => hs.filter(h => h.id !== id));
  };

  const handleUploadImage = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex(id);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        updateHeroImage(id, data.imageUrl);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  async function saveHomepageSettings() {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ heroImages, announcement }),
      });
      alert('Homepage settings saved!');
    } catch (err) {
      alert('Failed to save homepage settings');
    }
  }

  return (
    <section className="settings-section">
      <h3 className="mt-4">Hero Carousel Images</h3>
      {heroImages.map(h => (
        <div key={h.id} className="banner-row" style={{ alignItems: 'center' }}>
          {h.imageUrl ? (
            <img src={h.imageUrl} alt="Hero" style={{ maxHeight: 80, marginRight: 8 }} />
          ) : null}
          <input type="file" accept="image/*" onChange={e => handleUploadImage(e, h.id)} disabled={uploadingIndex === h.id} />
          <button onClick={() => removeHeroImage(h.id)} disabled={uploadingIndex === h.id}>Remove</button>
        </div>
      ))}
      <button onClick={addHeroImage} disabled={uploadingIndex !== null}>Add Hero Image</button>


      <h3 className="mt-4">Announcement Bar (Hero Text)</h3>
      <label className="inline-label">
        <input type="checkbox" checked={showAnn} onChange={e => setShowAnn(e.target.checked)} />
        Enable Announcement
      </label>
      {showAnn && (

        <textarea rows={2} value={announcement} onChange={e => setAnnouncement(e.target.value)} className="full-width" />
      )}

      <button onClick={saveHomepageSettings} disabled={uploadingIndex !== null}>

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

function DiscountsForm() {
  const [siteDiscount, setSiteDiscount] = useState(0);
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState({ code: '', value: 0 });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/settings/discounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSiteDiscount(res.data.siteDiscount || 0);
      setCodes(res.data.codes || []);
    } catch (err) {
      console.error('Failed to load discounts', err);
    }
  };

  const saveSiteDiscount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/settings/discounts', {
        siteDiscount
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Storewide discount saved');
    } catch (err) {
      alert('Failed to save storewide discount');
    }
  };

  const addDiscountCode = async () => {
    if (!newCode.code || !newCode.value) return alert('Fill in both fields');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/settings/discount-codes', newCode, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewCode({ code: '', value: 0 });
      fetchDiscounts();
    } catch (err) {
      alert('Failed to add discount code');
    }
  };

  const deleteCode = async (code) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/settings/discount-codes/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDiscounts();
    } catch (err) {
      alert('Failed to delete discount code');
    }
  };

  return (
    <section className="settings-section">
      <h3>Storewide Discount</h3>
      <label>Sitewide Discount (%)
        <input
          type="number"
          min={0}
          max={100}
          value={siteDiscount}
          onChange={e => setSiteDiscount(Number(e.target.value))}
        />
      </label>
      <button onClick={saveSiteDiscount}>Save Sitewide Discount</button>

      <h3 className="mt-4">Discount Codes</h3>
      <label>Code
        <input
          type="text"
          value={newCode.code}
          onChange={e => setNewCode(c => ({ ...c, code: e.target.value.toUpperCase() }))}
        />
      </label>
      <label>Value (%)
        <input
          type="number"
          min={1}
          max={100}
          value={newCode.value}
          onChange={e => setNewCode(c => ({ ...c, value: Number(e.target.value) }))}
        />
      </label>
      <button onClick={addDiscountCode}>Add Code</button>

      <ul className="admin-list">
        {codes.map(c => (
          <li key={c.code}>
            <span>{c.code} - {c.value}% off</span>
            <button onClick={() => deleteCode(c.code)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

