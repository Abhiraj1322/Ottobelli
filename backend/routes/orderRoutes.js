const express = require("express");
const router = express.Router();
const { createOrder,getUserOrders,  getAllOrders,
  updateOrderStatus,getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware"); // Your auth middleware

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders); // MUST be above /:id

router.get("/all",protect,getAllOrders);
router.put("/:id/status",protect,updateOrderStatus)
router.get("/:id", protect, getOrderById);
module.exports = router;