const express = require('express');
const router = express.Router();
const collaborativePurchaseController = require('../controllers/collaborativePurchaseController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// Admin routes - Get all collaborative purchases
router.get('/all', isAuthenticated, authorizeRoles('admin', 'inventoryManager'), collaborativePurchaseController.getAllCollaborativePurchases);

// Admin routes - Print individual collaborative purchase details
router.get('/:id/print', isAuthenticated, authorizeRoles('admin', 'inventoryManager'), collaborativePurchaseController.printCollaborativePurchaseDetails);

// Admin routes - Print all delivered collaborative purchases
router.get('/print-all-delivered', isAuthenticated, authorizeRoles('admin', 'inventoryManager'), collaborativePurchaseController.printAllDeliveredCollaborativePurchases);

// Admin routes - Start packing process
router.post('/:id/start-packing', isAuthenticated, authorizeRoles('admin', 'inventoryManager'), collaborativePurchaseController.startPacking);

// Admin routes - Update status
router.put('/:id/status', isAuthenticated, authorizeRoles('admin', 'inventoryManager'), collaborativePurchaseController.updateCollaborativeStatus);

// Delivery staff routes
router.get('/delivery', isAuthenticated, authorizeRoles('deliveryStaff'), collaborativePurchaseController.getDeliveryCollaborativePurchases);
router.get('/delivery-stats', isAuthenticated, authorizeRoles('deliveryStaff'), collaborativePurchaseController.getDeliveryStats);
router.put('/delivery/:id/status', isAuthenticated, authorizeRoles('deliveryStaff'), collaborativePurchaseController.updateDeliveryStatus);

// Create collaborative purchase
router.post('/', isAuthenticated, collaborativePurchaseController.createCollaborativePurchase);

// Get collaborative purchase details
router.get('/:id', isAuthenticated, collaborativePurchaseController.getCollaborativePurchase);

// Get collaborative purchase by payment link (public route for participants)
router.get('/payment/:paymentLink', collaborativePurchaseController.getCollaborativePurchaseByPaymentLink);

// Process payment for a participant
router.post('/payment/:paymentLink', collaborativePurchaseController.processPayment);

// Decline participation
router.post('/decline/:paymentLink', collaborativePurchaseController.declineParticipation);

// Get user's collaborative purchases
router.get('/', isAuthenticated, collaborativePurchaseController.getUserCollaborativePurchases);

// Cancel collaborative purchase (creator only)
router.post('/:id/cancel', isAuthenticated, collaborativePurchaseController.cancelCollaborativePurchase);

module.exports = router;
