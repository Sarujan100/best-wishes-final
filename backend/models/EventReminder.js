const mongoose = require('mongoose');

const eventReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remindermsg: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('EventReminder', eventReminderSchema);
