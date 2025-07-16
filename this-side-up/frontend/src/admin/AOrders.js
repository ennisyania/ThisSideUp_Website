// src/admin/AOrders.js
import React, { useState, useEffect } from 'react';
import './AAdmin.css';

export default function AOrders() {
  const [orders, setOrders]               = useState([]);
  const [filters, setFilters]             = useState({ status: 'all', dateRange: 'last30' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading]             = useState(false);

  // Fetch orders when filters change
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.status !== 'all') params.set('status', filters.status);
        if (filters.dateRange)       params.set('dateRange', filters.dateRange);
        const res  = await fetch(`/api/orders?${params.toString()}`);
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  // Order actions
  async function handleStatusUpdate(id, status) {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
    setSelectedOrder(o => o && o.id === id ? { ...o, status } : o);
  }

  async function handleRefund(id) {
    await fetch(`/api/orders/${id}/refund`, { method: 'POST' });
    setOrders(os => os.map(o => o.id === id ? { ...o, status: 'Refunded' } : o));
    setSelectedOrder(o => o && o.id === id ? { ...o, status: 'Refunded' } : o);
  }

  // KPI stats
  const total        = orders.length;
  const avgValue     = total
    ? (orders.reduce((sum, o) => sum + parseFloat(o.total.slice(1)), 0) / total).toFixed(2)
    : '0.00';
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const refundRate   = total
    ? `${((orders.filter(o => o.status === 'Refunded').length / total) * 100).toFixed(1)}%`
    : '0%';

  return (
    <div className="admin-page orders-page">
      <h1 className="page-title">📦 Orders</h1>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" /> Loading orders…
        </div>
      )}

      <div className="kpi-cards">
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg">📦</div>
          <div>
            <h4>Total Orders</h4>
            <p>{total}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg">📈</div>
          <div>
            <h4>Avg. Order Value</h4>
            <p>${avgValue}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg">⏳</div>
          <div>
            <h4>Pending</h4>
            <p>{pendingCount}</p>
          </div>
        </div>
        <div className="kpi-card purple-border">
          <div className="kpi-icon purple-bg">💵</div>
          <div>
            <h4>Refund Rate</h4>
            <p>{refundRate}</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Refunded">Refunded</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
        >
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
          <option value="thisMonth">This Month</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} onClick={() => setSelectedOrder(o)}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.date}</td>
              <td>{o.status}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-contentpurple">
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            <h2>Order {selectedOrder.id}</h2>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> {selectedOrder.total}</p>
            <div className="modal-actions">
              {selectedOrder.status === 'Pending' && (
                <button className="btn purple-btn" onClick={() => handleStatusUpdate(selectedOrder.id, 'Shipped')}>
                  Mark as Shipped
                </button>
              )}
              {selectedOrder.status !== 'Refunded' && (
                <button className="btn purple-outline-btn" onClick={() => handleRefund(selectedOrder.id)}>
                  Issue Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
