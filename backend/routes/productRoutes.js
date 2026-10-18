const express = require("express");
const router = express.Router();
const { getProducts, getProductBySlug, getRelatedProducts,getBestSellers } = require("../controllers/productController");
router.get("/best-sellers", getBestSellers);
router.get("/", getProducts);
router.get("/:id/related", getRelatedProducts);
router.get("/:slug", getProductBySlug);
module.exports = router;