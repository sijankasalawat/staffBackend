const Event = require("../model/eventModel");


const createEvent = async (req, res) => {
    try {
        const { name, description, date, time, location } = req.body;
        const newEvent = new Event({
            name,
            description,    
            date,
            time,
            location
        });
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { createEvent, getAllEvents };

