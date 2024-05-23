const Attendance = require('../model/attendenceModel');
const User = require("../model/userModel");

const markAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // Check if all required fields are provided
    if (!userId || !status) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if status is valid
    const validStatuses = ['Present', 'Absent'];
    if (!validStatuses.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the attendance for today already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    let existingAttendance = await Attendance.findOne({
      userId: userId,
      timestamp: today,
    });

    if (existingAttendance) {
      // If attendance exists, update the existing record
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.json({
        success: true,
        message: "Attendance updated successfully",
      });
    } else {
      // If attendance does not exist, create a new record
      const newAttendance = new Attendance({
        userId: userId,
        status: status,
        timestamp: today,
      });
      await newAttendance.save();
      return res.json({
        success: true,
        message: "Attendance marked successfully",
      });
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const updateAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // Check if all required fields are provided
    if (!userId || !status) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if status is valid
    const validStatuses = ['Present', 'Absent'];
    if (!validStatuses.includes(status)) {
      return res.json({
        success: false,
        message: "Invalid status",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the attendance for today has already been marked
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    let existingAttendance = await Attendance.findOne({
      userId: userId,
      date: today,
    });

    if (existingAttendance) {
      // If attendance exists, update the existing record
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.json({
        success: true,
        message: "Attendance updated successfully",
      });
    } else {
      // If attendance does not exist, create a new record
      const newAttendance = new Attendance({
        userId: userId,
        date: today,
        status: status,
      });
      await newAttendance.save();
      return res.json({
        success: true,
        message: "Attendance marked successfully",
      });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  markAttendance,
  updateAttendance,
};
