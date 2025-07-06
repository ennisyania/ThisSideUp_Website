// src/Profile.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
    const location = useLocation();

    // Image URLs
    const adminSidebarBgUrl = `${process.env.PUBLIC_URL}/images/AdminSidebar.png`;
    const wavesBgUrl = `${process.env.PUBLIC_URL}/images/waves.png`; // The wave image

    return (
        <div className="customer-profile-container">
            {/* Customer Profile Sidebar */}
            <aside
                className="customer-profile-sidebar"
                style={{
                    backgroundImage: `url(${adminSidebarBgUrl})`,
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
                            {/* Link to the main profile page (Contact Info & Address Book) */}
                            <Link
                                to="/account"
                                className={location.pathname === '/account' ? 'active' : ''}
                            >
                                My Account
                            </Link>
                        </li>
                        <li>
                            {/* Link to the Order History nested route */}
                            <Link
                                to="/account/order-history"
                                className={location.pathname === '/account/order-history' ? 'active' : ''}
                            >
                                Order History
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area - Renders nested routes via Outlet */}
            <main className="customer-profile-main-content" style={{ position: 'relative' }}>
                {/* Dedicated div for the wave background image */}
                <div
                    className="wave-background-overlay"
                    style={{
                        backgroundImage: `url(${wavesBgUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right -10px', // Adjusted to move it up and slightly left, matching the reference image closely
                        backgroundSize: '120% auto', // Increased size to spread more and remove artifacts
                        position: 'absolute',
                        top: '-20px', // Moved further up to reveal more of the bottom of the wave
                        right: '0',
                        width: '100%',
                        height: '200px', // Adjusted height to fit the visual
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}
                ></div>
                <Outlet /> {/* This will render ProfileDefaultContent or CustomerOrderHistory */}
            </main>
        </div>
    );
}
