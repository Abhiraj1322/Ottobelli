import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Sliders, Check, ChevronDown, ChevronUp, ShieldCheck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/userAuthStore";
import useCartStore from "../store/userCartStore";
import useFavoritesStore from "../store/favoritesStore";
import CustomizationModal from "../components/modals/CustomizationModal";
import ProfileSelectorModal from "../components/modals/ProfileSelectorModal";

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const section = searchParams.get("section") || "classics";
  const categorySlug = searchParams.get("category") || "";

  // Zustand stores
  const { isLoggedIn } = useAuthStore();
  const { addToCart } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  // State
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [customizationId, setCustomizationId] = useState(null);
  const [additionalFee, setAdditionalFee] = useState(0);
const [relatedProducts, setRelatedProducts] = useState([]);
const [relatedLoading, setRelatedLoading] = useState(false);
  // Accordion open/close states matching the reference
  const [accordionState, setAccordionState] = useState({
    details: true,
    fabric: false,
    care: false,
    shipping: false,
  });

  const favorited = product ? isFavorite(product._id) : false;

  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/products/${slug}`);
        setProduct(res.data.product);
        setCustomizationId(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

useEffect(() => {
  const fetchRelatedProducts = async () => {
    if (!product?._id) return;

    try {
      setRelatedLoading(true);

      const { data } = await api.get(
        `/api/products/${product._id}/related`
      );

      setRelatedProducts(data.relatedProducts || []);
    } catch (error) {
      console.error("Related products error:", error);
      setRelatedProducts([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  fetchRelatedProducts();
}, [product?._id]);


  const toggleAccordion = (key) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle add to cart
  const handleAddToCart = async (itemToAdd = product) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const targetProduct = itemToAdd || product;
    const isEverydayItem =
      section === "everyday" ||
      categorySlug.includes("t-shirts") ||
      targetProduct?.category === "everyday";

    if (isEverydayItem || !targetProduct.isCustomizable) {
      await addToCart(targetProduct._id, null);
      navigate("/cart");
      return;
    }

    if (section === "classics" && targetProduct?.isCustomizable && !customizationId) {
      setShowCustomizationModal(true);
      return;
    }

    setShowProfileModal(true);
  };

  const handleCustomize = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setShowCustomizationModal(true);
  };

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

  const handleCustomizationSaved = (savedCustomizationId, feeAmount) => {
    setCustomizationId(savedCustomizationId);
    setAdditionalFee(feeAmount);
    setShowCustomizationModal(false);
    setShowProfileModal(true);
  };
console.log(product)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center pt-20">
        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">Loading piece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center pt-20">
        <p className="text-gray-500 text-xs tracking-[0.2em] uppercase">Product not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-[46px] bg-[#FDFBF7] text-gray-900"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8">
        
        {/* ── Breadcrumbs ── */}
        <div className="flex items-center gap-2 mb-8 text-[9px] tracking-[0.25em] uppercase text-gray-400 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigate("/")} className="hover:text-black transition">Home</button>
          <span>/</span>
          <button onClick={() => navigate(-1)} className="hover:text-black transition">Classics Collection</button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>

        {/* ── Main Layout: 2x2 Grid Left + Sticky Details Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Side: 2x2 Tile Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tile 1: Product Render */}
            <div className="relative bg-[#F2F1EE] aspect-[4/5] flex items-center justify-center p-8 overflow-hidden">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-sm"
              />
              <button
                onClick={() => handleFavorite(product._id)}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition"
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  color={favorited ? "#C8A96E" : "#111"}
                  fill={favorited ? "#C8A96E" : "none"}
                />
              </button>
            </div>

            {/* Tile 2: Fabric Swatch 1 (Mill Badge) */}
            <div className="relative aspect-[4/5] bg-[#111A2E] flex flex-col justify-end p-6 text-white overflow-hidden shadow-inner">
              {product.images?.[1] ? (
                <img src={product.images[1]} alt="Fabric Mill" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] to-[#1C2541] opacity-95" />
              )}
              <div className="relative z-10 bg-white text-gray-950 py-2.5 px-4 text-center text-[9px] font-bold tracking-[0.25em] uppercase shadow-sm">
                {product.mill || "Vitale Barberis Canonico"}
              </div>
            </div>

            {/* Tile 3: Alternate Product Render (Zoomed / Detail) */}
            <div className="relative bg-[#F2F1EE] aspect-[4/5] flex items-center justify-center p-8 overflow-hidden">
              <img
                src={product.images?.[1] || product.images?.[0]}
                alt={`${product.name} detail`}
                className="w-full h-full object-contain scale-110 drop-shadow-sm"
              />
            </div>

            {/* Tile 4: Fabric Swatch 2 (Super Count Badge) */}
            <div className="relative aspect-[4/5] bg-[#111A2E] flex flex-col justify-end p-6 text-white overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] to-[#1C2541] opacity-95" />
              <div className="relative z-10 bg-white text-gray-950 py-2.5 px-4 text-center text-[9px] font-bold tracking-[0.25em] uppercase shadow-sm">
                {product.superCount || "Super 110s"}
              </div>
            </div>

          </div>

          {/* Right Side: Product Details & Action Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col">
            
            <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 mb-2 font-bold">
              {product.subcategory?.name || "Suits"}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-950 mb-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold font-serif text-gray-950">
                ${product.price?.toLocaleString()}
              </span>
              <span className="text-[10px] tracking-widest text-gray-500">{product.currency || "CAD"}</span>
            </div>

            <div className="flex items-center gap-2 mb-6 text-[10px] tracking-[0.15em] uppercase text-[#7A2A2A] font-semibold">
              {product.isCustomizable && <span>CUSTOMIZABLE</span>}
              {product.customizationForm && (
                <>
                  <span>·</span>
                  <span>{product.customizationForm}</span>
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed text-gray-600 mb-6">
              {product.description}
            </p>

            {product.colour && (
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor:
                      product.colour.toLowerCase() === "navy"
                        ? "#111A2E"
                        : product.colour.toLowerCase() === "charcoal"
                        ? "#333333"
                        : product.colour.toLowerCase() === "brown"
                        ? "#5c4033"
                        : "#000000",
                  }}
                />
                <span className="text-xs text-gray-700 font-medium">
                  Colour: <strong className="text-gray-950">{product.colour}</strong>
                </span>
              </div>
            )}

            {/* Action Button */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-black text-white py-4 text-xs font-bold tracking-[0.25em] uppercase hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2"
              >
                ADD TO BAG
              </button>
            </div>

            {product.isCustomizable && (
              <p className="text-[11px] text-gray-500 leading-normal mb-8">
                Made to measure in this fabric. After adding it, tap <strong className="text-gray-800">Customize</strong> in your bag to choose buttons, lapel, pockets and more. No size needed.
              </p>
            )}

            <div className="flex items-center gap-6 text-[10px] tracking-wider text-gray-600 mb-8 pb-6 border-b border-gray-200">
              <button className="flex items-center gap-1.5 hover:text-black underline underline-offset-2">
                <ShieldCheck size={13} className="text-gray-500" /> Fit Right Guarantee
              </button>
              <button className="flex items-center gap-1.5 hover:text-black underline underline-offset-2">
                <RotateCcw size={13} className="text-gray-500" /> Returns & Exchanges
              </button>
            </div>

            {/* ── Clean Expandable Accordions ── */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              
              {/* Details */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-gray-900 py-1"
                >
                  <span>Details</span>
                  {accordionState.details ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <AnimatePresence>
                  {accordionState.details && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-600 leading-relaxed mt-2 pb-2"
                    >
                      <p>{product.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fabric */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleAccordion("fabric")}
                  className="w-full flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-gray-900 py-1"
                >
                  <span>Fabric</span>
                  {accordionState.fabric ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <AnimatePresence>
                  {accordionState.fabric && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-600 leading-relaxed mt-2 pb-2 space-y-1"
                    >
                      {product.materials && <p><strong>Material:</strong> {product.materials.join(", ")}</p>}
                      {product.mill && <p><strong>Mill / Origin:</strong> {product.mill}</p>}
                      {product.superCount && <p><strong>Super Count:</strong> {product.superCount}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Care */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-gray-900 py-1"
                >
                  <span>Care</span>
                  {accordionState.care ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <AnimatePresence>
                  {accordionState.care && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-600 leading-relaxed mt-2 pb-2"
                    >
                      <p>{product.careInfo || "Dry clean only. Press with warm iron."}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns */}
              <div className="border-b border-gray-200 pb-3">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-gray-900 py-1"
                >
                  <span>Shipping & Returns</span>
                  {accordionState.shipping ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <AnimatePresence>
                  {accordionState.shipping && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-gray-600 leading-relaxed mt-2 pb-2"
                    >
                      <p>Complimentary shipping and free 30-day returns on all made-to-measure orders.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

        {/* ── Complete the Look Carousel ── */}
 {/* ── Complete the Look Carousel ── */}

{!relatedLoading && (
  <div className="mt-28 border-t border-gray-200 pt-16">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-950 tracking-wide">
        Complete the look
      </h2>

      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400">
        Drag to browse
      </span>
    </div>

    {relatedProducts.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-4">
        {relatedProducts.map((rel) => (
          <div
            key={rel._id}
            className="cursor-pointer group flex flex-col justify-between"
            onClick={() =>
              navigate(
                `/products/${rel.slug}?section=${section}&category=${categorySlug}`
              )
            }
          >
            <div className="relative aspect-[4/5] bg-[#F2F1EE] flex items-center justify-center p-6 mb-3 overflow-hidden">
              {rel.badge && (
                <span className="absolute top-3 left-3 bg-white text-black text-[8px] tracking-[0.15em] font-bold px-2 py-0.5 uppercase shadow-sm z-10">
                  {rel.badge}
                </span>
              )}

              <img
                src={rel.images?.[0]}
                alt={rel.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(rel);
                }}
                className="absolute bottom-3 right-3 bg-white text-black px-3.5 py-1.5 text-[9px] font-bold tracking-[0.15em] uppercase border border-black/10 hover:bg-black hover:text-white transition shadow-sm flex items-center gap-1 z-10"
              >
                <ShoppingBag size={10} /> ADD
              </button>
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-900 truncate mb-1">
                {rel.name}
              </h3>

              <div className="text-sm font-bold font-serif text-gray-950">
                ${rel.salePrice?.toLocaleString() ?? rel.price?.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400 py-8">
        More pieces coming soon.
      </p>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default ProductPage;