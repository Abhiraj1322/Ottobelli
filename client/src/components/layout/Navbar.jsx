
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeMenu) return;

    let cancelled = false;

    async function fetchCategories() {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(
          `/api/categories?section=${activeMenu}`
        );

        // Support either an array or { categories: [...] }
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.categories;

        if (!Array.isArray(data)) {
          throw new Error("API response is not a categories array");
        }

        if (!cancelled) {
          setCategories(data.filter(
            (category) => !category.parentCategory
          ));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);

        if (!cancelled) {
          setCategories([]);
          setError("Could not load categories.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [activeMenu]);

  return (
    <header
      className="relative z-50 border-b border-stone-200 bg-white"
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* Announcement bar */}
      <div className="bg-stone-950 px-4 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-white sm:text-xs">
        Made-to-measure classics · Fit Right Guarantee on every order
      </div>

      {/* Main navigation */}
      <nav className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-7">
          <button
            type="button"
            onMouseEnter={() => setActiveMenu("classics")}
            onFocus={() => setActiveMenu("classics")}
            onClick={() =>
              setActiveMenu((current) =>
                current === "classics" ? null : "classics"
              )
            }
            className={`text-[11px] uppercase tracking-[0.15em] hover:text-stone-500 ${
              activeMenu === "classics" ? "underline underline-offset-8" : ""
            }`}
          >
            Classics
          </button>

          <button
            type="button"
            onMouseEnter={() => setActiveMenu("everyday")}
            onFocus={() => setActiveMenu("everyday")}
            onClick={() =>
              setActiveMenu((current) =>
                current === "everyday" ? null : "everyday"
              )
            }
            className={`text-[11px] uppercase tracking-[0.15em] hover:text-stone-500 ${
              activeMenu === "everyday" ? "underline underline-offset-8" : ""
            }`}
          >
            Everyday
          </button>

          <Link
            to="/how-it-works"
            className="hidden text-[11px] uppercase tracking-[0.15em] hover:text-stone-500 sm:block"
          >
            Our Craft
          </Link>
        </div>

        <Link
          to="/"
          className="font-serif text-xl tracking-[0.2em] sm:text-3xl sm:tracking-[0.25em]"
        >
          OTTOBELLI
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/book-fitting"
            className="hidden text-[11px] uppercase tracking-wider underline underline-offset-4 lg:block"
          >
            Book a fitting
          </Link>

          <button type="button" aria-label="Search" className="p-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </button>

          <Link to="/cart" aria-label="Shopping bag" className="p-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 8h14l-1 13H6L5 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Main category dropdown */}
      {activeMenu && (
        <div className="absolute left-0 top-full w-full border-b border-stone-200 bg-white shadow-lg">
          <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-10 lg:px-12">
            <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              {activeMenu} categories
            </h2>

            {loading ? (
              <p className="text-sm text-stone-500">
                Loading categories...
              </p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-stone-500">
                No main categories found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/${activeMenu}/${category.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="text-sm font-medium transition hover:text-stone-500"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

