// src/Jackets.js
import React from 'react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './products.css';

export default function Jackets() {
  const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/api/products/jackets')
    .then(res => res.json())
    .then(data => {
      const formatted = data.map((item, index) => ({
        id: item.productId,
        imageSrc: item.imageurl,
        title: item.name,
        price: item.price[0] ? `$${item.price[0].toFixed(2)}` : '$0.00'
      }));
      setProducts(formatted);
    })
    .catch(err => console.error('Failed to fetch jackets:', err));
}, []);

  return (
    <div className='jackets'>
      <section className="hero jackets-hero-banner"></section>

      <div className='title'>
        <h1>Jackets</h1>
        <div className="vector-line"></div>
      </div>

      <div className="product-row">
        {products.map(product => (
          <Link to={`/productdetail/${product.id}`} key={product.id} className="product-frame">
            <img src={product.imageSrc} alt={product.title} className="products-image" />
            <div className="product-title">{product.title}</div>
            <div className="product-price">{product.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
