const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    bedType: { type: String, required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    totalUnits: { type: Number, required: true, min: 1, default: 1 },
    amenities: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);