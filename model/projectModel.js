const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,

    },  
    description: {
        type: String,   

    },
    deadline: {
        type: Date,
    },
    team: {
        type: Array,
    },

    status:{
        type:String,
        enum:['Pending','In Progress','Testing','Completed'],
        default:'Pending',
    }

});
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;