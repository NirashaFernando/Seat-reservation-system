const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seat' },
  reservedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);