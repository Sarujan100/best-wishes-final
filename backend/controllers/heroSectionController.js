const HeroSection = require('../models/HeroSection');
const cloudinary = require('../config/cloudinary');

// Get all hero sections
const getAllHeroSections = async (req, res) => {
  try {
    console.log('getAllHeroSections called');
    const heroSections = await HeroSection.find().sort({ order: 1, createdAt: -1 });
    console.log('Found hero sections:', heroSections.length);
    res.json({
      success: true,
      data: heroSections
    });
  } catch (error) {
    console.error('Error in getAllHeroSections:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero sections',
      error: error.message
    });
  }
};

// Get active hero sections
const getActiveHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      data: heroSections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active hero sections',
      error: error.message
    });
  }
};

// Create new hero section
const createHeroSection = async (req, res) => {
  try {
    console.log('createHeroSection called');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { title, description, isActive, order } = req.body;
    const file = req.file;

    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'hero-sections',
      resource_type: 'auto',
    });

    const heroSection = new HeroSection({
      title,
      description,
      image: result.secure_url,
      imagePublicId: result.public_id,
      isActive: isActive === 'true' || isActive === true,
      order: parseInt(order) || 0
    });

    await heroSection.save();

    res.status(201).json({
      success: true,
      message: 'Hero section created successfully',
      data: heroSection
    });
  } catch (error) {
    console.error('Error creating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hero section',
      error: error.message
    });
  }
};

// Update hero section
const updateHeroSection = async (req, res) => {
  try {
    console.log('updateHeroSection called');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { id } = req.params;
    const { title, description, isActive, order } = req.body;
    const file = req.file;

    const heroSection = await HeroSection.findById(id);
    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    // Update fields
    if (title !== undefined) heroSection.title = title;
    if (description !== undefined) heroSection.description = description;
    if (isActive !== undefined) heroSection.isActive = isActive === 'true' || isActive === true;
    if (order !== undefined) heroSection.order = parseInt(order) || 0;

    // If new image is uploaded, replace the old one
    if (file) {
      // Delete old image from cloudinary
      if (heroSection.imagePublicId) {
        await cloudinary.uploader.destroy(heroSection.imagePublicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'hero-sections',
        resource_type: 'auto',
      });

      heroSection.image = result.secure_url;
      heroSection.imagePublicId = result.public_id;
    }

    await heroSection.save();

    res.json({
      success: true,
      message: 'Hero section updated successfully',
      data: heroSection
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero section',
      error: error.message
    });
  }
};

// Delete hero section
const deleteHeroSection = async (req, res) => {
  try {
    const { id } = req.params;

    const heroSection = await HeroSection.findById(id);
    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    // Delete image from cloudinary
    if (heroSection.imagePublicId) {
      await cloudinary.uploader.destroy(heroSection.imagePublicId);
    }

    await HeroSection.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Hero section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hero section',
      error: error.message
    });
  }
};

// Toggle hero section status
const toggleHeroSectionStatus = async (req, res) => {
  try {
    console.log('toggleHeroSectionStatus called');
    console.log('Request params:', req.params);

    const { id } = req.params;

    const heroSection = await HeroSection.findById(id);
    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: 'Hero section not found'
      });
    }

    heroSection.isActive = !heroSection.isActive;
    await heroSection.save();

    res.json({
      success: true,
      message: `Hero section ${heroSection.isActive ? 'activated' : 'deactivated'} successfully`,
      data: heroSection
    });
  } catch (error) {
    console.error('Error toggling hero section status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling hero section status',
      error: error.message
    });
  }
};

module.exports = {
  getAllHeroSections,
  getActiveHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  toggleHeroSectionStatus
};
