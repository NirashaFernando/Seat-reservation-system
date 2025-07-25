const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        "9:00 AM - 12:00 PM",
        "12:00 PM - 3:00 PM",
        "3:00 PM - 6:00 PM",
        "Full Day (9:00 AM - 6:00 PM)",
        // Keep old formats for backward compatibility
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00",
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
        "09:00-18:00", // Full day reservation
      ],
    },
    status: {
      type: String,
      enum: ["Active", "Cancelled"],
      default: "Active",
    },
    reservedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ReservationSchema.index({ userId: 1, date: 1 });
ReservationSchema.index({ seatId: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model("Reservation", ReservationSchema);
