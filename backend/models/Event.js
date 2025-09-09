const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema, 'upcomingEvent');