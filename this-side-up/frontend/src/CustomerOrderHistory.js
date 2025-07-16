// src/CustomerOrderHistory.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Profile.css'; // your shared CSS

const sidebarBgUrl = '/images/AdminSidebar.png';
const wavesBgUrl   = '/images/waves.png';

export default function CustomerOrderHistory() {
  const location = useLocation();

  const orders = [
    { id: '#KX0550', product: 'Blue Inferno',   payment: 'Credit',      status: 'Delivered',  total: '$275' },
    { id: '#KX0551', product: 'Red Flash',      payment: 'PayPal',      status: 'Processing', total: '$300' },
    { id: '#KX0552', product: 'Green Wave',     payment: 'Credit',      status: 'Shipped',    total: '$250' },
    { id: '#KX0553', product: 'Yellow Sunset',  payment: 'Credit',      status: 'Delivered',  total: '$290' },
    { id: '#KX0554', product: 'Purple Haze',    payment: 'Bank Transfer',status: 'Cancelled', total: '$220' },
  ];

  return (
    <div className="customer-profile-container">
      {/* Sidebar */}
      <aside
        className="customer-profile-sidebar"
        style={{
          backgroundImage: `url(${sidebarBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="sidebar-header">
          <h2>My Account</h2>
          <Link to="/logout" className="logout-link">Log out</Link>
        </div>
        <nav className="profile-nav">
          <ul>
            <li>
              <Link
                to="/account"
                className={location.pathname === '/account' ? 'active' : ''}
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/orderhistory"
                className={location.pathname.startsWith('/orderhistory') ? 'active' : ''}
              >
                Order History
              </Link>
              <ul className="order-history-subnav">
                <li>
                  <Link
                    to="/orderhistory/pending"
                    className={location.pathname === '/orderhistory/pending' ? 'active' : ''}
                  >
                    Pending
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orderhistory/cancelled"
                    className={location.pathname === '/orderhistory/cancelled' ? 'active' : ''}
                  >
                    Cancelled
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="customer-profile-main-content">
        {/* Parallelogram wrapper around table */}
        <div className="profile-card order-history-card">
          <table className="order-history-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product Name</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx}>
                  <td>{order.id}</td>
                  <td>{order.product}</td>
                  <td>{order.payment}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
