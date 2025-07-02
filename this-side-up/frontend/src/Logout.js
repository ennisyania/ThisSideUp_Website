// src/Logout.js
import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';
import './Logout.css'

export default function Logout({ handleLogout }) {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(true); // State to control prompt visibility

    const confirmLogout = () => {
        setShowConfirm(false); // Hide the prompt
        handleLogout(); // Proceed with logout (this will also redirect to homepage)
    };

    const cancelLogout = () => {
        setShowConfirm(false); // Hide the prompt
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="logout-page-container">
            {showConfirm && (
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
            )}
            {!showConfirm && (
                <div className="logout-content">
                    <h2>Logging out...</h2>
                    <p>You are being securely logged out of your account.</p>
                </div>
            )}
        </div>
    );
}
