const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: String,
  row: String,
  status: { type: String, default: 'available' }
});

module.exports = mongoose.model('Seat', SeatSchema);