const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/genrateToken");
 
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
 
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
 
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
 
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
 
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
 
    user.refreshToken = refreshToken;
    await user.save();
 
    res
      .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(201)
      .json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};
 
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
 
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
 
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
 
    user.refreshToken = refreshToken;
    await user.save();
 
    res
      .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};
 
// @route POST /api/auth/logout
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
 
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    }
 
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during logout", error: err.message });
  }
};
 
// @route POST /api/auth/refresh
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
 
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
 
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
 
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
 
    const newAccessToken = generateAccessToken(user._id);
 
    res
      .cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .status(200)
      .json({ message: "Access token refreshed" });
  } catch (err) {
    res.status(401).json({ message: "Refresh token invalid or expired" });
  }
};
 
// @route GET /api/auth/me
const getCurrentUser = async (req, res) => {
  // req.user is set by the `protect` middleware
  res.status(200).json({ user: req.user });
};
 
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};