// src/admin/AAdmin.js
import React from 'react';
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom'; // Import useMatch
import './AAdmin.css'; // Import the CSS for AAdmin

export default function AAdmin() {
    const location = useLocation(); // Get current location to highlight active link
    const isDashboardRoute = useMatch('/admin'); // Check if the current route is exactly /admin

    // Construct the image URLs using process.env.PUBLIC_URL
    // Re-added AdminSidebar.png for the sidebar background via process.env.PUBLIC_URL
    const adminSidebarBgUrl = `${process.env.PUBLIC_URL}/images/AdminSidebar.png`;
    const logoWhiteUrl = `${process.env.PUBLIC_URL}/images/logowhite.png`;

    return (
        <div className="admin-dashboard-container">
            {/* Admin Sidebar Navigation */}
            <aside
                className="admin-sidebar"
                style={{
                    backgroundImage: `url(${adminSidebarBgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="admin-sidebar-header">
                    <img src={logoWhiteUrl} alt="This Side Up Logo" className="admin-logo" />
                </div>
                <nav className="admin-nav">
                    <ul>
                        {/* Dashboard Link - Active only when path is exactly /admin */}
                        <li>
                            <Link
                                to="/admin"
                                className={location.pathname === '/admin' ? 'active' : ''}
                            >
                                <i className="fa-solid fa-chart-line"></i>
                                Dashboard
                            </Link>
                        </li>
                        {/* Products Link - Active when path starts with /admin/products */}
                        <li>
                            <Link
                                to="/admin/products"
                                className={location.pathname.startsWith('/admin/products') ? 'active' : ''}
                            >
                                <i className="fa-solid fa-box"></i>
                                Products
                            </Link>
                        </li>
                        {/* Orders Link */}
                        <li>
                            <Link
                                to="/admin/orders"
                                className={location.pathname.startsWith('/admin/orders') || location.pathname.startsWith('/admin/orderdetail') ? 'active' : ''}
                            >
                                <i className="fa-solid fa-clipboard-list"></i>
                                Orders
                            </Link>
                        </li>
                        {/* Customers Link */}
                        <li>
                            <Link
                                to="/admin/customers"
                                className={location.pathname.startsWith('/admin/customers') || location.pathname.startsWith('/admin/individualcustomer') ? 'active' : ''}
                            >
                                <i className="fa-solid fa-users"></i>
                                Customers
                            </Link>
                        </li>
                        {/* Settings Link */}
                        <li>
                            <Link
                                to="/admin/settings"
                                className={location.pathname.startsWith('/admin/settings') ? 'active' : ''}
                            >
                                <i className="fa-solid fa-gear"></i>
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="admin-main-header">
                    <h1>Dashboard</h1>
                    <p>Here's your analytic details</p>
                </header>

                {/* Conditionally render dashboard content or Outlet based on route */}
                {isDashboardRoute ? (
                    <div className="admin-dashboard-content">
                        {/* Dashboard Cards */}
                        <div className="dashboard-cards">
                            {/* Total Sales Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Total Sales</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">$120,784.20</div>
                                <div className="card-change">+12.4% <span style={{color: 'var(--admin-success-color)'}}>+1,436 Today</span></div>
                                <div className="card-footer">
                                    <a href="javascript:void(0);" className="view-report-button">View Report <i className="fa-solid fa-arrow-right"></i></a>
                                </div>
                            </div>

                            {/* Total Orders Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Total Orders</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">28,834</div>
                                <div className="card-change">+20.1% <span style={{color: 'var(--admin-success-color)'}}>+2,676 Today</span></div>
                                <div className="card-footer">
                                    <a href="javascript:void(0);" className="view-report-button">View Report <i className="fa-solid fa-arrow-right"></i></a>
                                </div>
                            </div>

                            {/* Revenue Chart Card */}
                            <div className="admin-card dashboard-card revenue-chart-card">
                                <div className="card-header">
                                    <h3>Revenue</h3>
                                    <select className="revenue-time-filter">
                                        <option>Month</option>
                                        <option>Quarter</option>
                                        <option>Year</option>
                                    </select>
                                </div>
                                <div className="card-value">$120,784.20 <span style={{color: 'var(--admin-success-color)', fontSize: '0.7em'}}>10%</span></div>
                                <div className="revenue-chart-placeholder">
                                    {/* Placeholder for a bar chart - using a placeholder image for visual representation */}
                                    <img src="https://placehold.co/300x150/8A2BE2/FFFFFF?text=Revenue+Chart" alt="Revenue Chart Placeholder" style={{width: '100%', height: '100%', borderRadius: '8px'}} />
                                </div>
                                <div className="revenue-chart-legend">
                                    <span style={{backgroundColor: 'var(--admin-purple-chart)', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', marginRight: '5px'}}></span> Profit
                                    <span style={{backgroundColor: 'var(--admin-light-purple-chart)', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', marginLeft: '15px', marginRight: '5px'}}></span> Loss
                                </div>
                            </div>

                            {/* Visitors Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Visitors</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">18,893</div>
                                <div className="card-change negative">-5.6% <span style={{color: 'var(--admin-danger-color)'}}>-876 Today</span></div>
                                <div className="card-footer">
                                    <a href="javascript:void(0);" className="view-report-button">View Report <i className="fa-solid fa-arrow-right"></i></a>
                                </div>
                            </div>

                            {/* Refunded Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Refunded</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">$2,876</div>
                                <div className="card-change">+3% <span style={{color: 'var(--admin-success-color)'}}>+$34 Today</span></div>
                                <div className="card-footer">
                                    <a href="javascript:void(0);" className="view-report-button">View Report <i className="fa-solid fa-arrow-right"></i></a>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="admin-card recent-activity-card">
                            <h3>Recent activity</h3>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Customer ID</th>
                                        <th>Retained</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Ronald Richards</td>
                                        <td><span className="status-badge member">Member</span></td>
                                        <td>#745663</td>
                                        <td>5 min ago</td>
                                        <td>$12,408.90</td>
                                    </tr>
                                    <tr>
                                        <td>Donell Steward</td>
                                        <td><span className="status-badge signed-up">Signed Up</span></td>
                                        <td>#643291</td>
                                        <td>10 min ago</td>
                                        <td>$201.50</td>
                                    </tr>
                                    <tr>
                                        <td>Marvin Mckenny</td>
                                        <td><span className="status-badge new">New</span></td>
                                        <td>#899578</td>
                                        <td>15 min ago</td>
                                        <td>$105.70</td>
                                    </tr>
                                    <tr>
                                        <td>Spongebob</td>
                                        <td><span className="status-badge member">Member</span></td>
                                        <td>#156782</td>
                                        <td>20 min ago</td>
                                        <td>$3,543.30</td>
                                    </tr>
                                    <tr>
                                        <td>Escander</td>
                                        <td><span className="status-badge member">Member</span></td>
                                        <td>#444781</td>
                                        <td>25 min ago</td>
                                        <td>$4,562.72</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Traffic Channel Chart */}
                        <div className="admin-card traffic-channel-card">
                            <div className="card-header">
                                <h3>Traffic Channel</h3>
                                <select className="traffic-time-filter">
                                    <option>All time</option>
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                </select>
                            </div>
                            <div className="traffic-channel-chart-container">
                                {/* Placeholder for a simple SVG pie chart */}
                                <svg viewBox="0 0 100 100" className="pie-chart-svg">
                                    <circle r="30" cx="50" cy="50" fill="transparent" strokeDasharray="19 100" className="slice1"></circle>
                                    <circle r="30" cx="50" cy="50" fill="transparent" strokeDasharray="50.5 100" strokeDashoffset="-19" className="slice2"></circle>
                                    <circle r="30" cx="50" cy="50" fill="transparent" strokeDasharray="30.5 100" strokeDashoffset="-69.5" className="slice3"></circle>
                                </svg>
                            </div>
                            <div className="pie-chart-legend">
                                <div className="legend-item"><span className="legend-color-box purple"></span> Direct (19%)</div>
                                <div className="legend-item"><span className="legend-color-box light-purple"></span> Organic (50.5%)</div>
                                <div className="legend-item"><span className="legend-color-box grey"></span> Referral (30.5%)</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Outlet for nested routes (e.g., AProducts, AOrders)
                    <Outlet />
                )}
            </main>
        </div>
    );
}
