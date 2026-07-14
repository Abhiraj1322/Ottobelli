const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/genrateToken"); 
// @route   POST /api/auth/register
const register = async (req, res) => {
  // Destructure role from body instead of isAdmin to match your schema
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const existinguser = await User.findOne({ email });
    if (existinguser) return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the new user
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      // If a role is passed in the request, use it; otherwise, the schema defaults to "customer"
      role: role || "customer" 
    });
    
    await newUser.save();

    // 4. Respond with success and user info (matching your schema layout)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error in registering user", error: err.message });
  }
};

// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Check if input password matches hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Sign a single JWT token that expires in 2 hours (putting role in payload)
const token = generateToken(user);

    // 4. Send token and user data back in JSON body
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged-in user details (requires protect middleware)
const getCurrentUser = async (req, res) => {
  try {
    // The 'protect' middleware puts the user object on 'req.user' automatically
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
};

module.exports = { register, login, getCurrentUser };
