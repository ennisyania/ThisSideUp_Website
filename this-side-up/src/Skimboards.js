import React from 'react';
import './products.css';


const products = [
  { id: 1, imageSrc: '/images/skimboard 1.png', title: 'Grey Long sleeve tee', price: '$50.00' },
  { id: 2, imageSrc: '/images/skimboard 1.png', title: 'Black Tank top', price: '$50.00' },
  { id: 3, imageSrc: '/images/skimboard 1.png', title: 'Classic Board Shorts', price: '$50.00' },
  { id: 4, imageSrc: '/images/skimboard 1.png', title: 'Blue Tee', price: '$50.00' },
  { id: 5, imageSrc: '/images/skimboard 1.png', title: 'Blue Tee', price: '$50.00' },
];


export default function Skimboards() {
  return (
    <div className='skimboards'>
      {/* Hero */}
      <section className="hero">
      </section>

      {/* title */}
      <div className='title'>
        <h1>Skimboards</h1>
        <div class="vector-line"></div>
      </div>

      {/* products */}
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
  )
}