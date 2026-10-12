const { Schema, model } = require('mongoose');
module.exports = model('Color', new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true, match: /^#[0-9a-fA-F]{6}$/ },
  brand: { type: String, default: 'Generic' },
  finishes: { type: [String], default: ['matte', 'glossy'] },
  tags: [String],
}, { timestamps: true }));
