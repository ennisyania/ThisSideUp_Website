import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import AuthContext from './context/AuthContext';
import './CheckOut.css';

export default function CheckoutCS({ handlePlaceOrder }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token } = useContext(AuthContext);

    const [availableCodes, setAvailableCodes] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [siteDiscount, setSiteDiscount] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    // Receive skimboardData from CustomSkimboards page
    const skimboardData = location.state || {};

    // Destructure to get form data, totalPrice, images
    const { form = {}, totalPrice = 0, images = [] } = skimboardData;

    // Contact & Shipping fields
    const [contactEmail, setContactEmail] = useState('');
    const [countryRegion, setCountryRegion] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [aptSuiteEtc, setAptSuiteEtc] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [newsAndOffers, setNewsAndOffers] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [nameOnCard, setNameOnCard] = useState('');

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/settings/discounts');
                const data = await res.json();
                setAvailableCodes(data.codes || []);
                setSiteDiscount(data.siteDiscount || 0);
            } catch (err) {
                console.error('Failed to load discounts:', err);
            }
        };
        fetchDiscounts();
    }, []);

    const handleApplyDiscount = () => {
        const code = availableCodes.find(c => c.code === discountCode.trim().toUpperCase());
        if (code) {
            setAppliedDiscount(code.value);
            alert(`Discount code applied: $${code.value.toFixed(2)} off`);
        } else {
            setAppliedDiscount(0);
            alert('Invalid discount code.');
        }
    };

    useEffect(() => {
        // Try to fill form with user info if available
        const fetchUserProfile = async () => {
            try {
                if (!token) return;

                const res = await fetch('http://localhost:5000/api/user/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch user profile');
                const data = await res.json();

                setContactEmail(data.email || '');
                setCountryRegion(data.address?.country || '');
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setAddress(data.address?.street || '');
                setPostalCode(data.address?.zip || '');
                setPhone(data.phone || '');
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserProfile();
    }, [token]);

    // Shipping cost (simple fixed)
    const shippingCost = shippingMethod === 'express' ? 10 : 5;

    // Store discount amount (percentage)
    const storeDiscountAmount = ((totalPrice + shippingCost) * (siteDiscount / 100));

    // Total amount including shipping and discounts
    const total = totalPrice + shippingCost - appliedDiscount - storeDiscountAmount;

    // Payment and order submission
    const handlePaynowClick = async () => {
        if (!stripe || !elements) return;

        if (!contactEmail || !firstName || !lastName || !address || !postalCode || !phone || !nameOnCard) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Create payment intent on backend with total * 100 (cents)
            const res = await fetch('http://localhost:5000/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Math.round(total * 100), email: user.email }),
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
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                // Prepare order payload for ordersCS collection
                const orderPayload = {
                    userId: user._id,
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
                    discountCode: discountCode.trim() || null,
                    appliedDiscount,
                    siteDiscount,
                    laborCost: 0, // add your laborCost if applicable
                    subtotal: totalPrice,
                    shippingCost,
                    total,
                    form,
                    images,
                    paymentIntentId: result.paymentIntent.id,
                    placedAt: new Date(),
                    orderStatus: 'pending',
                };

                // Post order to your custom ordersCS backend route
                const orderRes = await fetch('http://localhost:5000/api/ordersCS', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderPayload),
                });

                const data = await orderRes.json();
                if (!orderRes.ok) {
                    throw new Error(data.message || 'Failed to place custom skimboard order');
                }

                if (handlePlaceOrder) handlePlaceOrder();

                navigate('/orderhistory');
            }
        } catch (error) {
            console.error('Order submission error:', error.message);
            alert(`Order submission failed: ${error.message}`);
        }
    };

    return (
        <div className="checkout-page-container">
            <div className="checkout-content-wrapper">
                <div className="checkout-left-column">
                    {/* Contact */}
                    <section className="checkout-section contact-section">
                        <h2>Contact</h2>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                        </div>
                    </section>

                    {/* Delivery */}
                    <section className="checkout-section delivery-section">
                        <h2>Delivery</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Country/Region"
                                value={countryRegion}
                                onChange={(e) => setCountryRegion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group-row">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Apartment, suite, etc. (optional)"
                                value={aptSuiteEtc}
                                onChange={(e) => setAptSuiteEtc(e.target.value)}
                            />
                        </div>
                        <div className="form-group-row">
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </section>

                    {/* News and Offers */}
                    <div className="checkbox-group" style={{ paddingLeft: '30px', paddingRight: '30px', marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            id="newsAndOffers"
                            checked={newsAndOffers}
                            onChange={(e) => setNewsAndOffers(e.target.checked)}
                        />
                        <label htmlFor="newsAndOffers">Email me with news and offers</label>
                    </div>

                    {/* Shipping Method */}
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

                    {/* Payment */}
                    <section className="checkout-section payment-section">
                        <h2>Payment</h2>
                        <div className="payment-image-container">
                            <img src="/images/Payment.png" alt="Payment Methods" className="payment-methods-img" />
                        </div>
                        <div className="form-group">
                            <CardElement options={{
                                style: {
                                    base: { fontSize: '16px', color: '#110F0F' },
                                    invalid: { color: '#E86540' },
                                }
                            }} />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Name on card"
                                value={nameOnCard}
                                onChange={(e) => setNameOnCard(e.target.value)}
                                required
                            />
                        </div>
                        <button onClick={handlePaynowClick} className="paynow-button"><span>Paynow</span></button>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="checkout-right-column">
                    <section className="order-summary-section">
                        <h2>Order Summary</h2>

                        <div>
                            <h3>Custom Skimboard Details</h3>
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.5 }}>
                                {Object.entries(form).map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || 'N/A'}
                                    </div>
                                ))}
                            </div>

                            <h4 style={{ marginTop: 12 }}>Uploaded Images</h4>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {images.map((url, i) => (
                                    <img
                                        key={i}
                                        src={url}
                                        alt={`Custom Skimboard Reference ${i + 1}`}
                                        style={{ maxWidth: 100, maxHeight: 100, borderRadius: 5 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Discount code input and apply */}
                        <div className="discount-code-section" style={{ marginTop: 20 }}>
                            <input
                                type="text"
                                placeholder="Discount code or gift card"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="discount-input"
                                style={{ padding: '8px', width: '60%', borderRadius: 4, border: '1px solid #ccc' }}
                            />
                            <button onClick={handleApplyDiscount} className="apply-button" style={{ marginLeft: 8, padding: '8px 16px' }}>
                                Apply
                            </button>
                        </div>

                        <div className="summary-breakdown" style={{ marginTop: 20 }}>
                            <div className="summary-line">
                                <span>Customization Price</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Shipping</span>
                                <span>${shippingCost.toFixed(2)}</span>
                            </div>
                            {siteDiscount > 0 && (
                                <div className="summary-line discount-line">
                                    <span>Store Discount ({siteDiscount}%)</span>
                                    <span>- ${storeDiscountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            {appliedDiscount > 0 && (
                                <div className="summary-line discount-line">
                                    <span>Code Discount</span>
                                    <span>- ${appliedDiscount.toFixed(2)}</span>
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
}
