import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../store/userAuthStore";
import useFavoritesStore from "../store/favoritesStore";

// ─── Product Card ──────────────────────────────────────────────────────────
const ProductCard = ({ product, section, onFavorite, isFavorited }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
const [isFavourite, setIsFavourite] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        navigate(
          `/products/${product.slug}?section=${section}&category=${product.subcategory?.slug || ""}`
        )
      }
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden mb-3"
        style={{ aspectRatio: "3/4", background: "#111118" }}
      >
        {/* Product image */}
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ opacity: 0.85 }}
        />

        {/* Overlay on hover */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: "#09090E" }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span
              className="text-[7px] tracking-[0.2em] px-2 py-0.5 font-bold uppercase"
              style={{ background: "#C8A96E", color: "#1A1814" }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Customizable tag */}
        {product.isCustomizable && (
          <div className="absolute top-3 right-3">
            <span
              className="text-[7px] tracking-[0.15em] px-2 py-0.5 font-bold uppercase"
              style={{
                background: "rgba(200,169,110,0.15)",
                border: "1px solid rgba(200,169,110,0.4)",
                color: "#C8A96E",
              }}
            >
              Customizable
            </span>
          </div>
        )}

        {/* Favorite button */}
        <motion.button
          className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors z-20"
          animate={{ opacity: hovered || isFavorited ? 1 : 0 }}
          transition={{ duration: 0.2}}
          style={{
            background: "rgba(9,9,14,0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(product._id);
          }}
        >
          <Heart
            size={12}
            strokeWidth={1.5}
            color={isFavorited ? "#C8A96E" : "rgba(255,255,255,0.6)"}
            fill={isFavorited ? "#C8A96E" : "none"}
          />
        </motion.button>

        {/* Quick view on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 py-3 text-center z-10"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          style={{ background: "rgba(9,9,14,0.85)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/70">
            View Product →
          </span>
        </motion.div>
      </div>

      {/* Product info */}
      <div>
        <h3
          className="text-xs font-semibold text-white mb-1 truncate"
          style={{ letterSpacing: "0.05em" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ${product.price.toLocaleString()}
          </span>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            CAD
          </span>
        </div>

        {/* Rating dots */}
        {product.rating > 0 && (
          <div className="flex gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background:
                    star <= Math.round(product.rating)
                      ? "#C8A96E"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Category Listing Page ────────────────────────────────────────────
const CategoryListingPage = ({ section }) => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite, fetchFavorites } = useFavoritesStore();
const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("priority");
  const [isLoading, setIsLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);

  const sortOptions = [
    { label: "Featured", value: "priority" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Top Rated", value: "top_rated" },
    { label: "Material", value: "material" },
  ];

  // Fetch category info
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/api/categories/${categorySlug}`);
         setCategory(res.data.category);
         console.log(category)
      } catch (err) {
        console.error("Failed to fetch category:", err);
      }
    };
    fetchCategory();
  }, [categorySlug]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(
          `/api/products?section=${section}&sort=${sort}&page=${currentPage}&limit=12&subcategory=${selectedSubcategory}`
        );
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [section, sort, currentPage, categorySlug,selectedSubcategory]);

  // Fetch favorites if logged in
  useEffect(() => {
    if (isLoggedIn) fetchFavorites();
  }, [isLoggedIn]);

  const handleFavorite = (productId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (isFavorite(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  const currentSort = sortOptions.find((o) => o.value === sort);

  return (
    <div
      className="min-h-screen pt-[46px]"
      style={{ background: "#09090E", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-[9px] tracking-[0.25em]">
            <button
              onClick={() => navigate(`/${section}`)}
              className="transition-colors hover:text-white/70"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {section === "classics" ? "CLASSICS" : "EVERYDAY WEAR"}
            </button>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>
              {category?.name?.toUpperCase() || categorySlug?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h1
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {category?.name || "Collection"}
              </h1>
              <p className="text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                {total} {total === 1 ? "item" : "items"} ·{" "}
                {section === "classics" ? "Made to Measure · Bespoke Craftsmanship" : "Off the Rack · Ready to Wear"}
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-wider transition-colors hover:bg-white/5"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <SlidersHorizontal size={11} />
                Sort: {currentSort?.label}
                <ChevronDown size={11} />
              </button>

              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-1 z-30 min-w-[200px]"
                    style={{
                      background: "#0F0F16",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSort(option.value);
                          setCurrentPage(1);
                          setShowSort(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[10px] tracking-wider transition-colors hover:bg-white/5"
                        style={{
                          color:
                            sort === option.value
                              ? "#C8A96E"
                              : "rgba(255,255,255,0.5)",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        {sort === option.value && "✓  "}
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </motion.div>

        {/* ── Subcategory filter pills ── */}
     {category?.subcategories && category.subcategories.length > 0 && (
  <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
    
    {/* ✅ "All" Button now clears the subcategory filter */}
    <button
      onClick={() => {
        setSelectedSubcategory("");
        setCurrentPage(1); // Reset to page 1
      }}
      className="flex-shrink-0 px-4 py-1.5 text-[9px] tracking-[0.25em] uppercase font-bold"
      style={{
        // Dynamically color it if "All" is active
        background: selectedSubcategory === "" ? "#C8A96E" : "transparent",
        color: selectedSubcategory === "" ? "#1A1814" : "rgba(255,255,255,0.45)",
        border: selectedSubcategory === "" ? "none" : "1px solid rgba(255,255,255,0.1)"
      }}
    >
      All
    </button>

    {/* ✅ Subcategory pills now update the filter on click */}
    {category.subcategories.map((sub) => (
      <button
        key={sub._id}
        onClick={() => {
          setSelectedSubcategory(sub.slug); // Set to this specific subcategory
          setCurrentPage(1); // Reset to page 1
        }}
        className="flex-shrink-0 px-4 py-1.5 text-[9px] tracking-[0.25em] uppercase"
        style={{
          background: selectedSubcategory === sub.slug ? "#C8A96E" : "transparent",
          color: selectedSubcategory === sub.slug ? "#1A1814" : "rgba(255,255,255,0.45)",
          border: selectedSubcategory === sub.slug ? "none" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {sub.name}
      </button>
    ))}
  </div>
)}

        {/* ── Product Grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i}>
                <div
                  className="animate-pulse mb-3"
                  style={{
                    aspectRatio: "3/4",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />
                <div
                  className="h-3 w-3/4 animate-pulse mb-2"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <div
                  className="h-3 w-1/3 animate-pulse"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p
              className="text-white font-bold text-xl mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No products found
            </p>
            <p
              className="text-xs tracking-wide"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Check back soon — new pieces are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                section={section}
                isFavorited={isFavorite(product._id)}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-[9px] tracking-wider transition-colors hover:bg-white/5 disabled:opacity-30"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              ← Prev
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-9 h-9 text-[10px] font-bold transition-all"
                style={{
                  background: currentPage === page ? "#C8A96E" : "transparent",
                  color: currentPage === page ? "#1A1814" : "rgba(255,255,255,0.4)",
                  border:
                    currentPage === page
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
              disabled={currentPage === pages}
              className="px-4 py-2 text-[9px] tracking-wider transition-colors hover:bg-white/5 disabled:opacity-30"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListingPage;