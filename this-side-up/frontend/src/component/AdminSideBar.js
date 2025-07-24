import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSideBar.css';

export default function AdminSideBar() {
  return (
    <div className="admin-sidebar">
      <img
        src="./adminsidebar.svg"
        alt="Sidebar Decorative Background"
        className="sidebar-bg"
      />

      <div className="sidebar-content">

  <Link to="/admin">
  <img
    src="/ThisSideupwhitelogoadmin.svg"
    alt="ThisSideUp Logo"
    className="admin-logo"
  />
</Link>

  <nav className="admin-nav">
    <Link to="/admin" className="admin-link">
      <img src="/dashboardadminsidebaricon.svg" alt="" className="nav-icon" />
      <span>Dashboard</span>
    </Link>
    <Link to="/admin/products" className="admin-link">
      <img src="/productsadminsidebar.svg" alt="" className="nav-icon" />
      <span>Products</span>
    </Link>
    <Link to="/admin/orders" className="admin-link">
      <img src="/ordersadminsidebar.svg" alt="" className="nav-icon" />
      <span>Orders</span>
    </Link>
    <Link to="/admin/customers" className="admin-link">
      <img src="/customersadminsidebar.svg" alt="" className="nav-icon" />
      <span>Customers</span>
    </Link>
    <Link to="/admin/settings" className="admin-link">
      <img src="/settingsadminicon.svg" alt="" className="nav-icon" />
      <span>Settings</span>
    </Link>
    <Link to="/">
      <span>Back to Homepage</span>
    </Link>
  </nav>
</div>

    </div>
  );
}
