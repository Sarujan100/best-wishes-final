// middleware/validation.js

const { body } = require("express-validator");

const validateProduct = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("shortDescription").notEmpty().withMessage("Short description is required"),
  body("costPrice").isNumeric().withMessage("Cost price must be a number"),
  body("retailPrice").isNumeric().withMessage("Retail price must be a number"),
  body("stock").isNumeric().withMessage("Stock must be a number"),
];

// Export as an object property
module.exports = { validateProduct };
