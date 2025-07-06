// src/Login.js
import React, { useState } from 'react'; // Removed useContext
import { Link, useNavigate } from 'react-router-dom';
// import AuthContext from './context/AuthContext'; // REMOVED: No longer needed for hardcoded login

import './component/AuthForm.css';

export default function Login({ setIsLoggedIn }) { // Re-added setIsLoggedIn prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { login } = useContext(AuthContext); // REMOVED: No longer using AuthContext
    const navigate = useNavigate();

    const handleSubmit = (e) => { // Removed async
        e.preventDefault();
        console.log('Login attempt with:', { email, password });

        // Admin authentication logic (hardcoded)
        if (email === 'admin@gmail.com' && password === 'admin') {
            alert('Admin Login successful! Redirecting to Admin Dashboard.');
            localStorage.setItem('isLoggedIn', 'true'); // Persist login status
            setIsLoggedIn(true); // Update state in App.js
            navigate('/admin'); // Redirect to admin dashboard
        }
        // Regular user authentication logic (hardcoded)
        else if (email === 'test@example.com' && password === 'password123') { // Example regular user credentials
            alert('Login successful!');
            localStorage.setItem('isLoggedIn', 'true'); // Persist login status
            setIsLoggedIn(true); // Update state in App.js
            navigate('/account'); // Redirect to /account for regular user
        }
        // Failed login
        else {
            alert('Invalid email or password.');
            localStorage.setItem('isLoggedIn', 'false'); // Ensure login status is false on failure
            setIsLoggedIn(false); // Update state in App.js
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
