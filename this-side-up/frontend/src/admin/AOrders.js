import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  Calendar as CalendarIcon,
  Filter as FilterIcon,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import './AAdmin.css';

// Use lowercase statuses for logic
const STATUSES = ['pending', 'shipped', 'delivered', 'refunded'];

export default function AOrders() {
  const [active, setActive] = useState('Store');

  const tabStyle = {
    padding: '0.6rem 1.2rem',
    border: 'none',
    backgroundColor: '#e0e0e0',
    color: '#333',
    fontWeight: '500',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginRight: '8px',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#333',
    color: 'white',
  };

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          color: '#333',
        }}
      >
        Orders Management
      </h1>

        <nav className="orders-nav">
  {['Store','Customs'].map(tab => (
    <button
      key={tab}
      className={`orders-nav__tab ${tab === active ? 'orders-nav__tab--active' : ''}`}
      onClick={() => setActive(tab)}
    >
      {tab}
    </button>
  ))}
</nav>


      <div>
        {active === 'Store' && <AStoreOrders />}
        {active === 'Customs' && <ACustoms />}
      </div>
    </div>
  );
}

function AStoreOrders() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', dateRange: 'all' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function loadOrders() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.dateRange) params.set('dateRange', filters.dateRange);

      const res = await fetch(`https://thissideup-website.onrender.com//api/orders/allOrders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Unexpected response format:', data);
        setOrders([]);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [filters]);



  const parseTotal = (totalStr) => {
    if (!totalStr) return 0;
    const num = parseFloat(totalStr.replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const totalOrders = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'refunded'
  ).length;

  const avgOrderValue = totalOrders
    ? (orders.reduce((sum, o) => sum + parseTotal(o.total), 0) / totalOrders).toFixed(2)
    : '0.00';

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const refundCount = orders.filter(o => o.status === 'refunded').length;
  const refundRate = totalOrders
    ? `${((refundCount / totalOrders) * 100).toFixed(1)}%`
    : '0%';

  async function handleStatusUpdate(id, status) {
    setUpdating(true);
    const token = localStorage.getItem('token');
    try {
      const statusLower = status.toLowerCase();
      const endpoint = statusLower === 'refunded'
        ? `https://thissideup-website.onrender.com//api/orders/${id}/refund`
        : `https://thissideup-website.onrender.com//api/orders/allOrders/${id}`;

      const method = statusLower === 'refunded' ? 'POST' : 'PATCH';
      const body = statusLower === 'refunded' ? null : JSON.stringify({ status: statusLower });

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update');
      }

      await loadOrders();
    } catch (err) {
      console.error(err);
      alert(`Failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="admin-page orders-page">
      <h1 className="page-title">
        <Package className="page-icon" />Store Orders
      </h1>

      {loading && (
        <div className="loading-overlay">
          <RefreshCw className="spin" /> Loading orders…
        </div>
      )}

      <div className="kpi-cards">
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><Package /></div>
          <div>
            <h4>Total Active Orders</h4>
            <p>{totalOrders}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><TrendingUp /></div>
          <div>
            <h4>Avg. Order Value</h4>
            <p>${avgOrderValue}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><CalendarIcon /></div>
          <div>
            <h4>Pending</h4>
            <p>{pendingCount}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><DollarSign /></div>
          <div>
            <h4>Refund Rate</h4>
            <p>{refundRate}</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <FilterIcon className="filter-icon" />
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <CalendarIcon className="filter-icon" />
        <select
          value={filters.dateRange}
          onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
        >
          <option value="all">All Time</option>
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setNewStatus(o.status);
                setConfirming(false);
              }}
            >
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{new Date(o.date).toLocaleDateString()}</td>
              <td>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-contentpurple">
            <button
              aria-label="Close modal"
              className="modal-close"
              onClick={() => {
                setSelectedOrder(null);
                setNewStatus('');
                setConfirming(false);
              }}
            >
              ✕
            </button>
            <h2>Order {selectedOrder.id}</h2>

            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Contact Email:</strong> {selectedOrder.contactEmail}</p>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>

            <p><strong>Shipping Address:</strong><br />
              {selectedOrder.address}<br />
              {selectedOrder.aptSuiteEtc && <>{selectedOrder.aptSuiteEtc}<br /></>}
              {selectedOrder.postalCode}, {selectedOrder.countryRegion}
            </p>

            <p><strong>Shipping Method:</strong> {selectedOrder.shippingMethod}</p>

            {selectedOrder.discountCode && (
              <p><strong>Discount Code:</strong> {selectedOrder.discountCode} (−%{selectedOrder.appliedDiscount || '0.00'})</p>
            )}

            <p><strong>Subtotal:</strong> ${selectedOrder.subtotal?.toFixed(2)}</p>
            <p><strong>Shipping Cost:</strong> ${selectedOrder.shippingCost?.toFixed(2)}</p>

            <p><strong>Total:</strong> {selectedOrder.total}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString('en-SG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}</p>

            <p><strong>Status:</strong> {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</p>

            <p><strong>Items:</strong></p>
            <ul>
              {selectedOrder.items?.map((item, idx) => (
                <li key={idx} className="order-item">
                  {item.imageurl && (
                    <img src={item.imageurl} alt={item.name} width="40" style={{ marginRight: '8px' }} />
                  )}
                  <strong>{item.name}</strong> — Size: {item.size}, Qty: {item.quantity}
                </li>
              ))}
            </ul>



            <div className="modal-actions">
              <label htmlFor="status-select"><strong>Update Status:</strong></label>
              <select
                id="status-select"
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setConfirming(false);
                }}
                disabled={selectedOrder.status === 'refunded'}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              {!confirming && newStatus !== selectedOrder.status && selectedOrder.status !== 'refunded' && (
                <button onClick={() => setConfirming(true)}>
                  Submit
                </button>
              )}

              {confirming && selectedOrder.status !== 'refunded' && (
                <button
                  disabled={updating}
                  onClick={async () => {
                    await handleStatusUpdate(selectedOrder.id, newStatus);
                    setSelectedOrder(null);
                    setNewStatus('');
                    setConfirming(false);
                  }}
                >
                  {updating ? 'Updating...' : 'Confirm'}
                </button>
              )}

              {selectedOrder.status === 'refunded' && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                  This order has been refunded and status cannot be changed.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



const STATUSESCS = ['pending', 'processing', 'shipped', 'delivered', 'refunded'];

function ACustoms() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', dateRange: 'all' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function loadOrders() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.dateRange) params.set('dateRange', filters.dateRange);

      // Note: your backend may need support for filtering on /myorders or do client-side filtering
      const res = await fetch(`https://thissideup-website.onrender.com//api/ordersCS/allOrders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Unexpected response format:', data);
        setOrders([]);
      }
    } catch (e) {
      console.error('Failed to load custom orders', e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [filters]);


  const totalOrders = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'refunded'
  ).length;

  const avgOrderValue = totalOrders
    ? (orders.reduce((sum, o) => sum + parseFloat(o.total.replace(/[^0-9.-]+/g, '')), 0) / totalOrders).toFixed(2)
    : '0.00';

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const refundCount = orders.filter(o => o.status === 'refunded').length;
  const refundRate = totalOrders
    ? `${((refundCount / totalOrders) * 100).toFixed(1)}%`
    : '0%';

  async function handleStatusUpdate(id, status) {
    setUpdating(true);
    const token = localStorage.getItem('token');
    try {
      // Example: create your own backend PATCH route for /api/ordersCS/:id
      const statusLower = status.toLowerCase();

      const endpoint = statusLower === 'refunded'
        ? `https://thissideup-website.onrender.com//api/ordersCS/${id}/refund`
        : `https://thissideup-website.onrender.com//api/ordersCS/${id}`;

      const method = statusLower === 'refunded' ? 'POST' : 'PATCH';

      const body = statusLower === 'refunded' ? null : JSON.stringify({ status: statusLower });

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update');
      }

      await loadOrders();
    } catch (err) {
      console.error(err);
      alert(`Failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="admin-page orders-page">
      <h1 className="page-title">
        <Package className="page-icon" /> Custom Skimboard Orders
      </h1>

      {loading && (
        <div className="loading-overlay">
          <RefreshCw className="spin" /> Loading orders…
        </div>
      )}

      <div className="kpi-cards">
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><Package /></div>
          <div>
            <h4>Total Active Orders</h4>
            <p>{totalOrders}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><TrendingUp /></div>
          <div>
            <h4>Avg. Order Value</h4>
            <p>${avgOrderValue}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><CalendarIcon /></div>
          <div>
            <h4>Pending</h4>
            <p>{pendingCount}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg"><DollarSign /></div>
          <div>
            <h4>Refund Rate</h4>
            <p>{refundRate}</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <FilterIcon className="filter-icon" />
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          {STATUSESCS.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <CalendarIcon className="filter-icon" />
        <select
          value={filters.dateRange}
          onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
        >
          <option value="all">All Time</option>
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Shape</th>
            <th>Thickness</th>
            <th>Length</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setNewStatus(o.status);
                setConfirming(false);
              }}
            >
              <td>{o.id}</td>
              <td>{o.shape}</td>
              <td>{o.thickness}</td>
              <td>{o.length}</td>
              <td>{new Date(o.date).toLocaleDateString()}</td>
              <td>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-contentpurple">
            <button
              aria-label="Close modal"
              className="modal-close"
              onClick={() => {
                setSelectedOrder(null);
                setNewStatus('');
                setConfirming(false);
              }}
            >
              ✕
            </button>
            <h2>Order {selectedOrder.id}</h2>

            <p><strong>Customer:</strong> {selectedOrder.firstName} {selectedOrder.lastName}</p>
            <p><strong>Contact Email:</strong> {selectedOrder.contactEmail}</p>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>

            <p><strong>Shipping Address:</strong><br />
              {selectedOrder.address}<br />
              {selectedOrder.aptSuiteEtc && <>{selectedOrder.aptSuiteEtc}<br /></>}
              {selectedOrder.postalCode}, {selectedOrder.countryRegion}
            </p>

            <p><strong>Shipping Method:</strong> {selectedOrder.shippingMethod}</p>

            {selectedOrder.discountCode && (
              <p><strong>Discount Code:</strong> {selectedOrder.discountCode} (−%{selectedOrder.appliedDiscount || '0.00'})</p>
            )}

            <p><strong>Subtotal:</strong> ${(selectedOrder.subtotal || 0).toFixed(2)}</p>
            <p><strong>Shipping Cost:</strong> ${(selectedOrder.shippingCost || 0).toFixed(2)}</p>

            {selectedOrder.discountCode && (
              <>
                <p><strong>Discount Code:</strong> {selectedOrder.discountCode}</p>
                <p><strong>Applied Discount:</strong> ${selectedOrder.appliedDiscount?.toFixed(2) || '0.00'}</p>
              </>
            )}

            <p><strong>Total:</strong> ${(selectedOrder.total || 0)}</p>

            <p><strong>Subscribed to News & Offers:</strong> {selectedOrder.newsAndOffers ? 'Yes' : 'No'}</p>


            <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString('en-SG', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}</p>


            <p><strong>Status:</strong> {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</p>

            {/* Show Form Details */}
            <h3>Skimboard Details</h3>
            <p><strong>Shape:</strong> {selectedOrder.shape || '-'}</p>
            <p><strong>Thickness:</strong> {selectedOrder.thickness || '-'}</p>
            <p><strong>Length:</strong> {selectedOrder.length || '-'}</p>
            <p><strong>Rocker Profile:</strong> {selectedOrder.rockerProfile || '-'}</p>
            <p><strong>Deck Channels:</strong> {selectedOrder.deckChannels || '-'}</p>
            <p><strong>Extra Details:</strong> {selectedOrder.extraDetails || '-'}</p>

            {/* Show Images */}
            <h3>Images</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {selectedOrder.images && selectedOrder.images.length > 0 ? (
                selectedOrder.images.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Order Image ${idx + 1}`}
                    style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px' }}
                  />
                ))
              ) : (
                <p>No images provided.</p>
              )}
            </div>

            <div className="modal-actions">
              <label htmlFor="status-select"><strong>Update Status:</strong></label>
              <select
                id="status-select"
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setConfirming(false);
                }}
                disabled={selectedOrder.status === 'refunded'}
              >
                {STATUSESCS.map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              {!confirming && newStatus !== selectedOrder.status && selectedOrder.status !== 'refunded' && (
                <button onClick={() => setConfirming(true)}>Submit</button>
              )}

              {confirming && selectedOrder.status !== 'refunded' && (
                <button
                  disabled={updating}
                  onClick={async () => {
                    await handleStatusUpdate(selectedOrder.id, newStatus);
                    setSelectedOrder(null);
                    setNewStatus('');
                    setConfirming(false);
                  }}
                >
                  {updating ? 'Updating...' : 'Confirm'}
                </button>
              )}

              {selectedOrder.status === 'refunded' && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                  This order has been refunded and status cannot be changed.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
