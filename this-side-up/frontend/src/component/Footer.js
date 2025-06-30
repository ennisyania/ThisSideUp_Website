import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content-wrapper">
                <div className="footer-section footer-logo-section">
                    {/* Assuming you have a logo for the footer */}
                    <img src="./nobackgroundlogo.png" alt="This Side Up Logo" className="footer-main-logo" />
                    <div className="footer-social-icons">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="./instagram-icon.svg" alt="Instagram" className="social-icon" />
                        </a>
                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                            <img src="./tiktok-icon.svg" alt="TikTok" className="social-icon" />
                        </a>
                    </div>
                </div>

                <div className="footer-section footer-customer-service">
                    <h3>CUSTOMER SERVICE</h3>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        {/* Assuming you might have these pages */}
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms-of-service">Terms of Service</Link></li>
                    </ul>
                </div>

                <div className="footer-section footer-made-in-sg">
                    <h3>MADE IN SINGAPORE</h3>
                    <p>
                        This Side Up is a passionate skimboard company based in Singapore, dedicated to bringing the thrill of skimboarding to enthusiasts of all skill levels.
                        Specializing in custom-designed skimboards, This Side Up combines high-quality materials with unique, personalized designs to create boards that perform exceptionally and reflect individuality. Rooted in Singapore's vibrant coastal culture, the company aims to inspire a community of adventure seekers while promoting an active lifestyle.
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p className="footer-copyright">&copy; {new Date().getFullYear()}. This Side Up. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;