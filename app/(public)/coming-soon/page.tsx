"use client";

import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">

      {/* Divine gold aura */}
      <div className="absolute w-[900px] h-[900px] bg-gradient-to-r from-yellow-400/20 via-yellow-200/10 to-yellow-400/20 blur-[220px] rounded-full animate-pulse"></div>

      {/* Subtle wing lines */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:40px_40px]"></div>

      <div className={`relative text-center px-6 transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

        {/* Small label */}
        <p className="tracking-[0.6em] text-xs text-gray-400 mb-8">
          A NEW ERA IS COMING
        </p>

        {/* Main Name */}
        <h1 className="text-7xl md:text-9xl font-bold leading-none">
          <span className="block text-white">
            PARADISE
          </span>

          <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            ANGELS
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-8 max-w-xl mx-auto text-gray-400 text-lg leading-relaxed">
          A divine house of luxury fashion and visual identity.
          Crafted for presence. Designed for transcendence.
        </p>

        {/* Divider */}
        <div className="mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>

        {/* Coming text */}
        <p className="mt-6 text-gray-500 tracking-widest text-sm">
          COMING SOON
        </p>

      </div>
    </div>
  );
}
