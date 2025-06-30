import React, { useState } from 'react'; // MODIFIED: Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './component/Navbar.js';
import Footer from './component/Footer.js';

import Homepage from './Homepage.js';
import About from './About.js';
import Contact from './Contact.js';
import FAQ from './FAQ.js';
import Login from './Login.js';
import Register from './Register.js';
import Profile from './Profile.js';
import CustomerOrderHistory from './CustomerOrderHistory.js';

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

import NotFound from './NotFound.js';

function App() {
    // NEW: State to hold cart items
    const [cartItems, setCartItems] = useState([]);

    // NEW: Function to add item to cart
    const handleAddToCart = (product, variant = 'Default') => {
        setCartItems((prevItems) => {
            // Check if the item (with the same ID and variant) already exists in the cart
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id && item.variant === variant
            );

            if (existingItemIndex > -1) {
                // If it exists, create a new array with updated quantity for that item
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1,
                };
                return updatedItems;
            } else {
                // If it doesn't exist, add the new item to the cart with quantity 1
                // Ensure price is a number for calculations later (e.g., in Cart.js)
                const itemPrice = typeof product.price === 'string'
                    ? parseFloat(product.price.replace(/[^0-9.-]+/g,"")) // Remove non-numeric, convert to float
                    : product.price;

                return [...prevItems, { ...product, price: itemPrice, quantity: 1, variant }];
            }
        });
        // console.log("Current cart items:", cartItems); // Optional: For debugging, can remove later
    };

    // Calculate total item count for Navbar (e.g., for a cart icon badge)
    const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Router>
            {/* MODIFIED: Pass cartItemCount to Navbar */}
            <Navbar cartItemCount={totalCartItems} />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* MODIFIED: Pass handleAddToCart to product listing pages */}
                <Route path="/skimboards" element={<Skimboards onAddToCart={handleAddToCart} />} />
                <Route path="/boardshorts" element={<Boardshorts onAddToCart={handleAddToCart} />} />
                <Route path="/accessories" element={<Accessories onAddToCart={handleAddToCart} />} />
                <Route path="/tshirt" element={<Tshirt onAddToCart={handleAddToCart} />} />
                <Route path="/jackets" element={<Jackets onAddToCart={handleAddToCart} />} />
                
                {/* ProductDetail usually needs an ID, example path below */}
                {/* MODIFIED: Pass handleAddToCart to ProductDetail */}
                <Route path="/productdetail/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />

                <Route path="/faq" element={<FAQ />} />
                {/* MODIFIED: Pass cartItems and setCartItems to Cart */}
                <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
                <Route path="/checkout" element={<CheckOut />} />
                <Route path="/tryouts" element={<Tryouts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customSkimboards" element={<CustomSkimboards />} />
                <Route path="/myProfile" element={<Profile />} />
                <Route path="/orderhistory" element={<CustomerOrderHistory />} />

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