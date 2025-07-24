const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservations");
const Seat = require("../models/seat");
const auth = require("../middleware/auth");

// Helper function to validate reservation time
const validateReservationTime = (date, timeSlot) => {
  const reservationDate = new Date(date);
  const now = new Date();

  // Normalize dates to compare only date part (ignore time)
  const reservationDateOnly = new Date(
    reservationDate.getFullYear(),
    reservationDate.getMonth(),
    reservationDate.getDate()
  );
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if date is in the past (before today)
  if (reservationDateOnly < todayOnly) {
    return { valid: false, message: "Cannot book past dates" };
  }

  // For today's bookings, check if reservation is at least 1 hour in advance
  if (reservationDateOnly.getTime() === todayOnly.getTime()) {
    const [startTime] = timeSlot.split("-");
    const [hours, minutes] = startTime.split(":");
    const reservationDateTime = new Date(reservationDate);
    reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    if (reservationDateTime <= oneHourFromNow) {
      return {
        valid: false,
        message: "Seats must be reserved at least 1 hour in advance for today",
      };
    }
  }

  return { valid: true };
};

// Create Reservation
router.post("/", auth, async (req, res) => {
  const { seatId, date, timeSlot } = req.body;
  const userId = req.user.id;

  console.log("Reservation request:", {
    userId,
    seatId,
    date,
    timeSlot,
    userRole: req.user.role,
  });

  try {
    // Validate input
    if (!seatId || !date || !timeSlot) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ error: "Seat ID, date, and time slot are required" });
    }

    // Validate reservation time
    const timeValidation = validateReservationTime(date, timeSlot);
    if (!timeValidation.valid) {
      console.log("Time validation failed:", timeValidation.message);
      return res.status(400).json({ error: timeValidation.message });
    }

    // Check if intern already has a reservation for this date
    const existingReservation = await Reservation.findOne({
      userId,
      date: new Date(date),
      status: "Active",
    });

    if (existingReservation) {
      console.log(
        "User already has reservation for this date:",
        existingReservation
      );
      return res
        .status(400)
        .json({ error: "An intern can only reserve one seat per day" });
    }

    // Check if seat exists and is available
    const seat = await Seat.findById(seatId);
    if (!seat) {
      console.log("Seat not found:", seatId);
      return res.status(404).json({ error: "Seat not found" });
    }

    console.log("Seat details:", seat);
    if (seat.status !== "Available") {
      console.log("Seat not available, status:", seat.status);
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
      console.log("Seat already booked:", seatBooking);
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

    console.log("Reservation created successfully:", reservation);

    // Populate the reservation with user and seat details
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate("userId", "name email")
      .populate("seatId", "seatNumber row location area");

    console.log("Populated reservation:", populatedReservation);

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: populatedReservation,
    });
  } catch (err) {
    console.error("Reservation creation error:", err);
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

// Get User's Current Reservations (future dates)
router.get("/my/current", auth, async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      userId: req.user.id,
      date: { $gte: now },
      status: "Active",
    })
      .populate("seatId", "seatNumber row location area")
      .sort({ date: 1, timeSlot: 1 });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User's Past Reservations
router.get("/my/past", auth, async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      userId: req.user.id,
      $or: [{ date: { $lt: now } }, { status: "Cancelled" }],
    })
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

// Update/Modify Reservation
router.put("/:id", auth, async (req, res) => {
  try {
    const { date, timeSlot, seatId } = req.body;
    const reservationId = req.params.id;
    const userId = req.user.id;

    // Find the existing reservation
    const existingReservation = await Reservation.findById(reservationId);
    if (!existingReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Check if the reservation belongs to the user (or is admin)
    if (
      existingReservation.userId.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Validate that the reservation is in the future
    if (new Date(existingReservation.date) <= new Date()) {
      return res.status(400).json({ error: "Cannot modify past reservations" });
    }

    // Prepare update data
    const updateData = {};

    if (date) {
      // Validate new date
      const newDate = new Date(date);
      if (newDate <= new Date()) {
        return res.status(400).json({ error: "Cannot book past dates" });
      }
      updateData.date = newDate;
    }

    if (timeSlot) {
      updateData.timeSlot = timeSlot;
    }

    if (seatId) {
      // Check if new seat exists and is available
      const seat = await Seat.findById(seatId);
      if (!seat) {
        return res.status(404).json({ error: "Seat not found" });
      }
      if (seat.status !== "Available") {
        return res.status(400).json({ error: "Seat not available" });
      }

      // Check if seat is already booked for the target date/time
      const conflictingReservation = await Reservation.findOne({
        seatId,
        date: updateData.date || existingReservation.date,
        timeSlot: updateData.timeSlot || existingReservation.timeSlot,
        status: "Active",
        _id: { $ne: reservationId }, // Exclude current reservation
      });

      if (conflictingReservation) {
        return res
          .status(400)
          .json({ error: "Seat is already booked for this time slot" });
      }

      updateData.seatId = seatId;
    }

    // Update the reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      updateData,
      { new: true }
    )
      .populate("userId", "name email")
      .populate("seatId", "seatNumber row location area");

    res.json({
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    });
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

module.exports = router;
