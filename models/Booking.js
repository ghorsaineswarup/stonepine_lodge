const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 1 },

    pricePerNight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    fees: { type: Number, required: true },
    total: { type: Number, required: true },

    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);