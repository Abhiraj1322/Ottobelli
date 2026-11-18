
import { useEffect } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../store/userCartStore";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    fetchCart,
    removeFromCart,
    items: cartItems,
    total,
    isLoading,
    error,
  } = useCartStore();

  // Lock background scrolling while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fetch cart whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  // Close drawer with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Total quantity of products
  const itemCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 0),
    0
  );
  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error("Unable to remove cart item:", err);
    }
  };
  // Temporary customization handler
  const handleCustomize = (item) => {
    console.log("Customize cart item:", item);
    // We'll connect your customization form here.
  };

  return (
    <div
      className={`fixed inset-0 z-[200] transition-all duration-300 ${isOpen
        ? "visible bg-black/35"
        : "invisible bg-black/0 pointer-events-none"
        }`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-0 top-0 flex h-full w-full max-w-[580px] flex-col bg-white transition-transform duration-300 ease-in-out sm:w-[80%] lg:w-[33%] ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-stone-200 px-7">
          <h2 className="text-sm font-semibold tracking-[0.16em]">
            YOUR BAG ({itemCount})
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="p-1 transition hover:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {/* Cart content */}
        <div className="flex-1 overflow-y-auto px-7 py-8">
          {isLoading ? (
            <p className="text-lg text-stone-500">
              Loading your bag...
            </p>
          ) : error ? (
            <p className="text-lg text-red-500">
              {error}
            </p>
          ) : cartItems.length === 0 ? (
            <p className="text-lg text-stone-500">
              Your bag is empty.
            </p>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => {
                const product = item.productId;

                return (
                  <div
                    key={item._id || index}
                    className="flex gap-5 border-b border-stone-200 pb-6"
                  >
                    <img
                      src={product?.images?.[0]}
                      alt={product?.name || "Product"}
                      className="h-32 w-24 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-sm font-medium">
                        {product?.name}
                      </h3>

                      <p className="mt-2 text-sm text-stone-500">
                        Quantity: {item.quantity || 1}
                      </p>

                      <p className="mt-3 text-sm">
                        CAD ${Number(item.priceAtAdd || 0).toFixed(2)}
                      </p>

                      {/* Customize only customizable products */}
                      {product?.isCustomizable && (
                        <button
                          type="button"
                          onClick={() => handleCustomize(item)}
                          className="mt-4 inline-flex items-center bg-red-600 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-red-700"
                        >
                          {item.customizationSelectionId
                            ? "EDIT CUSTOMIZATION"
                            : "CUSTOMIZE"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemove(item._id)}
                        className="mt-4 block text-xs font-semibold tracking-[0.12em] underline underline-offset-4 transition hover:opacity-50"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div className="shrink-0 border-t border-stone-200 px-7 py-6">
          {cartItems.length === 0 ? (
            <Link
              to="/classics"
              onClick={onClose}
              className="flex h-[70px] w-full items-center justify-center bg-[#111] text-sm font-semibold tracking-[0.12em] text-white transition hover:bg-stone-800"
            >
              SHOP CLASSICS
            </Link>
          ) : (
            <>
              <div className="mb-5 flex justify-between text-sm">
                <span className="font-semibold tracking-[0.12em]">
                  SUBTOTAL
                </span>

                <span>
                  CAD ${Number(total || 0).toFixed(2)}
                </span>
              </div>

              <Link
                to="/cart"
                onClick={onClose}
                className="flex h-[70px] w-full items-center justify-center bg-[#111] text-sm font-semibold tracking-[0.12em] text-white transition hover:bg-stone-800"
              >
                VIEW BAG
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;

