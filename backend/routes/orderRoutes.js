const express = require('express');
const { getUserOrderHistory, createOrder, getAllOrders } = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// Get order history for logged-in user
router.get('/history', isAuthenticated, getUserOrderHistory);

// Create order after payment success
router.post('/', isAuthenticated, createOrder);

// Get all orders (admin)
router.get('/all', getAllOrders);

module.exports = router;
