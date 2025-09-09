const Event = require('../models/Event');

// Create a new event
const createEvent = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body); // Log the incoming request payload

    const event = new Event(req.body);
    await event.save();

    console.log('Event saved successfully:', event); // Log the saved event
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error saving event:', error); // Log the full error object
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// Fetch all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
};