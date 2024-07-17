const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectname: {
        type: String,
        required: true, // Add required field
    },
    description: {
        type: String,
        required: true, // Add required field
    },
    deadline: {
        type: Date,
        required: true, // Add required field
    },
    team: {
        type: [String], // Ensure it's an array of strings
        required: true, // Add required field
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Testing', 'Completed'],
        default: 'Pending',
    },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
