// // controllers/productController.js
// const Product = require("../models/Product");



// // addProduct.js - admin only
// exports.addProduct = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       mainCategory,
//       facets,
//       price,
//       imageUrls,
//       stock,
//       rating,
//       isAvailable,
//       rentType,
//     } = req.body;

//     if (
//       !title ||
//       !description ||
//       !mainCategory ||
//       !price ||
//       !imageUrls ||
//       !Array.isArray(imageUrls) ||
//       imageUrls.length === 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields",
//       });
//     }

//     const product = await Product.create({
//       title,
//       description,
//       mainCategory,
//       facets,
//       price,
//       imageUrls,
//       stock,
//       rating,
//       isAvailable,
//       rentType,
//       owner: req.user._id, // ensure req.user is set from middleware
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Add Product Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while creating product",
//       error: error.message,
//     });
//   }
// };



// // get single Product
// exports.getProduct = async (req, res) =>{
//      try {
//     const productId = req.params.id;  

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);  // Send the product data as JSON
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }

// }

// // Get all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().limit(10); // Fetch all products from the DB

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'No products found' });
//     }

//     res.status(200).json(products); // Send all products as JSON
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// controllers/productController.js
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      ...attributes
    } = req.query;

    const query = {};
    if (search) {
      // Use regex search for elastic behavior
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { detailedDescription: { $regex: search, $options: "i" } },
        { mainCategory: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.mainCategory = { $regex: `^${category}$`, $options: "i" };
    if (status) query.status = status;

    // Add attribute filters to the query
    Object.keys(attributes).forEach(key => {
      if (key.startsWith('attributes.')) {
        const attributeKey = key.replace('attributes.', 'filters.');
        const values = Array.isArray(attributes[key]) ? attributes[key] : attributes[key].split(',');
        query[attributeKey] = { $in: values };
      }
    });

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sku } = req.body;
    if (!sku) {
      return res.status(400).json({ success: false, message: "SKU is required" });
    }

    const existing = await Product.findOne({ sku: sku.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "SKU already exists" });
    }

    const product = new Product({ ...req.body, sku: sku.toUpperCase() });
    await product.save();

    res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (error) {
    console.error(" Error in createProduct:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    console.log(" Updating product:", req.params.id);
    console.log(" Request body:", req.body);
    console.log(" Category and Filters in request:", {
      mainCategory: req.body.mainCategory,
      filters: req.body.filters,
      filtersKeys: Object.keys(req.body.filters || {}),
      filtersValues: Object.values(req.body.filters || {})
    });

    const update = { ...req.body, sku: req.body.sku.toUpperCase() };
    console.log(" Final update object:", update);
    
    const updated = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    console.log(" Updated product:", updated);
    res.json({ success: true, message: "Product updated", data: updated });
  } catch (error) {
    console.error(" Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};
