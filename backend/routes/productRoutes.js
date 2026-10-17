const express = require("express");
const router = express.Router();
const { getProducts, getProductBySlug, getRelatedProducts,getBestSellers } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id/related", getRelatedProducts);
router.get("/best-sellers", getBestSellers);
module.exports = router;