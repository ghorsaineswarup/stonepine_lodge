const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [rooms, bookings, guestCount] = await Promise.all([
      Room.find({ active: true }),
      Booking.find().populate('room', 'name totalUnits'),
      User.countDocuments({ role: 'guest' }),
    ]);

    const active = bookings.filter((b) => b.status !== 'cancelled');
    const revenue = active.reduce((sum, b) => sum + b.total, 0);

    const statusCounts = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, { pending: 0, confirmed: 0, cancelled: 0 });

    const today = new Date();
    const totalUnits = rooms.reduce((sum, r) => sum + r.totalUnits, 0) || 1;
    const occupiedToday = active.filter((b) => b.checkIn <= today && b.checkOut > today).length;
    const occupancyRate = Math.min(100, Math.round((occupiedToday / totalUnits) * 100));

    res.json({
      totalBookings: bookings.length,
      revenue,
      occupancyRate,
      roomTypeCount: rooms.length,
      guestCount,
      statusCounts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Could not load stats', error: err.message });
  }
});

module.exports = router;