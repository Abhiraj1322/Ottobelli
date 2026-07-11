const express = require("express");
const router = express.Router();
const { getProducts, getProductBySlug, getRelatedProducts } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.get("/:id/related", getRelatedProducts);

module.exports = router;