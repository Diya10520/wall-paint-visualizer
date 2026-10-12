require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Color = require('./models/Color');

const colors = [
  ['Ocean Breeze Blue', '#4A90B8', 'Living Room'], ['Sage Whisper', '#A8B8A0', 'Bedroom'],
  ['Terracotta Dusk', '#C86B4B', 'Accent'], ['Warm Sand', '#D9C3A0', 'Living Room'],
  ['Blush Petal', '#E8B4B8', 'Bedroom'], ['Mustard Seed', '#D8A82F', 'Accent'],
  ['Midnight Navy', '#2B3A55', 'Accent'], ['Soft Lavender', '#B9A9D6', 'Bedroom'],
  ['Mint Cream', '#B8E0CF', 'Kitchen'], ['Charcoal Slate', '#5A6169', 'Study'],
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if (!(await Color.countDocuments()))
    await Color.insertMany(colors.map(([name, hex, t]) => ({ name, hex, brand: 'Demo Paints', tags: [t] })));
  if (!(await User.findOne({ email: 'admin@paint.com' })))
    await User.create({ name: 'Admin', email: 'admin@paint.com', role: 'admin', passwordHash: await bcrypt.hash('admin123', 10) });
  console.log('Seeded. Admin login: admin@paint.com / admin123');
  process.exit(0);
})();
