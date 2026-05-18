"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string | null;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const continueToPayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || data?.details || "Checkout API failed");
        return;
      }

      if (!data.url) {
        alert("API werkt, maar geeft geen checkout URL terug.");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      alert("Frontend error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-10 md:px-24 pt-40 pb-28">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-5xl tracking-[0.25em] uppercase">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="mt-20">
            <p className="text-black/60 tracking-[0.2em] uppercase text-sm">
              Your cart is empty.
            </p>

            <Link
              href="/shop"
              className="inline-block mt-10 border border-black px-10 py-4 uppercase tracking-[0.25em] text-xs hover:bg-black hover:text-white transition"
            >
              Back to Shop
            </Link>
          </div>
        ) : (
          <div className="mt-20 grid md:grid-cols-2 gap-20">
            <section className="space-y-8">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${index}`}
                  className="flex gap-6 border-b border-black/10 pb-8"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-36 object-cover bg-[#e9e7df]"
                  />

                  <div>
                    <h2 className="font-serif text-xl tracking-[0.18em] uppercase">
                      {item.name}
                    </h2>

                    {item.size && (
                      <p className="mt-3 text-sm text-black/50 tracking-[0.2em] uppercase">
                        Size: {item.size}
                      </p>
                    )}

                    <p className="mt-3 text-sm text-black/50 tracking-[0.2em] uppercase">
                      Qty: {item.quantity}
                    </p>

                    <p className="mt-4 tracking-[0.15em]">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <section className="border border-black/10 p-10 h-fit">
              <h2 className="font-serif text-2xl tracking-[0.2em] uppercase">
                Order Summary
              </h2>

              <div className="mt-10 flex justify-between border-b border-black/10 pb-6">
                <span className="text-black/60">Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <div className="mt-6 flex justify-between border-b border-black/10 pb-6">
                <span className="text-black/60">Shipping</span>
                <span>Calculated later</span>
              </div>

              <div className="mt-8 flex justify-between text-xl">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <button
                onClick={continueToPayment}
                disabled={loading}
                className="mt-10 w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-xs hover:bg-black/80 transition disabled:opacity-50"
              >
                {loading ? "Starting Payment..." : "Continue to Payment"}
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}