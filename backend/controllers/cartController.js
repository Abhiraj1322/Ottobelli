const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @route GET /api/cart
// @desc  Get logged in user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate("items.productId", "name slug price images isCustomizable badge")
      .populate("items.profileId", "displayName")
      .populate("items.customizationSelectionId", "selections");

    // If no cart exists yet, return empty cart
    if (!cart) {
      return res.status(200).json({
        cart: { items: [], total: 0 },
      });
    }

    // Calculate total price
    const total = cart.items.reduce((sum, item) => {
      return sum + item.priceAtAdd * item.quantity;
    }, 0);

    res.status(200).json({ cart, total });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route POST /api/cart
// @desc  Add item to cart
// Body: { productId, profileId, customizationSelectionId (optional), quantity }
const addToCart = async (req, res) => {
  try {
    const { productId, profileId, customizationSelectionId, quantity = 1 } = req.body;

    if (!productId || !profileId) {
      return res.status(400).json({ message: "productId and profileId are required" });
    }

    // Get product to check if it exists and get its price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If product is customizable, customizationSelectionId is required
    if (product.isCustomizable && !customizationSelectionId) {
      return res.status(400).json({
        message: "Customization selections are required for this product",
      });
    }

    // Find or create cart for this user
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if same product + same profile already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.profileId.toString() === profileId
    );

    if (existingItemIndex >= 0) {
      // Item already exists — just update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        profileId,
        customizationSelectionId: customizationSelectionId || null,
        quantity,
        priceAtAdd: product.price, // snapshot price at time of adding
      });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route PUT /api/cart/:itemId
// @desc  Update quantity of a cart item
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route DELETE /api/cart/:itemId
// @desc  Remove an item from cart
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.deleteOne();
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route DELETE /api/cart
// @desc  Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };