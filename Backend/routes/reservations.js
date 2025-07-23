const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const seatRoutes = require('./routes/seats');
const reservationRoutes = require('./routes/reservations');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const router = express.Router();
const Reservation = require('../models/reservation');
const Seat = require('../models/Seat');

// Create Reservation
router.post('/', async (req, res) => {
  const { userId, eventId, seatId } = req.body;
  try {
    // Check if seat is available
    const seat = await Seat.findById(seatId);
    if (seat.status !== 'available') {
      return res.status(400).json({ error: 'Seat not available' });
    }
    // Reserve seat
    seat.status = 'reserved';
    await seat.save();
    const reservation = await Reservation.create({ userId, eventId, seatId });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId')
      .populate('eventId')
      .populate('seatId');
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel Reservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
    // Set seat back to available
    const seat = await Seat.findById(reservation.seatId);
    seat.status = 'available';
    await seat.save();
    await reservation.deleteOne();
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;