import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabaseAdmin from "@/lib/supabase-admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature failed: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;

      const newStatus = event.type === "payment_intent.succeeded" ? "paid" : "failed";

      // 1) Update op payment_intent (beste, want dat heb je in je URL)
      const byPi = await supabaseAdmin
        .from("orders")
        .update({ status: newStatus })
        .eq("payment_intent", pi.id);

      // 2) Extra: als metadata.order_id wél bestaat, ook op id updaten
      const orderId = pi.metadata?.order_id;
      if (orderId) {
        const { data, error } = await supabaseAdmin
       .from("orders")
       .update({ status: "paid" })
       .eq("id", Number(orderId))
       .select();

       console.log("WEBHOOK orderId:", orderId);
       console.log("SUPABASE result:", data);
       console.log("SUPABASE error:", error);

      }

      // Optioneel: check errors
      if (byPi.error) {
        return NextResponse.json({ error: byPi.error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Webhook handler failed" }, { status: 500 });
  }
}
