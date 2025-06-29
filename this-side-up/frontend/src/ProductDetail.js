import React, { useState } from 'react';
import './ProductDetail.css';

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

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
        src="/images/skimboard 2.png"
        alt="Skimboard"
        className="skimboard-image"
      />

      {/* Content wrapper */}
      <div className="product-content">
        <h1 className="product-detail-title">4'7 Blue Inferno</h1>
        <hr className="divider" />
        <div className="size-selector">
          {['50”', '52”', '54”', '56”'].map((size) => (
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
        <p className="product-detail-price">$275.00</p>

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
            The Blue Inferno is crafted for riders who live for that perfect rush between sand and sea.
            <br />
            <br />
            Its clean white base keeps it classic and sharp, while bold blue flames and coral designs lick the edges,
            giving it an untamed, oceanic energy.
            <br />
            <br />
            Lightweight but sturdy, this board is designed for quick cuts, smooth glides, and powerful wraps.
            <br />
            <br />
            Whether you're just skimming the surface or carving deep lines, the Blue Inferno gives you the perfect
            balance of speed, stability, and style.
            <br />
            <br />
            Built for all levels, it's the ultimate board for chasing adrenaline and mastering the shoreline.
          </div>

          <div className="features">
            <h2>Build Tech</h2>
            <ul>
              <li>3/4” Thick</li>
              <li>V.R.T.™ Technology</li>
              <li>Continuous Core</li>
              <li>E-Glass™ Wrap</li>
              <li>PolyLam™ Texture Finish</li>
              <li>FlexSpine™ Carbon Stringer</li>
              <li>Resin Art</li>
              <li>Polyester Resin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
