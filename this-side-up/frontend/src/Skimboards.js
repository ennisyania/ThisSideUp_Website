import React, { useEffect, useState } from 'react';
import './products.css';

export default function Skimboards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products/skimboards')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item, index) => ({
          id: index,
          imageSrc: item.imageurl,
          title: item.name,
          price: item.price[0] ? `$${item.price[0].toFixed(2)}` : '$0.00'
        }));
        setProducts(formatted);
      })
      .catch(err => console.error('Failed to fetch skimboards:', err));
  }, []);

  return (
    <div className='skimboards'>
      <section className="hero"></section>
      <div className='title'>
        <h1>Skimboards</h1>
        <div className="vector-line"></div>
      </div>
      <div className="product-row">
        {products.map(product => (
          <div key={product.id} className="product-frame">
            <img src={product.imageSrc} alt={product.title} className="product-image" />
            <div className="product-title">{product.title}</div>
            <div className="product-price">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
