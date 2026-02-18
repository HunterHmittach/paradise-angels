import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

function getWebhookSecret() {
  // Op Vercel wil je de Stripe Dashboard webhook secret gebruiken
  if (process.env.VERCEL) return process.env.STRIPE_WEBHOOK_SECRET;

  // Lokaal (stripe listen) wil je de CLI secret gebruiken
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

  // ✅ BELANGRIJK: raw bytes gebruiken (niet req.text())
  const buf = Buffer.from(await req.arrayBuffer());

  try {
    stripe.webhooks.constructEvent(buf, sig, secret.trim());
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${err?.message || "unknown"}` },
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
