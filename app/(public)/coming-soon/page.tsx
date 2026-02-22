"use client";

import { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fdfcf8] via-[#f5f2ea] to-[#efebe1] overflow-hidden flex items-center justify-center">

      {/* Soft angelic glow */}
      <div className="absolute w-[1000px] h-[1000px] bg-yellow-300/20 blur-[220px] rounded-full"></div>

      {/* Light gold dust */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] bg-yellow-500 rounded-full opacity-40 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center px-8 w-full max-w-6xl">

        <p className="tracking-[0.6em] text-xs text-gray-500 mb-10">
          A NEW ERA IS COMING
        </p>

        <h1 className="text-7xl md:text-[140px] font-bold leading-[0.9]">
          <span className="block text-black">
            PARADISE
          </span>

          <span className="block bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
            ANGELS
          </span>
        </h1>

        <p className="mt-12 text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          A divine house of luxury fashion and visual identity.
          Crafted with precision. Designed for transcendence.
        </p>

        <div className="mt-14 w-40 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>

        {!submitted ? (
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-5">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-8 py-4 bg-white/80 backdrop-blur-lg border border-gray-300 rounded-full focus:outline-none focus:border-yellow-500 w-80 shadow-lg"
            />
            <button
              onClick={handleSubmit}
              className="px-10 py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-white rounded-full font-semibold hover:scale-105 transition-all shadow-xl"
            >
              Join the Private List
            </button>
          </div>
        ) : (
          <p className="mt-10 text-green-600 font-medium">
            You are now part of the inner circle.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-200px); opacity: 0; }
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
