const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  items: { type: [String], default: [] }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  attributes: {
    type: [attributeSchema],
    default: [],
  },
  icon: { type: String, default: "" },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for product count
categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "key",
  foreignField: "mainCategory",
  count: true,
});

module.exports = mongoose.model("Category", categorySchema);
