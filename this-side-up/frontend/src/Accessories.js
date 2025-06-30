// src/Accessories.js
import React from 'react';
import './products.css'; // Assuming products.css is in the same directory

// Accessories now accepts onAddToCart as a prop
export default function Accessories({ onAddToCart }) {
    const accessoryProducts = [
        { id: 'accessory-1', imageSrc: '/images/Backpack.png', title: 'Surf Adventure Backpack', price: 79.00 },
        { id: 'accessory-2', imageSrc: '/images/Board-bag.png', title: 'Premium Board Bag', price: 120.00 },
        { id: 'accessory-3', imageSrc: '/images/Board-sock.png', title: 'Protective Board Sock', price: 35.00 },
        { id: 'accessory-4', imageSrc: '/images/Sun-hat.png', title: 'Beach Day Sun Hat', price: 28.00 },
        // You can add more accessory items here following the same structure
    ];

    const handleProductClick = (product) => { // NEW function
        const confirmAdd = window.confirm(`Add "${product.title}" to cart?`);
        if (confirmAdd) {
            onAddToCart(product, 'Standard'); // Pass the product and a default variant
            alert(`${product.title} added to cart!`); // Provide feedback
        }
    };

    return (
        <div className='accessories'>
            <section className="hero accessories-hero-banner"></section>
            {/* title */}
            <div className='title'>
                <h1>Accessories</h1>
                <div className="vector-line"></div>
            </div>

            <div className="product-row"> {/* Using product-row as defined in your CSS */}
                {accessoryProducts.map(product => (
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