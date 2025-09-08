const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use environment variable or fallback to the provided MongoDB Atlas connection
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://cst21056:zShz90VmkH43JJcU@bestwishes.2aognuv.mongodb.net/bestwise?retryWrites=true&w=majority";
    
    // Connect to MongoDB Atlas with proper options
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err.message);
    // Don't exit the process, just log the error
    console.log("Continuing without database connection...");
  }
};

module.exports = connectDB;