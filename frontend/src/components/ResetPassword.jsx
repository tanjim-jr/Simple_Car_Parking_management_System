import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/resetpassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:7008/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset password email");
      }

      setMessage("A password reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="logoo-container">
        <span className="logo">SafeWheels</span>
      </div>

      <div className="reset-password-form-container">
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <p>
            Enter your registered email address, and we'll send you a link to
            reset your password.
          </p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
          <p className="login-link">
            Remembered your password? <Link to="/login">Login</Link>
          </p>
        </form>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
