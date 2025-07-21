// src/CheckOut.js
import { useNavigate } from 'react-router-dom';
import {
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import React, { useState, useContext } from 'react';
import './CheckOut.css';


import AuthContext from './context/AuthContext'; // Import the context, not the provider





export default function CheckOut({ cartItems, handlePlaceOrder }) { // Receive cartItems and handlePlaceOrder as props
    // State for form fields
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { nanoid } = require('nanoid');
    const { token } = useContext(AuthContext);

    const [contactEmail, setContactEmail] = useState('');
    const [countryRegion, setCountryRegion] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [aptSuiteEtc, setAptSuiteEtc] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [newsAndOffers, setNewsAndOffers] = useState(false); // State for the checkbox

    const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'express'

    const [nameOnCard, setNameOnCard] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0); // Store discount amount


    // Calculate subtotal - robust against undefined cartItems
    const calculateSubtotal = () => {
        if (!Array.isArray(cartItems)) {
            console.error("cartItems is not an array:", cartItems);
            return 0;
        }
        return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    };

    // Calculate shipping cost based on selected method
    const calculateShippingCost = () => {
        if (shippingMethod === 'express') {
            return 10.00; // Example express shipping cost
        }
        return 5.00; // Example standard shipping cost
    };

    const subtotal = calculateSubtotal();
    const shippingCost = calculateShippingCost();
    const total = subtotal + shippingCost - appliedDiscount;

    // Handle Apply Discount button click
    const handleApplyDiscount = () => {
        // Dummy discount logic: apply a fixed discount for a specific code
        if (discountCode === 'DISCOUNT10') {
            setAppliedDiscount(10.00); // Apply $10 discount
            alert('Discount applied!');
        } else {
            setAppliedDiscount(0);
            alert('Invalid discount code.');
        }
    };




    // Handle Paynow button click
    const handlePaynowClick = async () => {
        if (!stripe || !elements) return;

        if (!contactEmail || !firstName || !lastName || !address || !postalCode || !phone || !nameOnCard) {
            alert('Please fill in all required fields.');
            return;
        }
        const res = await fetch('http://localhost:5000/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total * 100 , email:user.email}), // amount in cents
        });

        const { clientSecret } = await res.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: nameOnCard,
                    email: contactEmail,
                },
            },
        });

        if (result.error) {
            alert(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
            const orderPayload = {
                orderId: `odr_${nanoid(6)}`,
                contactEmail,
                countryRegion,
                firstName,
                lastName,
                address,
                aptSuiteEtc,
                postalCode,
                phone,
                newsAndOffers,
                shippingMethod,
                discountCode,
                appliedDiscount,
                subtotal,
                shippingCost,
                total,
                placedAt: new Date(),
                items: cartItems.map(item => ({
                    productId: item.id,
                    size: item.size || item.variant || 'Default',
                    quantity: item.quantity || 1
                }))
            };

            try {
                const res = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}`, 
                    },
                    body: JSON.stringify(orderPayload),
                });


                const data = await res.json();
                console.log('Order API response:', data);

                if (!res.ok) {
                    console.error('Backend responded with error:', data.message || data.error || 'Unknown error');
                    throw new Error(data.message || data.error || 'Failed to place order');
                }

                console.log('Order success:', data);
            } catch (error) {
                console.error('Order submission error:', error.message);
            }
            handlePlaceOrder();
            navigate('/orderhistory');
        }
    };




    return (
        <div className="checkout-page-container">
            <div className="checkout-content-wrapper">
                {/* Left Column: Contact, Delivery, Shipping, Payment */}
                <div className="checkout-left-column">
                    {/* Contact Section */}
                    <section className="checkout-section contact-section">
                        <h2>Contact</h2>
                        <div className="form-group">
                            <input
                                type="email"
                                id="contactEmail"
                                placeholder="Email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                        </div>
                        {/* Moved checkbox from here */}
                    </section>

                    {/* Delivery Section */}
                    <section className="checkout-section delivery-section">
                        <h2>Delivery</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                id="countryRegion"
                                placeholder="Country/Region"
                                value={countryRegion}
                                onChange={(e) => setCountryRegion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group-row">
                            <input
                                type="text"
                                id="firstName"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="address"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="aptSuiteEtc"
                                placeholder="Apartment, suite, etc. (optional)"
                                value={aptSuiteEtc}
                                onChange={(e) => setAptSuiteEtc(e.target.value)}
                            />
                        </div>
                        <div className="form-group-row">
                            <input
                                type="text"
                                id="postalCode"
                                placeholder="Postal code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                            <input
                                type="tel"
                                id="phone"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </section>

                    {/* News and Offers Checkbox - MOVED HERE */}
                    <div className="checkbox-group" style={{ paddingLeft: '30px', paddingRight: '30px', marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            id="newsAndOffers"
                            checked={newsAndOffers}
                            onChange={(e) => setNewsAndOffers(e.target.checked)}
                        />
                        <label htmlFor="newsAndOffers">Email me with news and offers</label>
                    </div>

                    {/* Shipping Method Section */}
                    <section className="checkout-section shipping-method-section">
                        <h2>Shipping method</h2>
                        <div className="shipping-options">
                            <label className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="express"
                                    checked={shippingMethod === 'express'}
                                    onChange={() => setShippingMethod('express')}
                                />
                                <div className="shipping-details">
                                    <span>TNT Express Worldwide</span>
                                    <span>$10.00</span>
                                </div>
                            </label>
                            <label className={`shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="standard"
                                    checked={shippingMethod === 'standard'}
                                    onChange={() => setShippingMethod('standard')}
                                />
                                <div className="shipping-details">
                                    <span>UPS Standard Ground&reg;</span>
                                    <span>$5.00</span>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Payment Section */}
                    <section className="checkout-section payment-section">
                        <h2>Payment</h2>
                        <div className="payment-image-container">
                            <img src="/images/Payment.png" alt="Payment Methods" className="payment-methods-img" />
                        </div>
                        <div className="form-group">
                            <div className="form-group">
                                <CardElement options={{
                                    style: {
                                        base: { fontSize: '16px', color: '#110F0F' },
                                        invalid: { color: '#E86540' },
                                    }
                                }} />
                            </div>

                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="nameOnCard"
                                placeholder="Name on card"
                                value={nameOnCard}
                                onChange={(e) => setNameOnCard(e.target.value)}
                                required
                            />
                        </div>
                        <button onClick={handlePaynowClick} className="paynow-button"><span>Paynow</span></button>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="checkout-right-column">
                    <section className="order-summary-section">
                        <h2>Order Summary</h2>
                        <div className="order-items-list">
                            {!Array.isArray(cartItems) || cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id + (item.variant || '')} className="order-summary-item">
                                        {item.imageSrc && <img src={item.imageSrc} alt={item.title} className="order-item-image" />}
                                        <div className="order-item-details">
                                            <div className="order-item-title">{item.title}</div>
                                            {item.variant && item.variant !== 'Default' && <div className="order-item-variant">{item.variant}</div>}
                                        </div>
                                        <div className="order-item-quantity">x{item.quantity}</div>
                                        <div className="order-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="discount-code-section">
                            <input
                                type="text"
                                placeholder="Discount code or gift card"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="discount-input"
                            />
                            <button onClick={handleApplyDiscount} className="apply-button"><span>Apply</span></button>
                        </div>

                        <div className="summary-breakdown">
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Shipping</span>
                                <span>${shippingCost.toFixed(2)}</span>
                            </div>
                            {appliedDiscount > 0 && (
                                <div className="summary-line discount-line">
                                    <span>Discount</span>
                                    <span>-${appliedDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary-line total-line">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

    );
};
