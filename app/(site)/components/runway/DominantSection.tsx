"use client";

import { motion } from "framer-motion";

export default function DominantSection() {
  return (
    <section className="min-h-screen flex items-center px-10 md:px-24 text-black bg-[#f3efe8]">

      <motion.div
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="max-w-4xl"
      >
        <h2 className="font-serif text-[60px] md:text-[120px] leading-[0.95]">
          BUILT <br /> UNDER <br /> PRESSURE
        </h2>

        <p className="mt-10 text-neutral-600 max-w-md">
          Discipline defines form.  
          Pressure defines brilliance.
        </p>
      </motion.div>

    </section>
  );
}