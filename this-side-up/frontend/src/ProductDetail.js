import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

export default function ProductDetail({ onAddToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const priceIndex = selectedSize ? product.sizes.indexOf(selectedSize) : 0;
  const price = product.price[priceIndex] || product.price[0];



  const handleAddToCart = () => {
    if (quantity === 0) {
      alert('Please select at least 1 item.');
      return;
    }

    if (Array.isArray(product.sizes) && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size.');
      return;
    }

    onAddToCart({
      id: product.productId,
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
                >
                  <span>{isSoldOut ? `${size} - sold out` : size}</span>
                </button>
              );
            })}


          </div>
        )}
        <p className="product-detail-price">${(price * quantity).toFixed(2)}</p>
        <div className="quantity-selector">
          <button onClick={() => setQuantity((q) => Math.max(q - 1, 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>
        <button className="add-to-cart" onClick={handleAddToCart}>
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
