const express = require('express');
const router = express.Router();
const {
  getAllHeroSections,
  getActiveHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  toggleHeroSectionStatus
} = require('../controllers/heroSectionController');
const upload = require('../middleware/uploadMiddleware');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', getActiveHeroSections);

// Admin routes (temporarily without authentication for testing)
router.get('/', getAllHeroSections);
router.post('/', upload.single('image'), createHeroSection);
router.put('/:id', upload.single('image'), updateHeroSection);
router.delete('/:id', deleteHeroSection);
router.patch('/:id/toggle-status', toggleHeroSectionStatus);

module.exports = router;
