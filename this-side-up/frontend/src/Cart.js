import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems, onQuantityChange, onRemoveItem }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h1>Your Cart</h1>
        <div className="vector-line"></div>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-cart-page-message">
          <p>Your shopping cart is empty.</p>
          <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id + item.variant} className="cart-item-full-page">
                <img src={item.imageSrc} alt={item.title} className="cart-item-image-full-page" />
                <div className="cart-item-details-full-page">
                  <div className="cart-item-title-full-page">{item.title}</div>
                  <div className="cart-item-variant-full-page">Variant: {item.variant}</div>
                  <div className="cart-item-controls-full-page">
                    <button onClick={() => onQuantityChange(item.id, item.variant, Math.max(1, item.quantity - 1))}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onQuantityChange(item.id, item.variant, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-remove-full-page">
                    <button onClick={() => onRemoveItem(item.id, item.variant)}>Remove</button>
                  </div>
                </div>
                <div className="cart-item-price-full-page">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row total-row"><span>Total:</span><span>${subtotal.toFixed(2)}</span></div>
            <Link to="/checkout" className="proceed-to-checkout-button">Proceed to Checkout</Link>
            <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
