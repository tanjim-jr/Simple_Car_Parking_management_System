import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/customerDashboard.css";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const cityData = {
    Chittagong: {
      areas: ["Dhalai", "Fatehpur", "Forhadabad", "Garduara", "Gumanmardan"],
      spots: [
        "Station Road Parking Point",
        "Skyline Parking Area",
        "Urban Edge Parking Space",
        "Hathazari SafePark",
      ],
    },
    Dhaka: {
      areas: ["Gulshan", "Banani", "Dhanmondi"],
      spots: [
        "Banani Lakeside Parking Area",
        "West Banani Parking Spot",
        "Banani Road 11 Parking Hub",
        "Banani Bridge Parking Lot",
        "Gulshan Avenue Secure Parking",
      ],
    },
  };

  const [bookingTime, setBookingTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSpot, setSelectedSpot] = useState("");
  const [qrData, setQrData] = useState("");
  const [user_id] = useState(localStorage.getItem("user_id"));

  const areas = selectedCity ? cityData[selectedCity].areas : [];
  const spots = selectedCity ? cityData[selectedCity].spots : [];

  const handleBooking = async () => {
    if (
      !selectedCity ||
      !selectedArea ||
      !selectedSpot ||
      !bookingTime ||
      !bookingDate
    ) {
      alert("Please select city, area, spot, booking date, and booking time!");
      return;
    }

    const spotIndex = spots.indexOf(selectedSpot);
    if (spotIndex === -1) {
      alert("Invalid parking spot selection!");
      return;
    }
    const parking_spot_id =
      selectedCity === "Dhaka" ? spotIndex + 1 : spotIndex + 5;

    const bookingDetails = {
      user_id,
      parking_spot_id,
      spot: selectedSpot,
      booking_date: bookingDate,
      booking_time: bookingTime,
      status: "Confirmed",
      city: selectedCity,
      area: selectedArea,
    };

    try {
      const response = await axios.post(
        "http://localhost:7008/bookParking",
        bookingDetails
      );

      if (response.status === 201) {
        alert("Booking Successful!");
        setQrData(JSON.stringify(bookingDetails));
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("An error occurred while booking. Please try again by Sign In.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="customer-dashboard-nav">
        <div className="nav-links">
          <a href="/#home" className="nav-link">
            Home
          </a>
          <a href="/#services" className="nav-link">
            Services
          </a>
          <a href="/#contact-us" className="nav-link">
            Contact Us
          </a>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <div className="welcome-header">
        <h1>Welcome to SafeWheels</h1>
        <p>Your trusted parking solution. Book your parking spot below!</p>
      </div>

      {/* Booking Section */}
      <div className="customer-dashboard-container">
        <h2>Book a Parking Spot</h2>
        <div className="form-group">
          <label>Select City:</label>
          <select
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity}
          >
            <option value="">Select City</option>
            {Object.keys(cityData).map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Area:</label>
          <select
            onChange={(e) => setSelectedArea(e.target.value)}
            value={selectedArea}
          >
            <option value="">Select Area</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Parking Spot:</label>
          <select
            onChange={(e) => setSelectedSpot(e.target.value)}
            value={selectedSpot}
          >
            <option value="">Select Spot</option>
            {spots.map((spot, index) => (
              <option key={index} value={spot}>
                {spot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Select Booking Date:</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Booking Time:</label>
          <input
            type="time"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            required
          />
        </div>

        <button className="book-spot-btn" onClick={handleBooking}>
          Book Spot
        </button>

        {qrData && (
          <div className="qr-code-container">
            <h3>Booking QR Code</h3>
            <QRCodeCanvas value={qrData} size={200} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
