const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const seatRoutes = require("./routes/seats");
const reservationRoutes = require("./routes/reservations");

const app = express();

// CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.send("Seat Reservation API is running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/reservations", reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
