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

  // For adding new product
  const [addingNew, setAddingNew] = useState(false);
  const [addData, setAddData] = useState(null);
  const [addingSaving, setAddingSaving] = useState(false);

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

  // Image upload for edit or add modal
  async function handleImageUpload(e, forAdd = false) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token'); // if auth required
      const res = await fetch('http://localhost:5000/api/upload-image', {
        method: 'POST',
        headers: {
          // Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        if (forAdd) {
          setAddData(prev => ({ ...prev, imageurl: data.imageUrl }));
        } else {
          setEditData(prev => ({ ...prev, imageurl: data.imageUrl }));
        }
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

  // Edit modal: Initialize form data when product selected
  useEffect(() => {
    if (selectedProduct) {
      setEditData({
        name: selectedProduct.name,
        category: selectedProduct.category,
        description: selectedProduct.description,
        sizes: selectedProduct.sizes.length > 0 ? [...selectedProduct.sizes] : [],
        price: selectedProduct.price.length > 0 ? [...selectedProduct.price] : [0],
        quantities: selectedProduct.quantities.length > 0 ? [...selectedProduct.quantities] : [0],
        imageurl: selectedProduct.imageurl || '',
        details: selectedProduct.details ? [...selectedProduct.details] : [],
      });
    } else {
      setEditData(null);
    }
  }, [selectedProduct]);

  // Add modal: Initialize form data on open
  useEffect(() => {
    if (addingNew) {
      setAddData({
        name: '',
        category: CATEGORIES[0],
        description: '',
        sizes: [],
        price: [0],
        quantities: [0],
        imageurl: '',
        details: [],
      });
    } else {
      setAddData(null);
    }
  }, [addingNew]);

  // Handle edit form changes
  function handleEditChange(field, value, forAdd = false) {
    if (forAdd) {
      setAddData(prev => ({ ...prev, [field]: value }));
    } else {
      setEditData(prev => ({ ...prev, [field]: value }));
    }
  }

  // Handle sizes/prices/quantities for edit or add
  function handleSizeChange(index, field, value, forAdd = false) {
    if (forAdd) {
      setAddData(prev => {
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
    } else {
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
  }

  // Add size option for edit or add
  function addSizeOption(forAdd = false) {
    if (forAdd) {
      setAddData(prev => ({
        ...prev,
        sizes: [...prev.sizes, ''],
        price: [...prev.price, 0],
        quantities: [...prev.quantities, 0],
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        sizes: [...prev.sizes, ''],
        price: [...prev.price, 0],
        quantities: [...prev.quantities, 0],
      }));
    }
  }

  // Remove size option for edit or add
  function removeSizeOption(index, forAdd = false) {
    if (forAdd) {
      setAddData(prev => {
        const newSizes = [...prev.sizes];
        const newPrice = [...prev.price];
        const newQuantities = [...prev.quantities];
        newSizes.splice(index, 1);
        newPrice.splice(index, 1);
        newQuantities.splice(index, 1);
        return { ...prev, sizes: newSizes, price: newPrice, quantities: newQuantities };
      });
    } else {
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
  }

  // Handle details array changes for edit or add
  function handleDetailChange(index, value, forAdd = false) {
    if (forAdd) {
      setAddData(prev => {
        const updated = { ...prev };
        updated.details[index] = value;
        return updated;
      });
    } else {
      setEditData(prev => {
        const updated = { ...prev };
        updated.details[index] = value;
        return updated;
      });
    }
  }

  // Add a detail entry for edit or add
  function addDetail(forAdd = false) {
    if (forAdd) {
      setAddData(prev => ({
        ...prev,
        details: [...prev.details, ''],
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        details: [...prev.details, ''],
      }));
    }
  }

  // Remove a detail entry for edit or add
  function removeDetail(index, forAdd = false) {
    if (forAdd) {
      setAddData(prev => {
        const newDetails = [...prev.details];
        newDetails.splice(index, 1);
        return { ...prev, details: newDetails };
      });
    } else {
      setEditData(prev => {
        const newDetails = [...prev.details];
        newDetails.splice(index, 1);
        return { ...prev, details: newDetails };
      });
    }
  }

  // Save edited product (PUT)
  async function handleSave() {
    if (!editData) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to save changes');

      await loadProducts();
      setSelectedProduct(null);
      setEditData(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Add new product (POST)
  async function handleAdd() {
    if (!addData) return;

    const newProductId = 'prd_' + Date.now();

    const productToAdd = { ...addData, productId: newProductId };

    setAddingSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToAdd),
      });
      if (!res.ok) throw new Error('Failed to add product');

      await loadProducts();
      setAddingNew(false);
      setAddData(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setAddingSaving(false);
    }
  }

  return (
    <div className="admin-page orders-page">
      <h1 className="page-title">
        <Package className="page-icon" /> Products
      </h1>

      <button
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#BE40E8',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={() => setAddingNew(true)}
      >
        + Add New Product
      </button>

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

      <table className="table-wrapper">
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

      {/* Edit Modal */}
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

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
              Edit Product: {selectedProduct.name}
            </h2>

            {/* Name */}
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              Name:<br />
              <input
                type="text"
                value={editData.name}
                onChange={e => handleEditChange('name', e.target.value)}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.25rem'
                }}
              />
            </label>

            {/* Current Image */}
            <img
              src={editData.imageurl || 'placeholder-image-url.jpg'}
              alt={editData.name}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginTop: '1rem'
              }}
            />

            {/* Upload New Image */}
            <label style={{ display: 'block', marginTop: '1rem', marginBottom: '1rem' }}>
              Change Image:<br />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageUpload(e, false)}
                disabled={uploadingImage || saving}
                style={{ marginTop: '0.25rem' }}
              />
            </label>

            {uploadingImage && <p>Uploading image...</p>}

            {/* Category */}
            <label style={{ display: 'block', marginTop: '1rem', marginBottom: '1rem' }}>
              Category:<br />
              <select
                value={editData.category}
                onChange={e => handleEditChange('category', e.target.value)}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.25rem'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            {/* Description */}
            <label style={{ display: 'block', marginTop: '1rem' }}>
              Description:<br />
              <textarea
                value={editData.description}
                onChange={e => handleEditChange('description', e.target.value)}
                rows={4}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.25rem'
                }}
              />
            </label>

            {/* Details */}
            <h4 style={{ marginTop: '1.5rem' }}>Details:</h4>
            {editData.details.length === 0 ? (
              <p>No details added yet.</p>
            ) : (
              <ul style={{ paddingLeft: '1rem', marginBottom: '1rem' }}>
                {editData.details.map((detail, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={detail}
                      onChange={e => handleDetailChange(i, e.target.value, false)}
                      disabled={saving}
                      style={{
                        width: '90%',
                        padding: '0.4rem',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(i, false)}
                      disabled={saving}
                      style={{
                        marginLeft: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                      aria-label="Remove detail"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => addDetail(false)}
              disabled={saving}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#BE40E8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + Add Detail
            </button>

            {/* Sizes / Prices / Quantities */}
            <h4 style={{ marginTop: '1.5rem' }}>Sizes, Prices & Quantities:</h4>

            {editData.sizes.length === 0 ? (
              <p>This product has no sizes. Edit price and quantity below.</p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Size</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Price ($)</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Quantity</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editData.sizes.map((size, i) => (
                      <tr key={i}>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="text"
                            value={editData.sizes[i]}
                            onChange={e => handleSizeChange(i, 'size', e.target.value)}
                            disabled={saving}
                            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="number"
                            value={editData.price[i]}
                            onChange={e => handleSizeChange(i, 'price', e.target.value)}
                            min="0"
                            disabled={saving}
                            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input
                            type="number"
                            value={editData.quantities[i]}
                            onChange={e => handleSizeChange(i, 'quantity', e.target.value)}
                            min="0"
                            disabled={saving}
                            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => removeSizeOption(i, false)}
                            disabled={saving}
                            style={{
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.4rem 0.6rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              type="button"
              onClick={() => addSizeOption(false)}
              disabled={saving}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#BE40E8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + Add Size
            </button>

            {/* Single Price/Quantity if no sizes */}
            {editData.sizes.length === 0 && (
              <>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  Price:<br />
                  <input
                    type="number"
                    value={editData.price[0]}
                    onChange={e => handleSizeChange(0, 'price', e.target.value)}
                    min="0"
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginTop: '0.25rem'
                    }}
                  />
                </label>

                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  Quantity:<br />
                  <input
                    type="number"
                    value={editData.quantities[0]}
                    onChange={e => handleSizeChange(0, 'quantity', e.target.value)}
                    min="0"
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginTop: '0.25rem'
                    }}
                  />
                </label>
              </>
            )}

            {/* Save Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#BE40E8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addingNew && addData && (
        <div className="modal-backdrop">
          <div className="modal-contentpurple" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <button
              className="modal-close"
              onClick={() => setAddingNew(false)}
              aria-label="Close modal"
              disabled={addingSaving}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Add New Product</h2>

            {/* Name */}
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              Name:<br />
              <input
                type="text"
                value={addData.name}
                onChange={e => handleEditChange('name', e.target.value, true)}
                disabled={addingSaving}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.25rem'
                }}
              />
            </label>

            {/* Image Preview */}
            <img
              src={addData.imageurl || 'placeholder-image-url.jpg'}
              alt={addData.name || 'Preview'}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginTop: '1rem'
              }}
            />

            {/* Upload New Image */}
            <label style={{ display: 'block', marginTop: '1rem', marginBottom: '1rem' }}>
              Upload Image:<br />
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImageUpload(e, true)}
                disabled={uploadingImage || addingSaving}
                style={{ marginTop: '0.25rem' }}
              />
            </label>

            {uploadingImage && <p>Uploading image...</p>}

            {/* Category */}
            <label style={{ display: 'block', marginTop: '1rem', marginBottom: '1rem' }}>
              Category:<br />
              <select
                value={addData.category}
                onChange={e => handleEditChange('category', e.target.value, true)}
                disabled={addingSaving}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.25rem'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            {/* Description */}
            <label style={{ display: 'block', marginTop: '1rem' }}>
              Description:<br />
              <textarea
                value={addData.description}
                onChange={e => handleEditChange('description', e.target.value, true)}
                rows={4}
                disabled={addingSaving}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginTop: '0.25rem'
                }}
              />
            </label>

            {/* Details */}
            <h4 style={{ marginTop: '1.5rem' }}>Details:</h4>
            {addData.details.length === 0 ? (
              <p>No details added yet.</p>
            ) : (
              <ul style={{ paddingLeft: '1rem', marginBottom: '1rem' }}>
                {addData.details.map((detail, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={detail}
                      onChange={e => handleDetailChange(i, e.target.value, true)}
                      disabled={addingSaving}
                      style={{
                        width: '90%',
                        padding: '0.4rem',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(i, true)}
                      disabled={addingSaving}
                      style={{
                        marginLeft: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                        backgroundColor: '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                      aria-label="Remove detail"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => addDetail(true)}
              disabled={addingSaving}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#BE40E8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + Add Detail
            </button>

            {/* Sizes / Prices / Quantities */}
            <h4 style={{ marginTop: '1.5rem' }}>Sizes, Prices & Quantities:</h4>

            {addData.sizes.length === 0 ? (
              <p>This product has no sizes. Edit price and quantity below.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Size</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Price ($)</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {addData.sizes.map((size, i) => (
                    <tr key={i}>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          value={addData.sizes[i]}
                          onChange={e => handleSizeChange(i, 'size', e.target.value, true)}
                          disabled={addingSaving}
                          style={{
                            width: '100%',
                            padding: '0.4rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="number"
                          value={addData.price[i]}
                          onChange={e => handleSizeChange(i, 'price', e.target.value, true)}
                          min="0"
                          disabled={addingSaving}
                          style={{
                            width: '100%',
                            padding: '0.4rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <input
                          type="number"
                          value={addData.quantities[i]}
                          onChange={e => handleSizeChange(i, 'quantity', e.target.value, true)}
                          min="0"
                          disabled={addingSaving}
                          style={{
                            width: '100%',
                            padding: '0.4rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => removeSizeOption(i, true)}
                          disabled={addingSaving}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.4rem 0.6rem',
                            cursor: 'pointer'
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              type="button"
              onClick={() => addSizeOption(true)}
              disabled={addingSaving}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#BE40E8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + Add Size
            </button>

            {/* Fallback Price/Quantity Inputs */}
            {addData.sizes.length === 0 && (
              <>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  Price:<br />
                  <input
                    type="number"
                    value={addData.price[0]}
                    onChange={e => handleSizeChange(0, 'price', e.target.value, true)}
                    min="0"
                    disabled={addingSaving}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginTop: '0.25rem'
                    }}
                  />
                </label>

                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  Quantity:<br />
                  <input
                    type="number"
                    value={addData.quantities[0]}
                    onChange={e => handleSizeChange(0, 'quantity', e.target.value, true)}
                    min="0"
                    disabled={addingSaving}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginTop: '0.25rem'
                    }}
                  />
                </label>
              </>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleAdd}
                disabled={addingSaving}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#BE40E8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {addingSaving ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
