// src/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './component/AuthForm.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register submitted:', { email, password, confirmPassword });
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h2>Register</h2>
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
                    <div className="form-group">
                        {/* Removed label, added placeholder */}
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password" /* MODIFIED */
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button"><span>Create</span></button>
                </form>
               
            </div>
        </div>
    );
}