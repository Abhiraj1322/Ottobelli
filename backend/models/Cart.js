const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    // Required for every item — forces "who is this for" selection at add-to-cart time
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },

    // Only set when the product is customizable (Classics items)
    customizationSelectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomizationSelection",
      default: null,
    },

    quantity: { type: Number, default: 1, min: 1 },
    priceAtAdd: { type: Number, required: true }, // snapshot price in case product price changes later
  },
  { _id: true, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);