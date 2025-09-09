const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventManagementController');

// POST /api/events - Create a new event
router.post('/', createEvent);

// GET /api/events - Fetch all events
router.get('/', getAllEvents);

module.exports = router;