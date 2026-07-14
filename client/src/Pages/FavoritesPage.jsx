import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import  useFavoritesStore from "../store/favoritesStore"; // Adjust path to your favorites store file
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isLoading = useFavoritesStore((state) => state.isLoading);
  const error = useFavoritesStore((state) => state.error);

  // Automatically fetch favorites from your Render backend on component mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="min-h-screen bg-[#09090E] text-stone-200 px-6 py-12 md:px-12 lg:px-24 font-sans selection:bg-stone-800">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-900/60 pb-6 mb-10 gap-4">
        <div>
          <Link to="/" className="text-white/40 hover:text-white tracking-[0.25em] text-[10px] uppercase transition-colors inline-block mb-3">
            ← Back to Studio
          </Link>
          <h1 className="text-white tracking-[0.3em] text-2xl font-bold uppercase">Curated Favorites</h1>
          <p className="text-white/40 tracking-[0.15em] text-[10px] mt-1 uppercase">Your saved archive</p>
        </div>
        <div className="text-[10px] tracking-widest uppercase bg-neutral-950 border border-stone-900 px-4 py-2 text-white/50 rounded-sm">
          Items Counter: [ {favorites.length} ]
        </div>
      </div>

      {/* Dynamic Error Messaging Container */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-3 bg-red-950/20 border border-red-900/40 rounded-sm max-w-xl text-center mx-auto"
          >
            <p className="text-red-400 text-[11px] tracking-wider font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Core Logic Grid Layout */}
      {isLoading && favorites.length === 0 ? (
        // Minimal Loading View
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-5 h-5 border border-stone-700 border-t-white rounded-full animate-spin" />
          <p className="text-white/30 tracking-[0.25em] text-[10px] uppercase animate-pulse">Syncing Archive...</p>
        </div>
      ) : favorites.length === 0 ? (
        // Beautiful Empty State Layout
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-stone-900/60 rounded-sm bg-neutral-950/20"
        >
          <p className="text-white/30 tracking-[0.25em] text-xs uppercase mb-6">Your collection is empty</p>
          <Link 
            to="/" 
            className="bg-stone-100 hover:bg-white text-neutral-950 font-medium tracking-[0.25em] text-[10px] uppercase px-6 py-3 rounded-sm transition-colors shadow-lg"
          >
            Explore Studio Products
          </Link>
        </motion.div>
      ) : (
        // Active Curated Items Grid
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {favorites.map((item) => {
              // Gracefully handle both populated object references or simple item properties
              const product = item.product || item; 
              
              return (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                  className="group bg-neutral-950 border border-stone-900/80 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl relative"
                >
                  {/* Image Frame Wrapper */}
                  <div className="aspect-square w-full bg-neutral-900 relative overflow-hidden border-b border-stone-900/40">
                    <img 
                      src={product.image || "https://via.placeholder.com/400"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Corner Quick-Delete Action overlay */}
                    <button
                      onClick={() => removeFavorite(product._id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-neutral-950/80 hover:bg-neutral-950 border border-stone-900 flex items-center justify-center text-white/50 hover:text-red-400 transition-colors backdrop-blur-sm rounded-sm"
                      title="Remove collection item"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Description Meta Content Frame */}
                  <div className="p-4 flex flex-col flex-grow justify-between bg-neutral-950">
                    <div className="mb-4">
                      <h3 className="text-white tracking-[0.1em] text-sm font-medium uppercase truncate">
                        {product.name}
                      </h3>
                      <p className="text-white/40 text-[10px] tracking-wide mt-1 line-clamp-2 min-h-[2.5rem]">
                        {product.description || "No metadata description provided."}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-stone-900/40">
                      <span className="text-stone-300 font-mono text-xs font-semibold tracking-wider">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-[10px] text-white/60 hover:text-white border border-stone-800 hover:border-white/40 px-3 py-1.5 rounded-sm tracking-widest uppercase transition-all bg-neutral-900/50"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}