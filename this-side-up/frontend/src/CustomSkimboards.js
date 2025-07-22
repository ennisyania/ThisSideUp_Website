import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomSkimboards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);

  // Preset labor cost
  const LABOR_COST = 80;

  useEffect(() => {
    fetch('http://localhost:5000/api/products/skimboards')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          id: item.productId,
          imageSrc: item.imageurl,
          title: item.name,
          price: item.price && item.price.length > 0 ? `$${item.price[0].toFixed(2)}` : '$0.00',
        }));
        setProducts(formatted);
      })
      .catch(err => console.error('Failed to fetch skimboards:', err));
  }, []);

  const [form, setForm] = useState({
    shape: '',
    thickness: '',
    length: 54,
    rockerProfile: '',
    deckChannels: '',
    extraDetails: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const priceMap = {
    shape: { classic: 10, round: 20, pointed: 20 },
    thickness: { thin: 30, medium: 50, thick: 70 },
    length: { base: 1 },
    rockerProfile: { flat: 20, medium: 40, high: 60 },
    deckChannels: { yes: 25, no: 0 },
  };

  const calculatePrice = () => {
    let total = 0;
    total += priceMap.shape[form.shape] || 0;
    total += priceMap.thickness[form.thickness] || 0;
    total += (form.length || 54) * priceMap.length.base;
    total += priceMap.rockerProfile[form.rockerProfile] || 0;
    total += priceMap.deckChannels[form.deckChannels] || 0;
    total += LABOR_COST;  // Add preset labor cost here
    return total;
  };

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Revoke previous preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  }

  function handleChange(e) {
    const { name, value, type, id } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'radio' ? id : value,
    }));
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const totalPrice = calculatePrice();

    if (!imageFiles || imageFiles.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    // Pass existing previewUrls directly — no new object URLs created here
    const skimboardData = {
      form,
      laborCost: LABOR_COST,
      totalPrice,
      images: previewUrls,
    };

    // Redirect to custom checkout page with state
    navigate('/checkoutcs', { state: skimboardData });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left carousel */}
      <div
        style={{
          flex: 1,
          background: '#111',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        {products.length === 0 ? (
          <p>Loading boards...</p>
        ) : (
          <img
            src={products[currentIndex]?.imageSrc}
            alt={products[currentIndex]?.title || 'Selected Skimboard'}
            style={{
              maxWidth: '80%',
              maxHeight: 300,
              objectFit: 'contain',
              marginBottom: 16,
              borderRadius: 8,
              boxShadow: '0 0 10px rgba(255,150,50,0.8)',
            }}
          />
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.map((product, i) => (
            <img
              key={product.id}
              src={product.imageSrc}
              alt={product.title}
              title={`${product.title} — ${product.price}`}
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                cursor: 'pointer',
                border: i === currentIndex ? '3px solid #f96332' : '2px solid transparent',
                borderRadius: 6,
                transition: 'border-color 0.3s',
              }}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, padding: 40, backgroundColor: '#fff', color: '#000' }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: 20 }}>Customise Your Skimboard</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <label>
            Shape
            <select
              name="shape"
              value={form.shape}
              onChange={handleChange}
              required
              style={{ marginTop: 4, padding: 8, borderRadius: 5, border: '1px solid #ccc', width: '100%' }}
            >
              <option value="">Select Shape</option>
              {Object.entries(priceMap.shape).map(([key, price]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} (+${price})
                </option>
              ))}
            </select>
          </label>

          <label>
            Thickness
            <select
              name="thickness"
              value={form.thickness}
              onChange={handleChange}
              required
              style={{ marginTop: 4, padding: 8, borderRadius: 5, border: '1px solid #ccc', width: '100%' }}
            >
              <option value="">Select Thickness</option>
              {Object.entries(priceMap.thickness).map(([key, price]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} (+${price})
                </option>
              ))}
            </select>
          </label>

          <label>
            Rocker Profile
            <select
              name="rockerProfile"
              value={form.rockerProfile}
              onChange={handleChange}
              required
              style={{ marginTop: 4, padding: 8, borderRadius: 5, border: '1px solid #ccc', width: '100%' }}
            >
              <option value="">Select Rocker Profile</option>
              {Object.entries(priceMap.rockerProfile).map(([key, price]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} (+${price})
                </option>
              ))}
            </select>
          </label>

          <label>
            Length: {form.length}"
            <input
              type="range"
              name="length"
              min={40}
              max={60}
              value={form.length}
              onChange={handleChange}
              style={{ width: '100%', marginTop: 8 }}
            />
            <div>(${(form.length * priceMap.length.base).toFixed(2)})</div>
          </label>

          <fieldset style={{ border: 'none', padding: 0 }}>
            <legend>Deck Channels</legend>
            <label style={{ marginRight: 20 }}>
              <input
                type="radio"
                id="yes"
                name="deckChannels"
                checked={form.deckChannels === 'yes'}
                onChange={handleChange}
                required
                style={{ marginRight: 6 }}
              />
              Yes (+$25)
            </label>
            <label>
              <input
                type="radio"
                id="no"
                name="deckChannels"
                checked={form.deckChannels === 'no'}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              No (+$0)
            </label>
          </fieldset>

          <label>
            Extra details
            <textarea
              name="extraDetails"
              value={form.extraDetails}
              onChange={handleChange}
              placeholder="Value"
              rows={4}
              style={{ marginTop: 4, padding: 8, borderRadius: 5, border: '1px solid #ccc', width: '100%' }}
            />
          </label>

          <label>
            Upload Image References
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ marginTop: 8 }}
            />
          </label>

          {previewUrls.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Preview:</strong>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                {previewUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preview ${i + 1}`}
                    style={{ maxWidth: 120, maxHeight: 120, borderRadius: 6 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show labor cost (preset) */}
          <div style={{ fontWeight: 'bold', marginTop: 20 }}>
            Labor Cost: ${LABOR_COST.toFixed(2)}
          </div>

          {/* Show total price including labor */}
          <div style={{ fontWeight: 'bold', marginTop: 8 }}>
            Total Price: ${calculatePrice().toFixed(2)}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#f96332',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              fontWeight: 'bold',
              marginTop: 10,
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
