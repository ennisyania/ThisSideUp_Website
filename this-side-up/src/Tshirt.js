import React from 'react';
import { Link } from 'react-router-dom';

const productListStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  padding: '20px',
  backgroundColor: '#F8FAF5', 
};

const productCardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  textAlign: 'center',
};

const imageStyles = {
  maxWidth: '100%',
  height: 'auto',
  marginBottom: '10px',
};

const linkStyles = {
  textDecoration: 'none',
  color: 'inherit',
};

function ShirtList({ shirts }) {
  return (
    <div style={productListStyles}>
      {shirts.map((shirt) => (
        <div key={shirt.id} style={productCardStyles}>
          <Link to={`/products/${shirt.id}`} style={linkStyles}>
            <img src={shirt.image} alt={shirt.name} style={imageStyles} />
            <h3>{shirt.name}</h3>
            <p>${shirt.price.toFixed(2)}</p>
          </Link>
          <button onClick={() => handleAddToCart(shirt)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

function handleAddToCart(product) {
  console.log(`Added ${product.name} to cart`);
}

export default ShirtList;