"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <main className="relative bg-[#f4f3ef] text-black overflow-hidden grain">

      {/* ===== FLOATING LIGHT ===== */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-to-r from-amber-200 via-amber-100 to-transparent rounded-full blur-[180px] opacity-40"
      />

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-[70vh] flex items-center px-10 md:px-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl"
        >
          <h1 className="font-serif text-6xl md:text-8xl tracking-[0.25em] uppercase leading-tight">
            Get in Touch
          </h1>

          <p className="mt-12 text-xl text-black/60 max-w-2xl leading-relaxed">
            For collaborations, private appointments or creative partnerships,
            connect with the Paradise Angels house.
          </p>
        </motion.div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="relative z-10 py-40 px-10 md:px-24 border-t border-black/10">

        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black/10 -translate-x-1/2 hidden md:block" />

        <div className="grid md:grid-cols-2 gap-24 max-w-6xl mx-auto">

          {/* LEFT */}
          <div>
            <h2 className="font-serif text-4xl tracking-[0.2em] uppercase mb-16">
              Direct Contact
            </h2>

            <div className="space-y-10 text-lg text-black/70">
              <div>
                <p className="uppercase tracking-[0.2em] text-sm mb-3">Email</p>
                <p>contact@paradiseangels.com</p>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] text-sm mb-3">Location</p>
                <p>Amsterdam, The Netherlands</p>
              </div>

              <div>
                <p className="uppercase tracking-[0.2em] text-sm mb-3">Studio</p>
                <p>Private by appointment only</p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <form className="space-y-14">

            <div>
              <label className="block text-sm tracking-[0.2em] uppercase mb-4">
                Name
              </label>
              <input
                type="text"
                className="w-full border-b border-black/30 bg-transparent py-4 outline-none focus:border-black transition-all duration-500"
              />
            </div>

            <div>
              <label className="block text-sm tracking-[0.2em] uppercase mb-4">
                Email
              </label>
              <input
                type="email"
                className="w-full border-b border-black/30 bg-transparent py-4 outline-none focus:border-black transition-all duration-500"
              />
            </div>

            <div>
              <label className="block text-sm tracking-[0.2em] uppercase mb-4">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full border-b border-black/30 bg-transparent py-4 outline-none focus:border-black transition-all duration-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="relative mt-10 uppercase tracking-[0.25em] text-sm border border-black px-12 py-5 overflow-hidden group"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                Send Message
              </span>
              <span className="absolute inset-0 bg-black scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </button>

          </form>

        </div>
      </section>

      {/* ===== SOCIAL ===== */}
      <section className="relative z-10 py-40 px-10 md:px-24 border-t border-black/10 text-center">
        <h3 className="font-serif text-4xl tracking-[0.2em] uppercase mb-20">
          Follow Us
        </h3>

        <div className="flex justify-center gap-20 text-lg tracking-[0.25em] uppercase">
          <a href="#" className="hover:opacity-60 transition">Instagram</a>
          <a href="#" className="hover:opacity-60 transition">TikTok</a>
          <a href="#" className="hover:opacity-60 transition">Pinterest</a>
        </div>
      </section>

      {/* ===== FOOTER STATEMENT ===== */}
      <section className="relative z-10 py-28 text-center">
        <h4 className="font-serif text-2xl tracking-[0.2em] uppercase text-black/70">
          Amsterdam Based — Worldwide Vision
        </h4>
      </section>

    </main>
  );
}