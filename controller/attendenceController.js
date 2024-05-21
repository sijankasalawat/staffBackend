const Attendance = require('../model/attendenceModel');
const User = require("../model/userModel");
const markAttendance = async (req, res) => {
    console.log(req.body);
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
  
    try {
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
  
      const existingAttendance = await Attendance.findOne({
        userId: userId,
        date: today,
      });
  
      if (existingAttendance) {
        return res.json({
          success: false,
          message: "Attendance for today has already been marked",
        });
      }
  
      // Create a new attendance record
      const newAttendance = new Attendance({
        userId: userId,
        date: today,
        status: status,
      });
  
      // Save the attendance record to the database
      await newAttendance.save();
  
      // Return success response
      return res.json({
        success: true,
        message: "Attendance marked successfully",
      });
    } catch (error) {
      console.error("Error marking attendance:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
  
  module.exports = {
    markAttendance,
  };