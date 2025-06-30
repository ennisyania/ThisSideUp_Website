import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Background SVG */}
      <img
        src="/footerbackground.svg"
        alt="Footer Decorative Background"
        className="footer-background"
      />

      {/* Content above the background */}
      <div className="footer-content">

        <div className="footer-columns">

          {/* Column 1: big SVG + Instagram & TikTok logos */}
          <div className="footer-column footer-column-1">
            <img
              src="/whitelogofooter.svg"
              alt="ThisSideUp Logo"
              className="footer-huge-logo"
            />
            <div className="social-logos">
              <a href="https://www.instagram.com/this_side_up.sg?igsh=OXEwcnM3Z2sxM3Zj" target="_blank" rel="noopener noreferrer">
                <img src="/instalogo.svg" alt="Instagram" className="social-logo" />
              </a>
              <a href="https://www.tiktok.com/@this_side_up.sg?_t=ZS-8xcNXNkDOYJ&_r=1" target="_blank" rel="noopener noreferrer">
                <img src="/tiktoklogo.svg" alt="TikTok" className="social-logo" />
              </a>
            </div>
          </div>

          {/* Column 2: Customer Service links */}
          <div className="footer-column footer-column-2">
            <h3>Customer Service</h3>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacypolicy">Privacy Policy</a></li>
              <li><a href="/termsAndConditions">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Column 3: Made in Singapore + paragraph */}
          <div className="footer-column footer-column-3">
            <h3>MADE IN SINGAPORE</h3>
            <p>
              This Side Up is a passionate skimboard company based in Singapore, dedicated to bringing the thrill of skimboarding to enthusiasts of all skill levels. Specializing in custom-designed skimboards, This Side Up combines high-quality materials with unique, personalized designs to create boards that perform exceptionally and reflect individual style. Rooted in Singapore's vibrant coastal culture, the company aims to inspire a community of adventure seekers while promoting an active lifestyle.  
            </p>
          </div>

        </div>

      </div>

      <p className="copyright">© 2025 ThisSideUp. All rights reserved.</p>

    </footer>
  );
}
