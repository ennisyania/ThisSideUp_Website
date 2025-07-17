import React, { useState } from 'react';
import './Profile.css';

export default function ProfileDefaultContent() {
  // — Contact Info State —
  const [email, setEmail] = useState('useremail@gmail.com');
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  // — Password State —
  const [editingPassword, setEditingPassword] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  // — Address State —
  const [addresses, setAddresses] = useState({
    billing: 'defaultaddress ave 1',
    shipping: 'defaultaddress ave 1',
  });
  const [editingAddr, setEditingAddr] = useState(false);
  const [tempAddr, setTempAddr] = useState({ ...addresses });

  // Handlers
  const saveEmail = () => {
    setEmail(tempEmail);
    setEditingEmail(false);
  };
  const savePassword = () => {
    if (pw.next !== pw.confirm) {
      alert('New passwords must match');
      return;
    }
    alert('Password updated!');
    setPw({ current: '', next: '', confirm: '' });
    setEditingPassword(false);
  };
  const saveAddresses = () => {
    setAddresses({ ...tempAddr });
    setEditingAddr(false);
  };

  return (
    <>
      {/* — Contact Information — */}
      <section className="info-section">
        <h3 className="profile-section-title">Contact Information</h3>
        <div className="contact-wrapper">
          <div className="profile-card contact-card">
            {!editingEmail && (
              <>
                <p>
                  <strong>Username</strong><br/>
                  {email}
                </p>

                {/* password flow */}
                {!editingPassword ? (
                  <button
                    className="profile-text-link"
                    onClick={()=> setEditingPassword(true)}
                  >
                    Change Password
                  </button>
                ) : (
                  <div className="password-form">
                    <div className="form-group">
                      <label>Current</label>
                      <input
                        type="password"
                        value={pw.current}
                        onChange={e => setPw({...pw, current: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>New</label>
                      <input
                        type="password"
                        value={pw.next}
                        onChange={e => setPw({...pw, next: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm</label>
                      <input
                        type="password"
                        value={pw.confirm}
                        onChange={e => setPw({...pw, confirm: e.target.value})}
                      />
                    </div>
                    <div className="card-actions">
                      <button
                        className="profile-button primary"
                        onClick={savePassword}
                      >
                        <span>Save</span>
                      </button>
                      <button
                        className="profile-button"
                        onClick={()=>setEditingPassword(false)}
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* email edit form */}
            {editingEmail && (
              <div className="email-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                  />
                </div>
                <div className="card-actions">
                  <button
                    className="profile-button primary"
                    onClick={saveEmail}
                  >
                    <span>Save</span>
                  </button>
                  <button
                    className="profile-button"
                    onClick={()=>setEditingEmail(false)}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* parallelogram “Edit” button */}
          {!editingEmail && (
            <button
              className="edit-contact-button"
              onClick={()=> setEditingEmail(true)}
            ><span>Edit</span></button>
          )}
        </div>
      </section>

      {/* — Address Book — */}
      <section className="info-section">
        <h3 className="profile-section-title">Address Book</h3>
        <div className="profile-card address-card">
          {!editingAddr && (
            <>
              <div className="address-pair">
                <div className="address-block">
                  <strong>Default Billing Address</strong>
                  <p>{addresses.billing}</p>
                </div>
                <div className="address-block">
                  <strong>Default Shipping Address</strong>
                  <p>{addresses.shipping}</p>
                </div>
              </div>
              <button
                className="profile-text-link edit-address-text"
                onClick={()=> setEditingAddr(true)}
              >
                Edit Address
              </button>
            </>
          )}

          {editingAddr && (
            <>
              <div className="address-pair">
                <div className="address-block">
                  <label>Billing</label>
                  <textarea
                    rows={2}
                    value={tempAddr.billing}
                    onChange={e => setTempAddr({...tempAddr, billing: e.target.value})}
                  />
                </div>
                <div className="address-block">
                  <label>Shipping</label>
                  <textarea
                    rows={2}
                    value={tempAddr.shipping}
                    onChange={e => setTempAddr({...tempAddr, shipping: e.target.value})}
                  />
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="profile-button primary"
                  onClick={saveAddresses}
                >
                  <span>Save</span>
                </button>
                <button
                  className="profile-button"
                  onClick={()=> setEditingAddr(false)}
                >
                  <span>Cancel</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
