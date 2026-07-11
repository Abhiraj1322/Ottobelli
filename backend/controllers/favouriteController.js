const User = require("../models/User");
 
// @route GET /api/favorites
// @desc  Get all favorites for logged in user
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "favorites",
      "name slug price images badge isCustomizable"
    );
 
    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route POST /api/favorites/:productId
// @desc  Add a product to favorites
const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
 
    // Check if product is already in favorites
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }
 
    user.favorites.push(req.params.productId);
    await user.save();
 
    res.status(200).json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route DELETE /api/favorites/:productId
// @desc  Remove a product from favorites
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
 
    // Check if product is actually in favorites
    if (!user.favorites.includes(req.params.productId)) {
      return res.status(400).json({ message: "Product not in favorites" });
    }
 
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();
 
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
module.exports = { getFavorites, addFavorite, removeFavorite };