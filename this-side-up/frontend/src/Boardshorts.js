// src/Boardshorts.js
import React from 'react';
import './products.css';

// Boardshorts now accepts onAddToCart as a prop
export default function Boardshorts({ onAddToCart }) {
    const boardshortProducts = [
        { id: 'boardshort-1', imageSrc: '/images/Boardshorts1.png', title: 'Aqua Stripe Boardshorts', price: 45.00 },
        { id: 'boardshort-2', imageSrc: '/images/Boardshorts2.png', title: 'Sunset Wave Boardshorts', price: 48.00 },
        { id: 'boardshort-3', imageSrc: '/images/Boardshorts1.png', title: 'Deep Blue Boardshorts', price: 45.00 },
        { id: 'boardshort-4', imageSrc: '/images/Boardshorts2.png', title: 'Tropical Bloom Boardshorts', price: 48.00 },
        { id: 'boardshort-5', imageSrc: '/images/Boardshorts1.png', title: 'Classic Navy Boardshorts', price: 45.00 },
        { id: 'boardshort-6', imageSrc: '/images/Boardshorts2.png', title: 'Coral Reef Boardshorts', price: 48.00 },
    ];

    const handleProductClick = (product) => { // NEW function
        const confirmAdd = window.confirm(`Add "${product.title}" to cart?`);
        if (confirmAdd) {
            onAddToCart(product, 'Standard'); // Pass the product and a default variant
            alert(`${product.title} added to cart!`); // Provide feedback
        }
    };

    return (
        <div className='tshirts'> {/* reused tshirt classname cus banner */}
            <section className="hero tshirts-hero-banner">
            </section>

            <div className='title'>
                <h1>Boardshorts</h1>
                <div className="vector-line"></div>
            </div>

            <div className="product-row">
                {boardshortProducts.map(product => (
                    // MODIFIED: Make the entire product-frame clickable
                    <div key={product.id} className="product-frame" onClick={() => handleProductClick(product)}>
                        <img src={product.imageSrc} alt={product.title} className="product-image" />
                        <div className="product-title">{product.title}</div>
                        <div className="product-price">${product.price.toFixed(2)}</div>
                        {/* Removed explicit Add to Cart Button */}
                    </div>
                ))}
            </div>
        </div>
    );
}