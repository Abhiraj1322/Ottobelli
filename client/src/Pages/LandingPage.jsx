import { useState, useEffect } from "react";
import api from '../api/axios';
export default function LandingPage() {
  
  const [categories, setCategories] = useState([]);
  const[everyday,seteveryday]=useState([])
const [bestSellers, setBestSellers] = useState([]);
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
  const fetchBestSellers = async () => {
    try {
      const { data } = await api.get("api/products/best-sellers");
      setBestSellers(data.bestSellers);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    }
  };

  fetchBestSellers();
}, []);
  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 antialiased">
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
        href={`/classics/${category.slug}`}
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
          href={`/everyday/${category.slug}`}
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

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {bestSellers.map((product) => (
      <a
        key={product._id}
        href={`/products/${product.slug}`}
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
              {new Intl.NumberFormat("en-CA", {
                style: "currency",
                currency: product.currency || "CAD",
              }).format(product.price)}
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


    </div>
  );
}