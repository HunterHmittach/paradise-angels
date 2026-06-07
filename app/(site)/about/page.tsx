"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[#f4f1ea] text-black overflow-hidden">
      <section className="relative min-h-screen bg-black text-[#f4f1ea] px-8 md:px-20 pt-44 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_38%)]" />

        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.65em] text-white/35">
            Paradise Angels
          </p>

          <h1 className="mt-12 font-serif uppercase leading-[0.82] tracking-[0.16em] text-[18vw] md:text-[13vw]">
            Angels
            <br />
            Move
            <br />
            Silent
          </h1>
        </div>

        <div className="absolute right-8 md:right-20 bottom-16 max-w-md">
          <p className="text-white/55 leading-[2] text-sm md:text-base">
            A world built around silence, presence and the feeling of being
            impossible to ignore.
          </p>
        </div>
      </section>

      <section className="grid lg:grid-cols-[42%_58%] min-h-screen">
        <div className="px-8 md:px-20 py-28 flex items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.55em] text-black/35">
              Philosophy
            </p>

            <h2 className="mt-10 font-serif uppercase leading-[0.9] tracking-[0.13em] text-6xl md:text-8xl">
              Presence
              <br />
              Before
              <br />
              Noise
            </h2>

            <p className="mt-14 max-w-md text-black/55 leading-[2]">
              Paradise Angels is not designed to shout. It is designed to stay
              in the room after you leave it.
            </p>
          </div>
        </div>

        <div className="relative min-h-screen bg-[#dfd8cc] overflow-hidden">
          <img
            src="/about-image.png"
            alt="Paradise Angels"
            className="absolute inset-0 h-full w-full object-cover scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          <p className="absolute bottom-10 left-10 text-[10px] uppercase tracking-[0.6em] text-white/60">
            Amsterdam / Worldwide
          </p>
        </div>
      </section>

      <section className="relative px-8 md:px-20 py-40 bg-[#f4f1ea]">
        <p className="absolute left-1/2 top-20 -translate-x-1/2 font-serif uppercase tracking-[0.22em] text-[16vw] text-black/[0.035] whitespace-nowrap">
          Unmatched
        </p>

        <div className="relative z-10 grid md:grid-cols-3 gap-14">
          {[
            ["01", "Silence", "Luxury is not loud. It is controlled."],
            ["02", "Identity", "Every piece carries a visual language."],
            ["03", "Emotion", "The brand is felt before it is explained."],
          ].map((item) => (
            <div key={item[0]} className="border-t border-black/10 pt-10">
              <p className="font-serif text-5xl tracking-[0.2em]">{item[0]}</p>

              <h3 className="mt-10 font-serif uppercase tracking-[0.16em] text-3xl">
                {item[1]}
              </h3>

              <p className="mt-8 text-black/55 leading-[2]">{item[2]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-[#f4f1ea] px-8 md:px-20 py-44">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.65em] text-white/35">
            Manifesto
          </p>

          <h2 className="mt-12 font-serif uppercase leading-[0.92] tracking-[0.14em] text-6xl md:text-[9vw]">
            Not worn.
            <br />
            Revealed.
          </h2>

          <div className="mt-20 grid md:grid-cols-2 gap-20">
            <p className="text-white/55 leading-[2.2] text-lg">
              Paradise Angels exists between fashion and atmosphere. A symbol
              for people who move with intention, restraint and quiet power.
            </p>

            <p className="text-white/55 leading-[2.2] text-lg">
              It is not about excess. It is about the moment something simple
              becomes unforgettable.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-block mt-24 border border-white/30 px-12 py-5 text-xs uppercase tracking-[0.4em] text-white/70 hover:bg-white hover:text-black transition duration-700"
          >
            Enter The Collection
          </Link>
        </div>
      </section>
    </main>
  );
}