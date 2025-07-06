import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


import './component/AuthForm.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');

      login(data.user, data.token);

      // Redirect based on user role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot your password?
          </Link>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const userData = jwtDecode(credentialResponse.credential); console.log("Decoded Google user:", userData);
              login(userData, credentialResponse.credential);
              navigate('/');
            }}
            onError={() => console.log("Login Failed")}
            auto_select={true}
          />
          <button type="submit" className="auth-button">
            <span>Log In</span>
          </button>
        </form>
        <p className="auth-link-text">
          <Link to="/register" className="auth-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
