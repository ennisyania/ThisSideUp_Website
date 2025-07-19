import React from "react";
import { Link } from "react-router-dom";
import "./PopUpCart.css";

export default function PopUpCart({ isOpen, onClose, cartItems, onQuantityChange, onRemoveItem }) {
  if (!isOpen) return null;

  // Manually count total items and total price
  let totalItems = 0;
  let totalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalItems += cartItems[i].quantity;
    totalPrice += cartItems[i].price * cartItems[i].quantity;
  }

  const handleIncrement = (item) => {
    if (onQuantityChange) {
      onQuantityChange(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      const confirmDelete = window.confirm(`Remove ${item.title} from cart?`);
      if (confirmDelete && onRemoveItem) {
        onRemoveItem(item.id);
      }
    } else {
      if (onQuantityChange) {
        onQuantityChange(item.id, item.quantity - 1);
      }
    }
  };

  return (
    <>
      <div className="cart-mask" onClick={onClose}></div>

      <div className="popup-cart" onClick={(e) => e.stopPropagation()}>
        <div className="popup-cart-header">
          Cart &nbsp;&middot;&nbsp; {totalItems}
        </div>

        <div><hr /></div>

        {!Array.isArray(cartItems) || cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty.</div>
        ) : (
          <>
            <div className="popup-cart-items">
              {cartItems.map((item, index) => (
                <Link
                  to={`/productdetail/${item.id}`}
                  key={index}
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
