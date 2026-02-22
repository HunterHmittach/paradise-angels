"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) {
      setMessage("Stripe is not ready yet.");
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // hierna redirect Stripe automatisch naar deze page
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    // Alleen errors die meteen gebeuren (validatie etc.)
    if (error) {
      setMessage(error.message ?? "Payment failed");
      setLoading(false);
      return;
    }

    // Bij success redirect Stripe naar return_url
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <PaymentElement />
      <button
        disabled={!stripe || !elements || loading}
        className="w-full bg-yellow-500 text-black py-3 rounded hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
      {message && <p className="text-red-400">{message}</p>}
    </form>
  );
}
