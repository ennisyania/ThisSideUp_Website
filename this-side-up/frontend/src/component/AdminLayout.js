// AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';
import './AdminLayout.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSideBar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
