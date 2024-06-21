const mongoose = require("mongoose");



const LeaveRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
  },
  fromDate: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  status: {
    type:String,
    enum:['Pending','Approved','Rejected'],
  },
});
const LeaveRequest = mongoose.model("LeaveRequest", LeaveRequestSchema);
module.exports = LeaveRequest;
