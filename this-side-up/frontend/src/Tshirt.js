// src/Tshirt.js
import React from 'react';
import './products.css';

// Tshirt now accepts onAddToCart as a prop
export default function Tshirt({ onAddToCart }) { // MODIFIED: Accept onAddToCart prop
    const tshirts = [
        { id: 1, imageSrc: '/images/tshirt-1.png', title: 'Skull Ripper Tee', price: '$25.00' },
        { id: 2, imageSrc: '/images/tshirt-2.png', title: 'Diamond Beast Tee', price: '$28.00' },
        { id: 3, imageSrc: '/images/tshirt-3.png', title: 'Death Grip Tee', price: '$25.00' },
        { id: 4, imageSrc: '/images/tshirt-4.png', title: 'Tiki Thunder Tee', price: '$30.00' },
        { id: 5, imageSrc: '/images/tshirt-5.png', title: 'Speed Demon Tee', price: '$27.00' },
        { id: 6, imageSrc: '/images/tshirt-6.png', title: 'Radical Wave Tee', price: '$32.00' },
    ];

    const handleProductClick = (product) => { // NEW function
        const confirmAdd = window.confirm(`Add "${product.title}" to cart?`);
        if (confirmAdd) {
            // Note: T-shirts array uses string price, but onAddToCart expects number.
            // You might need to parse it if your cart system expects numbers.
            onAddToCart(product, 'Standard'); // Assuming 'Standard' as a default variant
            alert(`${product.title} added to cart!`); // Provide feedback
        }
    };

    return (
        <div className='tshirts'>
            <section className="hero tshirts-hero-banner">
            </section>
            {/* title */}
            <div className='title'>
                <h1>T-Shirts</h1>
                <div className="vector-line"></div>
            </div>

            {/* products */}
            <div className="product-row">
                {tshirts.map(product => (
                    // MODIFIED: Make the entire product-frame clickable
                    <div key={product.id} className="product-frame" onClick={() => handleProductClick(product)}>
                        <img src={product.imageSrc} alt={product.title} className="product-image" />
                        <div className="product-title">{product.title}</div>
                        <div className="product-price">{product.price}</div>
                        {/* Removed explicit Add to Cart Button */}
                    </div>
                ))}
            </div>
        </div>
    );
}