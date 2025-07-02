import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Main component that includes Router, Navbar, Routes, etc.
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

