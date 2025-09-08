// const express = require('express');
// const router = express.Router();
// const { addProduct, getAllProducts } = require('../controllers/productController');
// const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// router.route('/addProduct').post(isAuthenticated, authorizeRoles('admin'), addProduct);
// router.route('/getAllProducts').get(getAllProducts);


// module.exports = router;
// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../middleware/validation");
// console.log("validateProduct:", validateProduct);
// console.log("createProduct:", createProduct);
router.get("/", getAllProducts);
router.get("/filter", getAllProducts);
router.get("/:id", getProduct);
router.post("/", validateProduct, createProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
