"use client";

import { motion } from "framer-motion";

export default function ManifestoSection() {
  return (
    <section className="relative bg-[#f4f1ea] py-40 md:py-56 px-10 md:px-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center"
      >
        <p className="text-[10px] tracking-[0.6em] uppercase text-black/35 mb-12">
          Collection 01
        </p>

        <h2 className="font-serif text-5xl md:text-8xl leading-[0.95] tracking-[0.12em] uppercase">
          The First
          <br />
          Wing
        </h2>

        <p className="mt-16 text-black/50 text-base md:text-lg tracking-[0.15em] uppercase">
          Seven Pieces.
          <br />
          One Beginning.
        </p>
      </motion.div>
    </section>
  );
}