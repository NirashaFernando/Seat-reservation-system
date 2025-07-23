const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      unique: true,
    },
    row: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      default: "Main Hall",
    },
    area: {
      type: String,
      required: true,
      default: "Floor 1",
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seat", SeatSchema);
