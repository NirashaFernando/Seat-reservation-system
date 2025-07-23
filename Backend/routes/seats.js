const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');

// Create Seat
router.post('/', async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    res.json(seat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Seats
router.get('/', async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json(seats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Single Seat
router.get('/:id', async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ error: 'Seat not found' });
    res.json(seat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;