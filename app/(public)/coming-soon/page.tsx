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
    <div className="min-h-screen bg-[#f4f1ea] text-black flex items-center justify-center px-8">

      <div className="w-full max-w-5xl text-center">

        <p className="text-xs tracking-[0.6em] text-neutral-500 mb-16">
          A NEW ERA IS COMING
        </p>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <svg
        viewBox="0 0 800 400"
        className="w-[900px] opacity-[0.06]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
         >
         <path
         d="M50 200 C150 50, 250 50, 350 200 C250 150,150 150,50 200 Z"
         fill="#9f9f9f"
         />
         <path
         d="M750 200 C650 50, 550 50, 450 200 C550 150,650 150,750 200 Z"
         fill="#9f9f9f"
         />
         </svg>
         </div>

        <h1 className="font-serif text-[110px] md:text-[160px] leading-[0.85] tracking-tight">
          <span className="block">PARADISE</span>
          <span className="block text-[#c6a85a]">
            ANGELS
          </span>
        </h1>

        <p className="mt-16 text-neutral-600 text-lg max-w-xl mx-auto leading-relaxed">
          A divine house of luxury fashion and visual identity.
          Crafted with intention. Designed for presence.
        </p>

        <div className="mt-20 border-t border-neutral-300 w-32 mx-auto"></div>

        {!submitted ? (
          <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-6">

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b border-black px-4 py-3 w-72 focus:outline-none text-center tracking-wide"
            />

            <button
              onClick={handleSubmit}
              className="uppercase tracking-widest text-sm hover:opacity-60 transition"
            >
              Request Private Access
            </button>

          </div>
        ) : (
          <p className="mt-14 text-neutral-700 tracking-wide">
            You are now part of the inner circle.
          </p>
        )}

      </div>
    </div>
  );
}
