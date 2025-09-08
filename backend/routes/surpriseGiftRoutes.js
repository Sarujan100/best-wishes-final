const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const { createSurpriseGift, getMySurpriseGifts } = require('../controllers/surpriseGiftController');

router.post('/', isAuthenticated, createSurpriseGift);
router.get('/my', isAuthenticated, getMySurpriseGifts);

module.exports = router;


