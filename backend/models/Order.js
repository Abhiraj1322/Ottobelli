const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    customizationSelectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomizationSelection",
      default: null,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // price at time of purchase
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],

    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "in_production", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    stripePaymentIntentId: { type: String },

    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);