import { useState, useEffect } from "react";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Sliders, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/userAuthStore";
import useCartStore from "../store/userCartStore";
import useFavoritesStore from "../store/favoritesStore";
import { useTailorStore } from "../store/useTailorStore";
import CustomizationModal from "../components/modals/CustomizationModal";
import ProfileSelectorModal from "../components/modals/ProfileSelectorModal";

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get section + categorySlug from URL query params
  const section = searchParams.get("section") || "classics";
  const categorySlug = searchParams.get("category") || "";

  // Zustand
  const { isLoggedIn } = useAuthStore();
  const { addToCart } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  // State
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customizationId, setCustomizationId] = useState(null);

  const itemIndex = allProducts.findIndex((p) => p.slug === slug);
  const totalItems = allProducts.length;
  const favorited = product ? isFavorite(product._id) : false;

  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/products/${slug}`);
        setProduct(res.data.product);
        setImgIndex(0);
        setCustomizationId(null); // Reset configuration state cleanly when transitioning between products
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch all products in same category for slider
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categorySlug) return;
      try {
        const res = await api.get(`/api/products?section=${section}&limit=50`);
        setAllProducts(res.data.products);
      } catch (err) {
        console.error("Failed to fetch category products:", err);
      }
    };
    fetchCategoryProducts();
  }, [categorySlug, section]);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!product || product.images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIndex((i) => (i + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [product]);

  // Navigate to prev/next product in slider
  const goToItem = (dir) => {
    const next = dir === "prev" ? itemIndex - 1 : itemIndex + 1;
    if (next < 0 || next >= allProducts.length) return;
    navigate(`/products/${allProducts[next].slug}?section=${section}&category=${categorySlug}`);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isLoggedIn) { 
      navigate("/login"); 
      return; 
    }
    
    // Automatically intercept and open customizer if they try to skip options on a Made to Measure classic
    if (section === "classics" && product?.isCustomizable && !customizationId) {
      setShowCustomizationModal(true);
      return;
    }

    setShowProfileModal(true);
  };

  // Handle customize
  const handleCustomize = () => {
    if (!isLoggedIn) { 
      navigate("/login"); 
      return; 
    }
    setShowCustomizationModal(true);
  };

  // Handle favorite toggle
  const handleFavorite = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (favorited) {
      removeFavorite(product._id);
    } else {
      addFavorite(product._id);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#09090E" }}>
        <p className="text-white/40 text-sm tracking-widest">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#09090E" }}>
        <p className="text-white/40 text-sm tracking-widest">Product not found.</p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pt-[46px] overflow-hidden"
      style={{ background: "#09090E", fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ── Slim product nav bar ── */}
      <div
        className="absolute left-0 right-0 z-20 flex items-center justify-between px-8"
        style={{
          top: "46px",
          height: "40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(9,9,14,0.95)",
        }}
      >
        {/* Back button */}
        <div className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-white/40">
          <button
            onClick={() => navigate(`/${section}/${categorySlug}`)}
            className="hover:text-white/70 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Item slider dots + counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToItem("prev")}
            disabled={itemIndex <= 0}
            className="text-white/30 hover:text-white/70 transition-colors disabled:opacity-20"
          >
            <ChevronLeft size={13} />
          </button>

          <div className="flex items-center gap-1.5">
            {allProducts.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate(`/products/${allProducts[i].slug}?section=${section}&category=${categorySlug}`)
                }
                className="transition-all duration-200 rounded-full"
                style={{
                  width: i === itemIndex ? "18px" : "5px",
                  height: "5px",
                  background: i === itemIndex ? "#C8A96E" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goToItem("next")}
            disabled={itemIndex >= allProducts.length - 1}
            className="text-white/30 hover:text-white/70 transition-colors disabled:opacity-20"
          >
            <ChevronRight size={13} />
          </button>

          <span
            className="text-[9px] tracking-wider text-white/25 ml-2"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {itemIndex + 1} / {totalItems}
          </span>
        </div>

        <div className="text-[9px] tracking-[0.2em] text-white/30 uppercase">
          {section === "classics" ? "Made to Measure" : "Off the Rack"}
        </div>
      </div>

      {/* ── Full screen image ── */}
      <div className="absolute inset-0 top-[86px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={product.images[imgIndex]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,9,14,0.2) 0%, rgba(9,9,14,0.0) 50%, rgba(9,9,14,0.55) 65%, rgba(9,9,14,0.8) 100%)",
          }}
        />
      </div>

      {/* ── Floating task pane ── */}
      <motion.div
        className="absolute right-8 overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          top: "110px",
          bottom: "80px",
          width: "340px",
          borderRadius: "4px",
          background: "rgba(9,9,14,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.09)",
          scrollbarWidth: "none",
        }}
      >
        <div className="p-7">

          {/* Badge */}
          {product.badge && (
            <span
              className="inline-block text-[8px] tracking-[0.25em] px-2 py-0.5 mb-3 font-bold uppercase"
              style={{ background: "#C8A96E", color: "#1A1814" }}
            >
              {product.badge}
            </span>
          )}

          {/* Product name */}
          <h2
            className="text-xl font-bold leading-snug mb-1 text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </h2>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6 mt-3">
            <span
              className="font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px" }}
            >
              ${product.price.toLocaleString()}
            </span>
            <span className="text-xs tracking-widest text-white/40">{product.currency}</span>
          </div>

          {/* Add to cart action area */}
          <div className="mb-2">
            {product.isCustomizable ? (
              <div className="flex gap-0">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 hover:bg-white/10"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#F5F0E8",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {customizationId ? "Assign Profile & Add" : "Add to Cart"}
                </button>
                <button
                  onClick={handleCustomize}
                  className="px-4 py-3 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
                  style={{ 
                    background: customizationId ? "#16A34A" : "#C8A96E", 
                    color: customizationId ? "#FFFFFF" : "#1A1814", 
                    borderLeft: "none" 
                  }}
                >
                  {customizationId ? (
                    <>
                      <Check size={12} strokeWidth={3} />
                      Configured
                    </                    >
                  ) : (
                    <>
                      <Sliders size={12} />
                      Customize
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full py-3 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "#C8A96E", color: "#1A1814" }}
              >
                <ShoppingBag size={13} />
                Add to Cart
              </button>
            )}
          </div>

          {/* Fit Right Guarantee + Returns */}
          <div className="flex items-center justify-center gap-4 mb-6 mt-3">
            {section === "classics" && (
              <button className="text-[9px] tracking-wider text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">
                Fit Right Guarantee
              </button>
            )}
            <button className="text-[9px] tracking-wider text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">
              Returns & Exchanges
            </button>
          </div>

          <div className="border-t mb-5" style={{ borderColor: "rgba(255,255,255,0.07)" }} />

          {/* Description */}
          <div className="mb-5">
            <p className="text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: "#C8A96E", fontSpread: 600 }}>
              About This Piece
            </p>
            <p className="text-xs leading-relaxed text-white/60">{product.description}</p>
          </div>

          {/* Materials */}
          <div className="mb-6">
            <p className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: "#C8A96E", fontSpread: 600 }}>
              Materials
            </p>
            <div className="flex flex-wrap gap-2">
              {product.materials?.map((mat, i) => (
                <span
                  key={i}
                  className="text-[9px] tracking-wider px-2.5 py-1 rounded-sm text-white/50"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Service details grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: "✓", label: "Fit Right", sub: "Guaranteed" },
              { icon: "↩", label: "Returns", sub: "30 days" },
              { icon: "→", label: "Shipping", sub: "Free $500+" },
              { icon: "✂", label: "Alterations", sub: "Complimentary" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-2.5 text-center rounded-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="text-sm mb-0.5 text-white/40">{item.icon}</div>
                <div className="text-[9px] font-semibold text-white/60 tracking-wider">{item.label}</div>
                <div className="text-[8px] text-white/30 tracking-wide">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="border-t mb-5" style={{ borderColor: "rgba(255,255,255,0.07)" }} />

          {/* Customers also bought */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div>
              <p className="text-[9px] tracking-[0.35em] uppercase mb-3" style={{ color: "#C8A96E", fontSpread: 600 }}>
                Customers Also Bought
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {product.relatedProducts.slice(0, 4).map((rel) => (
                  <div
                    key={rel._id}
                    className="flex-shrink-0 cursor-pointer group"
                    style={{ width: "70px" }}
                    onClick={() =>
                      navigate(`/products/${rel.slug}?section=${section}&category=${categorySlug}`)
                    }
                  >
                    <div
                      className="w-full overflow-hidden mb-1"
                      style={{ aspectRatio: "3/4", background: "#1A1814" }}
                    >
                      <img
                        src={rel.images[0]}
                        alt={rel.name}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-200"
                      />
                    </div>
                    <p className="text-[8px] text-white/40 leading-tight truncate">{rel.name}</p>
                    <p className="text-[9px] font-bold text-white/60">${rel.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>

      {/* ── Bottom image dots ── */}
      {product.images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {product.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === imgIndex ? "24px" : "8px",
                height: "8px",
                background: i === imgIndex ? "#C8A96E" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Favorite button ── */}
      <button
        onClick={handleFavorite}
        className="absolute left-8 transition-colors duration-200 z-10"
        style={{ bottom: "24px" }}
      >
        <Heart
          size={16}
          strokeWidth={1.5}
          color={favorited ? "#C8A96E" : "rgba(255,255,255,0.4)"}
          fill={favorited ? "#C8A96E" : "none"}
        />
      </button>

      {/* Modals Mounting Segment */}
      <AnimatePresence>
        {showCustomizationModal && (
          <CustomizationModal
            product={product}
            profileId={null}
            onClose={() => setShowCustomizationModal(false)}
            onSaved={(id) => {
              setCustomizationId(id);
              setShowCustomizationModal(false);
              setShowProfileModal(true);
            }}
          />
        )}
        {showProfileModal && (
          <ProfileSelectorModal
            product={product}
            customizationSelectionId={customizationId}
            onClose={() => setShowProfileModal(false)}
            onAdded={() => {
              setShowProfileModal(false);
              navigate("/cart");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;