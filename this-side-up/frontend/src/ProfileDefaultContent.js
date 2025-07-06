// src/ProfileDefaultContent.js
import React, { useState } from 'react'; // Corrected: Changed '=>' to 'from'
// Ensure Profile.css is imported for styling this content
import './Profile.css';

export default function ProfileDefaultContent() {
    // Simulate user data for this component
    const [userData] = useState({
        username: "useremail@gmail.com",
        defaultBillingAddress: "defaultaddress ave 1",
        defaultShippingAddress: "defaultaddress ave 1",
    });

    return (
        <>
            {/* Contact Information Section */}
            <div className="profile-section-title">CONTACT INFORMATION</div> {/* Title is now outside the card */}
            <div className="profile-card contact-info-card">
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={userData.username} readOnly />
                </div>
                <div className="form-group">
                    <a href="javascript:void(0);" className="change-password-link">Change Password</a>
                </div>
                <div className="card-actions">
                    <button className="profile-button primary"><span>Edit</span></button>
                </div>
            </div>

            {/* Address Book Section */}
            <div className="profile-section-title">ADDRESS BOOK</div> {/* Title is now outside the card */}
            <div className="profile-card address-book-card">
                <div className="address-grid">
                    <div className="address-box">
                        <h4>Default Billing Address</h4>
                        <p>{userData.defaultBillingAddress}</p>
                        <a href="javascript:void(0);" className="edit-address-link">Edit Address</a>
                    </div>
                    <div className="address-box">
                        <h4>Default Shipping Address</h4>
                        <p>{userData.defaultShippingAddress}</p>
                        <a href="javascript:void(0);" className="edit-address-link">Edit Address</a>
                    </div>
                </div>
            </div>
        </>
    );
}
