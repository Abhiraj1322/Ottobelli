const express = require("express");
const router = express.Router();

// Import the clean register and login handlers from your controller
const { register, login,getCurrentUser } = require("../controllers/authController");
const {protect,adminOnly} =require("../middleware/authMiddleware")
// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/login
router.post("/login", login);

router.get("/me", protect, getCurrentUser);
module.exports = router;