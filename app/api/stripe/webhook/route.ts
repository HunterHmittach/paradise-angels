import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

function getWebhookSecret() {
  // Vercel heeft deze env var altijd
  const isVercel = !!process.env.VERCEL;

  // ✅ Op Vercel: gebruik Stripe Dashboard destination secret
  if (isVercel) return process.env.STRIPE_WEBHOOK_SECRET;

  // ✅ Lokaal: gebruik Stripe CLI secret (anders faalt stripe listen/trigger)
  return process.env.STRIPE_CLI_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const secret = getWebhookSecret();
  if (!secret) {
    return NextResponse.json({ error: "Missing webhook secret env var" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text(); // ✅ raw body is verplicht
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err?.message || "unknown"}` },
      { status: 400 }
    );
  }

  // ✅ Vanaf hier is signature OK
  // TODO: hier je Supabase order update doen op basis van event.type
  // bijvoorbeeld: payment_intent.succeeded -> status = 'paid'

  return NextResponse.json({ received: true }, { status: 200 });
}
