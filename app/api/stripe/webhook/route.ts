import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

function getSigningSecret() {
  // Op Vercel wil je de Dashboard/Webhook secret gebruiken
  if (process.env.VERCEL) {
    return (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
  }

  // Lokaal: als je stripe listen gebruikt -> CLI secret, anders fallback
  return (
    (process.env.STRIPE_WEBHOOK_SECRET || "").trim() ||
    (process.env.STRIPE_WEBHOOK_SECRET || "").trim()
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

  const secret = getSigningSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "Missing webhook signing secret env var" },
      { status: 500 }
    );
  }

  // ✅ BELANGRIJK: raw bytes, niet text()
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;''
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  try {return NextResponse.json({ ok: true, marker: "WEBHOOK_V2_ARRAYBUFFER" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${err?.message || "unknown"}` },
      { status: 400 }
    );
  }

  // hier later je order update doen op basis van event.type
  return NextResponse.json({ received: true }, { status: 200 });
}
