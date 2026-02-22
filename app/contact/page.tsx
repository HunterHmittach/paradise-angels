"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const json = await res.json();

    if (json.success) {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-yellow-300 mb-4 tracking-wide">
        Contact Paradise Angels
      </h1>

      <p className="text-gray-300 text-lg max-w-2xl text-center mb-12">
        Have a question? Collaboration request? Or business inquiry?
        Send us a message — we’ll respond within 24 hours.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-zinc-900 p-8 rounded-xl border border-zinc-700 shadow-xl space-y-6"
      >
        {/* NAME */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-black border border-zinc-700 text-white focus:border-yellow-300 outline-none"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Your Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-black border border-zinc-700 text-white focus:border-yellow-300 outline-none"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Message</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-md bg-black border border-zinc-700 text-white focus:border-yellow-300 outline-none resize-none"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 text-black font-semibold bg-yellow-300 rounded-full hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {/* STATUS MESSAGES */}
        {status === "success" && (
          <p className="text-green-400 text-center font-medium">
            ✓ Message sent successfully!
          </p>
        )}

        {status === "error" && (
          <p className="text-red-400 text-center font-medium">
            ✗ Something went wrong. Try again later.
          </p>
        )}
      </form>
    </main>
  );
}
