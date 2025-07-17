// src/Profile.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import ProfileDefaultContent from './ProfileDefaultContent';
import CustomerOrderHistory  from './CustomerOrderHistory';


import './Profile.css';

export default function Profile() {
  const location = useLocation();
  const path = location.pathname; // e.g. "/myProfile", "/orderhistory", etc.

  // Decide which panel to show
  let content;
  if (path.startsWith('/orderhistory/cancelled')) {
    content = <CustomerOrderHistory filter="Cancelled" />;
  } else if (path.startsWith('/orderhistory/pending')) {
    content = <CustomerOrderHistory filter="Pending" />;
  } else if (path.startsWith('/orderhistory')) {
    content = <CustomerOrderHistory />;
  } else {
    content = <ProfileDefaultContent />;
  }

  // Public URLs for images (in your public/images folder)
  const sidebarBgUrl = `${process.env.PUBLIC_URL}/images/AdminSidebar.png`;
  const wavesBgUrl   = `${process.env.PUBLIC_URL}/images/waves.png`;

  return (
    <div className="customer-profile-container">
      {/* Sidebar */}
      <aside
        className="customer-profile-sidebar"
        style={{
          backgroundImage: `url(${sidebarBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
                to="/myProfile"
                className={path === '/myProfile' ? 'active' : ''}
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/orderhistory"
                className={path.startsWith('/orderhistory') ? 'active' : ''}
              >
                Order History
              </Link>
              <ul className="order-history-subnav">
                <li>
                  <Link
                    to="/orderhistory/pending"
                    className={path === '/orderhistory/pending' ? 'active' : ''}
                  >
                    Pending
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orderhistory/cancelled"
                    className={path === '/orderhistory/cancelled' ? 'active' : ''}
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
        {/* Half‐wave overlay */}
        <img
        src={wavesBgUrl}
        alt=""
        className="wave-img"
        />


        {content}
      </main>
    </div>
  );
}
