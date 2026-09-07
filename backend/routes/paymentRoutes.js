const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/paymentControllers");
const { protect } = require("../middleware/authMiddleware");

// Protected Payment Route
router.post("/create-payment-intent", protect, createPaymentIntent);

module.exports = router;