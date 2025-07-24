const express = require("express");
const router = express.Router();
const Seat = require("../models/seat");
const Reservation = require("../models/reservations");
const auth = require("../middleware/auth");

// Admin middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

// Create Seat (Admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { seatNumber, row, location, area, status } = req.body;

    // Check if seat number already exists
    const existingSeat = await Seat.findOne({ seatNumber });
    if (existingSeat) {
      return res.status(400).json({ error: "Seat number already exists" });
    }

    const seat = await Seat.create({
      seatNumber,
      row,
      location: location || "Main Hall",
      area: area || "Floor 1",
      status: status || "Available",
    });

    res.status(201).json({
      message: "Seat created successfully",
      seat,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Seats
router.get("/", auth, async (req, res) => {
  try {
    const { date, timeSlot } = req.query;

    // Get all seats
    let seats = await Seat.find().sort({ area: 1, seatNumber: 1 }).lean();

    // If date is provided, check availability
    if (date) {
      let reservationQuery = {
        date: new Date(date),
        status: "Active",
      };

      // If timeSlot is also provided, filter by specific time slot
      if (timeSlot) {
        reservationQuery.timeSlot = timeSlot;
      }

      const reservations = await Reservation.find(reservationQuery).select(
        "seatId"
      );

      const reservedSeatIds = reservations.map((r) => r.seatId.toString());

      // Mark seats as unavailable if they're reserved
      seats = seats.map((seat) => ({
        ...seat,
        status: reservedSeatIds.includes(seat._id.toString())
          ? "Unavailable"
          : seat.status,
      }));
    }

    res.json(seats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Seat
router.get("/:id", auth, async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }
    res.json(seat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Seat (Admin only)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { seatNumber, row, location, area, status } = req.body;

    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    // Check if new seat number conflicts with existing one
    if (seatNumber && seatNumber !== seat.seatNumber) {
      const existingSeat = await Seat.findOne({ seatNumber });
      if (existingSeat) {
        return res.status(400).json({ error: "Seat number already exists" });
      }
    }

    const updatedSeat = await Seat.findByIdAndUpdate(
      req.params.id,
      { seatNumber, row, location, area, status },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Seat updated successfully",
      seat: updatedSeat,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Seat (Admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    await Seat.findByIdAndDelete(req.params.id);

    res.json({
      message: "Seat deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get seat availability for a specific date and time slot
router.get("/availability/:date/:timeSlot", auth, async (req, res) => {
  try {
    const { date, timeSlot } = req.params;
    const Reservation = require("../models/reservations");

    // Get all seats
    const seats = await Seat.find({ status: "Available" }).sort({
      row: 1,
      seatNumber: 1,
    });

    // Get reserved seats for this date and time slot
    const reservations = await Reservation.find({
      date: new Date(date),
      timeSlot,
      status: "Active",
    });

    const reservedSeatIds = reservations.map((r) => r.seatId.toString());

    // Mark seats as available or reserved
    const seatsWithAvailability = seats.map((seat) => ({
      ...seat.toObject(),
      isAvailable: !reservedSeatIds.includes(seat._id.toString()),
    }));

    res.json(seatsWithAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
