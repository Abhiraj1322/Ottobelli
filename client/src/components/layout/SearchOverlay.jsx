
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close search when Escape is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Search products with debounce
  useEffect(() => {
    if (!isOpen) return;

    const query = searchQuery.trim();

    if (!query) {
      setProducts([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/products", {
          params: {
            search: query,
            page: 1,
            limit: 24,
          },
        });

        if (!cancelled) {
          setProducts(response.data.products || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to search products. Please try again.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold">
            Search Ottobelli
          </h2>

          <button onClick={onClose} className="text-2xl">
            ✕
          </button>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          autoFocus
          className="w-full border-b border-gray-400 py-4 text-xl outline-none"
        />

        {/* Results */}
        <div className="mt-8">

          {loading && <p>Searching...</p>}

          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && searchQuery.trim() && products.length === 0 && (
            <p>No products found.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="group"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover"
                />

                <h3 className="mt-3 font-medium">
                  {product.name}
                </h3>

                <p className="text-gray-600">
                  {product.currency} {product.price}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
