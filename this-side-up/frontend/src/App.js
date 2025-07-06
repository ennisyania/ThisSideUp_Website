// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout Components
import Navbar from './component/Navbar.js';
import Footer from './component/Footer.js';

// Import General Pages
import Homepage from './Homepage.js';
import About from './About.js'; // Corrected: Added .js extension
import Contact from './Contact.js';
import FAQ from './FAQ.js';
import Login from './Login.js';
import Register from './Register.js';
import Profile from './Profile.js';
import CustomerOrderHistory from './CustomerOrderHistory.js';
import NotFound from './NotFound.js';
import ProfileDefaultContent from './ProfileDefaultContent.js'; // Import ProfileDefaultContent

// Import Product/Shop Pages
import Skimboards from './Skimboards.js';
import Boardshorts from './Boardshorts.js';
import Accessories from './Accessories.js';
import Tshirt from './Tshirt.js';
import Jackets from './Jackets.js';
import ProductDetail from './ProductDetail.js';
// import CustomSkimboards from './CustomSkimboards.js'; // Removed as it was unused and causing a warning
// import Cart from './Cart.js'; // REMOVED: Confirmed no Cart.js file exists
import CheckOut from './CheckOut.js';
import Tryouts from './Tryouts.js';

// Import Logout component
import Logout from './Logout.js';

// Import Admin Pages
import Admin from './admin/AAdmin.js';
import AdminProducts from './admin/AProducts.js';
import AdminViewProducts from './admin/AViewProducts.js';
import AdminAddProduct from './admin/AAddProduct.js';
import AdminEditProducts from './admin/AEditProducts.js';
import AdminOrders from './admin/AOrders.js';
import AdminOrderDetail from './admin/AOrderDetail.js';
import AdminCustomers from './admin/ACustomers.js';
import AdminIndividualCustomer from './admin/AIndividualCustomer.js';
import AdminSettings from './admin/ASettings.js';


function App() {

  // Global cart state
  const [cartItems, setCartItems] = useState([]);

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


  
  return (
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Navbar
                cartItems={cartItems}
              />
              <Routes>


                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

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
                <Route
                  path="/customSkimboards"
                  element={<CustomSkimboards />}
                />
              
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <CheckOut cartItems={cartItems || []} handlePlaceOrder={() => { /* implement place order logic here */ }} />

                    </PrivateRoute>
                  }
                />
                <Route path="/tryouts" element={<Tryouts />} />
                {/* Pass setIsLoggedIn to Login component again */}
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected /account route and its nested routes */}
                {/* Profile component acts as the layout for all /account paths */}
                <Route element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}>
                    {/* Index route for /account will render ProfileDefaultContent */}
                    <Route path="/account" element={<ProfileDefaultContent />} />
                    {/* Nested route for order history */}
                    <Route path="/account/order-history" element={<CustomerOrderHistory />} />
                </Route>

                <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />

                {/* Admin Routes with Nested Structure */}
                <Route path="/admin" element={<Admin />}>
                    <Route index element={<AdminProducts />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="viewproducts" element={<AdminViewProducts />} />
                    <Route path="addproduct" element={<AdminAddProduct />} />
                    <Route path="editproducts/:id" element={<AdminEditProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orderdetail/:id" element={<AdminOrderDetail />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="individualcustomer/:id" element={<AdminIndividualCustomer />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route
                  path="/termsAndConditions"
                  element={<TermsAndConditions />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin Routes (no Navbar or Footer) */}
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
          <Route path="viewproducts" element={<AdminViewProducts />} />
          <Route path="addproduct" element={<AdminAddProduct />} />
          <Route path="editproducts/:id" element={<AdminEditProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orderdetail/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route
            path="individualcustomer/:id"
            element={<AdminIndividualCustomer />}
          />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );

}

export default App;

