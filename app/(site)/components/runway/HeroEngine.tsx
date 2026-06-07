"use client";

import { motion } from "framer-motion";

export default function HeroEngine() {
  return (
    <section className="relative min-h-screen bg-[#f4f1ea] text-black flex items-center justify-center px-6 overflow-hidden">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_55%)]"
      />

      <motion.div
        initial={{ height: "0%" }}
        animate={{ height: "62%" }}
        transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-black/15"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center uppercase"
      >
        <p className="text-[10px] md:text-xs tracking-[0.7em] text-black/40 mb-10">
          Collection 01
        </p>

        <h1 className="font-serif text-5xl md:text-8xl leading-[0.9] tracking-[0.12em] text-black/80">
          Paradise
          <br />
          Angels
        </h1>

        <p className="mt-12 text-[10px] md:text-xs tracking-[0.6em] text-black/45">
          The First Wing
        </p>
      </motion.div>
    </section>
  );
}