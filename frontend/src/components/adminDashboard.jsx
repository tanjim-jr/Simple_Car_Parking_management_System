import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostBookedSpot, setMostBookedSpot] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch bookings from the backend
    axios
      .get("http://localhost:7008/bookings")
      .then((response) => {
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch bookings");
        setLoading(false);
      });
  }, []);

  const calculateMostBookedSpot = () => {
    if (bookings.length === 0) {
      alert("No bookings available to calculate.");
      return;
    }

    const spotFrequency = bookings.reduce((acc, booking) => {
      acc[booking.spot] = (acc[booking.spot] || 0) + 1;
      return acc;
    }, {});

    const maxSpot = Object.keys(spotFrequency).reduce((max, spot) =>
      spotFrequency[spot] > spotFrequency[max] ? spot : max
    );

    setMostBookedSpot(maxSpot);
  };

  const handleLogout = () => {
    // Clear any stored session data (e.g., token)
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

  if (loading) {
    return <div className="admin-dashboard-loading">Loading bookings...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      {/* Navbar */}
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <nav className="admin-dashboard-nav">
          <a href="/#home" className="nav-link">
            Home
          </a>
          <a href="/#services" className="nav-link">
            Services
          </a>
          <a href="/#contact-us" className="nav-link">
            Contact Us
          </a>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <h2>All Bookings</h2>
      {bookings.length > 0 ? (
        <div className="table-wrapper">
          <table className="admin-dashboard-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Spot</th>
                <th>Booking Date</th>
                <th>Booking Time</th>
                <th>Status</th>
                <th>City</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.user_id}</td>
                  <td>{booking.spot}</td>
                  <td>{booking.booking_date}</td>
                  <td>{booking.booking_time}</td>
                  <td>{booking.status}</td>
                  <td>{booking.city}</td>
                  <td>{booking.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-container">
            <button className="calculate-btn" onClick={calculateMostBookedSpot}>
              Find Most Booked Spot
            </button>
          </div>
          {mostBookedSpot && (
            <div className="most-booked-spot">
              <h3>Most Booked Spot</h3>
              <p>{mostBookedSpot}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="admin-dashboard-no-data">No bookings found.</div>
      )}
    </div>
  );
};

export default AdminDashboard;