import React from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <div className="heading">
        <h1>PRIVACY POLICY</h1>
      </div>
      <div className="content">
        <p>
          At ThisSideUp, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or interact with us, in accordance with the Personal Data Protection Act (PDPA) 2012 of Singapore.
        </p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Personal Details:</strong> Your name, email address, phone number, and delivery address</li>
          <li><strong>Payment Information:</strong> Billing details (Note: we do not store your credit card information; payments are processed by third-party providers)</li>
          <li><strong>Order History:</strong> Details of past orders and preferences</li>
          <li><strong>Website Usage Data:</strong> Browser type, IP address, pages visited, and time spent on site</li>
          <li><strong>Marketing Preferences:</strong> Your preferences for receiving updates and offers</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process and fulfill your orders</li>
          <li>To deliver customer support and respond to inquiries</li>
          <li>To send you updates, promotions, or news (only if you've opted in)</li>
          <li>To improve our website, products, and services</li>
          <li>To comply with legal or regulatory obligations</li>
        </ul>

        <h2>3. How We Protect Your Data</h2>
        <ul>
          <li>Using SSL encryption for data transmission</li>
          <li>Restricting access to personal data on a need-to-know basis</li>
          <li>Hosting our site on secure platforms</li>
        </ul>

        <h2>4. Sharing Your Information</h2>
        <p>We do not sell your personal data. However, we may share it with trusted third parties only when necessary:</p>
        <ul>
          <li>Payment processors (e.g., Stripe, PayNow)</li>
          <li>Delivery providers (e.g., local couriers)</li>
          <li>Email marketing services (if you opt-in)</li>
          <li>Government authorities, if required by law</li>
        </ul>

        <h2>5. Your Rights</h2>
        <ul>
          <li>Access and correct your personal data</li>
          <li>Withdraw consent to use your data (where applicable)</li>
          <li>Request deletion of your data (subject to legal and business constraints)</li>
        </ul>
        <p>You can contact us at <a href="mailto:hello@thissideup.sg">hello@thissideup.sg</a> to exercise any of your rights.</p>

        <h2>6. Cookies</h2>
        <p>Our website uses cookies to enhance user experience, understand browsing behavior, and improve site performance. You may disable cookies in your browser settings if you prefer.</p>

        <h2>7. External Links</h2>
        <p>Our site may contain links to other websites. We are not responsible for their privacy practices and recommend reviewing their privacy policies.</p>

        <h2>8. Updates to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be reflected on this page with a revised "Last Updated" date.</p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or your personal data, you can reach us at:</p>
        <ul>
          <li>📧 Email: <a href="mailto:hello@thissideup.sg">hello@thissideup.sg</a></li>
          <li>📍 Address: Singapore (exact location disclosed on request)</li>
          <li>📞 Phone: Available upon order confirmation or inquiry</li>
        </ul>

        <p>Thank you for trusting ThisSideUp — we're stoked to be part of your ride.</p>
      </div>
    </div>
  );
}
