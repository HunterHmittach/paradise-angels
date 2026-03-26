"use client";

import Link from "next/link";

export default function SplitSection() {
  return (
    <section className="relative bg-[#f4f3ef] py-40">

      {/* Center line */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-black/20 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 md:px-24">

        <Link href="/new-collection" className="group block">

          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT IMAGE */}
            <div className="relative overflow-hidden">
              <img
                src="/perfume.png"
                alt="New Collection Perfumes"
                className="w-full h-auto transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative overflow-hidden">
              <img
                src="/apparel.png"
                alt="New Collection Apparel"
                className="w-full h-auto transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </div>

          </div>

          {/* Text under both */}
          <div className="mt-24 text-center">
            <h2 className="font-serif text-6xl md:text-7xl tracking-[0.28em] uppercase text-black">
              New Collection
            </h2>

            <p className="mt-8 text-xs tracking-[0.6em] uppercase text-black/60">
              Discover the Latest Drop
            </p>
          </div>

        </Link>

      </div>
    </section>
  );
}