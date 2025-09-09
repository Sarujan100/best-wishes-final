const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'declined'],
    default: 'pending',
  },
  paymentLink: {
    type: String,
    required: true,
  },
  paidAt: {
    type: Date,
  },
  paymentIntentId: {
    type: String,
  },
  refundId: {
    type: String,
  }
});

const CollaborativePurchaseSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    default: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shareAmount: {
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
    enum: ['pending', 'completed', 'cancelled', 'expired', 'refunded'],
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
  completedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
  }]
});

// Index for efficient queries
CollaborativePurchaseSchema.index({ createdBy: 1, status: 1 });
CollaborativePurchaseSchema.index({ 'participants.email': 1 });
CollaborativePurchaseSchema.index({ deadline: 1 });

module.exports = mongoose.model('CollaborativePurchase', CollaborativePurchaseSchema);
