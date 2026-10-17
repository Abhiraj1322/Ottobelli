import React, { useRef, useEffect, useState } from "react";
import {
  ShoppingBag,
  User,
  Heart,
  ChevronDown,
  Check,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuthStore from "../../store/userAuthStore";
import useCartStore from "../../store/userCartStore";
import useFavoritesStore from "../../store/favoritesStore";
import userProfileStore from "../../store/userProfileStore";

const Navbar = ({ onOpenBag }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // ─── Component State ──────────────────────────────────────────────────────
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Zustand Stores ───────────────────────────────────────────────────────
  const { isLoggedIn } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { favorites } = useFavoritesStore();

  const profileStore = userProfileStore();
  const { profiles, activeProfile, switchProfile, fetchProfiles, isLoading } =
    profileStore;

  const cartCount = getItemCount ? getItemCount() : 0;
  const favCount = favorites ? favorites.length : 0;

  useEffect(() => {
    if (isLoggedIn && fetchProfiles) {
      fetchProfiles();
    }
  }, [isLoggedIn, fetchProfiles]);

  // Close mobile drawer and search bar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleCartClick = () => {
    if (onOpenBag) {
      onOpenBag();
    } else {
      navigate("/cart");
    }
  };

  const handleFavoritesClick = () => {
    setIsMobileMenuOpen(false);
    if (isLoggedIn) {
      navigate("/favorites");
    } else {
      navigate("/login");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* ── Top Promo Bar ── */}
      <div className="bg-[#141414] text-white text-[12.5px] tracking-wider py-2 relative z-50">
        <div className="max-w-[1440px] mx-auto px-4 flex justify-between items-center relative text-center">
          <span className="w-full font-light">
            Made-to-measure Classics · Fit Right Guarantee on every order
          </span>
          <button
            onClick={() => navigate("/fitting")}
            className="hidden md:block absolute right-4 text-xs text-gray-400 hover:text-white transition-colors underline"
          >
            Book a Fitting
          </button>
        </div>
      </div>

      {/* ── Main Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E4E4E1]">
        <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-3 items-center h-[72px]">
          {/* Left: Mobile Hamburger & Category Links */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <nav className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-widest text-black">
              <Link
                to="/classics"
                className={`pb-1 hover:border-b-2 border-black transition-all ${
                  location.pathname.startsWith("/classics") ? "border-b-2 border-black" : ""
                }`}
              >
                Classics
              </Link>
              <Link
                to="/everyday"
                className={`pb-1 hover:border-b-2 border-black transition-all ${
                  location.pathname.startsWith("/everyday") ? "border-b-2 border-black" : ""
                }`}
              >
                Everyday
              </Link>
              <a
                href="#howit"
                onClick={(e) => {
                  if (location.pathname !== "/") {
                    e.preventDefault();
                    navigate("/#howit");
                  }
                }}
                className="pb-1 hover:border-b-2 border-black transition-all"
              >
                How It Works
              </a>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="font-serif text-2xl tracking-[0.28em] font-medium text-black uppercase"
            >
              OTTOBELLI
            </button>
          </div>

          {/* Right: Actions (Book Fitting, Profile, Wishlist, Search, Cart) */}
          <div className="flex justify-end items-center gap-1 md:gap-3">
            <button
              onClick={() => navigate("/fitting")}
              className="hidden lg:block text-xs uppercase tracking-wider underline mr-2 text-black"
            >
              Book a Fitting
            </button>

            {/* Profile Dropdown Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleUserClick}
                className="p-2 text-black hover:opacity-75 transition-opacity flex items-center gap-1 text-xs tracking-wider uppercase"
                aria-label="User Account"
              >
                <User size={20} strokeWidth={1.5} />
                {isLoggedIn && activeProfile && (
                  <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">
                    {activeProfile.displayName || activeProfile.name}
                  </span>
                )}
                {isLoggedIn && (
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Profile Switcher Menu */}
              {isLoggedIn && isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 py-2 z-50 bg-white border border-[#E4E4E1] shadow-lg rounded-none">
                  <div className="px-3 py-1.5 border-b border-[#E4E4E1] mb-1 flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                      Fitting Profiles
                    </p>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                      {profiles?.length || 0} Saved
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-3 py-2 text-xs text-gray-400 italic">
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
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                              isActive
                                ? "bg-gray-100 text-black font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="truncate max-w-[140px]">
                              {profile.displayName || profile.name || "Unnamed Profile"}
                            </span>
                            {isActive && <Check size={14} className="text-[#7A2632]" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-xs text-gray-400 italic">
                        No saved profiles
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E4E4E1] mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        navigate("/account");
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs tracking-wider uppercase text-gray-600 hover:text-black transition-colors flex items-center justify-between"
                    >
                      <span>Account Dashboard</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={handleFavoritesClick}
              className="p-2 text-black hover:opacity-75 transition-opacity relative"
              aria-label="Favorites"
            >
              <Heart size={20} strokeWidth={1.5} />
              {favCount > 0 && (
                <span className="absolute top-1 right-0 bg-[#7A2632] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                  {favCount}
                </span>
              )}
            </button>

            {/* Search Toggle Icon */}
            <button
              className="p-2 text-black hover:opacity-75 transition-opacity"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Bag / Cart Trigger Button */}
            <button
              className="p-2 relative text-black hover:opacity-75 transition-opacity"
              onClick={handleCartClick}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-[#141414] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Slide-Down Search Overlay ── */}
        {searchOpen && (
          <div className="border-t border-[#E4E4E1] bg-white py-3 px-4 transition-all">
            <form onSubmit={handleSearchSubmit} className="max-w-[1440px] mx-auto flex items-center gap-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suits, shirts, chinos…"
                className="w-full text-base outline-none bg-transparent text-black placeholder-gray-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-gray-500 hover:text-black"
                aria-label="Close Search"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ── Mobile Drawer Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Navigation Drawer ── */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-80 z-50 bg-white border-r border-[#E4E4E1] p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#E4E4E1]">
            <span className="font-serif text-xl tracking-[0.2em] font-medium text-black">
              OTTOBELLI
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-wider text-black">
            <Link
              to="/classics"
              className="py-1 border-b border-gray-100 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Classics
            </Link>
            <Link
              to="/everyday"
              className="py-1 border-b border-gray-100 hover:text-gray-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Everyday Wear
            </Link>
            <a
              href="#howit"
              className="py-1 border-b border-gray-100 hover:text-gray-600"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (location.pathname !== "/") {
                  e.preventDefault();
                  navigate("/#howit");
                }
              }}
            >
              How It Works
            </a>
            <Link
              to="/fitting"
              className="py-1 border-b border-gray-100 text-[#7A2632]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book a Fitting
            </Link>
          </nav>
        </div>

        {/* Mobile Drawer Bottom Actions */}
        <div className="pt-6 border-t border-[#E4E4E1] space-y-3">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate(isLoggedIn ? "/account" : "/login");
            }}
            className="w-full py-3 text-xs tracking-widest uppercase bg-[#141414] text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            {isLoggedIn ? "Account Dashboard" : "Sign In / Register"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;