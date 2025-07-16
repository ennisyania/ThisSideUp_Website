import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import './Logout.css';
import { googleLogout, GoogleLogout } from '@react-oauth/google';

export default function Logout() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [showConfirm, setShowConfirm] = useState(true);

    const confirmLogout = () => {
        setShowConfirm(false);
        logout(); // clear user
        googleLogout();
        navigate('/'); // redirect
    };

    const cancelLogout = () => {
        setShowConfirm(false);
        navigate(-1);
    };

    return (
        <div className="logout-page-container">
            {showConfirm ? (
                <div className="logout-confirm-prompt">
                    <h2>Log Out?</h2>
                    <p>Are you sure?</p>
                    <div className="logout-buttons">
                        <button onClick={confirmLogout} className="logout-yes-button">
                            <span>Yes</span>
                        </button>
                        <button onClick={cancelLogout} className="logout-no-button">
                            <span>No</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="logout-content">
                    <h2>Logging out...</h2>
                    <p>You are being securely logged out of your account.</p>
                </div>
            )}
        </div>
    );
}
