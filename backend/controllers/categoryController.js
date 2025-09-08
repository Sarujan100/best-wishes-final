const Category = require("../models/Category")
const cors = require('cors');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 })
    
    res.json({
      success: true,
      data: categories,
      message: "Categories fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    })
  }
}

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    
    res.json({
      success: true,
      data: category,
      message: "Category fetched successfully"
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message
    })
  }
}

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body)
    await category.save()
    
    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully"
    })
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(400).json({
      success: false,
      message: "Error creating category",
      error: error.message
    })
  }
}

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    
    res.json({
      success: true,
      data: category,
      message: "Category updated successfully"
    })
  } catch (error) {
    console.error("Error updating category:", error)
    res.status(400).json({
      success: false,
      message: "Error updating category",
      error: error.message
    })
  }
}

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    
    res.json({
      success: true,
      message: "Category deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message
    })
  }
} 