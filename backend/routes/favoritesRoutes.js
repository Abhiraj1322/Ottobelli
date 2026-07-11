const express = require("express");
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favouriteController");
const { protect } = require("../middleware/authMiddleware");
 
// All favorites routes are protected — must be logged in
router.use(protect);
 
router.get("/", getFavorites);                        // GET    /api/favorites
router.post("/:productId", addFavorite);              // POST   /api/favorites/:productId
router.delete("/:productId", removeFavorite);         // DELETE /api/favorites/:productId
 
module.exports = router;
 