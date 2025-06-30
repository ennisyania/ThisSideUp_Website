// src/CheckOut.js
import React from 'react'; // Removed useState as it is not directly used in this component
import { Link, useNavigate } from 'react-router-dom';
import './CheckOut.css'; // Correct path assuming CheckOut.css is in src/

export default function CheckOut({ cartItems, handlePlaceOrder }) {
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const shippingCost = 5.00; // Example fixed shipping cost
  const total = calculateSubtotal() + shippingCost;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="order-items">
              {cartItems.map(item => (
                <li key={item.id + item.variant} className="order-item">
                  <span>{item.title} ({item.variant}) x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="summary-details">
            <p>Subtotal: <span>${calculateSubtotal().toFixed(2)}</span></p>
            <p>Shipping: <span>${shippingCost.toFixed(2)}</span></p>
            <p className="total">Total: <span>${total.toFixed(2)}</span></p>
          </div>
        </div>

        <div className="shipping-payment-form">
          <h3>Shipping Information</h3>
          <form className="shipping-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" required />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" required />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input type="text" id="postalCode" required />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" required />
            </div>
          </form>

          <h3>Payment Information</h3>
          <form className="payment-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" required />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input type="text" id="expiryDate" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" required />
            </div>
            <button type="button" onClick={handlePlaceOrder} className="place-order-button">Place Order</button>
          </form>
        </div>
      </div>
      <Link to="/cart" className="back-to-cart">Back to Cart</Link>
    </div>
  );
}