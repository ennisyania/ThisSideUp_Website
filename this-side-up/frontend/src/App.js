import React from 'react';
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
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/skimboards" element={<Skimboards />} />
        <Route path="/boardshorts" element={<Boardshorts />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/tshirt" element={<Tshirt />} />
        <Route path="/jackets" element={<Jackets />} />
        <Route path="/productdetail/:productId" element={<ProductDetail />} />

        <Route path="/faq" element={<FAQ />} />
        <Route path="/cart" element={<Cart />} />
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
