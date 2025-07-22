import React, { useState, useEffect } from 'react';
import {
  Package,
  RefreshCw
} from 'lucide-react';
import './AAdmin.css'; // Reuse same styling

const CATEGORIES = ['t-shirt', 'boardshort', 'accessory', 'jacket', 'skimboard'];

export default function AProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploadingImage, setUploadingImage] = useState(false);


  // For editing form state
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products/all');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token'); // if you use auth, else skip header
      const res = await fetch('http://localhost:5000/api/upload-image', {
        method: 'POST',
        headers: {
          // Authorization: `Bearer ${token}`, // uncomment if auth required
        },
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        // Update editData with new image URL
        setEditData(prev => ({ ...prev, imageurl: data.imageUrl }));
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  }


  useEffect(() => {
    loadProducts();
  }, []);



  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  // When product is selected, initialize edit form data
  useEffect(() => {
    if (selectedProduct) {
      setEditData({
        name: selectedProduct.name,
        category: selectedProduct.category,
        description: selectedProduct.description,
        sizes: [...selectedProduct.sizes],
        price: [...selectedProduct.price],
        quantities: [...selectedProduct.quantities],
        imageurl: selectedProduct.imageurl || '',
      });
    } else {
      setEditData(null);
    }
  }, [selectedProduct]);


  // Handle input changes
  function handleEditChange(field, value) {
    setEditData(prev => ({ ...prev, [field]: value }));
  }

  // Handle editing sizes/prices/quantities (by index)
  function handleSizeChange(index, field, value) {
    setEditData(prev => {
      const updated = { ...prev };
      if (field === 'size') {
        updated.sizes[index] = value;
      } else if (field === 'price') {
        updated.price[index] = Number(value);
      } else if (field === 'quantity') {
        updated.quantities[index] = Number(value);
      }
      return updated;
    });
  }

  // Add a new size option (optional)
  function addSizeOption() {
    setEditData(prev => ({
      ...prev,
      sizes: [...prev.sizes, ''],
      price: [...prev.price, 0],
      quantities: [...prev.quantities, 0],
    }));
  }

  // Remove size option (optional)
  function removeSizeOption(index) {
    setEditData(prev => {
      const newSizes = [...prev.sizes];
      const newPrice = [...prev.price];
      const newQuantities = [...prev.quantities];
      newSizes.splice(index, 1);
      newPrice.splice(index, 1);
      newQuantities.splice(index, 1);
      return { ...prev, sizes: newSizes, price: newPrice, quantities: newQuantities };
    });
  }

  // Submit updated product data to server
  async function handleSave() {
    if (!editData) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${selectedProduct._id}`, {
        method: 'PUT', // or PATCH depending on your API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to save changes');

      // Refresh product list & close modal
      await loadProducts();
      setSelectedProduct(null);
      setEditData(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page orders-page">
      <h1 className="page-title">
        <Package className="page-icon" /> Products
      </h1>

      {/* Category filter */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="category-filter"><strong>Filter by Category: </strong></label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="loading-overlay">
          <RefreshCw className="spin" /> Loading products…
        </div>
      )}

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => {
            const sizePriceQuantity = p.sizes.length > 0
              ? p.sizes.map((size, i) => {
                const price = p.price[i];
                const quantity = p.quantities[i];
                return `${size}: $${price} (${quantity})`;
              }).join(', ')
              : `$${p.price[0]} (${p.quantities[0]})`;

            const totalQuantity = p.quantities.reduce((acc, q) => acc + q, 0);

            return (
              <tr key={p._id} onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
                <td>{p.productId}</td>
                <td>{p.category}</td>
                <td>{p.name}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{sizePriceQuantity}</td>
                <td>{totalQuantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedProduct && editData && (
        <div className="modal-backdrop">
          <div className="modal-contentpurple" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close modal"
              disabled={saving}
            >
              ✕
            </button>

            <h2>Edit Product: {selectedProduct.name}</h2>

            {/* Name */}
            <label>
              Name:<br />
              <input
                type="text"
                value={editData.name}
                onChange={e => handleEditChange('name', e.target.value)}
                disabled={saving}
              />
            </label>

            {/* Show current image */}
            <img
              src={editData.imageurl || 'placeholder-image-url.jpg'}
              alt={editData.name}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
            />

            {/* Upload new image */}
            <label style={{ display: 'block', marginTop: '1rem' }}>
              Change Image:<br />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || saving}
              />
            </label>

            {uploadingImage && <p>Uploading image...</p>}



            {/* Category */}
            <label style={{ marginTop: '1rem' }}>
              Category:<br />
              <select
                value={editData.category}
                onChange={e => handleEditChange('category', e.target.value)}
                disabled={saving}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            {/* Description */}
            <label style={{ marginTop: '1rem', display: 'block' }}>
              Description:<br />
              <textarea
                value={editData.description}
                onChange={e => handleEditChange('description', e.target.value)}
                rows={4}
                disabled={saving}
                style={{ width: '100%' }}
              />
            </label>

            {/* Sizes / Prices / Quantities */}
            <h4 style={{ marginTop: '1.5rem' }}>Sizes, Prices & Quantities:</h4>

            {editData.sizes.length === 0 ? (
              <p>This product has no sizes. Edit price and quantity below.</p>
            ) : (
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Price ($)</th>
                    <th>Quantity</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {editData.sizes.map((size, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          value={editData.sizes[i]}
                          onChange={e => handleSizeChange(i, 'size', e.target.value)}
                          disabled={saving}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.price[i]}
                          onChange={e => handleSizeChange(i, 'price', e.target.value)}
                          min="0"
                          disabled={saving}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.quantities[i]}
                          onChange={e => handleSizeChange(i, 'quantity', e.target.value)}
                          min="0"
                          disabled={saving}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeSizeOption(i)}
                          disabled={saving}
                          style={{ cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Add size button */}
            <button type="button" onClick={addSizeOption} disabled={saving} style={{ marginBottom: '1rem' }}>
              + Add Size
            </button>

            {/* If no sizes, show price & quantity inputs for single product */}
            {editData.sizes.length === 0 && (
              <>
                <label>
                  Price:<br />
                  <input
                    type="number"
                    value={editData.price[0]}
                    onChange={e => handleSizeChange(0, 'price', e.target.value)}
                    min="0"
                    disabled={saving}
                  />
                </label>
                <br />
                <label style={{ marginTop: '1rem' }}>
                  Quantity:<br />
                  <input
                    type="number"
                    value={editData.quantities[0]}
                    onChange={e => handleSizeChange(0, 'quantity', e.target.value)}
                    min="0"
                    disabled={saving}
                  />
                </label>
              </>
            )}

            {/* Submit button */}
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
