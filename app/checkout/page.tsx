"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/checkout/StripeCheckoutForm";
import { useCart } from "@/app/components/cart/CartContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!clientSecret) return undefined;
    return { clientSecret };
  }, [clientSecret]);

  async function startCheckout() {
    try {
      setLoading(true);
      setError(null);

      // cart payload minimal houden
      const cartPayload = cart.map((i) => ({ id: i.id, quantity: i.quantity }));

      if (cartPayload.length === 0) {
        setError("Cart is empty");
        return;
      }

      // 1) Order maken
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "m.hmittach@gmail.com", // later: uit auth/user
          cart: cartPayload,
        }),
      });

      if (!orderRes.ok) {
        const t = await orderRes.text();
        throw new Error("Order failed: " + t);
      }

      const { order_id } = await orderRes.json();

      // 2) PaymentIntent maken
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id }),
      });

      if (!paymentRes.ok) {
        const t = await paymentRes.text();
        throw new Error("Payment failed: " + t);
      }

      const data = await paymentRes.json();

      if (!data.client_secret) {
        throw new Error("Missing client_secret from /api/payments");
      }

      setClientSecret(data.client_secret);
    } catch (err: any) {
      setError(err.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-6">Secure Checkout</h1>

      {!clientSecret ? (
        <>
          <button
            onClick={startCheckout}
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-3 rounded hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Continue to payment"}
          </button>

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <StripeCheckoutForm />
        </Elements>
      )}
    </div>
  );
}
