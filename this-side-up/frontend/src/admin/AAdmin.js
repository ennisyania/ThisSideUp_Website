// src/admin/AAdmin.js
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Link, Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom';
import './AAdmin.css';

export default function AAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboardRoute = useMatch('/admin');
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);

    const [dashboardData, setDashboardData] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalSalesToday: 0,
        totalOrdersToday: 0,
    });

    useEffect(() => {
        // Fetch monthly revenue
        const fetchMonthlyRevenue = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/dashboard/revenue-monthly');
                const data = await res.json();
                setMonthlyRevenue(data);
            } catch (err) {
                console.error('Failed to fetch monthly revenue:', err);
            }
        };

        fetchMonthlyRevenue();
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/dashboard');
                const text = await res.text();
                console.log('Raw dashboard response:', text);

                const allTimeData = JSON.parse(text);

                const todayRes = await fetch('http://localhost:5000/api/admin/dashboard/today');
                const todayText = await todayRes.text();
                console.log('Raw today response:', todayText);

                const todayData = JSON.parse(todayText);

                setDashboardData({
                    totalSales: allTimeData.totalSales,
                    totalOrders: allTimeData.totalOrders,
                    totalSalesToday: todayData.totalSalesToday,
                    totalOrdersToday: todayData.totalOrdersToday,
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            }
        };


        fetchDashboardData();
    }, []);

    // Calculate percentage increases
    const getPercentIncrease = (today, total) => {
        if (total === 0) return 0;
        return ((today / (total - today)) * 100).toFixed(1);
    };

    const {
        totalSales,
        totalOrders,
        totalSalesToday,
        totalOrdersToday,
    } = dashboardData;

    const salesPercentIncrease = getPercentIncrease(totalSalesToday, totalSales);
    const ordersPercentIncrease = getPercentIncrease(totalOrdersToday, totalOrders);

    const [customerData, setCustomerData] = useState({
        totalCustomers: 0,
        newCustomersToday: 0,
    });


    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/dashboard/customers');
                const data = await res.json();
                setCustomerData(data);
            } catch (err) {
                console.error('Failed to fetch customer data:', err);
            }
        };

        fetchCustomerData();
    }, []);

    const [refundData, setRefundData] = useState({
        totalRefunded: 0,
        refundedToday: 0,
    });

    // Fetch refund data
    useEffect(() => {
        const fetchRefundData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/dashboard/refunded');
                const data = await res.json();
                setRefundData(data);
            } catch (err) {
                console.error('Failed to fetch refund data:', err);
            }
        };

        fetchRefundData();
    }, []);

    const refundPercentIncrease = (() => {
        const { totalRefunded, refundedToday } = refundData;
        if (totalRefunded === 0) return 0;
        return ((refundedToday / (totalRefunded - refundedToday)) * 100).toFixed(1);
    })();

    return (
        <div className="admin-dashboard-container">
            <main className="admin-main-content">
                <header className="admin-main-header">
                    <h1>Dashboard</h1>
                    <p>Here's your analytic details</p>
                </header>

                {isDashboardRoute ? (
                    <div className="admin-dashboard-content">
                        <div className="dashboard-cards">
                            {/* Total Sales Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Total Sales</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">${totalSales.toLocaleString()}</div>
                                <div className="card-change">
                                    +{salesPercentIncrease}% <span style={{ color: 'var(--admin-success-color)' }}>+${totalSalesToday.toLocaleString()} Today</span>
                                </div>
                                <div className="card-footer">
                                    <a href="#" onClick={() => navigate('/admin/orders')}
                                        className="view-report-button">View Report <i className="fa-solid fa-arrow-right"></i></a>
                                </div>
                            </div>

                            {/* Total Orders Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Total Orders</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">{totalOrders.toLocaleString()}</div>
                                <div className="card-change">
                                    +{ordersPercentIncrease}% <span style={{ color: 'var(--admin-success-color)' }}>+{totalOrdersToday.toLocaleString()} Today</span>
                                </div>
                                <div className="card-footer">
                                    <a href="#" onClick={() => navigate('/admin/orders')} className="view-report-button">View Report <i className="fa-solid fa-arrow-right"></i></a>
                                </div>
                            </div>

                            {/* Revenue Chart Card */}
                            <div className="admin-card dashboard-card revenue-chart-card">
                                <div className="card-header">
                                    <h3>Revenue (Monthly)</h3>
                                </div>

                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                            <Bar dataKey="revenue" fill="#8A2BE2" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Customers Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Customers</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">{(customerData.totalCustomers ?? 0).toLocaleString()}</div>
                                <div className="card-change">
                                    <span>{(customerData.newCustomersToday ?? 0).toLocaleString()} New Today</span>
                                </div>
                                <div className="card-footer">
                                    <a href="#" onClick={() => navigate('/admin/customers')} className="view-report-button">
                                        View Report <i className="fa-solid fa-arrow-right"></i>
                                    </a>
                                </div>
                            </div>

                            {/* Refunded Card */}
                            <div className="admin-card dashboard-card">
                                <div className="card-header">
                                    <h3>Refunded</h3>
                                    <i className="fa-solid fa-ellipsis-vertical menu-icon"></i>
                                </div>
                                <div className="card-value">${refundData.totalRefunded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <div className="card-change">
                                    +{refundPercentIncrease}% <span style={{ color: 'var(--admin-success-color)' }}>
                                        +${refundData.refundedToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Today
                                    </span>
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
