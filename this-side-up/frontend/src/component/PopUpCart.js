import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PopUpCart.css";

export default function PopUpCart({ isOpen, onClose }) {
    //temp data
    const [cartItems, setCartItems] = useState([
        {
            id: "sb001",
            imageSrc: "/images/sample1.png",
            title: "Sample Product 1",
            price: 25.0,
            quantity: 2,
        },
        {
            id: "ts001",
            imageSrc: "/images/sample2.png",
            title: "Sample Product 2",
            price: 40.0,
            quantity: 1,
        },
    ]);

    if (!isOpen) return null;

    const handleIncrement = (item) => {
        setCartItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        );
    };

    const handleDecrement = (item) => {
        if (item.quantity === 1) {
            const confirmDelete = window.confirm(`Remove ${item.title} from cart?`);
            if (!confirmDelete) return;
        }

        setCartItems((prev) =>
            item.quantity === 1
                ? prev.filter((i) => i.id !== item.id)
                : prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                )
        );
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <>
            <div className="cart-mask" onClick={onClose}></div>

            <div className="popup-cart" onClick={(e) => e.stopPropagation()}>
                <div className="popup-cart-header">
                    Cart &nbsp;&middot;&nbsp; {totalItems}
                </div>

                <div><hr /></div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">Your cart is empty.</div>
                ) : (
                    <>
                        <div className="popup-cart-items">
                            {cartItems.map((item) => (
                                <Link
                                    to={`/productdetail/${item.id}`}
                                    key={item.id}
                                    className="cart-item-link"
                                    onClick={onClose}
                                >
                                    <img
                                        src={item.imageSrc}
                                        alt={item.title}
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <div className="cart-item-title">{item.title}</div>
                                        <div className="button-and-price">
                                        <div className="cart-item-price">
                                            ${item.price.toFixed(2)}
                                        </div>

                                        <div className="quantity-btn-div">
                                            <div className="cart-item-quantity">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDecrement(item);
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <div className="quantity-number">{item.quantity}</div>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleIncrement(item);
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div><hr /></div>

                        <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>

                        <Link
                            to="/checkout"
                            className="checkout-btn"
                            onClick={onClose}
                        >
                            Checkout
                        </Link>
                    </>
                )}
            </div>
        </>
    );
}
