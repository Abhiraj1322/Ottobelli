
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "motion/react";

function AccountBar({ isOpen, onClose, user, onGoogleSuccess, onLogout }) {
  // Prevent background scrolling while sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black"
          />

          {/* Account sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-[101] flex h-dvh w-full max-w-[430px] flex-col bg-[#f8f7f4] text-[#171717] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-300 px-7 py-6">
              <h2 className="text-sm font-medium tracking-[0.2em]">
                YOUR ACCOUNT
              </h2>

              <button
                onClick={onClose}
                aria-label="Close account sidebar"
                className="text-2xl font-light transition hover:opacity-50"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-7 py-8">

              {!user ? (
                /* Logged-out state */
                <div className="flex flex-col items-center py-10 text-center">
                  <h3 className="mb-3 text-lg font-light">
                    Welcome to Ottobelli
                  </h3>

                  <p className="mb-8 max-w-[280px] text-sm leading-6 text-stone-500">
                    Sign in to save your personal style and access your account.
                  </p>

                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => console.error("Google login failed")}
                    theme="outline"
                    shape="rectangular"
                    width="280"
                  />
                </div>
              ) : (
                /* Logged-in state */
                <div>
                  <div className="flex items-center gap-4 border-b border-stone-300 pb-8">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Customer profile"
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-200 text-xl">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="text-base font-medium">
                        {user.name}
                      </h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {user.email}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        Signed in with Google
                      </p>
                    </div>
                  </div>

                  {/* Saved Style */}
                  <section className="border-b border-stone-300 py-8">
                    <h3 className="mb-5 text-xs font-medium tracking-[0.2em]">
                      YOUR SAVED STYLE
                    </h3>

                    <p className="text-sm leading-6 text-stone-500">
                      Nothing saved yet. Finish customizing an item
                      and your choices will be saved here.
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            {user && (
              <div className="border-t border-stone-300 px-7 py-6">
                <button
                  onClick={onLogout}
                  className="w-full border border-stone-400 px-5 py-3 text-xs font-medium tracking-[0.18em] transition hover:bg-black hover:text-white"
                >
                  SIGN OUT
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default AccountBar;
