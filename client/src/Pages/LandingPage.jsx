import { useState, useEffect } from "react";
import api from '../api/axios';
export default function LandingPage() {
  
  const [categories, setCategories] = useState([]);
  const[everyday,seteveryday]=useState([])
    const[bestseller,setbestseller]=useState([])
const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Querying the classics split context from your controller endpoints
        const res = await api.get("/api/categories?section=classics");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch classics categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);


useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories?section=everyday");
        seteveryday(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();

  }, []);
useEffect(() => {
    const fetchBestseller = async () => {
      try {
        const res = await api.get("/api/products/best-sellers");
        setbestseller(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestseller();

  }, []);

console.log(bestseller)
  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 antialiased">

      {/* Announcement Bar */}
      <div className="bg-stone-950 px-4 py-3 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white sm:text-xs">
        Made-to-measure classics · Fit Right Guarantee on every order
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#classics" className="text-[11px] uppercase tracking-[0.15em] hover:text-stone-500">
              Classics
            </a>
            <a href="#everyday" className="text-[11px] uppercase tracking-[0.15em] hover:text-stone-500">
              Everyday
            </a>
            <a href="#craftsmanship" className="text-[11px] uppercase tracking-[0.15em] hover:text-stone-500">
              Our Craft
            </a>
          </nav>

          <a href="#" className="font-serif text-2xl tracking-[0.25em] sm:text-3xl">
            OTTOBELLI
          </a>

          <div className="flex items-center gap-4">
            <a href="#fitting" className="hidden text-[11px] uppercase tracking-wider underline underline-offset-4 lg:block">
              Book a fitting
            </a>
            <button aria-label="Search" className="p-2 hover:bg-stone-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
            </button>
            <button aria-label="Shopping bag" className="p-2 hover:bg-stone-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 8h14l-1 13H6L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#172131] text-white">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2000&q=90"
              alt=""
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111923] via-[#172131]/90 to-transparent" />
          </div>

          <div className="mx-auto grid min-h-[600px] max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-12">
            <div className="max-w-xl">
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-stone-300">
                The Classics Collection
              </p>

              <h1 className="font-serif text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
                Tailored to you,
                <br />
                down to the stitch.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-stone-300 sm:text-lg">
                Discover considered menswear crafted around your style,
                your measurements and your life.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#classics"
                  className="inline-flex min-h-12 items-center bg-white px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-950 transition hover:bg-stone-200"
                >
                  Explore classics <span className="ml-4">→</span>
                </a>

                <a
                  href="#fitting"
                  className="inline-flex min-h-12 items-center border border-white/70 px-7 text-[11px] font-semibold uppercase tracking-[0.15em] transition hover:bg-white hover:text-stone-950"
                >
                  Book a fitting
                </a>
              </div>

              <div className="mt-12 flex items-center gap-3 text-xs text-stone-300">
                <span className="h-px w-10 bg-stone-400" />
                Thoughtfully made. Made to last.
              </div>
            </div>

            <div className="relative hidden h-[500px] md:block">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=90"
                alt="Tailored menswear"
                className="absolute right-0 top-0 h-full w-[80%] object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* Classics */}
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

    <a
      href="#classics"
      className="border-b border-stone-900 pb-2 text-[11px] uppercase tracking-wider"
    >
      View all collections →
    </a>
  </div>

  <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
    {categories.map((category, index) => (
      <a
        href={`/collections/${category.slug}`}
        key={category._id}
        className="group"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs uppercase tracking-widest text-stone-400">
                {category.name}
              </span>
            </div>
          )}

          <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px]">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
              {category.name}
            </h3>

            <p className="mt-2 text-xs text-stone-500">
              {category.subcategories?.map((sub) => sub.name).join(" · ") ||
                "Explore the collection"}
            </p>
          </div>

          <span className="shrink-0 transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </a>
    ))}
  </div>
</section>

      {/* Everyday */}
<section id="everyday" className="bg-[#f6f5f2]">
  <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
    <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
          Off-duty, elevated
        </p>

        <h2 className="font-serif text-3xl sm:text-4xl">
          Everyday essentials
        </h2>
      </div>

      <a
        href="#everyday"
        className="border-b border-stone-900 pb-2 text-[11px] uppercase tracking-wider"
      >
        Explore everyday →
      </a>
    </div>

    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
      {everyday.map((category, index) => (
        <a
          href={`/collections/${category.slug}`}
          key={category._id}
          className="group"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <span className="text-center text-xs uppercase tracking-widest text-stone-400">
                  {category.name}
                </span>
              </div>
            )}

            <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[10px]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
                {category.name}
              </h3>

              <p className="mt-2 text-xs text-stone-500">
                {category.subcategories?.map((sub) => sub.name).join(" · ") ||
                  "Explore the collection"}
              </p>
            </div>

            <span className="shrink-0 transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>
        {/* Best Sellers */}
        <section id="best-sellers" className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="mb-9">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
              Customer favourites
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Best sellers
            </h2>
          </div>

          {/* Render your product API data inside this grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* Product cards go here */}
          </div>
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

            <a
              href="#"
              className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-950 transition hover:bg-stone-200"
            >
              Book a fitting <span className="ml-4">→</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          <div>
            <a href="#" className="font-serif text-xl tracking-[0.24em]">
              OTTOBELLI
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-stone-500">
              Considered menswear. Made personal.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider">Shop</h3>
            <div className="mt-4 space-y-3 text-sm text-stone-500">
              <a href="#classics" className="block hover:text-stone-950">Classics</a>
              <a href="#everyday" className="block hover:text-stone-950">Everyday</a>
              <a href="#best-sellers" className="block hover:text-stone-950">Best sellers</a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider">Customer care</h3>
            <div className="mt-4 space-y-3 text-sm text-stone-500">
              <a href="#craftsmanship" className="block hover:text-stone-950">Made to measure</a>
              <a href="#fitting" className="block hover:text-stone-950">Book a fitting</a>
              <a href="#fitting" className="block hover:text-stone-950">Fit Right Guarantee</a>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider">Stay in touch</h3>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Updates on new collections and considered essentials.
            </p>
            <form className="mt-4 flex border-b border-stone-300">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 py-3 text-sm outline-none placeholder:text-stone-400"
              />
              <button type="button" className="px-2 text-xs font-semibold uppercase tracking-wider">
                Join →
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-stone-200 px-5 py-5 text-[10px] uppercase tracking-wider text-stone-400 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 md:flex-row md:justify-between">
            <p>© Ottobelli. All rights reserved.</p>
            <p>Crafted with care. Worn with confidence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}