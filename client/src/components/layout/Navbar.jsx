
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const CUSTOM_SUBCATEGORIES = new Set([
  "Suits",
  "Blazers",
  "Tuxedos",
  "100% Cotton",
  "Cotton-Silk Blend",
  "Pants",
]);

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeMenu) return;

    let cancelled = false;

    async function fetchMenuData() {
      setLoading(true);
      setError("");

      try {
        const [categoryRes, productRes] = await Promise.all([
          api.get("/api/categories", {
            params: { section: activeMenu },
          }),
          api.get("/api/products", {
            params: {
              section: activeMenu,
              page: 1,
              limit: 12,
            },
          }),
        ]);

        const categoryData = Array.isArray(categoryRes.data)
          ? categoryRes.data
          : categoryRes.data.categories;

        const productData = Array.isArray(productRes.data)
          ? productRes.data
          : productRes.data.products;

        if (!Array.isArray(categoryData)) {
          throw new Error("Invalid categories response");
        }

        if (!Array.isArray(productData)) {
          throw new Error("Invalid products response");
        }

        if (!cancelled) {
          setCategories(
            categoryData
              .filter((category) => !category.parentCategory)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          );

          setProducts(productData);
        }
      } catch (err) {
        console.error("Failed to load navbar data:", err);

        if (!cancelled) {
          setCategories([]);
          setProducts([]);
          setError("Unable to load the collection. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMenuData();

    return () => {
      cancelled = true;
    };
  }, [activeMenu]);

  const closeMenu = () => setActiveMenu(null);

  const sectionLabel =
    activeMenu === "classics" ? "Classics" : "Everyday";

  const promoProduct = products[0];

  return (
    <header
      className="relative z-50 border-b border-stone-200 bg-white"
      onMouseLeave={closeMenu}
    >
      {/* Announcement bar */}
      <div className="bg-stone-950 px-4 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-white sm:text-xs">
        Made-to-measure classics · Fit Right Guarantee on every order
      </div>

      {/* Main navigation */}
      <nav className="mx-auto flex min-h-[76px] max-w-[1800px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Left navigation */}
        <div className="flex shrink-0 items-center gap-5 lg:gap-8">
          {["classics", "everyday"].map((section) => (
            <button
              key={section}
              type="button"
              aria-expanded={activeMenu === section}
              onMouseEnter={() => setActiveMenu(section)}
              onFocus={() => setActiveMenu(section)}
              onClick={() =>
                setActiveMenu((current) =>
                  current === section ? null : section
                )
              }
              className={`border-b-2 py-7 text-[10px] font-semibold uppercase tracking-[0.14em] transition sm:text-xs ${
                activeMenu === section
                  ? "border-stone-900"
                  : "border-transparent hover:text-stone-500"
              }`}
            >
              {section}
            </button>
          ))}

          <Link
            to="/how-it-works"
            onMouseEnter={closeMenu}
            className="hidden whitespace-nowrap py-7 text-[10px] font-semibold uppercase tracking-[0.12em] hover:text-stone-500 lg:block lg:text-xs"
          >
            How It Works
          </Link>
        </div>

        {/* Center logo */}
        <Link
          to="/"
          onMouseEnter={closeMenu}
          className="whitespace-nowrap font-serif text-xl tracking-[0.16em] sm:text-3xl lg:text-4xl lg:tracking-[0.22em]"
        >
          OTTOBELLI
        </Link>

        {/* Right navigation */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5 lg:gap-7">
          <Link
            to="/book-fitting"
            onMouseEnter={closeMenu}
            className="hidden whitespace-nowrap text-xs tracking-wider underline underline-offset-4 xl:block"
          >
            Book a Fitting
          </Link>

          <Link
            to="/search"
            onMouseEnter={closeMenu}
            aria-label="Search"
            className="p-1 transition hover:text-stone-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </Link>

          <Link
            to="/account"
            onMouseEnter={closeMenu}
            aria-label="Account"
            className="hidden p-1 transition hover:text-stone-500 sm:block"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </Link>

          <Link
            to="/cart"
            onMouseEnter={closeMenu}
            aria-label="Shopping bag"
            className="p-1 transition hover:text-stone-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
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

      {/* Full-width mega menu */}
      {activeMenu && (
        <div
          className="absolute left-0 top-full w-full border-b border-stone-200 bg-white shadow-xl"
          onMouseEnter={() => setActiveMenu(activeMenu)}
        >
          <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-8 px-6 py-8 sm:px-10 lg:grid-cols-12 lg:gap-8 lg:px-12">
            {/* Category columns */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
                {loading ? (
                  <p className="col-span-full py-8 text-sm text-stone-500">
                    Loading {sectionLabel}...
                  </p>
                ) : error ? (
                  <p className="col-span-full py-8 text-sm text-red-600">
                    {error}
                  </p>
                ) : categories.length === 0 ? (
                  <p className="col-span-full py-8 text-sm text-stone-500">
                    No categories found.
                  </p>
                ) : (
                  categories.map((category) => (
                    <div key={category._id}>
                      <Link
                        to={`/${activeMenu}/${category.slug}`}
                        onClick={closeMenu}
                        className="mb-6 block text-[11px] font-bold uppercase tracking-[0.15em] transition hover:text-stone-500"
                      >
                        {category.name}
                      </Link>

                      <div className="space-y-4">
                        {(category.subcategories || [])
                          .slice()
                          .sort(
                            (a, b) =>
                              (a.order ?? 0) - (b.order ?? 0)
                          )
                          .map((subcategory) => (
                            <Link
                              key={subcategory._id}
                              to={`/${activeMenu}/${category.slug}/${subcategory.slug}`}
                              onClick={closeMenu}
                              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-stone-700 transition hover:text-black"
                            >
                              <span>{subcategory.name}</span>

                              {activeMenu === "classics" &&
                                CUSTOM_SUBCATEGORIES.has(
                                  subcategory.name
                                ) && (
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#873d42]">
                                    Custom
                                  </span>
                                )}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))
                )}

                {/* Explore column */}
                {!loading && !error && (
                  <div>
                    <h2 className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em]">
                      Explore
                    </h2>

                    <div className="space-y-4">
                      <Link
                        to={`/${activeMenu}`}
                        onClick={closeMenu}
                        className="block text-sm text-stone-700 transition hover:text-black"
                      >
                        Shop all {sectionLabel}
                      </Link>

                      <Link
                        to="/how-it-works"
                        onClick={closeMenu}
                        className="block text-sm text-stone-700 transition hover:text-black"
                      >
                        How customization works
                      </Link>

                      <Link
                        to="/book-fitting"
                        onClick={closeMenu}
                        className="block text-sm text-stone-700 transition hover:text-black"
                      >
                        Book a Fitting
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Promotional card */}
            <div className="lg:col-span-3">
              <Link
                to={
                  promoProduct
                    ? `/product/${promoProduct.slug}`
                    : `/${activeMenu}`
                }
                onClick={closeMenu}
                className="group block bg-[#f2f1ee]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-100 lg:aspect-[3/4]">
                  {promoProduct?.images?.[0] ? (
                    <img
                      src={promoProduct.images[0]}
                      alt={promoProduct.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-48 items-center justify-center px-6 text-center text-sm text-stone-500">
                      {loading
                        ? "Loading featured piece..."
                        : "Discover the collection"}
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="text-base font-semibold">
                    {promoProduct?.name ||
                      (activeMenu === "classics"
                        ? "Design your suit"
                        : "Everyday essentials")}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-stone-500">
                    {activeMenu === "classics"
                      ? "Choose your fabric, then make every detail your own."
                      : "Discover timeless essentials designed for everyday wear."}
                  </p>

                  <span className="mt-5 inline-block border-b border-stone-900 pb-1 text-xs font-medium uppercase tracking-[0.12em]">
                    Shop now
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
