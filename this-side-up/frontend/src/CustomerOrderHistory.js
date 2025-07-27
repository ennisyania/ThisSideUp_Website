import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import './Profile.css';

const sidebarBgUrl = '/images/AdminSidebar.png';

const statusMapping = {
  pending: ['pending', 'shipped'],
  completed: ['delivered'],
  cancelled: ['refunded'],
  all: [],
};

export default function CustomerOrderHistory() {
  const location = useLocation();
  const { user, token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [ordersCS, setOrdersCS] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingOrdersCS, setLoadingOrdersCS] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState(null); // single state for both types

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, {
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
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/ordersCS/myorders`, {
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

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const renderOrderDetails = (order) => (
    <div>
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {capitalize(order.status)}</p>
      <p><strong>Date:</strong> {order.date}</p>
      <p><strong>Total:</strong> {order.total}</p>

      {order.type === 'normal' && order.items && order.items.length > 0 && (
        <>
          <h4>Items</h4>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} - Qty: {item.quantity} - Size: {item.size} - ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      )}

      {order.type === 'custom' && (
        <>
          <h4>Custom Board Details</h4>
          <ul>
            <li><strong>Shape:</strong> {order.shape}</li>
            <li><strong>Thickness:</strong> {order.thickness}</li>
            <li><strong>Length:</strong> {order.length}</li>
            <li><strong>Rocker Profile:</strong> {order.rockerProfile}</li>
            <li><strong>Deck Channels:</strong> {order.deckChannels}</li>
            <li><strong>Extra Details:</strong> {order.extraDetails}</li>
          </ul>
          {order.images?.length > 0 && (
            <>
              <h4>Reference Images</h4>
              <div className="cs-image-grid">
                {order.images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`custom-upload-${i}`}
                    className="cs-upload-img"
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );


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

        {/* Normal Orders */}
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
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder({ ...order, type: 'normal' })}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{order.id}</td>
                    <td><span className={`status-badge ${order.status.toLowerCase()}`}>{capitalize(order.status)}</span></td>
                    <td>{order.date}</td>
                    <td>{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <br />

        {/* Custom Orders */}
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
                  <tr
                    key={orderCS.id}
                    onClick={() => setSelectedOrder({ ...orderCS, type: 'custom' })}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{orderCS.id}</td>
                    <td><span className={`status-badge ${orderCS.status.toLowerCase()}`}>{capitalize(orderCS.status)}</span></td>
                    <td>{orderCS.date}</td>
                    <td>{orderCS.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Shared Modal for both order types */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            {renderOrderDetails(selectedOrder)}
          </div>
        </div>
      )}
    </div>
  );
}
