const Attendance = require('../model/attendenceModel');
const User = require("../model/userModel");
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;


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
const attendanceRecords = async (req, res) => {
  try {
    // Validate if req.params.id is a valid ObjectId
    if (!ObjectId.isValid(req.params.id)) {
      return res.json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    
    // Get the start of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get the end of today
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Find attendance records for the user for today
    const attendances = await Attendance.find({
      userId: user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    // Extract the status of each attendance record
    const statuses = attendances.map(attendance => attendance.status);

    return res.json({
      success: true,
      statuses,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
    });
  }
}

const getTotalPresentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received ID: ${id}`);  // Log the received ID

    if (!ObjectId.isValid(id)) {
      return res.json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const totalPresent = await Attendance.countDocuments({
      userId: id,
      status: 'Present',
    });

    return res.json({
      success: true,
      totalPresent,
    });
  } catch (error) {
    console.error("Error fetching total present days:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTotalAbsentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const totalAbsent = await Attendance.countDocuments({
      userId: id,
      status: 'Absent',
    });

    return res.json({
      success: true,
      totalAbsent,
    });
  } catch (error) {
    console.error("Error fetching total absent days:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

 

module.exports = {
  markAttendance,
  updateAttendance,
  attendanceRecords,
  getTotalPresentById,
  getTotalAbsentById,
};
