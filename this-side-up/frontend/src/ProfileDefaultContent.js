import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

export default function ProfileDefaultContent() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await axios.get('http://localhost:5000/api/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('User data:', res.data);
            setUserData(res.data); // ← Set the state here
        } catch (err) {
            console.error('Failed to fetch user:', err.response?.data || err.message);
        }
    };

    fetchUser();
}, []);


    const handleEditClick = async () => {
        if (isEditing) {
            // Save changes
            try {
                setLoading(true);
                setMessage('');
                const token = localStorage.getItem('token');
                const res = await axios.put(
                    'http://localhost:5000/api/user/edit',
                    editForm,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUserData((prev) => ({
                    ...prev,
                    ...editForm,
                }));
                setMessage('Profile updated successfully.');
            } catch (err) {
                console.error('Update failed:', err);
                setMessage('Failed to update profile.');
            } finally {
                setLoading(false);
                setIsEditing(false);
            }
        } else {
            // Switch to edit mode and preload form
            setEditForm({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
            });
            setIsEditing(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const formatAddress = (address) => {
        if (!address) return 'No shipping address available';
        return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}, ${address.country || ''}`;
    };

    return (
        <>
            {/* CONTACT INFORMATION */}
            <div className="profile-section-title">CONTACT INFORMATION</div>
            <div className="profile-card contact-info-card">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={isEditing ? editForm.firstName : userData.firstName || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={isEditing ? editForm.lastName : userData.lastName || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={isEditing ? editForm.email : userData.email || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={isEditing ? editForm.phone : userData.phone || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <a href="#" className="change-password-link">Change Password</a>
                </div>
                {message && (
                    <div className="form-message">
                        {message}
                    </div>
                )}
                <div className="card-actions">
                    <button className="profile-button primary" onClick={handleEditClick} disabled={loading}>
                        <span>{isEditing ? (loading ? 'Saving...' : 'Save') : 'Edit'}</span>
                    </button>
                </div>
            </div>

            {/* ADDRESS BOOK */}
            <div className="profile-section-title">SHIPPING ADDRESS</div>
            <div className="profile-card address-book-card">
                <div className="address-box">
                    <h4>Default Shipping Address</h4>
                    <p>{formatAddress(userData.address)}</p>
                    <a href="#" className="edit-address-link">Edit Address</a>
                </div>
            </div>
        </>
    );
}
