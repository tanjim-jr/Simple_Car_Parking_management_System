import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

import carImage from "../assets/images/photo-1532751203793-812308a10d8e.avif";
import loginImage from "../assets/images/login.avif";
import userImage from "../assets/images/images.jpg";
import realImage from "../assets/images/real_time_parking.jpg";

const Home = () => {
  useEffect(() => {
    // Utility function to set up popup functionality
    function setupPopup(cardId, popupId, closeBtnId) {
      const card = document.getElementById(cardId);
      const popup = document.getElementById(popupId);
      const closeButton = document.getElementById(closeBtnId);

      if (card && popup && closeButton) {
        // Show popup on card click
        card.addEventListener("click", () => {
          popup.classList.remove("hidden");
        });

        // Hide popup on close button click
        closeButton.addEventListener("click", () => {
          popup.classList.add("hidden");
        });
      } else {
        console.error(
          `Missing elements: card (${cardId}), popup (${popupId}), or close button (${closeBtnId})`
        );
      }
    }

    // Set up popups for each card
    setupPopup("real-time-parking-card", "popup", "close-popup");
    setupPopup(
      "user-friendly-dashboards-card",
      "popup-dashboard",
      "close-dashboard-popup"
    );
    setupPopup("secure-login-card", "service-card", "close-popup-card-1");
  }, []);

  return (
    <div className="home">
      <header>
        <nav>
          <div className="logo">SafeWheels</div>
          <ul className="nav-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <Link to="/login" className="signup-btn">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className="signup-btn register-btn">
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="overlay"> </div>
        <div className="hero-content">
       
          <h1>SafeWheels</h1>
          <p>Streamline your parking with ease.</p>
          <a href="#services" className="btn">
            View Services
          </a>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-text">
            <h3 style={{ color: "green" }}>Parking made easy</h3>
            <h2>Efficient Parking Solutions</h2>
            <p>
              SafeWheels makes car parking easy and efficient in Chittagong, BD.
              Our simple system helps both parking owners and users manage their
              dashboards easily. With secure login and registration, users can
              access the platform safely. Say goodbye to parking problems and
              enjoy a smooth, hassle-free experience with Safe Wheels!
            </p>
            <a href="#contact" className="btn">
              Get in touch
            </a>
          </div>
          <div className="about-image">
            <img src={carImage} alt="Vintage Car" />
          </div>
        </div>
      </section>

      <section id="services">
        <div className="services-container">
          <h2>Effortless Parking</h2>
          <p>Make parking management simple and efficient!</p>
          <div className="services-cards">
            {/* Card 1 */}
            <div className="service-card" id="secure-login-card">
              <img src={loginImage} alt="Secure Login and Registration" />
              <h3>Secure login and registration</h3>
              <p>
                Effortlessly manage user access with secure login and
                registration.
              </p>
            </div>
            {/* Popup Overlay for Card 1 */}
            <div id="service-card" className="popup-overlay hidden">
              <div className="popup-content">
                <h2>Secure Login and Registration</h2>
                <p>
                  SafeWheels ensures a seamless experience for both car owners
                  and customers with our secure login and registration system.
                  Users can effortlessly create accounts and log in to access
                  their personalized dashboards. This feature not only enhances
                  security but also simplifies the parking management process.
                  Owners can manage their parking spaces effectively, while
                  customers can easily book their spots. By prioritizing
                  user-friendly access, SafeWheels empowers everyone involved in
                  parking operations to engage confidently, making it the ideal
                  solution for modern parking management.
                </p>
                <button id="close-popup-card-1" className="btn">
                  Close
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="service-card" id="user-friendly-dashboards-card">
              <img src={userImage} alt="User-Friendly Dashboards" />
              <h3>User-Friendly Dashboards</h3>
              <p>
                Navigate through intuitive dashboards tailored for owners and
                customers.
              </p>
            </div>

            {/* Popup for Card 2 */}
            <div id="popup-dashboard" className="popup-overlay hidden">
              <div className="popup-content">
                <h2>User-Friendly Dashboards</h2>
                <p>
                  SafeWheels offers user-friendly dashboards that cater
                  specifically to the needs of car owners and customers. With
                  intuitive layouts and easy navigation, users can quickly
                  access vital information regarding parking availability,
                  reservations, and management tools. Owners gain insights into
                  their parking spaces, while customers can monitor their
                  bookings in real-time. The design focuses on enhancing the
                  user experience, ensuring that all interactions are
                  straightforward and efficient. SafeWheel's dashboards
                  represent a perfect blend of functionality and simplicity,
                  making parking management hassle-free for everyone involved.
                </p>
                <button id="close-dashboard-popup" className="btn">
                  Close
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="service-card" id="real-time-parking-card">
              <div className="service-icon">
                <img src={realImage} alt="Real-Time Parking Management" />
              </div>
              <h3>Real-Time Parking Management</h3>
              <p>
                Keep track of parking availability and make real-time decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Popup Overlay */}
        <div id="popup" className="popup-overlay hidden">
          <div className="popup-content">
            <h2>Real-Time Parking Management</h2>
            <p>
              Experience the power of real-time parking management with Safe
              wheels. Our system provides instant updates on parking
              availability, allowing users to make informed decisions on-the-go.
              Owners can monitor occupancy levels and adjust pricing
              dynamically, while customers enjoy the convenience of finding
              available spaces in real-time. This feature not only enhances the
              efficiency of parking operations but also elevates the overall
              user experience. With SafeWheels, you can stay ahead of the curve,
              ensuring that your parking operations run smoothly and
              effectively, even in the busiest of times.
            </p>
            <button id="close-popup" className="btn">
              Close
            </button>
          </div>
        </div>
      </section>

      {/* contact section */}
      <section id="contact-us" className="contact-us-section">
        <div className="contact-container">
          <div className="contact-left">
            <Link to="/login" className="contact-us-text">
              Contact Us
            </Link>
          </div>

          <div className="contact-right">
            <div className="card">
              <h3>Email</h3>
              <p className="email-item">
                <a href="mailto:tanjimjrcsecu@gmail.com" className="email-link">
                  tanjimjrcsecu@gmail.com
                </a>
              </p>
            </div>
            <div className="card">
              <h3>Location</h3>
              <p className="location-item">
                <a
                  href="https://www.google.com/maps/search/?q=Chittagong,+Hathazari"
                  target="_blank"
                  className="location-link"
                >
                  Chittagong, Hathazari
                </a>
              </p>
            </div>

            <div className="card">
              <h3>Hours</h3>
              <div className="hours">
                <div className="time-row">
                  <span className="day">Monday:</span>{" "}
                  <span className="time">9:00am – 10:00pm</span>
                </div>
                <div className="time-row">
                  <span className="day">Tuesday:</span>{" "}
                  <span className="time">9:00am – 10:00pm</span>
                </div>
                <div className="time-row">
                  <span className="day">Wednesday:</span>{" "}
                  <span className="time">9:00am – 10:00pm</span>
                </div>
                <div className="time-row">
                  <span className="day">Thursday:</span>{" "}
                  <span className="time">9:00am – 10:00pm</span>
                </div>
                <div className="time-row">
                  <span className="day">Friday:</span>{" "}
                  <span className="time">9:00am – 10:00pm</span>
                </div>
                <div className="time-row">
                  <span className="day">Saturday:</span>{" "}
                  <span className="time">9:00am – 6:00pm</span>
                </div>
                <div className="time-row">
                  <span className="day">Sunday:</span>{" "}
                  <span className="time">9:00am – 12:00pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
