import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './products.css';

export default function Skimboards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/skimboards') // fetch from skimboards collection route
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className='skimboards'>
      {/* Hero */}
      <section className="hero"></section>

      {/* Title */}
      <div className='title'>
        <h1>Skimboards</h1>
        <div className="vector-line"></div>
      </div>

      {/* Products */}
      <div className="product-row">
        {products.map(product => (
          <Link to={`/product/${product.productId}`} key={product.productId} className="product-frame">
            <img src={product.imageurl} alt={product.name} className="product-image" />
            <div className="product-title">{product.name}</div>
            {/* Displaying first price from price array */}
            <div className="product-price">${product.price[0]}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
