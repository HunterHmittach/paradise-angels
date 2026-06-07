"use client";

import { useEffect, useState } from "react";

export default function HeroEngine() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = Math.min(scroll / 760, 1);

  return (
    <section className="relative h-[220vh] bg-[#f4f3ef] text-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* soft atmosphere */}
        <div
          className="absolute inset-0 transition duration-700"
          style={{
            background: `radial-gradient(circle at center, rgba(0,0,0,${
              0.05 + progress * 0.1
            }) 0%, rgba(244,243,239,1) 58%)`,
          }}
        />

        {/* huge background word */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: 0.035 + progress * 0.04,
            transform: `scale(${1.15 - progress * 0.22})`,
          }}
        >
          <h2 className="font-serif text-[18vw] tracking-[0.18em] uppercase whitespace-nowrap">
            Unmatched
          </h2>
        </div>

        {/* vertical runway line */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-black/10" />

        <div
          className="absolute left-1/2 top-1/2 w-px bg-black origin-center"
          style={{
            height: `${18 + progress * 58}vh`,
            opacity: 0.25 + progress * 0.45,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* left label */}
        <div
          className="absolute left-8 md:left-20 top-1/2 -translate-y-1/2 hidden md:block"
          style={{
            opacity: 1 - progress * 0.55,
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.55em] text-black/35 rotate-[-90deg]">
            Amsterdam Based
          </p>
        </div>

        {/* right label */}
        <div
          className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 hidden md:block"
          style={{
            opacity: 1 - progress * 0.55,
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.55em] text-black/35 rotate-90">
            Worldwide Vision
          </p>
        </div>

        {/* intro word */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: Math.max(0, 1 - progress * 1.8),
            transform: `translateY(${-progress * 40}px) scale(${
              1 - progress * 0.08
            })`,
          }}
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.7em] text-black/70">
            UNMATCHED
          </p>
        </div>

        {/* main reveal */}
        <div
          className="absolute inset-0 flex items-center justify-center px-8"
          style={{
            opacity: Math.max(0, (progress - 0.22) * 1.45),
            transform: `translateY(${(1 - progress) * 80}px)`,
          }}
        >
          <div className="text-center">
            <p className="mb-10 text-[10px] uppercase tracking-[0.65em] text-black/40">
              Paradise Angels
            </p>

            <h1 className="font-serif uppercase leading-[0.88] tracking-[0.16em] text-[17vw] md:text-[11vw]">
              Paradise
              <br />
              Angels
            </h1>

            <p className="mx-auto mt-12 max-w-xl text-sm md:text-base leading-loose text-black/55">
              Built for silence, presence and the ones who move different.
            </p>
          </div>
        </div>

        {/* bottom scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{
            opacity: Math.max(0, 1 - progress * 2),
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-black/35">
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}