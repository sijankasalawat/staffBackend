const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    description: {
        type: String,
       
    },
    date: {
        type: Date,
      
    },
    time: {
        type: String,
      
    },
    location: {
        type: String,
    
    },
   
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;