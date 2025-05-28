import React from 'react';
import './products.css';

const tshirts = [
  { id: 1, imageSrc: '/images/tshirt-1.png', title: 'Skull Ripper Tee', price: '$25.00' },
  { id: 2, imageSrc: '/images/tshirt-2.png', title: 'Diamond Beast Tee', price: '$28.00' },
  { id: 3, imageSrc: '/images/tshirt-3.png', title: 'Death Grip Tee', price: '$25.00' },
  { id: 4, imageSrc: '/images/tshirt-4.png', title: 'Tiki Thunder Tee', price: '$30.00' },
  { id: 5, imageSrc: '/images/tshirt-5.png', title: 'Speed Demon Tee', price: '$27.00' },
  { id: 6, imageSrc: '/images/tshirt-6.png', title: 'Radical Wave Tee', price: '$32.00' },
];

export default function Tshirt() {
  return (
    <div className='tshirts'>


      {/* title */}
      <div className='title'>
        <h1>T-Shirts</h1>
        <div className="vector-line"></div>
      </div>

      {/* products */}
      <div className="product-row">
        {tshirts.map(product => (
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