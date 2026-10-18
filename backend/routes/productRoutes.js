const express = require("express");
const router = express.Router();
const { getProducts, getProductBySlug, getRelatedProducts,getBestSellers } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/best-sellers", getBestSellers);
router.get("/:id/related", getRelatedProducts);

module.exports = router;