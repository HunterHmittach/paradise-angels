"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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
  const [customerEmail, setCustomerEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : []);
    setCartLoaded(true);

    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (data.user?.email) {
        setCustomerEmail(data.user.email);
      }
    }

    loadUser();
  }, []);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
  }, [cart]);

  const startEmbeddedPayment = async () => {
    setLoading(true);

    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user || !user.email) {
        alert("Please login before checkout.");
        window.location.href = "/login";
        return;
      }

      if (!cart.length) {
        alert("Your cart is empty.");
        return;
      }

      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customerEmail: user.email,
          userId: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.error || result?.details || "Checkout API failed");
        return;
      }

      if (!result.clientSecret) {
        alert("Checkout created, but no client secret returned.");
        return;
      }

      setCustomerEmail(user.email);
      setClientSecret(result.clientSecret);
      setOrderId(result.order_id || null);
    } catch (error) {
      alert("Checkout error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSecret = useCallback(async () => {
    return clientSecret;
  }, [clientSecret]);

  const embeddedOptions = useMemo(() => {
    return {
      fetchClientSecret,
      onComplete: () => {
        if (orderId) {
          window.location.href = `/checkout/success?order=${orderId}`;
        } else {
          window.location.href = "/checkout/success";
        }
      },
    };
  }, [fetchClientSecret, orderId]);

  if (!cartLoaded) {
    return (
      <main className="min-h-screen bg-[#f4f3ef] text-black flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.5em] text-black/40">
          Loading Checkout
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-black px-8 md:px-20 pt-36 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-black/40">
              Paradise Angels
            </p>

            <h1 className="mt-8 font-serif text-5xl md:text-7xl tracking-[0.25em] uppercase">
              Checkout
            </h1>

            {customerEmail && (
              <p className="mt-8 text-sm text-black/50">
                Signed in as {customerEmail}
              </p>
            )}
          </div>

          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.35em] text-black/40 hover:text-black transition"
          >
            Back to Shop
          </Link>
        </div>

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
          <div className="mt-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-16">
            <section>
              <div className="border border-black/10 bg-white/35">
                <div className="px-8 py-6 border-b border-black/10">
                  <h2 className="font-serif text-2xl tracking-[0.2em] uppercase">
                    Order
                  </h2>
                </div>

                <div className="divide-y divide-black/10">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size}-${index}`}
                      className="flex gap-6 p-8"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-36 object-cover bg-[#e9e7df]"
                      />

                      <div className="flex-1">
                        <h3 className="font-serif text-xl tracking-[0.18em] uppercase">
                          {item.name}
                        </h3>

                        {item.size && (
                          <p className="mt-3 text-sm text-black/50 tracking-[0.2em] uppercase">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-3 text-sm text-black/50 tracking-[0.2em] uppercase">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-4 tracking-[0.15em]">
                          €
                          {(Number(item.price) * Number(item.quantity)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border border-black/10 bg-white/35 p-8">
                <h2 className="font-serif text-2xl tracking-[0.2em] uppercase">
                  Summary
                </h2>

                <div className="mt-8 flex justify-between border-b border-black/10 pb-5">
                  <span className="text-black/60">Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>

                <div className="mt-5 flex justify-between border-b border-black/10 pb-5">
                  <span className="text-black/60">Shipping</span>
                  <span>Calculated later</span>
                </div>

                <div className="mt-7 flex justify-between text-xl">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>

                {!clientSecret && (
                  <button
                    onClick={startEmbeddedPayment}
                    disabled={loading}
                    className="mt-10 w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-xs hover:bg-black/80 transition disabled:opacity-50"
                  >
                    {loading ? "Preparing Payment..." : "Start Secure Payment"}
                  </button>
                )}
              </div>
            </section>

            <section className="border border-black/10 bg-white p-4 md:p-8 min-h-[680px]">
              {!clientSecret ? (
                <div className="h-full min-h-[620px] flex items-center justify-center text-center px-8">
                  <div>
                    <p className="font-serif text-3xl tracking-[0.2em] uppercase">
                      Secure Payment
                    </p>

                    <p className="mt-6 text-black/50 leading-relaxed max-w-md">
                      Start payment to open the secure checkout form directly
                      here, inside Paradise Angels.
                    </p>
                  </div>
                </div>
              ) : (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={embeddedOptions}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}