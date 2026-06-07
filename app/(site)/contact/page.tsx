"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSent(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send message");
        return;
      }

      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
      setSent(true);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-black">
      <section className="px-8 md:px-24 pt-44 pb-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.55em] text-black/35">
            Paradise Angels
          </p>

          <div className="mt-12 grid lg:grid-cols-[45%_55%] gap-20 items-end">
            <h1 className="font-serif uppercase tracking-[0.14em] leading-[0.9] text-6xl md:text-8xl">
              Contact
            </h1>

            <p className="max-w-xl text-black/55 leading-[2]">
              For private inquiries, customer support, collaborations and press.
              Every message is handled with care and intention.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3">
          {[
            ["Private Clients", "Order support, sizing, delivery and personal assistance."],
            ["Collaborations", "Creative direction, campaigns and selected partnerships."],
            ["Press", "Editorial requests, brand information and media inquiries."],
          ].map(([title, text]) => (
            <div
              key={title}
              className="p-8 md:p-12 border-b md:border-b-0 md:border-r last:border-r-0 border-black/10"
            >
              <p className="text-[10px] uppercase tracking-[0.45em] text-black/35">
                {title}
              </p>

              <p className="mt-10 text-black/55 leading-[2]">{text}</p>

              <p className="mt-8 text-sm tracking-[0.08em]">
                contact@paradiseangels.com
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 md:px-24 py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[36%_64%] gap-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.55em] text-black/35">
              Send A Message
            </p>

            <h2 className="mt-7 font-serif text-4xl md:text-5xl uppercase tracking-[0.18em] leading-[1.05]">
              Speak
              <br />
              With
              <br />
              Intention
            </h2>

            <p className="mt-10 max-w-sm text-black/55 leading-[2]">
              Use the form for direct contact. We usually respond within 24 —
              48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid md:grid-cols-2 gap-10">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
                className="bg-transparent border-b border-black/20 py-5 outline-none placeholder:text-black/30 focus:border-black transition"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="Email"
                className="bg-transparent border-b border-black/20 py-5 outline-none placeholder:text-black/30 focus:border-black transition"
              />
            </div>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Subject"
              className="mt-10 w-full bg-transparent border-b border-black/20 py-5 outline-none placeholder:text-black/30 focus:border-black transition"
            />

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={7}
              placeholder="Message"
              className="mt-10 w-full bg-transparent border-b border-black/20 py-5 outline-none placeholder:text-black/30 focus:border-black transition resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-12 bg-black text-white px-14 py-5 uppercase tracking-[0.35em] text-xs hover:bg-black/80 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : sent ? "Message Sent" : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}