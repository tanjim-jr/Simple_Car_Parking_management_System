import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:7008/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // On successful login, store the token and owner_id in localStorage
      localStorage.setItem("token", data.token);

      // If role is owner, store owner_id and navigate to the OwnerDashboard
      if (data.role === "owner") {
        localStorage.setItem("owner_id", data.owner_id); // Assuming the response contains owner_id
        setSuccess("Welcome, Owner!");
        setTimeout(() => navigate("/OwnerDashboard"), 2000);

      } else if (data.role === "customer") {
        localStorage.setItem("user_id", data.user_id); 
        setSuccess("Successfully logged in as Customer!");
        setTimeout(() => navigate("/CustomerDashboard"), 2000);
      } else if (data.role === "admin") {
        setSuccess("Successfully logged in as Admin!");
        setTimeout(() => navigate("/AdminDashboard"), 2000);
      } else {
        setError("Access denied for this role.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    setResetMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:7008/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link");
      }

      setResetMessage("Password reset link has been sent to your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-cont">
      <div className="logoo-container">
        <span className="logo">SafeWheels</span>
      </div>

      <div className="login-container">
        {!showResetForm ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="forgot-password">
              <button
                type="button"
                className="link-button"
                onClick={() => setShowResetForm(true)}
              >
                Forgot Password?
              </button>
            </p>

            <p className="signup-text">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        ) : (
          <div className="reset-password-form">
            <h2>Reset Password</h2>
            <div className="form-group">
              <label htmlFor="resetEmail">Enter your registered email</label>
              <input
                type="email"
                id="resetEmail"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button onClick={handleResetPassword} className="reset-btn">
              Send Reset Link
            </button>
            <button
              type="button"
              className="back-to-login-btn"
              onClick={() => setShowResetForm(false)}
            >
              Back to Login
            </button>
            {resetMessage && <p className="success-text">{resetMessage}</p>}
            {error && <p className="error-text">{error}</p>}
          </div>
        )}
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </div>

      <footer className="login-footer">
        <nav>
          <Link to="/#home" className="footer-bttn">
            Home
          </Link>
          <Link to="/#services" className="footer-bttn">
            Services
          </Link>
          <Link to="/#contact-us" className="footer-bttn">
            Contact Us
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Login;
