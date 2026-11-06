const Product = require("../models/Product");
const Category = require("../models/Category");
 
// @route GET /api/products
// @desc  Get all products with optional filters and sorting
// @query section=classics|everyday
// @query category=categoryId
// @query subcategory=subcategoryId
// @query sort=price_asc|price_desc|top_rated|material
// @query page=1&limit=12
// Example: /api/products?section=classics&sort=price_asc&page=1&limit=12
const getProducts = async (req, res) => {
  try {
    const { section, category, subcategory, sort, page = 1, limit = 12 } = req.query;
 
    const filter = {};
    if (section) filter.section = section;
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
 
    // Sort options
    let sortOption = { priority: -1 }; // default: backend priority order
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "top_rated") sortOption = { rating: -1 };
    if (sort === "material") sortOption = { materials: 1 }; // alphabetical by first material
 
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
 
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("category", "name slug")
      .populate("subcategory", "name slug");
 
    res.status(200).json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route GET /api/products/:slug
// @desc  Get a single product by slug, with related products
// Example: /api/products/charcoal-two-piece-suit
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("relatedProducts", "name slug price images badge"); // "customers also bought"
 
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
 
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route GET /api/products/:id/related
// @desc  Get related products for "customers also bought" section
// Example: /api/products/64abc123/related
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the main product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const selectFields = "name slug price salePrice images badge";

    // First priority: Same subcategory
    let relatedProducts = await Product.find({
      _id: { $ne: product._id },
      subcategory: product.subcategory,
      status: "Active",
    })
      .select(selectFields)
      .limit(4);

    // Second priority: Same category
    if (relatedProducts.length < 4) {
      const existingIds = [
        product._id,
        ...relatedProducts.map((item) => item._id),
      ];

      const moreProducts = await Product.find({
        _id: { $nin: existingIds },
        category: product.category,
        status: "Active",
      })
        .select(selectFields)
        .limit(4 - relatedProducts.length);

      relatedProducts.push(...moreProducts);
    }

    // Third priority: Same section
    if (relatedProducts.length < 4) {
      const existingIds = [
        product._id,
        ...relatedProducts.map((item) => item._id),
      ];

      const moreProducts = await Product.find({
        _id: { $nin: existingIds },
        section: product.section,
        status: "Active",
      })
        .select(selectFields)
        .limit(4 - relatedProducts.length);

      relatedProducts.push(...moreProducts);
    }

    return res.status(200).json({
      success: true,
      relatedProducts,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.find({
      badge: "Best Seller",
    })
      .select("name slug price currency images badge rating")
      .sort({ priority: -1, createdAt: -1 })
      .limit(8);

    res.status(200).json({
      bestSellers,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};


 
module.exports = { getProducts, getProductBySlug, getRelatedProducts,getBestSellers };