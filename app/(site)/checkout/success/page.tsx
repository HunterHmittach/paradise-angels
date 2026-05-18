"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order");
      const sessionId = params.get("session_id");

      if (!orderId || !sessionId) {
        setError("Missing order or session id.");
        return;
      }

      try {
        const res = await fetch("/api/checkout/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            sessionId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Confirm failed.");
          return;
        }

        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cart-updated"));
        setConfirmed(true);
      } catch (err) {
        setError(String(err));
      }
    };

    confirmPayment();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.45em] uppercase text-black/40">
          Paradise Angels
        </p>

        <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase leading-tight">
          Order Confirmed
        </h1>

        <p className="mt-10 max-w-xl text-black/60 leading-relaxed">
          {confirmed
            ? "Your payment has been confirmed. Thank you for your order."
            : "Confirming your payment..."}
        </p>

        {error && (
          <p className="mt-6 max-w-xl text-red-600 text-sm">
            {error}
          </p>
        )}

        <div className="mt-16 flex flex-col md:flex-row gap-4">
          <Link
            href="/shop"
            className="border border-black px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
          >
            Back to Shop
          </Link>

          <Link
            href="/"
            className="border border-black/20 px-10 py-4 uppercase tracking-[0.25em] text-xs hover:border-black transition"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}