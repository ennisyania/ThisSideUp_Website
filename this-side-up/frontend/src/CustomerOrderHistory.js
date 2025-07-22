import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import './Profile.css';

const sidebarBgUrl = '/images/AdminSidebar.png';

const statusMapping = {
  pending: ['pending', 'shipped'],
  completed: ['delivered'],
  cancelled: ['refunded'],
  all: [], // optional: no filter, show all
};

export default function CustomerOrderHistory() {
  const location = useLocation();
  const { user, token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [ordersCS, setOrdersCS] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingOrdersCS, setLoadingOrdersCS] = useState(true);

  const [filterStatus, setFilterStatus] = useState('all');  // Track current filter

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrders(false);
      }
    }



    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  useEffect(() => {
    async function fetchOrdersCS() {
      try {
        const res = await fetch('http://localhost:5000/api/ordersCS/myorders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrdersCS(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrdersCS(false);
      }
    }



    if (user && token) {
      fetchOrdersCS();
    }
  }, [user, token]);

  // Filter orders based on selected filterStatus
  const filteredOrders = React.useMemo(() => {
    if (filterStatus === 'all') return orders;
    const statuses = statusMapping[filterStatus];
    return orders.filter(order => statuses.includes(order.status.toLowerCase()));
  }, [orders, filterStatus]);

  const filteredOrdersCS = React.useMemo(() => {
    if (filterStatus === 'all') return ordersCS;
    const statuses = statusMapping[filterStatus];
    return ordersCS.filter(orderCS => statuses.includes(orderCS.status.toLowerCase()));
  }, [ordersCS, filterStatus]);

  // Capitalize helper
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
                className={location.pathname === '/account' ? 'active' : ''}
                to="/myProfile"
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/orderhistory"
                className={filterStatus === 'all' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterStatus('all');
                }}
              >
                Order History
              </Link>
              <ul className="order-history-subnav">
                {['pending', 'completed', 'cancelled'].map((status) => (
                  <li key={status}>
                    <Link
                      to="#"
                      className={filterStatus === status ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterStatus(status);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {capitalize(status)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="customer-profile-main-content">

        {/* {normal orders} */}
        <div className="profile-card order-history-card">
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="order-history-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {capitalize(order.status)}
                      </span>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <br />
        {/* {custom skimboard} */}
        <div className="profile-card order-history-card">
          {loadingOrdersCS ? (
            <p>Loading orders...</p>
          ) : filteredOrdersCS.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="order-history-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrdersCS.map((orderCS) => (
                  <tr key={orderCS.id}>
                    <td>{orderCS.id}</td>
                    <td>
                      <span className={`status-badge ${orderCS.status.toLowerCase()}`}>
                        {capitalize(orderCS.status)}
                      </span>
                    </td>
                    <td>{orderCS.date}</td>
                    <td>{orderCS.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
