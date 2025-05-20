import React, { useState } from "react";
import './Navbar.css';

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

  return (
    <div className="topLoggedinContainer">
      <div className="topLoggedin">
        <a href="./Homepage.js">
          <img
            src="./nobackgroundlogo.png"
            alt="Logo"
            className="thissideuplogonobackground1"
          />
        </a>

        <div className="frame1">
          <div
            className="products"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            style={{ position: "relative" }}
          >
            <a href="#" className="clickable">
              Products
            </a>
            {showDropdown && (
              <div className="products-dropdown">
                <a href="./Skimboards.js">
                  <RightArrowIcon />
                  Skimboards
                </a>
                <a href="./Tshirt.js">
                  <RightArrowIcon />
                  T-shirts
                </a>
                <a href="./Jackets.js">
                  <RightArrowIcon />
                  Jackets
                </a>
                <a href="./Boardshorts.js">
                  <RightArrowIcon />
                  Boardshorts
                </a>
                <a href="./Accessories">
                  <RightArrowIcon />
                  Accessories
                </a>
                <a href="./Customskimboards.js">
                  <RightArrowIcon />
                  Custom Skimboards
                </a>
              </div>
            )}
          </div>

          <div className="about">
            <a href="./About.js" className="clickable">
              About
            </a>
          </div>

          <div className="contact">
            <a href="./Contact.js" className="clickable">
              Contact
            </a>
          </div>
        </div>

        <div className="loggedinprofileandcart">
          <div className="helpcircle">
            <a href="./FAQ">
              <img
                src="./faqcircle.svg"
                alt="Help Icon"
                style={{ width: "2rem", height: "2rem" }}
              />
            </a>
          </div>

          <div
            className="user"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
            style={{ position: "relative" }}
          >
            <a href="./Profile.js">
              <img
                src="./usericon.svg"
                alt="User Icon"
                style={{ width: "2rem", height: "2rem" }}
              />
            </a>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <a href="./MyAccount.js">My Account</a>
                <a href="./FAQ">FAQ</a>
                <hr />
                <a href="./Logout.js">Logout</a>
              </div>
            )}
          </div>

          <div className="shoppingcart">
            <a href="./Cart.js">
              <img
                src="./carticon.svg"
                alt="Cart Icon"
                style={{ width: "2rem", height: "2rem" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
