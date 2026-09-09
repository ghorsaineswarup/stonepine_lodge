const express = require('express');
const Room = require('../models/Room');
const { getAvailability } = require('../utils/availability');

const router = express.Router();

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

router.get('/:slug', async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug, active: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Could not load room', error: err.message });
  }
});

router.get('/:id/availability', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'checkIn and checkOut query params are required' });
    }
    const result = await getAvailability(req.params.id, checkIn, checkOut);
    res.json({
      available: result.available,
      unitsLeft: result.unitsLeft,
      totalUnits: result.totalUnits,
      nights: result.nights,
      pricePerNight: result.room.pricePerNight,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
});

module.exports = router;