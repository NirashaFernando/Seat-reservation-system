const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }]
});

module.exports = mongoose.model('Event', EventSchema);