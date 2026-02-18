import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseAdmin from "@/lib/supabase-admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

function getWebhookSecret() {
  // Op Vercel moet je de Stripe Dashboard "Signing secret" gebruiken
  if (process.env.VERCEL) return process.env.STRIPE_WEBHOOK_SECRET;

  // Lokaal (stripe listen) gebruikt een andere whsec_
  return (
    process.env.STRIPE_CLI_WEBHOOK_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const secret = getWebhookSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Missing webhook secret env var" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // ✅ Update order status bij succesvolle betaling
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;

      const paymentIntentId = pi.id;

      // Pas aan als jouw kolom anders heet:
      // bv: stripe_payment_intent_id / payment_intent_id
      const { error } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("stripe_payment_intent_id", paymentIntentId);

      if (error) {
        // Log maar geef wel 200 terug zodat Stripe niet blijft retry’en
        console.error("Supabase update error:", error);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: any) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
