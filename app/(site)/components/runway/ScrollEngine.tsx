"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { ReactNode, useRef } from "react";

export default function ScrollEngine({ children }: { children: ReactNode }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8, 1],
    ["#0f0f10", "#1a1a1c", "#eae6df", "#f3efe8"]
  );

  return (
    <motion.div
      ref={ref}
      style={{ background }}
      className="min-h-[300vh] transition-colors duration-700"
    >
      {children}
    </motion.div>
  );
}