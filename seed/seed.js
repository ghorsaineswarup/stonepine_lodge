require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');

const ROOMS = [
  { slug: 'trailhead-room', name: 'Trailhead Room', type: 'Standard',
    description: 'A snug room just off the mudroom, made for early starts - wood stove, forest view, and boot hooks by the door.',
    bedType: 'Queen bed', pricePerNight: 189, maxGuests: 2, totalUnits: 4,
    amenities: ['Wood stove', 'Forest view', 'Free wifi', 'Rain shower'],
    image: '/img/trailhead-room.png' },
  { slug: 'hearth-cabin', name: 'Hearth Cabin', type: 'Cabin',
    description: 'A detached cabin with its own hearth and a copper soaking tub on the porch, ten steps from the tree line.',
    bedType: 'Queen + daybed', pricePerNight: 249, maxGuests: 3, totalUnits: 3,
    amenities: ['Private hearth', 'Soaking tub', 'Porch', 'Pet friendly'],
    image: '/img/hearth-cabin.png' },
  { slug: 'ridge-suite', name: 'Ridge Suite', type: 'Suite',
    description: 'Two connected rooms opening onto a ridge-view balcony, with a kitchenette for slow mornings.',
    bedType: 'King + twin room', pricePerNight: 329, maxGuests: 4, totalUnits: 3,
    amenities: ['Ridge balcony', 'Kitchenette', 'Free wifi', 'Fireplace'],
    image: '/img/ridge-suite.png' },
  { slug: 'alpine-loft', name: 'Alpine Loft', type: 'Loft',
    description: 'Vaulted timber ceilings and a sleeping loft reached by a short ladder - built for families who climb.',
    bedType: 'King + loft nook', pricePerNight: 279, maxGuests: 3, totalUnits: 3,
    amenities: ['Vaulted ceiling', 'Loft nook', 'Free wifi', 'Rain shower'],
    image: '/img/alpine-loft.png' },
  { slug: 'summit-suite', name: 'Summit Suite', type: 'Suite',
    description: 'The top-floor suite, with a wraparound deck, a private sauna, and the first light on the range each morning.',
    bedType: 'King + bunk room', pricePerNight: 459, maxGuests: 5, totalUnits: 2,
    amenities: ['Private sauna', 'Wraparound deck', 'Fireplace', 'Free wifi'],
    image: '/img/summit-suite.png' },
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in .env before seeding');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected. Seeding rooms...');
  for (const r of ROOMS) {
    await Room.findOneAndUpdate({ slug: r.slug }, r, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`  upserted: ${r.name}`);
  }
  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => { console.error('Seed failed:', err); process.exit(1); });