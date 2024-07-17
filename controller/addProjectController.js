const Project = require('../model/projectModel');
const mongoose = require('mongoose');
const User = require("../model/userModel");

const addProject = async (req, res) => {
  try {
      const { projectname, description, deadline, team } = req.body;

      // Validate data
      if (!projectname || !description || !deadline || !team) {
          return res.status(400).json({
              success: false,
              message: "Please enter all fields",
          });
      }

      // Add username to team
      const username = req.body.username;
      if (username) {
          team.push(username);
      }

      // Create a new project
      const newProject = new Project({
          projectname,
          description,
          deadline,
          team,
          status: 'Pending'  // Default status to "Pending"
      });

      // Save the project to the database
      const savedProject = await newProject.save();

      res.status(201).json({
          success: true,
          message: "Project added successfully",
          project: savedProject
      });
  } catch (error) {
      console.error('Error adding project:', error);

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



const updateProjectStatus = async (req, res) => {
  try {
      const { status } = req.body;
      const projectId = req.params.id;

      // Check if the project exists
      const projectData = await Project.findById(projectId);
      if (!projectData) {
          return res.status(404).json({
              success: false,
              message: "Project not found.",
          });
      }

      // Validate the status
      const validStatuses = ['Pending', 'In Progress', 'Testing', 'Completed'];
      if (!validStatuses.includes(status)) {
          return res.status(400).json({
              success: false,
              message: "Invalid status. Valid statuses are 'Pending', 'In Progress', 'Testing', 'Completed'.",
          });
      }

      // Update the status of the project
      projectData.status = status;

      // Save the project to the database
      const savedProject = await projectData.save();

      res.status(200).json({
          success: true,
          message: "Project status updated successfully.",
          project: savedProject,
      });
  } catch (error) {
      console.error('Error updating project status:', error);

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

const getAllProjectsByUserName = async (req, res) => {
  try {
      const username = req.params.username;

      // Find all projects where the team includes the specified user
      const projects = await Project.find({ team: username });

      res.status(200).json({
          success: true,
          projects
      });
  } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const getAllProject = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};



module.exports = {addProject,updateProjectStatus,getAllProjectsByUserName,getAllProject,deleteProject}