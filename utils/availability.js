const Booking = require('../models/Booking');
const Room = require('../models/Room');

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function parseAndValidateDates(checkInRaw, checkOutRaw) {
  const checkIn = new Date(checkInRaw);
  const checkOut = new Date(checkOutRaw);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw badRequest('checkIn and checkOut must be valid dates');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) throw badRequest('checkIn cannot be in the past');
  if (checkOut <= checkIn) throw badRequest('checkOut must be after checkIn');

  const nights = Math.round((checkOut - checkIn) / 86400000);
  if (nights > 30) throw badRequest('Stays longer than 30 nights are not supported online - please call the lodge');

  return { checkIn, checkOut, nights };
}

async function getAvailability(roomId, checkInRaw, checkOutRaw) {
  const room = await Room.findById(roomId);
  if (!room || !room.active) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }

  const { checkIn, checkOut, nights } = parseAndValidateDates(checkInRaw, checkOutRaw);

  const overlapping = await Booking.find({
    room: roomId,
    status: { $ne: 'cancelled' },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  }).select('_id');

  const bookedUnits = overlapping.length;
  const unitsLeft = Math.max(0, room.totalUnits - bookedUnits);

  return {
    room,
    checkIn,
    checkOut,
    nights,
    totalUnits: room.totalUnits,
    bookedUnits,
    unitsLeft,
    available: unitsLeft > 0,
  };
}

module.exports = { getAvailability, parseAndValidateDates, badRequest };