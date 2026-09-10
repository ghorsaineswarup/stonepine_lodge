const express = require('express');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');
const { getAvailability } = require('../utils/availability');

const router = express.Router();
const FEE_RATE = 0.11;

router.post('/', protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone } = req.body;
    if (!roomId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'roomId, checkIn, checkOut and guests are required' });
    }
    const result = await getAvailability(roomId, checkIn, checkOut);
    if (!result.available) {
      return res.status(409).json({ message: 'This room is fully booked for those dates' });
    }
    if (Number(guests) > result.room.maxGuests) {
      return res.status(400).json({ message: `This room sleeps a maximum of ${result.room.maxGuests} guests` });
    }
    const subtotal = result.nights * result.room.pricePerNight;
    const fees = Math.round(subtotal * FEE_RATE);
    const total = subtotal + fees;
    const booking = await Booking.create({
      user: req.user._id,
      room: result.room._id,
      checkIn: result.checkIn,
      checkOut: result.checkOut,
      guests,
      nights: result.nights,
      pricePerNight: result.room.pricePerNight,
      subtotal,
      fees,
      total,
      guestName: guestName || req.user.name,
      guestEmail: guestEmail || req.user.email,
      guestPhone,
      status: 'pending',
    });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Could not create booking' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room', 'name slug type').sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Could not load bookings', error: err.message });
  }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Could not cancel booking', error: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room', 'name type').populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Could not load bookings', error: err.message });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Could not update booking', error: err.message });
  }
});

module.exports = router;