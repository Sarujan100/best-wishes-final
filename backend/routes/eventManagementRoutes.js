const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, updateEvent, getUpcomingEvents, deleteEvent } = require('../controllers/eventManagementController');

// POST /api/events - Create a new event
router.post('/', createEvent);

// GET /api/events - Fetch all events
router.get('/', getAllEvents);

// PUT /api/events/:id - Update an existing event
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', deleteEvent);

// GET /api/events/upcoming - Fetch upcoming events
router.get('/upcoming', getUpcomingEvents);

module.exports = router;