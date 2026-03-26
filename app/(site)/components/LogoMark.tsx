"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LogoMark() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <motion.div
        layout
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer select-none"
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 font-serif text-lg"
            >
              <span>P</span>
              <span className="h-4 w-[1px] bg-current opacity-70" />
              <span>A</span>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-lg tracking-wide"
            >
              PARADISE ANGELS
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}