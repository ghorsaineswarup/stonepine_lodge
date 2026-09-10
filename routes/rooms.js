const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
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

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ room });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'A room with that slug already exists' });
    res.status(400).json({ message: 'Could not create room', error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ room });
  } catch (err) {
    res.status(400).json({ message: 'Could not update room', error: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      status: { $ne: 'cancelled' },
      checkOut: { $gte: new Date() },
    });
    if (activeBookings > 0) {
      return res.status(409).json({
        message: `Cannot delete: ${activeBookings} upcoming booking(s) reference this room. Deactivate instead.`,
      });
    }
    const room = await Room.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deactivated', room });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete room', error: err.message });
  }
});

module.exports = router;