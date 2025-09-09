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

// Update an existing event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { active, feature, ...otherFields } = req.body;

    // Ensure only the Edit functionality can update 'active' and 'feature'
    if (typeof active !== 'undefined' || typeof feature !== 'undefined') {
      return res.status(403).json({ message: "Cannot update 'active' or 'feature' fields outside of Edit functionality." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, otherFields, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

// Fetch upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const upcomingEvents = await Event.find({ date: { $gte: today } });
    res.status(200).json({ events: upcomingEvents });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming events', error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  getUpcomingEvents,
  deleteEvent,
};