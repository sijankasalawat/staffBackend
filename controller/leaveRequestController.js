const LeaveRequest = require('../model/leaveRequest');
const mongoose = require('mongoose');
const User = require('../model/userModel');
const ObjectId = mongoose.Types.ObjectId;
const cloudinary = require("cloudinary").v2;

const createLeaveRequest = async (req, res) => {
    try {
      const { title, fromDate, toDate, reason } = req.body;
      const { file } = req.files;
  
      // Validate data
      if (!title || !fromDate || !toDate || !reason || !file) {
        return res.status(400).json({
          success: false,
          message: "Please enter all fields including the file",
        });
      }
  
      const userId = req.params.userId; // Extract user ID from URL params or from req.user based on your setup
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
  
      // Upload file to Cloudinary
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: 'leave_requests',
        crop: "scale"
      });
  
      if (!uploadedFile || !uploadedFile.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload file to Cloudinary",
        });
      }
  
      // Create a new leave request
      const newLeaveRequest = new LeaveRequest({
        userId,
        title,
        fromDate,
        toDate,
        reason,
        file: uploadedFile.secure_url,
        status:'Pending'
      });
  
      // Save the leave request to the database
      const savedLeaveRequest = await newLeaveRequest.save();
  
      // Add the leave request to the user's leaveRequests array
      user.leaveRequests.push(savedLeaveRequest._id); // Ensure user.leaveRequests is initialized properly
      await user.save();
  
      res.status(201).json({
        success: true,
        message: "Leave request created successfully.",
        leaveRequest: savedLeaveRequest,
      });
    } catch (error) {
      console.error('Error creating leave request:', error);
  
      // Handle specific error cases
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error. Please check your input.",
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };
const updateLeaveRequest = async (req, res) => {
    try {
      const { title, fromDate, toDate, reason , status} = req.body;
  
      const leaveRequestId = req.params.id;
      // Check if the user exists
      const leaveRequestData = await LeaveRequest.findById(leaveRequestId);
      if (!leaveRequestData) {
        return res.status(404).json({
          success: false,
          message: "Leave Request not found.",
        });
      }
  
      // Create a new leave request
      if(title) leaveRequestData.title = title;
      if(fromDate) leaveRequestData.fromDate = fromDate;
      if(toDate) leaveRequestData.toDate = toDate;
      if(reason) leaveRequestData.reason = reason;
      if(status) leaveRequestData.status = status;
  
      // Save the leave request to the database
      const savedLeaveRequest = await leaveRequestData.save();
  
      res.status(201).json({
        success: true,
        message: "Leave request updated successfully.",
        leaveRequest: savedLeaveRequest,
      });
    } catch (error) {
      console.error('Error updating leave request:', error);
  
      // Handle specific error cases
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error. Please check your input.",
        });
      }
  
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };
  

  const getAllLeaveRequests = async (req, res) => {
    try {
      const leaveRequests = await LeaveRequest.find().sort({ createdAt: -1 });
      res.status(200).json(leaveRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
const getLeaveRequestsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from URL params

    // Check if the user exists
    let user = await User.findById(userId).populate('leaveRequests')
   
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with the user's leave requests
    res.status(200).json({
      success: true,
      leaveRequests: user.leaveRequests?.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    console.error('Error fetching leave requests:', error);

    // Handle specific error cases
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLeaveRequest = await LeaveRequest.findByIdAndDelete(id);
        if (!deletedLeaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { createLeaveRequest, getAllLeaveRequests, getLeaveRequestsByUserId, deleteLeaveRequest , updateLeaveRequest}