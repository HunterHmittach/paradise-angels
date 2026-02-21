import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseAdmin from "@/lib/supabase-admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET env var" }, { status: 500 });
  }

  // ✅ RAW body (niet req.text())
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret.trim());
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature failed: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;

      const orderIdRaw = pi.metadata?.order_id;
      const orderId = orderIdRaw ? Number(orderIdRaw) : NaN;

      if (!orderIdRaw || Number.isNaN(orderId)) {
        // Geen order_id -> niks te updaten, maar wel 200 terug naar Stripe
        return NextResponse.json({ received: true, note: "No order_id in metadata" }, { status: 200 });
      }

      const { error } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          payment_intent_id: pi.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        // Return 500 => Stripe zal retry’en
        return NextResponse.json({ error: `Supabase update failed: ${error.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: any) {
    // Ook hier 500 zodat Stripe retry doet
    return NextResponse.json({ error: e?.message ?? "Webhook handler failed" }, { status: 500 });
  }
}
