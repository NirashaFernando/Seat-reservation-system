const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservations");
const Seat = require("../models/seat");
const auth = require("../middleware/auth");

// Helper function to validate reservation time
const validateReservationTime = (date, timeSlot) => {
  const reservationDate = new Date(date);
  const now = new Date();
  
  // Reset time to start of day for date comparison
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const reservationStart = new Date(reservationDate.getFullYear(), reservationDate.getMonth(), reservationDate.getDate());

  // Check if date is in the past
  if (reservationStart < todayStart) {
    return { valid: false, message: "Cannot book past dates" };
  }

  // Check if reservation is at least 1 hour in advance (only for today's bookings)
  if (reservationStart.getTime() === todayStart.getTime()) {
    const [startTime] = timeSlot.split("-");
    const [hours, minutes] = startTime.split(":");
    const reservationDateTime = new Date(reservationDate);
    reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (reservationDateTime <= oneHourFromNow) {
      return {
        valid: false,
        message: "Seats must be reserved at least 1 hour in advance",
      };
    }
  }

  return { valid: true };
};

// Create Reservation
router.post("/", auth, async (req, res) => {
  const { seatId, date, timeSlot } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (!seatId || !date || !timeSlot) {
      return res
        .status(400)
        .json({ error: "Seat ID, date, and time slot are required" });
    }

    // Validate reservation time
    const timeValidation = validateReservationTime(date, timeSlot);
    if (!timeValidation.valid) {
      return res.status(400).json({ error: timeValidation.message });
    }

    // Check if intern already has a reservation for this date
    const existingReservation = await Reservation.findOne({
      userId,
      date: new Date(date),
      status: "Active",
    });

    if (existingReservation) {
      return res
        .status(400)
        .json({ error: "An intern can only reserve one seat per day" });
    }

    // Check if seat exists and is available
    const seat = await Seat.findById(seatId);
    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    if (seat.status !== "Available") {
      return res.status(400).json({ error: "Seat not available" });
    }

    // Check if seat is already booked for this date and time slot
    const seatBooking = await Reservation.findOne({
      seatId,
      date: new Date(date),
      timeSlot,
      status: "Active",
    });

    if (seatBooking) {
      return res
        .status(400)
        .json({ error: "Seat is already booked for this time slot" });
    }

    // Create reservation
    const reservation = await Reservation.create({
      userId,
      seatId,
      date: new Date(date),
      timeSlot,
      status: "Active",
    });

    // Populate the reservation with user and seat details
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate("userId", "name email")
      .populate("seatId", "seatNumber row location area");

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: populatedReservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User's Reservations
router.get("/my", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate("seatId", "seatNumber row location area")
      .sort({ date: -1, timeSlot: 1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Reservations (Admin only)
router.get("/all", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const reservations = await Reservation.find()
      .populate("userId", "name email role")
      .populate("seatId", "seatNumber row location area")
      .sort({ date: -1, timeSlot: 1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel Reservation
router.delete("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Check if user owns this reservation or is admin
    if (
      reservation.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update reservation status to cancelled
    reservation.status = "Cancelled";
    await reservation.save();

    res.json({ message: "Reservation cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get available time slots for a specific seat and date
router.get("/available-slots/:seatId/:date", auth, async (req, res) => {
  try {
    const { seatId, date } = req.params;

    const allTimeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
    ];

    // Get booked time slots for this seat and date
    const bookedReservations = await Reservation.find({
      seatId,
      date: new Date(date),
      status: "Active",
    });

    const bookedSlots = bookedReservations.map(
      (reservation) => reservation.timeSlot
    );
    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({ availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current Reservations (future and today)
router.get("/current", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const reservations = await Reservation.find({
      userId,
      status: "Active",
      date: { $gte: todayStart }
    })
      .populate("seatId", "seatNumber area location")
      .sort({ date: 1, timeSlot: 1 });

    // Transform the data to match frontend expectations
    const transformedReservations = reservations.map(reservation => ({
      ...reservation.toObject(),
      seat: reservation.seatId
    }));

    res.json(transformedReservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Past Reservations
router.get("/past", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const reservations = await Reservation.find({
      userId,
      date: { $lt: todayStart }
    })
      .populate("seatId", "seatNumber area location")
      .sort({ date: -1, timeSlot: -1 });

    // Transform the data to match frontend expectations
    const transformedReservations = reservations.map(reservation => ({
      ...reservation.toObject(),
      seat: reservation.seatId
    }));

    res.json(transformedReservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
