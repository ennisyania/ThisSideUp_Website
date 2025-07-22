import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  RefreshCw,
} from 'lucide-react';
import './AAdmin.css';

export default function ACustomers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/user/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="admin-page customers-page">
      <h1 className="page-title">
        <User className="page-icon" /> Customers
      </h1>

      {loading && (
        <div className="loading-overlay">
          <RefreshCw className="spin" /> Loading users…
        </div>
      )}

      <table className="orders-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Registered Date</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user._id}
              onClick={() => setSelectedUser(user)}
              style={{ cursor: 'pointer' }}
            >
              <td>{user.userId}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone || '-'}</td>
              <td>{new Date(user.registeredDate).toLocaleDateString()}</td>
              <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-contentpurple">
            <button
              aria-label="Close modal"
              className="modal-close"
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>
            <h2>User Details</h2>

            <p><strong>User ID:</strong> {selectedUser.userId}</p>
            <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || '-'}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>

            <p><strong>Address:</strong><br />
              {selectedUser.address?.street || '-'}<br />
              {selectedUser.address?.city && (<>{selectedUser.address.city}, </>)}
              {selectedUser.address?.state && (<>{selectedUser.address.state} </>)}
              {selectedUser.address?.zip && (<>{selectedUser.address.zip}<br /></>)}
              {selectedUser.address?.country || '-'}
            </p>

            <p><strong>Registered Date:</strong> {new Date(selectedUser.registeredDate).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
