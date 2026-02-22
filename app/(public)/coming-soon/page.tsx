"use client";

import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date("2026-06-01T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Launching...");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );
      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      setTimeLeft(`${days}D ${hours}H ${minutes}M`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[800px] h-[800px] bg-yellow-500/10 blur-[200px] rounded-full"></div>

      <div className="relative text-center max-w-3xl px-6">

        <p className="tracking-[0.5em] text-sm text-gray-400 mb-6">
          PARADISE ANGELS
        </p>

        <h1 className="text-6xl md:text-8xl font-bold leading-tight">
          PARADISE
          <span className="block text-yellow-400">
            ANGELS
          </span>
        </h1>

        <p className="mt-8 text-gray-300 text-lg md:text-xl">
          A Creative House of Luxury Fashion,
          Visual Identity & Angelic Expression.
        </p>

        {/* Countdown */}
        <div className="mt-10 text-2xl tracking-widest text-yellow-400 font-semibold">
          {timeLeft}
        </div>

        {/* Email Form */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 bg-transparent border border-gray-600 rounded-full focus:outline-none focus:border-yellow-400 w-72"
          />
          <button className="px-8 py-3 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition">
            Notify Me
          </button>
        </div>

      </div>
    </div>
  );
}
