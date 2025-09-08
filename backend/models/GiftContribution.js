// backend/models/GiftContribution.js

const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  hasPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  paymentLink: {
    type: String,
  },
  declined: {
    type: Boolean,
    default: false,
  }
});

const GiftContributionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  share: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: {
    type: [ParticipantSchema],
    validate: [arr => arr.length > 0 && arr.length <= 3, 'Participants must be 1-3'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'expired'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
  }]
});

module.exports = mongoose.model('GiftContribution', GiftContributionSchema);
