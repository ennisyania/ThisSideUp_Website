import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ASettings() {
  const [active, setActive] = useState('Homepage');

  const tabStyle = {
    padding: '0.6rem 1.2rem',
    border: 'none',
    backgroundColor: '#e0e0e0',
    color: '#333',
    fontWeight: '500',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#333',
    color: 'white',
  };

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          color: '#333',
        }}
      >
        ⚙️ Site Settings
      </h1>

      <nav
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {['Homepage', 'Admins', 'Discounts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={active === tab ? activeTabStyle : tabStyle}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div>
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

  const removeHeroImage = id => {
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
    <section
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.06)',
        maxWidth: '100%',
        marginBottom: '2rem',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#222' }}>Hero Carousel Images</h3>
      {heroImages.map(h => (
        <div
          key={h.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          {h.imageUrl ? (
            <img
              src={h.imageUrl}
              alt="Hero"
              style={{ maxHeight: 80, marginRight: 8, borderRadius: 6, objectFit: 'cover' }}
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={e => handleUploadImage(e, h.id)}
            disabled={uploadingIndex === h.id}
            style={{ marginRight: '8px' }}
          />
          <button
            onClick={() => removeHeroImage(h.id)}
            disabled={uploadingIndex === h.id}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.7rem',
              borderRadius: '4px',
              cursor: uploadingIndex === h.id ? 'not-allowed' : 'pointer',
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addHeroImage}
        disabled={uploadingIndex !== null}
        style={{
          backgroundColor: '#BE40E8',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.2rem',
          borderRadius: '6px',
          cursor: uploadingIndex !== null ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem',
        }}
      >
        Add Hero Image
      </button>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#222' }}>
        Announcement Bar (Hero Text)
      </h3>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <input
          type="checkbox"
          checked={showAnn}
          onChange={e => setShowAnn(e.target.checked)}
          style={{ marginRight: '0.5rem', cursor: 'pointer' }}
        />
        Enable Announcement
      </label>
      {showAnn && (
        <textarea
          rows={2}
          value={announcement}
          onChange={e => setAnnouncement(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            resize: 'vertical',
            marginBottom: '1.5rem',
          }}
        />
      )}

      <button
        onClick={saveHomepageSettings}
        disabled={uploadingIndex !== null}
        style={{
          backgroundColor: '#BE40E8',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '6px',
          cursor: uploadingIndex !== null ? 'not-allowed' : 'pointer',
        }}
      >
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
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/user/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      await axios.put(
        'http://localhost:5000/api/user/admins/promote',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmail('');
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to promote user');
    }
  };

  const removeAdmin = async id => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAdmins();
    } catch (err) {
      alert('Failed to remove admin');
    }
  };

  return (
    <section
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.06)',
        maxWidth: '100%',
        marginBottom: '2rem',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#222' }}>Add New Admin</h3>

      <label
        style={{
          display: 'block',
          marginBottom: '1rem',
          fontWeight: 500,
        }}
      >
        Email
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginTop: '0.3rem',
          }}
        />
      </label>
      <button
        onClick={addAdmin}
        style={{
          backgroundColor: '#BE40E8',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.3rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        Add Admin
      </button>

      <h3
        style={{
          fontSize: '1.25rem',
          marginTop: '2rem',
          marginBottom: '1rem',
          color: '#222',
        }}
      >
        Current Admins
      </h3>
      <ul
        style={{
          listStyle: 'none',
          paddingLeft: 0,
          margin: 0,
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        {admins.map(admin => (
          <li
            key={admin._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <span>{admin.email}</span>
            <button
              onClick={() => removeAdmin(admin._id)}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.7rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Remove
            </button>
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
      await axios.post(
        'http://localhost:5000/api/settings/discounts',
        {
          siteDiscount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const deleteCode = async code => {
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
    <section
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.06)',
        maxWidth: '100%',
        marginBottom: '2rem',
      }}
    >
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#222' }}>Storewide Discount</h3>
      <label
        style={{
          display: 'block',
          marginBottom: '1rem',
          fontWeight: 500,
        }}
      >
        Sitewide Discount (%)
        <input
          type="number"
          min={0}
          max={100}
          value={siteDiscount}
          onChange={e => setSiteDiscount(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginTop: '0.3rem',
          }}
        />
      </label>
      <button
        onClick={saveSiteDiscount}
        style={{
          backgroundColor: '#BE40E8',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.3rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '2rem',
        }}
      >
        Save Sitewide Discount
      </button>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#222' }}>Discount Codes</h3>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: 500,
        }}
      >
        Code
        <input
          type="text"
          value={newCode.code}
          onChange={e => setNewCode(c => ({ ...c, code: e.target.value.toUpperCase() }))}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginTop: '0.3rem',
          }}
        />
      </label>
      <label
        style={{
          display: 'block',
          marginBottom: '1rem',
          fontWeight: 500,
        }}
      >
        Value ($)
        <input
          type="number"
          min={1}
          max={100}
          value={newCode.value}
          onChange={e => setNewCode(c => ({ ...c, value: Number(e.target.value) }))}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginTop: '0.3rem',
          }}
        />
      </label>
      <button
        onClick={addDiscountCode}
        style={{
          backgroundColor: '#BE40E8',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.3rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '1.5rem',
        }}
      >
        Add Code
      </button>

      <ul
        style={{
          listStyle: 'none',
          paddingLeft: 0,
          margin: 0,
          maxHeight: '300px',
          overflowY: 'auto',
          borderTop: '1px solid #eee',
        }}
      >
        {codes.map(c => (
          <li
            key={c.code}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <span>
              {c.code} - ${c.value} off
            </span>
            <button
              onClick={() => deleteCode(c.code)}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.7rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
