"use client";

import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f8f7f4] text-black overflow-hidden flex items-center justify-center">

      {/* Soft gold aura */}
      <div className="absolute w-[900px] h-[900px] bg-yellow-400/10 blur-[200px] rounded-full"></div>

      {/* Light radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.08)_0%,_transparent_60%)]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[3px] h-[3px] bg-yellow-400 rounded-full opacity-40 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative text-center px-6 max-w-4xl transition-all duration-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Top label */}
        <p className="tracking-[0.5em] text-xs text-gray-500 mb-8">
          A NEW ERA IS COMING
        </p>

        {/* Main title */}
        <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
          <span className="block">
            PARADISE
          </span>

          <span className="block bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            ANGELS
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-10 text-gray-600 text-lg md:text-xl leading-relaxed">
          A divine house of luxury fashion and visual identity.
          Crafted with precision. Designed for transcendence.
        </p>

        {/* Divider */}
        <div className="mt-14 w-32 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>

        {/* Coming soon */}
        <p className="mt-6 text-gray-500 tracking-widest text-sm">
          COMING SOON
        </p>

        {/* Elegant waitlist */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-full focus:outline-none focus:border-yellow-500 w-80"
          />
          <button className="px-8 py-3 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition">
            Join the Private List
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-150px); opacity: 0; }
        }
        .animate-float {
          animation-name: float;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>

    </div>
  );
}
