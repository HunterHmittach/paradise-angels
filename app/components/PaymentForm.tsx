"use client";

import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const result = await stripe.confirmCardPayment(
      // Stripe krijgt dit automatisch via <Elements>
      "",
      {
        payment_method: { card },
      }
    );

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Payment successful 🎉");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <CardElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-white text-black py-3 rounded-xl font-semibold"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}
