import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, SlidersHorizontal, ChevronDown, ChevronUp, ShoppingBag, Check, X } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../store/userAuthStore";
import useFavoritesStore from "../store/favoritesStore";

// ─── Product Card Component ────────────────────────────────────────────────
const ProductCard = ({ product, section, onFavorite, isFavorited, onAddToCart }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative cursor-pointer group flex flex-col justify-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        navigate(
          `/products/${product.slug}?section=${section}&category=${product.subcategory?.slug || ""}`
        )
      }
    >
      {/* Product Image Container */}
      <div
        className="relative overflow-hidden mb-3 flex items-center justify-center p-4 sm:p-6"
        style={{ aspectRatio: "4/5", background: "#F2F1EE" }}
      >
        {/* Product Image */}
        <motion.img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-contain drop-shadow-sm"
          animate={{ scale: hovered ? 1.03 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Badge (e.g., "Best Seller") */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span className="text-[7px] sm:text-[8px] tracking-[0.15em] px-1.5 sm:px-2 py-0.5 font-bold uppercase bg-[#000] text-white">
              {product.badge}
            </span>
          </div>
        )}

        {/* Customizable tag */}
        {product.isCustomizable && !product.badge && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span
              className="text-[7px] sm:text-[8px] tracking-[0.15em] px-1.5 sm:px-2 py-0.5 font-bold uppercase"
              style={{
                background: "rgba(200,169,110,0.2)",
                border: "1px solid rgba(200,169,110,0.5)",
                color: "#8C6D33",
              }}
            >
              Customizable
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <motion.button
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors z-20"
          animate={{ opacity: hovered || isFavorited ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(product._id);
          }}
        >
          <Heart
            size={12}
            strokeWidth={1.5}
            color={isFavorited ? "#C8A96E" : "#1A1814"}
            fill={isFavorited ? "#C8A96E" : "none"}
          />
        </motion.button>

        {/* Floating ADD Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) onAddToCart(product);
          }}
          className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-white text-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase border border-black/10 hover:bg-black hover:text-white transition-colors duration-200 shadow-sm flex items-center gap-1 z-10"
        >
          <ShoppingBag size={10} />
          ADD
        </button>
      </div>

      {/* Product Information */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] sm:text-xs font-medium text-gray-900 truncate tracking-wide">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span
            className="text-xs sm:text-sm font-bold text-gray-950"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ${product.price?.toLocaleString()}
          </span>
          <span className="text-[8px] sm:text-[9px] text-gray-500">{product.currency || "CAD"}</span>
        </div>

        {product.isCustomizable && product.badge && (
          <span className="text-[9px] sm:text-[10px] text-[#7A2A2A] font-medium tracking-wide mt-0.5">
            Customizable
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Category Listing Page Component ──────────────────────────────────
const CategoryListingPage = ({ section }) => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { addFavorite, removeFavorite, isFavorite, fetchFavorites } = useFavoritesStore();

  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [activeGender, setActiveGender] = useState("ALL");
  const [category, setCategory] = useState(null);
  const [rawProducts, setRawProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("priority");
  const [isLoading, setIsLoading] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Accordion Sections Open State
  const [openSections, setOpenSections] = useState({
    materials: true,
    mill: true,
    superCount: false,
    colour: false,
  });

  // Selected Checkbox Filters matching DB Schema keys
  const [selectedFilters, setSelectedFilters] = useState({
    materials: [],
    mill: [],
    superCount: [],
    colour: [],
    
  });

  const filterGroups = {
    materials: {
      title: "MATERIAL",
      items: [
        { label: "Linen-Wool", value: "Linen-Wool" },
        { label: "Wool", value: "Wool" },
        { label: "Wool-Cashmere", value: "Wool-Cashmere" },
        { label: "Wool-Mohair", value: "Wool-Mohair" },
      ],
    },
    mill: {
      title: "ORIGIN / MILL",
      items: [
        { label: "Dormeuil", value: "Dormeuil" },
        { label: "Holland & Sherry", value: "Holland & Sherry" },
        { label: "Loro Piana", value: "Loro Piana" },
        { label: "Vitale Barberis Canonico", value: "Vitale Barberis Canonico" },
      ],
    },
    superCount: {
      title: "SUPER COUNT",
      items: [
        { label: "Super 110s", value: "Super 110s" },
        { label: "Super 130s", value: "Super 130s" },
        { label: "Super 150s", value: "Super 150s" },
      ],
    },
    colour: {
      title: "COLOUR",
      items: [
        { label: "Navy", value: "Navy" },
        { label: "Charcoal", value: "Charcoal" },
        { label: "Brown", value: "Brown" },
        { label: "Black", value: "Black" },
      ],
    },
  };

  const sortOptions = [
    { label: "Featured", value: "priority" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Top Rated", value: "top_rated" },
  ];

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilterItem = (groupKey, value) => {
    setSelectedFilters((prev) => {
      const current = prev[groupKey] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [groupKey]: updated };
    });
    setCurrentPage(1);
  };

  // Fetch Category Details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/api/categories/${categorySlug}`);
        setCategory(res.data.category);
      } catch (err) {
        console.error("Failed to fetch category:", err);
      }
    };
    fetchCategory();
  }, [categorySlug]);

  // Fetch Products from Backend
  useEffect(() => {
    if (!category?._id) return;

    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const res = await api.get("/api/products", {
          params: {
            section,
            sort,
            page: currentPage,
            limit: 12,
            subcategory: selectedSubcategory || category._id,
          },
        });

        const fetchedList = res.data.products || [];
        setRawProducts(fetchedList);
        setTotal(res.data.total || fetchedList.length);
        setPages(res.data.pages || 1);
      } catch (err) {
        console.error("Failed to fetch products:", err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [section, sort, currentPage, category?._id, selectedSubcategory]);

  // Client-side dynamic filtering across DB schema attributes
  useEffect(() => {
    let result = [...rawProducts];

    if (activeGender !== "ALL") {
      result = result.filter(
        (p) => p.gender?.toLowerCase() === activeGender.toLowerCase()
      );
    }

    if (selectedFilters.materials.length > 0) {
      result = result.filter((p) =>
        p.materials?.some((m) => selectedFilters.materials.includes(m))
      );
    }

    if (selectedFilters.mill.length > 0) {
      result = result.filter((p) => selectedFilters.mill.includes(p.mill));
    }

    if (selectedFilters.superCount.length > 0) {
      result = result.filter((p) => selectedFilters.superCount.includes(p.superCount));
    }

    if (selectedFilters.colour.length > 0) {
      result = result.filter((p) => selectedFilters.colour.includes(p.colour));
    }

    setFilteredProducts(result);
  }, [rawProducts, activeGender, selectedFilters]);

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

  const getItemCount = (groupKey, value) => {
    return rawProducts.filter((p) => {
      if (groupKey === "materials") return p.materials?.includes(value);
      if (groupKey === "mill") return p.mill === value;
      if (groupKey === "superCount") return p.superCount === value;
      if (groupKey === "colour") return p.colour === value;
      return false;
    }).length;
  };

  const currentSort = sortOptions.find((o) => o.value === sort);

  return (
    <div
      className="min-h-screen pt-[46px] bg-[#FDFBF7]"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-gray-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => navigate(`/${section}`)}
              className="hover:text-black transition-colors"
            >
              {section === "classics" ? "CLASSICS" : "EVERYDAY WEAR"}
            </button>
            <span>›</span>
            <span className="text-gray-900 font-semibold">
              {category?.name?.toUpperCase() || categorySlug?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1.5 sm:mb-2 font-serif">
            {category?.name || "Collection"}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-gray-600 tracking-wider">
            {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} ·{" "}
            {section === "classics" ? "Made to Measure · Bespoke Craftsmanship" : "Off the Rack · Ready to Wear"}
          </p>
        </motion.div>

        {/* ── Subcategory Filter Pills (Horizontally Scrollable on Mobile) ── */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-200 scrollbar-none">
            <button
              onClick={() => {
                setSelectedSubcategory("");
                setCurrentPage(1);
              }}
              className="flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-bold transition-all"
              style={{
                background: selectedSubcategory === "" ? "#000" : "transparent",
                color: selectedSubcategory === "" ? "#fff" : "#333",
                border: selectedSubcategory === "" ? "none" : "1px solid rgba(0,0,0,0.15)",
              }}
            >
              All
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => {
                  setSelectedSubcategory(sub._id);
                  setCurrentPage(1);
                }}
                className="flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-medium transition-all"
                style={{
                  background: selectedSubcategory === sub._id ? "#000" : "transparent",
                  color: selectedSubcategory === sub._id ? "#fff" : "#333",
                  border: selectedSubcategory === sub._id ? "none" : "1px solid rgba(0,0,0,0.15)",
                }}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* ── Filter Controls & Sort Bar ── */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 sm:mb-8">
          {/* Gender Tabs & Mobile Filter Trigger */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">
            {["ALL", "MEN", "WOMEN"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveGender(tab)}
                className={`relative pb-1 transition-colors ${
                  activeGender === tab ? "text-black font-extrabold" : "text-gray-400 hover:text-black"
                }`}
              >
                {tab}
                {activeGender === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-black"
                  />
                )}
              </button>
            ))}

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 text-[9px] uppercase font-bold bg-white ml-2"
            >
              <SlidersHorizontal size={11} /> Filters
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] tracking-wider uppercase bg-white border border-gray-300 text-gray-800 hover:border-black transition-colors"
            >
              <SlidersHorizontal size={11} className="hidden sm:inline" />
              <span>Sort: <strong className="font-bold">{currentSort?.label}</strong></span>
              <ChevronDown size={11} />
            </button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-1 z-30 min-w-[180px] bg-white border border-gray-200 shadow-xl"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setCurrentPage(1);
                        setShowSort(false);
                      }}
                      className="w-full text-left px-4 py-2.5 sm:py-3 text-[9px] sm:text-[10px] tracking-wider uppercase transition-colors hover:bg-gray-50 text-gray-800 border-b border-gray-100 last:border-0"
                    >
                      {sort === option.value && "✓ "}
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Main Layout: Sidebar Filters + Product Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 pr-6 border-r border-gray-200">
            {Object.entries(filterGroups).map(([groupKey, group]) => {
              const isOpen = openSections[groupKey];
              const selectedValues = selectedFilters[groupKey] || [];

              return (
                <div key={groupKey} className="border-b border-gray-200 py-4 last:border-0">
                  <button
                    onClick={() => toggleSection(groupKey)}
                    className="w-full flex items-center justify-between text-left mb-2 group"
                  >
                    <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-900">
                      {group.title}
                    </span>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2.5 overflow-hidden pt-1"
                      >
                        {group.items.map((item) => {
                          const isChecked = selectedValues.includes(item.value);
                          const count = getItemCount(groupKey, item.value);

                          return (
                            <label
                              key={item.value}
                              onClick={() => toggleFilterItem(groupKey, item.value)}
                              className="flex items-center justify-between text-xs text-gray-700 cursor-pointer select-none py-0.5 group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${
                                    isChecked
                                      ? "bg-black border-black text-white"
                                      : "border-gray-300 bg-white group-hover:border-gray-500"
                                  }`}
                                >
                                  {isChecked && <Check size={10} strokeWidth={3} />}
                                </div>
                                <span className={isChecked ? "font-bold text-black" : "text-gray-700"}>
                                  {item.label}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400">{count}</span>
                            </label>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </aside>

          {/* Product Grid Container (Responsive: 2 columns mobile, 3 columns desktop) */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200 mb-3" />
                    <div className="h-3 w-3/4 bg-gray-200 mb-2" />
                    <div className="h-3 w-1/3 bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center">
                <p className="font-serif text-lg sm:text-xl font-bold mb-2 text-black">No products found</p>
                <p className="text-xs text-gray-500">Try unchecking some filters to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    section={section}
                    isFavorited={isFavorite(product._id)}
                    onFavorite={handleFavorite}
                    onAddToCart={(p) => console.log("Added to cart:", p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 sm:mt-16 border-t border-gray-200 pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 sm:px-4 py-2 text-[8px] sm:text-[9px] tracking-wider uppercase border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors"
                >
                  ← Prev
                </button>

                {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 text-[10px] font-bold transition-all ${
                      currentPage === page
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-black"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
                  disabled={currentPage === pages}
                  className="px-3.5 sm:px-4 py-2 text-[8px] sm:text-[9px] tracking-wider uppercase border border-gray-300 disabled:opacity-30 hover:bg-gray-100 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Sidebar Filter Drawer ── */}
        <AnimatePresence>
          {showMobileFilter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex justify-start lg:hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="w-4/5 max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase">Filters</span>
                    <button onClick={() => setShowMobileFilter(false)} className="p-1 text-gray-500 hover:text-black">
                      <X size={18} />
                    </button>
                  </div>

                  {Object.entries(filterGroups).map(([groupKey, group]) => (
                    <div key={groupKey} className="border-b border-gray-100 py-3">
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-900 block mb-2">
                        {group.title}
                      </span>
                      <div className="space-y-2">
                        {group.items.map((item) => {
                          const isChecked = (selectedFilters[groupKey] || []).includes(item.value);
                          const count = getItemCount(groupKey, item.value);

                          return (
                            <label
                              key={item.value}
                              onClick={() => toggleFilterItem(groupKey, item.value)}
                              className="flex items-center justify-between text-xs text-gray-700 cursor-pointer py-1"
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 border flex items-center justify-center ${
                                    isChecked ? "bg-black border-black text-white" : "border-gray-300"
                                  }`}
                                >
                                  {isChecked && <Check size={10} strokeWidth={3} />}
                                </div>
                                <span className={isChecked ? "font-bold text-black" : ""}>{item.label}</span>
                              </div>
                              <span className="text-[10px] text-gray-400">{count}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="w-full bg-black text-white py-3 text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CategoryListingPage;