import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import useCartStore from "../store/userCartStore";

const CartPage = () => {
  const navigate = useNavigate();
  
  // 1. Simplified Store Selectors (No more isLoading or fetchCart required)
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const [removingId, setRemovingId] = useState(null);

  // 2. Instant Local Action Handling (No more async/await blocking network requests)
  const handleRemove = (itemId) => {
    setRemovingId(itemId);
    // Instant removal animation trigger
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingId(null);
    }, 200); 
  };

  const handleQuantity = (itemId, currentQty, dir) => {
    const newQty = dir === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return;
    updateQuantity(itemId, newQty);
  };

  // 3. Group items by profile (Exactly matching your original layout logic)
  const groupedByProfile = items.reduce((acc, item) => {
    const profileName = item.profileId?.displayName || "Unknown Profile";
    if (!acc[profileName]) acc[profileName] = [];
    acc[profileName].push(item);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen pt-[46px]"
      style={{ background: "#09090E", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p
            className="text-[9px] tracking-[0.45em] uppercase mb-3 font-bold"
            style={{ color: "#C8A96E" }}
          >
            Your Selection
          </p>
          <div className="flex items-end justify-between">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shopping Cart
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[9px] tracking-wider transition-colors hover:text-white/50 underline underline-offset-2"
                style={{ color: "#9A9080" }}
              >
                Clear Cart
              </button>
            )}
          </div>
          <div className="mt-4 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        </motion.div>

        {/* ── Empty Cart ── */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <ShoppingBag
              size={48}
              strokeWidth={1}
              color="rgba(255,255,255,0.1)"
              className="mb-6"
            />
            <p
              className="text-white font-bold text-xl mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your cart is empty
            </p>
            <p
              className="text-xs mb-8 tracking-wide"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Add items from the Classics or Everyday Wear collection
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/classics")}
                className="px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:opacity-90"
                style={{ background: "#C8A96E", color: "#1A1814" }}
              >
                Shop Classics
              </button>
              <button
                onClick={() => navigate("/everyday")}
                className="px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Shop Everyday
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex gap-12 items-start">

            {/* ── Cart Items ── */}
            <div className="flex-1">
              {Object.entries(groupedByProfile).map(([profileName, profileItems]) => (
                <div key={profileName} className="mb-10">

                  {/* Profile label */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                      style={{ background: "#C8A96E", color: "#1A1814" }}
                    >
                      {profileName[0].toUpperCase()}
                    </div>
                    <p
                      className="text-[9px] tracking-[0.3em] uppercase font-bold"
                      style={{ color: "#C8A96E" }}
                    >
                      {profileName}
                    </p>
                  </div>

                  {/* Items for this profile */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {profileItems.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-5 p-5"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {/* Product image */}
                          <div
                            className="flex-shrink-0 overflow-hidden"
                            style={{
                              width: "80px",
                              height: "100px",
                              background: "#111118",
                            }}
                          >
                            {item.productId?.images?.[0] ? (
                              <img
                                src={item.productId.images[0]}
                                alt={item.productId?.name}
                                className="w-full h-full object-cover opacity-80"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag size={20} color="rgba(255,255,255,0.1)" />
                              </div>
                            )}
                          </div>

                          {/* Product details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                {/* Badge */}
                                {item.productId?.badge && (
                                  <span
                                    className="inline-block text-[7px] tracking-[0.2em] px-1.5 py-0.5 mb-2 font-bold uppercase"
                                    style={{ background: "#C8A96E", color: "#1A1814" }}
                                  >
                                    {item.productId.badge}
                                  </span>
                                )}

                                {/* Name */}
                                <h3
                                  className="text-sm font-bold text-white mb-1 cursor-pointer hover:text-white/70 transition-colors"
                                  style={{ fontFamily: "'Playfair Display', serif" }}
                                  onClick={() =>
                                    navigate(`/products/${item.productId?.slug}`)
                                  }
                                >
                                  {item.productId?.name}
                                </h3>

                                {/* Customizable tag */}
                                {item.productId?.isCustomizable && (
                                  <span
                                    className="text-[8px] tracking-wider"
                                    style={{ color: "#C8A96E" }}
                                  >
                                    Customizable
                                  </span>
                                )}

                                {/* Customization selections */}
                                {item.customizationSelectionId?.selections && (
                                  <div className="mt-2 space-y-0.5">
                                    {Object.entries(
                                      item.customizationSelectionId.selections
                                    ).map(([key, val]) => (
                                      <p
                                        key={key}
                                        className="text-[8px] tracking-wide"
                                        style={{ color: "rgba(255,255,255,0.3)" }}
                                      >
                                        {key}: {val}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Price */}
                              <p
                                className="text-sm font-bold text-white flex-shrink-0"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                              >
                                ${(item.priceAtAdd * item.quantity).toLocaleString()}
                                <span
                                  className="text-[9px] ml-1 font-normal"
                                  style={{ color: "rgba(255,255,255,0.35)" }}
                                >
                                  CAD
                                </span>
                              </p>
                            </div>

                            {/* Quantity + Remove */}
                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity controls */}
                              <div
                                className="flex items-center gap-0"
                                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                              >
                                <button
                                  onClick={() =>
                                    handleQuantity(item._id, item.quantity, "dec")
                                  }
                                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/10"
                                  style={{ color: "rgba(255,255,255,0.5)" }}
                                >
                                  <Minus size={11} />
                                </button>
                                <span
                                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
                                  style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)" }}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantity(item._id, item.quantity, "inc")
                                  }
                                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/10"
                                  style={{ color: "rgba(255,255,255,0.5)" }}
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() => handleRemove(item._id)}
                                disabled={removingId === item._id}
                                className="flex items-center gap-1.5 text-[9px] tracking-wider transition-colors hover:text-red-400 disabled:opacity-40"
                                style={{ color: "rgba(255,255,255,0.25)" }}
                              >
                                <Trash2 size={11} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
              style={{ width: "300px" }}
            >
              <div
                className="p-7"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Title */}
                <p
                  className="text-[9px] tracking-[0.4em] uppercase mb-6 font-bold"
                  style={{ color: "#C8A96E" }}
                >
                  Order Summary
                </p>

                {/* Line items */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                    </span>
                    <span className="text-xs font-bold text-white">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Shipping
                    </span>
                    <span className="text-xs" style={{ color: "#C8A96E" }}>
                      {total >= 500 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Alterations
                    </span>
                    <span className="text-xs" style={{ color: "#C8A96E" }}>
                      Complimentary
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="h-px mb-5"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />

                {/* Total */}
                <div className="flex justify-between mb-8">
                  <span
                    className="text-xs font-bold text-white tracking-wider"
                  >
                    Total
                  </span>
                  <div className="text-right">
                    <span
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      ${total.toLocaleString()}
                    </span>
                    <span
                      className="text-[9px] ml-1"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      CAD
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: "#C8A96E", color: "#1A1814" }}
                >
                  Proceed to Checkout
                  <ArrowRight size={13} />
                </button>

                {/* Guarantees */}
                <div className="mt-5 space-y-2">
                  {[
                    "✓  Fit Right Guarantee",
                    "✓  Free returns within 30 days",
                    "✓  Complimentary alterations",
                  ].map((text) => (
                    <p
                      key={text}
                      className="text-[9px] tracking-wide"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              {/* Continue shopping */}
              <button
                onClick={() => navigate("/classics")}
                className="w-full mt-4 py-3 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:bg-white/5"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;