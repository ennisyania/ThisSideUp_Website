// src/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import './component/AuthForm.css'; // Assuming this CSS file exists for form styling

export default function Login({ setIsLoggedIn }) { // Receive setIsLoggedIn as a prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted:', { email, password });

        // Admin authentication logic
        if (email === 'admin@gmail.com' && password === 'admin') {
            alert('Admin Login successful! Redirecting to Admin Dashboard.');
            setIsLoggedIn(true); // Set login status to true for admin
            navigate('/admin'); // Redirect to admin dashboard
        }
        // Regular user authentication logic
        else if (email === 'test@example.com' && password === 'password123') { // Example regular user credentials
            alert('Login successful!');
            setIsLoggedIn(true); // Set login status to true for regular user
            navigate('/'); // Redirect to homepage for regular user
        }
        // Failed login
        else {
            alert('Invalid email or password.');
            setIsLoggedIn(false); // Ensure login status is false on failure
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
                            name="email"
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
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
                    <button type="submit" className="auth-button"><span>Sign In</span></button>
                </form>
                <p className="auth-link-text">
                    <Link to="/register" className="auth-link">Create Account</Link>
                </p>
            </div>
        </div>
    );
}
