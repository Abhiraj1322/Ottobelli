const express = require("express");
const router = express.Router();
const { createOrder, getOrderById,getUserOrders,  getAllOrders,
  updateOrderStatus, } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware"); // Your auth middleware

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders); // MUST be above /:id
router.get("/:id", protect, getOrderById);
router.get("/all",protect,getAllOrders);
router.put("/:id/status",protect,updateOrderStatus)
module.exports = router;