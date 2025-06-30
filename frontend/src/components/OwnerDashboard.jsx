import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [newParkingSpot, setNewParkingSpot] = useState({
    name: "",
    cost: "",
    availability_status: "Available",
  });
  const [ownerId] = useState(localStorage.getItem("owner_id")); // Assuming owner_id is stored after login

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7008/owner_dashboard?owner_id=${ownerId}`
      );
      setParkingSpots(response.data.parkingSpots);
      setBookingHistory(response.data.parkingHistory);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleCreateParkingSpot = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:7008/createParkingSpot", {
        user_id: ownerId,
        name: newParkingSpot.name || null, // Send name to backend
        cost: newParkingSpot.cost || null,
        availability_status: newParkingSpot.availability_status,
      });
      alert("Parking spot created successfully!");
      setNewParkingSpot({
        name: "",
        cost: "",
        availability_status: "Available",
      });
      fetchDashboardData(); // Refresh dashboard data
    } catch (error) {
      console.error("Error creating parking spot:", error);
      alert("Failed to create parking spot.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete(
          `http://localhost:7008/delete_owner_account?owner_id=${ownerId}`
        );
        alert("Account deleted successfully!");
        localStorage.clear();
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="owner-dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">SafeWheels</div>
        <div className="navbar-options">
          <button onClick={handleLogout} className="navbar-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Message */}
      <div className="welcome-message">
        Welcome, Owner! Manage your parking spots and bookings here.
      </div>

      {/* Create Parking Spot Form */}
      <div className="create-parking-spot">
        <h2>Create Parking Spot</h2>
        <form onSubmit={handleCreateParkingSpot}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              placeholder="Enter parking spot name"
              value={newParkingSpot.name}
              onChange={(e) =>
                setNewParkingSpot({ ...newParkingSpot, name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Cost: </label>
            <input
              type="number"
              placeholder="Enter cost (optional)"
              value={newParkingSpot.cost}
              onChange={(e) =>
                setNewParkingSpot({ ...newParkingSpot, cost: e.target.value })
              }
            />
          </div>
          <div>
            <label>Status: </label>
            <select
              value={newParkingSpot.availability_status}
              onChange={(e) =>
                setNewParkingSpot({
                  ...newParkingSpot,
                  availability_status: e.target.value,
                })
              }
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
          <button type="submit">Create Parking Spot</button>
        </form>
      </div>

      {/* Parking Spots */}
      <div className="table-container">
        <h2>Your Parking Spots</h2>
        <table className="parking-history-table">
          <thead>
            <tr>
              <th>Spot ID</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {parkingSpots.length > 0 ? (
              parkingSpots.map((spot) => (
                <tr key={spot.parking_spot_id}>
                  <td>{spot.parking_spot_id}</td>
                  <td>{spot.name || "Unnamed"}</td>
                  <td>{spot.cost || "Free"}</td>
                  <td>{spot.availability_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No parking spots found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Booking History */}
      <div className="table-container">
        <h2>Booking History</h2>
        <table className="parking-history-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Spot ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Spot</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookingHistory.length > 0 ? (
              bookingHistory.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.parking_spot_id}</td>
                  <td>
                    {booking.customer_first_name} {booking.customer_last_name}
                  </td>
                  <td>{booking.customer_email}</td>
                  <td>{booking.spot}</td>
                  <td>{booking.booking_date}</td>
                  <td>{booking.booking_time}</td>
                  <td>{booking.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No booking history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
