import React, { useState, useContext } from "react";
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';


import AuthContext from "../context/AuthContext";


import PopUpCart from './PopUpCart'; // <-- updated component name


const RightArrowIcon = () => (
  <svg
    className="dropdown-item-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E86540"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const { user, logout } = useContext(AuthContext);


  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };



  return (
    <>
      <div className="topLoggedinContainer">
        <div className="topLoggedin">
          <Link to="/">
            <img
              src="./nobackgroundlogo.png"
              alt="Logo"
              className="thissideuplogonobackground1"
            />
          </Link>

          <div className="frame1">
            <div
              className="products"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              style={{ position: "relative" }}
            >
              <span className="clickable">Products</span>
              {showDropdown && (
                <div className="products-dropdown">
                  <Link to="/skimboards"><RightArrowIcon /> Skimboards</Link>
                  <Link to="/tshirt"><RightArrowIcon /> T-shirts</Link>
                  <Link to="/jackets"><RightArrowIcon /> Jackets</Link>
                  <Link to="/boardshorts"><RightArrowIcon /> Boardshorts</Link>
                  <Link to="/accessories"><RightArrowIcon /> Accessories</Link>
                  <Link to="/customSkimboards"><RightArrowIcon /> Custom Skimboards</Link>
                </div>
              )}
            </div>

            <div className="about">
              <Link to="/about" className="clickable">About</Link>
            </div>

            <div className="contact">
              <Link to="/contact" className="clickable">Contact</Link>
            </div>
          </div>

          <div className="loggedinprofileandcart">
            <div className="helpcircle">
              <Link to="/faq">
                <img
                  src="./faqcircle.svg"
                  alt="Help Icon"
                  style={{ width: "2rem", height: "2rem" }}
                />
              </Link>
            </div>


            <div
              className="user"
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => setShowProfileDropdown(false)}
              style={{ position: "relative" }}
            >

              <img
                src="./usericon.svg"
                alt="User Icon"
                style={{ width: "2rem", height: "2rem" }}
              />

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  {user ? (
                    <>
                      <span style={{ padding: "0.5rem 1rem" }}>Logged in as <strong>{user.email}</strong></span>
                      <Link to="/account">My Account</Link>
                      <Link to="/faq">FAQ</Link>
                      <hr />
                      <Link to="/logout">
                        Logout
                      </Link>

                    </>
                  ) : (
                    <>
                      <Link to="/login">Login</Link>
                      <Link to="/register">Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>


            <div className="shoppingcart" onClick={() => setIsCartOpen(true)}>
              <img
                src="./carticon.svg"
                alt="Cart Icon"
                style={{ width: '2rem', height: '2rem', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div >

      <PopUpCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;