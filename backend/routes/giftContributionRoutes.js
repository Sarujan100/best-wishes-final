const express = require('express');
const router = express.Router();
const giftContributionController = require('../controllers/giftContributionController');
const { isAuthenticated } = require('../middleware/authMiddleware');


router.post('/', isAuthenticated, giftContributionController.createContribution);
router.get('/:id', giftContributionController.getContribution);
router.post('/:id/pay', isAuthenticated, giftContributionController.markPaid);
router.post('/:id/decline', isAuthenticated, giftContributionController.declineContribution);
router.get('/', isAuthenticated, giftContributionController.listUserContributions);

module.exports = router;
