// src/Jackets.js
import React from 'react';
import './products.css';

// Jackets now accepts onAddToCart as a prop
export default function Jackets({ onAddToCart }) { // MODIFIED: Accept onAddToCart prop
    const jackets = [
        { id: 1, imageSrc: '/images/tshirt-1.png', title: 'Skull Ripper Jacket', price: '$85.00' },
        { id: 2, imageSrc: '/images/tshirt-2.png', title: 'Diamond Beast Hoodie', price: '$95.00' },
        { id: 3, imageSrc: '/images/tshirt-3.png', title: 'Death Grip Windbreaker', price: '$75.00' },
        { id: 4, imageSrc: '/images/tshirt-4.png', title: 'Tiki Thunder Jacket', price: '$110.00' },
        { id: 5, imageSrc: '/images/tshirt-5.png', title: 'Speed Demon Hoodie', price: '$80.00' },
        { id: 6, imageSrc: '/images/tshirt-6.png', title: 'Radical Wave Bomber', price: '$120.00' },
    ];

    const handleProductClick = (product) => { // NEW function
        const confirmAdd = window.confirm(`Add "${product.title}" to cart?`);
        if (confirmAdd) {
            // Note: Jackets array uses string price, but onAddToCart expects number.
            // You might need to parse it if your cart system expects numbers.
            onAddToCart(product, 'Standard'); // Assuming 'Standard' as a default variant
            alert(`${product.title} added to cart!`); // Provide feedback
        }
    };

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