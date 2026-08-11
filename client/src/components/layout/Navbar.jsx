import React, { useRef, useEffect, useState } from "react";
import { ShoppingBag, User, Heart, ChevronDown, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/userAuthStore";
import useCartStore from "../../store/userCartStore";
import useFavoritesStore from "../../store/favoritesStore";
import userProfileStore from "../../store/userProfileStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // ─── Dropdown State ──────────────────────────────────────────────────────
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // ─── Zustand Stores ───────────────────────────────────────────────────────
  const { isLoggedIn } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { favorites } = useFavoritesStore();

  const profileStore = userProfileStore();
  const { profiles, activeProfile, switchProfile, fetchProfiles, isLoading } = profileStore;

  const cartCount = getItemCount ? getItemCount() : 0;
  const favCount = favorites ? favorites.length : 0;

  useEffect(() => {
    // Trigger profile fetch if user is logged in
    if (isLoggedIn && fetchProfiles) {
      fetchProfiles();
    }
  }, [isLoggedIn, fetchProfiles]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Build breadcrumbs from current URL ───────────────────────────────────
  const buildBreadcrumbs = () => {
    const crumbs = [{ label: "OTTOBELLI", action: () => navigate("/") }];
    const path = location.pathname;

    if (path.startsWith("/classics")) {
      crumbs.push({ label: "CLASSICS", action: () => navigate("/classics") });
    }
    if (path.startsWith("/everyday")) {
      crumbs.push({ label: "EVERYDAY WEAR", action: () => navigate("/everyday") });
    }
    if (path.startsWith("/classics/") && path.split("/").length >= 3) {
      const categorySlug = path.split("/")[2];
      crumbs.push({
        label: categorySlug.replace(/-/g, " ").toUpperCase(),
        action: () => navigate(`/classics/${categorySlug}`),
      });
    }
    if (path.startsWith("/everyday/") && path.split("/").length >= 3) {
      const categorySlug = path.split("/")[2];
      crumbs.push({
        label: categorySlug.replace(/-/g, " ").toUpperCase(),
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

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

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
      {/* ── Breadcrumb — Hidden on mobile ── */}
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

      {/* Mobile Spacer */}
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
        {/* User Account / Profile Switcher Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleUserClick}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors duration-200 p-1 text-[10px] tracking-widest uppercase font-medium"
          >
            <User size={15} strokeWidth={1.5} />
            {isLoggedIn && activeProfile && (
              <span className="hidden sm:inline text-white/70 max-w-[90px] truncate">
                {activeProfile.displayName || activeProfile.name}
              </span>
            )}
            {isLoggedIn && (
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* Profile Switcher Dropdown */}
          {isLoggedIn && isProfileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 py-2 z-50 rounded-xs"
              style={{
                background: "#09090E",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.85)",
              }}
            >
              <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex justify-between items-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#C8A96E] font-semibold">
                  Fitting Profiles
                </p>
                <span className="text-[8px] text-white/30 uppercase tracking-widest">
                  {profiles?.length || 0} Saved
                </span>
              </div>

              {/* Profiles List */}
              <div className="max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="px-3 py-2 text-[10px] text-white/40 italic">
                    Loading profiles...
                  </div>
                ) : profiles && profiles.length > 0 ? (
                  profiles.map((profile) => {
                    const profileId = profile._id || profile.id;
                    const activeId = activeProfile?._id || activeProfile?.id;
                    const isActive = Boolean(
                      profileId && activeId && String(profileId) === String(activeId)
                    );

                    return (
                      <button
                        key={profileId}
                        onClick={() => {
                          if (switchProfile) switchProfile(profileId);
                          setIsProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[11px] flex items-center justify-between transition-colors duration-150 ${
                          isActive
                            ? "bg-white/10 text-white font-medium"
                            : "text-white/50 hover:bg-white/5 hover:text-white/80"
                        }`}
                      >
                        <span className="tracking-wider truncate max-w-[140px]">
                          {profile.displayName || profile.name || "Unnamed Profile"}
                        </span>
                        {isActive && <Check size={13} className="text-[#C8A96E]" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-2 text-[10px] text-white/30 italic">
                    No saved profiles
                  </div>
                )}
              </div>

              {/* Navigation Options */}
              <div className="border-t border-white/10 mt-1 pt-1">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    navigate("/account");
                  }}
                  className="w-full text-left px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-white/90 transition-colors flex items-center justify-between"
                >
                  <span>Account Dashboard</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>

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