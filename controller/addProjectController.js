const Project = require('../model/projectModel');
const mongoose = require('mongoose');
const User = require("../model/userModel");

const addProject = async (req, res) => {
    try {
      const { name, description, deadline, team } = req.body;

      // Validate data
      if (!name || !description || !deadline || !team) {
        return res.status(400).json({
          success: false,
          message: "Please enter all fields",
        });
      }

      // Create a new project
      const newProject = new Project({
        name,
        description,
        deadline,
        team,
    
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
 const updateProject = async (req, res) => {
    try {
      const { name, description, deadline, team } = req.body;
  
      const projectId = req.params.id;
      // Check if the user exists
      const projectData = await Project.findById(projectId);
      if (!projectData) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }
  
      // Create a new project
      if(name) projectData.name = name;
      if(description) projectData.description = description;
      if(deadline) projectData.deadline = deadline;
      if(team) projectData.team = team;
  
      // Save the project to the database
      const savedProject = await projectData.save();
  
      res.status(201).json({
        success: true,  
        message: "Project updated successfully.",
        project: savedProject,
      });
    } catch (error) {
      console.error('Error updating project:', error);
  
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

  getAllProjectById = async (req, res) => {
    try {
      const userId = req.params.id;
      const projects = await Project.find({ userId });
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
  }



module.exports = {addProject,updateProject,getAllProjectById}