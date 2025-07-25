// src/Profile.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import ProfileDefaultContent from './ProfileDefaultContent';
import CustomerOrderHistory  from './CustomerOrderHistory';
import OrderCancelled from './Ordercancelled.js';


import './Profile.css';

export default function Profile() {
  const location = useLocation();
  const path = location.pathname; // e.g. "/myProfile", "/orderhistory", etc.
  
  // Decide which panel to show
  let content;
  if (path.startsWith('/orderhistory/cancelled')) {
    content = <OrderCancelled />
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

    return (
        <div className="customer-profile-container">
            {/* Sidebar */}
            <aside
                className="customer-profile-sidebar"
                style={{
                    backgroundImage: `url(${sidebarBgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center', // This will be overridden by CSS if defined
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
                            {/* Link to the main profile page (Contact Info & Address Book) */}
                            <Link
                                to="/myProfile" // This should be the base path for My Account content
                                className={location.pathname === '/myProfile' ? 'active' : ''}
                            >
                                My Account
                            </Link>
                        </li>
                        <li>
                            {/* Link to the Order History main route */}
                            <Link
                                to="/orderhistory" // Updated path
                                className={location.pathname.startsWith('/orderhistory') ? 'active' : ''} // Updated path
                            >
                                Order History
                            </Link>
                            {/* Nested links for Order History sub-sections */}
                            
                        </li>
                    </ul>
                </nav>
            </aside>



        {content}
      </main>
    </div>
  );
}
