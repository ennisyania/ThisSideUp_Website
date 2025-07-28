import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PrivateRoute from './component/PrivateRoute.js';
import ProtectedAdminRoute from './component/ProtectedAdminRoute.js';

import Navbar from './component/Navbar.js';
import Footer from './component/Footer.js';
import AdminLayout from './component/AdminLayout.js';
import PopUpCart from './component/PopUpCart.js';

// General Pages
import Homepage from './Homepage.js';
import About from './About.js';
import Contact from './Contact.js';
import FAQ from './FAQ.js';
import Login from './Login.js';
import Logout from './Logout.js';
import Register from './Register.js';
import Profile from './Profile.js';
import CustomerOrderHistory from './CustomerOrderHistory.js';
import NotFound from './NotFound.js';

// Product/Shop Pages
import Skimboards from './Skimboards.js';
import Boardshorts from './Boardshorts.js';
import Accessories from './Accessories.js';
import Tshirt from './Tshirt.js';
import Jackets from './Jackets.js';
import ProductDetail from './ProductDetail.js';
import CustomSkimboards from './CustomSkimboards.js';

import CheckoutCS from './CheckoutCS.js';
import CheckOut from './CheckOut.js';
import Tryouts from './Tryouts.js';

import PrivacyPolicy from './PrivacyPolicy.js';
import TermsAndConditions from './TermsAndConditions.js';

// Admin Pages
import Admin from './admin/AAdmin.js';
import AdminProducts from './admin/AProducts.js';
import AdminOrders from './admin/AOrders.js';
import AdminCustomers from './admin/ACustomers.js';
import AdminSettings from './admin/ASettings.js';

const stripePromise = loadStripe('pk_test_51RmwlwRuckXf5vemNjbtW6va56XmNAWtu5QkaTVuuP84itTAQOFS7T5IOhxjV8WEtPxsIh18NATN5Zvt0NsvTXjK00qkuk3udr');

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.title = "This Side Up";

    const link =
      document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = '/whitelogofooter.svg';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === productToAdd.id &&
          item.variant === productToAdd.variant
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id &&
            item.variant === productToAdd.variant
            ? { ...item, quantity: item.quantity + productToAdd.quantity }
            : item
        );
      } else {
        return [...prevItems, productToAdd];
      }
    });
  };

 const handleQuantityChange = (itemId, variant, newQuantity) => {
  setCartItems((prevItems) =>
    prevItems.map((item) =>
      item.id === itemId && item.variant === variant
        ? { ...item, quantity: newQuantity }
        : item
    )
  );
};


const handleRemoveItem = (itemId, variant) => {
  setCartItems((prevItems) =>
    prevItems.filter((item) =>
      !(item.id === itemId && item.variant === variant)
    )
  );
};

  const handleCartOpen = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);

  return (
    <Router>
      <PopUpCart
        isOpen={isCartOpen}
        onClose={handleCartClose}
        cartItems={cartItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
      />

      <Routes>
        <Route
          path="*"
          element={
            <>
              <Navbar
                cartItems={cartItems}
                onCartClick={handleCartOpen}
              />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />

                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/myProfile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orderhistory"
                  element={
                    <PrivateRoute>
                      <CustomerOrderHistory />
                    </PrivateRoute>
                  }
                />
                <Route path="/skimboards" element={<Skimboards />} />
                <Route path="/boardshorts" element={<Boardshorts />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/tshirt" element={<Tshirt />} />
                <Route path="/jackets" element={<Jackets />} />
                <Route
                  path="/productdetail/:productId"
                  element={
                    <ProductDetail onAddToCart={handleAddToCart} />
                  }
                />
                <Route path="/customSkimboards" element={<CustomSkimboards />} />

                <Route
                  path="/checkoutCS"
                  element={
                    <PrivateRoute>
                      <Elements stripe={stripePromise}>
                        <CheckoutCS />
                      </Elements>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Elements stripe={stripePromise}>
                        <CheckOut
                          cartItems={cartItems}
                          handlePlaceOrder={() => {
                            setCartItems([]);
                            alert("Your order has been placed!");
                          }}
                        />
                      </Elements>
                    </PrivateRoute>
                  }
                />

                <Route path="/tryouts" element={<Tryouts />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/termsAndConditions" element={<TermsAndConditions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
