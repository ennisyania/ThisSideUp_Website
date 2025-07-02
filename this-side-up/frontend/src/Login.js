// src/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './component/AuthForm.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted:', { email, password });
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        {/* Removed label, added placeholder */}
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email" /* MODIFIED */
                            required
                        />
                    </div>
                    <div className="form-group">
                        {/* Removed label, added placeholder */}
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password" /* MODIFIED */
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