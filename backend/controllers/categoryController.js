const Category = require("../models/Category");
 
// @route GET /api/categories
// @desc  Get all top-level categories with their subcategories
// @query section=classics|everyday
// Example: /api/categories?section=classics
const getCategories = async (req, res) => {
  try {
    const { section } = req.query;
 
    const filter = { parentCategory: null }; // top-level only
    if (section) filter.section = section;
 
    // Get all top-level categories
    const topLevel = await Category.find(filter).sort({ order: 1 });
 
    // For each top-level category, fetch its subcategories
    const categoriesWithSubs = await Promise.all(
      topLevel.map(async (cat) => {
        const subcategories = await Category.find({
          parentCategory: cat._id,
        }).sort({ order: 1 });
 
        return {
          ...cat.toObject(),
          subcategories,
        };
      })
    );
 
    res.status(200).json({ categories: categoriesWithSubs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route GET /api/categories/:slug
// @desc  Get a single category by slug with its subcategories
// Example: /api/categories/suits-blazers
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
 
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
 
    const subcategories = await Category.find({
      parentCategory: category._id,
    }).sort({ order: 1 });
 
    res.status(200).json({ category: { ...category.toObject(), subcategories } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
module.exports = { getCategories, getCategoryBySlug };