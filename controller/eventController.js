const Event = require("../model/eventModel");

const createEvent = async (req, res) => {
  try {
    const { name, description, date, time, location } = req.body;
    const newEvent = new Event({
      name,
      description,
      date,
      time,
      location,
    });
    await newEvent.save();
    res.status(200).json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {ActiveXObject
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting event with id: ${id}`);
      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
module.exports = { createEvent, getAllEvents, deleteEvent };
