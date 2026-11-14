const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
 // Protect all cart routes
router.use(protect);
 
router.get("/", getCart);                      // GET    /api/cart
router.post("/", addToCart);                   // POST   /api/cart
router.put("/:itemId", updateCartItem);        // PUT    /api/cart/:itemId
router.delete("/clear", clearCart);            // DELETE /api/cart/clear
router.delete("/:itemId", removeFromCart);     // DELETE /api/cart/:itemId
 
module.exports = router;
 