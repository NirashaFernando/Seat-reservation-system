const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Seat = require('../models/Seat');

// Create Event
router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('seats');
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Single Event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('seats');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add Seats to Event
router.post('/:id/seats', async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $push: { seats: seat._id } },
      { new: true }
    ).populate('seats');
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;