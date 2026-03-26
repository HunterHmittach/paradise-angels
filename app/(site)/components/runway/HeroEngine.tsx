"use client";

import { useEffect, useState } from "react";

export default function HeroEngine() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const value = window.scrollY;
      setScroll(value);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = Math.min(scroll / 600, 1);

  return (
    <section className="relative h-[200vh] bg-[#f4f3ef] text-black">
      {/* Sticky Hero */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* Vertical Axis Line */}
        <div
          className="absolute bg-black transition-all duration-500"
          style={{
            width: "1px",
            height: `${40 + progress * 60}%`,
            opacity: 0.5 + progress * 0.5,
          }}
        />

        {/* UNMATCHED */}
        <div
          className="absolute text-sm tracking-[0.4em] font-light transition-all duration-500"
          style={{
            opacity: 1 - progress,
            transform: `scale(${1 - progress * 0.2})`,
          }}
        >
          UNMATCHED
        </div>

        {/* PARADISE ANGELS Reveal */}
        <div
          className="text-center font-serif tracking-[0.12em] transition-all duration-700"
          style={{
            opacity: progress,
            transform: `translateY(${(1 - progress) * 40}px)`,
          }}
        >
          <div className="text-5xl md:text-7xl">PARADISE</div>
          <div className="text-5xl md:text-7xl mt-4">ANGELS</div>
        </div>

      </div>
    </section>
  );
}