import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css"; // Import your CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Step 1: Register the user
      const response = await fetch("http://localhost:7008/RegisterPage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      setSuccess("User registered successfully");

      // Reset the form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      // Step 2: Log the user in automatically after registration
      const loginResponse = await fetch("http://localhost:7008/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || "Login failed after registration");
      }

      // Step 3: Store the JWT token in localStorage
      localStorage.setItem("token", loginData.token);

      // Redirect the user to their dashboard based on their role
      const role = loginData.role;

      // Step 4: Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 2000); // 2 seconds delay before redirecting

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register">
      <div className="logo-container">
        <span className="logo">SafeWheels</span>
      </div>
      <div className="registration-container">
        <div className="form-header">
          <h1>Register</h1>
        </div>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first-name">First Name</label>
            <input
              type="text"
              id="first-name"
              name="first_name"
              placeholder="Type Your First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              name="last_name"
              placeholder="Type Your Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Type Your Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Type Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Choose Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Type Your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="Type Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group role-dropdown">
            <label htmlFor="role">Select Your Role</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Your Role
              </option>
              <option value="customer">Customer</option>
              <option value="owner">Owner</option> 
              
            </select>
          </div>
          <button type="submit" className="btn-submit">
            Create Account
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <p className="login-text">
          Already have an Account? <Link to="/login">Log in</Link>
        </p>
      </div>

      {/* Footer Section */}
      <footer className="registration-footer">
        <nav>
          <Link to="/" className="footer-btn">

            Home
          </Link>
          <Link to="/#services" className="footer-btn">
            Services
          </Link>
          <Link to="/contact-us" className="footer-btn">
            Contact Us
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Register;
