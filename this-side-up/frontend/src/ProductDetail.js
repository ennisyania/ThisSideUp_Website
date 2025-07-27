import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

export default function ProductDetail({ onAddToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setQuantity(1);
    setSelectedSize(null);
    setError(null);

    fetch(`https://thissideup-website.onrender.com//api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(setProduct)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [productId]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div>Loading...</div>;

  const selectedIndex = selectedSize ? product.sizes.indexOf(selectedSize) : 0;
  const maxQuantity = selectedSize ? product.quantities[selectedIndex] : 0;

  const priceIndex = selectedSize ? product.sizes.indexOf(selectedSize) : 0;
  const price = product.price[priceIndex] || product.price[0];

  const canAddToCart =
    quantity > 0 &&
    (!product.sizes || product.sizes.length === 0 || selectedSize !== null);

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    onAddToCart({
      id: product.productId || productId,
      title: product.name,
      price,
      quantity,
      variant: selectedSize || 'default',
      imageSrc: product.imageurl,
    });

    alert(`Added ${quantity} item(s) of size ${selectedSize || 'default'} to cart.`);
  };

  return (
    <div className="product-container">
      <img src="/productdetailbackground.svg" alt="" className="background-image" />
      <img src={product.imageurl} alt={product.name} className="product-image" />
      <div className="product-content">
        <h1 className="product-detail-title">{product.name}</h1>
        <hr className="divider" />
        {product.sizes && product.sizes.length > 0 && (
          <div className="size-selector">
            {product.sizes.map((size, index) => {
              const isSoldOut = product.quantities[index] === 0;
              return (
                <button
                  key={size}
                  onClick={() => !isSoldOut && setSelectedSize(size)}
                  className={selectedSize === size ? 'selected' : ''}
                  disabled={isSoldOut}
                  aria-pressed={selectedSize === size}
                >
                  <span>{isSoldOut ? `${size} - sold out` : size}</span>
                </button>
              );
            })}
          </div>
        )}

        <p className="product-detail-price">${(price * quantity).toFixed(2)}</p>

        <div className="quantity-selector">
          <button
            onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
            disabled={!selectedSize || quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => (q < maxQuantity ? q + 1 : q))}
            disabled={!selectedSize || quantity >= maxQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button className="add-to-cart" onClick={handleAddToCart} disabled={!canAddToCart}>
          <span>Add To Cart</span>
        </button>

        <div className="size-selector2" style={{ marginTop: '2rem' }}>
          <div className="product-description">{product.description}</div>
          <div className="features">
            <h2>Details</h2>
            <ul className="details-list">{product.details.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
