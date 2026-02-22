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
    <div className="relative min-h-screen bg-[#f4f1ea] text-black flex items-center justify-center px-6 sm:px-10 overflow-hidden">

      {/* Subtle Wings Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 800 400"
          className="w-[120%] max-w-[1200px] opacity-[0.04]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 200 C150 50, 250 50, 350 200 C250 150,150 150,50 200 Z"
            fill="#bfb8a6"
          />
          <path
            d="M750 200 C650 50, 550 50, 450 200 C550 150,650 150,750 200 Z"
            fill="#bfb8a6"
          />
        </svg>
      </div>

      <div className="relative w-full max-w-6xl text-center">

        <p className="text-[10px] sm:text-xs tracking-[0.6em] text-neutral-500 mb-10 sm:mb-16">
          A NEW ERA IS COMING
        </p>

        <h1 className="
          font-serif 
          leading-[0.9] 
          tracking-tight
          text-[52px]
          sm:text-[80px]
          md:text-[120px]
          lg:text-[150px]
        ">
          <span className="block">PARADISE</span>
          <span className="block text-[#bfa15a]">ANGELS</span>
        </h1>

        <p className="
          mt-8 sm:mt-12 
          text-neutral-600 
          text-sm 
          sm:text-lg 
          max-w-xl 
          mx-auto 
          leading-relaxed
        ">
          A divine house of luxury fashion and visual identity.
          Crafted with intention. Designed for presence.
        </p>

        <div className="mt-12 sm:mt-20 border-t border-neutral-300 w-24 sm:w-32 mx-auto"></div>

        {!submitted ? (
          <div className="
            mt-10 sm:mt-14 
            flex flex-col 
            sm:flex-row 
            items-center 
            justify-center 
            gap-6
          ">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                bg-transparent 
                border-b 
                border-black 
                px-4 
                py-3 
                w-full 
                max-w-[260px]
                sm:max-w-[300px]
                focus:outline-none 
                text-center 
                tracking-wide
              "
            />

            <button
              onClick={handleSubmit}
              className="
                uppercase 
                tracking-widest 
                text-xs 
                sm:text-sm 
                hover:opacity-60 
                transition
              "
            >
              Request Private Access
            </button>
          </div>
        ) : (
          <p className="mt-10 text-neutral-700 tracking-wide">
            You are now part of the inner circle.
          </p>
        )}

      </div>
    </div>
  );
}
