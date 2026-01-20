"use client";

import { motion } from "framer-motion";
import MainNav from "./MainNav";

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-black/80 border-l border-white/10 p-6"
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-semibold">Menú</span>
          <button onClick={onClose} className="p-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                d="M6 6l12 12M18 6l12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <MainNav isMobile onSelect={onClose} />
      </motion.div>
    </motion.div>
  );
}
