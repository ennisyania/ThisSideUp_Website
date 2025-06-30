// src/ProductDetail.js
import React, { useState, useEffect } from 'react';
// Make sure you have this CSS file for styling ProductDetail
// import './ProductDetail.css'; 

// This component expects onAddToCart as a prop
const ProductDetail = ({ onAddToCart }) => {
    // State to hold the selected variant
    const [selectedVariant, setSelectedVariant] = useState('S'); // Default variant

    // Dummy product for demonstration (replace with actual fetching based on URL param or ID)
    const product = {
        id: 'example-product',
        imageSrc: '/images/example-product.png',
        title: 'Stylish Summer Tee',
        price: 29.99,
        description: 'A comfortable and stylish tee perfect for summer days.',
        variants: ['S', 'M', 'L', 'XL'],
    };

    // If product details are fetched, you might update state here
    useEffect(() => {
        // Example: Fetch product details based on a route parameter
        // const productId = new URLSearchParams(window.location.search).get('id');
        // fetchProductDetails(productId).then(data => setProduct(data));
    }, []);

    const handleAddClick = () => {
        if (product && selectedVariant) {
            const confirmAdd = window.confirm(`Add "${product.title} (${selectedVariant})" to cart?`);
            if (confirmAdd) {
                onAddToCart(product, selectedVariant);
                alert(`${product.title} (${selectedVariant}) added to cart!`); // Simple feedback
            }
        }
    };

    return (
        <div className="product-detail-container">
            {/* Keeping the image clickable to potentially view larger image,
                but the primary add to cart is still the button after variant selection.
                If you want the image click to add to cart directly, we'd need to remove the button.
                For now, only the explicit button adds to cart on this page. */}
            <img src={product.imageSrc} alt={product.title} className="product-detail-image" />
            <div className="product-info">
                <h1>{product.title}</h1>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-description">{product.description}</p>

                <div className="product-variants">
                    <label htmlFor="variant-select">Select Variant:</label>
                    <select
                        id="variant-select"
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                    >
                        {product.variants.map(variant => (
                            <option key={variant} value={variant}>{variant}</option>
                        ))}
                    </select>
                </div>

                {/* This button will trigger the confirmation directly */}
                <button onClick={handleAddClick} className="add-to-cart-button">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;