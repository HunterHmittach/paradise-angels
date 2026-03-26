"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="bg-[#f4f3ef] text-black">

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex items-center px-10 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl"
        >
          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.25em] uppercase leading-tight">
            Paradise Angels
          </h1>

          <p className="mt-12 text-lg md:text-xl max-w-2xl text-black/70 leading-relaxed">
            A house of elevated expression.  
            Where fashion meets symbolism,  
            and design becomes identity.
          </p>
        </motion.div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="relative py-40 px-10 md:px-24 border-t border-black/10">

        {/* Vertical timeline line */}
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black/10 -translate-x-1/2 hidden md:block" />

        <div className="max-w-6xl mx-auto">

          <h2 className="font-serif text-5xl tracking-[0.25em] uppercase mb-28 text-center">
            The Journey
          </h2>

          <div className="space-y-32">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="md:w-1/2"
            >
              <h3 className="text-xl font-serif mb-6">Vision</h3>
              <p className="text-black/70">
                Paradise Angels was born from the belief that luxury should
                feel symbolic, emotional and timeless.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="md:w-1/2 md:ml-auto text-right"
            >
              <h3 className="text-xl font-serif mb-6">Creation</h3>
              <p className="text-black/70">
                Each collection blends craftsmanship, modern elegance and
                intentional design into wearable statements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="md:w-1/2"
            >
              <h3 className="text-xl font-serif mb-6">Evolution</h3>
              <p className="text-black/70">
                Through drops, collaborations and creative storytelling,
                Paradise Angels continues to grow into a refined identity.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="py-40 px-10 md:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl tracking-[0.25em] uppercase mb-16">
            Philosophy
          </h2>

          <p className="text-lg text-black/70 leading-relaxed">
            Luxury is not loud.  
            It is precise. Intentional. Refined.  
            Paradise Angels represents identity through elevated design.
          </p>
        </div>
      </section>

      {/* ================= SOCIAL ================= */}
      <section className="py-40 px-10 md:px-24 border-t border-black/10">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="font-serif text-5xl tracking-[0.25em] uppercase mb-20">
            Connect
          </h2>

          <div className="flex justify-center gap-16 text-lg tracking-[0.2em] uppercase">

            <a
              href="#"
              className="relative group"
            >
              Instagram
              <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-black transition-all duration-500 group-hover:w-full" />
            </a>

            <a
              href="#"
              className="relative group"
            >
              TikTok
              <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-black transition-all duration-500 group-hover:w-full" />
            </a>

            <a
              href="#"
              className="relative group"
            >
              Pinterest
              <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-black transition-all duration-500 group-hover:w-full" />
            </a>

          </div>

        </div>
      </section>

      {/* ================= CLOSING STATEMENT ================= */}
      <section className="py-32 px-10 md:px-24 text-center bg-[#f4f3ef]">
        <h3 className="font-serif text-3xl tracking-[0.2em] uppercase">
          Elevating Identity Through Design
        </h3>
      </section>

    </main>
  );
}