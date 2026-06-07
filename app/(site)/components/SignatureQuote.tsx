"use client";

import { motion } from "framer-motion";

export default function SignatureQuote() {
  return (
    <section className="bg-black text-white py-52 px-10 md:px-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
        viewport={{ once: true }}
        className="max-w-6xl"
      >
        <p className="text-[10px] tracking-[0.6em] uppercase text-white/35 mb-12">
          Collection 01
        </p>

        <h2 className="font-serif text-5xl md:text-8xl leading-[1] tracking-[0.12em] uppercase">
          The First
          <br />
          Wing
        </h2>

        <p className="mt-14 text-white/45 text-sm tracking-[0.35em] uppercase">
          Paradise Angels
        </p>
      </motion.div>
    </section>
  );
}