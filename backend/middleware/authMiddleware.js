const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the access token from the Authorization header and attaches req.user
const protect = async (req, res, next) => {
  try {
    let token;

    // Look for the token strictly in the HTTP Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      // Split "Bearer <token>" and take the token part
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token was sent in the header, reject immediately
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify the token using your standard secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user data while stripping out the password and refresh token fields
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // Attach the verified user details to the request object for the next functions
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

// Restrict a route to admins only — use after running `protect`
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

module.exports = { protect, adminOnly };