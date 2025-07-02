// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Removed useNavigate import here

// Import Layout Components
import Navbar from './component/Navbar.js';
import Footer from './component/Footer.js';

// Import General Pages
import Homepage from './Homepage.js';
import About from './About.js';
import Contact from './Contact.js';
import FAQ from './FAQ.js';
import Login from './Login.js';
import Register from './Register.js';
import Profile from './Profile.js';
import CustomerOrderHistory from './CustomerOrderHistory.js';
import NotFound from './NotFound.js'; // Generic 404 page

// Import Product/Shop Pages
import Skimboards from './Skimboards.js';
import Boardshorts from './Boardshorts.js';
import Accessories from './Accessories.js';
import Tshirt from './Tshirt.js';
import Jackets from './Jackets.js';
import ProductDetail from './ProductDetail.js';
import CustomSkimboards from './CustomSkimboards.js';
import Cart from './Cart.js';
import CheckOut from './CheckOut.js';
import Tryouts from './Tryouts.js';

// NEW: Import Logout component
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
    // NEW: State to track user login status
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Removed: const navigate = useNavigate(); from here

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

    // Function to handle the final order placement
    const handlePlaceOrder = () => {
        // In a real application, you would send cartItems and user details to a backend here.
        console.log("Placing order with items:", cartItems);
        alert('Order Placed Successfully!'); // Simpler confirmation
        setCartItems([]); // Clear the cart after order is placed
    };

    // NEW: Function to handle user logout - removed navigation from here
    const handleLogout = () => {
        setIsLoggedIn(false); // Set login status to false
        alert('You have been logged out.'); // Inform the user
        // Removed: navigate('/'); // Redirection now handled by Logout.js
    };

    const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Router>
            {/* Pass isLoggedIn and handleLogout to Navbar for conditional display */}
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
                <Route path="/productdetail" element={<ProductDetail onAddToCart={handleAddToCart} />} /> {/* Fallback */}

                <Route path="/faq" element={<FAQ />} />
                <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />

                <Route
                    path="/checkout"
                    element={<CheckOut cartItems={cartItems} handlePlaceOrder={handlePlaceOrder} />}
                />
                
                <Route path="/tryouts" element={<Tryouts />} />
                {/* Pass setIsLoggedIn to Login component */}
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customSkimboards" element={<CustomSkimboards />} />
                <Route path="/myProfile" element={<Profile />} />
                <Route path="/orderhistory" element={<CustomerOrderHistory />} />

                {/* NEW: Logout Route */}
                <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />

                {/* Admin Routes with Nested Structure */}
                <Route path="/admin" element={<Admin />}>
                    <Route index element={<AdminProducts />} /> {/* Default child route for /admin */}
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="viewproducts" element={<AdminViewProducts />} />
                    <Route path="addproduct" element={<AdminAddProduct />} />
                    <Route path="editproducts/:id" element={<AdminEditProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orderdetail/:id" element="<AdminOrderDetail />" />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="individualcustomer/:id" element={<AdminIndividualCustomer />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<NotFound />} /> {/* Catch-all for undefined routes */}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
