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

export default function AOrders() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', dateRange: 'all' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    loadOrders();
  }, [filters]);

  // Calculate KPIs from orders state
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders
    ? (orders.reduce((sum, o) => sum + parseFloat(o.total.slice(1)), 0) / totalOrders).toFixed(2)
    : '0.00';
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const refundRate = totalOrders
    ? `${((orders.filter(o => o.status === 'Refunded').length / totalOrders) * 100).toFixed(1)}%`
    : '0%';

  async function handleStatusUpdate(id, status) {
    const token = localStorage.getItem('token');

    if (status === 'Refunded') {
      // If refund selected, call refund endpoint
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}/refund`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Refund failed');
        }

        setOrders(os => os.map(o => o.id === id ? { ...o, status: 'Refunded' } : o));
        setSelectedOrder(o => o && o.id === id ? { ...o, status: 'Refunded' } : o);
      } catch (err) {
        console.error(err);
        alert(`Failed to issue refund: ${err.message}`);
      }
    } else {
      // For other statuses, use PATCH
      try {
        const res = await fetch(`http://localhost:5000/api/orders/allOrders/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Status update failed');
        }

        setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
        setSelectedOrder(o => o && o.id === id ? { ...o, status } : o);
      } catch (err) {
        console.error(err);
        alert(`Failed to update status: ${err.message}`);
      }
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
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Refunded">Refunded</option>
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
            {['ID', 'Customer', 'Date', 'Status', 'Total'].map(h => (
              <th key={h}>{h}</th>
            ))}
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
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
            <h2>Order {selectedOrder.id}</h2>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> {selectedOrder.total}</p>
            <div className="modal-actions">
              <label htmlFor="status-select"><strong>Update Status:</strong></label>
              <select
                id="status-select"
                value={selectedOrder.status}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Refunded">Refunded</option>
              </select>
              <button
                className="btn purple-btn"
                onClick={() => handleStatusUpdate(selectedOrder.id, selectedOrder.status)}
              >
                Update Status
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
