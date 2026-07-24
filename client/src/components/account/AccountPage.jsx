import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Ruler,
  ShoppingBag,
  Heart,
  LogOut,
  ChevronRight,
  Package,
} from "lucide-react";
import useAuthStore from "../../store/userAuthStore";
import useCartStore from "../../store/userCartStore";
import useFavoritesStore from "../../store/favoritesStore";
const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const { favorites, fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    fetchCart();
    fetchFavorites();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    {
      icon: <User size={16} strokeWidth={1.5} />,
      label: "My Profiles",
      desc: "Manage body measurement profiles",
      path: "/account/profiles",
      count: null,
    },
   
    {
      icon: <Package size={16} strokeWidth={1.5} />,
      label: "Order History",
      desc: "Track and view past orders",
      path: "/account/orders",
      count: null,
    },
    {
      icon: <Heart size={16} strokeWidth={1.5} />,
      label: "Saved Favourites",
      desc: "Your saved items",
      path: "/account/favorites",
      count: favorites.length > 0 ? favorites.length : null,
    },
    {
      icon: <ShoppingBag size={16} strokeWidth={1.5} />,
      label: "Cart",
      desc: "View your current cart",
      path: "/cart",
      count: items.length > 0 ? items.length : null,
    },
  ];

  return (
    <div
      className="min-h-screen pt-[46px]"
      style={{ background: "#09090E", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-2xl mx-auto px-8 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p
            className="text-[9px] tracking-[0.45em] uppercase mb-3 font-bold"
            style={{ color: "#C8A96E" }}
          >
            My Account
          </p>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome, {user?.name?.split(" ")[0]}
          </h1>
          <p
            className="text-xs tracking-wide"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {user?.email}
          </p>
          <div
            className="mt-6 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </motion.div>

        {/* ── Menu Items ── */}
        <div className="space-y-2 mb-10">
          {menuItems.map((item, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-5 px-6 py-5 text-left transition-all duration-200 hover:bg-white/5 group"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(200,169,110,0.1)",
                  border: "1px solid rgba(200,169,110,0.2)",
                  color: "#C8A96E",
                }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-xs font-bold text-white mb-0.5 tracking-wide">
                  {item.label}
                </p>
                <p
                  className="text-[9px] tracking-wider"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {item.desc}
                </p>
              </div>

              {/* Count badge */}
              {item.count && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                  style={{ background: "#C8A96E", color: "#1A1814" }}
                >
                  {item.count}
                </span>
              )}

              {/* Arrow */}
              <ChevronRight
                size={14}
                className="flex-shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: "rgba(255,255,255,0.25)" }}
              />
            </motion.button>
          ))}
        </div>

        {/* ── Quick Stats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { label: "Orders", value: "0" },
            { label: "Favourites", value: favorites.length.toString() },
            { label: "Cart Items", value: items.length.toString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Logout ── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-xs font-bold tracking-[0.25em] uppercase transition-all duration-200 hover:bg-white/5"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <LogOut size={13} />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
};

export default AccountPage;