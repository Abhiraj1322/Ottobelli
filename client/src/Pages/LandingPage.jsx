
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [everyday, setEveryday] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchLandingPageData() {
      setIsLoading(true);
      setError("");

      try {
        const [classicsRes, everydayRes, bestSellersRes] =
          await Promise.all([
            api.get("/api/categories", {
              params: { section: "classics" },
            }),
            api.get("/api/categories", {
              params: { section: "everyday" },
            }),
            api.get("/api/products/best-sellers"),
          ]);

        const getCategories = (data) => {
          if (Array.isArray(data)) return data;
          return Array.isArray(data?.categories)
            ? data.categories
            : [];
        };

        // Convert parent categories and nested subcategories
        // into a flat list of subcategory cards.
        const getSubcategories = (responseData) => {
          const parents = getCategories(responseData);

          return parents
            .filter((category) => !category.parentCategory)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .flatMap((category) =>
              (category.subcategories || [])
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((subcategory) => ({
                  ...subcategory,
                  parentName: category.name,
                  parentSlug: category.slug,
                }))
            );
        };

        if (!cancelled) {
          setCategories(getSubcategories(classicsRes.data));
          setEveryday(getSubcategories(everydayRes.data));
 
          const products = bestSellersRes.data?.bestSellers;

          setBestSellers(Array.isArray(products) ? products : []);
        }
      } catch (err) {
        console.error("Failed to load landing page:", err);

        if (!cancelled) {
          setError("Some collections could not be loaded. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchLandingPageData();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatPrice = (price, currency = "CAD") =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency,
    }).format(Number(price) || 0);

  // Reusable subcategory card
  const renderCategoryCards = (items, section) => {
    if (items.length === 0) {
      return (
        <p className="col-span-full py-10 text-sm text-stone-500">
          No subcategories are available yet.
        </p>
      );
    }
  return items.map((subcategory, index) => (
    <Link
      to={`/${section}/${subcategory.slug}`}
      key={subcategory._id || subcategory.slug}
      className="group flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F2F1EE] p-6 flex items-center justify-center mb-3">
        {subcategory.image ? (
          <img
            src={subcategory.image}
            alt={subcategory.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-center text-xs uppercase tracking-widest text-stone-400">
              {subcategory.name}
            </span>
          </div>
        )}

        {/* Number Badge */}
        <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase shadow-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Card Footer Details */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-950 sm:text-sm">
            {subcategory.name}
          </h3>
          <p className="mt-1 text-[10px] text-gray-500 uppercase tracking-wider">
            {subcategory.parentName || section}
          </p>
        </div>

        <span className="text-[10px] font-medium tracking-wider text-gray-500 group-hover:text-black transition-colors flex items-center gap-1">
          Shop now <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  ));


  };

  return (
   <div className="min-h-screen bg-white font-sans text-stone-900 antialiased pt-[46px]">
      <main>
        
        {/* ── Updated Classics Hero Section ── */}
        <section className="relative bg-[#1B2230] text-white py-16 sm:py-24 overflow-hidden">
          {/* Micro-dot grid background pattern overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />

          <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Hero Text Content (Left Column) */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <span className="text-[10px] font-bold tracking-[0.25em] text-white/60 uppercase mb-4">
                  CLASSICS COLLECTION
                </span>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white">
                  Tailored to you, down to the stitch.
                </h1>

                <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed mb-8">
                  Choose the fabric, the lapel, the lining and the fit. We make your suit to your measurements and stand behind the fit.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/classics/suits"
                    className="inline-flex min-h-12 items-center justify-center bg-white px-7 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 transition hover:bg-stone-200 shadow-sm"
                  >
                    CUSTOMIZE A SUIT
                  </Link>
                  <Link
                    to="/classics"
                    className="inline-flex min-h-12 items-center justify-center border border-white/40 px-7 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10"
                  >
                    SHOP CLASSICS
                  </Link>
                </div>
              </div>

              {/* Hero Suit & Trouser Artwork Render (Right Column) */}
              <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center p-4">
                  <img
                    src="https://ottobelli.com/cdn/shop/products/ottobelli-classics-hero-icon_800x.png"
                    alt="Tailored Classics Suit and Trousers"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Classics subcategories */}
        <section
          id="classics"
          className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                A wardrobe, considered
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl">
                Shop the classics
              </h2>
            </div>

            <Link
              to="/classics"
              className="border-b border-stone-900 pb-2 text-[11px] uppercase tracking-wider"
            >
              View all collections →
            </Link>
          </div>

          {isLoading ? (
            <p className="py-10 text-sm text-stone-500">
              Loading Classics...
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {renderCategoryCards(categories, "classics")}
            </div>
          )}
        </section>

      {/* Everyday subcategories section */}
<section id="everyday" className="bg-white py-12 sm:py-16">
  <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* Left Featured Hero Tile (5 columns on large screens) */}
      <div 
        className="lg:col-span-5 relative bg-[#5E6551] min-h-[480px] sm:min-h-[560px] p-8 sm:p-12 flex flex-col justify-between overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 0)`,
          backgroundSize: '12px 12px',
        }}
      >
        {/* Large Centered Product Artwork (Hoodie) */}
        <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 pointer-events-none">
          <img
            src="https://ottobelli.com/cdn/shop/products/ottobelli-everyday-hoodie-icon_500x.png" // Replace with your backend hoodie image URL
            alt="Everyday Wear Hoodie"
            className="w-4/5 max-h-[75%] object-contain drop-shadow-xl"
          />
        </div>

        {/* Content Overlays */}
        <div className="relative z-10">
          <span className="text-[10px] font-bold tracking-[0.25em] text-white/70 uppercase">
            READY TO WEAR
          </span>
        </div>

        <div className="relative z-10 pt-32">
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mb-6 leading-tight">
            Everyday Wear
          </h2>
          <Link
            to="/everyday"
            className="inline-flex items-center justify-center bg-white text-gray-950 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-stone-200 shadow-sm"
          >
            SHOP EVERYDAY
          </Link>
        </div>
      </div>

      {/* Right 2x2 Subcategory Cards Grid (7 columns on large screens) */}
      <div className="lg:col-span-7">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 h-full min-h-[480px]">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-stone-100 animate-pulse aspect-[4/4.5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {everyday?.slice(0, 4).map((categoryItem) => {
              // Extract first subcategory or product image for the card
              const imageSrc =
                categoryItem.image ||
                categoryItem.subcategories?.[0]?.image ||
                categoryItem.products?.[0]?.images?.[0] ||
                "https://ottobelli.com/cdn/shop/products/ottobelli-placeholder_500x.png";

              return (
                <Link
                  key={categoryItem._id || categoryItem.slug}
                  to={`/everyday/${categoryItem.slug}`}
                  className="group flex flex-col justify-between"
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-[4/4.5] bg-[#F2F1EE] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={categoryItem.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Title & Link Footer */}
                  <div className="flex items-center justify-between pt-3 pb-1 border-b border-transparent group-hover:border-stone-900 transition-colors">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-950">
                      {categoryItem.name}
                    </span>
                    <span className="text-[10px] text-gray-500 tracking-wider group-hover:text-black transition-colors">
                      Shop now
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  </div>
</section>

        {/* Best Sellers */}
        <section
          id="best-sellers"
          className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mb-9">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
              Customer favourites
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl">
              Best Sellers
            </h2>
          </div>

          {bestSellers.length === 0 ? (
            <p className="py-8 text-sm text-stone-500">
              No best sellers are available right now.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {product.badge && (
                      <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px] uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 pt-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-sm text-stone-600">
                        {formatPrice(product.price, product.currency || "CAD")}
                      </p>
                    </div>

                    <span className="shrink-0 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Craftsmanship */}
        <section id="craftsmanship" className="bg-[#f3f3f0]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                A better fit starts here
              </p>

              <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
                Made to measure in three simple steps
              </h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              <article className="border-t border-stone-300 pt-6">
                <p className="font-serif text-3xl text-stone-400">01</p>
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider">
                  Choose your fabric
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Explore fabrics chosen for their quality, feel and season.
                </p>
              </article>

              <article className="border-t border-stone-300 pt-6">
                <p className="font-serif text-3xl text-stone-400">02</p>
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider">
                  Make it your own
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Personalize the lapels, buttons, lining and finishing details.
                </p>
              </article>

              <article className="border-t border-stone-300 pt-6">
                <p className="font-serif text-3xl text-stone-400">03</p>
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider">
                  Get the right fit
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Share your measurements or book a personal fitting.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Fitting CTA */}
        <section id="fitting" className="bg-[#172131] text-white">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center lg:px-12 lg:py-20">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-300">
                Personal service, considered details
              </p>

              <h2 className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
                Your wardrobe should fit your life — and you.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
                Find your fit, discover your fabrics and make every detail personal.
              </p>
            </div>

            <Link
              to="/book-fitting"
              className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-950 transition hover:bg-stone-200"
            >
              Book a fitting <span className="ml-4">→</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
