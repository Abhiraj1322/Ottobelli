import { ShoppingBag, User, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from"../../store/userAuthStore";
import useCartStore from "../../store/userCartStore";
import useFavoritesStore from "../../store/favoritesStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand stores
  const { isLoggedIn } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { favorites } = useFavoritesStore();

  const cartCount = getItemCount();
  const favCount = favorites.length;

  // ─── Build breadcrumbs from current URL ───────────────────────────────────
  const buildBreadcrumbs = () => {
    const crumbs = [
      { label: "OTTOBELLI", action: () => navigate("/") },
    ];

    const path = location.pathname;

    if (path.startsWith("/classics")) {
      crumbs.push({ label: "CLASSICS", action: () => navigate("/classics") });
    }
    if (path.startsWith("/everyday")) {
      crumbs.push({ label: "EVERYDAY WEAR", action: () => navigate("/everyday") });
    }
    if (path.startsWith("/classics/") && path.split("/").length >= 3) {
      const categorySlug = path.split("/")[2];
      const label = categorySlug.replace(/-/g, " ").toUpperCase();
      crumbs.push({
        label,
        action: () => navigate(`/classics/${categorySlug}`),
      });
    }
    if (path.startsWith("/everyday/") && path.split("/").length >= 3) {
      const categorySlug = path.split("/")[2];
      const label = categorySlug.replace(/-/g, " ").toUpperCase();
      crumbs.push({
        label,
        action: () => navigate(`/everyday/${categorySlug}`),
      });
    }
    if (path.startsWith("/products/")) {
      crumbs.push({ label: "PRODUCT", action: () => {} });
    }
    if (path.startsWith("/cart")) {
      crumbs.push({ label: "CART", action: () => navigate("/cart") });
    }
    if (path.startsWith("/account")) {
      crumbs.push({ label: "ACCOUNT", action: () => navigate("/account") });
    }

    return crumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  // ─── Handle profile/user icon click ──────────────────────────────────────
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

   const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };
  // ─── Handle favorites click ───────────────────────────────────────────────
  const handleFavoritesClick = () => {
    if (isLoggedIn) {
      navigate("/favorites");
    } else {
      navigate("/login");
    }
  };

return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8"
      style={{
        height: "46px",
        background: "#09090E",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* ── Breadcrumb — Hidden on mobile to prevent layout collision ── */}
      <div className="hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.25em]">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-white/20">›</span>}
            <button
              onClick={crumb.action}
              className={`tracking-[0.2em] transition-colors duration-200 ${
                i === breadcrumbs.length - 1
                  ? "text-white/80 cursor-default"
                  : "text-white/35 hover:text-white/70 cursor-pointer"
              }`}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </div>

      {/* Spacer for mobile layout alignment to push brand logo perfectly center */}
      <div className="w-[85px] md:hidden" />

      {/* ── Center wordmark ── */}
      <button
        onClick={() => navigate("/")}
        className="absolute left-1/2 -translate-x-1/2 text-white tracking-[0.35em] md:tracking-[0.45em] font-bold text-xs md:text-sm leading-none whitespace-nowrap"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        OTTOBELLI
      </button>

      {/* ── Right icons ── */}
      <div className="flex items-center gap-4 md:gap-5 z-10">
        {/* User / Profile */}
        <button
          onClick={handleProfileClick}
          className="text-white/40 hover:text-white/80 transition-colors duration-200 p-1"
        >
          <User size={15} strokeWidth={1.5} />
        </button>

        {/* Favorites */}
        <button
          onClick={handleFavoritesClick}
          className="relative text-white/40 hover:text-white/80 transition-colors duration-200 p-1"
        >
          <Heart size={15} strokeWidth={1.5} />
          {favCount > 0 && (
            <span
              className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#C8A96E] flex items-center justify-center text-[8px] font-bold text-black"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {favCount}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={handleCartClick}
          className="relative text-white/40 hover:text-white/80 transition-colors duration-200 p-1"
        >
          <ShoppingBag size={15} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span
              className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#C8A96E] flex items-center justify-center text-[8px] font-bold text-black"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;