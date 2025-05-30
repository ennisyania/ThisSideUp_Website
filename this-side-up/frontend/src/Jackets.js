import React from 'react';
import './products.css';

const jackets = [
  { id: 1, imageSrc: '/images/tshirt-1.png', title: 'Skull Ripper Jacket', price: '$85.00' },
  { id: 2, imageSrc: '/images/tshirt-2.png', title: 'Diamond Beast Hoodie', price: '$95.00' },
  { id: 3, imageSrc: '/images/tshirt-3.png', title: 'Death Grip Windbreaker', price: '$75.00' },
  { id: 4, imageSrc: '/images/tshirt-4.png', title: 'Tiki Thunder Jacket', price: '$110.00' },
  { id: 5, imageSrc: '/images/tshirt-5.png', title: 'Speed Demon Hoodie', price: '$80.00' },
  { id: 6, imageSrc: '/images/tshirt-6.png', title: 'Radical Wave Bomber', price: '$120.00' },
];

export default function Jackets() {
  return (
    <div className='jackets'>
      <section className="hero jackets-hero-banner"></section>
      {/* title */}
      <div className='title'>
        <h1>Jackets</h1>
        <div className="vector-line"></div>
      </div>

      {/* products */}
      <div className="product-row">
        {jackets.map(product => (
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