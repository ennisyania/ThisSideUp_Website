import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

export default function ProfileDefaultContent() {
  // User data for contact and address
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

  // Contact info editing state
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Address editing state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://thissideup-website.onrender.com/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (!data.address) {
          data.address = { street: '', city: '', state: '', zip: '', country: '' };
        }
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch user:', err.response?.data || err.message);
      }
    };
    fetchUser();
  }, []);

  // Contact info handlers
  const handleContactEditClick = () => {
    if (isEditingContact) {
      saveContactInfo();
    } else {
      setContactForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
      setIsEditingContact(true);
      setMessage('');
    }
  };

  const saveContactInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `https://thissideup-website.onrender.com/api/user/edit`,
        {
          firstName: contactForm.firstName,
          lastName: contactForm.lastName,
          email: contactForm.email,
          phone: contactForm.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({ ...prev, ...contactForm }));
      setMessage('Contact information updated.');
      setIsEditingContact(false);
    } catch (error) {
      console.error('Failed to update contact info:', error);
      setMessage('Failed to update contact info.');
    } finally {
      setLoading(false);
    }
  };

  // Address handlers
  const handleAddressEditClick = () => {
    if (isEditingAddress) {
      saveAddress();
    } else {
      setAddressForm({ ...userData.address });
      setIsEditingAddress(true);
      setMessage('');
    }
  };

  const saveAddress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `https://thissideup-website.onrender.com/api/user/edit`,
        {
          address: addressForm,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({
        ...prev,
        address: { ...addressForm },
      }));
      setMessage('Shipping address updated.');
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Failed to update address:', error);
      setMessage('Failed to update address.');
    } finally {
      setLoading(false);
    }
  };

  // Generic input change handlers
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* CONTACT INFORMATION */}
      <div className="profile-section-title">CONTACT INFORMATION</div>
      <div className="profile-card contact-info-card">
        <div className="form-group">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            value={isEditingContact ? contactForm.firstName : userData.firstName || ''}
            onChange={handleContactInputChange}
            readOnly={!isEditingContact}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="lastName"
            type="text"
            value={isEditingContact ? contactForm.lastName : userData.lastName || ''}
            onChange={handleContactInputChange}
            readOnly={!isEditingContact}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="text"
            value={isEditingContact ? contactForm.email : userData.email || ''}
            onChange={handleContactInputChange}
            readOnly={!isEditingContact}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            name="phone"
            type="text"
            value={isEditingContact ? contactForm.phone : userData.phone || ''}
            onChange={handleContactInputChange}
            readOnly={!isEditingContact}
          />
        </div>
        <div className="form-group">
          <a href="#" className="change-password-link">
            Change Password
          </a>
        </div>
        <div className="card-actions">
          <button className="profile-button primary" onClick={handleContactEditClick} disabled={loading}>
            {isEditingContact ? (loading ? 'Saving...' : 'Save') : 'Edit'}
          </button>
        </div>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="profile-section-title">SHIPPING ADDRESS</div>
      <div className="profile-card address-book-card">
        <div className="form-group">
          <label>Street</label>
          <input
            name="street"
            type="text"
            value={isEditingAddress ? addressForm.street : userData.address?.street || ''}
            onChange={handleAddressInputChange}
            readOnly={!isEditingAddress}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            name="city"
            type="text"
            value={isEditingAddress ? addressForm.city : userData.address?.city || ''}
            onChange={handleAddressInputChange}
            readOnly={!isEditingAddress}
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            name="state"
            type="text"
            value={isEditingAddress ? addressForm.state : userData.address?.state || ''}
            onChange={handleAddressInputChange}
            readOnly={!isEditingAddress}
          />
        </div>
        <div className="form-group">
          <label>ZIP</label>
          <input
            name="zip"
            type="text"
            value={isEditingAddress ? addressForm.zip : userData.address?.zip || ''}
            onChange={handleAddressInputChange}
            readOnly={!isEditingAddress}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            name="country"
            type="text"
            value={isEditingAddress ? addressForm.country : userData.address?.country || ''}
            onChange={handleAddressInputChange}
            readOnly={!isEditingAddress}
          />
        </div>
        <div className="card-actions">
          <button className="profile-button primary" onClick={handleAddressEditClick} disabled={loading}>
            {isEditingAddress ? (loading ? 'Saving...' : 'Save') : 'Edit'}
          </button>
        </div>
      </div>

      {message && <div className="form-message">{message}</div>}
    </>
  );
}
