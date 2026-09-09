const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      stripePaymentIntentId,
      paymentStatus,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      stripePaymentIntentId,
      paymentStatus: paymentStatus || "paid",
      orderStatus: "processing",
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating order",
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CommonJS module export
module.exports = {
  createOrder,
  getOrderById,
};