// src/Profile.js

import { Link, useLocation } from 'react-router-dom';
import ProfileDefaultContent from './ProfileDefaultContent'; // Import ProfileDefaultContent
import CustomerOrderHistory from './CustomerOrderHistory'; // Import CustomerOrderHistory
import React, { useContext } from 'react';
import AuthContext from './context/AuthContext'; // Adjust the path if needed

import './Profile.css';

export default function Profile() {
    const location = useLocation();
    const { user } = useContext(AuthContext);


    // Image URLs
    const sidebarBgUrl = `${process.env.PUBLIC_URL}/images/AdminSidebar.png`;
    const wavesBgUrl = `${process.env.PUBLIC_URL}/images/waves.png`;

    // Determine which content component to render based on the current path
    const renderContent = () => {
        if (location.pathname.startsWith('/orderhistory')) { // Updated path
            return <CustomerOrderHistory />;
        } else {
            // Default to ProfileDefaultContent for /account or any other sub-path not explicitly handled
            return <ProfileDefaultContent />;
        }
    };

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
                        {user?.role === 'admin' && (
                            <li>
                                <Link to="/admin">Admin Page</Link>
                            </li>
                        )}

                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="customer-profile-main-content">
                {/* Wave overlay - Using PNG with optimized positioning */}
                <div
                    className="wave-background-overlay"
                    style={{
                        backgroundImage: `url(${wavesBgUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center top',
                        backgroundSize: 'cover',
                        transform: 'scaleY(1.2)', // Stretch vertically for more curve
                        transformOrigin: 'top center'
                    }}
                ></div>
                {renderContent()} {/* Render the selected content component */}
            </main>
        </div>
    );
}