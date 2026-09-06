const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

// GET /api/rooms - public, supports ?guests= and ?maxPrice= filters
router.get('/', async (req, res) => {
  try {
    const query = { active: true };
    if (req.query.guests) query.maxGuests = { $gte: Number(req.query.guests) };
    if (req.query.maxPrice) query.pricePerNight = { $lte: Number(req.query.maxPrice) };

    const rooms = await Room.find(query).sort({ pricePerNight: 1 });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: 'Could not load rooms', error: err.message });
  }
});

// GET /api/rooms/:slug - public, room detail by slug
router.get('/:slug', async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug, active: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Could not load room', error: err.message });
  }
});

module.exports = router;