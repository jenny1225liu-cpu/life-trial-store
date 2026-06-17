import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Gamepad2, Compass, Star, BarChart3, User
} from "lucide-react";
import Toast from "../components/Toast";

const NAV_ITEMS = [
  { to: "/", icon: Gamepad2, label: "试玩" },
  { to: "/map", icon: Compass, label: "探索" },
  { to: "/favorites", icon: Star, label: "收藏" },
  { to: "/compare", icon: BarChart3, label: "对比" },
  { to: "/profile", icon: User, label: "我的" },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center overscroll-y-contain" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <Toast />
      {/* Main content area */}
      <div className="w-full max-w-md mx-auto flex-1 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="w-full max-w-md mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border-t border-stone-100 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-14 px-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-all ${isActive ? "text-indigo-600 stroke-[2.5]" : "text-zinc-400 stroke-[1.5]"}`} />
                  <span className={`text-[9px] font-bold ${isActive ? "text-indigo-600" : "text-zinc-400"}`}>
                    {label}
                  </span>
                  <span className={`w-1 h-1 rounded-full transition-all ${isActive ? "bg-indigo-600" : "bg-transparent"}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="text-center mt-2 mb-4 text-[11px] text-zinc-500 tracking-tight leading-relaxed max-w-sm pointer-events-none pb-20">
        <p>人生试玩店 (Life Trial) | 先过一天，再做选择</p>
        <p className="text-zinc-400 font-mono mt-0.5">© 2026 Google AI Studio. Powered with Gemini 3.5 Flash.</p>
      </div>
    </div>
  );
}
