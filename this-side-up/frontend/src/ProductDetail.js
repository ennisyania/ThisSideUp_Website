import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched product:', data);
        setProduct(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, [productId]);
  if (!product) {
    return <div>Loading...</div>;
  }

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 0 ? q - 1 : 0));

  const handleSizeSelect = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      alert('Please select at least 1 item.');
      return;
    }
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    alert(`Added ${quantity} item(s) of size ${selectedSize} to cart.`);
    // Add further cart logic here 
  };

  return (
    <div className="product-container">
      {/* Background image */}
      <img
        src="/productdetailbackground.svg"
        alt="Decorative Background"
        className="background-image"
      />

      {/* Skimboard image on right, centered vertically */}
      <img
        src={product.imageurl}
        alt={product.name}
        className="product-image"
      />

      {/* Content wrapper */}
      <div className="product-content">
        <h1 className="product-detail-title">{product.name}</h1>
        <hr className="divider" />
        <div className="size-selector">
          {product.sizes.map((size, idx) => (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={selectedSize === size ? 'selected' : ''}
              type="button"
            >
              <span>{size}</span>
            </button>
          ))}
        </div>
        <p className="product-detail-price">
          {selectedSize
            ? `$${product.price[product.sizes.indexOf(selectedSize)]}.00`
            : 'Select a size'}
        </p>

        <div className="quantity-selector">
          <button onClick={decreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQuantity}>+</button>
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          <span>Add To Cart</span>
        </button>

        <div className="size-selector2" style={{ marginTop: '2rem' }}>
          <div className="product-description">
            {product.description}
          </div>

          <div className="features">
            <h2>Details</h2>
            <ul className="details-list">
              {product.details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
