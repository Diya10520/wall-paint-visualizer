const { Schema, model } = require('mongoose');
module.exports = model('Project', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Untitled room' },
  originalImage: { type: String, required: true },   // e.g. /uploads/abc.jpg
  // [{ points:[{x,y}], colorHex, colorName, opacity, finish }]
  walls: { type: Schema.Types.Mixed, default: [] },
}, { timestamps: true }));
