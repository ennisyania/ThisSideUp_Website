// src/CustomerOrderHistory.js
import React from 'react';
import './Profile.css'; // Still import CSS for styling of table and cards

export default function CustomerOrderHistory() {
    // Example order data
    const orders = [
        { id: '#KX0550', product: 'Blue Inferno', payment: 'Credit', status: 'Delivered', total: '$275' },
        { id: '#KX0551', product: 'Red Flash', payment: 'PayPal', status: 'Processing', total: '$300' },
        { id: '#KX0552', product: 'Green Wave', payment: 'Credit', status: 'Shipped', total: '$250' },
        { id: '#KX0553', product: 'Yellow Sunset', payment: 'Credit', status: 'Delivered', total: '$290' },
        { id: '#KX0554', product: 'Purple Haze', payment: 'Bank Transfer', status: 'Cancelled', total: '$220' },
    ];

    return (
        // The table itself will be wrapped in a profile-card to get the parallelogram effect
        // The zIndex and paddingTop are now handled by the parent Profile component's main content area
        <div className="profile-card order-history-card"> {/* Apply profile-card class */}
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
    );
}
