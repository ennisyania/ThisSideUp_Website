import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './products.css';

export default function Boardshorts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('${process.env.REACT_APP_API_URL}/api/products/boardshorts')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item) => ({
          id: item.productId,
          imageSrc: item.imageurl,
          title: item.name,
          price: item.price[0] ? `$${item.price[0].toFixed(2)}` : '$0.00',
        }));
        setProducts(formatted);
      })
      .catch(err => console.error('Failed to fetch boardshorts:', err));
  }, []);

  return (
    <div className='tshirts'>
      <section className="hero tshirts-hero-banner"></section>

      <div className='title'>
        <h1>Boardshorts</h1>
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
