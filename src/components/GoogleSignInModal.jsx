import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useBlogAuth } from "../context/BlogAuthContext";

export default function GoogleSignInModal({ isOpen, onClose }) {
  const { loginWithGoogle } = useBlogAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <Motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-8 shadow-2xl text-center"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <FaTimes />
            </button>
          )}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-white/10">
            <FcGoogle className="text-4xl" />
          </div>

          <h3 className="mt-5 text-2xl font-extrabold text-white tracking-tight">
            Sign in with Google
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Please sign in with your Google account to access and read blog articles.
          </p>

          <div className="mt-6">
            <button
              onClick={async () => {
                const res = await loginWithGoogle();
                if (res && onClose) onClose();
              }}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-6 shadow-xl shadow-white/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <FcGoogle className="text-2xl flex-shrink-0" />
              <span>Continue with Google</span>
            </button>
          </div>
        </Motion.div>
      </div>
    </AnimatePresence>
  );
}
