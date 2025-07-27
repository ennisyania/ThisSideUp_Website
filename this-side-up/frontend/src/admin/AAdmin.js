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
                const res = await fetch('${process.env.REACT_APP_API_URL}/api/admin/dashboard/revenue-monthly');
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
                const res = await fetch('${process.env.REACT_APP_API_URL}/api/admin/dashboard');
                const text = await res.text();
                console.log('Raw dashboard response:', text);

                const allTimeData = JSON.parse(text);

                const todayRes = await fetch('${process.env.REACT_APP_API_URL}/api/admin/dashboard/today');
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
                const res = await fetch('${process.env.REACT_APP_API_URL}/api/admin/dashboard/customers');
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
                const res = await fetch('${process.env.REACT_APP_API_URL}/api/admin/dashboard/refunded');
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

    // Fetch recent orders
    const [recentOrders, setRecentOrders] = useState([]);
    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const res = await fetch('${process.env.REACT_APP_API_URL}/api/admin/dashboard/recent-orders');
                const data = await res.json();
                setRecentOrders(data);
            } catch (err) {
                console.error('Failed to fetch recent orders:', err);
            }
        };

        fetchRecentOrders();
    }, []);

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
                                    <h3>Total Completed Sales</h3>
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
                                    <h3>Total Active Orders</h3>
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



                        </div>

                        {/* Recent Activity Table */}
                        <div className="admin-card recent-activity-card">
                            <h3>Recent activity</h3>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Customer ID</th>
                                        <th>Status</th>
                                        <th>Order ID</th>
                                        <th>Placed</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order.firstName} {order.lastName}</td> {/* Full Name */}
                                            <td>{order.userId}</td>
                                            <td>
                                                <span className={`status-badge ${order.orderStatus.replace(/\s+/g, '-').toLowerCase()}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td>#{order._id.slice(-6)}</td>
                                            <td>{new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>${order.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
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
