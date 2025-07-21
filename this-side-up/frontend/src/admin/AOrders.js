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
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.set('status', filters.status);
      if (filters.dateRange) params.set('dateRange', filters.dateRange);
      const res = await fetch(`http://localhost:5000/api/orders/allOrders?${params.toString()}`);
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [filters]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const parseTotal = (totalStr) => {
    if (!totalStr) return 0;
    const num = parseFloat(totalStr.replace(/[^0-9.-]+/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const totalOrders = orders.length;
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
        ? `http://localhost:5000/api/orders/${id}/refund`
        : `http://localhost:5000/api/orders/allOrders/${id}`;

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
        <Package className="page-icon" /> Orders
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
            <h4>Total Orders</h4>
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
            <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</p>
            <p><strong>Total:</strong> {selectedOrder.total}</p>

            <div className="modal-actions">
              <label htmlFor="status-select"><strong>Update Status:</strong></label>
              <select
                id="status-select"
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setConfirming(false);
                }}
                disabled={selectedOrder.status === 'refunded'}  // Disable if refunded
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              {/* Hide submit buttons if status is refunded */}
              {selectedOrder.status !== 'refunded' && !confirming && newStatus !== selectedOrder.status && (
                <button onClick={() => setConfirming(true)}>
                  Submit
                </button>
              )}

              {selectedOrder.status !== 'refunded' && confirming && (
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
