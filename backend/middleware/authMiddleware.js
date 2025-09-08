// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // attach user to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to restrict access based on roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not allowed to access this resource`,
      });
    }
    next();
  };
};
