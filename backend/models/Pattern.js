const { Schema, model } = require('mongoose');
module.exports = model('Pattern', new Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  imageUrl: String,
  scale: { type: Number, default: 1 },
}, { timestamps: true }));
