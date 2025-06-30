const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 7008;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "carparkingmanagementsystem",
});

// Connect to the database
// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");

  // Create the Users table
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(15) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'owner') NOT NULL
    ) ENGINE=InnoDB;
  `;

  db.query(createUsersTableQuery, (err) => {
    if (err) {
      console.error("Error creating Users table:", err);
      return;
    }
    console.log("Users table ensured in database");

    const createParkingSpotTableQuery = `
  CREATE TABLE IF NOT EXISTS ParkingSpot (
    parking_spot_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) DEFAULT NULL, /* Optional name field */
    cost INT DEFAULT NULL,
    availability_status ENUM('Available', 'Reserved') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
`;
    db.query(createParkingSpotTableQuery, (err) => {
      if (err) {
        console.error("Error creating ParkingSpot table:", err);
        return;
      }
      console.log("ParkingSpot table ensured in database");

      // Create the Booking table
      const createBookingTableQuery = `
        CREATE TABLE IF NOT EXISTS Booking (
          booking_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          parking_spot_id INT NOT NULL,
          spot VARCHAR(255) NOT NULL,
          booking_date DATE NOT NULL,
          booking_time TIME NOT NULL,
          status ENUM('Confirmed') NOT NULL,
          city VARCHAR(255) NOT NULL,
          area VARCHAR(255) NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          FOREIGN KEY (parking_spot_id) REFERENCES ParkingSpot(parking_spot_id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
      `;

      db.query(createBookingTableQuery, (err) => {
        if (err) {
          console.error("Error creating Booking table:", err);
          return;
        }
        console.log("Booking table ensured in database");
      });
    });
  });
});


// Register Route
app.post('/RegisterPage', async (req, res) => {
  const { first_name, last_name, email, phone, password, role } = req.body;

  if (!first_name || !last_name || !email || !phone || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, result) => {
    if (err) {
      console.error('Error checking email in the database:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [first_name, last_name, email, phone, hashedPassword, role];

      db.query(query, values, (err) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (hashErr) {
      console.error('Error hashing password:', hashErr);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

//login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, jwtSecretKey, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role, // Include role in the response for frontend redirection
      user_id: user?.role === 'customer' ? user?.user_id : null,
      owner_id: user?.role === 'owner' ? user?.user_id : null,
      
    });
  });
});

app.post("/bookParking", (req, res) => {
  const {
    user_id,
    parking_spot_id,
    spot,
    booking_date,
    booking_time,
    status,
    city,
    area,
  } = req.body;

  // Validate that all required fields are provided
  if (
    !user_id ||
    !parking_spot_id ||
    !spot ||
    !booking_date ||
    !booking_time ||
    !status ||
    !city ||
    !area
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log(req.body);

  // Check if the specific parking spot is already booked for the same date and time
  const checkSpotAvailabilityQuery = `
    SELECT * FROM Booking 
    WHERE booking_date = ? AND booking_time = ?
  `;
  db.query(
    checkSpotAvailabilityQuery,
    [parking_spot_id, booking_date, booking_time],
    (err, result) => {
      if (err) {
        console.error("Error checking spot availability:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({
          error:
            "The selected parking spot is already booked for the given date and time",
        });
      }

      // Insert the booking into the Booking table
      const insertBookingQuery = `
        INSERT INTO Booking (user_id, parking_spot_id, spot, booking_date, booking_time, status, city, area) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        user_id,
        parking_spot_id,
        spot,
        booking_date,
        booking_time,
        status,
        city,
        area,
      ];

      db.query(insertBookingQuery, values, (err, result) => {
        if (err) {
          console.error("Error inserting booking data:", err);
          return res.status(500).json({ error: "Failed to create booking" });
        }

        res.status(201).json({
          message: "Booking created successfully",
          booking_id: result.insertId, // Return the newly created booking ID
        });
      });
    }
  );
});

app.post("/createParkingSpot", (req, res) => {
  const { user_id, name, cost, availability_status } = req.body;

  // Validate input
  if (!user_id || !availability_status) {
    return res
      .status(400)
      .json({ error: "user_id and availability_status are required" });
  }

  // Insert the parking spot into the ParkingSpot table
  const insertParkingSpotQuery = `
    INSERT INTO ParkingSpot (user_id, name, cost, availability_status) 
    VALUES (?, ?, ?, ?);
  `;

  // Use default null for optional fields
  const values = [
    user_id,
    name || null, // Optional name
    cost || null, // Optional cost
    availability_status || "Available", // Default availability
  ];

  db.query(insertParkingSpotQuery, values, (err, result) => {
    if (err) {
      console.error("Error inserting parking spot data:", err);
      return res.status(500).json({ error: "Failed to create parking spot" });
    }

    res.status(201).json({
      message: "Parking spot created successfully",
      parking_spot_id: result.insertId, // Return the newly created parking spot ID
    });
  });
});



// Fetch all bookings route
app.get('/bookings', (req, res) => {
  const query = 'SELECT * FROM Booking'; // Replace `Booking` with the correct table name if it's different
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});



// Password Reset Route
app.post("/reset-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Create a password reset token (mock for now)
    const resetToken = "mockToken123"; // Replace with actual token logic
    const resetLink = `http://localhost:7008/reset-password?token=${resetToken}`;

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use any email provider, e.g., Outlook, Yahoo
      auth: {
        user: process.env.EMAIL_USER, // Your email address from environment variables
        pass: process.env.EMAIL_PASS, // Your email password from environment variables
      },
    });

    // Define the email details
    const mailOptions = {
      from: `"SafeWheels Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      res.status(200).json({
        message: "Password reset link has been sent to your email.",
      });
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
      res.status(500).json({ error: "Failed to send password reset email." });
    }
  });
});

// Owner Dashboard API
app.get("/owner_dashboard", (req, res) => {
  const ownerId = req.query.owner_id;

  if (!ownerId) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  // Query to fetch all parking spots owned by the owner
  const parkingSpotsQuery = `
    SELECT parking_spot_id, cost, availability_status,name
    FROM ParkingSpot 
    WHERE user_id = ?;
  `;

  // Query to fetch booking history only for the owner's parking spots
  const bookingHistoryQuery = `
    SELECT
      Booking.booking_id,
      Booking.parking_spot_id,
      Booking.spot,
      Booking.booking_date,
      Booking.booking_time,
      Booking.status,
      Booking.city,
      Booking.area,
      users.first_name AS customer_first_name,
      users.last_name AS customer_last_name,
      users.email AS customer_email
    FROM Booking
    JOIN users ON Booking.user_id = users.user_id
    WHERE Booking.parking_spot_id IN (
      SELECT parking_spot_id 
      FROM ParkingSpot 
      WHERE user_id = ?
    );
  `;

  // Execute the queries
  db.query(parkingSpotsQuery, [ownerId], (err, parkingSpots) => {
    if (err) {
      console.error("Error fetching parking spots:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(bookingHistoryQuery, [ownerId], (err, bookingHistory) => {
      if (err) {
        console.error("Error fetching booking history:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Combine parking spots and booking history in the response
      res.status(200).json({
        parkingSpots,
        parkingHistory: bookingHistory,
        domainName: `Owner-${ownerId}`, // Optional domainName for frontend display
      });
    });
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
