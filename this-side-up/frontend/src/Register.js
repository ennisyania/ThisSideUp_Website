// src/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "./hooks/useSignup"; // Make sure this exists
import "./component/AuthForm.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    await signup(email, password);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            <span>{isLoading ? "Creating..." : "Create"}</span>
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <p className="auth-link-text">
          <Link to="/login" className="auth-link">
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
