const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;