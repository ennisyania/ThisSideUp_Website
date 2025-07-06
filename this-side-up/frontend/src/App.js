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
    const [cartItems, setCartItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on component mount (e.g., from local storage)
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    // Update local storage when isLoggedIn changes
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    const handleAddToCart = (product, variant = 'Default') => {
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && item.variant === variant
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1,
                };
                return updatedItems;
            } else {
                const itemPrice = typeof product.price === 'string'
                    ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
                    : product.price;

                return [...prevItems, { ...product, price: itemPrice, quantity: 1, variant }];
            }
        });
    };

    const handlePlaceOrder = () => {
        console.log("Placing order with items:", cartItems);
        alert('Order Placed Successfully!');
        setCartItems([]);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        alert('You have been logged out.');
    };

    const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Router>
            <Navbar cartItemCount={totalCartItems} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/skimboards" element={<Skimboards onAddToCart={handleAddToCart} />} />
                <Route path="/boardshorts" element={<Boardshorts onAddToCart={handleAddToCart} />} />
                <Route path="/accessories" element={<Accessories onAddToCart={handleAddToCart} />} />
                <Route path="/tshirt" element={<Tshirt onAddToCart={handleAddToCart} />} />
                <Route path="/jackets" element={<Jackets onAddToCart={handleAddToCart} />} />

                <Route path="/productdetail/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
                <Route path="/productdetail" element={<ProductDetail onAddToCart={handleAddToCart} />} />

                <Route path="/faq" element={<FAQ />} />
                {/* REMOVED: Cart route as Cart.js file does not exist */}
                {/* <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} /> */}

                <Route
                    path="/checkout"
                    element={<CheckOut cartItems={cartItems} handlePlaceOrder={handlePlaceOrder} />}
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

                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
